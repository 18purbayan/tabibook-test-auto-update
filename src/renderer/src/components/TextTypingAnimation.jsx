import React, { useState, useEffect } from "react";
import "./TextTypingAnimation.css";

const textItems = [
  "a pharmacy",
  "a laboratory",
  "a midwife",
  "a physiotherapist",
  "a radiologist",
];

const TextTypingAnimation = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textItems[currentTextIndex];
      if (isDeleting) {
        setDisplayedText(currentText.substring(0, displayedText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayedText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textItems.length);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, typingSpeed, currentTextIndex]);

  return (
    <div className="text-typing-animation">
      <span>{displayedText}</span>
      <span className="cursor">|</span>
    </div>
  );
};

export default TextTypingAnimation;
