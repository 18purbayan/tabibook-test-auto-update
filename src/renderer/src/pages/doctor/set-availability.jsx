import React, {useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import Calendar from "react-calendar";
import icon1 from "../../assets/images/availability-icon2.svg";
import cancelIcon from "../../assets/images/cancel-btn.svg";
import {toast} from "react-toastify";
import {format} from "date-fns";
import {
  addDateAvailabilityApi,
  addNormalAvailabilityApi,
  deleteDateAvailabilityApi,
  deleteNormalAvailabilityApi,
  doctorHolidayActionApi,
  fetchDateChangeAvailabilityApi,
  fetchHolidayApi,
  fetchNormalAvailabilityApi,
} from "../../services/apiService";
import Skeleton from "react-loading-skeleton";

const SetAvailability = () => {
  const [checkedDays, setCheckedDays] = useState({});
  const [timeSlots, setTimeSlots] = useState({});
  const [dateSpecTimeSlots, setDateSpecTimeSlots] = useState([]);
  const [initialTimes, setInitialTimes] = useState({});
  const [onlineConsultationTime, setOnlineConsultationTime] = useState(0);
  const [cabinetConsultationTime, setCabinetConsultationTime] = useState(0);
  const [onlineConsultationTimeUnit, setOnlineConsultationTimeUnit] = useState("Minute");
  const [cabinetConsultationTimeUnit, setCabinetConsultationTimeUnit] = useState("Minute");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSpecificDatePopupOpen, setIsSpecificDatePopupOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [specificDate, setSpecificDate] = useState(new Date());
  const [specificDateStartTime, setSpecificDateStartTime] = useState("00:00");
  const [specificDateEndTime, setSpecificDateEndTime] = useState("00:00");
  const [onlineConsultationTimes, setOnlineConsultationTimes] = useState({});
  const [cabinetConsultationTimes, setCabinetConsultationTimes] = useState({});
  const [daySpecOnlineConsultationTimes, setDaySpecOnlineConsultationTimes] = useState(0);
  const [daySpecCabinetConsultationTimes, setDaySpecCabinetConsultationTimes] = useState(0);
  const [daySpecOnlineConsultationTimeUnit, setDaySpecOnlineConsultationTimeUnit] = useState("Minute");
  const [daySpecCabinetConsultationTimeUnit, setDaySpecCabinetConsultationTimeUnit] = useState("Minute");
  const [timeUnits, setTimeUnits] = useState({});
  const [removeBtnDis, setRemoveBtnDis] = useState(false);
  const [saveBtnDis, setSaveBtnDis] = useState(false);
  const [docNotAvailCheckBox, setDocNotAvailCheckBox] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [allDetails, setAllDetails] = useState(false);

  const handleCheckboxChange = day => {
    setCheckedDays(prev => ({...prev, [day]: !prev[day]}));
    if (!checkedDays[day]) {
      setInitialTimes(prev => ({
        ...prev,
        [day]: {startTime: "00:00", endTime: "00:00"},
      }));
    }
  };

  const handleAddTimeSlot = day => {
    const {startTime, endTime} = initialTimes[day] || {};

    const parseTime = time => {
      const [hours, minutes] = time.split(":").map(Number);
      return new Date(0, 0, 0, hours, minutes);
    };

    const startTimeDate = parseTime(startTime || "00:00");
    const endTimeDate = parseTime(endTime || "00:00");

    const isOverlapping = (existingSlots, newStartTime, newEndTime) => {
      return existingSlots.some(({startTime, endTime}) => {
        const existingStartTime = parseTime(startTime);
        const existingEndTime = parseTime(endTime);
        return newStartTime <= existingEndTime && newEndTime >= existingStartTime;
      });
    };

    if (startTimeDate >= endTimeDate) {
      toast.warning("Start time should be before end time.", {autoClose: 1500});
      return;
    }

    const existingSlots = timeSlots[day] || [];

    if (isOverlapping(existingSlots, startTimeDate, endTimeDate)) {
      toast.warning("Time slot overlaps with an existing slot.", {autoClose: 1500});
      return;
    }

    setTimeSlots(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), {startTime, endTime}],
    }));

    setInitialTimes(prev => ({
      ...prev,
      [day]: {startTime: "00:00", endTime: "00:00"},
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setInitialTimes(prev => ({
      ...prev,
      [day]: {...prev[day], [type]: value},
    }));
  };

  const handleSave = async () => {
    const filterWithoutId = data => {
      return Object.entries(data).reduce((result, [day, intervals]) => {
        // Filter intervals without an 'id' and add 'day' property to each interval
        const filteredIntervals = intervals.filter(interval => !interval.hasOwnProperty("id")).map(interval => ({...interval, day}));

        // Merge filtered intervals into the result array
        return result.concat(filteredIntervals);
      }, []);
    };

    const filteredData = filterWithoutId(timeSlots);

    const fd = new FormData();

    if (
      allDetails?.consult?.["For online consultation"] &&
      onlineConsultationTimeUnit &&
      onlineConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(onlineConsultationTime) >= 60
    ) {
      toast.warn("Online consultation time must be less than 60 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For online consultation"] &&
      onlineConsultationTimeUnit &&
      onlineConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(onlineConsultationTime) < 15
    ) {
      toast.warn("Online consultation time must be at least 15 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For online consultation"] &&
      onlineConsultationTimeUnit &&
      onlineConsultationTimeUnit.toLowerCase() === "hour" &&
      parseInt(onlineConsultationTime) > 24
    ) {
      toast.warn("Online consultation time cannot exceed 24 hours.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      cabinetConsultationTimeUnit &&
      cabinetConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(cabinetConsultationTime) >= 60
    ) {
      toast.warn("Cabinet consultation time must be less than 60 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      cabinetConsultationTimeUnit &&
      cabinetConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(cabinetConsultationTime) < 15
    ) {
      toast.warn("Cabinet consultation time must be at least 15 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      cabinetConsultationTimeUnit &&
      cabinetConsultationTimeUnit.toLowerCase() === "hour" &&
      parseInt(cabinetConsultationTime) > 24
    ) {
      toast.warn("Cabinet consultation time cannot exceed 24 hours.", {autoClose: 1500});
      return;
    } else if (filteredData.length > 0 || onlineConsultationTime || onlineConsultationTimeUnit || cabinetConsultationTime || cabinetConsultationTimeUnit) {
      setSaveBtnDis(true);
      filteredData.map((item, index) => {
        fd.append(`days[${index}][day]`, item.day.toLowerCase());
        fd.append(`days[${index}][start_time]`, item.startTime);
        fd.append(`days[${index}][end_time]`, item.endTime);
      });

      if (allDetails?.consult?.["For online consultation"]) {
        fd.append(`timeslot[0][types]`, "For online consultation");
        fd.append(`timeslot[0][time_slot]`, onlineConsultationTime ? onlineConsultationTime : "0");
        fd.append(`timeslot[0][time_slot_type]`, onlineConsultationTimeUnit ? onlineConsultationTimeUnit : "Minute");
      }

      if (allDetails?.consult?.["For cabinet consultation"]) {
        fd.append(`timeslot[1][types]`, "For cabinet consultation");
        fd.append(`timeslot[1][time_slot]`, cabinetConsultationTime ? cabinetConsultationTime : "0");
        fd.append(`timeslot[1][time_slot_type]`, cabinetConsultationTimeUnit ? cabinetConsultationTimeUnit : "Minute");
      }

      try {
        let response = await addNormalAvailabilityApi(fd);
        if (response) {
          if (response.data.res === true) {
            setIsFormDisabled(true);
            setIsSaveClicked(true);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setSaveBtnDis(false);
      } catch (error) {
        setSaveBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setIsFormDisabled(true);
      setIsSaveClicked(true);
    }

    // for (let pair of fd.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
  };

  const handleEdit = () => {
    setIsFormDisabled(false);
    setIsSaveClicked(false);
  };

  const isSaveDisabled = Object.values(timeSlots).every(slots => slots.length === 0);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openSpecificDatePopup = () => {
    setSpecificDate(new Date()); // Set to current date
    setIsSpecificDatePopupOpen(true);
  };

  const closeSpecificDatePopup = () => setIsSpecificDatePopupOpen(false);

  const handleDateClick = async date => {
    const newDate = date.toDateString();
    if (selectedDates.includes(newDate)) {
      try {
        let formData = new FormData();
        formData.append("action", "del");
        formData.append("holiday_date", format(new Date(date), "yyyy-MM-dd"));
        let response = await doctorHolidayActionApi(formData);
        if (response) {
          if (response.data.res === true) {
            setSelectedDates(selectedDates.filter(date => date !== newDate));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      try {
        let formData = new FormData();
        formData.append("action", "add");
        formData.append("holiday_date", format(new Date(date), "yyyy-MM-dd"));
        let response = await doctorHolidayActionApi(formData);
        if (response) {
          if (response.data.res === true) {
            setSelectedDates([...selectedDates, newDate]);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
    setCalendarValue(date);
  };

  const handleSpecificDateClick = date => {
    setSpecificDate(date);
    const currentDate = new Date(date);
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    getDateChangeAvailability(formattedDate);
    setSpecificDateStartTime("00:00");
    setSpecificDateEndTime("00:00");
  };

  const handleAddSpecificDateTimeSlot = () => {
    const parseTime = time => {
      const [hours, minutes] = time.split(":").map(Number);
      return new Date(0, 0, 0, hours, minutes);
    };

    const startTimeDate = parseTime(specificDateStartTime ? specificDateStartTime : "00:00");
    const endTimeDate = parseTime(specificDateEndTime ? specificDateEndTime : "00:00");
    const dateStr = specificDate.toDateString();

    // if (specificDateStartTime !== "00:00" && specificDateEndTime !== "00:00") {
    if (startTimeDate < endTimeDate || startTimeDate === endTimeDate) {
      setDateSpecTimeSlots(prev => [...prev, {startTime: specificDateStartTime, endTime: specificDateEndTime, date: specificDate}]);
      // setTimeSlots(prev => ({
      //   ...prev,
      //   [dateStr]: [...(prev[dateStr] || []), {startTime: specificDateStartTime, endTime: specificDateEndTime}],
      // }));
      setSpecificDateStartTime("00:00");
      setSpecificDateEndTime("00:00");
    } else {
      toast.warning("Start time should be before end time.", {autoClose: 1500});
    }
  };

  const handleRemoveSelectedDate = async dateToRemove => {
    try {
      let formData = new FormData();
      formData.append("action", "del");
      formData.append("holiday_date", format(new Date(dateToRemove), "yyyy-MM-dd"));
      let response = await doctorHolidayActionApi(formData);
      if (response) {
        if (response.data.res === true) {
          setSelectedDates(selectedDates.filter(date => date !== dateToRemove));

          toast.success(response.data.msg, {autoClose: 1500});
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const tileClassName = ({date}) => {
    const formattedDate = date.toDateString();
    return selectedDates.includes(formattedDate) ? "highlighted-date" : null;
  };

  const handleOnlineConsultationTimeChange = (date, value) => {
    setDaySpecOnlineConsultationTimes(value);
  };

  const handleCabinetConsultationTimeChange = (date, value) => {
    setDaySpecCabinetConsultationTimes(value);
  };

  const handleOnlineConsultationTimeUnitChange = value => {
    setOnlineConsultationTimeUnit(value);
  };

  const handleCabinetConsultationTimeUnitChange = value => {
    setCabinetConsultationTimeUnit(value);
  };

  const getNormaAvailability = async () => {
    try {
      setScreenLoading(true);
      let response = await fetchNormalAvailabilityApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          if (response.data.data.consult?.["For online consultation"]) {
            setOnlineConsultationTime(response.data.data.consult?.["For online consultation"]?.time_slot);
            setOnlineConsultationTimeUnit(response.data.data.consult?.["For online consultation"]?.time_slot_type);
          }
          if (response.data.data.consult?.["For cabinet consultation"]) {
            setCabinetConsultationTime(response.data.data.consult?.["For cabinet consultation"]?.time_slot);
            setCabinetConsultationTimeUnit(response.data.data.consult?.["For cabinet consultation"]?.time_slot_type);
          }
          let tempCheckedDays = {...checkedDays};
          let tempTimeSlots = {...timeSlots};
          if (response.data.data.availDay.sunday.intervals.length > 0) {
            tempCheckedDays.Sunday = true;
            tempTimeSlots.Sunday = [];
            response.data.data.availDay.sunday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Sunday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.monday.intervals.length > 0) {
            tempCheckedDays.Monday = true;
            tempTimeSlots.Monday = [];
            response.data.data.availDay.monday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Monday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.tuesday.intervals.length > 0) {
            tempCheckedDays.Tuesday = true;
            tempTimeSlots.Tuesday = [];
            response.data.data.availDay.tuesday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Tuesday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.wednesday.intervals.length > 0) {
            tempCheckedDays.Wednesday = true;
            tempTimeSlots.Wednesday = [];
            response.data.data.availDay.wednesday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Wednesday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.thursday.intervals.length > 0) {
            tempCheckedDays.Thursday = true;
            tempTimeSlots.Thursday = [];
            response.data.data.availDay.thursday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Thursday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.friday.intervals.length > 0) {
            tempCheckedDays.Friday = true;
            tempTimeSlots.Friday = [];
            response.data.data.availDay.friday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Friday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.saturday.intervals.length > 0) {
            tempCheckedDays.Saturday = true;
            tempTimeSlots.Saturday = [];
            response.data.data.availDay.saturday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Saturday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          setCheckedDays(tempCheckedDays);
          setTimeSlots(tempTimeSlots);
          const hasIntervals = Object.values(response.data.data.availDay).some(day => day.intervals.length > 0);
          if (hasIntervals) {
            setIsSaveClicked(true);
            setIsFormDisabled(true);
          }
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

  const handleRemoveTimeSlot = async (day, index, id) => {
    if (id) {
      try {
        setRemoveBtnDis(true);
        let formData = new FormData();
        formData.append("id", id);

        let response = await deleteNormalAvailabilityApi(formData);
        if (response) {
          if (response.data.res === true) {
            setTimeSlots(prev => ({
              ...prev,
              [day]: prev[day].filter((_, i) => i !== index),
            }));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setRemoveBtnDis(false);
      } catch (error) {
        setRemoveBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setTimeSlots(prev => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index),
      }));
      toast.success("Successfully Deleted", {autoClose: 1500});
    }
  };

  const handleDaySpecRemoveTimeSlot = async (day, index, id) => {
    if (id) {
      try {
        setRemoveBtnDis(true);
        let formData = new FormData();
        formData.append("id", id);
        let response = await deleteDateAvailabilityApi(formData);
        if (response) {
          if (response.data.res === true) {
            setDateSpecTimeSlots(prev => prev.filter((_, i) => i !== index));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setRemoveBtnDis(false);
      } catch (error) {
        setRemoveBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setDateSpecTimeSlots(prev => prev.filter((_, i) => i !== index));
      toast.success("Successfully Deleted", {autoClose: 1500});
    }
  };

  const getDateChangeAvailability = async date => {
    if (date) {
      try {
        let formData = new FormData();
        formData.append("date", date);

        let response = await fetchDateChangeAvailabilityApi(formData);
        if (response) {
          if (response.data.res === true) {
            setDateSpecTimeSlots([]);
            if (response.data.data === 1 || response.data.data === "1") {
              setDocNotAvailCheckBox(true);
            } else {
              setDocNotAvailCheckBox(false);
            }
            if (response.data.data.availDay?.length > 0) {
              response.data.data.availDay.map(item => {
                setDateSpecTimeSlots(prev => [...prev, {id: item?.id, startTime: item?.start_time, endTime: item?.end_time}]);
              });
            }
            if (response.data.data?.consult?.["For online consultation"]) {
              setDaySpecOnlineConsultationTimes(response.data.data.consult["For online consultation"].time_slot);
              setDaySpecOnlineConsultationTimeUnit(response.data.data.consult["For online consultation"].time_slot_type);
            }
            if (response.data.data?.consult?.["For cabinet consultation"]) {
              setDaySpecCabinetConsultationTimes(response.data.data.consult["For cabinet consultation"].time_slot);
              setDaySpecCabinetConsultationTimeUnit(response.data.data.consult["For cabinet consultation"].time_slot_type);
            }
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  const handleSpecificDateSave = async () => {
    const filterWithoutId = data => {
      return data.filter(item => !item.hasOwnProperty("id"));
    };

    const filteredData = filterWithoutId(dateSpecTimeSlots);

    const fd = new FormData();

    if (
      allDetails?.consult?.["For online consultation"] &&
      daySpecOnlineConsultationTimeUnit &&
      daySpecOnlineConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(daySpecOnlineConsultationTimes) >= 60
    ) {
      toast.warn("Online consultation time must be less than 60 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For online consultation"] &&
      daySpecOnlineConsultationTimeUnit &&
      daySpecOnlineConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(daySpecOnlineConsultationTimes) < 15
    ) {
      toast.warn("Online consultation time must be at least 15 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For online consultation"] &&
      daySpecOnlineConsultationTimeUnit &&
      daySpecOnlineConsultationTimeUnit.toLowerCase() === "hour" &&
      parseInt(daySpecOnlineConsultationTimes) > 24
    ) {
      toast.warn("Online consultation time cannot exceed 24 hours.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      daySpecCabinetConsultationTimeUnit &&
      daySpecCabinetConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(daySpecCabinetConsultationTimes) >= 60
    ) {
      toast.warn("Cabinet consultation time must be less than 60 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      daySpecCabinetConsultationTimeUnit &&
      daySpecCabinetConsultationTimeUnit.toLowerCase() === "minute" &&
      parseInt(daySpecCabinetConsultationTimes) < 15
    ) {
      toast.warn("Cabinet consultation time must be at least 15 minutes.", {autoClose: 1500});
      return;
    } else if (
      allDetails?.consult?.["For cabinet consultation"] &&
      daySpecCabinetConsultationTimeUnit &&
      daySpecCabinetConsultationTimeUnit.toLowerCase() === "hour" &&
      parseInt(daySpecCabinetConsultationTimes) > 24
    ) {
      toast.warn("Cabinet consultation time cannot exceed 24 hours.", {autoClose: 1500});
      return;
    } else if (
      filteredData.length > 0 ||
      daySpecOnlineConsultationTimes ||
      daySpecOnlineConsultationTimeUnit ||
      daySpecCabinetConsultationTimes ||
      daySpecCabinetConsultationTimeUnit
    ) {
      setSaveBtnDis(true);
      filteredData.map((item, index) => {
        fd.append(`days[${index}][day]`, format(new Date(item.date), "yyyy-MM-dd"));
        fd.append(`days[${index}][start_time]`, item.startTime);
        fd.append(`days[${index}][end_time]`, item.endTime);
      });

      fd.append(`timeslot[0][day]`, format(new Date(specificDate), "yyyy-MM-dd"));
      fd.append(`timeslot[0][types]`, "For online consultation");
      fd.append(`timeslot[0][time_slot]`, daySpecOnlineConsultationTimes ? daySpecOnlineConsultationTimes : "0");
      fd.append(`timeslot[0][time_slot_type]`, daySpecOnlineConsultationTimeUnit ? daySpecOnlineConsultationTimeUnit : "Minute");
      fd.append(`timeslot[1][day]`, format(new Date(specificDate), "yyyy-MM-dd"));
      fd.append(`timeslot[1][types]`, "For cabinet consultation");
      fd.append(`timeslot[1][time_slot]`, daySpecCabinetConsultationTimes ? daySpecCabinetConsultationTimes : "0");
      fd.append(`timeslot[1][time_slot_type]`, daySpecCabinetConsultationTimeUnit ? daySpecCabinetConsultationTimeUnit : "Minute");
      fd.append(`status`, docNotAvailCheckBox ? "1" : "0");
      fd.append(`date`, format(new Date(specificDate), "yyyy-MM-dd"));

      try {
        let response = await addDateAvailabilityApi(fd);
        if (response) {
          if (response.data.res === true) {
            toast.success(response.data.msg, {autoClose: 1500});
            getDateChangeAvailability(format(specificDate, "yyyy-MM-dd"));
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setSaveBtnDis(false);
      } catch (error) {
        setSaveBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }

    // for (let pair of fd.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
  };

  const getHolidays = async date => {
    if (date) {
      try {
        let formData = new FormData();
        formData.append("day", date);

        let response = await fetchHolidayApi(formData);
        if (response) {
          if (response.data.res === true) {
            const formattedDates = response.data.data.map(item => new Date(item.holiday_date).toDateString());
            setSelectedDates(formattedDates);
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  const handleActiveStartDateChange = ({action, activeStartDate, view}) => {
    if (action === "prev" || action === "next") {
      const formattedDate = format(activeStartDate, "yyyy-MM");
      getHolidays(formattedDate);
    }
  };

  useEffect(() => {
    getNormaAvailability();

    setSpecificDate(format(new Date(), "yyyy-MM-dd"));
    getDateChangeAvailability(format(new Date(), "yyyy-MM-dd"));
    getHolidays(format(new Date(), "yyyy-MM"));
  }, []);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        <div className="mainDiv">
          <div className="hdnDiv">
            <h2>
              <img src={icon1} alt="Availability icon" />
              Availability
            </h2>
          </div>

          <div className="dashFoot">
            <div className="upcomingAppoinment avalabilityDiv">
              <div className="setMain">
                <h3>Set date and time</h3>
                {screenLoading ? (
                  <>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={2} height={40} width={"60%"} baseColor="#cfd5f9" />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={1} height={40} width={"40%"} baseColor="#cfd5f9" />
                    </div>
                  </>
                ) : (
                  <>
                    <ul className={`avalabilityForm ${isFormDisabled ? "loopDisable" : ""}`}>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                        <li key={day}>
                          <span>
                            <input type="checkbox" checked={checkedDays[day] || false} onChange={() => handleCheckboxChange(day)} disabled={isFormDisabled} />{" "}
                            {day}
                          </span>
                          {checkedDays[day] && (
                            <div className="addList">
                              {!isSaveClicked && (
                                <div className="CloneDiv">
                                  <label>Start time:</label>
                                  <input
                                    type="time"
                                    value={initialTimes[day]?.startTime || "00:00"}
                                    onChange={e => handleTimeChange(day, "startTime", e.target.value)}
                                    disabled={isFormDisabled}
                                  />
                                  <label>End time:</label>
                                  <input
                                    type="time"
                                    value={initialTimes[day]?.endTime || "00:00"}
                                    onChange={e => handleTimeChange(day, "endTime", e.target.value)}
                                    disabled={isFormDisabled}
                                  />
                                  <button onClick={() => handleAddTimeSlot(day)} disabled={isFormDisabled}>
                                    Add
                                  </button>
                                </div>
                              )}
                              {timeSlots[day] &&
                                timeSlots[day].map((slot, index) => (
                                  <div key={index} className={`loopSlot ${isFormDisabled ? "loopDisable" : ""}`}>
                                    <label>Start time:</label>
                                    <input type="time" value={slot.startTime} readOnly />
                                    <label>End time:</label>
                                    <input type="time" value={slot.endTime} readOnly />
                                    {removeBtnDis ? (
                                      <button>Remove</button>
                                    ) : (
                                      <button onClick={() => handleRemoveTimeSlot(day, index, slot.id)} disabled={isFormDisabled}>
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    <h3>Set time slots</h3>
                    <ul className={`avalabilityForm ${isFormDisabled ? "loopDisable" : ""}`}>
                      {allDetails?.consult?.["For online consultation"] ? (
                        <li>
                          <div className="addList tmeSlot">
                            <label className="tmeLabel">For online consultation</label>
                            <input
                              type="text"
                              value={onlineConsultationTime}
                              onChange={e => setOnlineConsultationTime(e.target.value)}
                              disabled={isFormDisabled}
                            />
                            <select
                              value={onlineConsultationTimeUnit}
                              onChange={e => handleOnlineConsultationTimeUnitChange(e.target.value)}
                              disabled={isFormDisabled}>
                              <option>Minute</option>
                              <option>Hour</option>
                            </select>
                          </div>
                        </li>
                      ) : null}
                      {allDetails?.consult?.["For cabinet consultation"] ? (
                        <li>
                          <div className="addList tmeSlot">
                            <label className="tmeLabel">For cabinet consultation</label>
                            <input
                              type="text"
                              value={cabinetConsultationTime}
                              onChange={e => setCabinetConsultationTime(e.target.value)}
                              disabled={isFormDisabled}
                            />
                            <select
                              value={cabinetConsultationTimeUnit}
                              onChange={e => handleCabinetConsultationTimeUnitChange(e.target.value)}
                              disabled={isFormDisabled}>
                              <option>Minute</option>
                              <option>Hour</option>
                            </select>
                          </div>
                        </li>
                      ) : null}
                      {!isSaveClicked && (
                        <li>
                          {saveBtnDis ? (
                            <button className="saveBtn">Please wait...</button>
                          ) : (
                            <button className="saveBtn" onClick={handleSave} disabled={isSaveDisabled || isFormDisabled}>
                              Save
                            </button>
                          )}
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </div>

              <div className="setRight">
                {screenLoading ? (
                  <>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                      <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                    </div>
                  </>
                ) : (
                  <>
                    <button className="speceficBtn" onClick={openSpecificDatePopup}>
                      Make date specific changes
                    </button>
                    <button className="holidayBtn" onClick={openPopup}>
                      Schedule holiday
                    </button>
                    {isSaveClicked && (
                      <button className="editBtn" onClick={handleEdit}>
                        Edit availability
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Popup Component */}
      {isPopupOpen && (
        <div className="popup holidayPopup">
          <div className="popup-content">
            <button onClick={closePopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="popupInner">
              <div className="calendar-section">
                <h3>Schedule holiday</h3>
                <div className="overlayBtn"></div>
                <Calendar
                  onChange={handleDateClick}
                  value={calendarValue}
                  tileClassName={tileClassName}
                  onActiveStartDateChange={handleActiveStartDateChange}
                />
              </div>
              <div className="selected-dates">
                <ul>
                  {selectedDates.length > 0 ? (
                    selectedDates.map((date, index) => (
                      <li key={index} className="selected-date">
                        {date}
                        <button onClick={() => handleRemoveSelectedDate(date)}>✕</button>
                      </li>
                    ))
                  ) : (
                    <div className="NoHolidayDiv">
                      <ul>
                        <li>No holidays have been scheduled for this month. Please click on the dates to set up your holidays.</li>
                      </ul>
                    </div>
                  )}
                </ul>
                {selectedDates.length > 0 && (
                  <button onClick={closePopup} className="saveBtn2">
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specific Date Popup Component */}
      {isSpecificDatePopupOpen && (
        <div className="popup holidayPopup speceficPopup">
          <div className="popup-content">
            <button onClick={closeSpecificDatePopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="popupInner">
              <div className="calendar-section">
                <h3>Select a specific date</h3>
                <div className="overlayBtn"></div>
                <Calendar onChange={handleSpecificDateClick} value={specificDate} tileClassName={() => null} />
              </div>
              <div className="specific-date-slots">
                <div className="notAvailable">
                  <input type="checkbox" value={docNotAvailCheckBox} onChange={e => setDocNotAvailCheckBox(e.target.checked)} checked={docNotAvailCheckBox} /> I
                  wouldn’t be available for this day
                </div>
                {!docNotAvailCheckBox ? (
                  <div className="upcomingAppoinment avalabilityDiv">
                    {specificDate && (
                      <div>
                        <h3>{specificDate && specificDate?.toDateString()}</h3>
                        <ul className="avalabilityForm">
                          <li>
                            <div className="addList dateAddList">
                              <div className="CloneDiv">
                                <label>Start time:</label>
                                <input type="time" value={specificDateStartTime} onChange={e => setSpecificDateStartTime(e.target.value)} />
                                <label>End time:</label>
                                <input type="time" value={specificDateEndTime} onChange={e => setSpecificDateEndTime(e.target.value)} />
                                <button onClick={handleAddSpecificDateTimeSlot}>Add</button>
                              </div>
                              {dateSpecTimeSlots?.length > 0 &&
                                dateSpecTimeSlots?.map((slot, index) => (
                                  <div key={index} className={`loopSlot ${isFormDisabled ? "loopDisable" : ""}`}>
                                    <label>Start time:</label>
                                    <input type="time" value={slot.startTime} readOnly />
                                    <label>End time:</label>
                                    <input type="time" value={slot.endTime} readOnly />
                                    <button onClick={() => handleDaySpecRemoveTimeSlot(specificDate.toDateString(), index, slot?.id)}>Remove</button>
                                  </div>
                                ))}
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                    {specificDate && (
                      <>
                        <h3>Set time slots</h3>
                        <ul className="avalabilityForm">
                          {allDetails?.consult?.["For online consultation"] ? (
                            <li>
                              <div className="addList tmeSlot">
                                <label className="tmeLabel">For online consultation</label>
                                <input
                                  type="text"
                                  value={daySpecOnlineConsultationTimes || 0}
                                  onChange={e => handleOnlineConsultationTimeChange(specificDate.toDateString(), e.target.value)}
                                />
                                <select value={daySpecOnlineConsultationTimeUnit} onChange={e => setDaySpecOnlineConsultationTimeUnit(e.target.value)}>
                                  <option>Minute</option>
                                  <option>Hour</option>
                                </select>
                              </div>
                            </li>
                          ) : null}
                          {allDetails?.consult?.["For cabinet consultation"] ? (
                            <li>
                              <div className="addList tmeSlot">
                                <label className="tmeLabel">For cabinet consultation</label>
                                <input
                                  type="text"
                                  value={daySpecCabinetConsultationTimes || 0}
                                  onChange={e => handleCabinetConsultationTimeChange(specificDate.toDateString(), e.target.value)}
                                />
                                <select value={daySpecCabinetConsultationTimeUnit} onChange={e => setDaySpecCabinetConsultationTimeUnit(e.target.value)}>
                                  <option>Minute</option>
                                  <option>Hour</option>
                                </select>
                              </div>
                            </li>
                          ) : null}
                          <li>
                            <button className="saveBtn" onClick={() => handleSpecificDateSave()} disabled={saveBtnDis}>
                              {saveBtnDis ? "Please wait..." : "Save"}
                            </button>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetAvailability;
