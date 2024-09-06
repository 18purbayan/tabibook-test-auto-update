import React from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {useLocation, useNavigate} from "react-router-dom";
import Tick from "../assets/images/tick.svg";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = () => {
    // Perform login logic here
    if (location?.state?.from) {
      navigate(location?.state?.from);
    } else {
      navigate("/");
    }
  };
  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="ConfirmBox">
          <h3>Register</h3>
          <h4>Congratulations!</h4>
          <h5>
            Your mobile number has been verified successfully. Thank you for completing the verification process. You can now continue to use our services
            without any interruptions.
          </h5>

          <div className="tick">
            <img src={Tick} className="MainLogo" alt="logo" />
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Search a Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
