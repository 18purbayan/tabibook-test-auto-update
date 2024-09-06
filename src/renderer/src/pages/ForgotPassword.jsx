import React, {useState} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {forgotPasswordApi} from "../services/apiService";

const ForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  // const handlesetpassword = () => {
  //   navigate("/setpassword");
  // };

  const [formDataSignin, setFormDataSignin] = useState({
    email: "",
  });

  const [formErrorsSignin, setFormErrorsSignin] = useState({
    email: "",
  });

  const handleChangeSignin = e => {
    const {name, value} = e.target;
    setFormDataSignin({...formDataSignin, [name]: value});
    setFormErrorsSignin({...formErrorsSignin, [name]: ""});
  };

  const handlesetpassword = async () => {
    //setIsSubmitting(true);
    try {
      // e.preventDefault();
      if (validateFormSignin()) {
        setIsSubmitting(true);
        let apiRes = await forgotPasswordApi(formDataSignin);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
          setIsSubmitting(false);
        } else {
          toast.success(responseData.data.msg, {autoClose: 1500});
          //localStorage.setItem("tabsbookLoginInfo", JSON.stringify(responseData.data.data));
          //navigate("/home");

          setIsSubmitting(false);
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  const validateFormSignin = () => {
    let isValid = true;
    const errors = {
      email: "",
    };

    if (formDataSignin.email === "") {
      errors.email = "Please enter your email";
      isValid = false;
    }

    setFormErrorsSignin(errors);
    return isValid;
  };

  const submitEmail = e => {
    if (e.key === "Enter") {
      handlesetpassword();
    }
  };

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="LoginBox">
          <h3>Password</h3>
          <h4>Forgot Password</h4>

          {/* <form className="login-form" onSubmit={handlesetpassword}> */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              className="emailInput"
              name="email"
              value={formDataSignin.email}
              onChange={handleChangeSignin}
              onKeyDown={submitEmail}
            />
          </div>
          {formErrorsSignin.email && <span className="error">{formErrorsSignin.email}</span>}

          <button type="submit" className="login-button" onClick={() => handlesetpassword()} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
