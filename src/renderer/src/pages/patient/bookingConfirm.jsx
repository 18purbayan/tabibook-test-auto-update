import React from "react";
import Afterloginheader from "../../components/MainHeader/Afterloginheader";
import FileIcon from "../../assets/images/ConfirmFileIcon.svg";
import {Link, useLocation} from "react-router-dom";
import {useUserContext} from "../../context/UserContext";

const BookingConfirm = () => {
  const {userData} = useUserContext();
  const location = useLocation();
  return (
    <div className="Main">
      <Afterloginheader />

      <div className="BookAppWrapper">
        <div className="ContainerPnl">
          <div className="ColPnl-12">
            <div className="LftBox ConfirmBookPnl">
              <div className="PnlWrapper">
                <h2>Appointment confirmed</h2>
                <img src={FileIcon} alt="" />
                <p className="InfoPara">
                  {userData?.users?.first_name}, we've got you
                  <br />
                  confirmed for your appointment.
                </p>
                <p className="BookTime">{location?.state?.time}</p>
                <p className="BookDoctor">
                  Dr. {location?.state?.doctorDetails?.first_name} {location?.state?.doctorDetails?.last_name}
                </p>
                <p>
                  {location?.state?.date}
                  <br />
                  {location?.state?.doctorDetails?.cabin_address}
                </p>
                <Link to="/my-appointments" className="CmnBtn FullwidthBtn">
                  Go to appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
