import React, {useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import ProfilePictureUpload from "../../components/ProfilePictureUpload";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import PasswordEdit from "../../components/PasswordEdit";
import {doctorUpdateMyAccountApi, myAccountDetailsApi, removeProfilePictureApi, updateProfilePictureApi} from "../../services/apiService";
import {useUserContext} from "../../context/UserContext";
import {toast} from "react-toastify";
import LoadingPage from "../../components/LoadingPage";

const DoctorMyAccount = () => {
  const {userData, setUserData} = useUserContext();
  const [proImage, setProImage] = useState();
  const [allDetails, setAllDetails] = useState();
  const [proUpBtnDis, setProUpBtnDis] = useState(false);
  const [showPhoneChecked, setShowPhoneChecked] = useState(false);
  const [showSection, setShowSection] = useState("section1");
  const [newPhNumber, setNewPhNumber] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [pincode, setPincode] = useState();
  const [email, setEmail] = useState();
  const [editBtnDis, setEditBtnDis] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [screenLoadingPage, setScreenLoadingPage] = useState(false);

  const [formErrorsSignup, setFormErrorsSignup] = useState({
    first_name: "",
    last_name: "",
    city_id: "",
    email: "",
    cell_phone: "",
    pincode: "",
    month: "",
    day: "",
    year: "",
  });

  const getProfileDetails = async () => {
    try {
      setScreenLoadingPage(true);
      let response = await myAccountDetailsApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          if (response.data.data) {
            setFirstName(response.data.data.first_name || "");
            setLastName(response.data.data.last_name || "");
            setPincode(response.data.data.postal_code || "");
            setNewPhNumber(response.data.data.cell_phone || "");
            setEmail(response.data.data.email || "");
          }
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
      setScreenLoadingPage(false);
    } catch (error) {
      console.error(error);
      setScreenLoadingPage(false);
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

  const validateFormSignup = () => {
    let isValid = true;
    const nameRegex = /^[A-Za-z\s]+$/;
    const errors = {
      first_name: "",
      last_name: "",
      city_id: "",
      email: "",
      cell_phone: "",
      pincode: "",
      month: "",
      day: "",
      year: "",
    };

    if (!firstName) {
      errors.first_name = "Please enter your first name";
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      errors.first_name = "First name can only contain letters and spaces";
      isValid = false;
    }

    if (!lastName) {
      errors.last_name = "Please enter your last name";
      isValid = false;
    } else if (!nameRegex.test(lastName)) {
      errors.last_name = "Last name can only contain letters and spaces";
      isValid = false;
    }

    if (!pincode) {
      errors.pincode = "Please enter postal code";
      isValid = false;
    }

    if (!newPhNumber) {
      errors.cell_phone = "Please enter cell phone no.";
      isValid = false;
    }

    if (newPhNumber && !/^\d{10}$/.test(newPhNumber)) {
      errors.cell_phone = "Cell phone number is not valid.";
      isValid = false;
    }

    if (!email) {
      errors.email = "Please enter email";
      isValid = false;
    }

    setFormErrorsSignup(errors);
    return isValid;
  };

  const handleEditClick = async () => {
    if (validateFormSignup()) {
      setEditBtnDis(true);
      try {
        let formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("postal_code", pincode);
        formData.append("cell_phone", newPhNumber);

        let response = await doctorUpdateMyAccountApi(formData);
        if (response) {
          if (response.data.res === true) {
            setIsEditing(!isEditing);
            let tempObj = {...userData};
            tempObj.users.first_name = response.data.data.first_name;
            tempObj.users.last_name = response.data.data.last_name;
            setUserData(tempObj);
            localStorage.setItem("tabsbookLoginInfo", JSON.stringify(tempObj));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setEditBtnDis(false);
      } catch (error) {
        setEditBtnDis(false);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        {screenLoadingPage && <LoadingPage />}

        {showSection === "section1" ? (
          <div className="mainDiv">
            <div className="hdnDiv accountHdn">
              <h2>My Account</h2>

              {isEditing ? (
                <button onClick={() => handleEditClick()} disabled={editBtnDis}>
                  {editBtnDis ? "Please wait..." : "Save"}
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>

            <div className="accountProfile">
              <ProfilePictureUpload
                proImage={proImage}
                setProImage={setProImage}
                handleUploadProfileImage={handleUploadProfileImage}
                handleRemoveProfilePicture={handleRemoveProfilePicture}
                proUpBtnDis={proUpBtnDis}
              />
            </div>

            <ul className={`accountDetails ${isEditing ? "editing" : ""}`}>
              <li>
                <label>First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value);
                    setFormErrorsSignup(prev => ({...prev, first_name: ""}));
                  }}
                  disabled={!isEditing}
                />
                {formErrorsSignup.first_name && <span className="error1">{formErrorsSignup.first_name}</span>}
              </li>
              <li>
                <label>Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value);
                    setFormErrorsSignup(prev => ({...prev, last_name: ""}));
                  }}
                  disabled={!isEditing}
                />
                {formErrorsSignup.last_name && <span className="error1">{formErrorsSignup.last_name}</span>}
              </li>
              <li>
                <label>Cabin postal code</label>
                <input
                  type="number"
                  value={pincode}
                  onChange={e => {
                    setPincode(e.target.value);
                    setFormErrorsSignup(prev => ({...prev, pincode: ""}));
                  }}
                  disabled={!isEditing}
                />
                {formErrorsSignup.pincode && <span className="error1">{formErrorsSignup.pincode}</span>}
              </li>
              <li>
                <label>Cell phone no.</label>
                <input
                  type="number"
                  value={newPhNumber}
                  onChange={e => {
                    setNewPhNumber(e.target.value);
                    setFormErrorsSignup(prev => ({...prev, cell_phone: ""}));
                  }}
                  disabled={!isEditing}
                />
                {formErrorsSignup.cell_phone && <span className="error1">{formErrorsSignup.cell_phone}</span>}
              </li>

              <li>
                <label>Email address</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditing} readOnly />
                {formErrorsSignup.email && <span className="error1">{formErrorsSignup.email}</span>}
              </li>
            </ul>

            <div className="PasswordEdit">
              <PasswordEdit />
            </div>
          </div>
        ) : null}
        {/* <div className="mainDiv">
          <div className="hdnDiv accountHdn">
            <h2>My Account</h2>
            <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit account"}</button>
          </div>

          <div className="accountProfile">
            <ProfilePictureUpload />
          </div>

          <ul className={`accountDetails ${isEditing ? "editing" : ""}`}>
            <li>
              <label>First name</label>
              <input type="text" value="Jonathon" disabled={!isEditing} />
            </li>
            <li>
              <label>Last name</label>
              <input type="text" value="Doe" disabled={!isEditing} />
            </li>
            <li>
              <label>Cabin postal code</label>
              <input type="text" value="78000" disabled={!isEditing} />
            </li>
            <li>
              <label>Cell phone no.</label>
              <input type="text" value="0723456789" disabled={!isEditing} />
            </li>
            <li>
              <label>Email address</label>
              <input type="text" value="jonathon_deo@yahoomail.com" disabled={!isEditing} />
            </li>
            <li>
              <label>Password</label>
              <input type={isEditing ? "text" : "password"} value="pass@1234" disabled={!isEditing} />
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default DoctorMyAccount;
