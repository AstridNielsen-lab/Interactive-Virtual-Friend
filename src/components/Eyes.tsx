import React from 'react';
import { EyesProps } from '../types';

const Eyes: React.FC<EyesProps> = ({ emotion, blinking }) => {
  const baseEyeStyle = "relative w-20 h-28 md:w-24 md:h-32 bg-black rounded-full overflow-hidden transition-all duration-200 ease-linear shadow-inner";

  const getEyeTransform = () => {
    switch (emotion) {
      case 'happy':
        return 'scaleY(0.7)';
      case 'sad':
        return 'scaleY(1.2) rotate(-10deg)';
      case 'angry':
        return 'rotate(15deg)';
      case 'surprised':
        return 'scale(1.2)';
      case 'thinking':
        return 'translateX(4px)';
      case 'excited':
        return 'scale(1.1) rotate(-5deg)';
      case 'sleepy':
        return 'scaleY(0.2)';
      default:
        return 'scale(1)';
    }
  };

  const pupilStyle = "absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-gray-300 to-white rounded-full shadow";

  const blinkStyle = blinking ? 'scaleY(0.1)' : '';

  return (
    <div className="flex justify-center gap-12 md:gap-16">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={baseEyeStyle}
          style={{
            transform: `${getEyeTransform()} ${blinkStyle} ${emotion === 'angry' && i === 1 ? 'rotate(-15deg)' : ''}`
          }}
        >
          <div className={pupilStyle}></div>
        </div>
      ))}
    </div>
  );
};

export default Eyes;
