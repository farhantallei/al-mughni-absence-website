import { getAttendance } from '@app/services/schedule';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import styles from './App.module.css';
import Loader from './Loader';

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const currentDate = useMemo((): string => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(currentMonth);
    date.setFullYear(currentYear);
    return new Intl.DateTimeFormat(undefined, {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [currentMonth, currentYear]);

  const attendances = useQuery({
    queryKey: ['attendance', { year: currentYear, month: currentMonth }],
    queryFn: () => getAttendance({ year: currentYear, month: currentMonth }),
    refetchOnWindowFocus: false,
  });

  function handlePrev() {
    setCurrentMonth((prevMonth) => prevMonth - 1);
    if (currentMonth - 1 < 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    }
  }

  function handleNext() {
    setCurrentMonth((prevMonth) => prevMonth + 1);
    if (currentMonth + 1 > 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <h2>Program: Baca Kitab</h2>
        <h2>Pengajar: Nabil Muhammad</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.date}>{currentDate}</h2>
        <div className={styles.control}>
          <button onClick={handlePrev}>prev</button>
          <button onClick={handleNext}>next</button>
        </div>
      </div>
      <div className={styles.loader}>
        {attendances.isLoading ? <Loader /> : null}
      </div>
      {!attendances.isLoading && !attendances.isError ? (
        <ScheduleTable data={attendances.data} />
      ) : null}
    </div>
  );
}

function ScheduleTable({ data }: { data: Schedule[] }) {
  const dates = data.map(({ date, available }) => ({ date, available }));
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Thulab</th>
          {dates.map(({ date, available }) => (
            <th
              key={date}
              className={classNames({
                [styles.hover]:
                  date === hoveredDate &&
                  typeof available === 'boolean' &&
                  available,
                [styles.dayOff]: typeof available === 'string',
              })}>
              {date}
              {typeof available === 'string' ? (
                <span className={styles.tooltip}>{available}</span>
              ) : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data
          .reduce<
            {
              id: string;
              username: string;
              name: string;
              attendances: (string | boolean)[];
            }[]
          >((acc, { attendances }) => {
            attendances.forEach(({ id, username, name, attendance }) => {
              const index = acc.findIndex((item) => item.name === name);
              if (index === -1)
                acc.push({ id, username, name, attendances: [attendance] });
              else acc[index].attendances.push(attendance);
            });
            return acc;
          }, [])
          .map(({ username, name, attendances }) => (
            <tr key={username}>
              <td>{name}</td>
              {attendances.map((att, index) => (
                <td
                  key={dates[index].date}
                  onMouseEnter={() => setHoveredDate(dates[index].date)}
                  onMouseLeave={() => setHoveredDate(null)}>
                  <div
                    className={classNames(
                      styles.indicator,
                      typeof dates[index].available === 'boolean' &&
                        dates[index].available &&
                        (typeof att === 'string'
                          ? styles.absent
                          : att
                          ? styles.present
                          : styles.alpha)
                    )}
                  />
                  {typeof att === 'string' ? (
                    <span className={styles.tooltip}>{att}</span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default App;
