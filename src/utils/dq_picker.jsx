export const dq_picker = async (subjectName) => {
    // You can pull questions from anywhere (API, local JSON, etc.)
    return [
      { question: "האם שיניתי משהו בקיום המצווה הזו? אם כן, מה השינוי ומה גרם לך לעשות אותו?", dq_type: "textarea" },
      { question: "האם הפסקת לעשות חלקים מסוימים או את כל המצווה? יש פרטים הלכתיים מסוימים שאינך מקיים כדיום? אם כן, מה השינוי גורם לך להרגיש? ", dq_type: "text" },
      { question: "האם סדר העדיפויות שלך השתנה ביחס לקיום של המצווה? הוספת התניות או החרגות להקפדה שלך עליה? אם כן, אילו?", dq_type: "textarea" },
      { question: "האם בחרת להוסיף חומרה או להקפיד יותר על קיום המצווה? מה גרם לך לעשות את זה? איך זה מרגיש?", dq_type: "textarea" },
    ];
  };
  