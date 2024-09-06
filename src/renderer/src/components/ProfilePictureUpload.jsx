import React, {useState} from "react";
import {IMAGE_URL} from "../app_url";
import {toast} from "react-toastify";

const ProfilePictureUpload = props => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    
    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (file && !allowedTypes.includes(file.type)) {
      toast.warning("Please upload a PNG, JPEG, or GIF image.", {autoClose: 1500});
      return;
    }

    // If you want to validate file size, you can do it here
    const maxSizeMB = 5; // Example: 5MB
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      toast.warning("File size exceeds the maximum limit of 5MB.", {autoClose: 1500});
      return;
    }

    props.handleUploadProfileImage(file);
    return;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    props?.handleRemoveProfilePicture();
    // setProfileImage(null);
    // document.getElementById("upload-image-input").value = "";
  };

  return (
    <div className="profile-picture-upload">
      <div className="profile-picture2">
        {props?.proImage ? (
          <img src={props?.proImage ? IMAGE_URL + props?.proImage : profileImage} alt="Profile" />
        ) : (
          <div className="placeholder">Profile Picture</div>
        )}
      </div>

      <div className="uploadPicRgt">
        <h3>Profile Picture</h3>
        <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} style={{display: "none"}} id="upload-image-input" />
        {!props?.proUpBtnDis ? (
          <label htmlFor="upload-image-input" className="upload-image-btn">
            Upload image
          </label>
        ) : (
          <label className="upload-image-btn2">Uploading...</label>
        )}

        {props?.proImage && (
          <button className="remove-image-btn2" onClick={handleImageRemove}>
            Remove
          </button>
        )}
        <p>We support PNG’s, JPEG and GIF images</p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
