import React, {useState} from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import {Link} from "react-router-dom";
import docimg from "../../assets/images/DocImg.png";
import StarIcon from "../../assets/images/StarIcon.svg";

const BookingStep3 = () => {
  //Choose patient
  const [chooseReason, setChooseReason] = useState("");
  const handleChange = event => {
    setChooseReason(event.target.value);
  };

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
              <Link to="/bookingstep-2" className="PrevBtn">
                Go to back previous step
              </Link>
              <h2>What is the reason of the consultation?</h2>
              <form>
                <ul className="PatientList AlreadyVisit">
                  <li>
                    <span className="PatientName">
                      <span className="NameWrapper">General medicine follow-up consultation</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="Followup" checked={chooseReason === "Followup"} onChange={handleChange} />
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <span className="NameWrapper">First general medicine consultation</span>
                    </span>
                    <span className="SelectOption">
                      <input type="radio" value="FirstConsult" checked={chooseReason === "FirstConsult"} onChange={handleChange} />
                    </span>
                  </li>
                </ul>
                <p>
                  <Link to="/bookingstep-4" className="CmnBtn">
                    Continue
                  </Link>{" "}
                  <Link to="/bookingstep-4" className="CmnBtn skipBtn">
                    Skip
                  </Link>
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
                  <li>Did you already visit this doctor?</li>
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

export default BookingStep3;
