import React from "react";
import { useLocation } from "react-router-dom";
import './HeaderImage.css';

// Import images from the Header_img folder
import Header_home from '/workspaces/pagmar-v4/Header_img/Header_home.png';
import Header_statistic from '/workspaces/pagmar-v4/Header_img/Header_statistic.png';
import Header_oq_cut from '/workspaces/pagmar-v4/Header_img/Header_oq_cut.png';
import Header_subject from '/workspaces/pagmar-v4/Header_img/Header_subject.png';
import Header_dq from '/workspaces/pagmar-v4/Header_img/Header_dq.png';
import Header_end from '/workspaces/pagmar-v4/Header_img/Header_end.png';
import Header_clean from '/workspaces/pagmar-v4/Header_img/Header_clean.png';

function HeaderImage() {
  const location = useLocation();
  const path = location.pathname;

  // Define a map of paths to imported images
  const imageMap = {
    "/": Header_home,
    "/Statistic_questions": Header_statistic,
    "/Overview_questions": Header_oq_cut,
    "/Select_subject": Header_subject,
    "/Detailed_questions": Header_dq,
    "/Ending_screen": Header_end,
  };

  const headerImage = imageMap[path] || Header_clean;

  return (
    <div className="header-image-container">
      <img src={headerImage} alt="Header" className="header-image" />
    </div>
  );
}

export default HeaderImage;
