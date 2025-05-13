// import { supabase } from "../lib/supabase";

const default_dq = [
  {
    dq_text_m: "ספר על התלבטות דתית שהעסיקה אותך בזמן האחרון סביב הנושא. מה בחרת לעשות? למה?",
    dq_text_f: "ספרי על התלבטות דתית שהעסיקה אותך בזמן האחרון סביב הנושא. מה בחרת לעשות? למה?",
    dq_desc: "",
    dq_type: "textarea",
  },
  {
    dq_text_m: "האם הפסקת לעשות חלקים מסוימים או את כל המצווה? יש פרטים הלכתיים מסוימים שאינך מקיים כיום? אם כן, מה השינוי גורם לך להרגיש?",
    dq_text_f: "האם הפסקת לעשות חלקים מסוימים או את כל המצווה? יש פרטים הלכתיים מסוימים שאינך מקיימת כיום? אם כן, מה השינוי גורם לך להרגיש?",
    dq_desc: "",
    dq_type: "textarea",
  },
  {
    dq_text_m: "האם סדר העדיפויות שלך השתנה ביחס לקיום של המצווה? הוספת התניות או החרגות להקפדה שלך עליה? אם כן, אילו?",
    dq_text_f: "האם סדר העדיפויות שלך השתנה ביחס לקיום של המצווה? הוספת התניות או החרגות להקפדה שלך עליה? אם כן, אילו?",
    dq_desc: "",
    dq_type: "textarea",
  },
  {
    dq_text_m: "האם בחרת להוסיף חומרה או להקפיד יותר על קיום המצווה? למה? איך זה מרגיש?",
    dq_text_f: "האם בחרת להוסיף חומרה או להקפיד יותר על קיום המצווה? למה? איך זה מרגיש?",
    dq_desc: "",
    dq_type: "textarea",
  },
  
  // Add more if needed
];

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const dq_picker = async (subject, statistic_data) => {

  const { data, error } = await supabase
    .from("Detailed_questions_bank")
    .select("*")
    .eq("subject", subject);

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  console.log("Fetched questions from DB:", data);

  let selectedQuestions = [];
  if (data.length > 4) {
    selectedQuestions = data
      .sort((a, b) => a.dq_answer_count - b.dq_answer_count)
      .slice(0, 4);
  } else {
    selectedQuestions = [...data];

    const remaining = 4 - selectedQuestions.length;
    const fallback = getRandomItems(default_dq, remaining);
    console.log(`Adding ${fallback.length} default questions`);
    selectedQuestions = selectedQuestions.concat(fallback);
  }

  const gender = statistic_data?.gender;
  const result = selectedQuestions.map((q, index) => {
    const questionText =
      gender === "גבר"
        ? q.dq_text_m
        : gender === "אישה"
        ? q.dq_text_f
        : index % 2 === 0
        ? q.dq_text_m
        : q.dq_text_f;

    return {
      question: questionText,
      dq_desc: q.dq_desc,
      dq_type: q.dq_type,
    };
  });

  console.log("Final question set:", result);
  return result;
};


