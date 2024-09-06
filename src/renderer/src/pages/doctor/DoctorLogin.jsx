import React, {useState} from "react";
import CenterLogoheader from "../../components/MainHeader/CenterLogoheader";
import {Link, useNavigate} from "react-router-dom";
import Nopreview from "../../assets/images/Nopreview.svg";
import Preview from "../../assets/images/preview.svg";
import {useUserContext} from "../../context/UserContext";
import {doctorLoginApi} from "../../services/apiService";
import {toast} from "react-toastify";

const DoctorLogin = () => {
  const {setUserData, isActiveDocAcc, setIsActiveDocAcc} = useUserContext();
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formDataSignin, setFormDataSignin] = useState({
    email: "",
    password: "",
  });

  const [formErrorsSignin, setFormErrorsSignin] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChangeSignin = e => {
    const {name, value} = e.target;
    setFormDataSignin({...formDataSignin, [name]: value});
    setFormErrorsSignin({...formErrorsSignin, [name]: ""});
  };

  const submitLogin = e => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      if (validateFormSignin()) {
        setIsSubmitting(true);
        let apiRes = await doctorLoginApi(formDataSignin);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
        } else {
          localStorage.setItem("tabsbookLoginInfo", JSON.stringify(responseData.data.data));
          setUserData(responseData.data.data);
          toast.success(responseData.data.msg ? responseData.data.msg : "Logged in successfully", {autoClose: 1500});
          const data = responseData.data.data;
          const users = data.users; // Destructure to make the code cleaner
          if (
            !users.speciality ||
            !users.doctor_experts.length ||
            !users.doctor_consultations.length ||
            !users.cabin_address ||
            (users.add_transport === 1 && !(users.doctor_transports.length || users.doctor_parkings.length || users.doctor_informations.length)) ||
            !users.service_description ||
            !users.profile_pic ||
            !users.doctor_documents.length ||
            !users.doctor_degrees.length ||
            !users.doctor_trainings.length ||
            !users.doctor_experiences.length ||
            !users.doctor_publications?.length ||
            users.consultation_type === null ||
            !users.price_description ||
            users.payment_type === null ||
            !users.rpps_no ||
            !users.document_license ||
            !data.doctor_faqs.length ||
            !data.doctor_languages.length
          ) {
            setIsActiveDocAcc(false);
            localStorage.setItem("isAciveDoctorAcc", "0");
            navigate("/doctor/confirmation");
          } else {
            setIsActiveDocAcc(true);
            localStorage.setItem("isAciveDoctorAcc", "1");
            navigate("/doctor/dashboard");
          }
          // if (!responseData.data.data.users.speciality || !responseData.data.data.users.cabin_address || !responseData.data.data.users.document_license) {
          //   navigate("/doctor/confirmation");
          // } else {
          //   navigate("/doctor/dashboard");
          // }
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const validateFormSignin = () => {
    let isValid = true;
    const errors = {
      email: "",
      password: "",
    };

    if (formDataSignin.email === "") {
      errors.email = "Please enter your email";
      isValid = false;
    }

    if (formDataSignin.password === "") {
      errors.password = "Please enter your password";
      isValid = false;
    }

    setFormErrorsSignin(errors);
    return isValid;
  };

  return (
    <div className="Main">
      <CenterLogoheader />
      <div className="Fullbody">
        <div className="LoginBox">
          <h3>Login</h3>
          <h4>Welcome Back! </h4>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              className="emailInput"
              name="email"
              value={formDataSignin.email}
              onChange={handleChangeSignin}
              onKeyDown={submitLogin}
            />
          </div>
          {formErrorsSignin.email ? <span className="error">{formErrorsSignin.email}</span> : null}
          <div className="input-group">
            <input
              name="password"
              value={formDataSignin.password}
              onChange={handleChangeSignin}
              onKeyDown={submitLogin}
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="passwordInput"
            />
            <span className="password-icon" onClick={togglePasswordVisibility}>
              <img src={passwordVisible ? Nopreview : Preview} alt="Toggle Password Visibility" />
            </span>
          </div>
          {formErrorsSignin.password ? <span className="error">{formErrorsSignin.password}</span> : null}

          <Link to="/forgotpassword" className="forgot-password">
            Forgot Password
          </Link>
          <button type="submit" className="login-button" onClick={() => handleLogin()} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DoctorLogin;
