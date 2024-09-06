import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Header.scss";

import notificationIcon from "../../assets/images/notification-icon.svg";
import NoImage from "../../assets/images/no-image-avatar.png";
import {useUserContext} from "../../context/UserContext";
import Down from "../../assets/images/DownarrowB.svg";
import {IMAGE_URL} from "../../app_url";
import {onLogout} from "../../utils/commonData";

const DashboardDoctorHeader = () => {
  const {userData, setUserData} = useUserContext();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const Logout = () => {
    onLogout();
    setUserData(null);
    navigate("/");
  };

  return (
    <div className="doctorHdr">
      <div className="lftHeader">
        <h2>Welcome {userData?.users?.first_name}</h2>
      </div>

      <div className="rgtHeader">
        <div className="profile-menu">
          <div className="profile-header" onClick={toggleDropdown}>
            <img src={userData?.users?.profile_pic ? IMAGE_URL + userData?.users?.profile_pic : NoImage} className="profile-picture" alt="Profile Picture" />
            <span className="profile-name">
              {userData?.users?.first_name} {userData?.users?.last_name}
            </span>
            <button className="dropdown-toggle">
              <img src={Down} className="Downarrow" alt="icon" />
            </button>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/doctor/profile">My profile</Link>
              <Link to="/doctor/account">My account</Link>
              <Link to={"javascript:void(0);"} onClick={Logout}>
                Logout
              </Link>
              {/* <a href="#favorite-doctor">Favorite doctor</a> */}
              {/* <a href="#logout">Logout</a> */}
            </div>
          )}
        </div>

        {/* <div className="userDiv">
          <img src={usernIcon} alt="usernIcon" /> {userData?.users?.first_name} {userData?.users?.last_name}
        </div> */}
        <div className="notiDiv">
          <img src={notificationIcon} alt="notificationIcon" />
        </div>
        <div className="searchDiv">
          <input type="text" placeholder="Search here" />
          <button className="searchicon"> Search</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctorHeader;
