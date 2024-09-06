import React, {useState} from "react";
import Logo from "../../assets/images/Logo.svg";
import Help from "../../assets/images/HelpIcon.svg";
import UserIcon from "../../assets/images/UserIcon.svg";
import PatientIcon from "../../assets/images/patientIcon.svg";
import DoctorIcon from "../../assets/images/doctorIcon.svg";
import {Link, useNavigate} from "react-router-dom";
import Popup from "./HrPopup";
import "./Header.scss";
import {toast} from "react-toastify";
import Searchfilter from "../Searchfilter";

const Header = props => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedType, setSelectedType] = useState();

  const openPopup = () => {
    if (props?.setShowLoginPopup) {
      props?.setShowLoginPopup(true);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    if (props?.setShowLoginPopup) {
      props?.setShowLoginPopup(false);
    }

    setShowPopup(false);
  };

  const handleSubmit = () => {
    if (!selectedType) {
      toast.warn("Please select a type to login!", {autoClose: 1500});
    } else {
      if (selectedType === "patient") {
        navigate("/patient/login", {state: {from: props.from}});
      } else if (selectedType === "doctor") {
        navigate("/doctor/login");
      }
    }
  };

  return (
    <div className="TopPart">
      <div className="MainHr MainHr2">
        <div className="TopHr">
          <div className="CustomContainer">
            <div className="logo">
              <Link to={"/"}>
                <img src={Logo} className="MainLogo" alt="logo" />
              </Link>
            </div>

            <div className="HrRight">
              <div className="Navbar">
                <ul>
                  <li>
                    <Link>About</Link>
                  </li>
                  <li>
                    <Link>Contact</Link>
                  </li>
                  <li>
                    <Link>
                      <img src={Help} className="helpIcon" alt="icon" /> Help Center
                    </Link>
                  </li>
                  <li>
                    <Link className="HrButton" to={"/doctor/home"}>
                      Are you a practitioner?
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="Hrloginpart">
                <button className="LoginButton" onClick={openPopup}>
                  <span>
                    <img src={UserIcon} className="UserIcon" alt="icon" /> To Login
                  </span>
                  <p>manage appointments</p>
                </button>
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

        {/* Use the Popup component here */}
        <Popup show={showPopup || props?.showLoginPopup} handleClose={closePopup}>
          <div className="bpopupBox">
            <h2>Login</h2>
            <ul className="LogininfoList">
              <li>
                <label>
                  <span className="LogininfoLft">
                    <img src={PatientIcon} alt="PatientIcon" />
                    <span className="NameWrapper">For Patient</span>
                  </span>
                  <input type="radio" id="patient" name="option" value="patient" onClick={() => setSelectedType("patient")} />
                </label>
              </li>
              <li>
                <label>
                  <span className="LogininfoLft">
                    <img src={DoctorIcon} alt="DoctorIcon" />
                    <span className="NameWrapper">For Doctor</span>
                  </span>
                  <input type="radio" id="doctor" name="option" value="doctor" onClick={() => setSelectedType("doctor")} />
                </label>
              </li>
              {/* <li>
                  <label>
                    <span className="LogininfoLft">
                      <img src={NurseIcon} alt="NurseIcon" />
                      <span className="NameWrapper">For Nurse</span>
                    </span>
                    <input type="radio" id="nurse" name="option" value="nurse" />
                  </label>
                </li> */}
            </ul>
            <button type="submit" className="submitBtn" onClick={() => handleSubmit()}>
              submit
            </button>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Header;
