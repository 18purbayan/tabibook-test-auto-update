import React from "react";
import Logo from "../../assets/images/Logo.svg";
import Help from "../../assets/images/HelpIcon.svg";
import { Link } from "react-router-dom";
import "./Header.scss";

const ApproveDoctorheader = () => {
  return (
    <div className="DocHr DocMainHr">
      <div className="CustomContainer">
        <div className="logo">
          <Link>
            <img src={Logo} className="MainLogo" alt="logo" />
          </Link>
        </div>
        <div className="HrRight">
          <div className="Navbar">
            <ul>
              <li>
                <Link>Our Fees</Link>
              </li>
              <li>
                <Link>About</Link>
              </li>
              <li>
                <Link>Contact</Link>
              </li>
              <li>
                <Link>
                  <img src={Help} className="helpIcon" alt="icon" /> Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveDoctorheader;
