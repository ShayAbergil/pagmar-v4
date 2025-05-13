import React, { useEffect } from 'react';
import './AlartMessage.css'; 

const CustomAlert = ({ message, onClose }) => {
  useEffect(() => {
    const dismiss = () => onClose();

    // Auto-dismiss after 3 seconds
    const timeout = setTimeout(dismiss, 3000);

    // Dismiss on user actions
    window.addEventListener('click', dismiss);
    window.addEventListener('keydown', dismiss);
    window.addEventListener('scroll', dismiss);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', dismiss);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('scroll', dismiss);
    };
  }, [onClose]);

  return (
    <div className="custom-alert-backdrop">
      <div className="custom-alert-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;
