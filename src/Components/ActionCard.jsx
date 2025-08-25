import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const ActionCard = ({ title, subtitle, imgSrc, buttonText, imgWidth = 100, imgHeight = 100, link }) => {
  const navigate = useNavigate();
  return (
    <div className="action-card">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button onClick={() => link && navigate(link)}>{buttonText}</button>
      </div>
      <img
        src={imgSrc}
        alt=""
        style={{
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
          objectFit: 'contain',
          background: '#fff',
          borderRadius: '16px',
          display: 'block'
        }}
      />
    </div>
  )
}

export default ActionCard;
