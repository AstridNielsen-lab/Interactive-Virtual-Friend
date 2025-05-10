import React from 'react';
import { VirtualFriendProps } from '../types';
import Eyes from './Eyes';

const VirtualFriend: React.FC<VirtualFriendProps> = ({ currentEmotion, blinking }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-square bg-gray-900 rounded-3xl shadow-lg p-8 overflow-hidden border-2 border-blue-400/20">
      {/* Robot head shape */}
      <div className="absolute inset-0 m-4 rounded-2xl border-2 border-blue-400/20"></div>
      
      {/* Antenna */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-2 h-8 bg-blue-400/30 rounded-full"></div>
        <div className="w-4 h-4 bg-blue-400 rounded-full -mt-1 animate-pulse"></div>
      </div>
      
      {/* Side panels */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-24 bg-blue-400/30 rounded-r-lg"></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-24 bg-blue-400/30 rounded-l-lg"></div>
      
      {/* Eyes */}
      <div className="relative flex items-center justify-center z-10">
        <Eyes emotion={currentEmotion} blinking={blinking} />
      </div>
      
      {/* Decorative circuits */}
      <div className="absolute bottom-4 left-4 w-16 h-2 bg-blue-400/30 rounded-full"></div>
      <div className="absolute bottom-8 right-4 w-12 h-2 bg-blue-400/30 rounded-full"></div>
      <div className="absolute top-8 left-4 w-8 h-2 bg-blue-400/30 rounded-full"></div>
    </div>
  );
};

export default VirtualFriend;