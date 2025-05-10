import React, { useEffect, useState } from 'react';
import { EyesProps, Emotion } from '../types';

const Eyes: React.FC<EyesProps> = ({ emotion, blinking }) => {
  const [transitionEmotion, setTransitionEmotion] = useState<Emotion>(emotion);
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    // Smooth transition between emotions
    const transitionTimer = setTimeout(() => {
      setTransitionEmotion(emotion);
    }, 200);

    // Emotion intensity based on repeated patterns
    const intensityMultiplier = Math.min(1.5, 1 + (Math.random() * 0.5));
    setIntensity(intensityMultiplier);

    return () => clearTimeout(transitionTimer);
  }, [emotion]);

  const baseEyeStyle = "relative w-20 h-28 md:w-24 md:h-32 bg-black rounded-full overflow-hidden transition-all duration-300 ease-in-out shadow-inner";

  const getEyeTransform = () => {
    const baseTransforms = {
      happy: `scaleY(${0.7 * intensity}) rotate(${2 * intensity}deg)`,
      sad: `scaleY(${1.2 * intensity}) rotate(${-10 * intensity}deg)`,
      angry: `rotate(${15 * intensity}deg) scaleX(${0.85 * intensity})`,
      surprised: `scale(${1.2 * intensity})`,
      thinking: `translateX(${4 * intensity}px) rotate(${5 * intensity}deg)`,
      excited: `scale(${1.1 * intensity}) rotate(${-5 * intensity}deg)`,
      sleepy: `scaleY(${0.2 * intensity})`,
      love: `scale(${1.1 * intensity}) rotate(${-3 * intensity}deg)`,
      confused: `rotate(${10 * intensity}deg) scaleY(${0.9 * intensity})`
    };

    return baseTransforms[transitionEmotion] || 'scale(1)';
  };

  const getEyeColor = () => {
    const colors = {
      angry: 'bg-red-900',
      sad: 'bg-blue-900',
      happy: 'bg-black',
      excited: 'bg-purple-900',
      love: 'bg-pink-900',
      default: 'bg-black'
    };

    return colors[transitionEmotion] || colors.default;
  };

  const getPupilStyle = () => {
    const baseStyle = "absolute w-1/2 h-1/2 bg-gradient-to-br from-gray-300 to-white rounded-full shadow transition-all duration-300";
    
    const positions = {
      thinking: 'top-1/3 left-2/3',
      surprised: 'top-1/4 left-1/4',
      happy: 'top-1/3 left-1/4',
      sad: 'top-1/3 left-1/4',
      angry: 'top-1/4 left-1/4',
      default: 'top-1/4 left-1/4'
    };

    return `${baseStyle} ${positions[transitionEmotion] || positions.default}`;
  };

  const blinkStyle = blinking ? 'scaleY(0.1)' : '';

  return (
    <div className="flex justify-center gap-12 md:gap-16">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`${baseEyeStyle} ${getEyeColor()}`}
          style={{
            transform: `${getEyeTransform()} ${blinkStyle} ${
              transitionEmotion === 'angry' && i === 1 ? 'rotate(-15deg)' : ''
            }`,
          }}
        >
          <div className={getPupilStyle()}></div>
          
          {/* Emotion-specific effects */}
          {transitionEmotion === 'excited' && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-400/20 to-transparent animate-pulse" />
          )}
          {transitionEmotion === 'love' && (
            <div className="absolute inset-0 bg-gradient-to-t from-pink-400/20 to-transparent animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Eyes;
