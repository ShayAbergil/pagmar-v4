import React from "react";
import { useLocation } from "react-router-dom";
import './HeaderImage.css';

function HeaderImage() {
  const location = useLocation();
  const path = location.pathname;

  // Define a map of paths to image filenames
  const imageMap = {
    "/": "Header_img/Header_home.png",
    "/Statistic_questions": "Header_img/Header_statistic.png",
    "/Overview_questions": "Header_img/Header_oq_cut.png",
    "/Select_subject": "Header_img/Header_subject.png",
    "/Detailed_questions": "Header_img/Header_dq.png",
    "/Ending_screen": "Header_img/Header_end.png",
  };

  const headerImage = imageMap[path] || "Header_img/Header_clean.png";
  return (
    <div className="header-image-container">
      <img src={headerImage} alt="Header" className="header-image" />
    </div>
  );
}

export default HeaderImage;
