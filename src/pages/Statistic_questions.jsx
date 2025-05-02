import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ArcSlider from "../components/ArcSlider";
import HeaderImage from '../components/HeaderImage';

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
        Religious_bkg: "דרג/י את מידת 'הדתיות' של הבית בו גדלת:",
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
        console.log("Submitting answers:", answers);

        try {
            if (answers.Religious_bkg >= 9) {
                const { data: userData, error: userError } = await supabase
                    .from("User_records")
                    .update({ Religious_bkg: false })
                    .eq("user_id", user_id)
                    .select()
                    .single();
    
                if (userError) throw userError;
    
                console.log("User record updated:", userData);
            }

            const { data, error } = await supabase
                .from("Statistic_data")
                .insert([{
                    ...answers,
                    hometown: answers.hometown,
                    current_home: answers.current_home,
                }])
                .select()
                .single();

            if (error) throw error;

            console.log("Data inserted successfully!", data);

            navigate("/Overview_questions", {
                state: {
                    statistic_data: data,
                    user_id: user_id,
                }
            });

        } catch (error) {
            console.error("Error inserting data:", error.message);
        }
    };

    return (
        <div className="container">
            <HeaderImage />
            <br />
            <h1>נתונים סטטיסטיים</h1>
            <p>
                <b>הבהרה: </b>הנתונים משפיעים על לשון הפניה והתאמה של שאלות בהמשך הסקר. <br />
                הם עוברים אנונימיזציה בנפרד מן התשובות ונשמרים לצרכים סטטיסטיים בלבד.
            </p>
            <form onSubmit={handleSubmit} className="questions-list">
                {/* Age Question Card */}
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

                {/* Gender Question Card */}
                <div className="question-card">
                    <h3>{labels.gender}</h3>
                    <select
                        value={answers.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">בחר/י אפשרות</option>
                        {options.gender.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* family status Question Card */}
                <div className="question-card">
                    <h3>{labels.f_status}</h3>
                    <select
                        value={answers.f_status}
                        onChange={(e) => handleChange("f_status", e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">בחר/י מצב משפחתי</option>
                        {options.f_status.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                   {/* Religious Background Question Card */}
                <div className="question-card">
                    <h3>{labels.Religious_bkg}</h3>
                    <ArcSlider
                        value={answers.Religious_bkg}
                        onValueChange={(field, val) => handleChange("Religious_bkg", val)}
                        field="Religious_bkg"
                        tickLabels={{
                            9: "חילוני",
                            7: "מסורתי",
                            1.5: "חרדי"
                        }}
                    />
                </div>

                   {/* Hometown Question Card */}
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
                                {options.adress.map((option) => (
                                    <option key={option} value={option}>{option}</option>
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
                                {options.adress.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>


                {/* Political Orientation Question Card */}
                <div className="question-card">
                <h3>{labels.political_orientation}</h3>
                    <p> (ניתן לדלג על השאלה)
                    </p>
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
        </div>
    );
};

export default StatisticQuestions;
