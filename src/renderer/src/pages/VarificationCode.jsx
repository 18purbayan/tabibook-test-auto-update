import React, {useState, useEffect, useRef} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {Link, useNavigate, useLocation} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {signUpSendVerificationMessageApi, signUpVerifyAccountApi} from "../services/apiService";
import {toast} from "react-toastify";
import {useUserContext} from "../context/UserContext";

const VarificationCode = () => {
  const {setUserData} = useUserContext();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userId, setUserId] = useState(null);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const {id, otpFromServer, from} = location.state || {};

  useEffect(() => {
    const value = JSON.parse(localStorage.getItem("tabsbookLoginInfo"));
    if (value) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (id) {
      setUserId(id);
    } else {
      navigate("/register");
    }
  }, [id, navigate]);

  const handleChange = (index, event) => {
    const {value} = event.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  
  const handlesavedpassword = async event => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const apiRes = await signUpVerifyAccountApi({id: userId, otp: otp.join("")});
      const responseData = apiRes;

      if (responseData.data.res === false) {
        setErrorMessage(responseData.data.msg);
        setIsSubmitting(false);
      } else {
        localStorage.setItem("tabsbookLoginInfo", JSON.stringify(responseData.data.data));
        setUserData(responseData.data.data);
        navigate("/confirmation", {state: {from: from}});
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying the account.");
      setIsSubmitting(false);
    }
  };

  const handlecode = async () => {
    setIsSubmitting(true);
    try {
      const apiRes = await signUpSendVerificationMessageApi({id: userId});
      const responseData = apiRes;

      if (responseData.data.res === false) {
        toast.error(responseData.data.msg, {autoClose: 1500});
      } else {
        toast.success("OTP is sent to Your Mobile Number", {autoClose: 1500});
      }
    } catch (error) {
      toast.error("An error occurred while sending the verification code.", {autoClose: 1500});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="LoginBox vcode">
          <h3>Register</h3>
          <h4>Verify your Mobile</h4>
          <p>Your OTP is: {otpFromServer}</p>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}

          <form className="login-form" onSubmit={handlesavedpassword}>
            <div className="otp-input">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={event => handleChange(index, event)}
                  onKeyDown={event => handleKeyDown(index, event)}
                  maxLength="1"
                  ref={el => (inputRefs.current[index] = el)}
                  className="otp-field"
                  placeholder="*"
                />
              ))}
            </div>
            <p className="createLink">
              Not receive OTP?{" "}
              <a href="javascript:void(0)" onClick={handlecode}>
                Resend again
              </a>
            </p>
            {/* <p className="createLink">
              Not receive OTP? <Link onClick={handlecode}>Resend again</Link>
            </p> */}

            <Button className="login-button mt-4" variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <p className="createLink">
              Don’t have an account? <Link to="/register">Create Now!</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VarificationCode;
