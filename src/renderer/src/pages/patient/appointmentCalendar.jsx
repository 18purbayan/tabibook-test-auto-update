import React, {useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import '../../../node_modules/react-calendar/dist/Calendar.css';

const AppointmentCalendar = () => {
  const [date, setDate] = useState(new Date());
  const handleDateChange = newDate => {
    setDate(newDate);
  };

  return <Calendar onChange={handleDateChange} value={date} className="appointment-calender" />;
};

export default AppointmentCalendar;
