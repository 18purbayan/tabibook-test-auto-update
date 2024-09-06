import React from "react";
import ApproveDoctorheader from "../../components/MainHeader/ApproveDoctorheader";
import {useNavigate} from "react-router-dom";
import Tick from "../../assets/images/tick.svg";
import Bluelogo from "../../assets/images/blueLogo.svg";

const Approval = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Perform login logic here
    navigate("/doctor/login");
  };

  return (
    <div className="Main">
      <ApproveDoctorheader />
      <div className="Fullbody">
        <div className="ConfirmBox ConfirmBox2">
          <img src={Bluelogo} className="MainLogo2" alt="logo" />

          <div className="tick">
            <img src={Tick} className="MainLogo" alt="logo" />
          </div>

          <h4>Thank you!</h4>
          <h5>Our support team will review and will send you a profile setup link in your email within 48 hours.</h5>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Approval;
