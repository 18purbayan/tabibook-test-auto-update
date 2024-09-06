import React from "react";
import CenterLogoheader from "../../components/MainHeader/CenterLogoheader";
import {useNavigate} from "react-router-dom";
import Tick from "../../assets/images/tick.svg";
import Bluelogo from "../../assets/images/blueLogo.svg";
import {useUserContext} from "../../context/UserContext";

const ConfirmationAdmin = () => {
  const {userData} = useUserContext();
  const navigate = useNavigate();
  const handleLogin = () => {
    // Perform login logic here
    navigate("/doctor/profile");
  };

  return (
    <div className="Main">
      <CenterLogoheader />
      <div className="Fullbody">
        <div className="ConfirmBox ConfirmBox2">
          <img src={Bluelogo} className="MainLogo2" alt="logo" />

          <div className="tick">
            <img src={Tick} className="MainLogo" alt="logo" />
          </div>

          <h4>
            {" "}
            Congratulations
            <br />
            <strong>{userData?.users?.first_name}!</strong>
          </h4>
          <h5>Please complete you profile</h5>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Complete my Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAdmin;
