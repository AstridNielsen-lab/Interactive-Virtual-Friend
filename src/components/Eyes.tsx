import React from 'react';
import { EyesProps } from '../types';

const Eyes: React.FC<EyesProps> = ({ emotion, blinking }) => {
  const baseEyeStyle = "w-32 h-32 md:w-40 md:h-40 relative transition-all duration-300";
  
  const getEyeStyles = () => {
    switch (emotion) {
      case 'happy':
        return {
          containerStyle: `${baseEyeStyle} bg-blue-500`,
          pupilStyle: "absolute w-12 h-12 md:w-16 md:h-16 bg-black",
          pupilPosition: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          shape: "square"
        };
      case 'sad':
        return {
          containerStyle: `${baseEyeStyle} bg-blue-400`,
          pupilStyle: "absolute w-12 h-12 md:w-16 md:h-16 bg-black",
          pupilPosition: "bottom-6 left-1/2 transform -translate-x-1/2",
          shape: "pentagon"
        };
      case 'angry':
        return {
          containerStyle: `${baseEyeStyle} bg-red-500 transform -rotate-12 animate-shake`,
          pupilStyle: "absolute w-12 h-12 md:w-16 md:h-16 bg-black",
          pupilPosition: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          shape: "triangle"
        };
      case 'surprised':
        return {
          containerStyle: `${baseEyeStyle} bg-purple-400`,
          pupilStyle: "absolute w-16 h-16 md:w-20 md:h-20 bg-black",
          pupilPosition: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          shape: "octagon"
        };
      case 'thinking':
        return {
          containerStyle: `${baseEyeStyle} bg-green-400`,
          pupilStyle: "absolute w-10 h-10 md:w-14 md:h-14 bg-black",
          pupilPosition: "top-1/2 right-4 transform -translate-y-1/2",
          shape: "hexagon"
        };
      case 'excited':
        return {
          containerStyle: `${baseEyeStyle} bg-pink-400 animate-bounce-slow`,
          pupilStyle: "absolute w-12 h-12 md:w-16 md:h-16 bg-black",
          pupilPosition: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          shape: "star"
        };
      case 'sleepy':
        return {
          containerStyle: `${baseEyeStyle} bg-indigo-400`,
          pupilStyle: "absolute w-24 h-8 bg-black",
          pupilPosition: "top-1/2 transform -translate-y-1/2",
          shape: "rectangle"
        };
      default:
        return {
          containerStyle: `${baseEyeStyle} bg-blue-500`,
          pupilStyle: "absolute w-12 h-12 md:w-16 md:h-16 bg-black",
          pupilPosition: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          shape: "square"
        };
    }
  };

  const styles = getEyeStyles();
  const blinkClass = blinking ? "scale-y-[0.1]" : "";

  const getShapeClass = (shape: string) => {
    switch (shape) {
      case 'triangle':
        return 'clip-path-triangle';
      case 'pentagon':
        return 'clip-path-pentagon';
      case 'hexagon':
        return 'clip-path-hexagon';
      case 'octagon':
        return 'clip-path-octagon';
      case 'star':
        return 'clip-path-star';
      case 'rectangle':
        return 'rounded-none';
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-none';
    }
  };

  return (
    <div className="flex justify-center space-x-8 md:space-x-12">
      <div className={`${styles.containerStyle} ${blinkClass} ${getShapeClass(styles.shape)}`}>
        <div className={`${styles.pupilStyle} ${styles.pupilPosition}`}></div>
      </div>
      <div className={`${styles.containerStyle} ${blinkClass} ${getShapeClass(styles.shape)}`}>
        <div className={`${styles.pupilStyle} ${styles.pupilPosition}`}></div>
      </div>
    </div>
  );
};

export default Eyes;