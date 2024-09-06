import React, {useState} from "react";
import "./PasswordEdit.css";
import {changePasswordApi} from "../services/apiService";
import {toast} from "react-toastify";

const PasswordEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [btnDis, setBtnDis] = useState(false);

  const handleEditClick = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!currentPassword) {
      setError("Please enter current password.");
    } else if (!newPassword) {
      setError("Please enter new password.");
    } else if (newPassword && !/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long, must contain at least one digit, one special character, one uppercase letter, one lowercase letter."
      );
    } else if (!currentPassword) {
      setError("Please enter current password.");
    } else {
      if (newPassword === confirmPassword) {
        setError(null);
        setBtnDis(true);
        try {
          let formData = new FormData();
          formData.append("old_password", currentPassword);
          formData.append("new_password", newPassword);
          formData.append("confirm_password", confirmPassword);

          let response = await changePasswordApi(formData);
          if (response) {
            if (response.data.res === true) {
              toast.success(response.data.msg, {autoClose: 1500});
              handleCancelClick();
            } else {
              setError(response.data.msg);
            }
          }
          setBtnDis(false);
        } catch (error) {
          setBtnDis(false);
          toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
        }
      } else {
        setError("Passwords do not match.");
      }
    }
  };

  const handleCancelClick = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsEditing(false);
  };

  const handleCurrentPasswordChange = event => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = event => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
  };

  return (
    <div className="password-edit">
      {isEditing ? (
        <>
          {/* <label htmlFor="current-password" className={isEditing ? "editing-label" : ""}>
            Current Password:
          </label>
          <div id="current-password" className={isEditing ? "current-password editing" : "current-password"}>
            {currentPassword}
          </div> */}
          <div className="password-new-box">
            <div className="password-new-boxLft">
              <label htmlFor="current-password">Type Current Password:</label>
              <input type="password" id="current-password" value={currentPassword} autoComplete="new-password" onChange={handleCurrentPasswordChange} />
            </div>

            <div className="password-new-boxLft">
              <label htmlFor="new-password">Type New Password:</label>
              <input type="password" id="new-password" value={newPassword} onChange={handleNewPasswordChange} />
            </div>

            <div className="password-new-boxRgt">
              <label htmlFor="confirm-password">Confirm New Password:</label>
              <input type="password" id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          <div className="EditBtngrp">
            {btnDis ? (
              <button disabled className="saveBtn">
                Please wait...
              </button>
            ) : (
              <button onClick={handleSaveClick} className="saveBtn">
                Save
              </button>
            )}

            <button onClick={handleCancelClick} className="cancelBtn">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Change password?</button>
        // <button onClick={handleEditClick}>Change password?</button>
      )}
    </div>
  );
};

export default PasswordEdit;
