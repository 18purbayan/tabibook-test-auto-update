import React from "react";
import "./Header.scss";
import Close from "../../assets/images/CrossIcon.svg";

const HrPopup = ({ show, handleClose, children }) => {
  return (
    <div className={`popup ${show ? "show" : ""}`}>
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>
          <img src={Close} className="closeIcon" alt="icon" />
        </button>
        {children}
      </div>
    </div>
  );
};
export default HrPopup;
