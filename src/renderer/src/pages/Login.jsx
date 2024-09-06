import React, {useState} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Nopreview from "../assets/images/Nopreview.svg";
import Preview from "../assets/images/preview.svg";
import {loginApi} from "../services/apiService";
import {toast} from "react-toastify";
import {useUserContext} from "../context/UserContext";

const Login = () => {
  const {setUserData} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formDataSignin, setFormDataSignin] = useState({
    email: "",
    password: "",
  });

  const [formErrorsSignin, setFormErrorsSignin] = useState({
    email: "",
    password: "",
  });

  const handleChangeSignin = e => {
    const {name, value} = e.target;
    setFormDataSignin({...formDataSignin, [name]: value});
    setFormErrorsSignin({...formErrorsSignin, [name]: ""});
  };

  const handleLogin = async () => {
    try {
      // e.preventDefault();
      if (validateFormSignin()) {
        setIsSubmitting(true);
        let apiRes = await loginApi(formDataSignin);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
          setIsSubmitting(false);
        } else {
          if (responseData.data.status) {
            toast.warn(responseData.data.msg, {autoClose: 1500});
            navigate("/verification", {state: {id: responseData.data.data, from: location?.state?.from}});
          } else {
            localStorage.setItem("tabsbookLoginInfo", JSON.stringify(responseData.data.data));
            setUserData(responseData.data.data);
            toast.success(responseData.data.msg ? responseData.data.msg : "Logged in successfully", {autoClose: 1500});
            if (location?.state?.from) {
              navigate(location.state.from);
            } else {
              navigate("/");
            }
          }
        }
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

  const handleforgot = () => {
    // Perform login logic here
    navigate("/forgotpassword");
  };

  const handleRegister = () => {
    // Perform login logic here
    navigate("/register");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submitLogin = e => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="LoginBox">
          <h3>Login</h3>
          <h4>Welcome Back! </h4>

          {/* <form className="login-form" onSubmit={handleLogin}> */}
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
          {formErrorsSignin.email && <span className="error">{formErrorsSignin.email}</span>}
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
            {/* <input
                type="password"
                placeholder="Password"
                className="passwordInput"
                required
              /> */}
            <span className="password-icon" onClick={togglePasswordVisibility}>
              <img src={passwordVisible ? Nopreview : Preview} alt="Toggle Password Visibility" />
            </span>
          </div>
          {formErrorsSignin.password && <span className="error">{formErrorsSignin.password}</span>}

          <Link to="/forgotpassword" className="forgot-password">
            Forgot Password
          </Link>

          <button type="submit" className="login-button" onClick={() => handleLogin()} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Login"}
          </button>

          <p className="createLink">
            Don’t have an account? <Link to="/register" state={{from: location?.state?.from}}>Create Now!</Link>
          </p>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
