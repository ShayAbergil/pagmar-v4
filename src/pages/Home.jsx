import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import HeaderImage from '../components/HeaderImage';


function Home() {
  const navigate = useNavigate();
  const [entryTime, setEntryTime] = useState(null);

  useEffect(() => {
    // Record the time when the component mounts
    setEntryTime(Date.now());
  }, []);

  const handleStart = async () => {
    const user_id = crypto.randomUUID();
    const exitTime = Date.now();
    const timeSpentSeconds = Math.floor((exitTime - entryTime) / 1000);
    const poll_version = "test1"; // Hard coded poll version

    // Insert a new row into the User_records table
    const { data, error } = await supabase
      .from('User_records')
      .insert([
        {
          user_id: user_id,
          time_in_hp: timeSpentSeconds,
          poll_version: poll_version
          // start_ts can be default in Supabase (created_at with default now())
        }
      ]);

    if (error) {
      console.error('Error inserting into Supabase:', error.message);
    } else {
      console.log('Record added to User_records:', data);
    }

    // Navigate to the next page
    navigate('/Statistic_questions', { state: { user_id } });
  };

  return (
    <div className="container">
    <HeaderImage />
    <br></br>
      <h1>לְפְּסָפֶס את ההָלָכָה</h1>
      <h3> סקר אינטראקטבי למיפוי צמתי ההחלטה של דתיות ודתיים על הרצף</h3>
      {/* Video Section 
      <div className="video-container">
        <video width="66%" controls>
          <source src="/src/assets/intro_clip1.mp4" type="video/mp4" />
          הדפדפן שלך אינו תומך בהצגת וידאו.
        </video>
      </div> */}
      
      {/* Explanation Paragraph 
      <h3> אמ;לק לסרטון:</h3> */}
      <p>
    אני שי אברג'ל, אני סטודנט לתואר שני בעיצוב לסביבות טכנולוגיות במכון הטכנולוגי חולון 
    במסגרת פרויקט הגמר שלי בניתי סקר אינטראקטיבי שמטרתו ללמוד על דילמות והחלטות של בוגרי מערכת החינוך הדתי שנמצאים על הרצף הדתי. אני רוצה לשמוע מכן ומכם – על רגעים שבהם התלבטתם איך לשמור מצווה, ניסיתם להתאים או לשנות הרגלים דתיים לאורח החיים הנוכחי שלכם, או שארגנתם מחדש מחשבות התפיסה הדתית שלכם.
    <br></br>
    איך זה עובד? <br></br>
 📌 חלק ראשון – כמה שאלות כלליות ביוגרפיות<br></br>
 📌 חלק שני – שאלות פתוחות על ההתנסות האישית שלכם<br></br>
 📌 חלק שלישי נצלול – שאלות ממוקדות יותר, לפי נושא שתבחרו. תוכלו לענות על החלק השלישי מספר פעמים, ובכל פעם לבחור נושא אחר.<br></br><br></br>
אין תשובה "נכונה" או "לא נכונה" – כל נקודת מבט מעשירה את התמונה שאני מנסה לצייר בסקר. בבקשה הרגישו בנוח לענות על השאלות כפי שאתם מבינים אותם. אני מאמין שהעולם הדתי הפנימי שלנו הוא עולם מגוון ותלוי בהרבה פרמטרים בהיסטוריה האישית שלנו - לכן השאלות הן סוייקטיביות ולעיתים ניתן לפרש אותן ליותר מכיוון אחד. אני מזמין אתכם לפרט, לספר, לחפור – ממליץ בחום להשתמש בתוכנות שממירות דיבור לטקסט.<br></br><br></br>
🔒 פרטיותכם חשובה – הנתונים הביוגרפיים נשמרים בנפרד, למטרות ניתוח סטטיסטי בלבד.<br></br>
 📩 בסוף הסקר תוכלו להשאיר פרטים אם תרצו לקבל עדכונים על תוצאות הסקר.<br></br>
<b>תודה רבה על ההשתתפות</b>
      </p>
      
      <button className="button" onClick={handleStart}>בואו נתחיל</button>
    </div>
  );
}

export default Home;
