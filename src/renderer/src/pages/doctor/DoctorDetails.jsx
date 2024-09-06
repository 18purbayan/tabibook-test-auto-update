import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import docimg from "../../assets/images/DocImg.png";
import StarIcon2 from "../../assets/images/StarIcon2.svg";
import Back from "../../assets/images/Back.svg";
import MapIcon from "../../assets/images/Map2.png";
import {downloadAppTextApi, fetchDoctorInfoApi, fetchNormalAvailabilityApi} from "../../services/apiService";
import LoadingPage from "../../components/LoadingPage";
import NoImage from "../../assets/images/no-image-avatar.png";
import {IMAGE_URL} from "../../app_url";
import {toast} from "react-toastify";
import {useGoogleMapContext} from "../../context/GoogleMapContext";
import {GoogleMap, Marker} from "@react-google-maps/api";
import ReactStars from "react-rating-stars-component";

const DoctorDetails = () => {
  const {isLoaded} = useGoogleMapContext();

  const containerStyle = {
    height: "400px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
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
  const [allDetails, setAllDetails] = useState();
  const [timeSlots, setTimeSlots] = useState({});
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

  const items = [
    {
      title: "What is the address of Dr Dr. Deborah?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    },
    {
      title: "What are the opening hours of Dr. Deborah Dang?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    },
    {
      title: "What language does Dr. Deborah Dang speak?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    },
    {
      title: "Does Dr. Deborah Dang accept new patients?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    },
  ];

  const getDoctorInfo = async () => {
    try {
      setScreenLoading(true);
      let response = await fetchDoctorInfoApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
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

  const getNormaAvailability = async () => {
    try {
      setScreenLoading(true);
      let response = await fetchNormalAvailabilityApi();
      if (response) {
        if (response.data.res === true) {
          let tempCheckedDays = {};
          let tempTimeSlots = {};
          if (response.data.data.availDay.sunday.intervals.length > 0) {
            tempCheckedDays.Sunday = true;
            tempTimeSlots.Sunday = [];
            response.data.data.availDay.sunday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Sunday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.monday.intervals.length > 0) {
            tempCheckedDays.Monday = true;
            tempTimeSlots.Monday = [];
            response.data.data.availDay.monday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Monday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.tuesday.intervals.length > 0) {
            tempCheckedDays.Tuesday = true;
            tempTimeSlots.Tuesday = [];
            response.data.data.availDay.tuesday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Tuesday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.wednesday.intervals.length > 0) {
            tempCheckedDays.Wednesday = true;
            tempTimeSlots.Wednesday = [];
            response.data.data.availDay.wednesday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Wednesday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.thursday.intervals.length > 0) {
            tempCheckedDays.Thursday = true;
            tempTimeSlots.Thursday = [];
            response.data.data.availDay.thursday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Thursday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.friday.intervals.length > 0) {
            tempCheckedDays.Friday = true;
            tempTimeSlots.Friday = [];
            response.data.data.availDay.friday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Friday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }
          if (response.data.data.availDay.saturday.intervals.length > 0) {
            tempCheckedDays.Saturday = true;
            tempTimeSlots.Saturday = [];
            response.data.data.availDay.saturday.intervals.map((intItem, intIndex) => {
              tempTimeSlots.Saturday.push({id: intItem.id, startTime: intItem.start_time, endTime: intItem.end_time});
            });
          }

          setTimeSlots(tempTimeSlots);
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

  // Function to format time range
  const formatTimeRange = times => {
    return times
      .map(({startTime, endTime}) => {
        const formattedStartTime = startTime?.split(":")[0] + ":" + startTime?.split(":")[1];
        const formattedEndTime = endTime?.split(":")[0] + ":" + endTime?.split(":")[1];
        return `${formattedStartTime} - ${formattedEndTime}`;
      })
      .join(", ");
  };

  useEffect(() => {
    getDoctorInfo();
    getNormaAvailability();
    getDownloadAppText();
  }, []);

  return (
    <>
      {screenLoading && <LoadingPage />}
      {!screenLoading ? (
        <div className="DDBody">
          {/* <Afterloginheader /> */}
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
                <button className="addfav">Add to favorite</button>
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
                <li>
                  <button className={activeLink === "service" ? "active" : ""} onClick={() => scrollToSection(serviceRef, "service")}>
                    Service Overview
                  </button>
                </li>
                {Object.entries(timeSlots).length > 0 ? (
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
                <div className="PanelBodyLftBoxdeeds">
                  <h3>Expertise and deeds</h3>
                  <div className="PanelBodyLftBoxdeedsBtnGrp">
                    {allDetails?.users?.doctor_experts?.map((item, index) => (
                      <button key={index}>{item?.expertise}</button>
                    ))}
                  </div>
                </div>
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
              {Object.entries(timeSlots).length > 0 ? (
                <div className="PanelBodyLftBox" ref={scheduleRef}>
                  <div className="PanelBodyLftBoxAdio NoBdr">
                    <div className="TimeRow">
                      <div className="TimeLeftBox">
                        <h3>Opening hours and contact details</h3>
                        <h4>Opening hours</h4>
                        <ul className="TimeList">
                          {Object.entries(timeSlots).map(([day, times], index) => (
                            <li key={index}>
                              <div className="DaySec">{day}:</div>
                              <div className="TimeSec">{formatTimeRange(times)}</div>
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
              <div className="PanelBodyLftBox">
                <div className="PanelBodyLftBoxAdio NoBdr">
                  <h3>Legal information</h3>
                  <div className="InfoBox">
                    <h4>RPPS Number</h4>
                    <p>{allDetails?.users?.rpps_no}</p>
                  </div>
                </div>
              </div>
              <div className="PanelBodyLftBox">
                <div className="PanelBodyLftBoxAdio NoBdr">
                  <button className={showModal23 ? "FAQBtn active" : "FAQBtn"} onClick={toggleModal23}>
                    Frequently Asked Question
                  </button>
                  {showModal23 && (
                    <div className="accordion">
                      {allDetails?.doctor_faqs.map((item, index) => (
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
                </div>
              </div>
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DoctorDetails;
