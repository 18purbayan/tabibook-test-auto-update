import React, { useState } from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import "./appointment.css";
import NoAppointmentCalendarIcon from "../../assets/images/no-appointment-calendar-icon.svg";

const MyAppointmentsNotSelected = () => {
 // Tab visibility
 const [activeTab, setActiveTab] = useState('all');

 const handleTabClick = (tab) => {
     setActiveTab(tab);
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
                            <div className="LeftMyAppointtBox"></div>
                            <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
                                <img src={NoAppointmentCalendarIcon} alt="CalendarIcon" />
                                <h4>No upcoming appointments</h4>
                                <p>Find a practitioner and make an appointment online at any time.</p>
                                <div></div>
                                <button className="AppointmentBtn">Make an appointment</button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'upcoming' && (
                    <div id="upcoming" className="TabContentBlock">
                        <div className="MyAppointmentBox">
                            <div className="LeftMyAppointtBox"></div>
                            <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
                                <img src={NoAppointmentCalendarIcon} alt="CalendarIcon" />
                                <h4>No upcoming appointments</h4>
                                <p>Find a practitioner and make an appointment online at any time.</p>
                                <button className="AppointmentBtn">Make an appointment</button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'past' && (
                    <div id="past" className="TabContentBlock">
                        <div className="MyAppointmentBox">
                            <div className="LeftMyAppointtBox"></div>
                            <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
                                <img src={NoAppointmentCalendarIcon} alt="CalendarIcon" />
                                <h4>No upcoming appointments</h4>
                                <p>Find a practitioner and make an appointment online at any time.</p>
                                <button className="AppointmentBtn">Make an appointment</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default MyAppointmentsNotSelected;