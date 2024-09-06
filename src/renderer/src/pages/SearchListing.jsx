import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import CustomCalendar from "../components/CustomCalendar";
import profileImageOpenSrc from "../assets/images/calendaravailability.svg";
import profileImageClosedSrc from "../assets/images/calendaravailability1.svg";
import StarIcon from "../assets/images/StarIcon.svg";
import docimg from "../assets/images/DocImg.png";
import locationD from "../assets/images/locationD.svg";
import dollarD from "../assets/images/dollarD.svg";
import calIcon from "../assets/images/calIcon.svg";
import calIconGrey from "../assets/images/calIconGrey.svg";
import {useUserContext} from "../context/UserContext";
import Afterloginheader from "../components/MainHeader/Afterloginheader";
import Header from "../components/MainHeader/Mainheader";
import {searchDoctorListApi} from "../services/apiService";
import {toast} from "react-toastify";
import {IMAGE_URL} from "../app_url";
import {format} from "date-fns";
import {GoogleMap, InfoWindow, Marker} from "@react-google-maps/api";
import ReactPaginate from "react-paginate";
import NoImage from "../assets/images/no-image-avatar.png";
import LoadingPage from "../components/LoadingPage";
import {useGoogleMapContext} from "../context/GoogleMapContext";
import DocNoFoundIcon from "../assets/images/Doc-not-Found.svg";

const SearchListing = () => {
  const {userData, searchValuesContext, setSearchValuesContext} = useUserContext();
  const {isLoaded} = useGoogleMapContext();
  const doctorRefs = useRef([]);

  const containerStyle = {
    height: "100%",
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(true);
  const [screenLoading, setScreenLoading] = useState(true);
  const [doctorList, setDoctorList] = useState();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [allDoctorCords, setAllDoctorCords] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 1.7546201, lng: 3.5555});
  const [filterValues, setFilterValues] = useState("1");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [allDetails, setAllDetails] = useState(null);
  const [perPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);
  const [appointmentAlreadyBooked, setAppointmentAlreadyBooked] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsImageOpen(!isImageOpen);
  };

  const searchDoctorList = async (filterValue, pageCount) => {
    try {
      setScreenLoading(true);
      const fd = new FormData();
      fd.append("search", searchValuesContext?.specialityName ? searchValuesContext?.specialityName : "");
      fd.append("search_filter", filterValue);
      fd.append("per_page", perPage);
      fd.append("page", pageCount ? pageCount : "1");
      if (searchValuesContext?.lat && searchValuesContext?.lng) {
        fd.append("lat", searchValuesContext?.lat ? searchValuesContext?.lat : "");
        fd.append("lng", searchValuesContext?.lng ? searchValuesContext?.lng : "");
      }
      let response = await searchDoctorListApi(fd);
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data);
          setDoctorList(response.data.doctors);
          let tempCords = [];
          if (response.data.doctors.length > 0) {
            response.data.doctors.map(item => {
              tempCords.push({
                id: item?.user_id,
                lat: Number(item?.lat),
                lng: Number(item?.lng),
                first_name: item?.first_name,
                last_name: item?.last_name,
                speciality: item?.speciality,
                profile_pic: item?.profile_pic,
              });
            });
          }
          if (tempCords.length > 0) {
            setMapCenter(tempCords[0]);
          }
          setAllDoctorCords(tempCords);
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

  const handleSelectEvent = event => {
    if (!userData) {
      // setShowLoginPopup(true);
      navigate("/patient/login", {state: {from: location.pathname}});
      toast.warning("Please login to book appointment.", {autoClose: 1500});
    } else {
      let tempSearchValue = {...searchValuesContext};
      navigate("/appointment-booking", {state: {from: location.pathname}});
      tempSearchValue.selectedAppDate = format(event.start, "yyyy-MM-dd");
      tempSearchValue.selectedAppTime = event?.title;
      tempSearchValue.user_id = event?.doctorId;
      sessionStorage.setItem("tabibookHomeSearchValue", JSON.stringify(tempSearchValue));
      setSearchValuesContext(tempSearchValue);
    }
  };

  const handleBookAppointment = doctorItem => {
    if (!userData) {
      // setShowLoginPopup(true);
      navigate("/patient/login", {state: {from: location.pathname}});
      toast.warning("Please login to book appointment.", {autoClose: 1500});
    } else {
      let tempSearchValue = {...searchValuesContext};
      navigate("/appointment-booking");
      tempSearchValue.type = "doctor";
      tempSearchValue.slug = doctorItem?.slug;
      tempSearchValue.user_id = doctorItem?.user_id;
      sessionStorage.setItem("tabibookHomeSearchValue", JSON.stringify(tempSearchValue));
      setSearchValuesContext(tempSearchValue);
    }
  };

  const handleMarkerClick = cord => {
    setSelectedDoctor(cord);
    const index = doctorList.findIndex(doctor => doctor.user_id === cord.id);
    if (index !== -1 && doctorRefs.current[index]) {
      doctorRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    // setSelectedMarker(cord);
  };

  const handleCloseClick = () => {
    setSelectedDoctor(null);
  };

  const handlePageClick = event => {
    // console.log(event)
    setCurrentPage(event.selected);
    searchDoctorList(filterValues, Number(event.selected + 1));
  };

  const handleShowResult = () => {
    searchDoctorList(filterValues);
    setIsDropdownOpen(false);
    setIsImageOpen(true);
  };

  useEffect(() => {
    searchDoctorList(filterValues, 1);
  }, [searchValuesContext]);

  return (
    <div>
      {/* <Listingheader /> */}
      {userData ? (
        <Afterloginheader from={location.pathname} />
      ) : (
        <Header showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup} from={location.pathname} />
      )}
      <div className="FullBox">
        {screenLoading && <LoadingPage />}
        {!screenLoading ? (
          // doctorList?.length > 0 ? (
            <>
              <div className="FullBoxLft">
                <div className="FullBoxLftTop">
                  <div className="fbltopleft">
                    <h5>Search Result ({allDetails?.doctors_total})</h5>
                    <p>
                      Find a {searchValuesContext?.specialityName ? searchValuesContext?.specialityName : ""} (or a professional practicing
                      {searchValuesContext?.specialityName ? " " + searchValuesContext?.specialityName : ""}){" "}
                      {searchValuesContext?.placeName ? "in" + searchValuesContext?.placeName + "offering online appointment booking" : ""}.
                    </p>
                  </div>
                  <div className="availability-menu">
                    <div className={`availability-header ${isImageOpen ? "open" : "closed"}`} onClick={toggleDropdown}>
                      <img src={!isImageOpen ? profileImageOpenSrc : profileImageClosedSrc} className="availability-picture" alt="availability" />
                      <span className="availability-name">Availability</span>
                    </div>
                    {isDropdownOpen && (
                      <div className="availability-dropdown-content">
                        <Link
                          className={filterValues === "1" ? "active" : ""}
                          to={"javascript:void(0);"}
                          onClick={() => {
                            setFilterValues("1");
                            // setIsDropdownOpen(false);
                            // setIsImageOpen(true);
                          }}>
                          All
                        </Link>
                        <Link
                          className={filterValues === "2" ? "active" : ""}
                          to={"javascript:void(0);"}
                          onClick={() => {
                            setFilterValues("2");
                            // setIsDropdownOpen(false);
                            // setIsImageOpen(true);
                          }}>
                          Available today
                        </Link>
                        <Link
                          className={filterValues === "3" ? "last-child active" : "last-child"}
                          to={"javascript:void(0);"}
                          onClick={() => {
                            setFilterValues("3");
                            // setIsDropdownOpen(false);
                            // setIsImageOpen(true);
                          }}>
                          Available up to next 3 days
                        </Link>
                        <span className="avaBtngrp">
                          <button className="showr-button" onClick={() => handleShowResult()}>
                            Show result
                          </button>
                          <button className="clearf-button" onClick={() => setFilterValues("1")}>
                            Clear this filter
                          </button>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {doctorList?.length > 0 ? (
                  <div className="FullBoxLftBottom">
                    <ul>
                      {doctorList?.map((item, index) => (
                        <li key={index} ref={el => (doctorRefs.current[index] = el)}>
                          <div className="Searchinfo">
                            <div className="SearchinfoLft">
                              <div className="Searchinfobox" key={index}>
                                <div className="BodyTopLftDocinfo">
                                  <div className="DocinfoImg">
                                    <img src={item?.profile_pic ? IMAGE_URL + item?.profile_pic : NoImage} alt="" />
                                  </div>
                                  <div className="DocinfoTxt">
                                    <h2>
                                      Dr {item?.first_name} {item?.last_name}
                                    </h2>
                                    <p>{item?.speciality}</p>
                                    <span className="DocinfoRating">
                                      <img src={StarIcon} alt="" /> 0
                                    </span>
                                  </div>
                                </div>
                                <h5>
                                  <img src={locationD} alt="" />
                                  {item?.cabin_address}
                                </h5>
                                {/* <h5>
                                <img src={dollarD} alt="" />
                                Sector 1 approved
                              </h5> */}
                                {Number(item?.types) !== 1 ? (
                                  <button className="Dbooka" onClick={() => handleBookAppointment(item)}>
                                    Book Appointment
                                  </button>
                                ) : null}
                                {Number(item?.consultation_type) === 2 ? <div className="CalenderOverlay bgWhite"></div> : null}
                              </div>
                            </div>
                            <div className="SearchinfoRgt">
                              {/* <WeeklyCalendar /> */}
                              <CustomCalendar
                                key={index}
                                doctorId={item?.user_id}
                                handleSelectEvent={handleSelectEvent}
                                consultationType={Number(item?.consultation_type)}
                                types={Number(item?.types)}
                                setAppointmentAlreadyBooked={setAppointmentAlreadyBooked}
                                allDocDetails={item}
                              />
                              {/* {item?.consultation_type === 2 ? (
                                <div className="CalenderOverlay bgWhite">
                                  <button className="OverlayBtn" onClick={() => alert()}>
                                    <img src={calIconGrey} alt="" /> */}
                              {/* <img src={calIcon} alt="" /> */}
                              {/* No online availability */}
                              {/* Next meeting on July 1, 2024 */}
                              {/* </button>
                                </div>
                              ) : null} */}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="FullBoxLftBottom">
                    <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
                      <img src={DocNoFoundIcon} alt="" />
                      <h4>We couldn’t find any doctors</h4>
                      <p>It looks like we couldn’t find any doctors matching your search criteria. Please try again or adjust your search criteria.</p>
                    </div>
                  </div>
                )}

                {Math.ceil(allDetails?.doctors_total / perPage) > 1 ? (
                  <div className="stepper-container">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="&#10095;"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={Math.ceil(allDetails?.doctors_total / perPage)}
                      previousLabel="&#10094;"
                      renderOnZeroPageCount={null}
                      forcePage={currentPage}
                    />
                  </div>
                ) : null}
              </div>
              <div className="FullBoxRgt">
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={6} options={{streetViewControl: false, mapTypeControl: false}}>
                    <>
                      {allDoctorCords.map((cord, index) => (
                        <Marker key={index} onClick={() => handleMarkerClick(cord)} position={{lat: cord.lat, lng: cord.lng}}>
                          {selectedDoctor && selectedDoctor.lat === cord.lat && selectedDoctor.lng === cord.lng && (
                            <InfoWindow position={{lat: selectedDoctor?.lat, lng: selectedDoctor?.lng}} onCloseClick={handleCloseClick}>
                              <div className="MarkarInfoDetails">
                                <div className="BodyTopLftDocinfo">
                                  <div className="DocinfoImg">
                                    <img src={selectedDoctor?.profile_pic ? IMAGE_URL + selectedDoctor?.profile_pic : NoImage} />
                                  </div>
                                  <div className="DocinfoTxt">
                                    <h2>
                                      Dr {selectedDoctor?.first_name} {selectedDoctor?.last_name}
                                    </h2>
                                    <p>{selectedDoctor?.speciality}</p>
                                    <span className="DocinfoRating">
                                      <img src={StarIcon} alt="" /> 0
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </InfoWindow>
                          )}
                        </Marker>
                      ))}
                    </>
                  </GoogleMap>
                ) : (
                  <></>
                )}
              </div>
            </>
          // ) : (
          //   filterValues === 1 && (
          //     <>
          //       <div className="RightMyAppointtBox RightMyAppointtBoxBlank">
          //         <img src={DocNoFoundIcon} alt="" />
          //         <h4>We couldn’t find any doctors</h4>
          //         <p>It looks like we couldn’t find any doctors matching your search criteria. Please try again or adjust your search criteria.</p>
          //       </div>
          //     </>
          //   )
          // )
        ) : null}
      </div>
    </div>
  );
};

export default SearchListing;
