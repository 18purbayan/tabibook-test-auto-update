import React, {useState, useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {addNurseByDoctorApi, deleteNurseByDoctorApi, editNurseByDoctorApi, fetchNurseByDoctorApi} from "../../services/apiService";
import Skeleton from "react-loading-skeleton";

import icon1 from "../../assets/images/nurse-icon1.svg";
import nurseImg from "../../assets/images/nurse-img1.png";
import cancelIcon from "../../assets/images/cancel-btn.svg";
import editIcon from "../../assets/images/edit-icon.svg";
import deleteIcon from "../../assets/images/delete-icon.svg";

const Nurse = () => {
  // const [nurseList, setNurseList] = useState([
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  //   { name: "Brunel Arielle", image: "/src/assets/images/user-icon.svg", create: "on Jan 12 2024", modified: "on Jan 12 2024" },
  // ]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const [nurseList, setnurseList] = useState([]);

  const navigate = useNavigate();

  const [formDataAdded, setFormDataAdded] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [formErrorsAdded, setFormErrorsAdded] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChangeAdded = e => {
    const {name, value} = e.target;
    setFormDataAdded({...formDataAdded, [name]: value});
    setFormErrorsAdded({...formErrorsAdded, [name]: ""});
  };

  const validateFormAdded = () => {
    let isValid = true;
    const errors = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    };

    if (formDataAdded.first_name === "") {
      errors.first_name = "Please enter your first name";
      isValid = false;
    }

    if (formDataAdded.last_name === "") {
      errors.last_name = "Please enter your last name";
      isValid = false;
    }

    if (formDataAdded.email === "") {
      errors.email = "Please enter email";
      isValid = false;
    }

    if (formDataAdded.password === "") {
      errors.password = "Please enter your password";
      isValid = false;
    } else if (!/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(formDataAdded.password)) {
      errors.password =
        "Password must be at least 8 characters long, must contain at least one digit, one special character, one uppercase letter, one lowercase letter.";
      isValid = false;
    }

    setFormErrorsAdded(errors);
    return isValid;
  };

  const handleNursAdded = async () => {
    try {
      //e.preventDefault();
      if (validateFormAdded()) {
        setIsSubmitting(true);
        let apiRes = await addNurseByDoctorApi(formDataAdded);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          //setErrorMessage(responseData.data.msg)
          toast.error(responseData.data.msg, {autoClose: 1500});
          setIsSubmitting(false);
        } else {
          setFormDataAdded({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
          });
          toast.success(responseData.data.msg ? responseData.data.msg : "Submited successfully", {autoClose: 1500});
          setIsPopupOpen(false);
          getNursdetails();
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  const submitForm = e => {
    if (e.key === "Enter") {
      handleNursAdded();
    }
  };

  const submitEditForm = e => {
    if (e.key === "Enter") {
      handleNursEdit();
    }
  };

  const getNursdetails = async () => {
    try {
      setScreenLoading(true);
      setLoading(true);
      let apiRes = await fetchNurseByDoctorApi();
      let responseData = apiRes;

      if (responseData.data.res == false) {
        toast.error(responseData.data.msg, {autoClose: 1500});
      } else {
        // console.warn(response.data.data);
        setnurseList(responseData.data.data);
      }
      setScreenLoading(false);
      setLoading(false);
    } catch (error) {
      setScreenLoading(false);
      setLoading(false);
      console.error(error);
    }
  };

  const handleDeleteNurse = async () => {
    if (selectedNurse) {
      setIsSubmitting(true);
      try {
        let formData = new FormData();
        formData.append("id", selectedNurse.id);
        let apiRes = await deleteNurseByDoctorApi(formData);
        let responseData = apiRes;

        if (responseData.data.res == false) {
          toast.error(responseData.data.msg, {autoClose: 1500});
        } else {
          setNursePopup(false);
          // console.warn(response.data.data);
          toast.success(responseData.data.msg ? responseData.data.msg : "Submited successfully", {autoClose: 1500});
          getNursdetails();
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        console.error(error);
      }
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [nursePopup, setNursePopup] = useState(false);

  const [nurseEditPopup, setNurseEditPopup] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // const nurseOpenPopup = () => setNursePopup(true);
  // const nurseClosePopup = () => setNursePopup(false);

  const [selectedNurse, setSelectedNurse] = useState(null);

  const nurseOpenPopup = nurse => {
    setSelectedNurse(nurse);
    setNursePopup(true);
  };

  const nurseClosePopup = () => {
    setNursePopup(false);
    setSelectedNurse(null);
  };

  const nurseOpenEditPopup = nurse => {
    setSelectedNurse(nurse);
    setNurseEditPopup(true);

    setFormDataEdit({
      id: nurse?.id || "",
      first_name: nurse?.first_name || "",
      last_name: nurse?.last_name || "",
    });
  };

  const closeEditPopup = () => {
    setNurseEditPopup(false);
    setSelectedNurse(null);
  };

  const [formDataEdit, setFormDataEdit] = useState({
    id: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  const [formErrorsEdit, setFormErrorsEdit] = useState({
    first_name: "",
    last_name: "",
    //password: "",
  });

  const handleChangeEdit = e => {
    const {name, value} = e.target;
    setFormDataEdit({...formDataEdit, [name]: value});
    setFormErrorsEdit({...formErrorsEdit, [name]: ""});
  };

  const validateFormEdit = () => {
    let isValid = true;
    const errors = {
      first_name: "",
      last_name: "",
      // password: "",
    };

    if (formDataEdit.first_name.trim() === "") {
      errors.first_name = "Please enter your first name";
      isValid = false;
    }

    if (formDataEdit.last_name.trim() === "") {
      errors.last_name = "Please enter your last name";
      isValid = false;
    }

    // if (formDataEdit.password === "") {
    //   errors.password = "Please enter your password";
    //   isValid = false;
    // }

    setFormErrorsEdit(errors);
    return isValid;
  };

  const handleNursEdit = async () => {
    if (selectedNurse) {
      try {
        setFormDataEdit(prevState => ({
          ...prevState,
          id: selectedNurse.id,
        }));

        //e.preventDefault();
        if (validateFormEdit()) {
          setIsSubmitting(true);
          let apiRes = await editNurseByDoctorApi(formDataEdit);
          let responseData = apiRes;

          if (responseData.data.res == false) {
            //setErrorMessage(responseData.data.msg)
            toast.error(responseData.data.msg, {autoClose: 1500});
            setIsSubmitting(false);
          } else {
            toast.success(responseData.data.msg ? responseData.data.msg : "Submited successfully", {autoClose: 1500});
            setNurseEditPopup(false);
            getNursdetails();
            setIsSubmitting(false);
          }
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getNursdetails();
  }, []);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        <div className="mainDiv">
          <div className="hdnDiv nurseTop">
            <h2>
              <span>
                <img src={icon1} alt="Availability icon" />
                Nurse
              </span>
              <span className="addBtn2" onClick={openPopup}>
                Add new nurse
              </span>
            </h2>
          </div>

          <div className="dashFoot">
            <div className="upcomingAppoinment nurseDiv">
              {screenLoading ? (
                <div className="Card">
                  <Skeleton count={1} height={40} width={"70%"} baseColor="#cfd5f9" />
                  <br />
                  <p>
                    <Skeleton count={1} height={40} width={"60%"} baseColor="#cfd5f9" />
                  </p>
                </div>
              ) : (
                <>
                  {nurseList && nurseList.length > 0 ? (
                    <>
                      <div className="nurseList">
                        <div className="appoList">
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Create on</th>
                                <th>Last modified on</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nurseList.map((nurse, index) => (
                                <tr key={index}>
                                  <td className="appoName">
                                    <img src={nurse?.profile_pic ? IMAGE_URL + nurse?.profile_pic : icon1} alt="profile pic" />
                                    {nurse?.first_name}
                                  </td>
                                  <td>{new Date(nurse?.created_at).toDateString()}</td>
                                  <td>{new Date(nurse?.created_at).toDateString()}</td>
                                  <td>
                                    <button className="viewLink" onClick={() => nurseOpenEditPopup(nurse)}>
                                      <img src={editIcon} alt="editIcon" />
                                    </button>
                                    <button className="viewLink" onClick={() => nurseOpenPopup(nurse)}>
                                      <img src={deleteIcon} alt="deleteIcon" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : !loading ? (
                    <>
                      <div className="addSection">
                        <img src={nurseImg} alt="nurseImg" />
                        <button className="addBtn" onClick={openPopup}>
                          Add new nurse
                        </button>
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup holidayPopup">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="popup-content">
            <button onClick={closePopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="addNursePopup">
              <h2 className="nurseHdn">Add Nurse</h2>
              <ul>
                <li>
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Enter nurse first name"
                    name="first_name"
                    value={formDataAdded.first_name}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.first_name && <span className="error">{formErrorsAdded.first_name}</span>}
                <li>
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter nurse last name"
                    name="last_name"
                    value={formDataAdded.last_name}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.last_name && <span className="error">{formErrorsAdded.last_name}</span>}
                <li>
                  <label>Email Address</label>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    name="email"
                    value={formDataAdded.email}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.email && <span className="error">{formErrorsAdded.email}</span>}
                <li>
                  <label>Set Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    autoComplete="new-password"
                    value={formDataAdded.password}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.password && <span className="error">{formErrorsAdded.password}</span>}
                {/* <li><button>Send</button></li> */}
                <li>
                  <button type="submit" className="login-button" onClick={() => handleNursAdded()} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Send"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup holidayPopup">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="popup-content">
            <button onClick={closePopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="addNursePopup">
              <h2 className="nurseHdn">Add Nurse</h2>
              <ul>
                <li>
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Enter nurse first name"
                    name="first_name"
                    value={formDataAdded.first_name}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.first_name && <span className="error">{formErrorsAdded.first_name}</span>}
                <li>
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter nurse last name"
                    name="last_name"
                    value={formDataAdded.last_name}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.last_name && <span className="error">{formErrorsAdded.last_name}</span>}
                <li>
                  <label>Email Address</label>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    name="email"
                    value={formDataAdded.email}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.email && <span className="error">{formErrorsAdded.email}</span>}
                <li>
                  <label>Set Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    autoComplete="new-password"
                    value={formDataAdded.password}
                    onChange={handleChangeAdded}
                    onKeyDown={submitForm}
                  />
                </li>{" "}
                {formErrorsAdded.password && <span className="error">{formErrorsAdded.password}</span>}
                {/* <li><button>Send</button></li> */}
                <li>
                  <button type="submit" className="login-button" onClick={() => handleNursAdded()} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {nursePopup && (
        <div className="popup holidayPopup">
          <div className="popup-content removePop">
            <button onClick={nurseClosePopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="addNursePopup">
              <h2 className="removeHdn">Are you sure you want to remove this nurse?</h2>

              <div className="removeNurse">
                <img src={selectedNurse?.profile_pic ? IMAGE_URL + selectedNurse?.profile_pic : icon1} alt="profile pic" />
                <h3>{selectedNurse?.first_name}</h3>
                <h4>
                  Create on: <span>on {new Date(selectedNurse?.created_at).toDateString()}</span>
                </h4>

                <div className="nurseBtns">
                  <button className="yesBtn" onClick={handleDeleteNurse} disabled={isSubmitting}>
                    Yes
                  </button>
                  <button className="noBtn" onClick={nurseClosePopup}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {nurseEditPopup && (
        <div className="popup holidayPopup">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="popup-content">
            <button onClick={closeEditPopup} className="cancelBtn">
              <img src={cancelIcon} alt="cancelIcon" />
            </button>
            <div className="addNursePopup">
              <h2 className="nurseHdn">Edit Nurse</h2>
              <ul>
                <li>
                  <img src={selectedNurse?.profile_pic ? IMAGE_URL + selectedNurse?.profile_pic : icon1} alt="profile pic" />
                </li>
                <li>
                  <label>First Name</label>
                  <input type="text" placeholder="Enter nurse first name" name="first_name" value={formDataEdit.first_name} onChange={handleChangeEdit} />
                </li>{" "}
                {formErrorsEdit.first_name && <span className="error">{formErrorsEdit.first_name}</span>}
                <li>
                  <label>Last Name</label>
                  <input type="text" placeholder="Enter nurse last name" name="last_name" value={formDataEdit.last_name} onChange={handleChangeEdit} />
                </li>{" "}
                {formErrorsEdit.last_name && <span className="error">{formErrorsEdit.last_name}</span>}
                <li>
                  <label>Email Address</label>
                  <input type="text" placeholder="Enter email address" name="email" value={selectedNurse.email} disabled />
                </li>
                <li>
                  <label>Set Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    autoComplete="new-password"
                    value={formDataEdit.password}
                    onChange={handleChangeEdit}
                  />
                </li>
                {/* <li><button>Send</button></li> */}
                <li>
                  <button type="submit" className="login-button" onClick={() => handleNursEdit()} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Edit"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nurse;
