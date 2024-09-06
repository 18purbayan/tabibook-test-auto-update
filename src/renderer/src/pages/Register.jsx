import React, {useState, useEffect} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {cityListApi, signUpApi} from "../services/apiService";
import {toast} from "react-toastify";

const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityList, setCityList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handlevarification = () => {
    // Perform login logic here
    navigate("/verification");
  };

  const [formDataSignup, setFormDataSignup] = useState({
    first_name: "",
    last_name: "",
    city_id: "",
    email: "",
    cell_phone: "",
    month: "",
    day: "",
    year: "",
    password: "",
  });

  const [formErrorsSignup, setFormErrorsSignup] = useState({
    first_name: "",
    last_name: "",
    city_id: "",
    email: "",
    cell_phone: "",
    month: "",
    day: "",
    year: "",
    password: "",
  });

  const handleChangeSignup = e => {
    const {name, value} = e.target;
    setFormDataSignup({...formDataSignup, [name]: value});
    setFormErrorsSignup({...formErrorsSignup, [name]: ""});
  };

  const getCityList = async () => {
    try {
      let apiRes = await cityListApi();
      let responseData = apiRes;
      if (responseData) {
        setCityList(responseData.data.data);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateFormSignup = () => {
    let isValid = true;
    const errors = {
      first_name: "",
      last_name: "",
      city_id: "",
      email: "",
      cell_phone: "",
      month: "",
      day: "",
      year: "",
      password: "",
    };

    if (formDataSignup.first_name === "") {
      errors.first_name = "Please enter your first name";
      isValid = false;
    }

    if (formDataSignup.last_name === "") {
      errors.last_name = "Please enter your last name";
      isValid = false;
    }

    if (formDataSignup.city_id === "") {
      errors.city_id = "Please select city";
      isValid = false;
    }

    if (formDataSignup.email === "") {
      errors.email = "Please enter email";
      isValid = false;
    }

    if (formDataSignup.cell_phone === "") {
      errors.cell_phone = "Please enter your phone number";
      isValid = false;
    }

    if (formDataSignup.month === "") {
      errors.month = "Please select month";
      isValid = false;
    }

    if (formDataSignup.day === "") {
      errors.day = "Please select day";
      isValid = false;
    }

    if (formDataSignup.year === "") {
      errors.year = "Please select year";
      isValid = false;
    }

    if (formDataSignup.password === "") {
      errors.password = "Please enter your password";
      isValid = false;
    } else if (!/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(formDataSignup.password)) {
      errors.password =
        "Password must be at least 8 characters long, must contain at least one digit, one special character, one uppercase letter, one lowercase letter.";
      isValid = false;
    }

    setFormErrorsSignup(errors);
    return isValid;
  };

  const handleSignup = async e => {
    try {
      e.preventDefault();
      if (validateFormSignup()) {
        setIsSubmitting(true);
        let apiRes = await signUpApi(formDataSignup);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
          setIsSubmitting(false);
        } else {
          // console.warn(response.data.data.authorisation.token)
          // const token = response.data.data.authorisation.token;
          // localStorage.setItem("wealthNexusLoginInfo", JSON.stringify(response.data.data));
          // let value = JSON.parse(localStorage.getItem("wealthNexusLoginInfo"));
          // console.warn(response.data.data);

          navigate("/verification", {state: {id: responseData.data.data.id, from: location?.state?.from}});
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  const daysarray = [];
  for (let i = 1; i <= 31; i++) {
    daysarray.push(i);
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const years = [];

  for (let year = startYear; year < currentYear; year++) {
    years.push(year);
  }

  const handleKeyPress = e => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    getCityList();
    let value = JSON.parse(localStorage.getItem("tabsbookLoginInfo")); //JSON.parse(secureLocalStorage.getItem('loginInfo'));
    if (value != undefined) {
      navigate("/");
    }
  }, []);

  return (
    <div className="Main">
      <Mainheader />
      <div className="Fullbody">
        <div className="RegBox">
          <h3>Register</h3>
          <h4>Sign Up for free</h4>
          <h5>Enter your information to continue.</h5>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}

          <form className="login-form" onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="tel"
                placeholder="Phone Number"
                className="telInput"
                name="cell_phone"
                value={formDataSignup.cell_phone}
                onChange={handleChangeSignup}
                onKeyPress={handleKeyPress}
                inputMode="numeric"
                maxLength="10"
              />
            </div>
            {formErrorsSignup.cell_phone && <span className="error">{formErrorsSignup.cell_phone}</span>}
            <label className="labelTxt">A code will be sent to you on this number to validate your account.</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="First name"
                className="telInput"
                maxLength="50"
                name="first_name"
                value={formDataSignup.first_name}
                onChange={handleChangeSignup}
              />
            </div>{" "}
            {formErrorsSignup.first_name && <span className="error">{formErrorsSignup.first_name}</span>}
            <div className="input-group">
              <input
                type="text"
                placeholder="Last name"
                className="telInput"
                maxLength="50"
                name="last_name"
                value={formDataSignup.last_name}
                onChange={handleChangeSignup}
              />
            </div>
            {formErrorsSignup.last_name && <span className="error">{formErrorsSignup.last_name}</span>}
            <div className="input-group">
              <div className="select-style">
                <select name="city_id" onChange={handleChangeSignup}>
                  <option value="" disabled selected>
                    Select City
                  </option>
                  {cityList?.map((item, index) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {formErrorsSignup.city_id && <span className="error">{formErrorsSignup.city_id}</span>}
            <label className="labelTxt2">Date of birth</label>
            <div className="inputRow">
              <div className="input-group">
                <div className="select-style">
                  <select name="month" onChange={handleChangeSignup}>
                    <option value="" disabled selected>
                      Month
                    </option>
                    {months?.map((item, index) => (
                      <option value={index + 1}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* {formErrorsSignup.month && <span className="error">{formErrorsSignup.month}</span>} */}

              <div className="input-group">
                <div className="select-style">
                  <select name="day" onChange={handleChangeSignup}>
                    <option value="" disabled selected>
                      Day
                    </option>
                    {daysarray?.map((item, index) => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* {formErrorsSignup.day && <span className="error">{formErrorsSignup.day}</span>} */}

              {/* <div className="input-group dayInput">
                <input type="text" placeholder="Day" className="telInput" />
              </div> */}

              <div className="input-group">
                <div className="select-style">
                  <select name="year" onChange={handleChangeSignup}>
                    <option value="" disabled selected>
                      Year
                    </option>
                    {years?.map(year => (
                      <option value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* {formErrorsSignup.year && <span className="error">{formErrorsSignup.year}</span>} */}
            </div>
            {(formErrorsSignup.month || formErrorsSignup.day || formErrorsSignup.year) && <span className="error">Please enter date of birth.</span>}
            <div className="input-group">
              <input type="email" placeholder="Email address" className="telInput" name="email" value={formDataSignup.email} onChange={handleChangeSignup} />
            </div>
            {formErrorsSignup.email && <span className="error">{formErrorsSignup.email}</span>}
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                className="telInput"
                name="password"
                value={formDataSignup.password}
                onChange={handleChangeSignup}
              />
            </div>
            {formErrorsSignup.password && <span className="error">{formErrorsSignup.password}</span>}
            <label className="labelTxt">Your password will allow you to manage your medical appointments.</label>
            {/* <button type="submit" className="login-button">
              Sign Up
            </button> */}
            {isSubmitting ? (
              <Button className="login-button" variant="primary" type="submit" disabled>
                Please wait...
              </Button>
            ) : (
              <Button className="login-button" variant="primary" type="submit">
                Sign Up
              </Button>
            )}
            <p className="createLink checkbox-style">
              <label>
                <input type="checkbox" name="terms" value="accepted" required />I agree to the terms and conditions
              </label>
            </p>
            <p className="createLink">
              I already have a tabiBook account <Link to="/patient/login">To Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
