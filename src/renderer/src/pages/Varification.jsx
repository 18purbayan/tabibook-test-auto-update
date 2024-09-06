import React, {useState, useEffect} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import Call from "../assets/images/Callicon.svg";
import otp from "../assets/images/OTPicon.svg";
import {useNavigate, useLocation} from "react-router-dom";
import {signUpSendVerificationMessageApi} from "../services/apiService";

const Varification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id, from} = location.state || {};

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState("call");
  
  const handlecode = async () => {
    setIsSubmitting(true);
    let apiRes = await signUpSendVerificationMessageApi({id});
    let responseData = apiRes;

    if (responseData.data.res == false) {
      setErrorMessage(responseData.data.msg);
      setIsSubmitting(false);
    } else {
      navigate("/verificationcode", {state: {id: responseData.data.data.id, otpFromServer: responseData.data.data.otp, from: from}});
      setType("call");
    }
  };

  useEffect(() => {
    let value = JSON.parse(localStorage.getItem("tabsbookLoginInfo"));
    if (value != undefined) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (id) {
    } else {
      navigate("/register");
    }
  }, []);

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error">{errorMessage}</div>}
        <div className="LoginBox">
          <div className="CheckBoxDiv">
            <div className=" checkbox-style2">
              <label onClick={() => setType("call")}>
                <input type="radio" name="terms" value="call" checked={type === "call"} />
                <img src={Call} className="CallIcon" alt="Call" />
                <em>Flash Call Verification</em>
                <span>A flash call is a near-instant dropped call that is automatically placed to a mobile number.</span>
              </label>
            </div>
            <div className=" checkbox-style2">
              <label onClick={() => setType("otp")}>
                <input type="radio" name="terms" value="otp" checked={type === "otp"} />
                <img src={otp} className="CallIcon" alt="Call" />
                <em>OTP Verification</em>
                <span>Systems provide a mechanism for logging/register on to a network or service using a unique password that can only be used once</span>
              </label>
            </div>
          </div>
          <button type="submit" className="login-button mb-0" onClick={() => handlecode()} disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Varification;
