import React from 'react';
import { Bot } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="animate-bounce-slow">
        <Bot className="w-32 h-32 text-purple-500" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mt-8 text-center">
        BuddyBot
      </h1>
      <p className="text-purple-400 text-xl md:text-2xl mt-4 animate-pulse">
        Like Look Toys
      </p>
    </div>
  );
};

export default SplashScreen;