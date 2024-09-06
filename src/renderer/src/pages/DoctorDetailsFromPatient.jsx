import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import docimg from "../assets/images/DocImg.png";
import Back from "../assets/images/Back.svg";
import {doctorDetailsPatientViewApi, downloadAppTextApi} from "../services/apiService";
import LoadingPage from "../components/LoadingPage";
import NoImage from "../assets/images/no-image-avatar.png";
import {IMAGE_URL} from "../app_url";
import {toast} from "react-toastify";
import {useGoogleMapContext} from "../context/GoogleMapContext";
import {GoogleMap, Marker} from "@react-google-maps/api";
import ReactStars from "react-rating-stars-component";
import {useUserContext} from "../context/UserContext";
import Afterloginheader from "../components/MainHeader/Afterloginheader";
import Header from "../components/MainHeader/Mainheader";

const DoctorDetailsFromPatient = () => {
  const {userData, searchValuesContext} = useUserContext();
  const {isLoaded} = useGoogleMapContext();
  const location = useLocation();
  const navigate = useNavigate();

  const {slug} = useParams();

  const containerStyle = {
    height: "400px",
  };

  const essentialRef = useRef(null);
  const mapRef = useRef(null);
  const serviceRef = useRef(null);
  const scheduleRef = useRef(null);
  const ratesRef = useRef(null);

  const [showModal23, setShowModal23] = useState(true);
  const [activeLink, setActiveLink] = useState("essential");
  const [activeIndex, setActiveIndex] = useState(null);
  const [screenLoading, setScreenLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [allDetails, setAllDetails] = useState();
  const [timeSlots, setTimeSlots] = useState();
  const [selectedLang, setSelectedLang] = useState("en");
  const [appTextDetails, setAppTextDetails] = useState();

  const scrollToSection = (ref, link) => {
    ref.current.scrollIntoView({behavior: "smooth"});
    setActiveLink(link);
  };

  const toggleModal23 = () => {
    setShowModal23(!showModal23);
  };

  const handleClick = index => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const getDoctorInfo = async () => {
    try {
      setScreenLoading(true);
      const fd = new FormData();
      fd.append("slug", slug);
      fd.append("types", searchValuesContext?.types ? searchValuesContext?.types : "0");
      let response = await doctorDetailsPatientViewApi(fd);
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data);
          setTimeSlots(response.data.users.availableDays);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setScreenLoading(false);
    } catch (error) {
      setScreenLoading(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const handleBookAppointment = async () => {
    if (!userData) {
      setShowLoginPopup(true);
    } else {
      navigate("/appointment-booking", {state: {from: location.pathname}});
    }
  };

  const getDownloadAppText = async () => {
    try {
      let response = await downloadAppTextApi();
      if (response) {
        if (response.data.res === true) {
          setAppTextDetails(response.data.data[0]);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  useEffect(() => {
    getDoctorInfo();
    getDownloadAppText();
  }, []);

  return (
    <>
      <div className="DDBody">
        {userData ? <Afterloginheader /> : <Header showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup} from={location.pathname} />}
        {screenLoading && <LoadingPage />}
        {!screenLoading ? (
          <>
            <div className="BodyTopinner">
              <div className="BodyTop">
                <div className="BodyTopLft">
                  <div className="BodyTopLftDocinfo">
                    <div className="DocinfoImg">
                      <img src={allDetails?.users?.profile_pic ? IMAGE_URL + allDetails?.users?.profile_pic : NoImage} alt="Profile Picture" />
                      {/* <img src={docimg} alt="" /> */}
                    </div>
                    <div className="DocinfoTxt">
                      <h2>
                        {" "}
                        Dr. {allDetails?.users?.first_name} {allDetails?.users?.last_name}
                        {Number(searchValuesContext?.types === 1) ? <span> (This doctor isn't available right now.)</span> : null}
                      </h2>
                      <p>{allDetails?.doctor_speciality}</p>
                      <span className="DocinfoRating">
                        <ReactStars
                          count={5}
                          // onChange={}
                          size={17}
                          activeColor="#ffd700"
                          edit={false}
                          value={0} // Set the initial rating to 4.5
                          isHalf={true} // Allow half-star ratings
                        />
                        {/* <img src={StarIcon2} alt="" />  */}0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="BodyTopRgt">
                  <Link to="/doctor/profile" className="bkbtnn">
                    <img src={Back} className="backIcon" alt="icon" /> Back
                  </Link>
                  {/* <Link to="/" className="bkbtnn">
                    <img src={Back} className="backIcon" alt="icon" /> Back to listing
                  </Link> */}
                  {Number(searchValuesContext?.types !== 1) ? <button className="addfav">Add to favorite</button> : null}
                </div>
              </div>
            </div>
            <div className="TabFixed">
              <div className="tabLink">
                <ul>
                  <li>
                    <button className={activeLink === "essential" ? "active" : ""} onClick={() => scrollToSection(essentialRef, "essential")}>
                      The Essential
                    </button>
                  </li>
                  <li>
                    <button className={activeLink === "map" ? "active" : ""} onClick={() => scrollToSection(mapRef, "map")}>
                      Map
                    </button>
                  </li>
                  {allDetails?.users?.service_description ? (
                    <li>
                      <button className={activeLink === "service" ? "active" : ""} onClick={() => scrollToSection(serviceRef, "service")}>
                        Service Overview
                      </button>
                    </li>
                  ) : null}
                  {timeSlots && Object.entries(timeSlots)?.length > 0 ? (
                    <li>
                      <button className={activeLink === "schedule" ? "active" : ""} onClick={() => scrollToSection(scheduleRef, "schedule")}>
                        Schedules
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>

            <div className="PanelBody">
              <div className="PanelBodyLft">
                <div className="PanelBodyLftBox" ref={essentialRef}>
                  <div className="PanelBodyLftBoxtop ">
                    <div className="PanelBodyLftBoxtopLft">
                      <h3>{allDetails?.users?.cabin_address}</h3>
                      {/* <p>60 Rue Jean Bart, 59000 Lille</p> */}
                    </div>

                    <div className="PanelBodyLftBoxtopRgt">
                      <Link to="javascript:void(0);" onClick={() => scrollToSection(mapRef, "map")}>
                        See location
                      </Link>
                    </div>
                  </div>
                  {allDetails?.users?.price_description ? (
                    <div className="PanelBodyLftBoxM">
                      <div className="PanelBodyLftBoxMLft">
                        <h3>Price and Payment Methods</h3>
                        <h4>Price</h4>
                        <p>{allDetails?.users?.price_description}</p>
                        <Link to="javascript:void(0);" onClick={() => scrollToSection(ratesRef, "map")}>
                          See prices
                        </Link>
                      </div>

                      <div className="PanelBodyLftBoxMRgt">
                        <h3>Payment Methods</h3>
                        {allDetails?.users?.payment_type === 0 ? (
                          <p>Cash and credit card</p>
                        ) : allDetails?.users?.payment_type === 1 ? (
                          <p>Only Cash</p>
                        ) : allDetails?.users?.payment_type === 2 ? (
                          <p>Only credit card</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="PanelBodyLftBoxAdio PaddingZero">
                    <div className="PanelBodyLftBoxM TopLang">
                      <h3></h3>
                      <div className="LanguageSelectBox">
                        <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
                          <option value={"en"}>English</option>
                          <option value={"ar"}>Arabic</option>
                          <option value={"fn"}>French</option>
                        </select>
                      </div>
                    </div>
                    <div className="PanelBodyLftBoxMTwo">
                      <div
                        className="AppTextLangCont"
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedLang === "en"
                              ? appTextDetails?.lang_en
                              : selectedLang === "ar"
                              ? appTextDetails?.lang_ar
                              : selectedLang === "fn"
                              ? appTextDetails?.lang_fr
                              : "",
                        }}></div>
                    </div>
                  </div>
                  <div className="PanelBodyLftBoxAdio">
                    <h3>Audience received</h3>
                    <p>This practitioner does not allow online booking for patients over 18 years of age</p>
                  </div>
                  {allDetails?.users?.doctor_experts?.length > 0 ? (
                    <div className="PanelBodyLftBoxdeeds">
                      <h3>Expertise and deeds</h3>
                      <div className="PanelBodyLftBoxdeedsBtnGrp">
                        {allDetails?.users?.doctor_experts?.map((item, index) => (
                          <button key={index}>{item?.expertise}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="MapInfoBox" ref={mapRef}>
                  <div className="MapInfoBoxLft">
                    <h3>Map and access information</h3>
                    <h4>
                      Office of Dr. {allDetails?.users?.first_name} {allDetails?.users?.last_name}
                    </h4>
                    <p>{allDetails?.users?.cabin_address}</p>
                    {allDetails?.users?.doctor_transports?.length > 0 ? (
                      <>
                        <h4>Means of transport</h4>
                        {allDetails?.users?.doctor_transports?.map((item, index) => (
                          <p key={index}>{item?.transport}</p>
                        ))}
                      </>
                    ) : null}

                    {allDetails?.users?.doctor_parkings?.length > 0 ? (
                      <>
                        <h4>Public parking</h4>
                        {allDetails?.users?.doctor_parkings?.map((item, index) => (
                          <p key={index}>{item?.parking}</p>
                        ))}
                      </>
                    ) : null}

                    {allDetails?.users?.doctor_informations?.length > 0 ? (
                      <>
                        <h4>Useful information</h4>
                        {allDetails?.users?.doctor_informations?.map((item, index) => (
                          <p key={index}>{item?.information}</p>
                        ))}
                      </>
                    ) : null}
                  </div>
                  <div className="MapInfoBoxRgt">
                    {isLoaded && allDetails?.users?.lat && allDetails?.users?.lng ? (
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{lat: Number(allDetails?.users?.lat), lng: Number(allDetails?.users?.lng)}}
                        zoom={11}
                        options={{streetViewControl: false, mapTypeControl: false}}>
                        <>
                          <Marker position={{lat: Number(allDetails?.users?.lat), lng: Number(allDetails?.users?.lng)}} />
                        </>
                      </GoogleMap>
                    ) : (
                      <></>
                    )}
                    {/* <img src={MapIcon} alt="" /> */}
                  </div>
                </div>
                {allDetails?.users?.service_description ? (
                  <div className="PanelBodyLftBox" ref={serviceRef}>
                    <div className="PanelBodyLftBoxAdio NoBdrTop">
                      <h3 className="HdrMargB">Service Overview</h3>
                      <p className="ParaMargB">{allDetails?.users?.service_description}</p>
                      {/* <p className="ParaMargB">
                    They both consult for EMERGENCY reasons on dedicated slots (fever, otitis, gastroenteritis, bronchiolitis, skin rash, angina etc.). They
                    have the necessary equipment for rapid diagnosis: strep to-test, flu test, Covid test, urine strip, capillary blood glucose, etc.
                  </p>
                  <p>Dr. Deborah Dang, Pediatrician and Former Head of Clinic at the Necker Hospital, provides specialist consultations:</p>
                  <ul className="BlueArrowList">
                    <li>General Pediatrics and Infectious Diseases </li>
                    <li>Oral disorders, sucking and swallowing disorders</li>
                    <li>
                      Consultations on syndromic diseases and multiple disabilities in children <br />
                      (follow-up)
                    </li>
                    <li>Pain medicine</li>
                  </ul>
                  <p className="ParaMargB">
                    <span className="BlueText">ATTENTION:</span> Please make a specialist appointment only with the doctor concerned by the desired specialty.
                  </p>
                  <p className="ParaMargB">
                    For the first consultations, please bring all the old reports of hospitalization, pediatrician colleagues, additional examinations etc...
                  </p>
                  <p>Allergy skin tests can only be carried out after stopping anti-histamines (Polaramine, Aerius, Zurtec etc.) for at least 5 days.</p> */}
                    </div>
                    <div className="PanelBodyLftBoxAdio NoBdrTop">
                      <h3>Languages Spoken</h3>
                      {allDetails?.doctor_languages?.map((item, index) => (
                        <p key={index}>{item?.language?.name}</p>
                      ))}
                    </div>
                    <div className="PanelBodyLftBoxAdio NoBdrTop">
                      <h3>Photos</h3>
                      <ul className="ImgList">
                        {allDetails?.users?.doctor_documents?.map((item, index) => (
                          <li key={index}>
                            <img src={IMAGE_URL + item?.documents} alt="" />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="PanelBodyLftBoxAdio NoBdr">
                      <h3 className="HdrMargB15">National and university degrees</h3>
                      <ul className="TextBoxList">
                        {allDetails?.users?.doctor_degrees?.map((item, index) => (
                          <li key={index}>
                            <div className="LftBox">{item?.year}</div>
                            <div className="RghtBox">
                              {item?.degree} - {item?.university}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <h3 className="HdrMargB15">Other training courses</h3>
                      <ul className="TextBoxList">
                        {allDetails?.users?.doctor_trainings?.map((item, index) => (
                          <li key={index}>
                            <div className="LftBox">{item?.year}</div>
                            <div className="RghtBox">{item?.center_name}</div>
                          </li>
                        ))}
                      </ul>
                      <h3 className="HdrMargB15">Experiences</h3>
                      <ul className="TextBoxList">
                        {allDetails?.users?.doctor_experiences?.map((item, index) => (
                          <li key={index}>
                            <div className="LftBox">
                              {item?.from_year} - {item?.to_year}
                            </div>
                            <div className="RghtBox">{item?.org_name}</div>
                          </li>
                        ))}
                      </ul>
                      <h3 className="HdrMargB15">Works and publications</h3>
                      <ul className="TextBoxList">
                        {allDetails?.users?.doctor_publications?.map((item, index) => (
                          <li key={index}>
                            <div className="LftBox">{item?.year}</div>
                            <div className="RghtBox">{item?.links}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {timeSlots && Object.entries(timeSlots).length > 0 ? (
                  <div className="PanelBodyLftBox" ref={scheduleRef}>
                    <div className="PanelBodyLftBoxAdio NoBdr">
                      <div className="TimeRow">
                        <div className="TimeLeftBox">
                          <h3>Opening hours and contact details</h3>
                          <h4>Opening hours</h4>
                          <ul className="TimeList">
                            {timeSlots &&
                              Object.entries(timeSlots).map(([day, times], index) => (
                                <li key={index}>
                                  <div className="DaySec">{day}:</div>
                                  <div className="TimeSec">{times}</div>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="TimeRightBox">
                          <h3>Emergency contact</h3>
                          <p>In case of emergency, contact 15 (Samu)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {allDetails?.users?.doctor_consultations?.length > 0 ? (
                  <div className="PanelBodyLftBox">
                    <div className="PanelBodyLftBoxAdio NoBdr" ref={ratesRef}>
                      <h3>Rates</h3>
                      <div className="InfoBox">
                        <table className="RatesTable">
                          {allDetails?.users?.doctor_consultations?.map((item, index) => (
                            <tr key={index}>
                              <th>{item?.consultation}</th>
                              <td>{item?.fees} AED</td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null}
                {allDetails?.users?.rpps_no ? (
                  <div className="PanelBodyLftBox">
                    <div className="PanelBodyLftBoxAdio NoBdr">
                      <h3>Legal information</h3>
                      <div className="InfoBox">
                        <h4>RPPS Number</h4>
                        <p>{allDetails?.users?.rpps_no}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {allDetails?.doctor_faqs?.length > 0 ? (
                  <div className="PanelBodyLftBox">
                    <div className="PanelBodyLftBoxAdio NoBdr">
                      <button className={showModal23 ? "FAQBtn active" : "FAQBtn"} onClick={toggleModal23}>
                        Frequently Asked Question
                      </button>
                      {showModal23 && (
                        <div className="accordion">
                          {allDetails?.doctor_faqs?.map((item, index) => (
                            <div key={index} className={`accordion-item ${activeIndex === index ? "expanded" : "collapsed"}`}>
                              <div className={`accordion-title ${activeIndex === index ? "active" : ""}`} onClick={() => handleClick(index)}>
                                {item.faq?.name}
                              </div>
                              {activeIndex === index && (
                                <div className="accordion-content">
                                  <p>{item.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="PanelBodyRgt">
                <div className="PanelBodyLftBox">
                  <div className="PanelBodyLftBoxAdio NewRghtWhiteBody">
                    <h3>In summary</h3>
                    <ul className="SummaryList">
                      <li>Accept new patients on tabiBook</li>
                      <li>
                        {allDetails?.users?.cabin_address}
                        <p>&nbsp;</p>
                      </li>
                    </ul>
                    {Number(searchValuesContext?.types !== 1) ? (
                      <button className="addfav" onClick={() => handleBookAppointment()}>
                        Book Appointment
                      </button>
                    ) : null}
                  </div>
                </div>
                {searchValuesContext?.types !== 1 ? (
                  <div className="PanelBodyLftBox">
                    <div className="PanelBodyLftBoxAdio NewRghtWhiteBody">
                      <h3>Reviews</h3>
                      <ul className="ReviewsList">
                        <li>
                          <p>
                            "Dr. Dang is a skilled internist who has helped me manage my chronic conditions effectively. She is thorough in her examinations and
                            takes the time to listen to my concerns."
                          </p>
                          <div className="ReviewsProflBox">
                            <div className="LftPflBox">
                              <img src={docimg} alt="" />
                              <h4>- Billie Jeans</h4>
                            </div>
                            <div className="RghtPflBox">
                              <h5>4.5</h5>
                            </div>
                          </div>
                        </li>
                        <li>
                          <p>
                            "Dr. Dang is a skilled internist who has helped me manage my chronic conditions effectively. She is thorough in her examinations and
                            takes the time to listen to my concerns."
                          </p>
                          <div className="ReviewsProflBox">
                            <div className="LftPflBox">
                              <img src={docimg} alt="" />
                              <h4>- Billie Jeans</h4>
                            </div>
                            <div className="RghtPflBox">
                              <h5>4.5</h5>
                            </div>
                          </div>
                        </li>
                        <li>
                          <p>
                            "Dr. Dang is a skilled internist who has helped me manage my chronic conditions effectively. She is thorough in her examinations and
                            takes the time to listen to my concerns."
                          </p>
                          <div className="ReviewsProflBox">
                            <div className="LftPflBox">
                              <img src={docimg} alt="" />
                              <h4>- Billie Jeans</h4>
                            </div>
                            <div className="RghtPflBox">
                              <h5>4.5</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <a className="SeeMoreLink">See more</a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default DoctorDetailsFromPatient;
