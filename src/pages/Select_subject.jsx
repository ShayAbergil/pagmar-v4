import React, { useEffect, useState } from "react";
import { fetchSubjects } from "../utils/subjects_picker";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderImage from "../components/HeaderImage";

const SelectSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate(); // Navigation function
  const location = useLocation();
  const user_id = location.state?.user_id;
  const statistic_data = location.state?.statistic_data || null;
  console.log("Received from location.state →", { user_id });


  useEffect(() => {
    const getSubjects = async () => {
      const fetchedSubjects = await fetchSubjects();

      // Add the custom option
      const customOption = {
        subject: "יש לי סיפור לספר",
        description: "אם יש לך מחשבה בנושא, או אנקדוטה שנראית לך רלוונטית - זה המקום לכתוב אותה",
      };

      setSubjects([...fetchedSubjects, customOption]);
    };

    getSubjects();
  }, []);

  return (
    <div className="container">
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
                    state: { subject, user_id, statistic_data },
                  })
                }
              >
                <h3>{subject.subject}</h3>
                {subject.subject === "יש לי סיפור לספר" && subject.description && (
          <p style={{ margin: "0.5rem 0", marginTop: "-1rem" }}>
            {subject.description}
          </p>
             )}
              </button> 
            </li>
          ))}
      </ul>

    </div>
  );
};

export default SelectSubject;