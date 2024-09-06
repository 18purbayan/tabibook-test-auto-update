import React, {useEffect, useState, useRef} from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import {Link, useNavigate} from "react-router-dom";
import "./appointment.css";

import Useimg from "../../assets/images/userImg.png";
import DoctorImg from "../../assets/images/appointment-doctor-img1.svg";
import DoctorImg2 from "../../assets/images/appointment-doctor-img2.svg";
import DoctorImg3 from "../../assets/images/appointment-doctor-img3.svg";
import DoctorImg4 from "../../assets/images/appointment-doctor-img4.svg";
import DoctorImg5 from "../../assets/images/appointment-doctor-img5.svg";
import DoctorImg6 from "../../assets/images/appointment-doctor-img6.svg";
import StarIcon from "../../assets/images/appointment-star-icon.svg";
import StarIcon2 from "../../assets/images/4.5star.svg";
import AddIcon from "../../assets/images/appointment-add-icon.svg";
import RelatedDocumentIcon from "../../assets/images/appointment-document-icon.svg";
import WriteReviewDisabledIcon from "../../assets/images/appointment-quality-disabled-icon.svg";
import ChatImg from "../../assets/images/appointment-chat-icon.svg";
import ReviewImg from "../../assets/images/appointment-review-img.svg";
import RatingImg from "../../assets/images/appointment-star-rating-big-img.svg";
import VideoIcon from "../../assets/images/appointment-video-icon.svg";
import ChatAttachIcon from "../../assets/images/appointment-attach-icon.svg";
import ChatUserImg1 from "../../assets/images/appointment-chat-user-img1.svg";
import Afterloginheader from "../../components/MainHeader/Afterloginheader";
import {createNoteApi, getAppointmentDetailsApi, getPatientAppointmentApi, patientFetchNoteApi} from "../../services/apiService";
import {format} from "date-fns";
import {toast} from "react-toastify";
import {IMAGE_URL} from "../../app_url";
import {useUserContext} from "../../context/UserContext";
import NoAppointmentCalendarIcon from "../../assets/images/no-appointment-calendar-icon.svg";
import Skeleton from "react-loading-skeleton";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
} from "react-share";

import NoImage from "../../assets/images/no-image-avatar.png";

const MyAppointment = () => {
  const {userData, setUserData} = useUserContext();
  const navigate = useNavigate();
  // Tab visibility
  const [allDetails, setAllDetails] = useState();
  const [appointmentDetails, setAppointmentDetails] = useState();

  const [screenLoadingDoctor, setScreenLoadingDoctor] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [notesList, setNotesList] = useState();
  const [selectedAppId, setSelectedAppId] = useState();
  const [activeTab, setActiveTab] = useState("all");
  const [noteBtnDis, setNoteBtnDis] = useState(false);
  const [noteText, setNoteText] = useState();
  const [sharePopupShow, setSharePopupShow] = useState(false);

  const handleTabClick = tab => {
    getPatientAppointment(tab);
    setActiveTab(tab);
  };

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const [showModal1, setShowModal1] = useState(false);

  const toggleModal1 = () => {
    setShowModal1(!showModal1);
  };

  const [showModal2, setShowModal2] = useState(false);

  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  };

  const [showModal22, setShowModal22] = useState(false);

  const toggleModal22 = () => {
    setShowModal22(!showModal22);
  };

  const [showModal23, setShowModal23] = useState(false);

  const toggleModal23 = () => {
    setShowModal23(!showModal23);
  };

  // State to manage visibility
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isActive3, setIsActive3] = useState(false);

  // Function to toggle the visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsActive(!isActive);
  };

  const toggleVisibility2 = () => {
    setIsVisible2(!isVisible2);
    setIsActive2(!isActive2);
  };

  const toggleVisibility3 = () => {
    setIsVisible3(!isVisible3);
    setIsActive3(!isActive3);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy");
  };

  const getPatientAppointment = async type => {
    setScreenLoadingDoctor(true);
    try {
      let response = await getPatientAppointmentApi(type);
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          if (response.data.data.length > 0) {
            getAppointmentDetails(response.data.data[0]["id"]);
            setSelectedAppId(response.data.data[0]["id"]);
          } else {
            getAppointmentDetails("h1");
          }
        } else {
          getAppointmentDetails("");
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setScreenLoadingDoctor(false);
    } catch (error) {
      setScreenLoadingDoctor(false);
      //toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleSelectAppointment = async id => {
    getAppointmentDetails(id);
    setSelectedAppId(id);
  };

  const getAppointmentDetails = async id => {
    setScreenLoading(true);
    try {
      let response = await getAppointmentDetailsApi(id);
      if (response) {
        if (response.data.res === true) {
          setAppointmentDetails(response.data.data[0]);
          getPatientNote(response.data.data[0].id);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setScreenLoading(false);
    } catch (error) {
      setScreenLoading(false);
      //toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getPatientNote = async id => {
    try {
      let fd = new FormData();
      fd.append("appointment_id", id);
      let response = await patientFetchNoteApi(fd);
      if (response) {
        if (response.data.res === true) {
          setNotesList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      //toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const addPatientNote = async () => {
    if (selectedAppId) {
      if (!noteText) {
        toast.warning("Please enter note.", {autoClose: 1500});
      } else {
        try {
          setNoteBtnDis(true);
          let fd = new FormData();
          fd.append("appointment_id", selectedAppId);
          fd.append("notes", noteText);
          let response = await createNoteApi(fd);
          if (response) {
            if (response.data.res === true) {
              getPatientNote(selectedAppId);
              setShowModal2(false);
              setNoteText(null);
              toast.success(response.data.msg, {autoClose: 1500});
            } else {
              toast.error(response.data.msg, {autoClose: 1500});
            }
          }
          setNoteBtnDis(false);
        } catch (error) {
          setNoteBtnDis(false);
          console.error(error);
          toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
        }
      }
    } else {
      toast.error("Appointment not found.", {autoClose: 1500});
    }
  };

  useEffect(() => {
    getPatientAppointment("all");
  }, []);

  return (
    <div className="Main">
      <Afterloginheader />
      <div className="AppointmentBody">
        <div className="CustomContainer">
          <div className="AppointmentTopBox">
            <h3>My appointment</h3>
            <ul className="RightTab">
              <li
                className={activeTab === "all" ? "active" : ""}
                onClick={() => handleTabClick("all")}
                //onClick={() => getPatientAppointment('all')}
              >
                View All
              </li>
              <li
                className={activeTab === "upcoming" ? "active" : ""}
                onClick={() => handleTabClick("upcoming")}
                //onClick={() => getPatientAppointment('upcoming')}
              >
                View Upcoming Appointment
              </li>
              <li
                className={activeTab === "past" ? "active" : ""}
                onClick={() => handleTabClick("past")}
                //onClick={() => getPatientAppointment('past')}
              >
                View Past Appointment
              </li>
            </ul>
          </div>
          <div className="TabContent">
            <div id="all" className="TabContentBlock">
              <div className="MyAppointmentBox">
                <div className="LeftMyAppointtBox">
                  <ul className="AppointmentList">
                    {screenLoadingDoctor ? (
                      <div className="Card">
                        <Skeleton count={1} height={40} width={"100%"} baseColor="#cfd5f9" />
                        <br />
                        <p>
                          <Skeleton count={1} height={40} width={"100%"} baseColor="#cfd5f9" />
                        </p>
                      </div>
                    ) : (
                      <>
                        {allDetails?.map((item, index) => (
                          <li className={selectedAppId === item?.id ? "Selected" : ""} key={index} onClick={() => handleSelectAppointment(item?.id)}>
                            <div className="Card">
                              <div className="TopCardBox">
                                <div className="ImgBox">
                                  <img
                                    src={item?.doctor_details[0]?.profile_pic ? IMAGE_URL + item?.doctor_details[0]?.profile_pic : NoImage}
                                    alt="Doctor image"
                                  />
                                </div>
                                <div className="ImgTextBox">
                                  <h4>
                                    {/* Dr Debrorah Dang */}
                                    {item?.doctor_details[0]?.first_name} {item?.doctor_details[0]?.last_name}
                                  </h4>
                                  <h5>{item?.doctor_details[0]?.doctor_specialitie}</h5>
                                  <h6>
                                    <img src={StarIcon} alt="Doctor image" /> 0
                                  </h6>
                                </div>
                              </div>
                              <div className="CardBottomTextBox">
                                <h3>Appointment details</h3>
                                <ul className="AppoBottomList">
                                  {item?.status === 1 ? (
                                    <>
                                      <li>
                                        <span className="RescheduledSpan">Rescheduled</span>
                                      </li>
                                      <li className="BlackList">
                                        <span className="DateSpan">{formatDate(item?.appointment_date)}</span>
                                        <span className="TimeSpan">{item?.time}</span>
                                      </li>
                                    </>
                                  ) : item?.status === 2 ? (
                                    <>
                                      <li>
                                        <span className="CanceledSpan">Canceled by doctor</span>
                                      </li>
                                      <li className="BlackList">
                                        <span className="DateSpan">{formatDate(item?.appointment_date)}</span>
                                        <span className="TimeSpan">{item?.time}</span>
                                      </li>
                                    </>
                                  ) : item?.status === 3 ? (
                                    <>
                                      <li>
                                        <span className="CanceledSpan">Doctor absent</span>
                                      </li>
                                      <li className="BlackList">
                                        <span className="DateSpan">{formatDate(item?.appointment_date)}</span>
                                        <span className="TimeSpan">{item?.time}</span>
                                      </li>
                                    </>
                                  ) : item?.status === 5 ? (
                                    <>
                                      <li className="GrayList">
                                        <span className="CompletedSpan">Appointment completed</span>
                                      </li>
                                      <li className="BlackList">
                                        <span className="DateSpan">{formatDate(item?.appointment_date)}</span>
                                        <span className="TimeSpan">{item?.time}</span>
                                      </li>
                                    </>
                                  ) : (
                                    <li className="GreenList">
                                      <span className="DateSpan">{formatDate(item?.appointment_date)}</span>
                                      <span className="TimeSpan">{item?.time}</span>
                                    </li>
                                  )}

                                  <li>
                                    <span className="UsrerName">
                                      {userData?.users?.first_name} {userData?.users?.last_name}
                                    </span>{" "}
                                    <a className="ChatLink"></a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
                {screenLoadingDoctor || screenLoading ? (
                  <div className="RightMyAppointtBox">
                    <Skeleton count={1} height={40} width={"80%"} baseColor="#cfd5f9" />
                    <br />
                    <p>
                      <Skeleton count={1} height={40} width={"70%"} baseColor="#cfd5f9" />
                    </p>
                  </div>
                ) : (
                  <>
                    {appointmentDetails ? (
                      <div className="RightMyAppointtBox">
                        <div className="RowSec">
                          <div className="HalfSec">
                            <div className="Card RightMyAppointmentCard">
                              <div className="TopCardBox">
                                <div className="ImgBox">
                                  <img
                                    src={
                                      appointmentDetails?.doctor_details?.profile_pic ? IMAGE_URL + appointmentDetails?.doctor_details?.profile_pic : NoImage
                                    }
                                    alt="Doctor image"
                                  />
                                </div>
                                <div className="ImgTextBox">
                                  <h4>
                                    {appointmentDetails?.doctor_details?.first_name} {appointmentDetails?.doctor_details?.last_name}
                                  </h4>
                                  <h5>{appointmentDetails?.doctor_details?.doctor_specialitie}</h5>
                                  <h6>
                                    <img src={StarIcon2} alt="Doctor image" /> 0
                                  </h6>
                                </div>
                              </div>
                              <div className="CardBottomTextBox">
                                <h4>Appointment date & time:</h4>

                                {appointmentDetails?.status === 1 ? (
                                  <>
                                    <ul className={`AppoBottomList ${appointmentDetails?.status === 5 ? "ComplitedAppoBottomList" : ""} `}>
                                      <li>
                                        <span className="RescheduledSpan">Rescheduled</span>
                                      </li>
                                      <li className="BlackList">
                                        <span className="DateSpan">{formatDate(appointmentDetails?.appointment_date)}</span>
                                        <span className="TimeSpan">{appointmentDetails?.time}</span>
                                      </li>
                                    </ul>
                                  </>
                                ) : appointmentDetails?.status === 2 ? (
                                  <>
                                    <ul className={`AppoBottomList ${appointmentDetails?.status === 5 ? "ComplitedAppoBottomList" : ""} `}>
                                      <li>
                                        <span className="CanceledSpan">Canceled by doctor</span>
                                      </li>
                                      <li>
                                        <span className="DateSpan">Date</span>
                                        {appointmentDetails?.appointment_date ? formatDate(appointmentDetails?.appointment_date) : ""}
                                      </li>
                                      <li>
                                        <span className="TimeSpan">TIME</span>
                                        {appointmentDetails?.time}
                                      </li>
                                    </ul>
                                  </>
                                ) : appointmentDetails?.status === 3 ? (
                                  <>
                                    <ul className={`AppoBottomList ${appointmentDetails?.status === 5 ? "ComplitedAppoBottomList" : ""} `}>
                                      <li>
                                        <span className="CanceledSpan">Doctor absent</span>
                                      </li>
                                      <li>
                                        <span className="DateSpan">Date</span>
                                        {appointmentDetails?.appointment_date ? formatDate(appointmentDetails?.appointment_date) : ""}
                                      </li>
                                      <li>
                                        <span className="TimeSpan">TIME</span>
                                        {appointmentDetails?.time}
                                      </li>
                                    </ul>
                                  </>
                                ) : appointmentDetails?.status === 5 ? (
                                  <>
                                    <ul className={`AppoBottomList ${appointmentDetails?.status === 5 ? "ComplitedAppoBottomList" : ""} `}>
                                      <li>
                                        <span className="DateSpan">Date</span>
                                        {appointmentDetails?.appointment_date ? formatDate(appointmentDetails?.appointment_date) : ""}
                                      </li>
                                      <li>
                                        <span className="TimeSpan">TIME</span>
                                        {appointmentDetails?.time}
                                      </li>
                                      <li className="GreenList">
                                        <span className="StatusSpan">STATUS</span>
                                        Completed
                                      </li>
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    <ul
                                      className={`AppoBottomList ${appointmentDetails?.status === 5 ? "ComplitedAppoBottomList" : "UpComingAppoBottomList"} `}>
                                      <li>
                                        <span className="DateSpan">Date</span>
                                        {appointmentDetails?.appointment_date ? formatDate(appointmentDetails?.appointment_date) : ""}
                                      </li>
                                      <li>
                                        <span className="TimeSpan">TIME</span>
                                        {appointmentDetails?.time}
                                      </li>
                                    </ul>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="Card RightMyAppointmentCard">
                              <h3>Go to the consultation</h3>
                              <h4>Address:</h4>
                              <ul className="LeftApontlocationList">
                                <li>
                                  Cabinet
                                  <br />
                                  {appointmentDetails?.doctor_details?.cabin_address}
                                  {/* <br /> */}
                                  {/* {appointmentDetails?.doctor_details==1()=>(
                                                        <span>Ground floor<br />
                                                    )} */}
                                  {appointmentDetails?.doctor_details?.doctor_transports.map((item, index) => (
                                    <span key={index}>
                                      {item?.transport}
                                      {/* <br /> */}
                                    </span>
                                  ))}
                                  {/* <br /> */}
                                  {appointmentDetails?.doctor_details?.doctor_parkings.map((item, index) => (
                                    <span key={index}>
                                      {item?.parking}
                                      {/* <br /> */}
                                    </span>
                                  ))}
                                  {/* <br /> */}
                                  {appointmentDetails?.doctor_details?.doctor_informations.map((item, index) => (
                                    <span key={index}>
                                      {item?.information}
                                      {/* <br /> */}
                                    </span>
                                  ))}
                                  {/* {appointmentDetails?.doctor_details?.doctor_parkings?.parking}
                                                    {appointmentDetails?.doctor_details?.doctor_informations?.information} */}
                                  {/* Ground floor<br />
                                                    The Saint-Cyprien parking lot and metro <br />are a 5-minute walk away. */}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="HalfSec">
                            <div className="Card RightMyAppointmentCard">
                              <h3>Patient</h3>
                              <h4>Patient name:</h4>
                              <div className="PatientNameBox">
                                {appointmentDetails?.patient_details.map((item, index) => (
                                  <span key={index}>
                                    {item?.first_name} {item?.last_name}
                                    <br />
                                  </span>
                                ))}
                              </div>
                              <button className="ShareBtn" onClick={() => setSharePopupShow(true)}>
                                Share with someone
                              </button>
                            </div>
                            <div className="Card RightMyAppointmentCard2">
                              <button className="AddNoteBtn" onClick={toggleModal2}>
                                <img src={AddIcon} alt="Doctor image" /> Add a note
                              </button>
                            </div>
                            <div className="Card RightMyAppointmentCard2">
                              <button className="RelatedBtn">
                                <img src={RelatedDocumentIcon} alt="Doctor image" /> Access related document
                              </button>
                            </div>
                            <div className="Card RightMyAppointmentCard2">
                              <button className="WriteReviewBtn WriteReviewDisabledBtn">
                                <img src={WriteReviewDisabledIcon} alt="Doctor image" /> Write a review
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="Card PatientsChatCard">
                          <button className={`PatientsChatButton ${isActive ? "active" : "inactive"}`} onClick={toggleVisibility}>
                            <span className="PatientImgBox">
                              <img src={userData.users?.profile_pic ? IMAGE_URL + userData.users?.profile_pic : NoImage} alt="Doctor image" />
                            </span>
                            <div className="PatientImgTextBox">
                              <div className="LeftImgTextBox">
                                <h4>
                                  {userData.users.first_name} {userData.users.last_name}
                                </h4>
                                <h5>{userData.users.cell_phone}</h5>
                              </div>
                              <span className="ChatLink">
                                <img src={ChatImg} alt="Doctor image" />
                              </span>
                            </div>
                          </button>
                          {isVisible && (
                            <div className="BottomChatBox">
                              <ul className="ChatList">
                                <li>
                                  <div className="ChatInfoTop">
                                    <div className="ChatUserImg">
                                      <img src={ChatUserImg1} alt="Doctor image" />
                                    </div>
                                    <div className="ChatUserInfo">
                                      <h4>Kestrel Tabrizi</h4>
                                      <h5>Today at 17:40</h5>
                                    </div>
                                  </div>
                                  <div className="DoctorChatContent">
                                    Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?
                                    <br />
                                    <br />
                                    Let's conversation together to betterment your issues!
                                  </div>
                                </li>
                                <li>
                                  <div className="ChatInfoTop">
                                    <div className="ChatUserImg">
                                      <img src={ChatUserImg1} alt="Doctor image" />
                                    </div>
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
                          )}
                        </div>
                        {notesList?.length > 0 ? (
                          <div className="Card NoteBox">
                            <h3>Note</h3>
                            {notesList?.map((item, index) => (
                              <p className="DisabledPara" key={index}>
                                {item?.notes}
                              </p>
                            ))}
                            <ul className="NoteBtnList" style={{display: "none"}}>
                              <li>
                                <button className="EditBtn">Edit Note</button>
                              </li>
                              <li>
                                <button className="DeleteBtn">Delete Note</button>
                              </li>
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : !screenLoadingDoctor && !screenLoading ? (
                      <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
                        <img src={NoAppointmentCalendarIcon} alt="" />
                        <h4>No appointments</h4>
                        <p>Find a practitioner and make an appointment online at any time.</p>
                        <div></div>
                        <button className="AppointmentBtn" onClick={() => navigate("/")}>
                          Make an appointment
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              {showModal2 && (
                <div className="modal AddNoteModal" onClick={toggleModal2}>
                  <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="CloseButton" onClick={toggleModal2}></button>
                    <h3>Add Note</h3>
                    <div className="BottmContent">
                      <ul className="FormList">
                        <li>
                          <textarea placeholder="Type here..." className="FormTextarea" value={noteText} onChange={e => setNoteText(e.target.value)}></textarea>
                        </li>
                      </ul>
                    </div>
                    <ul className="ButtonList">
                      <li>
                        <button
                          className="CancelBtn"
                          onClick={() => {
                            setShowModal2(false);
                            setNoteText(null);
                          }}>
                          Canel note
                        </button>
                      </li>
                      <li>
                        <button className="ModalCloseBtn" onClick={() => addPatientNote()} disabled={noteBtnDis}>
                          {noteBtnDis ? "Please wait.." : "Submit"}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {sharePopupShow && (
                <div className="modal AddNoteModal" onClick={() => setSharePopupShow(false)}>
                  <div className="modal-content shareModal" onClick={e => e.stopPropagation()}>
                    <button className="CloseButton" onClick={() => setSharePopupShow(false)}></button>
                    <h3>Share doctor profile</h3>
                    <div className="BottmContent">
                      <div className="ShareButtonCont">
                        <div className="ShareButton">
                          <FacebookShareButton
                            url={window.location.protocol + window.location.host + "/search/doctor-details/" + appointmentDetails?.doctor_details?.slug}>
                            <FacebookIcon size={40} round={true} />
                          </FacebookShareButton>
                        </div>
                        <div className="ShareButton">
                          <WhatsappShareButton
                            url={window.location.protocol + window.location.host + "/search/doctor-details/" + appointmentDetails?.doctor_details?.slug}>
                            <WhatsappIcon size={40} round={true} />
                          </WhatsappShareButton>
                        </div>
                        <div className="ShareButton">
                          <TwitterShareButton
                            url={window.location.protocol + window.location.host + "/search/doctor-details/" + appointmentDetails?.doctor_details?.slug}>
                            <TwitterIcon size={40} round={true} />
                          </TwitterShareButton>
                        </div>
                        <div className="ShareButton">
                          <LinkedinShareButton
                            url={window.location.protocol + window.location.host + "/search/doctor-details/" + appointmentDetails?.doctor_details?.slug}>
                            <LinkedinIcon size={40} round={true} />
                          </LinkedinShareButton>
                        </div>
                        <div className="ShareButton">
                          <TelegramShareButton
                            url={window.location.protocol + window.location.host + "/search/doctor-details/" + appointmentDetails?.doctor_details?.slug}>
                            <TelegramIcon size={40} round={true} />
                          </TelegramShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* {activeTab === 'upcoming' && (
                    <div id="upcoming" className="TabContentBlock">
                        <div className="MyAppointmentBox">
                            <div className="LeftMyAppointtBox">
                                <ul className="AppointmentList">
                                    <li className="UpcomingList">
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Debrorah Dang</h4>
                                                    <h5>Dentist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li className="GreenList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg2} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Francine Gerard</h4>
                                                    <h5>Physiotherapist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="RescheduledSpan">Rescheduled</span></li>
                                                    <li className="BlackList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="BlackList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg3} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr John Doe</h4>
                                                    <h5>Physiotherapist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Canceled by doctor</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="PatientFault">
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg4} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Parlo Mascuta</h4>
                                                    <h5>Gastroenterologist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Patient not attended</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg4} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Parlo Mascuta</h4>
                                                    <h5>Gastroenterologist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Doctor absent</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox">
                                                    <img src={DoctorImg6} alt="Doctor image" />
                                                    <div className="VideoIconBox"><img src={VideoIcon} alt="Doctor image" /></div>  
                                                </div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Jean Philippe MENAT</h4>
                                                    <h5>Dietitian/Nutritionist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li className="GrayList"><span className="CompletedSpan">Appointment completed</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="RightMyAppointtBox">
                                <div className="RowSec">
                                    <div className="HalfSec">
                                        <div className="Card RightMyAppointmentCard">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr. Deborah Dang</h4>
                                                    <h5>Dentist</h5>
                                                    <h6><img src={StarIcon2} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h4>Appointment date & time:</h4>
                                                <ul className="AppoBottomList UpComingAppoBottomList">
                                                    <li>
                                                        <span className="DateSpan">Date</span>
                                                        June 17, 2024
                                                    </li>
                                                    <li>
                                                        <span className="TimeSpan">TIME</span>
                                                        20:30
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="Card RightMyAppointmentCard">
                                            <h3>Go to the consultation</h3>
                                            <h4>Address:</h4>
                                            <ul className="LeftApontlocationList">
                                                <li>Cabinet Les Arcades<br />
                                                    93-95 Allees Charles de fitte<br />
                                                    31300 toulose<br />
                                                    <span>Ground floor<br />
                                                    The Saint-Cyprien parking lot and metro <br />are a 5-minute walk away.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="HalfSec">
                                        <div className="Card RightMyAppointmentCard">
                                            <h3>Patient</h3>
                                            <h4>Patient name:</h4>
                                            <div className="PatientNameBox">Kestrel Tabrizi</div>
                                            <button className="ShareBtn">Share with someone</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="AddNoteBtn" onClick={toggleModal22}><img src={AddIcon} alt="Doctor image" /> Add a note</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="RelatedBtn"><img src={RelatedDocumentIcon} alt="Doctor image" /> Access related document</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="WriteReviewBtn WriteReviewDisabledBtn"><img src={WriteReviewDisabledIcon} alt="Doctor image" /> Write a review</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="Card PatientsChatCard">
                                    <button className={`PatientsChatButton ${isActive2 ? 'active' : 'inactive'}`} onClick={toggleVisibility2}>
                                        <span className="PatientImgBox"><img src={DoctorImg3} alt="Doctor image" /></span>
                                        <div className="PatientImgTextBox">
                                            <div className="LeftImgTextBox">
                                                <h4>Kestrel Tabrizi</h4>
                                                <h5>(415) 851-8951</h5>
                                            </div>
                                            <span className="ChatLink"><img src={ChatImg} alt="Doctor image" /></span>
                                        </div>
                                    </button>
                                    {isVisible2 && (
                                        <div className="BottomChatBox">
                                            <ul className="ChatList">
                                                <li>
                                                    <div className="ChatInfoTop">
                                                        <div className="ChatUserImg"><img src={ChatUserImg1} alt="Doctor image" /></div>
                                                        <div className="ChatUserInfo">
                                                            <h4>Kestrel Tabrizi</h4>
                                                            <h5>Today at 17:40</h5>
                                                        </div>
                                                    </div>
                                                    <div className="DoctorChatContent">
                                                    Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?<br /><br />
                                                    Let's conversation together to betterment your issues!
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="ChatInfoTop">
                                                        <div className="ChatUserImg"><img src={ChatUserImg1} alt="Doctor image" /></div>
                                                        <div className="ChatUserInfo">
                                                            <h4>Kestrel Tabrizi</h4>
                                                            <h5>Today at 17:40</h5>
                                                        </div>
                                                    </div>
                                                    <div className="DoctorChatContent DoctorChatContent2">
                                                    Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?<br /><br />
                                                    Let's conversation together to betterment your issues!
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="BottomChatTextBox">
                                                <textarea className="FormTextarea" placeholder="Write a message here..."></textarea>
                                                <a className="ChatAttachIcon"><img src={ChatAttachIcon} alt="Doctor image" /></a>
                                                <button className="ChatButton"></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="Card NoteBox">
                                    <h3>Note</h3>
                                    <p className="DisabledPara">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                                    <ul className="NoteBtnList" style={{display: "none"}}>
                                        <li><button className="EditBtn">Edit Note</button></li>
                                        <li><button className="DeleteBtn">Delete Note</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {showModal22 && (
                            <div className="modal AddNoteModal" onClick={toggleModal22}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="CloseButton" onClick={toggleModal22}></button>
                                    <h3>Add Note</h3>
                                    <div className="BottmContent">
                                        <ul className="FormList">
                                            <li><textarea placeholder="Type here..." className="FormTextarea"></textarea></li>
                                        </ul>
                                    </div>
                                    <ul className="ButtonList">
                                        <li><button className="CancelBtn" onClick={toggleModal22}>Canel note</button></li>
                                        <li><button className="ModalCloseBtn" onClick={toggleModal22}>Submit</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'past' && (
                    <div id="past" className="TabContentBlock">
                        <div className="MyAppointmentBox">
                            <div className="LeftMyAppointtBox">
                                <ul className="AppointmentList">
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Debrorah Dang</h4>
                                                    <h5>Dentist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li className="GreenList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg2} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Francine Gerard</h4>
                                                    <h5>Physiotherapist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="RescheduledSpan">Rescheduled</span></li>
                                                    <li className="BlackList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="BlackList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg3} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr John Doe</h4>
                                                    <h5>Physiotherapist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Canceled by doctor</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="PatientFault">
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg4} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Parlo Mascuta</h4>
                                                    <h5>Gastroenterologist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Patient not attended</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox"><img src={DoctorImg5} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Imran Ahmed</h4>
                                                    <h5>Gastroenterologist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li><span className="CanceledSpan">Doctor absent</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="Selected">
                                        <div className="Card">
                                            <div className="TopCardBox">
                                                <div className="ImgBox">
                                                    <img src={DoctorImg6} alt="Doctor image" />
                                                    <div className="VideoIconBox"><img src={VideoIcon} alt="Doctor image" /></div>  
                                                </div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr Jean Philippe MENAT</h4>
                                                    <h5>Dietitian/Nutritionist</h5>
                                                    <h6><img src={StarIcon} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h3>Appointment details</h3>
                                                <ul className="AppoBottomList">
                                                    <li className="GrayList"><span className="CompletedSpan">Appointment completed</span></li>
                                                    <li className="GrayList"><span className="DateSpan">June 17, 2024</span> <span className="TimeSpan">20:30</span></li>
                                                    <li className="GrayList"><span className="UsrerName">Kestrel Tabrizi</span> <a className="ChatLink"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="RightMyAppointtBox">
                                <div className="RowSec">
                                    <div className="HalfSec">
                                        <div className="Card RightMyAppointmentCard">
                                            <div className="TopCardBox">
                                                <div className="ImgBox">
                                                    <img src={DoctorImg6} alt="Doctor image" />
                                                    <div className="VideoIconBox"><img src={VideoIcon} alt="Doctor image" /></div>  
                                                </div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr. Jean Philippe MENAT</h4>
                                                    <h5>Dietitian/Nutritionist</h5>
                                                    <h6><img src={StarIcon2} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h4>Appointment date & time:</h4>
                                                <ul className="AppoBottomList ComplitedAppoBottomList">
                                                <li>
                                                    <span className="DateSpan">Date</span>
                                                    June 17, 2024
                                                </li>
                                                <li className="OrangeList">
                                                    <span className="TimeSpan">TIME</span>
                                                    22:30
                                                </li>
                                                <li className="GreenList">
                                                    <span className="StatusSpan">STATUS</span>
                                                    Completed
                                                </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="Card RightMyAppointmentCard">
                                            <h3>Go to the consultation</h3>
                                            <h4>Address:</h4>
                                            <ul className="LeftApontlocationList">
                                                <li>Cabinet Les Arcades<br />
                                                    93-95 Allees Charles de fitte<br />
                                                    31300 toulose<br />
                                                    <span>Ground floor<br />
                                                    The Saint-Cyprien parking lot and metro <br />are a 5-minute walk away.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="HalfSec">
                                        <div className="Card RightMyAppointmentCard">
                                            <h3>Patient</h3>
                                            <h4>Patient name:</h4>
                                            <div className="PatientNameBox">Kestrel Tabrizi</div>
                                            <button className="ShareBtn">Share with someone</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="AddNoteBtn" onClick={toggleModal23}><img src={AddIcon} alt="Doctor image" /> Add a note</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="RelatedBtn"><img src={RelatedDocumentIcon} alt="Doctor image" /> Access related document</button>
                                        </div>
                                        <div className="Card RightMyAppointmentCard2">
                                            <button className="WriteReviewBtn" onClick={toggleModal1}><img src={WriteReviewDisabledIcon} alt="Doctor image" /> Write a review</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="Card PatientsChatCard">
                                    <button className={`PatientsChatButton ${isActive ? 'active' : 'inactive'}`} onClick={toggleVisibility}>
                                        <span className="PatientImgBox"><img src={DoctorImg3} alt="Doctor image" /></span>
                                        <div className="PatientImgTextBox">
                                            <div className="LeftImgTextBox">
                                                <h4>Kestrel Tabrizi</h4>
                                                <h5>(415) 851-8951</h5>
                                            </div>
                                            <span className="ChatLink"><img src={ChatImg} alt="Doctor image" /></span>
                                        </div>
                                    </button>
                                    {isVisible && (
                                        <div className="BottomChatBox">
                                            <ul className="ChatList">
                                                <li>
                                                    <div className="ChatInfoTop">
                                                        <div className="ChatUserImg"><img src={ChatUserImg1} alt="Doctor image" /></div>
                                                        <div className="ChatUserInfo">
                                                            <h4>Kestrel Tabrizi</h4>
                                                            <h5>Today at 17:40</h5>
                                                        </div>
                                                    </div>
                                                    <div className="DoctorChatContent">
                                                    Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?<br /><br />
                                                    Let's conversation together to betterment your issues!
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="ChatInfoTop">
                                                        <div className="ChatUserImg"><img src={ChatUserImg1} alt="Doctor image" /></div>
                                                        <div className="ChatUserInfo">
                                                            <h4>Kestrel Tabrizi</h4>
                                                            <h5>Today at 17:40</h5>
                                                        </div>
                                                    </div>
                                                    <div className="DoctorChatContent DoctorChatContent2">
                                                    Hi, I understand you're having some issues with your ankle. Can you tell me a little bit about what's going on?<br /><br />
                                                    Let's conversation together to betterment your issues!
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="BottomChatTextBox">
                                                <textarea className="FormTextarea" placeholder="Write a message here..."></textarea>
                                                <a className="ChatAttachIcon"><img src={ChatAttachIcon} alt="Doctor image" /></a>
                                                <button className="ChatButton"></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="Card NoteBox">
                                    <h3>Note</h3>
                                    <p className="DisabledPara">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                                    <ul className="NoteBtnList" style={{display: "none"}}>
                                        <li><button className="EditBtn">Edit Note</button></li>
                                        <li><button className="DeleteBtn">Delete Note</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {showModal1 && (
                            <div className="modal WriteReviewModal" onClick={toggleModal1}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="CloseButton" onClick={toggleModal1}></button>
                                    <h3>Review & Rating</h3>
                                    <div className="ReviewImg">
                                        <img src={ReviewImg} alt="Doctor image" />
                                    </div>
                                    <div className="BottmContent">
                                        <h4>Dr Francine Gerard</h4>
                                        <h5>Gastroenterologist</h5>
                                        <p>Rating the care provided on  June 17, 2024</p>
                                        <ul className="RatingList">
                                            <li><img src={RatingImg} alt="Doctor image" /></li>
                                        </ul>
                                        <ul className="FormList">
                                            <li><label>Additional comments</label></li>
                                            <li><textarea cols={3} row={4} placeholder="Type here..." className="FormTextarea"></textarea></li>
                                        </ul>
                                    </div>
                                    <ul className="ButtonList">
                                        <li><button className="CancelBtn" onClick={toggleModal1}>Not Now</button></li>
                                        <li><button className="ModalCloseBtn" onClick={toggleModal1}>Submit</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {showModal23 && (
                            <div className="modal AddNoteModal" onClick={toggleModal23}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="CloseButton" onClick={toggleModal23}></button>
                                    <h3>Add Note</h3>
                                    <div className="BottmContent">
                                        <ul className="FormList">
                                            <li><textarea placeholder="Type here..." className="FormTextarea"></textarea></li>
                                        </ul>
                                    </div>
                                    <ul className="ButtonList">
                                        <li><button className="CancelBtn" onClick={toggleModal23}>Canel note</button></li>
                                        <li><button className="ModalCloseBtn" onClick={toggleModal23}>Submit</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;
