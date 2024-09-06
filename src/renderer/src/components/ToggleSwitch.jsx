import React, {useState} from "react";
import "./ToggleSwitch.css"; // Import your CSS file for styling

const ToggleSwitch = ({activeColor = "#4caf50", checked, handleEditClick}) => {
  const [isOn, setIsOn] = useState(checked);

  const handleToggle = () => {
    handleEditClick();
    setIsOn(!isOn);
  };

  return (
    <div className={`toggle-switch ${checked ? "on" : "off"}`} onClick={handleToggle} style={{backgroundColor: checked ? activeColor : "#ccc"}}>
      <div className={`toggle-knob ${checked ? "on" : "off"}`}></div>
    </div>
  );
};

export default ToggleSwitch;
