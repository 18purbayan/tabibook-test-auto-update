import React, {useState} from "react";
import Logo from "../../assets/images/Logo.svg";
import Help from "../../assets/images/HelpIcon.svg";
import NoImage from "../../assets/images/no-image-avatar.png";
import Notification from "../../assets/images/notification.svg";
import Down from "../../assets/images/DownarrowW.svg";

import {Link, useNavigate} from "react-router-dom";
import "./Header.scss";
import {onLogout} from "../../utils/commonData";
import {useUserContext} from "../../context/UserContext";
import {IMAGE_URL} from "../../app_url";
import Searchfilter from "../Searchfilter";

const Afterloginheader = props => {
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
    <div className="TopPart">
      <div className="MainHr MainHr2">
        <div className="TopHr">
          <div className="CustomContainer">
            <div className="logo">
              <Link to="/">
                <img src={Logo} className="MainLogo" alt="logo" />
              </Link>
            </div>

            <div className="HrRight">
              <div className="Navbar">
                <ul>
                  <li>
                    <Link to="/my-appointments">My Appointments</Link>
                  </li>
                  <li>
                    <Link>My Documents</Link>
                  </li>
                  <li>
                    <Link>
                      <img src={Help} className="helpIcon" alt="icon" /> Help Center
                    </Link>
                  </li>
                  <li>
                    <Link>
                      <img src={Notification} className="helpIcon" alt="icon" /> Notification
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
                      src={userData?.users?.profile_pic ? IMAGE_URL + userData?.users?.profile_pic : NoImage}
                      className="profile-picture"
                      alt="Profile Picture"
                    />
                    <span className="profile-name">
                      {userData?.users?.first_name} {userData?.users?.last_name}
                    </span>
                    <button className="dropdown-toggle">
                      <img src={Down} className="Downarrow" alt="icon" />
                    </button>
                  </div>
                  {isDropdownOpen && (
                    <div className="dropdown-content">
                      <Link to="/my-profile">My profile</Link>
                      <Link to="/favorite-doctor">Favorite doctor</Link>
                      <Link to={"javascript:void(0);"} onClick={Logout}>
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {props?.from === "/search-listing" ? (
          <div className="BottompHr">
            <div className="CustomContainer">
              <div className="HeroFrm">
                <Searchfilter />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Afterloginheader;
