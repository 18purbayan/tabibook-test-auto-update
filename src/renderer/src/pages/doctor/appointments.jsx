import React, {useState, useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Calendar2 from "react-calendar";

const localizer = momentLocalizer(moment);
import icon1 from "../../assets/images/availability-icon2.svg";
import cancelIcon from "../../assets/images/cancel-btn.svg";
import dotlIcon from "../../assets/images/dot-icon.svg";
import {absenceAppointmentApi, doctorFetchAppointmentsApi, getAbsenceReasonApi, getDelayReasonApi} from "../../services/apiService";
import LoadingPage from "../../components/LoadingPage";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("day");
  const [date, setDate] = useState(new Date());
  // const [mainEvents, setMainEvents] = useState([
  //   {
  //     title: "Rick Novak1",
  //     start: new Date(2024, 7, 6, 1, 0),
  //     end: new Date(2024, 7, 6, 1, 15),
  //     type: "video",
  //   },
  //   {
  //     title: "Roland Barr2",
  //     start: new Date(2024, 7, 6, 5, 15),
  //     end: new Date(2024, 7, 6, 5, 30),
  //     type: "cabinet",
  //   },
  //   {
  //     title: "Rick Novak3",
  //     start: new Date(2024, 7, 6, 10, 0),
  //     end: new Date(2024, 7, 6, 10, 15),
  //     type: "video",
  //   },
  //   {
  //     title: "Roland Barr4",
  //     start: new Date(2024, 7, 6, 14, 15),
  //     end: new Date(2024, 7, 6, 14, 30),
  //     type: "cabinet",
  //   },
  //   {
  //     title: "Rick Novak5",
  //     start: new Date(2024, 7, 6, 18, 0),
  //     end: new Date(2024, 7, 6, 18, 15),
  //     type: "video",
  //   },
  //   {
  //     title: "Roland Barr6",
  //     start: new Date(2024, 7, 6, 20, 15),
  //     end: new Date(2024, 7, 6, 20, 30),
  //     type: "cabinet",
  //   },
  //   {
  //     title: "Rick Novak7",
  //     start: new Date(2024, 7, 6, 8, 0),
  //     end: new Date(2024, 7, 6, 8, 15),
  //     type: "video",
  //   },
  //   {
  //     title: "Roland Barr8",
  //     start: new Date(2024, 7, 6, 8, 15),
  //     end: new Date(2024, 7, 6, 8, 30),
  //     type: "cabinet",
  //   },

  //   {
  //     title: "Rick Novak7",
  //     start: new Date(2024, 7, 7, 14, 0),
  //     end: new Date(2024, 7, 7, 14, 15),
  //     type: "video",
  //   },
  //   {
  //     title: "Roland Barr8",
  //     start: new Date(2024, 7, 7, 8, 15),
  //     end: new Date(2024, 7, 7, 8, 30),
  //     type: "cabinet",
  //   },
  //   {
  //     title: "Roland Barr8",
  //     start: new Date(2024, 7, 8, 23, 45),
  //     end: new Date(2024, 7, 8, 23, 59),
  //     type: "cabinet",
  //   },
  //   // Add more events here
  // ]);
  const [mainEvents, setMainEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const [delayPopupOpen, setDelayPopupOpen] = useState(false);
  const openDelayPopup = () => setDelayPopupOpen(true);
  const closeDelayPopup = () => setDelayPopupOpen(false);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
  const [absentEvents, setAbsentEvents] = useState(new Set()); // Track absent events
  const [isListView, setIsListView] = useState(true); // State to toggle between list and column view
  const [isIndicateBtnVisible, setIsIndicateBtnVisible] = useState(true);

  const [monthPopupOpen, setMonthPopupOpen] = useState(false);
  const [popupEvents, setPopupEvents] = useState([]);
  const [popupDate, setPopupDate] = useState(null);
  const [showFreeSlots, setShowFreeSlots] = useState(false);
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [reschedulePopupOpen, setReschedulePopupOpen] = useState(false);
  const [absensePopupOpen, setAbsensePopupOpen] = useState(false);
  const [specificDate, setSpecificDate] = useState(new Date());
  const [screenLoading, setScreenLoading] = useState(false);
  const [calenderDates, setCalenderDates] = useState({startDate: new Date(), endDate: new Date()});
  const [selectedViewDate, setSelectedViewDate] = useState(new Date());
  const [absenceReasonList, setAbsenceReasonList] = useState();
  const [delayReasonList, setDelayReasonList] = useState();
  const [absenseReason, setAbsenseReason] = useState();
  const [modalBtnDis, setModalBtnDis] = useState(false);
  const [delayFormData, setDelayFormData] = useState({
    delayStartTime: "",
    delayDuration: "",
    delayReason: "",
  });
  const [savedDelayFormData, setSavedDelayFormData] = useState({
    delayStartTime: "",
    delayDuration: "",
    delayReason: "",
  });
  const [delayErrors, setDelayErrors] = useState({
    delayStartTime: "",
    delayDuration: "",
    delayReason: "",
  });

  const handleShowFreeSlots = () => {
    setShowFreeSlots(prev => !prev);
  };

  const CustomToolbar = toolbar => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
      const currentDate = moment(toolbar.date);
      const prevDate = currentDate.subtract(1, "day");
      setSelectedViewDate(new Date(prevDate.toDate()));
      setCalenderDates({startDate: prevDate.toDate(), endDate: prevDate.toDate()});
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
      const currentDate = moment(toolbar.date);
      const nextDate = currentDate.add(1, "day");
      setSelectedViewDate(new Date(nextDate.toDate()));
      setCalenderDates({startDate: nextDate.toDate(), endDate: nextDate.toDate()});
    };

    const label = () => {
      let date = moment(toolbar.date);
      return <span className="rbc-toolbar-label">{date.format("dddd MMM D")}</span>;
    };

    return (
      <div className="rbc-toolbar">
        <button type="button" onClick={goToBack} className="prevBtn"></button>
        {label()}
        <button type="button" onClick={goToNext} className="nextBtn"></button>
      </div>
    );
  };

  const TimeHeader = () => {
    return <div className="rbc-time-header">Time</div>;
  };

  const closePopup = () => setMonthPopupOpen(false);
  const cancelOpenPopup = () => {
    setCancelPopupOpen(true);
    setMonthPopupOpen(false);
  };
  const cancelClosePopup = () => setCancelPopupOpen(false);

  const rescheduleOpenPopup = () => {
    setReschedulePopupOpen(true);
    setMonthPopupOpen(false);
  };
  const rescheduleClosePopup = () => setReschedulePopupOpen(false);

  const handleSpecificDateClick = date => {
    setSpecificDate(date);
    setSpecificDateStartTime("00:00");
    setSpecificDateEndTime("00:00");
  };

  const handleSend = () => {
    setIsIndicateBtnVisible(false);
    closeDelayPopup();
  };
  const handleEraseDelay = () => {
    setIsIndicateBtnVisible(true);
    setDelayFormData({
      delayStartTime: "",
      delayDuration: "",
      delayReason: "",
    });
    setSavedDelayFormData({
      delayStartTime: "",
      delayDuration: "",
      delayReason: "",
    });
  };

  const generateFreeSlots = (dates, events) => {
    const slots = [];

    dates.forEach(date => {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      for (let time = new Date(startOfDay); time < endOfDay; time.setMinutes(time.getMinutes() + 15)) {
        const slotStart = new Date(time);
        const slotEnd = new Date(time);
        slotEnd.setMinutes(slotEnd.getMinutes() + 15);

        const isSlotFree = !events.some(event => (event.start <= slotStart && event.end > slotStart) || (event.start < slotEnd && event.end >= slotEnd));

        if (isSlotFree) {
          slots.push({
            title: "Free Slots",
            start: new Date(slotStart),
            end: new Date(slotEnd),
            type: "free",
          });
        }
      }

      const lastSlotStart = new Date(endOfDay);
      lastSlotStart.setMinutes(lastSlotStart.getMinutes() - 14);
      if (!events.some(event => (event.start <= lastSlotStart && event.end > lastSlotStart) || (event.start < endOfDay && event.end >= endOfDay))) {
        slots.push({
          title: "Free Slot",
          start: lastSlotStart,
          end: endOfDay,
          type: "free",
        });
      }
    });

    return slots;
  };

  useEffect(() => {
    let freeSlots = [];
    let weekDates = [];
    let monthDates = [];
    setEvents([]);

    const startOfWeek = moment(date).startOf("week").toDate();
    const endOfWeek = moment(date).endOf("week").toDate();

    const startOfMonth = moment(date).startOf("month").toDate();
    const endOfMonth = moment(date).endOf("month").toDate();

    // Generate dates for the entire week
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      weekDates.push(new Date(d));
    }

    // Generate dates for the entire month
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      monthDates.push(new Date(d));
    }

    if (view === "week" || view === "month") {
      // Generate free slots for week and month views
      if (view === "week") {
        freeSlots = generateFreeSlots(weekDates, mainEvents);
      } else if (view === "month") {
        freeSlots = generateFreeSlots(monthDates, mainEvents);
      }

      // Set events based on `showFreeSlots`
      if (showFreeSlots) {
        setEvents(prevEvents => prevEvents.filter(event => event.type === "free").concat(freeSlots));
      } else {
        setEvents(prevEvents => prevEvents.filter(event => event.type !== "free").concat(...mainEvents));
      }
    } else if (view === "day") {
      // For day view, display all events including free slots
      freeSlots = generateFreeSlots([date], mainEvents);
      setEvents(prevEvents =>
        prevEvents
          .filter(event => event.type !== "free")
          .concat(freeSlots)
          .concat(...mainEvents)
      );
    }

    highlightCurrentTimeSlot();
    const intervalId = setInterval(highlightCurrentTimeSlot, 200);
    return () => clearInterval(intervalId);
  }, [date, view, showFreeSlots, mainEvents]);

  useEffect(() => {
    // Show or hide buttons based on the view
    const listSwitch = document.querySelector(".listSwitch");
    const indicateBtn = document.querySelector(".indicateBtn");
    const absentBtn = document.querySelector(".absentBtn");
    const freeSlotBtn = document.querySelector(".freeSlotBtn");
    const delayDiv = document.querySelector(".delayDiv");

    // Check if elements exist before applying styles
    if (view === "week" || view === "month") {
      if (listSwitch) listSwitch.style.display = "none";
      if (indicateBtn) indicateBtn.style.display = "none";
      if (absentBtn) absentBtn.style.display = "none";
      if (delayDiv) delayDiv.style.display = "none";
      if (freeSlotBtn) freeSlotBtn.style.display = "block";
    } else if (view === "day") {
      if (listSwitch) listSwitch.style.display = "block";
      if (indicateBtn) indicateBtn.style.display = "block";
      if (absentBtn) absentBtn.style.display = "block";
      if (delayDiv) delayDiv.style.display = "block";
      if (freeSlotBtn) freeSlotBtn.style.display = "none";
    }
  }, [view]);

  const onChange = newDate => {
    setDate(newDate);
  };

  const changeView = newView => {
    if (newView === "day") {
      setCalenderDates({startDate: new Date(selectedViewDate), endDate: new Date(selectedViewDate)});
    } else if (newView === "week") {
      let currentDate = moment(selectedViewDate);
      let newStartDate = moment(currentDate).subtract(7, "days");
      let newEndDate = moment(currentDate).add(7, "days");
      setCalenderDates({startDate: newStartDate.toDate(), endDate: newEndDate.toDate()});
    } else if (newView === "month") {
      let currentDate = moment(selectedViewDate);
      let newStartDate = moment(currentDate).startOf("month");
      let newEndDate = moment(currentDate).endOf("month");
      setCalenderDates({startDate: newStartDate.toDate(), endDate: newEndDate.toDate()});
    } else {
    }
    setView(newView);
  };

  const eventPropGetter = event => {
    let className;

    switch (event.type) {
      case "video":
        className = "videoDiv";
        break;
      case "cabinet":
        className = "cabinetDiv";
        break;
      case "free":
        className = "freeDiv";
        break;
      default:
        className = "";
    }

    return {className};
  };

  const Event = ({event}) => {
    const handleCheckboxChange = e => {
      const title = event.id;
      setSelectedCheckboxes(prev => {
        const updated = new Set(prev);
        if (e.target.checked) {
          updated.add(title);
        } else {
          updated.delete(title);
          setAbsentEvents(prev => {
            const updatedAbsent = new Set(prev);
            updatedAbsent.delete(title);
            return updatedAbsent;
          });
        }
        return updated;
      });
    };

    // Check if the event is within the delay period
    const isDelayed = () => {
      if (!savedDelayFormData.delayStartTime && !savedDelayFormData.delayDuration) return false;

      const delayStart = moment(savedDelayFormData.delayStartTime, "HH:mm");
      const delayEnd = delayStart.clone().add(savedDelayFormData.delayDuration, "hours");

      return moment(event.start).isBetween(delayStart, delayEnd, null, "[)");
    };

    return (
      <div className="event-container popupMonthContain">
        <div className="popMnthLft" onClick={() => navigate(`/doctor/appointment-details/${event?.id}`)}>
          <span className="popupTime">{moment(event.start).format("HH:mm")}</span>
          <span className="popTtle">{event.title}</span>
        </div>

        <span className="rgtColumn">
          {view === "day" && event.type !== "free" && (
            <>
              {absentEvents.has(event.id) && <span className="absentTxt">Absent</span>}
              {isDelayed() && <span className="absentTxt">Delay</span>}
              {!isDelayed() ? (
                (!absentEvents.has(event.id) && event.status === 1) || event.status === 0 ? (
                  <input type="checkbox" className="event-checkbox" onChange={handleCheckboxChange} checked={selectedCheckboxes.has(event.id)} />
                ) : null
              ) : null}
            </>
          )}
        </span>
      </div>
    );
  };

  const getCalendarClass = view => {
    switch (view) {
      case "day":
        return "day-view";
      case "week":
        return "week-view";
      case "month":
        return "month-view";
      default:
        return "";
    }
  };

  const highlightCurrentTimeSlot = () => {
    const currentTime = moment();
    const timeSlotGroups = document.querySelectorAll(".rbc-timeslot-group");

    let previousSlot = null;

    timeSlotGroups.forEach(group => {
      const slots = group.querySelectorAll(".rbc-time-slot");
      slots.forEach(slot => {
        const slotTime = moment(slot.innerText, "HH:mm");

        if (currentTime.isSameOrAfter(slotTime)) {
          if (previousSlot) {
            previousSlot.classList.remove("rbc-current-time-slot");
          }
          previousSlot = slot;
        } else if (previousSlot) {
          previousSlot.classList.add("rbc-current-time-slot");
          previousSlot = null;
        }
      });
    });
  };

  const markAbsent = () => {
    if (selectedCheckboxes?.size > 0) {
      setAbsensePopupOpen(true);
    } else {
      toast.error("Something went wrong. Please try again.", {autoClose: 1500});
    }
  };

  const markAbsentSubmit = async () => {
    if (selectedCheckboxes?.size > 0) {
      if (!absenseReason) {
        toast.warn("Please select absesnse reason.", {autoClose: 1500});
      } else {
        setModalBtnDis(true);
        try {
          const fd = new FormData();
          Array.from(selectedCheckboxes).forEach((value, index) => {
            fd.append(`ids[${index}][id]`, value);
          });
          fd.append(`reason`, absenseReason);
          let response = await absenceAppointmentApi(fd);
          if (response) {
            if (response.data.res === true) {
              setAbsentEvents(prev => {
                const newAbsentEvents = new Set(prev);
                selectedCheckboxes.forEach(title => newAbsentEvents.add(title));
                return newAbsentEvents;
              });
              toast.success(response.data.msg ? response.data.msg : "Absence reasons updated successfully.", {autoClose: 1500});
              setAbsensePopupOpen(false);
            } else {
              toast.error(response.data.msg, {autoClose: 1500});
            }
          }
          setModalBtnDis(false);
        } catch (error) {
          setModalBtnDis(false);
          console.error(error);
          toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
        }
      }
    } else {
      toast.error("Something went wrong. Please try again.", {autoClose: 1500});
    }
  };

  const handleViewToggle = () => {
    setIsListView(prev => !prev);
  };

  const renderCalendars = () => {
    const renderMonthEvent = ({day}) => {
      // Ensure that `events` contains the correct list of events
      const dayEvents = events.filter(e => moment(e.start).isSame(day, "day"));

      const eventElements = dayEvents.slice(0, 2).map(e => (
        <div key={e.title + e.start} className={`monthEvnt rbc-event ${eventPropGetter(e).className}`}>
          <div className="event-time">
            {moment(e.start).format("HH:mm")} - {e.title}
          </div>
        </div>
      ));

      if (dayEvents.length > 2) {
        eventElements.push(
          <div key="more" className="rbc-show-more" onClick={() => handleShowMore(day)}>
            {dayEvents.length - 2} More
          </div>
        );
      }

      return eventElements;
    };

    const handleShowMore = day => {
      const dayEvents = events.filter(event => moment(event.start).isSame(day, "day"));
      setPopupEvents(dayEvents);
      setPopupDate(day);
      setMonthPopupOpen(true);
    };

    if (view === "month") {
      return (
        <div className={`rbc-calendar ${getCalendarClass(view)}`}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={view}
            view={view}
            date={date}
            onNavigate={onChange}
            style={{height: 600}}
            eventPropGetter={eventPropGetter}
            components={{
              event: Event,
              toolbar: CustomToolbar,
              month: {
                dateHeader: ({label, date}) => (
                  <div className="rbc-date-header">
                    {label}
                    {renderMonthEvent({day: date})}
                  </div>
                ),
              },
              timeGutterHeader: TimeHeader,
            }}
            step={30}
            timeslots={1}
            formats={{
              timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
              eventTimeRangeFormat: ({start}, culture, localizer) => localizer.format(start, "HH:mm", culture),
            }}
          />
        </div>
      );
    }

    if (view === "day" && !isListView) {
      return (
        <>
          <div className={`rbc-calendar ${getCalendarClass(view)} first-half`}>
            <Calendar
              localizer={localizer}
              events={events.filter(event => moment(event.start).isBefore(moment(event.start).startOf("day").add(12, "hours")))}
              startAccessor="start"
              endAccessor="end"
              defaultView={view}
              view={view}
              date={date} // Ensure the first calendar receives the correct date
              onNavigate={onChange}
              style={{height: 600}}
              eventPropGetter={eventPropGetter}
              components={{
                event: Event,
                toolbar: CustomToolbar,
                timeGutterHeader: TimeHeader,
              }}
              step={30}
              timeslots={1}
              min={new Date(date.setHours(0, 0, 0))}
              max={new Date(date.setHours(11, 59, 0))}
              formats={{
                timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
                eventTimeRangeFormat: ({start}, culture, localizer) => localizer.format(start, "HH:mm", culture),
              }}
            />
          </div>
          <div className={`rbc-calendar secCalendar ${getCalendarClass(view)} second-half`}>
            <Calendar
              localizer={localizer}
              events={events.filter(event => moment(event.start).isSameOrAfter(moment(event.start).startOf("day").add(12, "hours")))}
              startAccessor="start"
              endAccessor="end"
              defaultView={view}
              view={view}
              date={date} // Ensure the second calendar receives the correct date
              onNavigate={onChange}
              style={{height: 600}}
              eventPropGetter={eventPropGetter}
              components={{
                event: Event,
                toolbar: () => null, // No toolbar for the second calendar
                timeGutterHeader: TimeHeader,
              }}
              step={30}
              timeslots={1}
              min={new Date(date.setHours(12, 0, 0))}
              max={new Date(date.setHours(23, 59, 0))} // Corrected to 23:59 to include the full last slot
              formats={{
                timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
                eventTimeRangeFormat: ({start}, culture, localizer) => localizer.format(start, "HH:mm", culture),
              }}
            />
          </div>
        </>
      );
    }

    return (
      <div className={`rbc-calendar ${getCalendarClass(view)}`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={view}
          view={view}
          date={date} // Ensure the calendar receives the correct date
          onNavigate={onChange}
          style={{height: 600}}
          eventPropGetter={eventPropGetter}
          components={{
            event: Event,
            toolbar: CustomToolbar,
            timeGutterHeader: TimeHeader,
          }}
          step={30}
          timeslots={1}
          formats={{
            timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
            eventTimeRangeFormat: ({start}, culture, localizer) => localizer.format(start, "HH:mm", culture),
          }}
          className={`calendarMain ${showFreeSlots ? "showFreeSlot" : ""}`}
        />
      </div>
    );
  };

  const getDoctorAppointments = async () => {
    try {
      setScreenLoading(true);
      const fd = new FormData();
      fd.append("start_date", moment(calenderDates.startDate).format("yyyy-MM-DD"));
      fd.append("end_date", moment(calenderDates.endDate).format("yyyy-MM-DD"));
      let response = await doctorFetchAppointmentsApi(fd);
      if (response) {
        if (response.data.res === true) {
          let tempArray = [];
          let tempAbsentEvents = new Set();
          if (response.data.data.length > 0) {
            response.data.data.map(item => {
              if (item.status === 3) {
                tempAbsentEvents.add(item.id);
              }
              // setAbsentEvents(prev => {
              //   const newAbsentEvents = new Set(prev);
              //   selectedCheckboxes.forEach(title => newAbsentEvents.add(title));
              //   return newAbsentEvents;
              // });

              const originalAppDate = moment(item.appointment_date, "YYYY-MM-DD");

              // Subtract one month from the date
              const adjustedAppDate = originalAppDate;
              // const adjustedAppDate = originalAppDate.add(1, "months");

              // Format the adjusted date back to a string (optional)
              const formattedAppDate = adjustedAppDate.format("YYYY-MM-DD");

              // Combine date and time into a single Moment.js object
              const combinedDateTime = moment(`${formattedAppDate} ${item.time}`, "YYYY-MM-DD HH:mm");

              // Convert the Moment.js object to a JavaScript Date object
              const dateObject = combinedDateTime.toDate();

              // Format dateObject for display purposes
              const formattedDate = moment(dateObject).format("YYYY-MM-DD HH:mm:ss");

              // Add 15 minutes to the start time
              const endDateTime = combinedDateTime.add(15, "minutes");

              // Create the end time JavaScript Date object
              const endDateObject = endDateTime.toDate();

              tempArray.push({
                id: item.id,
                status: item.status,
                title: item.name,
                start: new Date(formattedDate),
                // end: new Date(formattedDate),
                end: new Date(endDateObject),
                type: item?.consultation_type === "For online consultation" ? "video" : item?.consultation_type === "For cabinet consultation" ? "cabinet" : "",
              });
            });
          }
          setMainEvents(tempArray || []);
          setAbsentEvents(tempAbsentEvents);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setScreenLoading(false);
    } catch (error) {
      setScreenLoading(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getAbsenceReason = async () => {
    try {
      let response = await getAbsenceReasonApi();
      if (response) {
        if (response.data.res === true) {
          setAbsenceReasonList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getDelayReason = async () => {
    try {
      let response = await getDelayReasonApi();
      if (response) {
        if (response.data.res === true) {
          setDelayReasonList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleDelayChange = e => {
    const {name, value} = e.target;
    setDelayFormData({
      ...delayFormData,
      [name]: value,
    });
    setDelayErrors({
      ...delayErrors,
      [name]: "",
    });
  };

  const validateDelayFields = () => {
    const errors = {};
    let isValid = true;

    // Validate delay starting time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(delayFormData.delayStartTime)) {
      errors.delayStartTime = "Please enter a valid hour (HH:MM)";
      isValid = false;
    }

    // Validate delay duration
    const durationNum = parseInt(delayFormData.delayDuration, 10);
    if (!Number.isInteger(durationNum) || durationNum <= 0) {
      errors.delayDuration = "Please enter a positive integer for the duration.";
    } else if (durationNum > 24) {
      errors.delayDuration = "Duration should not exceed 24 hours.";
    }

    // Validate delay reason
    if (!delayFormData.delayReason) {
      errors.delayReason = "Please select a reason";
      isValid = false;
    }
    setDelayErrors(errors);
    return isValid;
  };

  const handleAddDelay = () => {
    if (validateDelayFields()) {
      // Form data is valid; you can process or store it
      setDelayPopupOpen(false);
      setIsIndicateBtnVisible(false);
      setSavedDelayFormData(delayFormData);
      console.log("Form Data:", delayFormData);
      // For example: send data to an API or store in state
    }
  };

  useEffect(() => {
    getDoctorAppointments();
  }, [calenderDates]);

  useEffect(() => {
    getAbsenceReason();
    getDelayReason();
  }, []);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        {screenLoading && <LoadingPage />}
        <div className="mainDiv">
          <div className="hdnDiv nurseTop">
            <h2>
              <span>
                <img src={icon1} alt="Availability icon" />
                All appointments <strong>Showing {moment(date).format("dddd, MMMM Do YYYY")}</strong>
              </span>
              <span>
                <p className="videoConsult">Video Consultation</p>
                <p className="cabinetConsult">Cabinet consultation</p>
                {view === "day" ? (
                  <div className="listSwitch">
                    {isListView ? "List View" : "Column View"}
                    <input type="checkbox" id="switch" checked={isListView} onChange={handleViewToggle} />
                    <label htmlFor="switch">Toggle</label>
                  </div>
                ) : null}
              </span>
            </h2>
          </div>
          {!screenLoading ? (
            <div className="appointmentFoot">
              <div className="mainClndBtns">
                <div className="clndBtns">
                  <div className="filters">
                    <button onClick={() => changeView("day")} className={view === "day" ? "active" : ""}>
                      Day
                    </button>
                    <button onClick={() => changeView("week")} className={view === "week" ? "active" : ""}>
                      Week
                    </button>
                    <button onClick={() => changeView("month")} className={view === "month" ? "active" : ""}>
                      Month
                    </button>
                  </div>
                  <button className="absentBtn" onClick={() => markAbsent()} disabled={selectedCheckboxes.size === 0 ? true : false}>
                    Mark as absent
                  </button>
                </div>
                <div className="listViewDiv">
                  {view !== "day" ? (
                    <button onClick={handleShowFreeSlots} className="freeSlotBtn">
                      {showFreeSlots ? "Hide free slots" : "Show free slots"}
                    </button>
                  ) : null}
                  {view === "day" ? (
                    isIndicateBtnVisible ? (
                      <button className="indicateBtn" onClick={openDelayPopup}>
                        Indicate delay
                      </button>
                    ) : (
                      <div className="delayDiv">
                        Delay Starting at:
                        <input type="text" placeholder={savedDelayFormData.delayStartTime} className="delayInput" />
                        Duration:
                        <input type="text" placeholder={savedDelayFormData.delayDuration + "hrs"} className="durationInput" />
                        <button className="eraseBtn" onClick={handleEraseDelay}>
                          Erase delay
                        </button>
                      </div>
                    )
                  ) : null}
                </div>
              </div>

              <div className="calendarMain">{renderCalendars()}</div>
            </div>
          ) : null}
        </div>
      </div>

      {absensePopupOpen && (
        <div className="popup holidayPopup">
          <div className="popup-content">
            <button onClick={() => setAbsensePopupOpen(false)} className="cancelBtn">
              <img src={cancelIcon} alt="" />
            </button>
            <div className="addNursePopup">
              <h2 className="nurseHdn">Mark as Absense</h2>
              <ul>
                <li>
                  <label>What is reason of absense?</label>
                  <select value={absenseReason} onChange={e => setAbsenseReason(e.target.value)}>
                    <option selected hidden>
                      Select reason here
                    </option>
                    {absenceReasonList?.map((item, index) => (
                      <option key={index} value={item?.name}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <button onClick={() => markAbsentSubmit()} disabled={modalBtnDis}>
                    {modalBtnDis ? "Please wait..." : "Submit"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {delayPopupOpen && (
        <div className="popup holidayPopup">
          <div className="popup-content">
            <button onClick={closeDelayPopup} className="cancelBtn">
              <img src={cancelIcon} alt="" />
            </button>
            <div className="addNursePopup">
              <h2 className="nurseHdn">Delay Time</h2>
              <ul>
                <li>
                  <label>Delay starting time:</label>
                  <input
                    type="text"
                    name="delayStartTime"
                    placeholder="Please enter your delay hour (HH:MM)"
                    value={delayFormData.delayStartTime}
                    onChange={handleDelayChange}
                  />
                  {delayErrors.delayStartTime && <p className="validationErrorMsg">{delayErrors.delayStartTime}</p>}
                </li>
                <li>
                  <label>Delay duration time (in hours):</label>
                  <input
                    type="text"
                    name="delayDuration"
                    placeholder="Please enter your time duration in hours"
                    value={delayFormData.delayDuration}
                    onChange={handleDelayChange}
                  />
                  {delayErrors.delayDuration && <p className="validationErrorMsg">{delayErrors.delayDuration}</p>}
                </li>
                <li>
                  <label>What is the reason for the delay?</label>
                  <select name="delayReason" value={delayFormData.delayReason} onChange={handleDelayChange}>
                    <option value={null} selected hidden>
                      Select reason here
                    </option>
                    {delayReasonList?.map((item, index) => (
                      <option key={index} value={item?.name}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                  {delayErrors.delayReason && <p className="validationErrorMsg">{delayErrors.delayReason}</p>}
                </li>
                <li>
                  <button onClick={() => handleAddDelay()}>Send</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {monthPopupOpen && (
        <div className="popup holidayPopup">
          <div className="popup-content popupMonth">
            <button onClick={closePopup} className="cancelBtn">
              <img src={cancelIcon} alt="" />
            </button>
            <h3>{moment(popupDate).format("MMMM Do YYYY")}</h3>
            <ul className="">
              {popupEvents.map(event => (
                <li className={event.type} key={event.title}>
                  <div className="eventDetails">
                    <Event event={event} />
                  </div>
                  <div className="dotPop" onClick={e => e.currentTarget.classList.toggle("active")}>
                    <img src={dotlIcon} alt="" />
                    <div className="dotInner">
                      <p onClick={rescheduleOpenPopup}>Reschedule</p>
                      <p onClick={cancelOpenPopup}>Cancel</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {cancelPopupOpen && (
        <div className="popup holidayPopup">
          <div className="popup-content popupMonth">
            <button onClick={cancelClosePopup} className="cancelBtn">
              <img src={cancelIcon} alt="" />
            </button>
            <h3>Cancel appointment</h3>
            <h4 className="cancelTxt">Are you sure you want to cancel this appointment?</h4>

            <div className="cancelForm">
              <h4>What is reason of appointment cancellation?</h4>
              <select>
                <option>Select reason here</option>
              </select>
              <button>Yes Cancel Appointment</button>
            </div>
          </div>
        </div>
      )}

      {reschedulePopupOpen && (
        <div className="popup holidayPopup speceficPopup">
          <div className="popup-content resheduleDiv">
            <button onClick={rescheduleClosePopup} className="cancelBtn">
              <img src={cancelIcon} alt="" />
            </button>
            <div className="popupInner">
              <div className="calendar-section">
                <h3 className="reHdn">Reschedule</h3>
                <h4 className="cancelTxt">Make date specific changes</h4>
                <div className="overlayBtn"></div>
                <Calendar2 onChange={handleSpecificDateClick} value={specificDate} tileClassName={() => null} />
              </div>

              <div className="selected-dates">
                <h3>{specificDate.toDateString()}</h3>
                <h4>Available Time Slot</h4>

                <ul>
                  <li className="selected-date active">16:30</li>
                  <li className="selected-date">17:30</li>
                  <li className="selected-date">18:30</li>
                  <li className="selected-date">19:30</li>
                  <li className="selected-date">20:30</li>
                </ul>

                <div className="cancelForm">
                  <h5>What is reason of appointment reschedule?</h5>
                  <select>
                    <option>Select reason here</option>
                  </select>
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
