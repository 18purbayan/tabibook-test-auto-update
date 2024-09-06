import React, {useCallback, useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CustomCalendar.css";
import RgtArrow from "../assets/images/RgtArrowCalnder.svg";
import LftArrow from "../assets/images/LftArrowCalnder.svg";

const localizer = momentLocalizer(moment);

const CustomDateHeader = ({label, date}) => {
  // console.log(date)
  const dayName = moment(date).format("dddd").toUpperCase(); // e.g., "WEDNESDAY"
  const monthName = moment(date).format("MMMM"); // e.g., "September"
  const dayDate = moment(date).format("DD"); // e.g., "11"

  return (
    <div className="custom-date-header">
      <span className="day-name">{dayName}</span>
      <span className="month-name">{monthName}</span>
      <span className="day-date">{dayDate}</span>
    </div>
  );
};

// Define your custom 6-day week range
const customWeekRange = date => {
  const start = moment(date).startOf("week").toDate(); // Start from Sunday
  const end = moment(start).add(6, "days").toDate(); // 7-day range (Sunday to Saturday)
  console.log(start, end);
  return [start, end];
};

// Custom Toolbar Component
const CustomToolbar = toolbar => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  return (
    <div className="custom-toolbar">
      <button onClick={goToBack} className="custom-toolbarBtn lft">
        <img src={LftArrow} className="LftArrow" alt="Call" />
      </button>
      {/* <span>{moment(toolbar.date).format("MMMM YYYY")}</span> */}
      <button onClick={goToNext} className="custom-toolbarBtn rgt">
        <img src={RgtArrow} className="RgtArrow" alt="Call" />
      </button>
    </div>
  );
};

// Custom Event Display
const CustomEvent = ({event}) => <span className="custom-event">{event.title}</span>;

// Custom Time Slot Wrapper to show "-"
const CustomTimeSlotWrapper = ({children}) => {
  if (!children.props.children) {
    return <div className="custom-time-slot">-</div>;
  }
  return children;
};

const CustomCalendar = () => {
  const [showMore, setShowMore] = useState(false);
  const [calenderDate, setCalenderDate] = useState(new Date());
  const [initialLoad, setInitialLoad] = useState(true);

  const events = [
    {
      title: "11:30",
      start: new Date(2024, 7, 19, 11, 30),
      end: new Date(2024, 7, 19, 11, 45),
    },
    {
      title: "11:45",
      start: new Date(2024, 7, 19, 11, 45),
      end: new Date(2024, 7, 19, 12, 0),
    },
    {
      title: "16:15",
      start: new Date(2024, 7, 19, 16, 15),
      end: new Date(2024, 7, 19, 16, 30),
    },
    {
      title: "16:30",
      start: new Date(2024, 7, 19, 16, 30),
      end: new Date(2024, 7, 19, 16, 45),
    },
    {
      title: "10:00",
      start: new Date(2024, 7, 20, 10, 0),
      end: new Date(2024, 7, 20, 10, 15),
    },
    {
      title: "10:15",
      start: new Date(2024, 7, 20, 10, 15),
      end: new Date(2024, 7, 20, 10, 30),
    },
    {
      title: "10:30",
      start: new Date(2024, 7, 20, 10, 30),
      end: new Date(2024, 7, 20, 10, 45),
    },
    {
      title: "10:45",
      start: new Date(2024, 7, 20, 10, 45),
      end: new Date(2024, 7, 20, 11, 0),
    },
    {
      title: "11:00",
      start: new Date(2024, 7, 20, 11, 0),
      end: new Date(2024, 7, 20, 11, 15),
    },
    // Additional slots...
  ];

  const initialEvents = events.slice(0, 5); // Show only first 5 events initially

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleViewChange = view => {
    // Calculate week start and end dates based on view.date
    const start = moment(view.date).startOf("week").toDate();
    const end = moment(start).add(6, "days").toDate();

    console.log("Week start date:", start);
    console.log("Week end date:", end);
  };

  const handleNavigate = action => {
    const newDate = moment(new Date())
      .add(action === "NEXT" ? 1 : -1, "week")
      .toDate();
    console.log(newDate);
    handleViewChange({date: newDate});
    // const newDate = moment(viewDate).add(action === 'NEXT' ? 1 : -1, 'week').toDate();
    // setViewDate(newDate);
    // handleViewChange({ date: newDate });
  };

  const onNavigate = useCallback(newDate => setCalenderDate(newDate), [setCalenderDate]);

  // const onRangeChange = useCallback(range => {
  //   console.log(range);
  // }, []);

   const onRangeChange = useCallback(
    (range) => {
    console.log('first')
      if (initialLoad) {
        // Set the initial load to false after the first range change
        setInitialLoad(false);
        console.log(range);
      } else {
        console.log(range);
      }
    },
    [initialLoad]
  );

  useEffect(() => {
    // Find the initial range of the view
    const start = new Date(calenderDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 7); // Assuming weekly view, adjust as needed

    // setInitialRange({start, end});
    console.log("Initial range:", {start, end});
  }, [calenderDate]);

  return (
    <div className={`custom-calendar ${showMore ? "expanded" : ""}`}>
      <Calendar
        localizer={localizer}
        events={showMore ? events : initialEvents}
        defaultView="week"
        views={["week"]}
        step={15}
        timeslots={1}
        defaultDate={new Date()}
        min={new Date(new Date().setHours(8, 0, 0, 0))}
        max={new Date(new Date().setHours(20, 0, 0, 0))}
        style={{height: "100%"}}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          timeSlotWrapper: CustomTimeSlotWrapper,
          header: CustomDateHeader, // Custom header for date display
        }}
        onNavigate={onNavigate}
        // onNavigate={handleNavigate}
        onRangeChange={onRangeChange}
        // onRangeChange={() => customWeekRange(new Date())}
      />
      {!showMore && (
        <button className="show-more-btn" onClick={handleShowMore}>
          SEE MORE SCHEDULES
        </button>
      )}
    </div>
  );
};

export default CustomCalendar;
