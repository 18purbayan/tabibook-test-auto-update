import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Modal from "react-modal";
import {toast} from "react-toastify";
import Afterloginheader from "../../components/MainHeader/Afterloginheader";
import {addPatientMemberApi, createAppointmentApi, dateAvailabilityApi, getPatientListByDoctorApi} from "../../services/apiService";
import Skeleton from "react-loading-skeleton";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {format} from "date-fns";
import {useUserContext} from "../../context/UserContext";

import docimg from "../../assets/images/DocImg.png";
import CrossIcon from "../../assets/images/CrossIcon.svg";
import StarIcon from "../../assets/images/StarIcon.svg";
import VideoIcon from "../../assets/images/VideoIcon.svg";
import CabinetIcon from "../../assets/images/CabinetIcon.svg";
import UserIcon from "../../assets/images/User_Icon.svg";
import CalanderIcon from "../../assets/images/CalanderIcon.svg";
import LocIcon from "../../assets/images/LocationIcon.svg";
import StethIcon from "../../assets/images/StethoscopeIcon.svg";
import NoImage from "../../assets/images/no-image-avatar.png";
import {IMAGE_URL} from "../../app_url";

Modal.setAppElement("#root");

const BookAppointment = () => {
  const {userData, searchValuesContext} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStep, setSelectedStep] = useState(1);
  const [choosePatient, setChoosePatient] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alreadyVisit, setAlreadyVisit] = useState("yes");
  const [allDetails, setAllDetails] = useState();
  const [patientForm, setPatientForm] = useState({name: "", age: "", relation: ""});
  const [addBtnDis, setAddBtnDis] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [chooseReason, setChooseReason] = useState("");
  const [consultType, setConsultType] = useState("");
  const [doctorSavedCunsultType, setDoctorSavedCunsultType] = useState("0");
  const [date, setDate] = useState(new Date());
  const [availDates, setAvailDates] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [appTimeDateAlreadySelected, setAppTimeDateAlreadySelected] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handlePatientMemberChange = event => {
    setChoosePatient(parseInt(event.target.value));
  };

  const handleAlreadyVisitChange = event => {
    setAlreadyVisit(event.target.value);
  };

  const handleReasonChange = event => {
    setChooseReason(parseInt(event.target.value));
  };

  const handleConsultTypeChange = event => {
    setConsultType(event.target.value);
  };

  const handleChooseResCont = () => {
    if (!chooseReason) {
      toast.warning("Please choose a reason to continue.", {autoClose: 1500});
    } else {
      setSelectedStep(4);
    }
  };

  const handleChooseConsultCont = async () => {
    if (!consultType) {
      toast.warning("Please choose a consultation type to continue.", {autoClose: 1500});
    } else {
      if (appTimeDateAlreadySelected) {
        setSelectedStep(6);
      } else {
        setSelectedStep(5);
      }

      let tempconsultType = consultType === "Video" ? "For online consultation" : consultType === "Cabinet" ? "For cabinet consultation " : "";
      getDateAvailabilityList(searchValuesContext?.user_id, format(date, "yyyy-MM-dd"), tempconsultType);
    }
  };

  const handleChooseTimeCont = async () => {
    if (!selectedTime) {
      toast.warning("Please choose a timing for your appointment.", {autoClose: 1500});
    } else {
      setSelectedStep(6);
    }
  };

  const handleDateChange = newDate => {
    setDate(newDate);
    setSelectedStep(5);
    let tempconsultType = consultType === "Video" ? "For online consultation" : consultType === "Cabinet" ? "For cabinet consultation " : "";
    setSelectedTime(null);
    getDateAvailabilityList(searchValuesContext?.user_id, format(newDate, "yyyy-MM-dd"), tempconsultType);
  };

  const getPatientList = async docId => {
    if (docId) {
      setScreenLoading(true);
      try {
        let formData = new FormData();
        formData.append("doctor_id", docId);

        let response = await getPatientListByDoctorApi(formData);
        if (response) {
          if (response.data.res === true) {
            setAllDetails(response.data);
            if (response.data.data.length > 0) {
              setChoosePatient(response.data.data[0].user_id);
              setDoctorSavedCunsultType(response.data.doctor.consultation_type ? response.data.doctor.consultation_type.toString() : "0");
            } else {
              setChoosePatient(null);
              setDoctorSavedCunsultType("0");
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
    }
  };

  const getDateAvailabilityList = async (docId, date, consultationType) => {
    if (docId && date && consultationType) {
      setScreenLoading(true);
      try {
        let formData = new FormData();
        formData.append("doctor_id", docId);
        formData.append("date", date);
        formData.append("consultation_types", consultationType);

        let response = await dateAvailabilityApi(formData);
        if (response) {
          if (response.data.res === true) {
            const notAvailableSet = new Set(response.data.notAvailable.map(({time}) => time));
            const tempArray = response.data.data.filter(item => !notAvailableSet.has(item));
            setAvailDates(tempArray);
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
    }
  };

  const handleAddPatient = async () => {
    if (!patientForm.name) {
      toast.warning("Please enter name.", {autoClose: 1500});
    } else if (!patientForm.age) {
      toast.warning("Please enter age.", {autoClose: 1500});
    } else if (!patientForm.relation) {
      toast.warning("Please enter relation.", {autoClose: 1500});
    } else {
      setAddBtnDis(true);
      try {
        let formData = new FormData();
        formData.append("name", patientForm.name);
        formData.append("age", patientForm.age);
        formData.append("relation", patientForm.relation);

        let response = await addPatientMemberApi(formData);
        if (response) {
          if (response.data.res === true) {
            closeModal();
            setPatientForm({name: "", age: "", relation: ""});
            getPatientList(searchValuesContext?.user_id);
            toast.success(response.data.msg ? response.data.msg : "Member added successfully", {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setAddBtnDis(false);
      } catch (error) {
        setAddBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  const handleConfirmAppoinment = async () => {
    if (choosePatient && date && alreadyVisit && consultType && selectedTime) {
      setAddBtnDis(true);
      try {
        let formData = new FormData();
        formData.append("doctor_id", searchValuesContext?.user_id);
        formData.append("patient_id", choosePatient);
        formData.append("appointment_date", format(date, "yyyy-MM-dd"));
        formData.append("already_visit", alreadyVisit);
        formData.append("consultation_reason", chooseReason ? chooseReason : "0");
        formData.append(
          "consultation_type",
          consultType === "Video" ? "For online consultation" : consultType === "Cabinet" ? "For cabinet consultation " : ""
        );
        formData.append("time", selectedTime);
        let response = await createAppointmentApi(formData);
        if (response) {
          if (response.data.res === true) {
            navigate("/appointment-booking/confirm", {
              state: {time: selectedTime, date: format(date, "EEEE, MMMM d, yyyy"), doctorDetails: allDetails?.doctor},
            });
            toast.success(response.data.msg ? response.data.msg : "Appointment booked successfully.", {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setAddBtnDis(false);
      } catch (error) {
        setAddBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      toast.error("Something went wrong. Please try again.", {autoClose: 1500});
    }
  };

  useEffect(() => {
    getPatientList(searchValuesContext?.user_id);
    if (searchValuesContext?.selectedAppDate && searchValuesContext?.selectedAppTime) {
      setDate(new Date(searchValuesContext?.selectedAppDate));
      setSelectedTime(searchValuesContext?.selectedAppTime);
      setAppTimeDateAlreadySelected(true);
    } else {
      setAppTimeDateAlreadySelected(false);
    }
  }, []);

  return (
    <div className="Main">
      <Afterloginheader />

      <div className="BookAppWrapper">
        <div className="HeadingBar">
          <div className="ContainerPnl">
            <div className="ColPnl-12">
              <h3>Book your appointment</h3>
              <p>Fill in the following information</p>
            </div>
          </div>
        </div>
        {selectedStep === 1 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button
                  className="PrevBtn"
                  onClick={() => {
                    location?.state?.from ? navigate(location?.state?.from) : navigate("/");
                  }}>
                  Go to back previous step
                </button>
                <h2>Choose the patient name</h2>
                <ul className="PatientList">
                  {screenLoading ? (
                    <div className="Card">
                      <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                      <br />
                      <p>
                        <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                      </p>
                    </div>
                  ) : allDetails?.data?.length > 0 ? (
                    allDetails?.data?.map((item, index) => (
                      <li key={index} onClick={() => setChoosePatient(parseInt(item?.user_id))}>
                        <span className="PatientName">
                          <span className={userData?.users?.id === item?.user_id ? "PatientShortName" : "PatientShortName OtherMember"}>{item?.initials}</span>
                          <span className="NameWrapper">
                            {item?.first_name} {item?.last_name}
                            {userData?.users?.id !== item?.user_id ? (
                              <span className="OtherMember">
                                {item?.relation}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <span className="SelectOption">
                          <input type="radio" value={item?.user_id} checked={choosePatient === parseInt(item?.user_id)} onChange={handlePatientMemberChange} />
                        </span>
                      </li>
                    ))
                  ) : null}
                </ul>
                {!screenLoading ? (
                  <>
                    <button type="button" className="IconBtn" onClick={openModal}>
                      Add new member
                    </button>
                    <p>
                      <button className="CmnBtn" onClick={() => setSelectedStep(2)}>
                        Continue
                      </button>
                    </p>
                  </>
                ) : null}
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    {appTimeDateAlreadySelected && (
                      <li>
                        {format(date, "MMMM d")} {selectedTime}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStep === 2 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button className="PrevBtn" onClick={() => setSelectedStep(1)}>
                  Go to back previous step
                </button>
                <h2>Did you already visit this doctor ?</h2>
                <ul className="PatientList AlreadyVisit">
                  <li onClick={() => setAlreadyVisit("yes")}>
                    <span className="PatientName">
                      <span className="NameWrapper">Yes</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="yes" checked={alreadyVisit === "yes"} onChange={handleAlreadyVisitChange} />
                    </span>
                  </li>
                  <li onClick={() => setAlreadyVisit("no")}>
                    <span className="PatientName">
                      <span className="NameWrapper">No</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="no" checked={alreadyVisit === "no"} onChange={handleAlreadyVisitChange} />
                    </span>
                  </li>
                </ul>
                <p>
                  <button className="CmnBtn" onClick={() => setSelectedStep(3)}>
                    Continue
                  </button>
                </p>
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    {appTimeDateAlreadySelected && (
                      <li>
                        {format(date, "MMMM d")} {selectedTime}
                      </li>
                    )}
                    <li>Choose the patient name</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStep === 3 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button className="PrevBtn" onClick={() => setSelectedStep(2)}>
                  Go to back previous step
                </button>
                <h2>What is the reason of the consultation?</h2>
                <ul className="PatientList AlreadyVisit">
                  {allDetails?.consultationReason?.map((item, index) => (
                    <li key={index} onClick={() => setChooseReason(parseInt(item?.id))}>
                      <span className="PatientName">
                        <span className="NameWrapper">{item?.name}</span>
                      </span>
                      <span className="SelectOption">
                        <input type="radio" value={item?.id} checked={chooseReason === parseInt(item?.id)} onChange={handleReasonChange} />
                      </span>
                    </li>
                  ))}
                </ul>
                <p>
                  <button className="CmnBtn" onClick={() => handleChooseResCont()}>
                    Continue
                  </button>{" "}
                  <button
                    className="CmnBtn skipBtn"
                    onClick={() => {
                      setSelectedStep(4);
                      setChooseReason(null);
                    }}>
                    Skip
                  </button>
                </p>
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    {appTimeDateAlreadySelected && (
                      <li>
                        {format(date, "MMMM d")} {selectedTime}
                      </li>
                    )}
                    <li>Choose the patient name</li>
                    <li>Did you already visit this doctor?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStep === 4 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button className="PrevBtn" onClick={() => setSelectedStep(3)}>
                  Go to back previous step
                </button>
                <h2>Did you want to consultation via video or cabinet?</h2>
                <ul className="PatientList ConsultOption">
                  {doctorSavedCunsultType === "0" ? (
                    <>
                      <li onClick={() => setConsultType("Video")}>
                        <span className="PatientName">
                          <img src={VideoIcon} alt="" />
                          <span className="NameWrapper">Video consultation</span>
                        </span>
                        <span className="SelectOption">
                          <input type="radio" value="Video" checked={consultType === "Video"} onChange={handleConsultTypeChange} />
                        </span>
                      </li>
                      <li onClick={() => setConsultType("Cabinet")}>
                        <span className="PatientName">
                          <img src={CabinetIcon} alt="" />
                          <span className="NameWrapper">Cabinet consultation</span>
                        </span>
                        <span className="SelectOption">
                          <input type="radio" value="Cabinet" checked={consultType === "Cabinet"} onChange={handleConsultTypeChange} />
                        </span>
                      </li>
                    </>
                  ) : doctorSavedCunsultType === "1" ? (
                    <>
                      <li onClick={() => setConsultType("Video")}>
                        <span className="PatientName">
                          <img src={VideoIcon} alt="" />
                          <span className="NameWrapper">Video consultation</span>
                        </span>
                        <span className="SelectOption">
                          <input type="radio" value="Video" checked={consultType === "Video"} onChange={handleConsultTypeChange} />
                        </span>
                      </li>
                    </>
                  ) : doctorSavedCunsultType === "2" ? (
                    <>
                      <li onClick={() => setConsultType("Cabinet")}>
                        <span className="PatientName">
                          <img src={CabinetIcon} alt="" />
                          <span className="NameWrapper">Cabinet consultation</span>
                        </span>
                        <span className="SelectOption">
                          <input type="radio" value="Cabinet" checked={consultType === "Cabinet"} onChange={handleConsultTypeChange} />
                        </span>
                      </li>
                    </>
                  ) : null}
                </ul>
                <p>
                  <button className="CmnBtn" onClick={() => handleChooseConsultCont()}>
                    Continue
                  </button>
                </p>
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    {appTimeDateAlreadySelected && (
                      <li>
                        {format(date, "MMMM d")} {selectedTime}
                      </li>
                    )}
                    <li>Choose the patient name</li>
                    <li>Did you already visit this doctor?</li>
                    {chooseReason ? <li>What is the reason of the consultation?</li> : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStep === 5 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button className="PrevBtn" onClick={() => setSelectedStep(4)}>
                  Go to back previous step
                </button>
                <h2>When are you the most comfortable?</h2>
                <div className="DateTimeWrapper">
                  <div className="LftDate">
                    <Calendar onChange={handleDateChange} value={date} minDate={new Date()} />
                  </div>
                  <div className="RhtTime">
                    <div className="DayDate">
                      <span>{format(date, "eeee")}</span>
                      <br />
                      {format(date, "MMMM d")}
                    </div>

                    {screenLoading ? (
                      <Skeleton count={2} height={20} width={"80%"} baseColor="#cfd5f9" />
                    ) : (
                      <ul>
                        {availDates?.length > 0 ? (
                          availDates?.map((item, index) => (
                            <li key={index} className={selectedTime === item ? "active" : ""} onClick={() => setSelectedTime(item)}>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <p>No times available for this day.</p>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <p>
                  <button className="CmnBtn" onClick={() => handleChooseTimeCont()}>
                    Continue
                  </button>
                </p>
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    {appTimeDateAlreadySelected && (
                      <li>
                        {format(date, "MMMM d")} {selectedTime}
                      </li>
                    )}
                    <li>Choose the patient name</li>
                    <li>Did you already visit this doctor?</li>
                    {chooseReason ? <li>What is the reason of the consultation?</li> : null}
                    <li>Did you want to consultation via video or cabinet?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStep === 6 ? (
          <div className="ContainerPnl">
            <div className="ColPnl-8">
              <div className="LftBox">
                <button className="PrevBtn" onClick={() => (appTimeDateAlreadySelected ? setSelectedStep(4) : setSelectedStep(5))}>
                  Go to back previous step
                </button>
                <h2>Your appointment in detail</h2>
                <ul className="PatientList ConsultOption BookingDetails">
                  <li>
                    <span className="PatientName">
                      <img className="profilePic" src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                      <span className="NameWrapper">
                        Dr {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={CalanderIcon} alt="" />
                      <span className="NameWrapper">
                        {format(date, "MMMM d")} {selectedTime}
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={LocIcon} alt="" />
                      <span className="NameWrapper">{allDetails?.doctor?.cabin_address}</span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={StethIcon} alt="" />
                      <span className="NameWrapper">{allDetails?.doctor?.speciality}</span>
                    </span>
                  </li>
                </ul>
                <p>
                  <button className="CmnBtn FullwidthBtn" onClick={() => handleConfirmAppoinment()} disabled={addBtnDis}>
                    {addBtnDis ? "Please wait..." : "Confirm appointment"}
                  </button>
                </p>
                <p className="NotePara">By confirming this appointment, you agree to honour it.</p>
              </div>
            </div>
            <div className="ColPnl-4">
              <div className="RhtBox">
                <ul className="SearchedDoctors">
                  <li>
                    <div className="DocImg">
                      <img src={allDetails?.doctor?.profile_pic ? IMAGE_URL + allDetails?.doctor?.profile_pic : NoImage} alt="" />
                    </div>
                    <div className="DocDtls">
                      <span className="DocName">
                        {allDetails?.doctor?.first_name} {allDetails?.doctor?.last_name}
                      </span>
                      <span className="DocType">{allDetails?.doctor?.speciality}</span>
                      <span className="DocRating">
                        <img src={StarIcon} alt="" /> 4.5
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="AppoDetails">
                  <h5>Your appointment in detail</h5>
                  <ul>
                    <li>Choose the patient name</li>
                    <li>Did you already visit this doctor?</li>
                    {chooseReason ? <li>What is the reason of the consultation?</li> : null}
                    <li>Did you want to consultation via video or cabinet?</li>
                    <li>When are you the most comfortable?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add new member popup */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="">
        <img className="CloseModalBtn" src={CrossIcon} onClick={closeModal} alt="" />
        <h2>Add new member</h2>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.</p>
        <ul className="AddNewMember">
          <li>
            <label>New member name</label>
            <input type="text" placeholder="Type here" value={patientForm.name} onChange={e => setPatientForm(prev => ({...prev, name: e.target.value}))} />
          </li>
          <li>
            <label>New member age</label>
            <input type="number" placeholder="Type here" value={patientForm.age} onChange={e => setPatientForm(prev => ({...prev, age: e.target.value}))} />
          </li>
          <li>
            <label>Relationship with you</label>
            <input
              type="text"
              placeholder="Type here"
              value={patientForm.relation}
              onChange={e => setPatientForm(prev => ({...prev, relation: e.target.value}))}
            />
          </li>
          <li>
            <button className="CmnBtn" type="button" onClick={() => handleAddPatient()} disabled={addBtnDis}>
              {addBtnDis ? "Please wait..." : "Add New"}
            </button>
          </li>
        </ul>
      </Modal>
    </div>
  );
};

export default BookAppointment;
