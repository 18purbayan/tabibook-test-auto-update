import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import Logo from "../assets/images/sidebar-logo.svg";
import icon1 from "../assets/images/dashboard-icon.svg";
import icon2 from "../assets/images/appoinment-icon.svg";
import icon3 from "../assets/images/availability-icon.svg";
import icon4 from "../assets/images/documents-icon.svg";
import icon5 from "../assets/images/message-icon.svg";
import icon6 from "../assets/images/nurse-icon.svg";
import icon7 from "../assets/images/logout-icon.svg";
import {onLogout} from "../utils/commonData";
import {useUserContext} from "../context/UserContext";

const Header = () => {
  const {userData, setUserData, isActiveDocAcc} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    setUserData(null);
    navigate("/");
  };

  return (
    <div className="sideMain">
      <div className="sidebarDiv">
        <div className="logoSide">
          <Link>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <ul className="sidebarList">
          <li className={location.pathname === "/doctor/dashboard" ? "active" : ""}>
            <Link to={isActiveDocAcc ? "/doctor/dashboard" : "/doctor/incomplete-profile"}>
              <div className="iconDiv">
                <img src={icon1} alt="icon1" />
              </div>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === "/doctor/appointments" ? "active" : ""}>
            {/* <Link to={isActiveDocAcc ? "/doctor/appointments" : "/doctor/incomplete-profile"}> */}
            <Link>
              <div className="iconDiv">
                <img src={icon2} alt="icon2" />
              </div>
              <span>Appointments</span>
            </Link>
          </li>
          <li className={location.pathname === "/doctor/availability" ? "active" : ""}>
            {/* <Link> */}
            <Link to={isActiveDocAcc ? "/doctor/availability" : "/doctor/incomplete-profile"}>
              <div className="iconDiv">
                <img src={icon3} alt="icon3" />
              </div>
              <span>Availability</span>
            </Link>
          </li>
          <li>
            <Link>
              <div className="iconDiv">
                <img src={icon4} alt="icon4" />
              </div>
              <span>Documents</span>
            </Link>
          </li>
          <li>
            <Link>
              <div className="iconDiv">
                <img src={icon5} alt="icon5" />
              </div>
              <span>Messages</span>
            </Link>
          </li>
          <li className={location.pathname === "/doctor/nurses" ? "active" : ""}>
            {/* <Link> */}
            <Link to={isActiveDocAcc ? "/doctor/nurses" : "/doctor/incomplete-profile"}>
              <div className="iconDiv">
                <img src={icon6} alt="icon6" />
              </div>
              <span>Nurse</span>
            </Link>
          </li>
          <li className="doctorLogout">
            <Link to={"javascript:void(0);"} onClick={() => handleLogout()}>
              <div className="iconDiv">
                <img src={icon7} alt="icon7" />
              </div>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
