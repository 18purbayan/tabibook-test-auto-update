import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Doctorheader from "../../components/MainHeader/Doctorheader";
import Background from "../../assets/images/DoctorHero.jpg";
import SmallArrow from "../../assets/images/smallArrow.svg";
import Discover1 from "../../assets/images/Discover1.png";
import Discover2 from "../../assets/images/Discover2.png";
import Discover3 from "../../assets/images/Discover3.png";
import TestimonialsCarousel from "../../components/TestimonialsCarousel";
import Footer from "../../components/Footer/Footer";
import AppImg from "../../assets/images/app.png";
import Play from "../../assets/images/play.svg";
import Appstore from "../../assets/images/AppStore.svg";
import {getSpecialityApi, requestDoctorApi} from "../../services/apiService";
import {toast} from "react-toastify";

const DoctorLanding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointment");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    postalCode: "",
    cellphone: "",
    specialty: "",
    email: "",
    additionalInfo: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    postalCode: "",
    cellphone: "",
    specialty: "",
    email: "",
    additionalInfo: "",
    termsAccepted: "",
  });
  const [specialityList, setSpecialityList] = useState();
  const [btnDis, setBtnDis] = useState(false);

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  // Handle input changes
  const handleChange = e => {
    const {name, value, type, checked} = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    // const isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/.test(emailOrMobile) || /^\d{10}$/.test(emailOrMobile);
    if (!formValues.firstName) {
      errors.firstName = "First name is required.";
      isValid = false;
    }
    if (!formValues.lastName) {
      errors.lastName = "Last name is required.";
      isValid = false;
    }
    if (!formValues.postalCode) {
      errors.postalCode = "Postal code is required.";
      isValid = false;
    }
    if (!formValues.cellphone) {
      errors.cellphone = "Cellphone number is required.";
      isValid = false;
    }
    if (formValues.cellphone && !/^\d{10}$/.test(formValues.cellphone)) {
      errors.cellphone = "Cellphone number is not valid.";
      isValid = false;
    }
    if (!formValues.specialty) {
      errors.specialty = "Specialty is required.";
      isValid = false;
    }
    if (!formValues.email) {
      errors.email = "Email address is required.";
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/.test(formValues.email)) {
      errors.email = "Email address is invalid.";
      isValid = false;
    }
    if (!formValues.termsAccepted) {
      errors.termsAccepted = "You must accept the terms.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const getSpeciality = async () => {
    try {
      let response = await getSpecialityApi();
      if (response) {
        if (response.data.res === true) {
          setSpecialityList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleApprove = async () => {
    if (validateForm()) {
      try {
        setBtnDis(true);
        let formData = new FormData();
        formData.append("first_name", formValues?.firstName);
        formData.append("last_name", formValues?.lastName);
        formData.append("postal_code", formValues?.postalCode);
        formData.append("speciality", formValues?.specialty);
        formData.append("email", formValues?.email);
        formData.append("cell_phone", formValues?.cellphone);

        let response = await requestDoctorApi(formData);
        if (response) {
          if (response.data.res === true) {
            toast.success(response.data.msg, {autoClose: 1500});
            navigate("/doctor/approval");
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setBtnDis(false);
      } catch (error) {
        setBtnDis(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    }
  };

  useEffect(() => {
    getSpeciality();
  }, []);

  return (
    <div className="DoctorBody">
      <Doctorheader />
      <div className="DoctorHero" style={{backgroundImage: "url(" + Background + ")"}}>
        <div className="DoctorHeroContainer">
          <div className="DoctorHeroLft">
            <h5>
              The <Link>new</Link> generation of solutions for practitioners
            </h5>
            <h4>Strengthen patient communication</h4>
            <ul>
              <li>
                <img src={SmallArrow} className="SmallArrowIcon" alt="ficon" /> Innovative all-in-one solutions, designed with you
              </li>
              <li>
                <img src={SmallArrow} className="SmallArrowIcon" alt="ficon" /> The highest level of health data protection
              </li>
            </ul>
          </div>

          <div className="DoctorHeroRgt">
            <div className="WBox">
              <h5>Contact Us</h5>
              <p>Are you a practitioner? One of our advisors will contact you</p>
              <ul>
                <li>
                  <input type="text" name="firstName" placeholder="First Name*" className="WBoxinput" value={formValues.firstName} onChange={handleChange} />
                  {errors.firstName && <span className="error">{errors.firstName}</span>}
                </li>
                <li>
                  <input type="text" name="lastName" placeholder="Last name*" className="WBoxinput" value={formValues.lastName} onChange={handleChange} />
                  {errors.lastName && <span className="error">{errors.lastName}</span>}
                </li>
                <li>
                  <input
                    type="number"
                    name="postalCode"
                    placeholder="Code postal cabin*"
                    className="WBoxinput"
                    value={formValues.postalCode}
                    onChange={handleChange}
                  />
                  {errors.postalCode && <span className="error">{errors.postalCode}</span>}
                </li>
                <li>
                  <input type="number" name="cellphone" placeholder="Cellphone*" className="WBoxinput" value={formValues.cellphone} onChange={handleChange} />
                  {errors.cellphone && <span className="error">{errors.cellphone}</span>}
                </li>
                <li>
                  <div className="select-style">
                    <select name="specialty" value={formValues.specialty} onChange={handleChange}>
                      <option value="" disabled hidden selected>
                        Your specialty*
                      </option>
                      {specialityList?.map((item, index) => (
                        <option key={index} value={item?.id}>
                          {item?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.specialty && <span className="error">{errors.specialty}</span>}
                </li>
                <li>
                  <input type="email" name="email" placeholder="Email address*" className="WBoxinput" value={formValues.email} onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
                </li>
                <li>
                  <input
                    type="text"
                    name="additionalInfo"
                    placeholder="I am a doctor, I want to know about tabibook"
                    className="WBoxinput doneInput"
                    value={"I am a doctor, I want to know about tabibook"}
                    readOnly
                    onChange={handleChange}
                  />
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="termsAccepted" checked={formValues.termsAccepted} onChange={handleChange} />I am filling this because I am a
                    doctor interested in tabibook.
                  </label>
                  {errors.termsAccepted && <span className="error">{errors.termsAccepted}</span>}
                </li>
                <li>
                  {btnDis ? (
                    <button type="submit" className="WBNext" disabled>
                      Please Wait...
                    </button>
                  ) : (
                    <button type="submit" className="WBNext" onClick={() => handleApprove()}>
                      Next
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="DiscoverDiv">
        <h4>Discover our solutions designed for you</h4>
        <div className="DiscoverTab">
          <ul className="DiscoverTabLink">
            <li className={activeTab === "appointment" ? "active" : ""} onClick={() => handleTabClick("appointment")}>
              Appointment management
            </li>
            <li className={activeTab === "discussions" ? "active" : ""} onClick={() => handleTabClick("discussions")}>
              Discussions with patients
            </li>
            <li className={activeTab === "online" ? "active" : ""} onClick={() => handleTabClick("online")}>
              Online visibility
            </li>
            <li className={activeTab === "care" ? "active" : ""} onClick={() => handleTabClick("care")}>
              Care pathway
            </li>
            <li className={activeTab === "practicality" ? "active" : ""} onClick={() => handleTabClick("practicality")}>
              Practicality
            </li>
          </ul>
        </div>

        <div className="DiscoverContainer">
          <div className="TabContent">
            {activeTab === "appointment" && (
              <div id="all" className="DiscoverBlock">
                <div className="DiscoverList">
                  <ul>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover1} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Personalized diary</h2>
                          <p>Simply adapt and manage your schedule according to your preferences.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover2} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Unfulfilled appointments divided by 3</h2>
                          <p>Send automatic consultation reminders to your patients using Doctolib tools.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover3} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Adapted online booking</h2>
                          <p>Save 1h30 per week with online appointment booking adjusted according to your needs (example: known patients only).</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === "discussions" && (
              <div id="upcoming" className="DiscoverBlock">
                <div className="DiscoverList">
                  <ul>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover1} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Personalized diary</h2>
                          <p>Simply adapt and manage your schedule according to your preferences.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover2} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Unfulfilled appointments divided by 3</h2>
                          <p>Send automatic consultation reminders to your patients using Doctolib tools.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover3} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Adapted online booking</h2>
                          <p>Save 1h30 per week with online appointment booking adjusted according to your needs (example: known patients only).</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === "online" && (
              <div id="online" className="DiscoverBlock">
                <div className="DiscoverList">
                  <ul>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover1} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Personalized diary</h2>
                          <p>Simply adapt and manage your schedule according to your preferences.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover2} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Unfulfilled appointments divided by 3</h2>
                          <p>Send automatic consultation reminders to your patients using Doctolib tools.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover3} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Adapted online booking</h2>
                          <p>Save 1h30 per week with online appointment booking adjusted according to your needs (example: known patients only).</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === "care" && (
              <div id="care" className="DiscoverBlock">
                <div className="DiscoverList">
                  <ul>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover1} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Personalized diary</h2>
                          <p>Simply adapt and manage your schedule according to your preferences.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover2} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Unfulfilled appointments divided by 3</h2>
                          <p>Send automatic consultation reminders to your patients using Doctolib tools.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover3} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Adapted online booking</h2>
                          <p>Save 1h30 per week with online appointment booking adjusted according to your needs (example: known patients only).</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === "practicality" && (
              <div id="practicality" className="DiscoverBlock">
                <div className="DiscoverList">
                  <ul>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover1} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Personalized diary</h2>
                          <p>Simply adapt and manage your schedule according to your preferences.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover2} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Unfulfilled appointments divided by 3</h2>
                          <p>Send automatic consultation reminders to your patients using Doctolib tools.</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="DiscoverBox">
                        <div className="DiscoverBoxImg">
                          <img src={Discover3} className="DiscoverBoxImg" alt="SliderImg" />
                        </div>
                        <div className="DiscoverBoxTXt">
                          <h2>Adapted online booking</h2>
                          <p>Save 1h30 per week with online appointment booking adjusted according to your needs (example: known patients only).</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="CenterButton">
          <button className="ViewButton">View All Specialities</button>
        </div>
      </div>

      <div className="PlanDiv">
        <div className="PlanDivContainer">
          <h5>Benefit from a unique software suite</h5>

          <ul>
            <li>
              <div className="planBox">
                <h2>TabiBook Patient</h2>
                <h3>
                  139 <span>EUR including tax / month / practitioner</span>
                </h3>
                <p>Billed once a year or 149 EUR including tax / month in monthly payment</p>
                <p>Use of the software by a substitute free</p>

                <div className="planlist">
                  <h5>Agenda and communication with patients</h5>
                  <ul>
                    <li>Online calendar</li>
                    <li>Tool for reducing unfulfilled appointments</li>
                    <li>Care coordination tools</li>
                    <li>Make appointments online for your patients</li>
                    <li>Patient messaging</li>
                    <li>Group communication to patients</li>
                  </ul>
                  <button className="buyBtn">Buy Now</button>
                </div>
              </div>
            </li>
            <li>
              <div className="planBox">
                <h2>TabiBook Doctor</h2>
                <h3>
                  139 <span>EUR including tax / month / practitioner</span>
                </h3>
                <p>Billed once a year or 149 EUR including tax / month in monthly payment</p>
                <p>Use of the software by a substitute free</p>

                <div className="planlist">
                  <h5>Agenda and communication with patients</h5>
                  <ul>
                    <li>Online calendar</li>
                    <li>Tool for reducing unfulfilled appointments</li>
                    <li>Care coordination tools</li>
                    <li>Make appointments online for your patients</li>
                    <li>Patient messaging</li>
                    <li>Group communication to patients</li>
                  </ul>
                  <button className="buyBtn">Buy Now</button>
                </div>
              </div>
            </li>
            <li>
              <div className="planBox">
                <h2>TabiBook Kiné</h2>
                <h3>
                  139 <span>EUR including tax / month / practitioner</span>
                </h3>
                <p>Billed once a year or 149 EUR including tax / month in monthly payment</p>
                <p>Use of the software by a substitute free</p>

                <div className="planlist">
                  <h5>Agenda and communication with patients</h5>
                  <ul>
                    <li>Online calendar</li>
                    <li>Tool for reducing unfulfilled appointments</li>
                    <li>Care coordination tools</li>
                    <li>Make appointments online for your patients</li>
                    <li>Patient messaging</li>
                    <li>Group communication to patients</li>
                  </ul>
                  <button className="buyBtn">Buy Now</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="TestimonialDiv">
        <h3>Here’s what our doctor and patient think</h3>
        <TestimonialsCarousel />
      </div>
      <div className="AppDiv">
        <div className="AppContainer">
          <div className="AppBox">
            <div className="AppBoxLft">
              <img src={AppImg} className="AppBig" alt="logoIcon" />
            </div>

            <div className="AppBoxRgt">
              <h5>Download the TabiBook app</h5>
              <p>Access video consultation established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
              <h4>Get the link to download the app</h4>

              <div className="appgrp">
                <img src={Appstore} className="applogo" alt="logoIcon" />
                <img src={Play} className="applogo" alt="logoIcon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorLanding;
