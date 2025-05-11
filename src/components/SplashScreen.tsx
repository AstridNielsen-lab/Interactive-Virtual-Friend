import React, { useState } from 'react';
import { Bot } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setShowConsent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleConsent = () => {
    setShowConsent(false);
    setTimeout(onComplete, 500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
      <div className={`transform transition-all duration-1000 ${isAnimating ? 'scale-100' : 'scale-90'}`}>
        <div className={`transition-all duration-1000 ${isAnimating ? 'animate-bounce-slow' : ''}`}>
          <Bot className="w-24 h-24 md:w-32 md:h-32 text-purple-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mt-8 text-center">
          BuddyBot
        </h1>
        <p className="text-purple-400 text-xl md:text-2xl mt-4 animate-pulse text-center">
          Your Expressive Virtual Friend
        </p>
      </div>

      {showConsent && (
        <div className="mt-12 max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/30 transform transition-all duration-500 animate-fade-in">
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to BuddyBot!</h2>
          <p className="text-gray-200 mb-6">
            I'm an expressive virtual friend that can chat with you using dynamic emotions and voice interactions. 
            I'll respond to your messages with facial expressions and voice feedback.
          </p>
          <ul className="text-gray-200 mb-6 space-y-2">
            <li>• Dynamic emotional expressions</li>
            
          </ul>
          <button
            onClick={handleConsent}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Start Chatting with BuddyBot
          </button>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
