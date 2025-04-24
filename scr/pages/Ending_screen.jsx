import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EndingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user_id = location.state?.user_id;

  // Provide initial values for state variables
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState('');          // Default to empty string
  const [email, setEmail] = useState('');        // Default to empty string
  const [personalInfoUpdated, setPersonalInfoUpdated] = useState(false); // Default to false

  // Clear the form state on component mount
  useEffect(() => {
    setChecked(false);
    setName('');
    setEmail('');
    setPersonalInfoUpdated(false);
  }, []);

  // Effect to fetch and update duration in the database
  useEffect(() => {
    const fetchStartTsAndUpdateDuration = async () => {
      if (!user_id) return;

      const { data, error } = await supabase
        .from('User_records')
        .select('start_ts')
        .eq('user_id', user_id)
        .single();

      if (error) {
        console.error('Error fetching start_ts:', error);
        return;
      }

      if (data?.start_ts) {
        let startTime;
        let now;
        let durationInSeconds;

        // Make sure startTime and now are correctly assigned
        startTime = new Date(data.start_ts); // Ensure start_ts is a valid date string
        now = new Date();
        durationInSeconds = Math.floor((now - startTime) / 1000);

        await supabase
          .from('User_records')
          .update({ duration: durationInSeconds })
          .eq('user_id', user_id);
      }
    };

    fetchStartTsAndUpdateDuration();
  }, [user_id]);

  // Handle form submission and update data in the database
  const handleSubmitMail = async () => {
    if (!name || !email) {
      alert('נא למלא שם ומייל');
      return;
    }

    const { error: updateError } = await supabase
      .from('User_records')
      .update({ personal_info: true })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Error updating User_records:', updateError);
      alert('שגיאה בעדכון הנתונים');
      return;
    }

    const { error: insertError } = await supabase
      .from('User_mails')
      .insert([{ name, email }]);

    if (insertError) {
      console.error('Error inserting into User_mails:', insertError);
      alert('שגיאה בשליחת הפרטים. נסה שוב.');
      return;
    }

    setPersonalInfoUpdated(true);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>תודה רבה!</h1>
      <p>
        התשבות שלך יעזרו לחשוף במעט את השינויים שהחברה הדתית עוברת ובעז"ה תעזור להעמיק את הדיון הפנימי והחשוב שקורה בחברה שלנו.
        <br />
        וכמובן, יעזור לי לסיים את התואר!
        <br />
        לשאלות, מענות טענות והמשיך הדיון ניתן ליצור איתי קשר בווטסאפ: 0544705188
        <br />
        <br />
        וכמובן, ניתן להשאיר פרטי התקשרות למטה ואעדכן במייל באיך הפרויקט מתגלגל
        <br />
        שוב תודה. שי אברג'ל
      </p>

      <div style={{ margin: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            style={{ marginRight: '0rem' }}
          />
          אני רוצה לקבל עדכונים
        </label>
      </div>

      {checked && (
        <div style={{ marginBottom: '1rem' }}>
          <p>שמך וכתובת המייל נשמרים בנפרד מהתשובות לסקר, אנונימיותך נשמרת.</p>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <input
              type="email"
              placeholder="כתובת מייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button onClick={handleSubmitMail} style={{ padding: '0.5rem 1rem' }}>
            שלח פרטים
          </button>
        </div>
      )}

      {personalInfoUpdated && <p style={{ color: 'green' }}>הפרטים שלך עודכנו בהצלחה!</p>}

      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}
      >
        חזרה לדף הבית
      </button>
    </div>
  );
};

export default EndingScreen;
