import React, {useEffect, useState} from "react";
import "./AccountEdit.css";
import {cityListApi, updateMyAccountApi} from "../services/apiService";
import {useUserContext} from "../context/UserContext";
import {toast} from "react-toastify";

const AccountEdit = props => {
  const {userData, setUserData} = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(props?.allDetails?.first_name);
  const [lastName, setLastName] = useState(props?.allDetails?.last_name);
  const [email, setEmail] = useState(props?.allDetails?.email);
  const [city, setCity] = useState(props?.allDetails?.city_id);
  const [dob, setDob] = useState("26 June, 1987");
  const [cityList, setCityList] = useState();
  const [editBtnDis, setEditBtnDis] = useState(false);

  const [formErrorsSignup, setFormErrorsSignup] = useState({
    first_name: "",
    last_name: "",
    city_id: "",
    email: "",
    cell_phone: "",
    month: "",
    day: "",
    year: "",
  });

  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [selectedYear, setSelectedYear] = useState();

  // Function to get month name from month index
  const getMonthName = index => months[index];

  // Function to get month index from month name
  const getMonthIndex = name => months.indexOf(name);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const days = Array.from({length: 31}, (_, i) => i + 1);
  const years = Array.from({length: 101}, (_, i) => 1920 + i);

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
    const nameRegex = /^[A-Za-z\s]+$/;
    const errors = {
      first_name: "",
      last_name: "",
      city_id: "",
      email: "",
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

    if (!city) {
      errors.city_id = "Please select city";
      isValid = false;
    }

    if (!email) {
      errors.email = "Please enter email";
      isValid = false;
    }

    if (!selectedMonth) {
      errors.month = "Please select month";
      isValid = false;
    }

    if (!selectedDay) {
      errors.day = "Please select day";
      isValid = false;
    }

    if (!selectedYear) {
      errors.year = "Please select year";
      isValid = false;
    }

    setFormErrorsSignup(errors);
    return isValid;
  };

  const handleEditClick = async () => {
    // if (!isEditing) {
    //   setIsEditing(true);
    // }
    if (validateFormSignup()) {
      // console.log(selectedMonth);
      // console.log(months.findIndex(item => item === selectedMonth));

      // return;
      setEditBtnDis(true);
      try {
        let formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("month", months.findIndex(item => item === selectedMonth) + 1);
        formData.append("day", selectedDay);
        formData.append("year", selectedYear);
        formData.append("city_id", city);

        let response = await updateMyAccountApi(formData);
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
      if (isEditing) {
        setDob(`${selectedDay} ${selectedMonth}, ${selectedYear}`);
      }
    }
  };

  useEffect(() => {
    // Update state when props.allDetails changes
    if (props.allDetails) {
      getCityList();
      setFirstName(props.allDetails.first_name || "");
      setLastName(props.allDetails.last_name || "");
      setEmail(props.allDetails.email || "");
      setCity(props.allDetails.city_id || "");
      if (props.allDetails?.dob) {
        const date = new Date(props.allDetails?.dob);
        const monthIndex = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        setDob(day + " " + getMonthName(monthIndex) + "," + " " + year);
        setSelectedMonth(getMonthName(monthIndex));
        setSelectedDay(day);
        setSelectedYear(year);
      }
    }
  }, [props.allDetails]);

  return (
    <div className="AccountInfomainDiv">
      <div className="hdnDiv accountHdn2">
        <h2>Personal Information</h2>
        {isEditing ? (
          <button onClick={() => handleEditClick()} disabled={editBtnDis}>
            {editBtnDis ? "Please wait..." : "Save"}
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>

      <ul className={`accountDetails ${isEditing ? "editing" : ""}`}>
        <li>
          <label>First name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!isEditing} />
          {formErrorsSignup.first_name && <span className="validationErrorMsg">{formErrorsSignup.first_name}</span>}
        </li>
        <li>
          <label>Last name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} disabled={!isEditing} />
          {formErrorsSignup.last_name && <span className="validationErrorMsg">{formErrorsSignup.last_name}</span>}
        </li>

        <li>
          <label>Email address</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditing} readOnly />
          {formErrorsSignup.email && <span className="validationErrorMsg">{formErrorsSignup.email}</span>}
        </li>
        <li>
          <label>City</label>
          <select value={city} onChange={e => setCity(e.target.value)} disabled={!isEditing} className="select-style1">
            {cityList?.map((item, index) => (
              <option key={index} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </select>
          {formErrorsSignup.city_id && <span className="validationErrorMsg">{formErrorsSignup.city_id}</span>}
          {/* <input type="text" value={city} onChange={e => setCity(e.target.value)} disabled={!isEditing} /> */}
        </li>
        <li>
          <label>Date of birth</label>
          {isEditing ? (
            <div>
              <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="select-style1">
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="select-style2">
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="select-style1">
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input type="text" value={dob} disabled={!isEditing} />
          )}
        </li>
      </ul>
    </div>
  );
};

export default AccountEdit;
