import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import HeaderImage from '../components/HeaderImage';
import images from "../components/Assets";


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
    const poll_version = "pilot1"; // Hard coded poll version

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
      <h1>דת-דאטא</h1>
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
    אני שי אברג'ל, אני סטודנט לתואר שני בעיצוב ב-HIT, <br />
    במסגרת פרויקט הגמר שלי בניתי סקר אינטראקטיבי שמטרתו ללמוד על דילמות והחלטות של בוגרי מערכת החינוך הדתי שנמצאים על הרצף הדתי. 
    <br />
    <br /> </p>
    <h3> איך הסקר עובד? </h3>
    <p>
    <img src={images.t_pink} className="inline-icon" /> חלק ראשון – כמה שאלות כלליות ביוגרפיות<br></br>
    <img src={images.t_light_green} className="inline-icon" /> חלק שני – שאלות פתוחות על ההתנסות האישית שלכם<br></br>
    <img src={images.t_dark_green} className="inline-icon" /> חלק שלישי - נצלול שאלות ממוקדות יותר לפי נושא שתבחרו<br></br><br></br>

 אני אשמח לשמוע מכן ומכם – 
 על רגעים שבהם התלבטתם איך לשמור מצווה, 
 ניסיתם להתאים הרגלים דתיים לאורח החיים הנוכחי שלכם, 
 או שארגנתם מחדש מחשבות על דברים שלמדתן בעבר.
 <br></br>
 השאלות סובייקטיביות ולעיתים ניתן לפרש אותן ליותר מכיוון אחד, לכן
אין תשובה "נכונה" או "לא נכונה", הרגישו בנוח לענות על השאלות כפי שאתם מבינים אותם. 
<br></br>
אני מזמין אתכם לפרט, לספר, לחפור – ממליץ בחום להשתמש בתוכנות שממירות דיבור לטקסט.<br></br><br></br>
<img src={images.t_mosaic} className="inline-icon-mosiac" /> פרטיותכם חשובה – הנתונים הביוגרפיים נשמרים בנפרד, למטרות ניתוח סטטיסטי בלבד.<br></br>
<img src={images.t_mosaic} className="inline-icon-mosiac" /> בסוף הסקר תוכלו להשאיר פרטים אם תרצו לקבל עדכונים על תוצאות הסקר.<br></br>
  </p>
<h3>תודה רבה על ההשתתפות</h3>
      
      
      <button className="button" onClick={handleStart}>בואו נתחיל</button>
    </div>
  );
}

export default Home;
