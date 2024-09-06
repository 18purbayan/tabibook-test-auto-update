import React, {useEffect} from "react";
import Back from "../assets/images/Back.svg";
import Mainheader from "../components/MainHeader/Mainheader";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../context/UserContext";

const WelcomeScreen = () => {
  const {userData, setUserData} = useUserContext();
  const navigate = useNavigate();
  const handleLogin = () => {
    // Perform login logic here
    navigate("/patient/login");
  };

  const handleRegister = () => {
    // Perform login logic here
    navigate("/register");
  };

  useEffect(() => {
    if (userData) {
      if (userData?.users?.type === "Doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="WelcomeBox">
          <button className="backBtn">
            <img src={Back} className="backIcon" alt="icon" /> Go to back home page
          </button>

          <h2>Sign up or log in</h2>
          <h3>New to tabiBook?</h3>
          <button className="RegBtn" onClick={handleRegister}>
            Register
          </button>
          <h3>I already have a tabiBook account</h3>
          <button className="LoginBtn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
