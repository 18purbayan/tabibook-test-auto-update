import React from "react";
import "./Footer.scss";
import Information from "../../assets/images/information.svg";
import SocialIcons1 from "../../assets/images/SocialIcons1.svg";
import SocialIcons2 from "../../assets/images/SocialIcons2.svg";
import SocialIcons3 from "../../assets/images/SocialIcons3.svg";
import SocialIcons4 from "../../assets/images/SocialIcons4.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="FooterContainer">
        <div className="FooterTop">
          <div className="FooterTopLft">
            <h5>A question ? Need help ?</h5>
            <p>Visit our Help Center or contact us</p>
          </div>
          <button className="HelpBtn">
            <img src={Information} className="Downarrow" alt="icon" />
            OPEN HELP CENTER
          </button>
        </div>
        <div className="FooterBox">
          <div className="FooterBox1">
            <h4>Our enterprise</h4>
            <ul>
              <li>
                <Link>About Us</Link>
              </li>
              <li>
                <Link>Video consultation</Link>
              </li>
              <li>
                <Link>Careers</Link>
              </li>
              <li>
                <Link>Press</Link>
              </li>
              <li>
                <Link>Need help ?</Link>
              </li>
              <li>
                <Link>Fraudulent notifications</Link>
              </li>
            </ul>

            <h4>For practitioners</h4>
            <ul>
              <li>
                <Link>TabiBook Pro management software</Link>
              </li>
              <li>
                <Link>Video consultation</Link>
              </li>
              <li>
                <Link>TabiBook Community</Link>
              </li>
            </ul>
          </div>
          <div className="FooterBox1">
            <h4>Find your specialist</h4>
            <ul>
              <li>
                <Link>Male nurse</Link>
              </li>
              <li>
                <Link>Gynecologist</Link>
              </li>
              <li>
                <Link>Dentist</Link>
              </li>
              <li>
                <Link>General practitioner</Link>
              </li>
              <li>
                <Link>Home nurse</Link>
              </li>
              <li>
                <Link>Pediatrician</Link>
              </li>
              <li>
                <Link>Ophthalmologist</Link>
              </li>
              <li>
                <Link>Dermatologist and venereologist</Link>
              </li>
              <li>
                <Link>Osteopath</Link>
              </li>
              <li>
                <Link>Masseur-physiotherapist</Link>
              </li>
            </ul>
          </div>
          <div className="FooterBox1">
            <h4>&nbsp; </h4>
            <ul>
              <li>
                <Link>Podiatrist</Link>
              </li>
              <li>
                <Link>Optician-eyewear maker</Link>
              </li>
              <li>
                <Link>Midwife</Link>
              </li>
              <li>
                <Link>ENT</Link>
              </li>
              <li>
                <Link>Allergist</Link>
              </li>
              <li>
                <Link>Urological surgeon</Link>
              </li>
              <li>
                <Link>Rheumatologist</Link>
              </li>
              <li>
                <Link>Stomatologist</Link>
              </li>
              <li>
                <Link>Endocrinologist</Link>
              </li>
              <li>
                <Link>Orthopedic surgeon and traumatologist</Link>
              </li>
            </ul>
          </div>
          <div className="FooterBox1">
            <h4>Popular searches</h4>
            <ul>
              <li>
                <Link>Dental surgeon</Link>
              </li>
              <li>
                <Link>Nurse</Link>
              </li>
              <li>
                <Link>General practitioner</Link>
              </li>
              <li>
                <Link>Pediatrician</Link>
              </li>
              <li>
                <Link>Ophthalmologist</Link>
              </li>
              <li>
                <Link>Dermatologist and venereologist</Link>
              </li>
              <li>
                <Link>Osteopath</Link>
              </li>
              <li>
                <Link>Masseur-physiotherapist</Link>
              </li>
              <li>
                <Link>Pedicure-podiatrist</Link>
              </li>
              <li>
                <Link>Optician-eyewear maker </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="FooterBottom">
          <h5>Visit our Help Center or contact us</h5>
          <div className="socialicon">
            <ul>
              <li>
                <Link>
                  {" "}
                  <img src={SocialIcons1} className="Sicon" alt="icon" />
                </Link>
              </li>
              <li>
                <Link>
                  {" "}
                  <img src={SocialIcons2} className="Sicon" alt="icon" />
                </Link>
              </li>
              <li>
                <Link>
                  {" "}
                  <img src={SocialIcons3} className="Sicon" alt="icon" />
                </Link>
              </li>
              <li>
                <Link>
                  {" "}
                  <img src={SocialIcons4} className="Sicon" alt="icon" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
