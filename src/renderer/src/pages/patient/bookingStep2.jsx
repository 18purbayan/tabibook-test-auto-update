import React, {useState} from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import {Link} from "react-router-dom";
import docimg from "../../assets/images/DocImg.png";
import StarIcon from "../../assets/images/StarIcon.svg";
  
const BookingStep2 = () => {
  //Choose patient
  const [alreadyVisit, setAlreadyVisit] = useState("");
  const handleChange = event => {
    setAlreadyVisit(event.target.value);
  };

  //Add new patient
  // const [addNewPatientPopup, setAddNewPopup] = useState(false);
  // const openPopup = () => setAddNewPopup(true);
  // const closePopup = () => setAddNewPopup(false);

  return (
    <div className="Main">
      <Mainheader />

      <div className="BookAppWrapper">
        <div className="HeadingBar">
          <div className="ContainerPnl">
            <div className="ColPnl-12">
              <h3>Book your appointment</h3>
              <p>Fill in the following information</p>
            </div>
          </div>
        </div>

        <div className="ContainerPnl">
          <div className="ColPnl-8">
            <div className="LftBox">
              <Link to="/bookappointment" className="PrevBtn">
                Go to back previous step
              </Link>
              <h2>Did you already visit this doctor ?</h2>
              <form>
                <ul className="PatientList AlreadyVisit">
                  <li>
                    <span className="PatientName">
                      <span className="NameWrapper">Yes</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="yes" checked={alreadyVisit === "yes"} onChange={handleChange} />
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <span className="NameWrapper">No</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="no" checked={alreadyVisit === "no"} onChange={handleChange} />
                    </span>
                  </li>
                </ul>
                <p>
                  <button className="CmnBtn">
                    Continue
                  </button>
                </p>
              </form>
            </div>
          </div>
          <div className="ColPnl-4">
            <div className="RhtBox">
              <ul className="SearchedDoctors">
                <li>
                  <div className="DocImg">
                    <img src={docimg} alt="" />
                  </div>
                  <div className="DocDtls">
                    <span className="DocName">Dr Jean Philippe MENAT</span>
                    <span className="DocType">Gastroenterologist</span>
                    <span className="DocRating">
                      <img src={StarIcon} alt="" /> 4.5
                    </span>
                  </div>
                </li>
              </ul>
              <div className="AppoDetails">
                <h5>Your appointment in detail</h5>
                <ul>
                  <li>Choose the patient name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add new member popup */}
      {/* {addNewPatientPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Popup Title</h2>
            <p>This is a popup message.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BookingStep2;
