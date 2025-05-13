import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArcSlider from "../components/ArcSlider";
import AlartMessage from "../components/AlartMessage";
import HeaderImage from "../components/HeaderImage";
import { insertStatisticData, updateReligiousBkg } from "../pages/api/statistic_data_apis.js"; // import the API functions

const StatisticQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    profession: null,
    f_status: "",
    political_orientation: "5",
    Religious_bkg: "5",
    hometown: "",
    current_home: "",
  });

  const [grewUpReligious, setGrewUpReligious] = useState(false);
  const [grewUpNonReligious, setGrewUpNonReligious] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const options = {
    gender: ["גבר", "אישה", "א-בינארי", "מעדיפ/ה לא לומר"],
    profession: [
      "אקדמיה ומחקר", "רפואה טיפול ובריאות", "חינוך", "אומנות ותרבות",
      "עסקים ופיננסים", "עריכת דין", "שירות המדינה", "עבודה פיזית",
      "הייטק", "אחר"
    ],
    f_status: [
      "רווק / רווקה", "נשוי / נשואה", "אלמן / אלמנה", "גרוש / גרושה",
      "בזוגיות", "זה מסובך", "לא רלוונטי"
    ],
    adress: [
      "עיר גדולה: שכונה הומוגנית", "עיר גדולה: שכונה מגוונת", "ישוב: שכונה הומונית",
      "ישוב: שכונה מגוונת", "עיר קטנה: שכונה הומוגנית", "עיר קטנה: שכונה מגוונת", "אחר"
    ],
  };

  const labels = {
    age: "גיל",
    gender: "מגדר",
    profession: "מקצוע",
    political_orientation: "בדיון הפוליטי הפנים ישראלי, מקם/י את עצמך על הסקאלה כיום:",
    Religious_bkg: "רקע דתי",
    f_status: "מצב משפחתי",
    hometown: "מקום מגורים",
    current_home: "היישוב בו אני גר כיום",
  };

  const handleChange = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!grewUpReligious && !grewUpNonReligious) {
      setError("אנא סמן/י אם גדלת בבית דתי או לא דתי.");
      return;
    }

    try {
      if (grewUpNonReligious) {
        handleChange("Religious_bkg", 0);
        await updateReligiousBkg(user_id, false); // API call to update Religious_bkg
      }

      const data = await insertStatisticData(answers); // API call to insert statistic data

      navigate("/Overview_questions", {
        state: { statistic_data: data, user_id },
      });
    } catch (err) {
      console.error("Error:", err.message);
      setAlertMessage("שגיאה בשליחה. נסה/י שוב.");
      setShowAlert(true);
    }
  };

  const handleCheckboxChange = (type) => {
    if (type === "religious") {
      setGrewUpReligious(true);
      setGrewUpNonReligious(false);
    } else {
      setGrewUpReligious(false);
      setGrewUpNonReligious(true);
    }
  };

  return (
    <div className="container">
      <HeaderImage />
      <br />
      <h1>נתונים סטטיסטיים</h1>
      <p>
        <b>הבהרה:</b> הנתונים משפיעים על לשון הפניה וההתאמה של שאלות בהמשך הסקר. <br />
        הם עוברים אנונימיזציה בנפרד מן התשובות ונשמרים לצרכים סטטיסטיים בלבד.
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="questions-list">
        {/* Age */}
        <div className="question-card">
          <h3>{labels.age}</h3>
          <input
            type="number"
            value={answers.age}
            onChange={(e) => handleChange("age", e.target.value)}
            min="0"
            max="120"
            required
            className="form-input"
          />
        </div>

        {/* Gender */}
        <div className="question-card">
          <h3>{labels.gender}</h3>
          <select
            value={answers.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            required
            className="form-select"
          >
            <option value="">בחר/י אפשרות</option>
            {options.gender.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Family Status */}
        <div className="question-card">
          <h3>{labels.f_status}</h3>
          <select
            value={answers.f_status}
            onChange={(e) => handleChange("f_status", e.target.value)}
            required
            className="form-select"
          >
            <option value="">בחר/י מצב משפחתי</option>
            {options.f_status.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Religious Background */}
        <div className="question-card">
          <h3>{labels.Religious_bkg}</h3>
          <label>
            <input
              type="checkbox"
              checked={grewUpNonReligious}
              onChange={() => handleCheckboxChange("nonReligious")}
            />
            {" "}גדלתי בבית לא דתי
          </label>
          <label>
            <input
              type="checkbox"
              checked={grewUpReligious}
              onChange={() => handleCheckboxChange("religious")}
            />
            {" "}גדלתי בבית דתי
          </label>

          {grewUpReligious && (
            <>
              <p style={{ marginTop: "10px" }}> דרג/י את מידת 'הדתיות' של הבית בו גדלת:</p>
              <ArcSlider
                value={answers.Religious_bkg}
                onValueChange={(field, val) => handleChange("Religious_bkg", val)}
                field="Religious_bkg"
                tickLabels={{
                  9: "כמעט חילוני",
                  7: "מסורתי",
                  1.5: "חרדי"
                }}
              />
            </>
          )}
        </div>

        {/* Hometown / Current Home */}
        <div className="question-card">
          <h3>{labels.hometown}</h3>
          <div className="location-container">
            <div className="location-select">
              <label>גדלתי ב-</label>
              <select
                value={answers.hometown}
                onChange={(e) => handleChange("hometown", e.target.value)}
                required
                className="form-select"
              >
                <option value="">בחר/י מקום</option>
                {options.adress.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="location-select">
              <label>והיום אני גר/ה ב-</label>
              <select
                value={answers.current_home}
                onChange={(e) => handleChange("current_home", e.target.value)}
                required
                className="form-select"
              >
                <option value="">בחר/י מקום</option>
                {options.adress.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Political Orientation */}
        <div className="question-card">
          <h3>{labels.political_orientation}</h3>
          <p>(ניתן לדלג על השאלה)</p>
          <ArcSlider
            value={answers.political_orientation}
            onValueChange={(field, val) => handleChange("political_orientation", val)}
            field="political_orientation"
            tickLabels={{
              3: "שמאל-מרכז",
              8: "ימין-מתון"
            }}
          />
        </div>

        <button type="submit" className="button">שלח/י</button>
      </form>
      {showAlert && (
      <AlartMessage
         message={alertMessage}
         onClose={() => setShowAlert(false)}
      />
      )}
    </div>
  );
};

export default StatisticQuestions;
