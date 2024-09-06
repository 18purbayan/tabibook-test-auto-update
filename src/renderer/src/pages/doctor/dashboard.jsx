import React, {useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getMonth, getYear, format} from "date-fns";

import dashboard1 from "../../assets/images/dash1.svg";
import dashboard2 from "../../assets/images/dash2.svg";
import dashboard3 from "../../assets/images/dash3.svg";
import dashboard4 from "../../assets/images/dash4.svg";
import userImg from "../../assets/images/user-icon.svg";
import viewIcon from "../../assets/images/view-icon.svg";
import {Link} from "react-router-dom";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import {getDoctorDashboardApi} from "../../services/apiService";
import {toast} from "react-toastify";

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allDetails, setAllDetails] = useState();
  const [appointments, setAppointments] = useState([]);
  //   [
  //   {name: "Kestrel Tabrizi", type: "Video consultation", date: "23 June 2024", time: "20:00 to 20:15", visits: 1, details: "details"},
  //   {name: "Frederica Kohl", type: "Cabinet consultation", date: "23 July 2024", time: "20:15 to 20:30", visits: 0, details: "details"},
  //   {name: "Miler Skyes", type: "Cabinet consultation", date: "23 July 2024", time: "20:30 to 20:45", visits: 5, details: "details"},
  //   {name: "Enma Gobber", type: "Cabinet consultation", date: "23 July 2024", time: "20:45 to 21:00", visits: 4, details: "details"},
  //   {name: "Frederick Keen", type: "Cabinet consultation", date: "23 August 2024", time: "21:00 to 21:15", visits: 2, details: "details"},
  //   {name: "Kestrel Tabrizi", type: "Video consultation", date: "23 June 2024", time: "20:00 to 20:15", visits: 1, details: "details"},
  //   {name: "Frederica Kohl", type: "Cabinet consultation", date: "23 July 2024", time: "20:15 to 20:30", visits: 0, details: "details"},
  //   {name: "Miler Skyes", type: "Cabinet consultation", date: "23 July 2024", time: "20:30 to 20:45", visits: 5, details: "details"},
  //   {name: "Enma Gobber", type: "Cabinet consultation", date: "23 July 2024", time: "20:45 to 21:00", visits: 4, details: "details"},
  //   {name: "Frederick Keen", type: "Cabinet consultation", date: "23 August 2024", time: "21:00 to 21:15", visits: 2, details: "details"},
  //   {name: "Kestrel Tabrizi", type: "Video consultation", date: "23 June 2024", time: "20:00 to 20:15", visits: 1, details: "details"},
  //   {name: "Frederica Kohl", type: "Cabinet consultation", date: "23 July 2024", time: "20:15 to 20:30", visits: 0, details: "details"},
  //   {name: "Miler Skyes", type: "Cabinet consultation", date: "23 July 2024", time: "20:30 to 20:45", visits: 5, details: "details"},
  //   {name: "Enma Gobber", type: "Cabinet consultation", date: "23 July 2024", time: "20:45 to 21:00", visits: 4, details: "details"},
  //   {name: "Frederick Keen", type: "Cabinet consultation", date: "23 August 2024", time: "21:00 to 21:15", visits: 2, details: "details"},
  //   // Add more appointments as needed
  // ]

  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  // const filteredAppointments = appointments.filter(appointment => {
  //   const appointmentDate = new Date(appointment.date);
  //   return (
  //     appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (!selectedDate || (getMonth(appointmentDate) === getMonth(selectedDate) && getYear(appointmentDate) === getYear(selectedDate)))
  //   );
  // });

  const CustomHeader = ({date, changeYear, changeMonth}) => (
    <div style={{margin: 10, display: "flex", justifyContent: "center"}}>
      <button onClick={() => changeYear(getYear(date) - 1)}>{"<"}</button>
      <span>{getYear(date)}</span>
      <button onClick={() => changeYear(getYear(date) + 1)}>{">"}</button>
      <select value={getMonth(date)} onChange={({target: {value}}) => changeMonth(Number(value))}>
        {Array.from({length: 12}, (_, index) => (
          <option key={index} value={index}>
            {new Date(2024, index).toLocaleString("default", {month: "long"})}
          </option>
        ))}
      </select>
    </div>
  );

  const getDoctorDashboard = async date => {
    if (date) {
      try {
        let formData = new FormData();
        formData.append("month", date);

        let response = await getDoctorDashboardApi(formData);
        if (response) {
          if (response.data.res === true) {
            setAllDetails(response.data);
            setAppointments(response.data.appointments ?? []);
            setFilteredAppointments(response.data.appointments ?? []);
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

  useEffect(() => {
    getDoctorDashboard(format(new Date(selectedDate), "yyyy-MM"));
  }, [selectedDate]);

  useEffect(() => {
    // Update filtered appointments when searchTerm or appointments change
    setFilteredAppointments(
      appointments.filter(appointment => `${appointment.first_name} ${appointment.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, appointments]);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />

        <div className="mainDiv">
          <div className="hdnDiv">
            <h2>Dashboard</h2>
            <p>Appointment scheduling and patient records management</p>
          </div>

          <div className="dashSlider">
            <Slider {...settings}>
              <div className="dashItem">
                <h2>
                  <img src={dashboard1} alt="Icon" /> Upcoming appointments of today
                </h2>
                <h3>{allDetails?.data?.today}</h3>
              </div>
              <div className="dashItem">
                <h2>
                  <img src={dashboard2} alt="Icon" /> Upcoming appointments of tomorrow
                </h2>
                <h3>{allDetails?.data?.tomorrow}</h3>
              </div>
              <div className="dashItem">
                <h2>
                  <img src={dashboard3} alt="Icon" /> Upcoming appointments of this week
                </h2>
                <h3>
                  {allDetails?.data?.this_week}{" "}
                  <span className="blueItem">
                    <strong>+28%</strong> up from last week
                  </span>
                </h3>
              </div>
              <div className="dashItem">
                <h2>
                  <img src={dashboard1} alt="Icon" /> Upcoming appointments of this month
                </h2>
                <h3>
                  0{" "}
                  <span className="plusItem">
                    <strong>+32%</strong> Up from last month
                  </span>
                </h3>
              </div>
              <div className="dashItem">
                <h2>
                  <img src={dashboard2} alt="Icon" /> Completed appointments of this month
                </h2>
                <h3>
                  0{" "}
                  <span className="plusItem">
                    <strong>+22%</strong> up from last month
                  </span>
                </h3>
              </div>
              <div className="dashItem">
                <h2>
                  <img src={dashboard4} alt="Icon" /> Canceled appointments of this month
                </h2>
                <h3>
                  0{" "}
                  <span className="minussItem">
                    <strong>+28%</strong> up from last week
                  </span>
                </h3>
              </div>
            </Slider>
          </div>

          <div className="dashFoot">
            <div className="upcomingAppoinment">
              <h2>
                Upcoming appointment <Link>View all</Link>
              </h2>

              <div className="searchFilter">
                <input type="text" placeholder="Search by name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="searchInput" />
                <div className="calendarFilter">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    renderCustomHeader={CustomHeader}
                    placeholderText="Select Month"
                  />
                </div>
              </div>

              <div className="appoList">
                <table>
                  <thead>
                    <tr>
                      <th>Patient name</th>
                      <th>Cons. type</th>
                      <th>Appt. date</th>
                      <th>Appt. time</th>
                      <th>No of visit</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment, index) => (
                        <tr key={index}>
                          <td className="appoName">
                            {appointment.first_name} {appointment.last_name}
                          </td>
                          <td>
                            <span className={`badge ${appointment.consultation_type === "Video Consultation" ? "video" : "cabinet"}`}>
                              {appointment.consultation_type}
                            </span>
                          </td>
                          <td>{appointment.appointment_date}</td>
                          <td>{appointment.time}</td>
                          <td>{appointment.already_visit}</td>
                          <td>
                            <Link to={appointment.details} className="viewLink">
                              <img src={viewIcon} alt="View details" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{textAlign: "center"}}>
                          No appointments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="upcomingAppoinment messageDiv">
              <h2>
                Messages <Link>View all</Link>
              </h2>

              <div className="appoList messageList">
                <ul>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                  <li>
                    <div className="msgLft">
                      <div className="messagePic">
                        <img src={userImg} alt="Icon" />
                      </div>
                      <div className="messageName">
                        <h3>Kestrel Tabrizi</h3>
                        <p>(229) 555-0109</p>
                      </div>
                    </div>
                    <div className="msgRgt">
                      <p>18:06</p>
                      <h4>02</h4>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
