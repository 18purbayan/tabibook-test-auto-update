import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/Logo.svg";
import Help from "../../assets/images/HelpIcon.svg";
import Useimg from "../../assets/images/userImg.png";
import Notification from "../../assets/images/notification.svg";
import Down from "../../assets/images/DownarrowW.svg";

import { Link } from "react-router-dom";
// Import the Popup component
import "./Header.scss";
import Searchfilter from "../Searchfilter";

const Listingheader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  return (
    <div className="TopPart">
      <div className="MainHr MainHr2">
        <div className="TopHr">
          <div className="CustomContainer">
            <div className="logo">
              <Link>
                <img src={Logo} className="MainLogo" alt="logo" />
              </Link>
            </div>

            <div className="HrRight">
              <div className="Navbar">
                <ul>
                  <li>
                    <Link>My Appointments</Link>
                  </li>
                  <li>
                    <Link>My Documents</Link>
                  </li>
                  <li>
                    <Link>
                      <img src={Help} className="helpIcon" alt="icon" /> Help
                      Center
                    </Link>
                  </li>
                  <li>
                    <Link>
                      <img src={Notification} className="helpIcon" alt="icon" />{" "}
                      Notification
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="Hrloginpart">
                {/* <button className="LoginButton">
                    <span>
                      <img src={UserIcon} className="UserIcon" alt="icon" /> To
                      Login
                    </span>
                  </button> */}

                <div className="profile-menu">
                  <div className="profile-header" onClick={toggleDropdown}>
                    <img
                      src={Useimg}
                      className="profile-picture"
                      alt="Profile Picture"
                    />
                    <span className="profile-name">Kestrel Tabrizi</span>
                    <button className="dropdown-toggle">
                      <img src={Down} className="Downarrow" alt="icon" />
                    </button>
                  </div>
                  {isDropdownOpen && (
                    <div className="dropdown-content">
                      <a href="#profile">My profile</a>
                      <a href="#favorite-doctor">Favorite doctor</a>
                      <a href="#logout">Logout</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="BottompHr">
          <div className="CustomContainer">
            <div className="HeroFrm">
              <Searchfilter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listingheader;
