import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getRelevantQuestions } from '../utils/oq_picker';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📤 Submitting answers:", answers);

    const userAnswers = questions.map((question) => {
        const answerValue = answers[question.id]; // Get the user's answer
        if (!answerValue) return null; // Skip if the answer is empty

        const formattedAnswer = {
            oq_id: question.id,
            user_id: user_id,  
            answer_content_t: question.oq_type === "text" ? answerValue : null,
            answer_content_int: question.oq_type === "int8" ? parseInt(answerValue, 10) || null : null
        };

        console.log(`📌 Answer for question ${question.id}:`, formattedAnswer);
        return formattedAnswer;
    }).filter(Boolean); // Remove null values (empty answers)

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

        // 🔄 **Update `oq_answer_count` for each answered question**
        console.log("🔄 Updating 'oq_answer_count'...");

        await Promise.all(userAnswers.map(async (answer) => {
            if (answer.answer_content_t || answer.answer_content_int !== null) {
                console.log(`📊 Incrementing count for question ID: ${answer.oq_id}`);

                // Step 1: Get the current `oq_answer_count`
                const { data, error } = await supabase
                    .from("Overview_questions")
                    .select("oq_answer_count")
                    .eq("id", answer.oq_id)
                    .single();

                if (error) {
                    console.error("🚨 Error fetching current answer count:", error.message);
                    return; // Skip this question if there is an error
                }

                // Step 2: Increment the current count
                const newCount = (data?.oq_answer_count || 0) + 1;

                // Step 3: Update the `oq_answer_count` with the incremented value
                const { updateError } = await supabase
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
        navigate("/Select_subject", { state: { user_id } });

    } catch (error) {
        console.error("🚨 Error submitting answers:", error.message);
    }
};

  return (
    <div className="overview-questions-container">
      <HeaderImage />
      <br></br>
      <h1>שאלות כלליות</h1>
      
      {!statistic_data && <p className="warning-text">⚠️ נתונים סטטיסטיים חסרים, אך ניתן להמשיך.</p>}

      <form onSubmit={handleSubmit} className="questions-form">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.oq_text}</h3>
            <input
              type={question.oq_type === 'int8' ? 'number' : 'text'}
              className="input-field"
              placeholder=""
              value={answers[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        ))}
        <p>יש לענות על שאלה אחת לפחות</p>
        <button type="submit" className="submit-button">שלח/י</button>
      </form>
    </div>
  );
};

export default OverviewQuestions;
