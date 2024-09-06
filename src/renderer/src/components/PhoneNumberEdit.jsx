import React, {useState} from "react";
import "./PhoneNumberEdit.css"; // Import your CSS file for styling
import {toast} from "react-toastify";

const PhoneNumberEdit = props => {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = useState(phoneNumber);

  const handleEditClick = () => {
    // setOldPhoneNumber(phoneNumber);
    // setNewPhoneNumber(phoneNumber); // Set the new phone number field to the current phone number
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const isValid = /^\d{10}$/.test(newPhoneNumber);
    if (newPhoneNumber && isValid) {
      props?.handlecode(newPhoneNumber);
      setPhoneNumber(newPhoneNumber);
      // setIsEditing(false);
    } else {
      toast.warning("Please enter valid new phone number", {autoClose: 1500});
    }
  };

  const handleCancelClick = () => {
    setNewPhoneNumber(null);
    setIsEditing(false);
  };

  const handleNewPhoneNumberChange = event => {
    setNewPhoneNumber(event.target.value);
  };

  return (
    <div className="phone-number-edit">
      <label htmlFor="phone-number" className={isEditing ? "editing-label" : ""}>
        Phone Number:
      </label>
      {isEditing ? (
        <>
          <div className={`phone-number-old ${isEditing ? "editing" : ""}`}>
            <span>{props?.allDetails?.cell_phone}</span>
            {/* <span>{oldPhoneNumber}</span> */}
          </div>
          <div>
            <label htmlFor="new-phone-number">New Phone Number:</label>
            <input type="number" id="new-phone-number" value={newPhoneNumber} onChange={handleNewPhoneNumberChange} />
          </div>
          <div className="EditBtngrp">
            <button onClick={handleSaveClick}>Proceed next step</button>
            <button onClick={handleCancelClick} className="cancelBtn">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span>{props?.allDetails?.cell_phone}</span>
          {/* <span>{phoneNumber}</span> */}
          <button onClick={handleEditClick}>Change phone number?</button>
        </>
      )}
    </div>
  );
};

export default PhoneNumberEdit;
