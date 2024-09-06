import React, {useCallback, useEffect, useRef, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CustomCalendar.css";
import RgtArrow from "../assets/images/RgtArrowCalnder.svg";
import LftArrow from "../assets/images/LftArrowCalnder.svg";
import {toast} from "react-toastify";
import {searchAvailableDayListApi} from "../services/apiService";

import calIcon from "../assets/images/calIcon.svg";
import calIconGrey from "../assets/images/calIconGrey.svg";
import {format} from "date-fns";

const localizer = momentLocalizer(moment);

const CustomCalendar = props => {
  const calendarRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [calenderDate, setCalenderDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [doctorAvailableList, setDoctorAvailableList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedAppoinment, setBookedAppoinment] = useState();
  const [minTime, setMinTime] = useState();
  const [maxTime, setMaxTime] = useState();
  const [view, setView] = useState("week");

  const CustomDateHeader = ({label, date}) => {
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

  const CustomEvent = ({event}) => {
    const eventDate = format(event.start, "yyyy-MM-dd"); // Format date as 'YYYY-MM-DD'
    const eventTime = format(event.start, "HH:mm"); // Format time as 'HH:mm'

    const isBooked = bookedAppoinment[eventDate]?.includes(eventTime);

    const eventClass = isBooked ? "custom-event booked" : "custom-event";

    return (
      <span className={eventClass}>
        {event.title} {!isBooked ? <span className="blueDot"></span> : null}
      </span>
    );
  };

  // Custom Time Slot Wrapper to show "-"
  const CustomTimeSlotWrapper = ({children, value}) => {
    if (!children.props.children) {
      return <div className="custom-time-slot">-</div>;
    }

    return children;
  };

  // const events = [
  //   {
  //     title: "11:30",
  //     start: new Date(2024, 7, 19, 1, 0),
  //     end: new Date(2024, 7, 19, 1, 0),
  //   },
  //   {
  //     title: "11:45",
  //     start: new Date(2024, 7, 19, 11, 45),
  //     end: new Date(2024, 7, 19, 12, 0),
  //   },
  //   {
  //     title: "16:15",
  //     start: new Date(2024, 7, 19, 16, 15),
  //     end: new Date(2024, 7, 19, 16, 30),
  //   },
  //   {
  //     title: "16:30",
  //     start: new Date(2024, 7, 19, 16, 30),
  //     end: new Date(2024, 7, 19, 16, 45),
  //   },
  //   {
  //     title: "10:00",
  //     start: new Date(2024, 7, 20, 10, 0),
  //     end: new Date(2024, 7, 20, 10, 15),
  //   },
  //   {
  //     title: "10:15",
  //     start: new Date(2024, 7, 20, 10, 15),
  //     end: new Date(2024, 7, 20, 10, 30),
  //   },
  //   {
  //     title: "10:30",
  //     start: new Date(2024, 7, 20, 10, 30),
  //     end: new Date(2024, 7, 20, 10, 45),
  //   },
  //   {
  //     title: "10:45",
  //     start: new Date(2024, 7, 20, 10, 45),
  //     end: new Date(2024, 7, 20, 11, 0),
  //   },
  //   {
  //     title: "11:00",
  //     start: new Date(2024, 7, 20, 11, 0),
  //     end: new Date(2024, 7, 20, 11, 15),
  //   },
  //   // Additional slots...
  // ];

  const initialEvents = events.slice(0, 5); // Show only first 5 events initially

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleViewChange = view => {
    // Calculate week start and end dates based on view.date
    const start = moment(view.date).startOf("week").toDate();
    const end = moment(start).add(6, "days").toDate();
  };

  // Function to navigate to a specific date
  const navigateToDate = useCallback(date => {
    setViewDate(date);
    // Optionally trigger view change
    setView("day"); // Example: switch to day view when navigating to a specific date
  }, []);

  const handleNavigate = action => {
    const newDate = moment(new Date())
      .add(action === "NEXT" ? 1 : -1, "week")
      .toDate();
    handleViewChange({date: newDate});
    // const newDate = moment(viewDate).add(action === 'NEXT' ? 1 : -1, 'week').toDate();
    // setViewDate(newDate);
    // handleViewChange({ date: newDate });
  };

  const onNavigate = useCallback(newDate => {
    setCalenderDate(newDate);
  }, []);

  // const onRangeChange = useCallback(range => {
  //   console.log(range);
  // }, []);

  const onRangeChange = useCallback(range => {
    setCurrentDate(range[0]);
    let start = new Date(range[0]);
    let end = new Date(range[range.length - 1]);
    searchAvailableDayList(start, end);
  }, []);

  const searchAvailableDayList = async (startDate, endDate) => {
    try {
      const fd = new FormData();
      fd.append("doctor_id", props?.doctorId);
      fd.append("start_date", moment(new Date(startDate)).format("YYYY-MM-DD"));
      fd.append("end_date", moment(new Date(endDate)).format("YYYY-MM-DD"));
      let response = await searchAvailableDayListApi(fd);
      if (response) {
        if (response.data.res === true) {
          let tempDateObject = response.data.doctors;
          if (props?.allDocDetails?.holiday_date?.length > 0) {
            const holidayDates = new Set(props?.allDocDetails?.holiday_date?.map(h => h.date));
            tempDateObject = Object.keys(response.data.doctors)
              .filter(date => !holidayDates.has(date))
              .reduce((obj, key) => {
                obj[key] = response.data.doctors[key];
                return obj;
              }, {});
          }
          setDoctorAvailableList(tempDateObject);
          let tempArray = [];
          let earliestTime = "23:59";
          let latestTime = "00:00";

          const toDateFormat = (date, timesArray) => {
            timesArray?.map(timeItem => {
              const [year, month, day] = date.split("-").map(Number);
              const [hour, minute] = timeItem.split(":").map(Number);
              const date1 = new Date(year, month - 1, day, hour, minute);
              tempArray.push({title: timeItem, start: date1, end: date1, doctorId: props?.doctorId});
            });
          };

          Object.entries(tempDateObject).map(([key, values], index) => {
            if (values) {
              toDateFormat(key, values);
            }
          });
          setEvents(tempArray);

          try {
            const toDateFormatForMaxMin = (date, timesArray) => {
              timesArray?.forEach(timeItem => {
                if (timeItem < earliestTime) {
                  earliestTime = timeItem;
                }
                if (timeItem > latestTime) {
                  latestTime = timeItem;
                }
              });
            };

            Object.keys(tempDateObject).forEach(date => {
              toDateFormatForMaxMin(date, tempDateObject[date]);
            });

            const [earliestHour, earliestMinute] = earliestTime.split(":").map(Number);
            const [latestHour, latestMinute] = latestTime.split(":").map(Number);
            // console.log(earliestHour, earliestMinute, latestHour, latestMinute);

            // const tmpMinTime = new Date();
            // tmpMinTime.setHours(earliestHour, earliestMinute, 0, 0);
            // tmpMinTime.setHours(earliestHour, earliestMinute, 0, 0);

            // const tmpMaxTime = new Date();
            // tmpMaxTime.setHours(latestHour, latestMinute, 0, 0);
            // tmpMaxTime.setHours(latestHour, latestMinute, 0, 0);

            // setMinTime(earliestTime);
            // setMaxTime(latestTime);
            setMinTime(earliestTime);
            setMaxTime(latestTime);

            // console.log("Min Time is Valid:", minTime.getTime());
            // console.log("Max Time is Valid:",maxTime.getTime());
          } catch (error) {
            console.error("Error setting time:", error);
            setMinTime("07:00");
            setMaxTime("23:59");
          }

          const tempBookedApp = response.data.notAvailable.reduce((acc, {time, appointment_date}) => {
            if (!acc[appointment_date]) {
              acc[appointment_date] = [];
            }
            acc[appointment_date].push(time);
            return acc;
          }, {});

          // console.log("tempBookedApp", tempBookedApp);
          setBookedAppoinment(tempBookedApp);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      // toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getMinMaxTimes = schedule => {
    let minTime = null;
    let maxTime = null;

    Object.entries(schedule).forEach(([date, times]) => {
      if (Array.isArray(times) && times.length > 0) {
        times.forEach(time => {
          const [hour, minute] = time.split(":").map(Number);
          const currentDate = new Date(date);
          const dateTime = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minute));

          if (minTime === null || dateTime < minTime) {
            minTime = dateTime;
          }

          if (maxTime === null || dateTime > maxTime) {
            maxTime = dateTime;
          }
        });
      }
    });
    return {
      min: minTime,
      max: maxTime,
    };
  };

  const getNextAvailableDate = () => {
    const nextDays = props?.allDocDetails?.nextDay || [];
    const holidays = props?.allDocDetails?.holiday_date || [];

    // Convert holiday dates to a set for quick lookup
    const holidayDates = new Set(holidays.map(h => h.date));

    // Find the next available date that's not a holiday
    const availableDate = nextDays.find(day => !holidayDates.has(day.date));
    return availableDate ? new Date(availableDate.date) : null;
  };

  const handleSelectEvent = event => {
    const eventDate = format(event.start, "yyyy-MM-dd");
    const eventTime = format(event.start, "HH:mm");

    // Check if the event is booked
    const isBooked = bookedAppoinment[eventDate]?.includes(eventTime);

    if (isBooked) {
      toast.warning("Oops! This time slot is already taken. Please choose a different slot.", {autoClose: 1500});
    } else {
      props?.handleSelectEvent(event);
    }
  };

  const handleGoToSpecificDate = () => {
    const nextAvailableDate = getNextAvailableDate();

    if (nextAvailableDate) {
      setCurrentDate(nextAvailableDate);
      setCalenderDate(nextAvailableDate);

      // Set the current date to the next available date
      const start = moment(nextAvailableDate);
      const end = moment(nextAvailableDate);

      // Set the start date to 6 days before the next available date
      // start.subtract(6, "days");

      // Set the end date to 6 days after the next available date
      end.add(6, "days");

      searchAvailableDayList(start.toDate(), end.toDate());

      // Clear the nextDay array
      props.allDocDetails.nextDay = [];
    }
  };

  useEffect(() => {
    const start = moment(calenderDate);
    const dayOfWeek = start.day(); // 0 (Sunday) through 6 (Saturday)
    const daysToAdd = 6 - dayOfWeek; // Calculate days to add

    const end = start.clone().add(daysToAdd, "days");
    searchAvailableDayList(start.toDate(), end.toDate());
  }, []);

  return (
    <div className={`custom-calendar ${showMore ? "expanded" : ""}`}>
      <Calendar
        ref={calendarRef}
        key={props?.key}
        localizer={localizer}
        events={events}
        defaultView="week"
        view={view}
        views={["week", "day"]}
        step={15}
        timeslots={1}
        // defaultDate={currentDate}
        date={currentDate}
        // min={new Date(new Date(getMinMaxTimes(doctorAvailableList || [])?.min).setHours(8, 0, 0, 0))}
        // max={new Date(new Date(getMinMaxTimes(doctorAvailableList || [])?.max).setHours(8, 0, 0, 0))}
        min={
          minTime
            ? new Date(new Date().setHours(Number(minTime.split(":")[0]), Number(minTime.split(":")[1]), 0, 0))
            : new Date(new Date().setHours(7, 0, 0, 0))
        }
        // max={
        //   maxTime
        //     ? new Date(new Date().setHours(Number(maxTime.split(":")[0]), Number(maxTime.split(":")[1]), 0, 0))
        //     : new Date(new Date().setHours(23, 59, 0, 0))
        // }
        style={{height: "100%"}}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          timeSlotWrapper: CustomTimeSlotWrapper,
          header: CustomDateHeader, // Custom header for date display
        }}
        onNavigate={onNavigate}
        onRangeChange={onRangeChange}
        onSelectEvent={handleSelectEvent}
      />
      {props?.consultationType !== 2 && props?.types !== 1 ? (
        !showMore ? (
          <button className="show-more-btn" onClick={handleShowMore}>
            SEE MORE SCHEDULES
          </button>
        ) : (
          <button className="show-more-btn" onClick={() => setShowMore(false)}>
            SEE LESS SCHEDULES
          </button>
        )
      ) : null}

      {getNextAvailableDate() && props?.consultationType !== 2 && events.length === 0 ? (
        <div className="CalenderOverlay bgWhite">
          {/* <button className="OverlayBtn"> */}
          <button className="OverlayBtn" onClick={() => handleGoToSpecificDate()}>
            <img src={calIcon} alt="" />
            Next meeting on {moment(getNextAvailableDate(), "YYYY-MM-DD").format("MMMM D, YYYY")}
          </button>
        </div>
      ) : doctorAvailableList?.length === 0 ? (
        <div className="CalenderOverlay bgWhite">
          {/* <button className="OverlayBtn"> */}
          <button className="OverlayBtn">
            <img src={calIconGrey} alt="" />
            No apppintments available
          </button>
        </div>
      ) : null}
      {props?.consultationType === 2 ? (
        <div className="CalenderOverlay bgWhite">
          {/* <button className="OverlayBtn"> */}
          <button className="OverlayBtn">
            <img src={calIconGrey} alt="" />
            No online availability
          </button>
        </div>
      ) : null}
      {props?.types === 1 ? (
        <div className="CalenderOverlay bgWhite">
          {/* <button className="OverlayBtn"> */}
          <button className="OverlayBtn">
            <img src={calIconGrey} alt="" />
            Doctor is not available
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CustomCalendar;
