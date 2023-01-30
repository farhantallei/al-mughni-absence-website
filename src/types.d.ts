type Attendance = {
  id: string;
  username: string;
  name: string;
  attendance: string | boolean;
};

type Schedule = {
  date: number;
  available: string | boolean;
  attendances: Attendance[];
};
