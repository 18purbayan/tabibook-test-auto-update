import React, {useEffect} from "react";
import Afterloginheader from "../components/MainHeader/Afterloginheader";
import Background from "../assets/images/Hero.jpg";
import Doctor from "../assets/images/Doctor.png";
import Community from "../assets/images/community.svg";
import Chat from "../assets/images/chat.svg";
import Calendar from "../assets/images/calendar.svg";
import TextTypingAnimation from "../components/TextTypingAnimation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppImg from "../assets/images/app.png";
import Play from "../assets/images/play.svg";
import Appstore from "../assets/images/AppStore.svg";

import TestimonialsCarousel from "../components/TestimonialsCarousel";
import Footer from "../components/Footer/Footer";

import Searchfilter from "../components/Searchfilter";
import {useUserContext} from "../context/UserContext";
import Header from "../components/MainHeader/Mainheader";
import {useNavigate} from "react-router-dom";

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Home = () => {
  const {userData, setSearchValuesContext} = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      if (userData?.users?.type === "Doctor") {
        navigate("/doctor/dashboard");
      }
    }
    sessionStorage.removeItem("tabibookHomeSearchValue");
    setSearchValuesContext(null);
  }, []);

  return (
    <div className="HomeBody">
      {userData ? <Afterloginheader /> : <Header />}
      <div className="hero" style={{backgroundImage: "url(" + Background + ")"}}>
        <div className="HeroContainer">
          <div className="HeroLft">
            <h3>
              Find an appointment with <br /> <TextTypingAnimation />
            </h3>
            <div className="HeroFrm">
              <Searchfilter />
            </div>
          </div>
          <div className="HeroRgt">
            <img src={Doctor} className="MainLogo" alt="logo" />
          </div>
        </div>
      </div>
      <div className="Features">
        <div className="FeaturesContainer">
          <div className="Sectiontitle">
            <h5>Features</h5>
            <h6>Tabibook: Serving your health needs</h6>
          </div>
          <div className="FeaturesList">
            <div className="FeaturesBox">
              <span className="FeaturesIcon">
                <img src={Community} className="FeaturesIcon" alt="ficon" />
              </span>
              <p>Access a wide community of practitioners simple and quickly.</p>
            </div>
            <div className="FeaturesBox">
              <span className="FeaturesIcon">
                <img src={Calendar} className="FeaturesIcon" alt="ficon" />
              </span>
              <p>Manage your appointments and reminders, view your history, and much more!</p>
            </div>
            <div className="FeaturesBox">
              <span className="FeaturesIcon">
                <img src={Chat} className="FeaturesIcon" alt="ficon" />
              </span>
              <p>Consult your practitioners via video or chat, wherever you are.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="Testimonials">
        <div className="TestimonialsContainer">
          <div className="Sectiontitle">
            <h5>Testimonials</h5>
            <h6>What our users are saying</h6>
          </div>
          <TestimonialsCarousel />
        </div>
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

export default Home;
