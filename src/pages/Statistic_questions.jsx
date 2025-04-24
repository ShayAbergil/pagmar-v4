import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ArcSlider from "../components/ArcSlider";

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
        ]
    };

    const labels = {
        age: "גיל",
        gender: "מגדר",
        profession: "מקצוע",
        political_orientation: "נטייה פוליטית",
        Religious_bkg: "רקע דתי",
        f_status: "מצב משפחתי"
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
            const { data, error } = await supabase
                .from("Statistic_data")
                .insert([answers])
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
        <div className="questions-container">
            <h1>נתונים סטטיסטיים</h1>
            <p className="section-description">
                <b>הבהרה: </b>הנתונים משפיעים על לשון הפניה והתאמה של שאלות בהמשך הסקר.
                הם עוברים אנונימיזציה בנפרד מן התשובות ונשמרים לצרכים סטטיסטיים בלבד.
            </p>
            <form onSubmit={handleSubmit} className="questions-list">
                <div className="question-card">
                    <h3>גיל</h3>
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

                {Object.entries(options).map(([field, optionList]) => (
                    field !== "profession" && (
                        <div key={field} className="question-card">
                            <h3>{labels[field]}</h3>
                            <select
                                value={answers[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">בחר/י אפשרות</option>
                                {optionList.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )
                ))}

                <div className="question-card">
                    <p className="question-description">
                        בדיון הפוליטי הפנים ישראלי, מקם/י את עצמך על הסקאלה כיום:
                        <br /> (ניתן לדלג על השאלה)
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

                <div className="question-card">
                    <p className="question-description">דרג/י את מידת 'הדתיות' של הבית בו גדלת: </p>
                    <ArcSlider
                        value={answers.Religious_bkg}
                        onValueChange={(field, val) => handleChange("Religious_bkg", val)}
                        field="Religious_bkg"
                        tickLabels={{
                            10: "חילוני מאוד",
                            7: "מסורתי",
                            1.5: "חרדי"
                        }}
                    />
                </div>

                <button type="submit" className="submit-button">שלח/י</button>
            </form>
        </div>
    );
};

export default StatisticQuestions;
