import React from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {useNavigate} from "react-router-dom";
import Tick from "../assets/images/tick.svg";

const PasswordSaved = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Perform login logic here
    navigate("/");
  };

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="ConfirmBox">
          <h3>Password</h3>
          <h4>Password Saved!</h4>
          <h5>Your password has been updated and saved successfully. You can now use your new password to log in.</h5>

          <div className="tick">
            <img src={Tick} className="MainLogo" alt="logo" />
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSaved;
