import React, { useRef, useState, useEffect } from "react";

const ArcSlider = ({ label, field, onValueChange, tickLabels = {} }) => {
  const svgRef = useRef(null);
  const [value, setValue] = useState(5);
  const [angle, setAngle] = useState(Math.PI);

  const width = 300;
  const height = 160;  // Adjusted height for better arc positioning
  const radius = 120;

  // Position center of the arc to be on the top half
  const centerX = width / 2;
  const centerY = height; // Lower centerY to position arc in the top half

  const polarToCartesian = (angle) => {
    return {
      x: centerX + radius * Math.cos(angle), 
      y: centerY - radius * Math.sin(angle), // Moves dot along the top half
    };
  };

  const handleMouseMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = centerY - (e.clientY - rect.top);
    const angle = Math.atan2(y, x);

    if (angle >= 0 && angle <= Math.PI) {
      setAngle(angle);
      const newValue = Math.round((angle / Math.PI) * 9 + 1);
      setValue(newValue);
      onValueChange(field, newValue);
    }
  };

  const { x, y } = polarToCartesian(angle);
  const gradientId = "arcGradient";

  return (
    <div className="arc-slider-container">
      <svg
        ref={svgRef}
        width={width}
        height={height + 20}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMouseMove(e);
        }}
        onMouseDown={handleMouseMove}
        style={{ cursor: "pointer" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8b0b9" />
            <stop offset="100%" stopColor="#f7c525" />
          </linearGradient>
        </defs>

        {/* Arc now properly positioned on the top half */}
        <path
          d={`M ${polarToCartesian(Math.PI).x},${polarToCartesian(Math.PI).y} A ${radius},${radius} 0 0 1 ${polarToCartesian(0).x},${polarToCartesian(0).y}`}
          stroke={`url(#${gradientId})`}
          fill="none"
          strokeWidth="5"
        />
        
        {/* Dot positioned on the top half of the circle */}
        <circle cx={x} cy={y} r="10" fill="#091d3b" />
        
        {/* Label near the arc */}
        <text
          x={centerX}
          y={centerY - radius}
          textAnchor="middle"
          fontSize="14"
          fill="#091d3b"
        >
          {label}
        </text>

        {/* Add labels to ticks */}
        {Object.entries(tickLabels).map(([val, text]) => {
          const tickAngle = ((val - 1) / 9) * Math.PI;
          const { x: labelX, y: labelY } = polarToCartesian(tickAngle);
          return (
            <text
              key={val}
              x={labelX}
              y={labelY - 12}
              textAnchor="middle"
              fontSize="14"
              fill="#091d3b"
            >
              {text}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default ArcSlider;
