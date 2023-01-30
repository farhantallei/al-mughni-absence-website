import { makeRequest } from './makeRequest';

const prefix = 'schedule';

export function getAttendance({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  return makeRequest<Schedule[]>(
    `${prefix}/63ce7a87825b540faa254540/63d4c7e20066af9d969ed5d3?year=${year}&month=${month}`,
    { method: 'GET' }
  );
}
