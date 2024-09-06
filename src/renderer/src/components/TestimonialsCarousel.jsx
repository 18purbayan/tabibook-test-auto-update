import React from "react";
import Slider from "react-slick";
import "./TestimonialsCarousel.css"; // Import your CSS for styling
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../assets/images/testmonialuser.png";

const testimonials = [
  {
    name: "Joyothi Bharthi",
    text: "Very helpful. Far easier than doing same things on computer. Allows quick and easy search with speedy booking. Even maintains history of doctors visited.",
    image: image1,
  },
  {
    name: "Joyothi Bharthi",
    text: "Very helpful. Far easier than doing same things on computer. Allows quick and easy search with speedy booking. Even maintains history of doctors visited.",
    image: image1,
  },
  {
    name: "Joyothi Bharthi",
    text: "Very helpful. Far easier than doing same things on computer. Allows quick and easy search with speedy booking. Even maintains history of doctors visited.",
    image: image1,
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div className="testimonials-carousel">
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-item">
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-info">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <p className="testimonial-name">- {testimonial.name}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsCarousel;
