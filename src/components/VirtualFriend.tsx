import React from 'react';
import { VirtualFriendProps } from '../types';
import Eyes from './Eyes';

const VirtualFriend: React.FC<VirtualFriendProps> = ({ currentEmotion, blinking }) => {
  const getMouthStyle = () => {
    switch (currentEmotion) {
      case 'happy':
        return (
          <div className="w-32 h-16 relative overflow-hidden">
            <div className="absolute w-32 h-32 border-8 border-purple-500 rounded-full -bottom-16"></div>
          </div>
        );
      case 'sad':
        return (
          <div className="w-32 h-16 relative overflow-hidden">
            <div className="absolute w-32 h-32 border-8 border-purple-500 rounded-full -top-16"></div>
          </div>
        );
      case 'angry':
        return (
          <div className="w-32 h-8">
            <div className="w-full h-full bg-purple-500 clip-path-triangle transform rotate-180"></div>
          </div>
        );
      case 'surprised':
        return (
          <div className="w-16 h-16">
            <div className="w-full h-full border-8 border-purple-500 rounded-full"></div>
          </div>
        );
      case 'thinking':
        return (
          <div className="w-16 h-8 relative">
            <div className="absolute w-full h-full border-8 border-purple-500 rounded-full -rotate-12"></div>
          </div>
        );
      case 'excited':
        return (
          <div className="w-32 h-16 relative overflow-hidden animate-bounce">
            <div className="absolute w-32 h-32 border-8 border-purple-500 rounded-full -bottom-16 animate-pulse"></div>
          </div>
        );
      case 'sleepy':
        return (
          <div className="w-24 h-4">
            <div className="w-full h-full border-4 border-purple-500"></div>
          </div>
        );
      default:
        return (
          <div className="w-32 h-16 relative overflow-hidden">
            <div className="absolute w-32 h-32 border-8 border-purple-500 rounded-full -bottom-16"></div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-square bg-black rounded-3xl shadow-2xl p-8 overflow-hidden border-4 border-purple-500/30">
      {/* Robot head shape */}
      <div className="absolute inset-0 m-4 rounded-2xl border-4 border-purple-500/30"></div>
      
      {/* Antenna */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-12 bg-purple-500/30 rounded-full"></div>
        <div className="w-6 h-6 bg-purple-500 rounded-full -mt-2 animate-pulse"></div>
      </div>
      
      {/* Side panels */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-24 bg-purple-500/30 rounded-r-lg"></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-24 bg-purple-500/30 rounded-l-lg"></div>
      
      {/* Eyes container with geometric shapes */}
      <div className="relative flex-1 flex items-center justify-center z-10">
        <Eyes emotion={currentEmotion} blinking={blinking} />
      </div>
      
      {/* Mouth with emotion expressions */}
      <div className="relative flex-1 flex items-center justify-center z-10">
        {getMouthStyle()}
      </div>
      
      {/* Decorative circuits */}
      <div className="absolute bottom-4 left-4 w-16 h-2 bg-purple-500/30 rounded-full"></div>
      <div className="absolute bottom-8 right-4 w-12 h-2 bg-purple-500/30 rounded-full"></div>
      <div className="absolute top-8 left-4 w-8 h-2 bg-purple-500/30 rounded-full"></div>
    </div>
  );
};

export default VirtualFriend;