import React, {useState} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {useNavigate, useParams} from "react-router-dom";
import {updatePasswordApi} from "../services/apiService";
import {toast} from "react-toastify";

const SetPassword = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formDataSignin, setFormDataSignin] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [formErrorsSignin, setFormErrorsSignin] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handleChangeSignin = e => {
    const {name, value} = e.target;
    setFormDataSignin({...formDataSignin, [name]: value});
    setFormErrorsSignin({...formErrorsSignin, [name]: ""});
  };

  // const handlesavedpassword = () => {
  //   // Perform login logic here
  //   navigate("/savedpassword");
  // };

  const handlesavedpassword = async () => {
    try {
      // e.preventDefault();
      if (validateFormSignin()) {
        setIsSubmitting(true);
        formDataSignin.token = id;
        let apiRes = await updatePasswordApi(formDataSignin);
        let responseData = apiRes;
        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
          setIsSubmitting(false);
        } else {
          //localStorage.setItem("tabsbookLoginInfo", JSON.stringify(responseData.data.data));
          navigate("/savedpassword");
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
      new_password: "",
      confirm_password: "",
    };

    if (formDataSignin.new_password === "") {
      errors.new_password = "Please enter your new password";
      isValid = false;
    } else if (!/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(formDataSignin.new_password)) {
      errors.new_password =
        "Password must be at least 8 characters long, must contain at least one digit, one special character, one uppercase letter, one lowercase letter.";
      isValid = false;
    }

    if (formDataSignin.confirm_password === "") {
      errors.confirm_password = "Please enter confirm password";
      isValid = false;
    }

    if (formDataSignin.new_password !== formDataSignin.confirm_password) {
      errors.confirm_password = "New password and confirm password does not match.";
      isValid = false;
    }

    setFormErrorsSignin(errors);
    return isValid;
  };
  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="LoginBox ">
          <h3>Password</h3>
          <h4>Set New Password</h4>

          {/* <form className="login-form" onSubmit={handlesavedpassword}> */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your new password"
              className="passwordInput"
              name="new_password"
              value={formDataSignin.new_password}
              onChange={handleChangeSignin}
            />
          </div>
          {formErrorsSignin.new_password && <span className="error">{formErrorsSignin.new_password}</span>}

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm your new password"
              className="passwordInput"
              name="confirm_password"
              value={formDataSignin.confirm_password}
              onChange={handleChangeSignin}
            />
          </div>
          {formErrorsSignin.confirm_password && <span className="error">{formErrorsSignin.confirm_password}</span>}

          {/* <Link to="" className="resend-code">
              Resend Code
            </Link> */}

          <button type="submit" className="login-button" onClick={() => handlesavedpassword()} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
