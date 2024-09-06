import React from "react";
import Mainheader from "../../components/MainHeader/Mainheader";
import {Link} from "react-router-dom";
import docimg from "../../assets/images/DocImg.png";
import StarIcon from "../../assets/images/StarIcon.svg";
import AppointmentCalendar from "./appointmentCalendar";

const BookingStep5 = () => {
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
              <Link to="/bookingstep-4" className="PrevBtn">
                Go to back previous step
              </Link>
              <h2>When are you the most comfortable?</h2>
              <form>
                <div className="DateTimeWrapper">
                  <div className="LftDate">
                    <AppointmentCalendar />
                  </div>
                  <div className="RhtTime">
                    <div className="DayDate">
                      <span>Friday</span>
                      <br />
                      June 17
                    </div>
                    <ul>
                      <li>
                        <span>16:30</span>
                      </li>
                      <li>
                        <span>21:30</span>
                      </li>
                      <li>
                        <span>15:30</span>
                      </li>
                      <li>
                        <span>20:30</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p>
                  <Link to="/bookingstep-6" className="CmnBtn">
                    Continue
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
                  <li>What is the reason of the consultation?</li>
                  <li>Did you want to consultation via video or cabinet?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStep5;
