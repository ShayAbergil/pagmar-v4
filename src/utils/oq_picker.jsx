// import { supabase } from '../lib/supabase';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// The function will now accept statistic_data as a parameter
export const getRelevantQuestions = async (statistic_data) => {
    try {
        // Call Supabase to fetch the 3 questions with the lowest "oq_answer_count"
        const { data, error } = await supabase
            .from('Overview_questions') // Replace with the correct table name
            .select('*') 
            .order('oq_answer_count', { ascending: true }) // Sort by "oq_answer_count" in ascending order
            .limit(3); // Get only the first 3 questions

        // Handle errors
        if (error) {
            throw new Error(error.message);
        }

        // If the data is found, modify the questions based on the gender
        return data.map((question) => {
            let modifiedQuestion = { ...question }; // Copy the original question object

            // Adjust the 'oq_text' based on the gender value in the statistic_data
            const { gender } = statistic_data; // Assuming gender is part of the statistic_data

            if (gender === "גבר") {
                modifiedQuestion.oq_text = question.oq_text_m; // Use the male version
            } else if (gender === "אישה" || gender === "מעדיפ/ה לא לומר") {
                modifiedQuestion.oq_text = question.oq_text_f; // Use the female version or non-binary version
            } else if (gender === "א-בינארי") {
                // Randomly assign male or female text, alternating between the questions
                const randomChoice = Math.random() < 0.5 ? 'm' : 'f'; // Randomly choose "m" or "f"
                modifiedQuestion.oq_text = randomChoice === 'm' ? question.oq_text_m : question.oq_text_f;
            }

            // Return the modified question object with necessary fields
            return {
                id: modifiedQuestion.id,
                oq_type: modifiedQuestion.oq_type,
                oq_text: modifiedQuestion.oq_text,
            };
        });
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        return []; // Return an empty array in case of error
    }
};
