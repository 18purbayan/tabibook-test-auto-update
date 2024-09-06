import React from "react";
import Logo from "../../assets/images/Logo.svg";
import {Link} from "react-router-dom";
import "./Header.scss";

const CenterLogoheader = () => {
  return (
    <div className="DocHr DocMainHr">
      <div className="CustomContainer">
        <div className="logo" style={{textAlign: "center", width: "100%"}}>
          <Link to={"/"}>
            <img src={Logo} className="MainLogo" alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CenterLogoheader;
