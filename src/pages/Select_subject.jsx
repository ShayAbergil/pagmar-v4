import React, { useEffect, useState } from "react";
import { fetchSubjects } from "../utils/subjects_picker";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderImage from "../components/HeaderImage";

const SelectSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate(); // Navigation function
  const location = useLocation();
  const user_id = location.state?.user_id;
  console.log("Received from location.state →", { user_id });


  useEffect(() => {
    const getSubjects = async () => {
      const fetchedSubjects = await fetchSubjects();

      // Add the custom option
      const customOption = {
        subject: "יש לי סיפור לספר",
        description: "אפשר לבחור נושא אחר אם תרצה, או לספר סיפור חופשי.",
      };

      setSubjects([...fetchedSubjects, customOption]);
    };

    getSubjects();
  }, []);

  return (
    <div className="select-subject-container" style={{ overflowY: "auto", maxHeight: "100vh", paddingBottom: "2rem" }}>
      <HeaderImage />
      <br></br>
      <h1>נושא לבחירה</h1>
      <ul className="subjects-list">
        {Array.isArray(subjects) &&
          subjects.map((subject, index) => (
            <li key={index} className="subject-item">
              <button
                className="subject-button"
                onClick={() =>
                  navigate("/Detailed_questions", {
                    state: { subject, user_id },
                  })
                }
              >
                <h3>{subject.subject}</h3>
              {/*  <p style={{ margin: "0.5rem 0" }}>
              <b>בנושא זה ניתן לדבר על הדברים הבאים:</b> {subject.description}</p> */}
              </button> 
            </li>
          ))}
      </ul>

    </div>
  );
};

export default SelectSubject;