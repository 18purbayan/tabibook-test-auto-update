import React, {useEffect, useState, useRef} from "react";
import Afterloginheader from "../components/MainHeader/Afterloginheader";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import ToggleSwitch from "../components/ToggleSwitch";
import PhoneNumberEdit from "../components/PhoneNumberEdit";
import PasswordEdit from "../components/PasswordEdit";
import AccountEdit from "../components/AccountEdit";
import Button from "react-bootstrap/Button";
import {
  myAccountDetailsApi,
  removeProfilePictureApi,
  updateOtpApi,
  updatePhoneNumberApi,
  updateProfilePictureApi,
  updateShowPhoneNumberApi,
} from "../services/apiService";
import {useUserContext} from "../context/UserContext";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import Call from "../assets/images/Callicon.svg";
import OtpIcon from "../assets/images/OTPicon.svg";

const MyAccount = () => {
  const {userData, setUserData} = useUserContext();
  const inputRefs = useRef(["", "", "", ""]);
  const [isOn, setIsOn] = useState(false);
  const [proImage, setProImage] = useState();
  const [allDetails, setAllDetails] = useState();
  const [proUpBtnDis, setProUpBtnDis] = useState(false);
  const [showPhoneChecked, setShowPhoneChecked] = useState(false);
  const [showSection, setShowSection] = useState("section1");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userId, setUserId] = useState(null);
  const [detailsForVerify, setDetailsForVerify] = useState();
  const [newPhNumber, setNewPhNumber] = useState();

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const getProfileDetails = async () => {
    try {
      let response = await myAccountDetailsApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          setProImage(response.data.data.profile_pic);
          if (response.data.data.show_phone === 1) {
            setShowPhoneChecked(true);
          } else {
            setShowPhoneChecked(false);
          }
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleUploadProfileImage = async imageFile => {
    if (imageFile) {
      setProUpBtnDis(true);
      try {
        let formData = new FormData();
        formData.append("profile_pic", imageFile);

        let response = await updateProfilePictureApi(formData);
        if (response) {
          if (response.data.res === true) {
            setProImage(response.data.data.profile_pic);
            let tempObj = {...userData};
            tempObj.users.profile_pic = response.data.data.profile_pic;
            setUserData(tempObj);
            localStorage.setItem("tabsbookLoginInfo", JSON.stringify(tempObj));
            // setUserData({
            //   ...userData,
            //   user_details: {
            //     ...userData.user_details,
            //     profile_pic: response.data.data.profile_pic,
            //   },
            // });
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
          }
        }
        setProUpBtnDis(false);
      } catch (error) {
        setProUpBtnDis(false);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      let response = await removeProfilePictureApi();
      if (response) {
        if (response.data.res === true) {
          setProImage(null);
          let tempObj = {...userData};
          tempObj.users.profile_pic = null;
          setUserData(tempObj);
          localStorage.setItem("tabsbookLoginInfo", JSON.stringify(tempObj));
          toast.success(response.data.msg, {autoClose: 1500});
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleEditClick = async () => {
    try {
      let formData = new FormData();
      if (showPhoneChecked) {
        formData.append("show_phone", "0");
      } else {
        formData.append("show_phone", "1");
      }

      let response = await updateShowPhoneNumberApi(formData);
      if (response) {
        if (response.data.res === true) {
          toast.success(response.data.msg, {autoClose: 1500});
          setShowPhoneChecked(!showPhoneChecked);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handlecode = async newPhoneNumber => {
    setNewPhNumber(newPhoneNumber);
    try {
      const fd = new FormData();
      fd.append("cell_phone", newPhoneNumber);

      let response = await updateOtpApi(fd);
      if (response) {
        if (response.data.res === true) {
          setShowSection("section2");
          setDetailsForVerify(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleChange = (index, event) => {
    const {value} = event.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
      if (newOtp.every(digit => digit !== "")) {
        handleVerifyOtp(newOtp);
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

  const handlePaste = e => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 4);

    setOtp(prevOtp => {
      const newOtp = [...prevOtp];
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      return newOtp;
    });

    if (pastedData?.length < 4) {
      inputRefs[pastedData?.length].current.focus();
    } else {
      // inputRefs[3].current.focus();
    }

    // Check if all four digits are present in the pasted data
    if (pastedData.length === 4 && pastedData.match(/^\d{4}$/)) {
      let newValue = pastedData.split("");
      handleVerifyOtp(newValue);
    }
  };

  const handleVerifyOtp = async otp => {
    setIsSubmitting(true);
    try {
      const apiRes = await updatePhoneNumberApi({cell_phone: newPhNumber, otp: otp.join("")});
      const responseData = apiRes;

      if (responseData.data.res === false) {
        toast.error(responseData.data.msg, {autoClose: 1500});
        // setErrorMessage(responseData.data.msg);
        setIsSubmitting(false);
      } else {
        toast.success(responseData.data.msg, {autoClose: 1500});
        setShowSection("section1");
        getProfileDetails();
        window.scrollTo({top: 0, behavior: "smooth"});
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying the account.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <div className="AccountBody">
      <Afterloginheader />
      {showSection === "section1" ? (
        <div className="mainDiv">
          <div className=" accountHdn2">
            <h2>My Account</h2>
          </div>

          <div className="accountProfilepp">
            <ProfilePictureUpload
              proImage={proImage}
              setProImage={setProImage}
              handleUploadProfileImage={handleUploadProfileImage}
              handleRemoveProfilePicture={handleRemoveProfilePicture}
              proUpBtnDis={proUpBtnDis}
            />
          </div>

          <div className="ToggleDiv">
            <label>
              <ToggleSwitch activeColor="#2563EB" checked={showPhoneChecked} handleEditClick={handleEditClick} />
              Show your phone number to the doctor ?
            </label>
            {/* Example with Tomato color */}
          </div>

          <div className="PhonenumberEdit">
            <PhoneNumberEdit allDetails={allDetails} setShowSection={setShowSection} handlecode={handlecode} />
          </div>

          <div className="InfoEdit">
            <AccountEdit allDetails={allDetails ? allDetails : ""} />
          </div>

          <div className="PasswordEdit">
            <PasswordEdit />
          </div>
        </div>
      ) : null}
      {showSection === "section2" ? (
        <div className="Fullbody">
          <div className="LoginBox">
            <div className="CheckBoxDiv">
              <div className=" checkbox-style2">
                <label>
                  <input type="radio" name="terms" value="call" checked />
                  <img src={Call} className="CallIcon" alt="Call" />
                  <em>Flash Call Verification</em>
                  <span>A flash call is a near-instant dropped call that is automatically placed to a mobile number.</span>
                </label>
              </div>
              <div className=" checkbox-style2">
                <label>
                  <input type="radio" name="terms" value="otp" />
                  <img src={OtpIcon} className="CallIcon" alt="Call" />
                  <em>OTP Verification</em>
                  <span>Systems provide a mechanism for logging/register on to a network or service using a unique password that can only be used once</span>
                </label>
              </div>
            </div>
            {/* <button type="submit" className="login-button mb-0" onClick={() => handlecode(newPhNumber)}> */}
            <button type="submit" className="login-button mb-0" onClick={() => setShowSection("section3")}>
              Submit
            </button>
          </div>
        </div>
      ) : null}
      {showSection === "section3" ? (
        <div className="Fullbody">
          <div className="LoginBox vcode">
            <h4>Verify your Mobile</h4>

            <div className="otp-input">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={event => handleChange(index, event)}
                  onKeyDown={event => handleKeyDown(index, event)}
                  onPaste={handlePaste}
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

            <Button className="login-button mt-4" variant="primary" type="button" disabled={isSubmitting} onClick={() => handleVerifyOtp(otp)}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <p className="createLink">
              Don’t have an account? <Link to="/register">Create Now!</Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyAccount;
