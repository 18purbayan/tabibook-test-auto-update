import React, {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Autocomplete} from "@react-google-maps/api";
import {searchDoctorApi} from "../services/apiService";
import "./Searchfilter.scss";
import NoImage from "../assets/images/no-image-avatar.png";
import {IMAGE_URL} from "../app_url";
import {toast} from "react-toastify";
import {useGoogleMapContext} from "../context/GoogleMapContext";
import {CircularProgress} from "@mui/material";
import {useUserContext} from "../context/UserContext";

const Searchfilter = props => {
  const {isLoaded} = useGoogleMapContext();
  const {searchValuesContext, setSearchValuesContext} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [showList, setShowList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [autocompleteCity, setAutocompleteCity] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchType, setSearchType] = useState();
  const [searchItem, setSearchItem] = useState();
  const [autocompleteSelectedData, setAutocompleteSelectedData] = useState();

  // const specialties = ["Gastro-entérologue et hépatologue", "Anneau gastrique", "Ballon gastrique", "Gastroscopie", "Plicature gastrique endoscopique"];

  // const doctors = [
  //   {
  //     name: "Dr Jérôme GAS",
  //     title: "Chirurgien urologue - Montauban",
  //     image: doctor1,
  //   },
  //   {
  //     name: "M. Emmanuel GAS",
  //     title: "Ostéopathe - Bons-en-Chablais",
  //     image: doctor2,
  //   },
  //   {
  //     name: "M. Vivien GAS",
  //     title: "Ostéopathe - Romagnat",
  //     image: doctor3,
  //   },
  //   {
  //     name: "Dr. Karl Tchirikhtchian",
  //     title: "Gastroenterologist",
  //     image: doctor4,
  //   },
  // ];

  const cities = ["Paris", "Pads", "Park", "Pahh", "London", "New York", "Tokyo", "Sydney", "Berlin", "Madrid", "Rome", "Tokyo", "Sydney", "Berlin", "Madrid"];

  const handleApiLoad = () => {
    setApiLoaded(true);
  };

  const handleSearchTextChange = event => {
    setSearchTerm(event.target.value);
    setShowList(event.target.value.length > 0);

    // Clear the existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout for debouncing
    const newTimeoutId = setTimeout(() => {
      fetchDoctors(event.target.value);
    }, 300);

    // Store the timeout ID
    setTimeoutId(newTimeoutId);
  };

  const handleCitySearch = event => {
    setCitySearchTerm(event.target.value);
    // setShowCityList(event.target.value.length > 0);
  };

  const handleInputFocus = () => {
    setShowList(searchTerm.length > 0);
  };

  const handleCityInputFocus = () => {
    setShowCityList(citySearchTerm.length > 0);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowList(false);
    }, 200); // Delay to allow item selection before hiding
  };

  const handleCityInputBlur = () => {
    setTimeout(() => {
      setShowCityList(false);
    }, 200); // Delay to allow item selection before hiding
  };

  const handleItemClick = (item, type) => {
    let tempSearchValue = {};
    setSearchType(type);
    if (type === "doctor") {
      setSearchItem(item);
      setSearchTerm(item?.first_name + " " + item?.last_name);
      navigate("/search/doctor-details/" + item?.slug);
      tempSearchValue.type = "doctor";
      tempSearchValue.slug = item?.slug;
      tempSearchValue.user_id = item?.user_id;
      tempSearchValue.types = item?.types;
      sessionStorage.setItem("tabibookHomeSearchValue", JSON.stringify(tempSearchValue));
      setSearchValuesContext(tempSearchValue);
      setSearchLoad(false);
    } else {
      setSearchTerm(item?.name);
      setSearchItem(item);
      // navigate("/search-listing");
    }
    setShowList(false);
  };

  const handleCityItemClick = item => {
    setCitySearchTerm(item);
    setShowCityList(false);
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const filteredSpecialties = specialties.filter(specialty => specialty.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredDoctors = doctors.filter(doctor =>
    doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase() || doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCities = cities.filter(city => city.toLowerCase().includes(citySearchTerm.toLowerCase()));

  const handlesearch = () => {
    let tempSearchValue = {...searchValuesContext};
    if (!searchTerm && !citySearchTerm) {
      toast.warn("Please enter serach values.", {autoClose: 1500});
    } else {
      if (autocompleteSelectedData) {
        tempSearchValue.lat = autocompleteSelectedData.geometry.location.lat();
        tempSearchValue.lng = autocompleteSelectedData.geometry.location.lng();
        tempSearchValue.placeName = autocompleteSelectedData.name;
      }
      navigate("/search-listing");
      if (!searchType) {
        if (specialties.length > 0) {
          tempSearchValue.type = "speciality";
          if (specialties[0]?.name) {
            tempSearchValue.specialityName = specialties[0]?.name;
          }
          if (specialties[0]?.id) {
            tempSearchValue.specialityId = specialties[0]?.id;
          }
          if (autocompleteSelectedData) {
            tempSearchValue.lat = autocompleteSelectedData.geometry.location.lat();
            tempSearchValue.lng = autocompleteSelectedData.geometry.location.lng();
            tempSearchValue.placeName = autocompleteSelectedData.name;
          }
          navigate("/search-listing");
        } else if (doctors.length > 0) {
          tempSearchValue.type = "doctor";
          tempSearchValue.slug = doctors[0]?.slug;
          tempSearchValue.user_id = doctors[0]?.user_id;
          tempSearchValue.types = doctors[0]?.types;
          navigate("/search/doctor-details/" + doctors[0]?.slug);
        } else {
        }
      } else if (searchType === "doctor") {
        tempSearchValue.type = "doctor";
        tempSearchValue.slug = searchItem?.slug;
        tempSearchValue.user_id = searchItem?.user_id;
        tempSearchValue.types = searchItem?.types;
        navigate("/search/doctor-details/" + searchItem?.slug);
      } else {
        tempSearchValue.type = "speciality";
        if (searchItem?.name) {
          tempSearchValue.specialityName = searchItem?.name;
        }
        if (searchItem?.id) {
          tempSearchValue.specialityId = searchItem?.id;
        }
        if (autocompleteSelectedData) {
          tempSearchValue.lat = autocompleteSelectedData.geometry.location.lat();
          tempSearchValue.lng = autocompleteSelectedData.geometry.location.lng();
          tempSearchValue.placeName = autocompleteSelectedData.name;
        }
        navigate("/search-listing");
      }
      sessionStorage.setItem("tabibookHomeSearchValue", JSON.stringify(tempSearchValue));
      setSearchValuesContext(tempSearchValue);
    }
    setSearchLoad(false);
  };

  const onCityLoad = autocompleteCityInstance => {
    setAutocompleteCity(autocompleteCityInstance);
  };

  const onCityPlaceChanged = () => {
    if (autocompleteCity) {
      const place = autocompleteCity.getPlace();
      if (place.geometry) {
        setAutocompleteSelectedData(place);
        // setLat(place.geometry.location.lat());
        // setLng(place.geometry.location.lng());
        setCitySearchTerm(place.name || "");
      }
    }
  };

  const fetchDoctors = async value => {
    try {
      setSearchLoad(true);
      let formData = new FormData();
      formData.append("search", value ? value : "");
      let response = await searchDoctorApi(formData);
      if (response) {
        if (response.data.res === true) {
          setSpecialties(response.data.speciality);
          setDoctors(response.data.doctors);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setSearchLoad(false);
    } catch (error) {
      setSearchLoad(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  useEffect(() => {
    if (location.pathname == "/") {
      setSearchValuesContext(null);
    } else {
      if (searchValuesContext) {
        setSearchTerm(searchValuesContext?.specialityName);
        setSearchType(searchValuesContext.type);
        // fetchDoctors(searchValuesContext.placeName);
        // if (searchValuesContext.type === "speciality") {
        if (searchValuesContext.placeName) {
          setCitySearchTerm(searchValuesContext.placeName);
        }
        // }
      }
    }
  }, []);

  return (
    <div>
      <div className="research-form">
        <div className="input-group fter">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Name, specialty, establishment..."
              value={searchTerm}
              onChange={handleSearchTextChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="filtterInput"
            />
            {searchLoad ? (
              <div className="serach-loader">
                <CircularProgress size={20} />
              </div>
            ) : null}

            {showList && (
              <div className="search-results">
                {specialties?.length > 0 || doctors?.length > 0 ? (
                  <>
                    <ul className="specialty-list">
                      {specialties.map((specialty, index) => (
                        <li key={index} onClick={() => handleItemClick(specialty, "specialty")}>
                          {highlightText(specialty.name, searchTerm)}
                        </li>
                      ))}
                    </ul>
                    <ul className="doctor-list">
                      {doctors.map((doctor, index) => (
                        <li key={index} onClick={() => handleItemClick(doctor, "doctor")}>
                          <div className="doctor-box">
                            <img src={doctor.profile_pic ? IMAGE_URL + doctor.profile_pic : NoImage} alt={doctor.first_name} className="doctor-image" />
                            <div className="doctor-info">
                              <p>
                                {doctor.first_name} {doctor.last_name}
                              </p>
                              <small>{doctor.speciality}</small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    {!searchLoad ? (
                      <ul className="specialty-list">
                        <li>No result found.</li>
                      </ul>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="input-group fter loc">
          <div className="city-search-filter">
            {isLoaded ? (
              <Autocomplete onLoad={onCityLoad} onPlaceChanged={onCityPlaceChanged} options={{componentRestrictions: {country: "DZ"}}}>
                <input
                  type="text"
                  placeholder="Location"
                  value={citySearchTerm}
                  onChange={handleCitySearch}
                  onFocus={handleCityInputFocus}
                  onBlur={handleCityInputBlur}
                  className="filtterInput loc"
                />
              </Autocomplete>
            ) : (
              <></>
            )}
            {/* <input
                type="text"
                placeholder="Location"
                value={citySearchTerm}
                onChange={handleCitySearch}
                onFocus={handleCityInputFocus}
                onBlur={handleCityInputBlur}
                className="filtterInput loc"
              />
              {showCityList && (
                <div className="search-results">
                  <ul className="city-list">
                    {filteredCities.map((city, index) => (
                      <li key={index} onClick={() => handleCityItemClick(city)}>
                        {highlightText(city, citySearchTerm)}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
          </div>
        </div>
        <button type="submit" className="research-button" onClick={handlesearch}>
          To research
        </button>
      </div>
    </div>
  );
};

export default Searchfilter;
