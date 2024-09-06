import React, { useState } from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import "./appointment.css";
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

const MyAppointment4 = () => {
    // Tab visibility
    const [activeTab, setActiveTab] = useState('all');

    const handleTabClick = (tab) => {
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

  return (
    <div className="Main">
      <Mainheader />
      <div className="AppointmentBody">
        <div className="CustomContainer">
            <div className="AppointmentTopBox">
                <h3>My appointment</h3>
                <ul className="RightTab">
                    <li
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => handleTabClick('all')}
                    >
                        View All
                    </li>
                    <li
                        className={activeTab === 'upcoming' ? 'active' : ''}
                        onClick={() => handleTabClick('upcoming')}
                    >
                        View Upcoming Appointment
                    </li>
                    <li
                        className={activeTab === 'past' ? 'active' : ''}
                        onClick={() => handleTabClick('past')}
                    >
                        View Past Appointment
                    </li>
                </ul>
            </div>
            <div className="TabContent">
                {activeTab === 'all' && (
                    <div id="all" className="TabContentBlock">
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
                                    <li className="PatientFault Selected">
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
                                                <div className="ImgBox"><img src={DoctorImg4} alt="Doctor image" /></div>
                                                <div className="ImgTextBox">
                                                    <h4>Dr. Parlo Mascuta</h4>
                                                    <h5>Gastroenterologist</h5>
                                                    <h6><img src={StarIcon2} alt="Doctor image" /> 4.5</h6>
                                                </div>
                                            </div>
                                            <div className="CardBottomTextBox">
                                                <h4>Appointment date & time:</h4>
                                                <ul className="AppoBottomList CancelAppoBottomList">
                                                  <li>
                                                      <span className="DateSpan">Date</span>
                                                      June 17, 2024
                                                  </li>
                                                  <li className="OrangeList">
                                                      <span className="TimeSpan">TIME</span>
                                                      10:30
                                                  </li>
                                                  <li className="OrangeList">
                                                      <span className="StatusSpan">STATUS</span>
                                                      <span className="CanceledSpan">Patient not attended</span>
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
                                            <button className="AddNoteBtn"><img src={AddIcon} alt="Doctor image" /> Add a note</button>
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
                    </div>
                )}
                {activeTab === 'upcoming' && (
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
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default MyAppointment4;