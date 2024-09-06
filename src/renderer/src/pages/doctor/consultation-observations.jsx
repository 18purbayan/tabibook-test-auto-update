import React, {useEffect, useMemo, useRef, useState} from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import Calendar from "react-calendar";
import EditorImg from "../../assets/images/editor-img.svg";
import ChatAttachIcon from "../../assets/images/appointment-attach-icon.svg";

import templateImg1 from "../../assets/images/template-img1.svg";
import templateImg2 from "../../assets/images/template-img2.svg";
import templateImg3 from "../../assets/images/template-img3.svg";
import templateImg4 from "../../assets/images/template-img4.svg";
import templateImg5 from "../../assets/images/template-img5.svg";
import templateImg6 from "../../assets/images/template-img6.svg";
import expandIconfrom from "../../assets/images/expand-icon.svg";
import {toast} from "react-toastify";
import {
  appointmentDetailsApi,
  cancelAppointmentApi,
  dateAvailabilityApi,
  getCancelReasonApi,
  getRescheduleReasonApi,
  myAccountDetailsApi,
  rescheduleAppointmentApi,
} from "../../services/apiService";
import {useParams} from "react-router-dom";
import cancelIcon from "../../assets/images/cancel-btn.svg";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import JoditEditor from "jodit-react";
import EmojiPicker from "emoji-picker-react";
import LoadingPage from "../../components/LoadingPage";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

const ConsultationObservations = ({placeholder}) => {
  const {appId} = useParams();
  const editor = useRef(null);
  const editor2 = useRef(null);
  const editor3 = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiPickerRef2 = useRef(null);
  const emojiPickerRef3 = useRef(null);

  //
  const [activeIndexes, setActiveIndexes] = useState([0, 1, 2]);
  const [cancelReasonList, setCancelReasonList] = useState();
  const [rescheduleReasonList, setRescheduleReasonList] = useState();
  const [cancelReason, setCancelReason] = useState();
  const [rescheduleReason, setRescheduleReason] = useState();
  const [modalBtnDis, setModalBtnDis] = useState(false);
  const [reschedulePopupShow, setReschedulePopupShow] = useState(false);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [availDates, setAvailDates] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [allDetails, setAllDetails] = useState();
  const [appointmentDetails, setAppointmentDetails] = useState();
  const [screenLoading, setScreenLoading] = useState(false);
  const [skelLoading, setSkelLoading] = useState(false);

  const [examinationContent, setExaminationContent] = useState("");
  const [otherNotesContent, setOtherNotesContent] = useState("");
  const [prescriptionContent, setPrescriptionContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiPicker1, setShowEmojiPicker1] = useState(false);
  const [showEmojiPicker2, setShowEmojiPicker2] = useState(false);

  useOnClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));
  useOnClickOutside(emojiPickerRef2, () => setShowEmojiPicker1(false));
  useOnClickOutside(emojiPickerRef3, () => setShowEmojiPicker2(false));

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter the answers to your questioning: symptoms, anamnesis...",
      removeButtons: [
        "video",
        "speechRecognize",
        "spellcheck",
        "hr",
        "table",
        "symbols",
        "ai-commands",
        "ai-assistant",
        "brush",
        "fullsize",
        "preview",
        "dots",
        "file",
      ],
      extraButtons: [
        {
          name: "😊",
          // name: "☻",
          tooltip: "Emoji",
          icon: "jodit-icon jodit-icon-emoji",
          exec: () => setShowEmojiPicker(!showEmojiPicker),
        },
      ],
    }),
    [placeholder, showEmojiPicker]
  );

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter the answers to your questioning: symptoms, anamnesis...",
      removeButtons: [
        "video",
        "speechRecognize",
        "spellcheck",
        "hr",
        "table",
        "symbols",
        "ai-commands",
        "ai-assistant",
        "brush",
        "fullsize",
        "preview",
        "dots",
        "file",
      ],
      extraButtons: [
        {
          name: "😊",
          tooltip: "Emoji",
          icon: "jodit-icon jodit-icon-emoji",
          exec: () => setShowEmojiPicker1(!showEmojiPicker1),
        },
      ],
    }),
    [placeholder, showEmojiPicker1]
  );

  const config2 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter here...",
      removeButtons: [
        "video",
        "speechRecognize",
        "spellcheck",
        "hr",
        "table",
        "symbols",
        "ai-commands",
        "ai-assistant",
        "brush",
        "fullsize",
        "preview",
        "dots",
        "file",
      ],
      extraButtons: [
        {
          name: "😊",
          tooltip: "Emoji",
          icon: "jodit-icon jodit-icon-emoji",
          exec: () => setShowEmojiPicker2(!showEmojiPicker2),
        },
      ],
    }),
    [placeholder, showEmojiPicker2]
  );

  const toggleAccordion = index => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter(i => i !== index));
    } else {
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  // Tab visibility
  const [activeTab, setActiveTab] = useState("observations");

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  //
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleProfileMoadl = () => {
    setShowProfileModal(!showProfileModal);
  };

  const [showAddIndicator, setShowAddIndicator] = useState(false);

  const toggleAddIndicator = () => {
    setShowAddIndicator(!showAddIndicator);
  };

  const [showEditIndicator, setShowEditIndicator] = useState(false);

  const toggleEditIndicator = () => {
    setShowEditIndicator(!showEditIndicator);
  };

  const [showRemoveIndicator, setShowRemoveIndicator] = useState(false);

  const toggleRemoveIndicator = () => {
    setShowRemoveIndicator(!showRemoveIndicator);
  };

  const [showRemoveMedicalBackgroundItem, setShowRemoveMedicalBackgroundItem] = useState(false);

  const toggleRemoveMedicalBackgroundItem = () => {
    setShowRemoveMedicalBackgroundItem(!showRemoveMedicalBackgroundItem);
  };

  const [showMedicalReport, setShowMedicalReport] = useState(false);

  const toggleMedicalReport = () => {
    setShowMedicalReport(!showMedicalReport);
  };

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const toggleTemplateModal = () => {
    setShowTemplateModal(!showTemplateModal);
  };

  const [DataObj, setDataObj] = useState([
    {
      id: 1,
      title: "Antecedents",
    },
    {
      id: 2,
      title: "Life style",
    },
    {
      id: 3,
      title: "Allergies",
    },
    {
      id: 4,
      title: "Current treatments",
    },
  ]);

  const [showAddMedicalBackground, setShowAddMedicalBackground] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [medicalBackgroundTitle, setMedicalBackgroundTitle] = useState();

  const toggleAddMedicalBackground = () => {
    setShowAddMedicalBackground(!showAddMedicalBackground);
  };

  const buttonTitle = item => {
    toggleAddMedicalBackground();
    setMedicalBackgroundTitle(item.title);
    setSelectedId(item.id);
  };

  const saveMedicalButton = () => {
    toggleAddMedicalBackground();
    setinputValue("");

    // Find the index of the item with the matching id
    const index = DataObj.findIndex(item => item.id === selectedId);

    if (index !== -1) {
      // Ensure the item was found
      // Assuming there is an array property in DataObj[index] to push to
      if (!DataObj[index].values) {
        DataObj[index].values = []; // Initialize the array if it doesn't exist
      }
      DataObj[index].values.push(inputValue); // Push the inputValue to the array
    }
  };

  const [inputValue, setinputValue] = useState();

  const medicalBackgroundInput = value => {
    setinputValue(value);
  };

  const removeItem = (itemId, value) => {
    const updatedDataObj = DataObj.map(item => {
      if (item.id === itemId) {
        const updatedValues = item.values.filter(val => val !== value); //filter array method

        // Set values to an empty array if the last item is removed
        return {
          ...item, //Spread operator
          values: updatedValues.length > 0 ? updatedValues : [],
        };
      }
      return item;
    });

    setDataObj(updatedDataObj); // Update state with the filtered data
  };

  const [showPatientDocument, setShowPatientDocument] = useState(false);

  const togglePatientDocument = () => {
    setShowPatientDocument(!showPatientDocument);
  };

  const [showCancelAppointmnet, setShowCancelAppointmnet] = useState(false);

  const toggleCancelAppointmnet = () => {
    setShowCancelAppointmnet(!showCancelAppointmnet);
  };

  const [showReferDoctorModal, setShowReferDoctorModal] = useState(false);

  const toggleReferDoctor = () => {
    setShowReferDoctorModal(!showReferDoctorModal);
  };

  const getProfileDetails = async () => {
    try {
      let response = await myAccountDetailsApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          setSelectedTime(null);
          getDateAvailabilityList(response.data.data?.id, format(calendarValue, "yyyy-MM-dd"), "For online consultation");
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getCancelReason = async () => {
    try {
      let response = await getCancelReasonApi();
      if (response) {
        if (response.data.res === true) {
          setCancelReasonList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getRescheduleReason = async () => {
    try {
      let response = await getRescheduleReasonApi();
      if (response) {
        if (response.data.res === true) {
          setRescheduleReasonList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason) {
      toast.warning("Please select cancel reason.", {autoClose: 1500});
    } else {
      try {
        setModalBtnDis(true);
        const fd = new FormData();
        fd.append("id", appId);
        fd.append("reason", cancelReason);

        let response = await cancelAppointmentApi(fd);
        if (response) {
          if (response.data.res === true) {
            toast.success(response.data.msg ? response.data.msg : "Appointment cancelled successfully.", {autoClose: 1500});
            setShowCancelAppointmnet(false);
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
  };

  const handleDateClick = async date => {
    const newDate = date.toDateString();
    setCalendarValue(date);
    getDateAvailabilityList(allDetails?.id, format(date, "yyyy-MM-dd"), "For online consultation");
  };

  const tileClassName = ({date}) => {
    const formattedDate = date.toDateString();
    return calendarValue === formattedDate ? "highlighted-date" : null;
  };

  const handleActiveStartDateChange = ({action, activeStartDate, view}) => {
    if (action === "prev" || action === "next") {
      const formattedDate = format(activeStartDate, "yyyy-MM");
      getHolidays(formattedDate);
    }
  };

  const getDateAvailabilityList = async (docId, date, consultationType) => {
    if (docId && date && consultationType) {
      try {
        setSkelLoading(true);
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
            setSelectedTime(null);
            setRescheduleReason(null);
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setSkelLoading(false);
      } catch (error) {
        setSkelLoading(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  const handleReschedule = async () => {
    if (!selectedTime) {
      toast.warning("Please select a time.", {autoClose: 1500});
    } else if (!rescheduleReason) {
      toast.warning("Please select reschedule reason.", {autoClose: 1500});
    } else {
      try {
        setModalBtnDis(true);
        const fd = new FormData();
        fd.append("id", appId);
        fd.append("reason", rescheduleReason);
        fd.append("appointment_date", format(calendarValue, "yyyy-MM-dd"));
        fd.append("time", selectedTime);

        let response = await rescheduleAppointmentApi(fd);
        if (response) {
          if (response.data.res === true) {
            toast.success(response.data.msg ? response.data.msg : "Appointment rescheduled successfully.", {autoClose: 1500});
            getDateAvailabilityList(allDetails?.id, format(calendarValue, "yyyy-MM-dd"), "For online consultation");
            setReschedulePopupShow(false);
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
  };

  const calculateAge = dob => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday has not occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const getAppointmentDetails = async () => {
    try {
      setScreenLoading(true);
      const fd = new FormData();
      fd.append("id", appId);

      let response = await appointmentDetailsApi(fd);
      if (response) {
        if (response.data.res === true) {
          setAppointmentDetails(response.data.data[0]);
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

  useEffect(() => {
    getAppointmentDetails();
    getProfileDetails();
    getCancelReason();
    getRescheduleReason();
  }, []);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />

        {screenLoading && <LoadingPage />}
        <div className="RoxBox">
          <div className="LftDoctorConsultationObservations">
            <h3>All appointments</h3>
            <ul className="BreadCambs">
              <li>
                <a href="#">Appointments</a>
              </li>
              <li>Appointment details</li>
            </ul>
          </div>
          <div className="RghtDoctorConsultationObservations">
            <div className="RghtDoctorConsultationObservationsTop">
              <div className="CustomSelect">
                <select>
                  <option>Status</option>
                </select>
              </div>
              <ul className="BtnList">
                <li>
                  <button className="RescheduleBtn" onClick={() => setReschedulePopupShow(true)}>
                    Reschedule
                  </button>
                </li>
                <li>
                  <button className="CancelBtn" onClick={toggleCancelAppointmnet}>
                    Cancel
                  </button>
                </li>
                <li>
                  <button className="ReferDoctorBtn" onClick={toggleReferDoctor}>
                    Refer a Doctor
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="RoxBox">
          <div className="LftDoctorConsultationObservations">
            <div className="Card">
              <div className="TopCardProfile">
                <h3>
                  {appointmentDetails?.patient_details[0].first_name} {appointmentDetails?.patient_details[0].last_name}
                </h3>
                <div className="PatientProfileInfo">
                  {!screenLoading ? (
                    <span className="AgeText">
                      {appointmentDetails?.patient_details[0].age || calculateAge(appointmentDetails?.patient_details[0].dob)} age
                    </span>
                  ) : null}
                  <button className="EditButtonIcon" onClick={toggleProfileMoadl}></button>
                </div>
              </div>
              <div className="BottomCardProfile">
                <ul>
                  <li>
                    <label>Patient phone number</label>
                    <h4>{appointmentDetails?.patient_details[0].cell_phone}</h4>
                  </li>
                </ul>
              </div>
            </div>
            <div className="Accordion">
              <div className="accordion-card">
                <div className={`accordion-header ${activeIndexes.includes(0) ? "active" : ""}`} onClick={() => toggleAccordion(0)}>
                  Medical conditions
                </div>
                {activeIndexes.includes(0) && (
                  <div className="accordion-content">
                    <ul className="ChooseitemList">
                      <li onClick={toggleMedicalReport}>
                        <span className="Span1">Patient had a diabetics</span>
                        <span className="Span2">
                          <span>3 day ago</span>
                        </span>
                      </li>
                      <li onClick={toggleMedicalReport}>
                        <span className="Span1">Patient had a sugar</span>
                        <span className="Span2">
                          <span>1 week ago</span>
                        </span>
                      </li>
                      <li onClick={toggleMedicalReport}>
                        <span className="Span1">Amenia</span>
                        <span className="Span2">
                          <span>1 mon ago</span>
                        </span>
                      </li>
                      <li onClick={toggleMedicalReport}>
                        <span className="Span1">Bleeding disorders</span>
                        <span className="Span2">
                          <span>3 mon ago</span>
                        </span>
                      </li>
                      <li onClick={toggleMedicalReport}>
                        <span className="Span1">Cardio respiratory disorders</span>
                        <span className="Span2">
                          <span>1 year ago</span>
                        </span>
                      </li>
                    </ul>
                    {showMedicalReport && (
                      <div className="modal MedicalReportModal" onClick={toggleMedicalReport}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                          <div className="modal-header">
                            <button className="CloseButton" onClick={toggleMedicalReport}></button>
                            <h3>Patient had a sugar</h3>
                            <ul className="PatientDetailsList">
                              <li>
                                <label>Date:</label>
                                <span className="LabelValue">23 January, 2024</span>
                              </li>
                              <li>
                                <label>Patient name</label>
                                <span className="LabelValue">Kastrel Tabrizi</span>
                              </li>
                              <li>
                                <label>Phone number:</label>
                                <span className="LabelValue">980695489</span>
                              </li>
                              <li>
                                <label>Age:</label>
                                <span className="LabelValue">34</span>
                              </li>
                            </ul>
                          </div>
                          <div className="modal-body">
                            <div className="MedicalReportBox">
                              <h3>Observation</h3>
                              <h4>Examination </h4>
                              <ul className="ExaminationList">
                                <li>
                                  <strong>General:</strong> Alert and oriented, no acute distress.
                                </li>
                                <li>
                                  <strong>Vital Signs:</strong> BP 130/80 mmHg, HR 76 bpm, RR 18 breaths/min, Temp 98.6°F, BMI 29.
                                </li>
                                <li>
                                  <strong>HEENT:</strong> No abnormalities.
                                </li>
                                <li>
                                  <strong>Cardiovascular:</strong> Regular rate and rhythm, no murmurs or gallops.
                                </li>
                                <li>
                                  <strong>Respiratory:</strong> Clear to auscultation bilaterally.
                                </li>
                                <li>
                                  <strong>Abdomen:</strong> Soft, non-tender, no hepatosplenomegaly.
                                </li>
                                <li>
                                  <strong>Extremities:</strong> No edema, pulses palpable and equal.
                                </li>
                                <li>
                                  <strong>Neurological:</strong> Intact cranial nerves, normal reflexes, no focal deficits.
                                </li>
                                <li>
                                  <strong>Skin:</strong> No lesions or rashes, good skin turgor.
                                </li>
                              </ul>
                              <h4>Other notes</h4>
                              <ul className="NumList">
                                <li>Patient reports persistent high blood sugar levels over the past month.</li>
                                <li>Experiencing fatigue, frequent urination, and increased thirst.</li>
                              </ul>
                            </div>
                            <div className="MedicalReportBox">
                              <h4>Prescription</h4>
                              <ul className="NumList2">
                                <li>
                                  Patient reports persistent high blood sugar levels over the past month.
                                  <ul className="DiscList">
                                    <li>
                                      Dosage: <span>1000 mg</span>
                                    </li>
                                    <li>
                                      Frequency: <span>Twice daily with meals</span>
                                    </li>
                                    <li>
                                      Instructions: <span>Start with 500 mg twice daily for one week, then increase to 1000 mg twice daily.</span>
                                    </li>
                                  </ul>
                                </li>
                                <li>
                                  Experiencing fatigue, frequent urination, and increased thirst.
                                  <ul className="DiscList">
                                    <li>
                                      Dosage: <span>0.6 mg</span>
                                    </li>
                                    <li>
                                      Frequency: <span>Once daily</span>
                                    </li>
                                    <li>
                                      Instructions: <span>Administer subcutaneously once daily, increase dose as per the doctor's instructions.</span>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="accordion-card">
                <div className={`accordion-header ${activeIndexes.includes(1) ? "active" : ""}`} onClick={() => toggleAccordion(1)}>
                  Medical background
                </div>
                {activeIndexes.includes(1) && (
                  <div className="accordion-content">
                    <ul className="MedicalList">
                      {DataObj.map((item, index) => (
                        <li>
                          <div className="ListContentTop">
                            {item.title}
                            <button
                              className="AddButton"
                              onClick={() => {
                                buttonTitle(item);
                              }}></button>
                          </div>
                          {item?.values?.length > 0 && (
                            <ul className="SubList">
                              {item?.values?.map((valItem, valIndex) => {
                                return (
                                  <li>
                                    {valItem}
                                    <button
                                      className="RemoveButton"
                                      onClick={() => removeItem(item.id, valItem)} // Pass item.id and valItem to removeItem
                                    ></button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    {showAddMedicalBackground && (
                      <div className="modal AddIndicatorModal" onClick={toggleAddMedicalBackground}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                          <button className="CloseButton" onClick={toggleAddMedicalBackground}></button>
                          <h3>Add medical background</h3>
                          <div className="BottmContent">
                            <ul className="AddIndicatorList">
                              <li>
                                <label>{medicalBackgroundTitle}</label>
                                <input
                                  type="text"
                                  name="medical background"
                                  value={inputValue}
                                  placeholder="Type here"
                                  className="FormControl"
                                  onChange={e => {
                                    medicalBackgroundInput(e.target.value);
                                  }}
                                />
                              </li>
                            </ul>
                          </div>
                          <ul className="ButtonList">
                            <li>
                              <button
                                className="ModalCloseBtn"
                                onClick={() => {
                                  saveMedicalButton();
                                }}>
                                Save
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="accordion-card">
                <div className={`accordion-header ${activeIndexes.includes(2) ? "active" : ""}`} onClick={() => toggleAccordion(2)}>
                  Patient documents
                </div>
                {activeIndexes.includes(2) && (
                  <div className="accordion-content">
                    <ul className="ChooseitemList">
                      <li onClick={togglePatientDocument}>
                        <span className="Span1">Diabetics test</span>
                        <span className="Span2">
                          <span>3 day ago</span>
                        </span>
                      </li>
                      <li onClick={togglePatientDocument}>
                        <span className="Span1">Sugar test</span>
                        <span className="Span2">
                          <span>1 week ago</span>
                        </span>
                      </li>
                      <li onClick={togglePatientDocument}>
                        <span className="Span1">Amenia test</span>
                        <span className="Span2">
                          <span>1 mon ago</span>
                        </span>
                      </li>
                      <li onClick={togglePatientDocument}>
                        <span className="Span1">LFT blood test</span>
                        <span className="Span2">
                          <span>3 mon ago</span>
                        </span>
                      </li>
                    </ul>
                    {showPatientDocument && (
                      <div className="modal patientDocumentModal" onClick={togglePatientDocument}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                          <div className="modal-header">
                            <button className="modalDownloadBtn" onClick={togglePatientDocument}>
                              Download
                            </button>
                            <div className="numSec">
                              <span>1</span> of 3
                            </div>
                            <div className="rightHeader">
                              <button className="expandButton">
                                <img src={expandIconfrom} alt="" />
                              </button>
                              <button className="CloseButton" onClick={togglePatientDocument}></button>
                            </div>
                          </div>
                          <div className="modal-body">
                            <div className="patientDocumentWhiteBox">
                              <h3>
                                Blood glucose levels and Homeostasis
                                <br />
                                By: Landon A., Jacob R., Nick N., Matt J.
                              </h3>
                              <h4>Abstract:</h4>
                              <ul className="patientDocumentList">
                                <li>
                                  <span>Objective:</span> To measure the milligrams of sugar per deciliter of blood in the test subject's body and prove how the
                                  body keeps homeostasis.
                                </li>
                                <li>
                                  <span>Cautions:</span> Blood must be drawn in order for test to work.
                                </li>
                                <li>
                                  <span>Results:</span> People without diabetes will generate insulin to compensate for an increase in glucose. People with
                                  diabetes however, will not be able to generate enough, if not any, insulin to compensate for this, making blood sugar levels
                                  stay peaked until they can get insulin through another way, such as injection.
                                </li>
                              </ul>
                              <h4>Introduction:</h4>
                              <ul className="patientDocumentList">
                                <li>
                                  Proper blood glucose levels are required to maintain proper health for your body. As blood glucose levels rise, the hormone
                                  insulin is produced to counter the effect. Likewise, when blood glucose levels drop, the hormone, glucagon, is released,
                                  increasing the output of glycogen in the blood. This lab will be demonstrating predicted blood glucose levels before, shortly
                                  after, and long after glucose is introduced to the body’s systems. The results will predicted based on average humans,
                                  diabetic humans, and hypoglycemic humans to note different results based on hormonal inabilities.
                                </li>
                              </ul>
                              <h4>Materials:</h4>
                              <ul className="patientDocumentDiscList">
                                <li>Glucose sugar meter</li>
                                <li>Test strips</li>
                                <li>Lancet</li>
                                <li>Lancet device</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="RghtDoctorConsultationObservations">
            <div className="Card">
              <div className="TabTopSec">
                <ul className="TabNav">
                  <li className={activeTab === "observations" ? "active" : ""} onClick={() => handleTabClick("observations")}>
                    Observations
                  </li>
                  <li className={activeTab === "prescription" ? "active" : ""} onClick={() => handleTabClick("prescription")}>
                    Prescription
                  </li>
                  <li className={activeTab === "message" ? "active" : ""} onClick={() => handleTabClick("message")}>
                    message
                  </li>
                </ul>
              </div>
              <div className="TabContentSection">
                {activeTab === "observations" && (
                  <div id="observations" className="TabContent">
                    <div className="FinishBtnSec">
                      <button className="FinishBtn">Finish</button>
                    </div>
                    <ul className="ObservationsList">
                      <li>
                        <input type="text" name="" value="" placeholder="Enter the medical condition title" className="form-control" />
                      </li>
                      <li>
                        <label>Examination</label>
                        <div className="JoditEditorContentWrapper">
                          <JoditEditor
                            ref={editor}
                            value={examinationContent}
                            config={config}
                            tabIndex={1}
                            onBlur={newContent => setExaminationContent(newContent)}
                            onChange={newContent => setExaminationContent(newContent)}
                          />
                          {showEmojiPicker && (
                            <div ref={emojiPickerRef}>
                              <EmojiPicker
                                className="EmojiPickerWrapper"
                                onEmojiClick={e => {
                                  setExaminationContent(examinationContent + e.emoji);
                                  setShowEmojiPicker(false);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <label>Other notes</label>
                        <div className="JoditEditorContentWrapper">
                          <JoditEditor
                            ref={editor2}
                            value={otherNotesContent}
                            config={config1}
                            tabIndex={1}
                            onBlur={newContent => setOtherNotesContent(newContent)}
                            onChange={newContent => setOtherNotesContent(newContent)}
                          />

                          {showEmojiPicker1 && (
                            <div ref={emojiPickerRef2}>
                              <EmojiPicker
                                className="EmojiPickerWrapper"
                                onEmojiClick={e => {
                                  setOtherNotesContent(otherNotesContent + e.emoji);
                                  setShowEmojiPicker1(false);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                    <div className="BottomIndicatorSec">
                      <ul className="IndicatorList">
                        <li>
                          <label>
                            Add indicators to follow <button className="AddIndicatorBtn" onClick={toggleAddIndicator}></button>
                          </label>
                          <ul className="SubIndicatorList">
                            <li>
                              <label>
                                Weight: 65kg <button className="EditIndicatorBtn" onClick={toggleEditIndicator}></button>{" "}
                                <button className="RemoveIndicatorBtn" onClick={toggleRemoveIndicator}></button>
                              </label>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      {showAddIndicator && (
                        <div className="modal AddIndicatorModal" onClick={toggleAddIndicator}>
                          <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="CloseButton" onClick={toggleAddIndicator}></button>
                            <h3>Add indicator to follow</h3>
                            <div className="BottmContent">
                              <ul className="AddIndicatorList">
                                <li>
                                  <label>Select indicate</label>
                                  <div className="CustomSelect">
                                    <select>
                                      <option>Height</option>
                                    </select>
                                  </div>
                                </li>
                                <li>
                                  <label>What is patient height?</label>
                                  <input type="text" name="" value="" placeholder="" className="FormControl FormControl2" />
                                  <span className="InputSpan">CM</span>
                                </li>
                              </ul>
                            </div>
                            <ul className="ButtonList">
                              <li>
                                <button className="ModalCloseBtn" onClick={toggleAddIndicator}>
                                  Save
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {showEditIndicator && (
                        <div className="modal AddIndicatorModal" onClick={toggleEditIndicator}>
                          <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="CloseButton" onClick={toggleEditIndicator}></button>
                            <h3>Edit indicator to follow</h3>
                            <div className="BottmContent">
                              <ul className="AddIndicatorList">
                                <li>
                                  <label>Weight</label>
                                  <input type="text" name="" value="65" placeholder="" className="FormControl FormControl2" />
                                  <span className="InputSpan">KG</span>
                                </li>
                              </ul>
                            </div>
                            <ul className="ButtonList">
                              <li>
                                <button className="ModalCloseBtn" onClick={toggleEditIndicator}>
                                  Save
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "prescription" && (
                  <div id="prescription" className="TabContent">
                    <div className="FinishBtnSec">
                      <button className="FinishBtn">Finish</button>
                    </div>
                    <div className="PrescriptionTopSec">
                      <h3>Used templates:</h3>
                      <ul className="BtnList">
                        <li>
                          <button className="TempleteBtn ActiveTempleteBtn">Sick Leave</button>
                        </li>
                        <li>
                          <button className="TempleteBtn">Presc-tem-a</button>
                        </li>
                        <li>
                          <button className="TempleteBtn">Presc-tem-b</button>
                        </li>
                        <li>
                          <button className="TempleteBtn OtherTempleteBtn" onClick={toggleTemplateModal}>
                            Other template
                          </button>
                        </li>
                      </ul>
                    </div>
                    <ul className="ObservationsList ObservationsList2">
                      <li>
                        <div className="JoditEditorContentWrapper">
                          <JoditEditor
                            ref={editor3}
                            value={prescriptionContent}
                            config={config2}
                            tabIndex={1}
                            onBlur={newContent => setPrescriptionContent(newContent)}
                            onChange={newContent => setPrescriptionContent(newContent)}
                          />

                          {showEmojiPicker2 && (
                            <div ref={emojiPickerRef3}>
                              <EmojiPicker
                                className="EmojiPickerWrapper"
                                onEmojiClick={e => {
                                  setPrescriptionContent(prescriptionContent + e.emoji);
                                  setShowEmojiPicker2(false);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                    <div className="BottomIndicatorSec BottomIndicatorSec2">
                      <button className="SaveTemplateBtn">Save as template</button>
                      <ul className="IndicatorList IndicatorList2">
                        <li>
                          <ul className="SubIndicatorList SubIndicatorList2">
                            <li>
                              <label>
                                <span className="typeText">
                                  Sick Leave <span className="ItemNum">1</span>
                                </span>{" "}
                                <button className="EditIndicatorBtn"></button> <button className="RemoveIndicatorBtn"></button>
                              </label>
                            </li>
                            <li>
                              <label>
                                <span className="typeText">
                                  Sick Leave <span className="ItemNum">1</span>
                                </span>{" "}
                                <button className="EditIndicatorBtn"></button> <button className="RemoveIndicatorBtn"></button>
                              </label>
                            </li>
                            <li>
                              <label>
                                <span className="typeText">
                                  Sick Leave <span className="ItemNum">1</span>
                                </span>{" "}
                                <button className="EditIndicatorBtn"></button> <button className="RemoveIndicatorBtn"></button>
                              </label>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === "message" && (
                  <div id="message" className="TabContent">
                    <ul className="message-list">
                      <li>
                        <button className="send-email-btn">Send email</button>
                      </li>
                      <li>
                        <button className="share-btn">Share with an other doctornish</button>
                      </li>
                    </ul>
                    <ul className="EmailList">
                      <li>Email sent to alfonso@gmail.com</li>
                    </ul>
                    <div className="message-chat-box">
                      <h3>All exchanges :</h3>
                      <div className="BottomChatBox">
                        <ul className="ChatList">
                          <li>
                            <div className="ChatInfoTop">
                              <div className="ChatUserInfo">
                                <h4>From Patient:</h4>
                                <h5>Today at 17:30</h5>
                              </div>
                            </div>
                            <div className="DoctorChatContent">
                              Yes, I sprained my ankle two weeks ago and it's still very sore and swollen. It's difficult to put any weight on it.
                            </div>
                          </li>
                          <li className="UserList">
                            <div className="ChatInfoTop">
                              <div className="ChatUserInfo">
                                <h4>Kestrel Tabrizi</h4>
                                <h5>Today at 17:40</h5>
                              </div>
                            </div>
                            <div className="DoctorChatContent DoctorChatContent2">
                              Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?
                              <br />
                              <br />
                              Let's conversation together to betterment your issues!
                            </div>
                          </li>
                        </ul>
                        <div className="BottomChatTextBox">
                          <textarea className="FormTextarea" placeholder="Write a message here..."></textarea>
                          <a className="ChatAttachIcon">
                            <img src={ChatAttachIcon} alt="Doctor image" />
                          </a>
                          <button className="ChatButton"></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showProfileModal && (
          <div className="modal PatientModal" onClick={toggleProfileMoadl}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="CloseButton" onClick={toggleProfileMoadl}></button>
              <h3>Choose the patient name</h3>
              <div className="BottmContent">
                <ul className="PatientList">
                  <li>
                    <div className="ProfileLeftSec">
                      <div className="NameSec">
                        <span style={{backgroundColor: "#0019F5"}}>KT</span>
                      </div>
                      <div className="ProfileTextSec">
                        <h4>Kestrel Tabrizi</h4>
                      </div>
                    </div>
                    <label className="StylesRadio">
                      <input type="radio" checked="checked" name="profilename" />
                      <span className="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <div className="ProfileLeftSec">
                      <div className="NameSec">
                        <span style={{backgroundColor: "#4BA9E9"}}>ET</span>
                      </div>
                      <div className="ProfileTextSec">
                        <h4>Etienne Tabrizi</h4>
                        <p>My Child 1</p>
                      </div>
                    </div>
                    <label className="StylesRadio">
                      <input type="radio" name="profilename" />
                      <span className="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <div className="ProfileLeftSec">
                      <div className="NameSec">
                        <span style={{backgroundColor: "#4BA9E9"}}>AT</span>
                      </div>
                      <div className="ProfileTextSec">
                        <h4>Amelia Tabrizi</h4>
                        <p>My Child 2</p>
                      </div>
                    </div>
                    <label className="StylesRadio">
                      <input type="radio" name="profilename" />
                      <span className="checkmark"></span>
                    </label>
                  </li>
                </ul>
                {/* <button className="AddNewMemberBtn">Add new member</button> */}
              </div>
              <ul className="ButtonList">
                <li>
                  <button className="ModalCloseBtn" onClick={toggleProfileMoadl}>
                    Save
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        {showRemoveIndicator && (
          <div className="modal DeleteModal" onClick={toggleRemoveIndicator}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="CloseButton" onClick={toggleRemoveIndicator}></button>
              <h3>Are you want to delete the (Weight) indicators to follow?</h3>
              <ul className="ButtonList">
                <li>
                  <button className="ModalCloseBtn" onClick={toggleRemoveIndicator}>
                    Yes
                  </button>
                </li>
                <li>
                  <button className="CancelBtn" onClick={toggleRemoveIndicator}>
                    No
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        {showRemoveMedicalBackgroundItem && (
          <div className="modal DeleteModal" onClick={toggleRemoveMedicalBackgroundItem}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="CloseButton" onClick={toggleRemoveMedicalBackgroundItem}></button>
              <h3>Are you want to delete the Allergies (Pénicilline)?</h3>
              <ul className="ButtonList">
                <li>
                  <button className="ModalCloseBtn" onClick={toggleRemoveMedicalBackgroundItem}>
                    Yes
                  </button>
                </li>
                <li>
                  <button className="CancelBtn" onClick={toggleRemoveMedicalBackgroundItem}>
                    No
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        {showTemplateModal && (
          <div className="modal TemplateModal" onClick={toggleTemplateModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="CloseButton" onClick={toggleTemplateModal}></button>
                <h3>Use Templates</h3>
              </div>
              <div className="modal-body">
                <ul className="template-list">
                  <li>
                    <div className="templateImg">
                      <img src={templateImg1} alt="Template image" />
                    </div>
                    <h4>Medicament</h4>
                  </li>
                  <li>
                    <div className="templateImg">
                      <img src={templateImg2} alt="Template image" />
                    </div>
                    <h4>Sick Leave</h4>
                  </li>
                  <li>
                    <div className="templateImg">
                      <img src={templateImg3} alt="Template image" />
                    </div>
                    <h4>Template 3</h4>
                  </li>
                  <li>
                    <div className="templateImg">
                      <img src={templateImg4} alt="Template image" />
                    </div>
                    <h4>Template 4</h4>
                  </li>
                  <li>
                    <div className="templateImg">
                      <img src={templateImg5} alt="Template image" />
                    </div>
                    <h4>Template 5</h4>
                  </li>
                  <li>
                    <div className="templateImg">
                      <img src={templateImg6} alt="Template image" />
                    </div>
                    <h4>Template 6</h4>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {showCancelAppointmnet && (
          <div className="modal CancelAppointmnetModal" onClick={toggleCancelAppointmnet}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="CloseButton" onClick={toggleCancelAppointmnet}></button>
                <h3>Cancel appointment</h3>
                <p>Are you sure you want to cancel this appointment?</p>
              </div>
              <div className="modal-body">
                <ul className="AddIndicatorList">
                  <li>
                    <label>What is reason of appointment cancellation?</label>
                    <div className="CustomSelect">
                      <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                        <option selected hidden>
                          Select reason here
                        </option>
                        {cancelReasonList?.map((item, index) => (
                          <option key={index} value={item?.name}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                </ul>
              </div>
              <ul className="ButtonList">
                <li>
                  <button className="ModalCloseBtn" disabled={modalBtnDis} onClick={() => handleCancelAppointment()}>
                    {modalBtnDis ? "Please wait..." : "Yes Cancel Appointment"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        {showReferDoctorModal && (
          <div className="modal referDoctorModal" onClick={toggleReferDoctor}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="CloseButton" onClick={toggleReferDoctor}></button>
                <h3>Refer a doctor</h3>
                <p>
                  When a doctor refers a patient to another doctor, it means that the referring doctor believes that the patient needs to see a specialist or
                  another healthcare professional for further evaluation, diagnosis, or treatment.
                </p>
              </div>
              <div className="modal-body">
                <ul className="AddIndicatorList">
                  <li>
                    <input type="text" name="" value="" placeholder="Gastroenterologist" className="form-control" />
                  </li>
                </ul>
                <div className="search-box">
                  <h4>34 doctors found</h4>
                  <ul className="search-list">
                    <li>
                      <div className="profile-box">
                        <div className="img-sec"></div>
                        <div className="header-sec">
                          <h5>Dr Francine Gerard</h5>
                          <p>Gastroenterologist</p>
                        </div>
                      </div>
                      <button className="ModalCloseBtn">Refer</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {reschedulePopupShow && (
          <div className="popup holidayPopup ReschedulePopup">
            <div className="popup-content">
              <button onClick={() => setReschedulePopupShow(false)} className="cancelBtn">
                <img src={cancelIcon} alt="cancelIcon" />
              </button>
              <div className="popupInner">
                <div className="calendar-section">
                  <h3>Reschedule</h3>
                  <h5>Make date specific changes</h5>
                  <div className="overlayBtn"></div>
                  <Calendar
                    onChange={handleDateClick}
                    value={calendarValue}
                    tileClassName={tileClassName}
                    onActiveStartDateChange={handleActiveStartDateChange}
                    minDate={new Date()}
                  />
                </div>
                <div className="selected-dates">
                  <div className="TopHead">
                    <h3>
                      {format(calendarValue, "EEEE")} <span>{format(calendarValue, "MMMM d, yyyy")}</span>
                    </h3>
                    <p>Available Time Slot</p>
                  </div>
                  {skelLoading ? (
                    <div className="SkelWrapper">
                      <Skeleton count={2} height={20} width={"80%"} baseColor="#cfd5f9" />
                    </div>
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

                      {/* {selectedDates.length > 0 ? (
                    selectedDates.map((date, index) => ( */}
                      {/* <li key={index} className="selected-date">
                        {date}
                        <button onClick={() => handleRemoveSelectedDate(date)}>✕</button>
                      </li> */}
                      {/* ))
                  ) : (
                    <div className="NoHolidayDiv">
                      <ul>
                        <li>No holidays have been scheduled for this month. Please click on the dates to set up your holidays.</li>
                      </ul>
                    </div>
                  )} */}
                    </ul>
                  )}
                  <div className="BottomSecion">
                    <label>What is reason of appointment reschedule?</label>
                    <div className="CustomSelect">
                      <select value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)}>
                        <option selected hidden value={null}>
                          Select reason here
                        </option>
                        {rescheduleReasonList?.map((item, index) => (
                          <option key={index} value={item?.name}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="saveBtn2" onClick={() => handleReschedule()} disabled={modalBtnDis}>
                    {modalBtnDis ? "Please wait..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationObservations;
