import React, {useState, useRef, useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import DeleteBlueIcon from "../../assets/images/delete-blue-icon.svg";
import {deleteDoctorInfoApi, fetchDoctorInfoApi, getFaqsApi, getLanguagesApi, getSpecialityApi, updateDoctorInfoApi} from "../../services/apiService";
import {useUserContext} from "../../context/UserContext";
import {toast} from "react-toastify";
import {IMAGE_URL} from "../../app_url";
import Skeleton from "react-loading-skeleton";
import {GoogleMap, Marker, Autocomplete} from "@react-google-maps/api";
import LoadingPage from "../../components/LoadingPage";

import PdfImage from "../../assets/images/pdf-image.png";
import {useGoogleMapContext} from "../../context/GoogleMapContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const DoctorCreactProfile = () => {
  const {userData, isActiveDocAcc, setIsActiveDocAcc} = useUserContext();
  const {isLoaded} = useGoogleMapContext();
  const navigate = useNavigate();

  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

  const currentYear = new Date().getFullYear(); // Get the current year
  const startYear = 1970; // Start year for the dropdown options

  //
  const [activeId, setActiveId] = useState("section1");
  const stickyMenuRef = useRef(null);
  const rightContentRef = useRef(null);
  const autocompleteRef = useRef(null);
  // const roxBoxRef = useRef(null); // Reference to the "RoxBox" div
  const [allDetails, setAllDetails] = useState();
  const [specialityList, setSpecialityList] = useState();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [languageList, setLanguageList] = useState();
  const [faqList, setFaqList] = useState();
  const [showInputBox, setShowInputBox] = useState(false);
  const [expertiseList, setExpertiseList] = useState([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [isRateInputVisible, setRateInputVisible] = useState(false);
  const [rateList, setRateList] = useState([]);
  const [newRateAmount, setNewRateAmount] = useState("");
  const [newRateDescription, setNewRateDescription] = useState("");
  const [cabinAddress, setCabinAddress] = useState("");
  const [showTransportDetails, setShowTransportDetails] = useState(false);
  const [isTransportInputVisible, setTransportInputVisible] = useState(false);
  const [transportDetailsList, setTransportDetailsList] = useState([]);
  const [newTransportDetail, setNewTransportDetail] = useState("");
  const [showPublicParking, setShowPublicParking] = useState(false);
  const [isPublicParkingInputVisible, setPublicParkingInputVisible] = useState(false);
  const [publicParkingList, setPublicParkingList] = useState([]);
  const [newPublicParking, setNewPublicParking] = useState("");
  const [showUsefulInformation, setShowUsefulInformation] = useState(false);
  const [isUsefulInformationInputVisible, setUsefulInformationInputVisible] = useState(false);
  const [usefulInformationList, setUsefulInformationList] = useState([]);
  const [newUsefulInformation, setNewUsefulInformation] = useState("");
  const [serviceOverview, setServiceOverview] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [clinicImagePreviews, setClinicImagePreviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [newDegree, setNewDegree] = useState({
    year: "",
    degreeName: "",
    institutionName: "",
  });
  const [courses, setCourses] = useState([]);
  const [newCourses, setNewCourses] = useState({
    year: "",
    trainingCenter: "",
  });
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    fromYear: "",
    toYear: "",
    organizationName: "",
    designation: "",
    isCurrentlyWorking: "no",
  });
  const [publications, setPublications] = useState([]); // State to store publication entries
  const [newPublication, setNewPublication] = useState({
    year: "", // Year of the publication
    link: "", // Link to the publication
  });
  // Define an array of consultation options
  const consultationOptions = [
    {id: "1", label: "Video consultation"},
    {id: "2", label: "Cabinet consultation"},
    {id: "0", label: "Both"},
  ];
  const [selectedConsultation, setSelectedConsultation] = useState("0");

  // Define an array of payment method options
  const paymentMethods = [
    {id: "1", label: "Only cash"},
    {id: "2", label: "Only credit card"},
    {id: "0", label: "Both"},
  ];
  const [price, setPrice] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("0");

  const [rppsNumber, setRppsNumber] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseImagePreviewUrl, setLicenseImagePreviewUrl] = useState(null);

  const [expandedFAQIds, setExpandedFAQIds] = useState({});
  const [faqAnswers, setFaqAnswers] = useState({});

  const [saveBtnDis, setSaveBtnDis] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [screenLoadingPage, setScreenLoadingPage] = useState(false);
  const [isPdfLicense, setIsPdfLicense] = useState(false);

  const [savedLanguage, setSavedLanguage] = useState();
  const [savedFaqs, setSavedFaqs] = useState();

  const [autocompleteCity, setAutocompleteCity] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const sectionRefs = {
    section1: useRef(null),
    section2: useRef(null),
    section3: useRef(null),
    section4: useRef(null),
    section5: useRef(null),
    section6: useRef(null),
    section7: useRef(null),
    section8: useRef(null),
    section9: useRef(null),
    section10: useRef(null),
    section11: useRef(null),
    section12: useRef(null),
    section13: useRef(null),
    section14: useRef(null),
    section15: useRef(null),
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 36.737232,
    lng: 3.086472,
  };

  const [selectedLocation, setSelectedLocation] = useState(center);

  const handleClick = async event => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({lat, lng});

    // Make a request to the Geocoding API to get the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.status === "OK") {
        const results = response.data.results;
        if (results.length > 0) {
          const formattedAddress = results[0].formatted_address;
          setCabinAddress(formattedAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleDragEnd = async event => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({lat, lng});

    // Make a request to the Geocoding API to get the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.status === "OK") {
        const results = response.data.results;
        if (results.length > 0) {
          const formattedAddress = results[0].formatted_address;
          setCabinAddress(formattedAddress);
          // setAddress(formattedAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleConfirm = () => {
    // onSelectLocation(selectedLocation);
    // onClose();
  };

  const handleApiLoad = () => {
    setApiLoaded(true);
  };

  const handleMenuClick = id => {
    setActiveId(id);
    sectionRefs[id].current.scrollIntoView({behavior: "smooth"});
  };

  const handleScroll = () => {
    const sections = Object.keys(sectionRefs);
    let lastSectionInView = false;
    let isSectionActive = false;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const ref = sectionRefs[section].current;
      if (ref) {
        // Check if ref is not null
        const rect = ref.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top <= windowHeight / 2 && rect.bottom > windowHeight / 2) {
          setActiveId(section);
          isSectionActive = true;
        }

        // Check if the last section is in view
        if (section === "section15" && rect.bottom <= windowHeight) {
          lastSectionInView = true;
        }
      }
    }

    // If the last section is in view, activate the last menu item
    if (!isSectionActive && lastSectionInView) {
      setActiveId("section15");
    }
  };

  const handleStickyMenu = () => {
    if (stickyMenuRef.current && rightContentRef.current) {
      const sticky = stickyMenuRef.current.offsetTop;
      if (window.pageYOffset > sticky) {
        stickyMenuRef.current.classList.add("fixed");
        rightContentRef.current.classList.add("fixed-right");
      } else {
        stickyMenuRef.current.classList.remove("fixed");
        rightContentRef.current.classList.remove("fixed-right");
      }
    }
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

  const getLanguages = async () => {
    try {
      let response = await getLanguagesApi();
      if (response) {
        if (response.data.res === true) {
          setLanguageList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getFaqs = async () => {
    try {
      let response = await getFaqsApi();
      if (response) {
        if (response.data.res === true) {
          setFaqList(response.data.data);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  const getDoctorInfo = async () => {
    try {
      setScreenLoading(true);
      setIsMapVisible(false);
      let response = await fetchDoctorInfoApi();
      if (response) {
        if (response.data.res === true) {
          setAllDetails(response.data.data);
          setSelectedSpecialty(response.data.data.users.speciality);

          setExpertiseList(response.data.data.users.doctor_experts);

          const tempRateList = response.data.data.users.doctor_consultations.map(item => ({
            id: item.id,
            description: item.consultation,
            amount: item.fees,
          }));
          setRateList(tempRateList);

          setCabinAddress(response.data.data.users.cabin_address);
          setSelectedLocation({
            lat: response.data.data.users.lat ? Number(response.data.data.users.lat) : 36.737232,
            lng: response.data.data.users.lng ? Number(response.data.data.users.lng) : 3.086472,
          });

          if (response.data.data.users.doctor_transports.length > 0) {
            setShowTransportDetails(true);
            setTransportDetailsList(response.data.data.users.doctor_transports);
          }

          if (response.data.data.users.doctor_parkings.length > 0) {
            setShowPublicParking(true);
            setPublicParkingList(response.data.data.users.doctor_parkings);
          }

          if (response.data.data.users.doctor_informations.length > 0) {
            setShowUsefulInformation(true);
            setUsefulInformationList(response.data.data.users.doctor_informations);
          }

          setServiceOverview(response.data.data.users.service_description);

          if (response.data.data.users.profile_pic) {
            setProfilePictureSrc(IMAGE_URL + response.data.data.users.profile_pic);
          }

          if (response.data.data.users.doctor_documents?.length > 0) {
            let tempImgs = [];
            response.data.data.users.doctor_documents.map(item => {
              tempImgs.push({id: item.id, previewSrc: IMAGE_URL + item.documents});
            });
            setClinicImagePreviews(tempImgs);
          }

          if (response.data.data.doctor_languages?.length > 0) {
            setSavedLanguage(response.data.data.doctor_languages);
            let tempLangs = [];
            response.data.data.doctor_languages.map(item => {
              tempLangs.push({id: item?.id, language_id: item.language_id, name: item.name});
            });
            setSelectedOptions(tempLangs);
          }

          if (response.data.data.users.doctor_degrees?.length > 0) {
            let tempCourse = [];
            response.data.data.users.doctor_degrees.map(item => {
              tempCourse.push({id: item.id, year: item.year, degreeName: item.degree, institutionName: item.university});
            });
            setDegrees(tempCourse);
          }

          if (response.data.data.users.doctor_trainings?.length > 0) {
            let tempTraining = [];
            response.data.data.users.doctor_trainings.map(item => {
              tempTraining.push({id: item.id, year: item.year, trainingCenter: item.center_name});
            });
            setCourses(tempTraining);
          }

          if (response.data.data.users.doctor_experiences?.length > 0) {
            let tempExp = [];
            response.data.data.users.doctor_experiences.map(item => {
              tempExp.push({
                id: item.id,
                fromYear: item.from_year,
                toYear: item.to_year,
                organizationName: item.org_name,
                designation: item.designation,
                isCurrentlyWorking: item.currently_work === 1 ? "yes" : "no",
              });
            });
            setExperiences(tempExp);
          }

          if (response.data.data.users.doctor_publications?.length > 0) {
            let tempPublication = [];
            response.data.data.users.doctor_publications.map(item => {
              tempPublication.push({
                id: item.id,
                year: item.year,
                link: item.links,
              });
            });
            setPublications(tempPublication);
          }

          setSelectedConsultation(response.data.data.users.consultation_type.toString());
          setPrice(response.data.data.users.price_description);
          setSelectedPaymentMethod(response.data.data.users.payment_type.toString());
          setRppsNumber(response.data.data.users.rpps_no);
          if (response.data.data.users.document_license) {
            setLicenseImagePreviewUrl(IMAGE_URL + response.data.data.users.document_license);
            if (response.data.data.users.document_license.endsWith(".pdf")) {
              setIsPdfLicense(true);
            } else {
              setIsPdfLicense(false);
            }
          }

          const initialAnswers = response.data.data.doctor_faqs.reduce((acc, item) => {
            acc[item.faq_id] = item.answer;
            return acc;
          }, {});

          const initialExpanded = response.data.data.doctor_faqs.reduce((acc, item) => {
            acc[item.faq_id] = true;
            return acc;
          }, {});

          setSavedFaqs(response.data.data.doctor_faqs);
          setFaqAnswers(initialAnswers);
          setExpandedFAQIds(initialExpanded);

          const data = response.data.data;
          const users = data.users;
          if (
            !users.speciality ||
            !users.doctor_experts.length ||
            !users.doctor_consultations.length ||
            !users.cabin_address ||
            (users.add_transport === 1 && !(users.doctor_transports.length || users.doctor_parkings.length || users.doctor_informations.length)) ||
            !users.service_description ||
            !users.profile_pic ||
            !users.doctor_documents.length ||
            !users.doctor_degrees.length ||
            !users.doctor_trainings.length ||
            !users.doctor_experiences.length ||
            !users.doctor_publications.length ||
            users.consultation_type === null ||
            !users.price_description ||
            users.payment_type === null ||
            !users.rpps_no ||
            !users.document_license ||
            !data.doctor_faqs.length ||
            !data.doctor_languages.length
          ) {
            setIsActiveDocAcc(false);
            localStorage.setItem("isAciveDoctorAcc", "0");
            setIsEditable(true);
          } else {
            setIsActiveDocAcc(true);
            localStorage.setItem("isAciveDoctorAcc", "1");
            setIsEditable(false);
          }
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  //

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = async option => {
    const tempSavedLang = savedLanguage?.find(opt => opt.language_id === option);

    if (tempSavedLang) {
      if (tempSavedLang.id) {
        try {
          const fd = new FormData();
          fd.append("id", tempSavedLang.id);
          fd.append("types", "language");
          let response = await deleteDoctorInfoApi(fd);
          if (response) {
            if (response.data.res === true) {
              setSavedLanguage(savedLanguage.filter(opt => parseInt(opt.language_id) !== parseInt(option)));
              setSelectedOptions(selectedOptions.filter(item => item.language_id !== option));
              toast.success(response.data.msg, {autoClose: 1500});
            } else {
              toast.error(response.data.msg, {autoClose: 1500});
            }
          }
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
        }
      } else {
      }
      setSavedLanguage(savedLanguage.filter(opt => parseInt(opt.language_id) !== parseInt(option)));
      setSelectedOptions(selectedOptions.filter(opt => parseInt(opt.language_id) !== parseInt(option)));
    } else {
      const optionExists = selectedOptions.some(item => item.language_id === option);

      if (optionExists) {
        setSelectedOptions(selectedOptions.filter(item => item.language_id !== option));
      } else {
        setSelectedOptions([...selectedOptions, {language_id: option}]);
      }
    }
  };

  const handleAddClick = () => {
    setShowInputBox(true);
  };

  // Handle change event for the select input
  const handleSpecialtyChange = event => {
    setSelectedSpecialty(event.target.value);
  };

  const handleSaveClick = () => {
    if (newExpertise.trim()) {
      setExpertiseList([...expertiseList, {expertise: newExpertise}]);
      setNewExpertise("");
      setShowInputBox(false);
    }
  };

  const handleDeleteClick = async (index, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "expertise");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            const updatedList = expertiseList.filter((_, i) => i !== index);
            setExpertiseList(updatedList);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      const updatedList = expertiseList.filter((_, i) => i !== index);
      setExpertiseList(updatedList);
    }
  };

  const handleAddRateClick = () => {
    setRateInputVisible(true);
  };

  const handleSaveRateClick = () => {
    if (newRateAmount.trim() && newRateDescription.trim()) {
      const newRate = {
        description: newRateDescription,
        amount: newRateAmount,
      };
      setRateList([...rateList, newRate]);
      setNewRateAmount("");
      setNewRateDescription("");
      setRateInputVisible(false);
    }
  };

  const handleDeleteRateClick = async (index, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "consultation");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            const updatedRates = rateList.filter((_, i) => i !== index);
            setRateList(updatedRates);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      const updatedRates = rateList.filter((_, i) => i !== index);
      setRateList(updatedRates);
    }
  };

  // Handle address input change
  const handleAddressChange = e => {
    setCabinAddress(e.target.value);
  };

  // Handle radio button change
  const handleTransportDetailsRadioChange = e => {
    setShowTransportDetails(e.target.value === "yes");
  };

  // Handle adding a new transport detail
  const handleAddTransportDetailClick = () => {
    if (newTransportDetail.trim()) {
      setTransportDetailsList([...transportDetailsList, {transport: newTransportDetail}]);
      setNewTransportDetail("");
    }
    setTransportInputVisible(false);
  };

  // Handle deleting a transport detail
  const handleDeleteTransportDetailClick = async (index, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "transport");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            const updatedList = transportDetailsList.filter((_, i) => i !== index);
            setTransportDetailsList(updatedList);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      const updatedList = transportDetailsList.filter((_, i) => i !== index);
      setTransportDetailsList(updatedList);
    }
  };

  const handleAddPublicParkingClick = () => {
    if (newPublicParking.trim()) {
      setPublicParkingList([...publicParkingList, {parking: newPublicParking}]);
      setNewPublicParking("");
    }
    setPublicParkingInputVisible(false);
  };

  const handleDeletePublicParkingClick = async (index, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "parking");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            const updatedList = publicParkingList.filter((_, i) => i !== index);
            setPublicParkingList(updatedList);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      const updatedList = publicParkingList.filter((_, i) => i !== index);
      setPublicParkingList(updatedList);
    }
  };

  const handleAddUsefulInformationClick = () => {
    if (newUsefulInformation.trim()) {
      setUsefulInformationList([...usefulInformationList, {information: newUsefulInformation}]);
      setNewUsefulInformation("");
    }
    setUsefulInformationInputVisible(false);
  };

  const handleDeleteUsefulInformationClick = async (index, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "useful");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            const updatedList = usefulInformationList.filter((_, i) => i !== index);
            setUsefulInformationList(updatedList);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      const updatedList = usefulInformationList.filter((_, i) => i !== index);
      setUsefulInformationList(updatedList);
    }
  };

  // Handle delete language
  const handleDeleteLanguage = async id => {
    // const optionWithId = selectedOptions.find(item => item.language_id === id);
    const tempSavedLang = savedLanguage?.find(opt => opt.language_id === id);
    if (tempSavedLang && tempSavedLang.id) {
      if (tempSavedLang.id) {
        setScreenLoadingPage(true);
        try {
          const fd = new FormData();
          fd.append("id", tempSavedLang.id);
          fd.append("types", "language");
          let response = await deleteDoctorInfoApi(fd);
          if (response) {
            if (response.data.res === true) {
              const updatedLanguages = selectedLanguages.filter(item => item.id !== id);
              setSelectedLanguages(updatedLanguages);
              setSelectedOptions(selectedOptions.filter(item => item.language_id !== id));
              toast.success(response.data.msg, {autoClose: 1500});
            } else {
              toast.error(response.data.msg, {autoClose: 1500});
            }
          }
          setScreenLoadingPage(false);
        } catch (error) {
          setScreenLoadingPage(false);
          console.error(error);
          toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
        }
      }
    } else {
      setSelectedOptions(selectedOptions.filter(item => item.language_id !== id));
    }
  };

  // Update selected languages based on selected options
  const updateSelectedLanguages = () => {
    if (languageList?.length > 0) {
      const newSelectedLanguages = languageList.filter(item => selectedOptions.some(option => option.language_id === item.id));

      // Check if selectedOptions contains any language_id present in languageList
      const languageIdExists = selectedOptions.some(option => languageList.some(lang => lang.id === option.language_id));

      // if (languageIdExists) {
      //   alert('Some selected languages have matching language_ids.');
      // }
      setSelectedLanguages(newSelectedLanguages);
    }
  };

  // Handle file input change
  const handleProfilePictureChange = event => {
    const file = event.target.files[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.warn("Invalid file type. Please upload an image file (JPEG, PNG, GIF).", {autoClose: 1500});
        return;
      }
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        setProfilePictureSrc(fileReader.result); // Update state with the image data URL
      };

      fileReader.readAsDataURL(file); // Read the file as a data URL
      setProfilePictureFile(file); // Store the file object
    }
  };

  // Handle profile file delete
  const handleDeleteProPicFile = async () => {
    try {
      setScreenLoadingPage(true);
      const fd = new FormData();
      fd.append("types", "profile");
      let response = await deleteDoctorInfoApi(fd);
      if (response) {
        if (response.data.res === true) {
          setProfilePictureSrc(null);
          setProfilePictureFile(null);
          toast.success(response.data.msg, {autoClose: 1500});
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setScreenLoadingPage(false);
    } catch (error) {
      setScreenLoadingPage(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  // Handle file input change
  const handleClinicImageChange = event => {
    const MAX_IMAGES = 5;
    const files = Array.from(event.target.files);
    const newImagePreviews = [];

    if (clinicImagePreviews.length + files.length > MAX_IMAGES) {
      toast.warn(`You can only upload up to ${MAX_IMAGES} images.`, {autoClose: 1500});
      return;
    }

    files.forEach(file => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.warn("Invalid file type. Please upload an image file (JPEG, PNG, GIF).", {autoClose: 1500});
        return;
      }

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        newImagePreviews.push({
          previewSrc: fileReader.result,
          fileObject: file,
        });

        // Update the state once all files are processed
        if (newImagePreviews.length === files.length) {
          setClinicImagePreviews(prevImages => [...prevImages, ...newImagePreviews]);
        }
      };

      fileReader.readAsDataURL(file);
    });
  };

  // Handle image delete
  const handleDeleteClinicImage = async (fileToDelete, id) => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "document");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setClinicImagePreviews(prevImages => prevImages.filter(image => image.id !== id));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setClinicImagePreviews(prevImages => prevImages.filter(image => image.fileObject !== fileToDelete));
    }
  };

  const handleDegreeChange = e => {
    const {name, value} = e.target;
    setNewDegree(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddDegree = () => {
    if (!newDegree.year || !newDegree.degreeName || !newDegree.institutionName) {
      toast.warn("All fields are required to add degree.", {autoClose: 1500});
      return;
    }

    // Add the new degree to the list and reset the form
    setDegrees(prevDegrees => [...prevDegrees, newDegree]);
    setNewDegree({
      year: "",
      degreeName: "",
      institutionName: "",
    });
  };

  const handleRemoveDegree = async (index, id) => {
    if (id) {
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "degree");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setDegrees(prevDegrees => prevDegrees.filter((_, i) => i !== index));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setDegrees(prevDegrees => prevDegrees.filter((_, i) => i !== index));
    }
  };

  const handleCourseChange = e => {
    const {name, value} = e.target;
    setNewCourses(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCourses = () => {
    // Validate fields
    if (!newCourses.year || !newCourses.trainingCenter) {
      toast.warn("All fields are required to add course.", {autoClose: 1500});
      return;
    }

    // Add the new experience to the list and reset the form
    setCourses(prevExperiences => [...prevExperiences, newCourses]);
    setNewCourses({
      year: "",
      trainingCenter: "",
    });
  };

  const handleRemoveCourse = async (index, id) => {
    if (id) {
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "training");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setCourses(prevExperiences => prevExperiences.filter((_, i) => i !== index));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setCourses(prevExperiences => prevExperiences.filter((_, i) => i !== index));
    }
  };

  const handleExperienceChange = e => {
    const {name, value} = e.target;

    setNewExperience(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddExperience = () => {
    // Validate fields
    if (!newExperience.fromYear || !newExperience.toYear || !newExperience.organizationName || !newExperience.designation) {
      toast.warn("All fields are required to add experience.", {autoClose: 1500});
      return;
    }

    // Validate that start year is not greater than end year
    if (parseInt(newExperience.fromYear, 10) >= parseInt(newExperience.toYear, 10)) {
      toast.warn("Start year cannot be greater than or equal to end year.", {autoClose: 1500});
      return;
    }

    // Add the new experience to the list and reset the form
    setExperiences(prevExperiences => [...prevExperiences, newExperience]);
    setNewExperience({
      fromYear: "",
      toYear: "",
      organizationName: "",
      designation: "",
      isCurrentlyWorking: "no",
    });
  };

  const handleRemoveExperience = async (index, id) => {
    if (id) {
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "experience");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setExperiences(prevExperiences => prevExperiences.filter((_, i) => i !== index));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setExperiences(prevExperiences => prevExperiences.filter((_, i) => i !== index));
    }
  };

  // Handle changes in the input fields
  const handlePublicationChange = e => {
    const {name, value} = e.target;
    setNewPublication(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add a new publication to the list
  const handleAddPublication = () => {
    const {year, link} = newPublication;

    // Validate fields
    if (!year || !link) {
      toast.warn("All fields are required to add publication.", {autoClose: 1500});
      return;
    }

    // Add the new publication to the list and reset the form
    setPublications(prevPublications => [...prevPublications, newPublication]);
    setNewPublication({
      year: "",
      link: "",
    });
  };

  // Remove a publication from the list
  const handleRemovePublication = async (index, id) => {
    if (id) {
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "publication");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setPublications(prevPublications => prevPublications.filter((_, i) => i !== index));
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setPublications(prevPublications => prevPublications.filter((_, i) => i !== index));
    }
  };

  // Handle radio button change
  const handleConsultationChange = event => {
    setSelectedConsultation(event.target.value);
  };

  // Handle price change
  const handlePriceChange = event => {
    setPrice(event.target.value);
  };

  // Handle payment method change
  const handlePaymentMethodChange = event => {
    setSelectedPaymentMethod(event.target.value);
  };

  // Handle RPPS number change
  const handleRppsNumberChange = event => {
    setRppsNumber(event.target.value);
  };

  // Handle file input change
  const handleLicenseFileChange = event => {
    const TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    const file = event.target.files[0];
    if (file) {
      if (!TYPES.includes(file.type)) {
        toast.warn("Invalid file type. Please upload an image file (JPEG, PNG, GIF) or a PDF file.", {autoClose: 1500});
        return;
      }
      if (file.type === "application/pdf") {
        setIsPdfLicense(true);
      } else {
        setIsPdfLicense(false);
      }
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        setLicenseImagePreviewUrl(fileReader.result); // Update state with the image data URL
      };

      fileReader.readAsDataURL(file); // Read the file as a data URL
      setLicenseFile(file); // Store the file object
    }
  };

  // Handle file removal
  const handleFileRemove = async () => {
    if (!licenseFile) {
      try {
        setScreenLoadingPage(true);
        const fd = new FormData();
        fd.append("types", "license");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            setLicenseFile(null);
            setLicenseImagePreviewUrl(null);
            toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
      setLicenseFile(null);
      setLicenseImagePreviewUrl(null);
    }
  };

  // Toggle FAQ item visibility
  const toggleFAQVisibility = faqId => {
    let tempObj = {...expandedFAQIds};
    let tempSavedArray = [...savedFaqs];
    tempObj[faqId] = !tempObj[faqId];
    if (!tempObj[faqId]) {
      let item = tempSavedArray?.find(value => parseInt(value.faq_id) === parseInt(faqId));
      if (item) {
        item.isDeleted = true;
      }
    } else {
      let item = tempSavedArray?.find(value => parseInt(value.faq_id) === parseInt(faqId));
      if (item) {
        item.isDeleted = false;
      }
    }
    setSavedFaqs(tempSavedArray);
    setExpandedFAQIds(tempObj);
  };

  // Handle answer change
  const handleAnswerChange = (faqId, event) => {
    let tempObj = {...faqAnswers};
    let tempSavedArray = [...savedFaqs];
    tempObj[faqId] = event.target.value;
    if (!tempObj[faqId]) {
      let item = tempSavedArray?.find(value => parseInt(value.faq_id) === parseInt(faqId));
      if (item) {
        item.isDeleted = true;
      }
    } else {
      let item = tempSavedArray?.find(value => parseInt(value.faq_id) === parseInt(faqId));
      if (item) {
        item.isDeleted = false;
      }
    }
    setSavedFaqs(tempSavedArray);
    setFaqAnswers(tempObj);
    // setFaqAnswers(prevState => ({
    //   ...prevState,
    //   [faqId]: event.target.value,
    // }));
  };

  // Handle profile file delete
  const handleDeleteFaq = async id => {
    if (id) {
      setScreenLoadingPage(true);
      try {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("types", "faq");
        let response = await deleteDoctorInfoApi(fd);
        if (response) {
          if (response.data.res === true) {
            // setProfilePictureSrc(null);
            // setProfilePictureFile(null);
            // toast.success(response.data.msg, {autoClose: 1500});
          } else {
            toast.error(response.data.msg, {autoClose: 1500});
          }
        }
        setScreenLoadingPage(false);
      } catch (error) {
        setScreenLoadingPage(false);
        console.error(error);
        toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
      }
    } else {
    }
  };

  const onCityLoad = autocompleteCityInstance => {
    setAutocompleteCity(autocompleteCityInstance);
  };

  const onCityPlaceChanged = () => {
    if (autocompleteCity) {
      const place = autocompleteCity.getPlace();
      if (place.geometry) {
        // console.log(place);
        // console.log(place.geometry.location.lat(), place.geometry.location.lng());
        // setLat(place.geometry.location.lat());
        // setLng(place.geometry.location.lng());
        setCabinAddress(place.formatted_address || "");
      }
    }
    // if (autocompleteCity) {
    //   const place = autocompleteCity.getPlace();
    //   console.log(place);
    //   // Handle the place details here
    //   if (place.formatted_address) {
    //     setCitySearchTerm(place.formatted_address);
    //   }
    // }
  };

  const handleProfileSave = async () => {
    // if (!selectedSpecialty) {
    //   toast.warn("Please select specialization", {autoClose: 1500});
    //   handleMenuClick("section1");
    // } else if (expertiseList?.length === 0) {
    //   toast.warn("Please enter expertise", {autoClose: 1500});
    //   handleMenuClick("section2");
    // } else if (rateList?.length === 0) {
    //   toast.warn("Please enter rate", {autoClose: 1500});
    //   handleMenuClick("section3");
    // } else if (!cabinAddress) {
    //   toast.warn("Please enter cabin address", {autoClose: 1500});
    //   handleMenuClick("section4");
    // } else if (showTransportDetails && transportDetailsList.length === 0 && publicParkingList.length === 0 && usefulInformationList.length === 0) {
    //   toast.warn("Please enter any transport details", {autoClose: 1500});
    //   handleMenuClick("section4");
    // } else if (!serviceOverview) {
    //   toast.warn("Please enter service overview", {autoClose: 1500});
    //   handleMenuClick("section5");
    // } else if (!profilePictureSrc || clinicImagePreviews.length === 0) {
    //   toast.warn("Please select profile and clinic pictures", {autoClose: 1500});
    //   handleMenuClick("section6");
    // } else if (selectedLanguages.length === 0) {
    //   toast.warn("Please select language", {autoClose: 1500});
    //   handleMenuClick("section7");
    // } else if (degrees.length === 0) {
    //   toast.warn("Please enter degree", {autoClose: 1500});
    //   handleMenuClick("section8");
    // } else if (courses.length === 0) {
    //   toast.warn("Please enter courses", {autoClose: 1500});
    //   handleMenuClick("section9");
    // } else if (experiences.length === 0) {
    //   toast.warn("Please enter experiences", {autoClose: 1500});
    //   handleMenuClick("section10");
    // } else if (publications.length === 0) {
    //   toast.warn("Please enter publications", {autoClose: 1500});
    //   handleMenuClick("section11");
    // } else if (!selectedConsultation) {
    //   toast.warn("Please select consultation", {autoClose: 1500});
    //   handleMenuClick("section12");
    // } else if (!price && !selectedPaymentMethod) {
    //   toast.warn("Please enter price details.", {autoClose: 1500});
    //   handleMenuClick("section13");
    // } else if (!rppsNumber) {
    //   toast.warn("Please enter RPPS number.", {autoClose: 1500});
    //   handleMenuClick("section14");
    // } else if (!licenseImagePreviewUrl) {
    //   toast.warn("Please select license.", {autoClose: 1500});
    //   handleMenuClick("section14");
    // } else if (Object.keys(faqAnswers).length === 0) {
    //   toast.warn("Please enter atleast one FAQ answer.", {autoClose: 1500});
    //   handleMenuClick("section15");
    // } else {
    try {
      setSaveBtnDis(true);
      setScreenLoadingPage(true);
      const fd = new FormData();
      fd.append("speciality", selectedSpecialty);
      fd.append("cabin_address", cabinAddress ? cabinAddress : "");
      fd.append("service_description", serviceOverview ? serviceOverview : "");
      fd.append("consultation_type", selectedConsultation);
      fd.append("price_description", price ? price : "");
      fd.append("payment_type", selectedPaymentMethod);
      fd.append("rpps_no", rppsNumber ? rppsNumber : "");
      fd.append("add_transport", showTransportDetails ? "1" : "0");

      if (expertiseList.length > 0) {
        expertiseList
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_experts[${index}][id]`, item.id);
            }
            fd.append(`doctor_experts[${index}][expertise]`, item.expertise);
          });
      }
      if (rateList.length > 0) {
        rateList
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_consultations[${index}][id]`, item.id);
            }
            fd.append(`doctor_consultations[${index}][consultation]`, item.description);
            fd.append(`doctor_consultations[${index}][fees]`, item.amount);
          });
      }
      if (transportDetailsList.length > 0) {
        transportDetailsList
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_transports[${index}][id]`, item.id);
            }
            fd.append(`doctor_transports[${index}][transport]`, item.transport);
          });
      }
      if (publicParkingList.length > 0) {
        publicParkingList
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_parkings[${index}][id]`, item.id);
            }
            fd.append(`doctor_parkings[${index}][parking]`, item.parking);
          });
      }
      if (usefulInformationList.length > 0) {
        usefulInformationList
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_informations[${index}][id]`, item.id);
            }
            fd.append(`doctor_informations[${index}][information]`, item.information);
          });
      }
      if (degrees.length > 0) {
        degrees
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_degrees[${index}][id]`, item.id);
            }
            fd.append(`doctor_degrees[${index}][year]`, item.year);
            fd.append(`doctor_degrees[${index}][degree]`, item.degreeName);
            fd.append(`doctor_degrees[${index}][university]`, item.institutionName);
          });
      }
      if (courses.length > 0) {
        courses
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_trainings[${index}][id]`, item.id);
            }
            fd.append(`doctor_trainings[${index}][year]`, item.year);
            fd.append(`doctor_trainings[${index}][center_name]`, item.trainingCenter);
          });
      }
      if (experiences.length > 0) {
        experiences
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_experiences[${index}][id]`, item.id);
            }
            fd.append(`doctor_experiences[${index}][currently_work]`, item.isCurrentlyWorking === "yes" ? "1" : "0");
            fd.append(`doctor_experiences[${index}][from_year]`, item.fromYear);
            fd.append(`doctor_experiences[${index}][to_year]`, item.toYear);
            fd.append(`doctor_experiences[${index}][org_name]`, item.organizationName);
            fd.append(`doctor_experiences[${index}][designation]`, item.designation);
          });
      }
      if (publications.length > 0) {
        publications
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.id) {
              fd.append(`doctor_publications[${index}][id]`, item.id);
            }
            fd.append(`doctor_publications[${index}][year]`, item.year);
            fd.append(`doctor_publications[${index}][links]`, item.link);
          });
      }
      if (selectedLanguages.length > 0) {
        let prevSavedLangs;
        selectedLanguages
          // .filter(item => !item.id)
          .forEach((item, index) => {
            prevSavedLangs = savedLanguage?.find(langItem => parseInt(langItem.language_id) === parseInt(item.id));
            if (prevSavedLangs) {
              if (item.id) {
                fd.append(`doctor_languages[${index}][id]`, prevSavedLangs.id);
              }
            }

            fd.append(`doctor_languages[${index}][language_id]`, item.id);
          });
      }
      if (Object.keys(faqAnswers).length > 0) {
        Object.entries(faqAnswers).map(([key, value], index) => {
          fd.append(`doctor_faqs[${index}][faq_id]`, key);
          fd.append(`doctor_faqs[${index}][answer]`, value);
        });
      }
      if (profilePictureFile) {
        fd.append(`profile_pic`, profilePictureFile);
      }
      if (licenseFile) {
        fd.append(`document_license`, licenseFile);
      }
      if (clinicImagePreviews.length > 0) {
        clinicImagePreviews
          // .filter(item => !item.id)
          .forEach((item, index) => {
            if (item.fileObject) {
              fd.append(`doctor_documents[${index}]`, item.fileObject);
            }
          });
      }
      let deletedFaqArray = savedFaqs?.filter(item => item.isDeleted === true);

      if (deletedFaqArray.length > 0) {
        deletedFaqArray.forEach(elm => {
          handleDeleteFaq(elm?.id);
        });
      }
      let response = await updateDoctorInfoApi(fd);
      if (response) {
        if (response.data.res === true) {
          toast.success(response.data.msg, {autoClose: 1500});
          getDoctorInfo();
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
        }
      }
      setSaveBtnDis(false);
      setScreenLoadingPage(false);
    } catch (error) {
      setSaveBtnDis(false);
      setScreenLoadingPage(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
    // }
  };

  const deleteDoctorInfo = async (type, id) => {
    try {
      let response = await deleteDoctorInfoApi();
      if (response) {
        if (response.data.res === true) {
          // setFaqList(response.data.data);
          toast.success(response.data.msg, {autoClose: 1500});
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
    getSpeciality();
    getLanguages();
    getFaqs();
    getDoctorInfo();
  }, []);

  // Use effect to update selected languages whenever selectedOptions change
  useEffect(() => {
    updateSelectedLanguages();
  }, [selectedOptions]);

  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        <div className="DoctorProfileTop">
          <h3>
            Hello <span>Dr. {userData?.users?.first_name}!</span> Lets build your <br />
            dedicated profile.
          </h3>
          <div className="HeaderBtnBox">
            {screenLoadingPage && <LoadingPage />}

            {isActiveDocAcc ? (
              !isEditable ? (
                <>
                  <button className="SeeProfilePageBtn" onClick={() => navigate("/doctor/profile/view")}>
                    See profile page
                  </button>
                  <button className="EditProfileBtn" onClick={() => setIsEditable(true)}>
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <button className="SeeProfilePageBtn">See profile page</button>
                  <button className="SaveBtn" onClick={() => handleProfileSave()} disabled={saveBtnDis}>
                    {saveBtnDis ? "Please wait..." : "Save"}
                  </button>
                </>
              )
            ) : (
              <button className="SaveBtn" onClick={() => handleProfileSave()} disabled={saveBtnDis}>
                {saveBtnDis ? "Please wait..." : "Save"}
              </button>
            )}
          </div>
        </div>
        <div className="RoxBox">
          <div ref={stickyMenuRef} className="DoctorProfileLeftSec">
            <div className="Card">
              <ul className="LeftList">
                <li
                  onClick={() => handleMenuClick("section1")}
                  className={isEditable && activeId === "section1" ? "active" : allDetails?.users?.speciality ? "Complete" : ""}>
                  <button>Specialization</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section2")}
                  className={isEditable && activeId === "section2" ? "active" : allDetails?.users?.doctor_experts?.length > 0 ? "Complete" : ""}>
                  <button>Expertise</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section3")}
                  className={isEditable && activeId === "section3" ? "active" : allDetails?.users?.doctor_consultations?.length > 0 ? "Complete" : ""}>
                  <button>Rates</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section4")}
                  className={isEditable && activeId === "section4" ? "active" : allDetails?.users?.cabin_address ? "Complete" : ""}>
                  <button>Cabin address and transport details</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section5")}
                  className={isEditable && activeId === "section5" ? "active" : allDetails?.users?.service_description ? "Complete" : ""}>
                  <button>Service overview</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section6")}
                  className={
                    isEditable && activeId === "section6"
                      ? "active"
                      : allDetails?.users?.profile_pic && allDetails?.users?.doctor_documents?.length > 0
                      ? "Complete"
                      : ""
                  }>
                  <button>Profile pic and clinic pics</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section7")}
                  className={isEditable && activeId === "section7" ? "active" : allDetails?.doctor_languages?.length > 0 ? "Complete" : ""}>
                  <button>Language</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section8")}
                  className={isEditable && activeId === "section8" ? "active" : allDetails?.users?.doctor_degrees?.length > 0 ? "Complete" : ""}>
                  <button>National and university degrees</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section9")}
                  className={isEditable && activeId === "section9" ? "active" : allDetails?.users?.doctor_trainings?.length > 0 ? "Complete" : ""}>
                  <button>Other training courses</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section10")}
                  className={isEditable && activeId === "section10" ? "active" : allDetails?.users?.doctor_experiences?.length > 0 ? "Complete" : ""}>
                  <button>Experiences</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section11")}
                  className={isEditable && activeId === "section11" ? "active" : allDetails?.users?.doctor_publications?.length > 0 ? "Complete" : ""}>
                  <button>Work and publications</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section12")}
                  className={isEditable && activeId === "section12" ? "active" : allDetails?.users?.consultation_type !== null ? "Complete" : ""}>
                  <button>Consultation</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section13")}
                  className={
                    isEditable && activeId === "section13"
                      ? "active"
                      : allDetails?.users?.price_description && allDetails?.users?.payment_type
                      ? "Complete"
                      : ""
                  }>
                  <button>Price & Payment Methods</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section14")}
                  className={
                    isEditable && activeId === "section14" ? "active" : allDetails?.users?.rpps_no && allDetails?.users?.document_license ? "Complete" : ""
                  }>
                  <button>Legal Information</button>
                </li>
                <li
                  onClick={() => handleMenuClick("section15")}
                  className={isEditable && activeId === "section15" ? "active" : allDetails?.doctor_faqs?.length > 0 ? "Complete" : ""}>
                  <button>FAQ questions</button>
                </li>
              </ul>
            </div>
          </div>
          <div ref={rightContentRef} className="DoctorProfileRightSec">
            {screenLoading ? (
              <div className="Card">
                <Skeleton count={1} height={40} width={"100%"} baseColor="#cfd5f9" />
                <br />
                <p>
                  <Skeleton count={1} height={40} width={"95%"} baseColor="#cfd5f9" />
                </p>
              </div>
            ) : (
              <>
                <div className="Card" key={"section1"} ref={sectionRefs.section1}>
                  <h3>Specialization</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What is your specialization?</label>
                        <div className="CustomSelect">
                          <select className="SelectForm" value={selectedSpecialty} onChange={handleSpecialtyChange} disabled={!isEditable}>
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
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section2"} ref={sectionRefs.section2}>
                  <h3>Expertise</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What is your expertise flied?</label>
                        {showInputBox && (
                          <div className="AddInputBox">
                            <input
                              type="text"
                              placeholder="Type your expertise"
                              className="FormControl"
                              value={newExpertise}
                              onChange={e => setNewExpertise(e.target.value)}
                              disabled={!isEditable}
                            />
                            <button className="SaveBtn" onClick={handleSaveClick}>
                              Save
                            </button>
                          </div>
                        )}
                        {!showInputBox && isEditable ? (
                          <button className="AddBtn" onClick={handleAddClick} disabled={!isEditable}>
                            Add expertise
                          </button>
                        ) : null}

                        <ul className="AddList">
                          {expertiseList.map((expertise, index) => (
                            <li key={index}>
                              {expertise.expertise}
                              {isEditable ? (
                                <button className="DltBtn" onClick={() => handleDeleteClick(index, expertise.id)} disabled={!isEditable}>
                                  <img src={DeleteBlueIcon} alt="Delete" />
                                </button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section3"} ref={sectionRefs.section3}>
                  <h3>Rates</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <div className="InnerFormBox">
                          <label>What is a consultation fee?</label>
                          {isRateInputVisible && (
                            <>
                              <input
                                type="Text"
                                placeholder="Consultation"
                                className="FormControl"
                                value={newRateDescription}
                                onChange={e => setNewRateDescription(e.target.value)}
                                disabled={!isEditable}
                              />
                              <ul className="InputGroupList">
                                <li>
                                  <div className="GroupInput">
                                    <span>AED</span>
                                    <input
                                      type="number"
                                      placeholder="Type your amount"
                                      className="FormControl"
                                      value={newRateAmount}
                                      onChange={e => setNewRateAmount(e.target.value)}
                                      disabled={!isEditable}
                                    />
                                  </div>
                                  <button className="SaveBtn" onClick={handleSaveRateClick} disabled={!isEditable}>
                                    Save
                                  </button>
                                </li>
                              </ul>
                            </>
                          )}
                          {!isRateInputVisible && isEditable ? (
                            <button className="AddBtn" onClick={handleAddRateClick} disabled={!isEditable}>
                              Add fees
                            </button>
                          ) : null}

                          <ul className="AddList">
                            {rateList.map((rate, index) => (
                              <li key={index}>
                                {rate.description} - <span>{rate.amount} AED</span>
                                {isEditable ? (
                                  <button className="DltBtn" onClick={() => handleDeleteRateClick(index, rate.id)} disabled={!isEditable}>
                                    <img src={DeleteBlueIcon} alt="Delete" />
                                  </button>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section4"} ref={sectionRefs.section4}>
                  <h3>Cabin address and transports details</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                  </div>
                  <ul className="FormList">
                    <li>
                      <div className="InnerFormBox">
                        <label>What is your cabin address?</label>
                        {isLoaded ? (
                          <>
                            <div className="CabinAddSectionContainer">
                              <div className="AddInputBox cabinAddInptMaxWd">
                                <Autocomplete onLoad={onCityLoad} onPlaceChanged={onCityPlaceChanged} options={{componentRestrictions: {country: "DZ"}}}>
                                  <input
                                    type="Text"
                                    placeholder="Enter your address"
                                    className="FormControl"
                                    value={cabinAddress}
                                    onChange={handleAddressChange}
                                    disabled={!isEditable}
                                  />
                                </Autocomplete>

                                <label className="StylesRadio">
                                  <input type="radio" checked="checked" name="cabin-address-radio" disabled={!isEditable} />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                              {isEditable ? (
                                <>
                                  <div className="ShowCHMap">
                                    {isMapVisible ? (
                                      <button className="CloseMap" onClick={() => setIsMapVisible(false)} disabled={!isEditable}>
                                        Close map
                                      </button>
                                    ) : (
                                      <button onClick={() => setIsMapVisible(true)} disabled={!isEditable}>
                                        Choose from Map
                                      </button>
                                    )}
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      {isLoaded && isMapVisible ? (
                        <div className="CabinAddMapContainer">
                          <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={selectedLocation}
                            zoom={11}
                            onClick={handleClick}
                            options={{streetViewControl: false, mapTypeControl: false}}>
                            <Marker position={selectedLocation} draggable={true} onDragEnd={handleDragEnd} />
                          </GoogleMap>
                          {/* <button onClick={handleConfirm} style={{position: "absolute", bottom: "10px", right: "10px"}}>
                            Confirm Location
                          </button> */}
                        </div>
                      ) : null}

                      <label className="SubLabel">Would You like to add Transport details to reach the cabin location and useful information's?</label>
                      <div className="InnerFormBox">
                        <ul className="SmallRadioList">
                          <li>
                            <label>Yes</label>
                            <label className="StylesRadio">
                              <input
                                type="radio"
                                value="yes"
                                checked={showTransportDetails}
                                name="transport-details-radio"
                                onChange={handleTransportDetailsRadioChange}
                                disabled={!isEditable}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </li>
                          <li>
                            <label>No</label>
                            <label className="StylesRadio">
                              <input
                                type="radio"
                                value="no"
                                checked={!showTransportDetails}
                                name="transport-details-radio"
                                onChange={handleTransportDetailsRadioChange}
                                disabled={!isEditable}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </li>
                        </ul>

                        {showTransportDetails && (
                          <>
                            {!isTransportInputVisible && isEditable ? (
                              <button className="AddBtn" onClick={() => setTransportInputVisible(true)} disabled={!isEditable}>
                                Add transport details
                              </button>
                            ) : (
                              <>
                                <label className="SubLabel MargnTop">Transport details</label>
                              </>
                            )}

                            {isTransportInputVisible ? (
                              <div className="AddInputBox">
                                <input
                                  type="Text"
                                  placeholder="Type your transport details"
                                  className="FormControl"
                                  value={newTransportDetail}
                                  onChange={e => setNewTransportDetail(e.target.value)}
                                  disabled={!isEditable}
                                />
                                <button className="SaveBtn" onClick={handleAddTransportDetailClick} disabled={!isEditable}>
                                  Save
                                </button>
                              </div>
                            ) : null}

                            <ul className="AddList">
                              {transportDetailsList.map((detail, index) => (
                                <li key={index}>
                                  {detail?.transport}
                                  {isEditable ? (
                                    <button className="DltBtn" onClick={() => handleDeleteTransportDetailClick(index, detail?.id)} disabled={!isEditable}>
                                      <img src={DeleteBlueIcon} alt="Delete" />
                                    </button>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {showTransportDetails && !isPublicParkingInputVisible && isEditable ? (
                          <>
                            <button
                              className="AddBtn AddBtnMrgnTop"
                              onClick={() => {
                                setPublicParkingInputVisible(true);
                                setShowPublicParking(true);
                              }}
                              disabled={!isEditable}>
                              Add public parking
                            </button>
                            <br />
                          </>
                        ) : (
                          <>{/* <label className="SubLabel MargnTop">Public parking</label> */}</>
                        )}

                        {showTransportDetails && showPublicParking && (
                          <>
                            {!isPublicParkingInputVisible && !isEditable && <label className="SubLabel MargnTop">Public parking</label>}
                            {isPublicParkingInputVisible ? (
                              <div className="AddInputBox">
                                <input
                                  type="text"
                                  placeholder="Type public parking detail"
                                  className="FormControl"
                                  value={newPublicParking}
                                  onChange={e => setNewPublicParking(e.target.value)}
                                  disabled={!isEditable}
                                />
                                <button className="SaveBtn" onClick={handleAddPublicParkingClick} disabled={!isEditable}>
                                  Save
                                </button>
                              </div>
                            ) : null}

                            <ul className="AddList">
                              {publicParkingList.map((parking, index) => (
                                <li key={index}>
                                  {parking?.parking}
                                  {isEditable ? (
                                    <button className="DltBtn" onClick={() => handleDeletePublicParkingClick(index, parking?.id)} disabled={!isEditable}>
                                      <img src={DeleteBlueIcon} alt="Delete" />
                                    </button>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {showTransportDetails && !isUsefulInformationInputVisible && isEditable ? (
                          <>
                            <>
                              <button
                                className="AddBtn AddBtnMrgnTop"
                                onClick={() => {
                                  setUsefulInformationInputVisible(true);
                                  setShowUsefulInformation(true);
                                }}
                                disabled={!isEditable}>
                                Add useful information
                              </button>
                              <br />
                            </>
                          </>
                        ) : (
                          <></>
                        )}

                        {showTransportDetails && showUsefulInformation && (
                          <>
                            {!isUsefulInformationInputVisible && !isEditable && <label className="SubLabel MargnTop">Useful information</label>}
                            {isUsefulInformationInputVisible ? (
                              <div className="AddInputBox">
                                <input
                                  type="text"
                                  placeholder="Type useful information"
                                  className="FormControl"
                                  value={newUsefulInformation}
                                  onChange={e => setNewUsefulInformation(e.target.value)}
                                  disabled={!isEditable}
                                />
                                <button className="SaveBtn" onClick={handleAddUsefulInformationClick} disabled={!isEditable}>
                                  Save
                                </button>
                              </div>
                            ) : null}
                            <ul className="AddList">
                              {usefulInformationList.map((info, index) => (
                                <li key={index}>
                                  {info?.information}
                                  {isEditable ? (
                                    <button className="DltBtn" onClick={() => handleDeleteUsefulInformationClick(index, info?.id)} disabled={!isEditable}>
                                      <img src={DeleteBlueIcon} alt="Delete" />
                                    </button>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="Card" key={"section5"} ref={sectionRefs.section5}>
                  <h3>Service overview</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What services you provided? Please describe below</label>
                        <textarea
                          cols="3"
                          placeholder="Describe here"
                          className="TextareaForm"
                          value={serviceOverview}
                          onChange={e => setServiceOverview(e.target.value)}
                          disabled={!isEditable}></textarea>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section6"} ref={sectionRefs.section6}>
                  <h3>Profile pic and clinic pics</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>Would you like to add Photos?</label>
                        <label className="SubLabel2">Upload your profile pic</label>
                        {profilePictureSrc ? (
                          <ul className="UploadList">
                            <li>
                              <img src={profilePictureSrc} alt="Icon" />
                              {isEditable ? <button className="DltBtn2" onClick={() => handleDeleteProPicFile()} disabled={!isEditable}></button> : null}
                            </li>
                          </ul>
                        ) : (
                          <label className="UploadFilesLabel">
                            <button className="UploadBtn"></button>
                            <input type="file" className="UploadInput" onChange={handleProfilePictureChange} accept="image/*" disabled={!isEditable} />
                          </label>
                        )}

                        <ul className="FormList">
                          <li>
                            <label className="SubLabel2">Upload your clinic pics</label>
                          </li>
                        </ul>
                        <ul className="UploadList">
                          {isEditable ? (
                            <li>
                              <label className="UploadFilesLabel">
                                <button className="UploadBtn"></button>
                                <input
                                  type="file"
                                  className="UploadInput"
                                  onChange={handleClinicImageChange}
                                  accept="image/*"
                                  multiple
                                  disabled={!isEditable}
                                />
                              </label>
                            </li>
                          ) : null}
                          {clinicImagePreviews.map((image, index) => (
                            <li key={index}>
                              <img src={image.previewSrc} alt={`Preview ${index}`} />
                              {isEditable ? (
                                <button
                                  className="DltBtn2"
                                  onClick={() => handleDeleteClinicImage(image.fileObject, image?.id)}
                                  disabled={!isEditable}></button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                        {/* <div className="LoadingBox">
                      <div className="LoadingBoxTop">
                        <button className="RemoveUploadDelete">
                          <img src={RemoveUploadIcon} alt="" />
                        </button>
                        <div className="UploadImg">
                          <img src={UploadImg5} alt="" />
                        </div>
                        <div className="UploadText">
                          <h4>document.png</h4>
                          <h5>12 MB</h5>
                        </div>
                      </div>
                      <div className="ProgressbarBox">
                        <div className="ProgressbarSec">
                          <div className="Progressbar" style={{width: "50%"}}></div>
                        </div>
                        <span className="TotalText">50%</span>
                      </div>
                    </div> */}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section7"} ref={sectionRefs.section7}>
                  <h3>Languages</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>How many languages do you speak ?</label>
                        {isEditable ? (
                          <button onClick={toggleDropdown} className="SelectButton" disabled={!isEditable}>
                            Select Language
                          </button>
                        ) : null}

                        {isOpen && (
                          <div className="LanguageDropdown">
                            {languageList.map((item, index) => (
                              <div className="DropdownItem" key={index}>
                                <label className="StylesCheckbox">
                                  <input
                                    type="checkbox"
                                    id={item?.id}
                                    checked={selectedOptions.some(option => option.language_id === item.id)}
                                    onChange={() => handleCheckboxChange(item?.id)}
                                    disabled={!isEditable}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <label htmlFor={item?.id}>{item?.name}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                      <li>
                        <ul className="AddList">
                          {selectedLanguages.map((language, index) => (
                            <li key={index}>
                              {language.name}
                              {isEditable ? (
                                <button className="DltBtn" onClick={() => handleDeleteLanguage(language.id)} disabled={!isEditable}>
                                  <img src={DeleteBlueIcon} alt="Delete" />
                                </button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section8"} ref={sectionRefs.section8}>
                  <h3>National and university degrees</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        {isEditable ? (
                          <>
                            <label>Add your degrees</label>
                            <ul className="SmlInputList">
                              <li>
                                <div className="CustomSelect">
                                  <select className="SelectForm" name="year" value={newDegree.year} onChange={handleDegreeChange} disabled={!isEditable}>
                                    <option selected hidden>
                                      Select year
                                    </option>
                                    {/* Add options dynamically or hardcoded */}
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Degree/Certification name"
                                  className="FormControl"
                                  name="degreeName"
                                  value={newDegree.degreeName}
                                  onChange={handleDegreeChange}
                                  disabled={!isEditable}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="University/Institution name"
                                  className="FormControl"
                                  name="institutionName"
                                  value={newDegree.institutionName}
                                  onChange={handleDegreeChange}
                                  disabled={!isEditable}
                                />
                              </li>
                            </ul>
                            <button className="AddBtn AddBtnMrgnBtn" onClick={handleAddDegree} disabled={!isEditable}>
                              Add degree
                            </button>
                          </>
                        ) : null}

                        {degrees.map((degree, index) => (
                          <div key={index}>
                            <label className="SubLabel" key={index}>
                              Degree {index + 1}
                            </label>
                            <ul className="SmlInputList" key={index}>
                              <li>
                                <div className="CustomSelect">
                                  {/* <select className="SelectForm" name="year" value={degree.year} onChange={handleDegreeChange} disabled>
                                <option value="">Select year</option>
                                {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                  <option key={startYear + offset} value={startYear + offset}>
                                    {startYear + offset}
                                  </option>
                                ))}
                              </select> */}
                                  <input
                                    type="text"
                                    placeholder="Year"
                                    className="FormControl SelectForm"
                                    name="year"
                                    value={degree.year}
                                    onChange={handleDegreeChange}
                                    disabled
                                  />
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Degree/Certification name"
                                  className="FormControl"
                                  name="degreeName"
                                  value={degree.degreeName}
                                  onChange={handleDegreeChange}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="University/Institution name"
                                  className="FormControl"
                                  name="institutionName"
                                  value={degree.institutionName}
                                  onChange={handleDegreeChange}
                                  disabled
                                />
                              </li>
                              {isEditable ? (
                                <li>
                                  <ul className="DeleteList">
                                    <li onClick={() => handleRemoveDegree(index, degree?.id)}>
                                      Delete
                                      <button className="DltBtn">
                                        <img src={DeleteBlueIcon} alt="Delete" />
                                      </button>
                                    </li>
                                  </ul>
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section9"} ref={sectionRefs.section9}>
                  <h3>Other training courses</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        {isEditable ? (
                          <>
                            <label>Add your training courses</label>
                            <ul className="SmlInputList">
                              <li>
                                <div className="CustomSelect">
                                  <select className="SelectForm" name="year" value={newCourses.year} onChange={handleCourseChange} disabled={!isEditable}>
                                    <option selected hidden>
                                      Select year
                                    </option>
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Training center name"
                                  className="FormControl"
                                  name="trainingCenter"
                                  value={newCourses.trainingCenter}
                                  onChange={handleCourseChange}
                                  disabled={!isEditable}
                                />
                              </li>
                            </ul>
                            <button className="AddBtn" onClick={handleAddCourses}>
                              Add courses
                            </button>
                          </>
                        ) : null}
                      </li>
                    </ul>

                    <ul className="FormList">
                      {courses.map((course, index) => (
                        <div key={index}>
                          <label className="SubLabel MargnBottom" key={index}>
                            Course {index + 1}
                          </label>
                          <li key={index}>
                            {/* <label>Add your experiences</label> */}
                            <ul className="SmlInputList">
                              <li>
                                <div className="CustomSelect">
                                  <select className="SelectForm" name="year" value={course.year} onChange={handleExperienceChange} disabled>
                                    <option selected hidden>
                                      Select year
                                    </option>
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Training center name"
                                  className="FormControl"
                                  name="trainingCenter"
                                  value={course.trainingCenter}
                                  onChange={handleExperienceChange}
                                  disabled
                                />
                              </li>
                            </ul>
                            {isEditable ? (
                              <li>
                                <ul className="DeleteList">
                                  <li onClick={() => handleRemoveCourse(index, course?.id)} disabled={!isEditable}>
                                    Delete
                                    <button className="DltBtn">
                                      <img src={DeleteBlueIcon} alt="Delete" />
                                    </button>
                                  </li>
                                </ul>
                              </li>
                            ) : null}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section10"} ref={sectionRefs.section10}>
                  <h3>Experiences</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        {isEditable ? (
                          <>
                            <label>Add your experiences</label>
                            <ul className="SmlInputList2">
                              <li>
                                <label className="StylesRadio">
                                  <input
                                    type="radio"
                                    name="isCurrentlyWorking"
                                    value="yes"
                                    checked={newExperience.isCurrentlyWorking === "yes"}
                                    onChange={handleExperienceChange}
                                    disabled={!isEditable}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <span className="LabelSpan">Currently work</span>
                              </li>
                              <li>
                                <div className="CustomSelect">
                                  <select
                                    className="SelectForm"
                                    name="fromYear"
                                    value={newExperience.fromYear}
                                    onChange={handleExperienceChange}
                                    disabled={!isEditable}>
                                    <option value="">From year</option>
                                    {/* Generate year options dynamically */}
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <div className="CustomSelect">
                                  <select
                                    className="SelectForm"
                                    name="toYear"
                                    value={newExperience.toYear}
                                    onChange={handleExperienceChange}
                                    disabled={!isEditable}>
                                    <option value="">To year</option>
                                    {/* Generate year options dynamically */}
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Organization name"
                                  className="FormControl"
                                  name="organizationName"
                                  value={newExperience.organizationName}
                                  onChange={handleExperienceChange}
                                  disabled={!isEditable}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Designation"
                                  className="FormControl"
                                  name="designation"
                                  value={newExperience.designation}
                                  onChange={handleExperienceChange}
                                  disabled={!isEditable}
                                />
                              </li>
                            </ul>
                            <button className="AddBtn AddBtnMrgnBtn" onClick={handleAddExperience} disabled={!isEditable}>
                              Add experiences
                            </button>
                          </>
                        ) : null}

                        {experiences.map((experience, index) => (
                          <div key={index}>
                            <label className="SubLabel">Experience {index + 1}</label>
                            <ul className="SmlInputList2">
                              <>
                                <li key={index}>
                                  <label className="StylesRadio">
                                    <input
                                      type="radio"
                                      name={"isCurrentlyWorking"}
                                      value="yes"
                                      checked={experience.isCurrentlyWorking === "yes"}
                                      onChange={handleExperienceChange}
                                      disabled
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                  <span className="LabelSpan">Currently work</span>
                                </li>
                                <li key={index}>
                                  <div className="CustomSelect">
                                    <select className="SelectForm" name="fromYear" value={experience.fromYear} onChange={handleExperienceChange} disabled>
                                      <option value="">From year</option>
                                      {/* Generate year options dynamically */}
                                      {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                        <option key={startYear + offset} value={startYear + offset}>
                                          {startYear + offset}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </li>
                                <li key={index}>
                                  <div className="CustomSelect">
                                    <select className="SelectForm" name="toYear" value={experience.toYear} onChange={handleExperienceChange} disabled>
                                      <option value="">To year</option>
                                      {/* Generate year options dynamically */}
                                      {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                        <option key={startYear + offset} value={startYear + offset}>
                                          {startYear + offset}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </li>
                                <li key={index}>
                                  <input
                                    type="text"
                                    placeholder="Organization name"
                                    className="FormControl"
                                    name="organizationName"
                                    value={experience.organizationName}
                                    onChange={handleExperienceChange}
                                    disabled
                                  />
                                </li>
                                <li key={index}>
                                  <input
                                    type="text"
                                    placeholder="Designation"
                                    className="FormControl"
                                    name="designation"
                                    value={experience.designation}
                                    onChange={handleExperienceChange}
                                    disabled
                                  />
                                </li>
                                {isEditable ? (
                                  <li key={index}>
                                    <ul className="DeleteList">
                                      <li onClick={() => handleRemoveExperience(index, experience?.id)} disabled={!isEditable}>
                                        Delete
                                        <button className="DltBtn">
                                          <img src={DeleteBlueIcon} alt="Delete" />
                                        </button>
                                      </li>
                                    </ul>
                                  </li>
                                ) : null}
                              </>
                            </ul>
                          </div>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section11"} ref={sectionRefs.section11}>
                  <h3>Work and publications</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        {isEditable ? (
                          <>
                            <label>Add your work and publications links</label>
                            <ul className="SmlInputList">
                              <li>
                                <div className="CustomSelect">
                                  <select
                                    className="SelectForm"
                                    name="year"
                                    value={newPublication.year}
                                    onChange={handlePublicationChange}
                                    disabled={!isEditable}>
                                    <option value="">Select year</option>
                                    {/* Generate year options dynamically */}
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Link (example: http://localhost/URL/demo/?Alias=jhon)"
                                  className="FormControl"
                                  name="link"
                                  value={newPublication.link}
                                  onChange={handlePublicationChange}
                                  disabled={!isEditable}
                                />
                              </li>
                            </ul>
                            <button className="AddBtn" onClick={handleAddPublication} disabled={!isEditable}>
                              Add publications
                            </button>
                          </>
                        ) : null}
                      </li>
                    </ul>
                    <ul className="FormList">
                      {publications.map((pub, index) => (
                        <div key={index}>
                          <li key={index}>
                            <label className="SubLabel">Publication {index + 1}</label>
                            <ul className="SmlInputList">
                              <li>
                                <div className="CustomSelect">
                                  <select className="SelectForm" name="year" value={pub.year} onChange={handlePublicationChange} disabled>
                                    <option value="">Select year</option>
                                    {/* Generate year options dynamically */}
                                    {[...Array(currentYear - startYear + 1).keys()].map(offset => (
                                      <option key={startYear + offset} value={startYear + offset}>
                                        {startYear + offset}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                              <li>
                                <input
                                  type="text"
                                  placeholder="Link (example: http://localhost/URL/demo/?Alias=jhon)"
                                  className="FormControl"
                                  name="link"
                                  value={pub.link}
                                  onChange={handlePublicationChange}
                                  disabled
                                />
                              </li>
                            </ul>
                            {isEditable ? (
                              <li>
                                <ul className="DeleteList">
                                  <li onClick={() => handleRemovePublication(index, pub?.id)} disabled={!isEditable}>
                                    Delete
                                    <button className="DltBtn">
                                      <img src={DeleteBlueIcon} alt="Delete" />
                                    </button>
                                  </li>
                                </ul>
                              </li>
                            ) : null}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section12"} ref={sectionRefs.section12}>
                  <h3>Consultation</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What kind of consultation your provided?</label>
                        <ul className="RadioList">
                          {consultationOptions.map((option, index) => (
                            <li key={index}>
                              <label className="StylesRadio">
                                <input
                                  type="radio"
                                  name="consultation"
                                  value={option.id}
                                  checked={selectedConsultation === option.id}
                                  onChange={handleConsultationChange}
                                  disabled={!isEditable}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <span className="LabelSpan">{option.label}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section13"} ref={sectionRefs.section13}>
                  <h3>Price & Payment Methods</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>Price</label>
                        <textarea
                          cols="3"
                          placeholder="Type here"
                          className="TextareaForm"
                          value={price}
                          onChange={handlePriceChange}
                          disabled={!isEditable}></textarea>
                        <label className="MargnTop">Payment methods</label>
                        <ul className="RadioList">
                          {paymentMethods.map((method, index) => (
                            <li key={index}>
                              <label className="StylesRadio">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={method.id}
                                  checked={selectedPaymentMethod === method.id}
                                  onChange={handlePaymentMethodChange}
                                  disabled={!isEditable}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <span className="LabelSpan">{method.label}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section14"} ref={sectionRefs.section14}>
                  <h3>Legal Information</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What is the RPPS number?</label>
                        <input
                          type="Text"
                          placeholder="Enter RPPS number"
                          className="FormControl"
                          value={rppsNumber}
                          onChange={handleRppsNumberChange}
                          disabled={!isEditable}
                        />
                        <label className="MargnTop">Upload License</label>

                        {licenseImagePreviewUrl ? (
                          <ul className="UploadList">
                            <li>
                              {isPdfLicense ? (
                                <img src={PdfImage} alt="licenseImagePreviewUrl" />
                              ) : (
                                <img src={licenseImagePreviewUrl} alt="licenseImagePreviewUrl" />
                              )}

                              {isEditable ? <button className="DltBtn2" onClick={() => handleFileRemove()} disabled={!isEditable}></button> : null}
                            </li>
                          </ul>
                        ) : (
                          <div className="UploadDropbox">
                            <button className="UploadDropboxBtn"></button>
                            <input
                              type="file"
                              className="DropboxInput"
                              accept=".jpeg, .jpg, .png, .gif, .pdf"
                              onChange={handleLicenseFileChange}
                              disabled={!isEditable}
                            />
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card" key={"section15"} ref={sectionRefs.section15}>
                  <h3>Frequently Asked Question</h3>
                  <div className="InnerFormBox">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.
                    </p>
                    <ul className="FormList">
                      <li>
                        <label>What questions should be included in FAQ?</label>
                        <div className="accordion">
                          {faqList?.map((item, index) => (
                            <div className="accordion-item" key={index}>
                              <div className="accordion-header">
                                <label className="StylesCheckbox">
                                  <input
                                    type="checkbox"
                                    checked={!!expandedFAQIds[item.id]}
                                    onChange={() => toggleFAQVisibility(item.id)}
                                    id={`accordion-item-${item.id}`}
                                    disabled={!isEditable}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <label htmlFor={`accordion-item-${item.id}`}>{item.name}</label>
                              </div>
                              <div className={`accordion-content ${expandedFAQIds[item.id] ? "visible" : "hidden"}`}>
                                <textarea
                                  className="TextareaForm"
                                  placeholder="Answer here"
                                  value={faqAnswers[item.id] || ""}
                                  onChange={e => handleAnswerChange(item.id, e)}
                                  disabled={!isEditable}></textarea>
                              </div>
                            </div>
                          ))}
                        </div>
                      </li>
                      {/* <li>
                    <ul className="AddList AddList2">
                      <li>
                        What is the address of Dr Kestrel Tabrizi?{" "}
                        <button className="DltBtn">
                          <img src={DeleteBlueIcon} alt="" />
                        </button>
                      </li>
                      <li>
                        What language does Dr. Kestrel Tabrizi? speak?{" "}
                        <button className="DltBtn">
                          <img src={DeleteBlueIcon} alt="" />
                        </button>
                      </li>
                    </ul>
                  </li> */}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCreactProfile;
