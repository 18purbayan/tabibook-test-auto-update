import React from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import {Link} from "react-router-dom";
import docimg from "../../assets/images/DocImg.png";
import UserIcon from "../../assets/images/User_Icon.svg";
import CalanderIcon from "../../assets/images/CalanderIcon.svg";
import LocIcon from "../../assets/images/LocationIcon.svg";
import StethIcon from "../../assets/images/StethoscopeIcon.svg";
import StarIcon from "../../assets/images/StarIcon.svg";

const BookingStep6 = () => {
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
              <Link to="/bookingstep-5" className="PrevBtn">
                Go to back previous step
              </Link>
              <h2>Your appointment in detail</h2>
              <form>
                <ul className="PatientList ConsultOption BookingDetails">
                  <li>
                    <span className="PatientName">
                      <img src={UserIcon} alt="" />
                      <span className="NameWrapper">Dr Jean Philippe MENAT</span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={CalanderIcon} alt="" />
                      <span className="NameWrapper">June 17 20:30</span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={LocIcon} alt="" />
                      <span className="NameWrapper">Center Medical des Marots, 12 Avenue du louron, 31770 colomiers</span>
                    </span>
                  </li>
                  <li>
                    <span className="PatientName">
                      <img src={StethIcon} alt="" />
                      <span className="NameWrapper">Gastroenterologist</span>
                    </span>
                  </li>
                </ul>
                <p>
                  <Link to="/booking-confirmation" className="CmnBtn FullwidthBtn">
                    Confirm appointment
                  </Link>
                </p>
                <p className="NotePara">By confirming this appointment, you agree to honour it.</p>
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
                  <li>What is the reason of the consultation?</li>
                  <li>Did you want to consultation via video or cabinet?</li>
                  <li>When are you the most comfortable?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStep6;
