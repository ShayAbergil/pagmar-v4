import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getRelevantQuestions } from '../utils/oq_picker';
import HeaderImage from '../components/HeaderImage';

const OverviewQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const statistic_data = location.state?.statistic_data || null;
  const user_id = location.state?.user_id;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  console.log("✅ Received statistic_data:", statistic_data);

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getRelevantQuestions(statistic_data || {});
      console.log("📋 Fetched Questions:", fetchedQuestions);
      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    console.log("📤 Submitting answers:", answers);

    const userAnswers = questions.map((question) => {
      const answerValue = answers[question.id];
      if (!answerValue) return null;

      const formattedAnswer = {
        oq_id: question.id,
        user_id: user_id,
        answer_content_t: question.oq_type === "text" ? answerValue : null,
        answer_content_int: question.oq_type === "int8" ? parseInt(answerValue, 10) || null : null
      };

      console.log(`📌 Answer for question ${question.id}:`, formattedAnswer);
      return formattedAnswer;
    }).filter(Boolean);

    if (userAnswers.length === 0) {
      console.warn("⚠️ No valid answers to submit.");
      return;
    }

    try {
      console.log("📤 Pushing data to 'Overview_answers':", userAnswers);
      const { data, error } = await supabase
        .from("Overview_answers")
        .insert(userAnswers)
        .select();

      if (error) throw error;
      console.log("✅ Successfully submitted answers:", data);

      await Promise.all(userAnswers.map(async (answer) => {
        if (answer.answer_content_t || answer.answer_content_int !== null) {
          console.log(`📊 Incrementing count for question ID: ${answer.oq_id}`);
          const { data, error } = await supabase
            .from("Overview_questions")
            .select("oq_answer_count")
            .eq("id", answer.oq_id)
            .single();

          if (error) {
            console.error("🚨 Error fetching current answer count:", error.message);
            return;
          }

          const newCount = (data?.oq_answer_count || 0) + 1;

          const { error: updateError } = await supabase
            .from("Overview_questions")
            .update({ oq_answer_count: newCount })
            .eq("id", answer.oq_id);

          if (updateError) {
            console.error("🚨 Error updating oq_answer_count:", updateError.message);
          } else {
            console.log("✅ Successfully updated oq_answer_count for question ID:", answer.oq_id);
          }
        }
      }));

      console.log("✅ Successfully updated 'oq_answer_count'");
      navigate("/Select_subject", { state: { user_id, statistic_data } });

    } catch (error) {
      console.error("🚨 Error submitting answers:", error.message);
    }
  };

  return (
    <div className="container">
      <HeaderImage />
      <br />
      <h1>שאלות כלליות</h1>

      {!statistic_data && <p className="warning-text">⚠️ נתונים סטטיסטיים חסרים, אך ניתן להמשיך.</p>}

      <form className="questions-list">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.oq_text}</h3>
            <textarea
              type={question.oq_type === 'int8' ? 'number' : 'text'}
              className="input-field"
              value={answers[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        ))}
      </form>
      <p>יש לענות על שאלה אחת לפחות</p>
      {/* 🔘 Submit button outside the form, manually calls handleSubmit */}
      <button type="button" className="button" onClick={handleSubmit}>
        {statistic_data?.gender === "גבר" ? "שלח" : "שלחי"}
      </button>
    </div>
  );
};

export default OverviewQuestions;
