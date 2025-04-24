import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dq_picker } from "../utils/dq_picker";
import { supabase } from "../lib/supabase";

const DetailedQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subject, user_id } = location.state || {};
  console.log("Received from location.state →", { subject, user_id });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await dq_picker(subject.subject);
      setQuestions(fetchedQuestions);
    };

    loadQuestions();
  }, [subject]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const submitAnswers = async () => {
    const nonEmptyAnswers = questions
      .map((q, index) => {
        const answer_content = answers[index];
        if (!answer_content) return null;

        return {
          user_id,
          subject_id: subject.subject_id,
          subject: subject.subject,
          dq_id: q.dq_id,
          answer_content,
        };
      })
      .filter(Boolean);

    if (nonEmptyAnswers.length === 0) return;

    const { error } = await supabase.from("Detailed_answers").insert(nonEmptyAnswers);
    if (error) {
      console.error("Error submitting answers:", error.message);
      return;
    }

    const { error: updateSubjectError } = await supabase
      .from("Subjects")
      .update({ s_answer_count: subject.s_answer_count + 1 })
      .eq("subject_id", subject.subject_id);
    if (updateSubjectError) {
      console.error("Error updating subject:", updateSubjectError.message);
    }

    const { data: userData, error: userFetchError } = await supabase
      .from("User_records")
      .select("iteration_count, subjects")
      .eq("user_id", user_id)
      .single();

    if (userFetchError) {
      console.error("Error fetching user data:", userFetchError.message);
      return;
    }

    const updatedSubjects = Array.isArray(userData.subjects)
      ? [...new Set([...userData.subjects, subject.subject])]
      : [subject.subject];

    const { error: userUpdateError } = await supabase
      .from("User_records")
      .update({
        iteration_count: userData.iteration_count + 1,
        subjects: updatedSubjects,
      })
      .eq("user_id", user_id);

    if (userUpdateError) {
      console.error("Error updating user:", userUpdateError.message);
    }
  };

  const handleClick = async (path) => {
    await submitAnswers();
    navigate(path, { state: { user_id } });
  };

  return (
    <div>
      <h1>{subject.subject}</h1>
      <p>
        בחלק זה, שתף באנקדוטה מהיומיום שבה חל שינוי באופן שבו ראית את הנושא או פעלת לגביו.
        מתי זה קרה? מה השתנה? ואיך אתה מרגיש עם השינוי כיום? <br />
        דוגמאות לאנקדוטות רלוונטיות בנושא: {subject.description}
        <br />
        <b>יש לענות על שאלה אחת לפחות</b>
      </p>

      {questions.map((q, index) => (
        <div key={index}>
          <p>{q.question}</p>

          {q.dq_type === "text" && (
            <input
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          )}

          {q.dq_type === "textarea" && (
            <textarea
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          )}

          {q.dq_type === "number" && (
            <input
              type="number"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          )}
        </div>
      ))}

      <div>
        <button onClick={() => handleClick("/Select_subject")}>
          עוד סבב של שאלות
        </button>
        <button onClick={() => handleClick("/Ending_screen")}>
          מספיק לי לבינתיים
        </button>
      </div>
    </div>
  );
};

export default DetailedQuestions;
