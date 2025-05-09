import React, { useState, useEffect } from 'react';
import VirtualFriend from './components/VirtualFriend';
import ChatContainer from './components/ChatContainer';
import SplashScreen from './components/SplashScreen';
import { Emotion } from './types';
import { getRandomBlinkInterval, getRandomEmotion, toggleMute } from './services/EmotionService';
import { MessageSquare, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('happy');
  const [blinking, setBlinking] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, getRandomBlinkInterval());

    return () => clearInterval(blinkTimer);
  }, []);

  // Random emotion changes
  useEffect(() => {
    const emotionTimer = setInterval(() => {
      if (!showChat) {
        setCurrentEmotion(getRandomEmotion());
      }
    }, 5000);

    return () => clearInterval(emotionTimer);
  }, [showChat]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript;
        if (text.trim()) {
          const chatContainer = document.querySelector('[data-chat-input]') as HTMLInputElement;
          if (chatContainer) {
            chatContainer.value = text;
            chatContainer.dispatchEvent(new Event('submit', { bubbles: true }));
          }
        }
      };

      recognition.onend = () => {
        if (isListening && !pushToTalk) {
          recognition.start();
        }
      };

      setRecognition(recognition);
    }
  }, [isListening, pushToTalk]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handlePushToTalk = () => {
    if (!recognition) return;
    
    if (!pushToTalk) {
      recognition.start();
      setPushToTalk(true);
    } else {
      recognition.stop();
      setPushToTalk(false);
    }
  };

  const handleToggleMute = () => {
    const newMutedState = toggleMute();
    setIsMuted(newMutedState);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <VirtualFriend currentEmotion={currentEmotion} blinking={blinking} />
          
          <div className="fixed bottom-8 right-8 flex flex-col gap-4">
            <button
              onClick={handleToggleMute}
              className={`${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
              } text-white p-4 rounded-full shadow-lg transition-all`}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all"
            >
              <MessageSquare size={24} />
            </button>
            
            <button
              onClick={toggleListening}
              className={`${
                isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
              } text-white p-4 rounded-full shadow-lg transition-all`}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <button
              onMouseDown={handlePushToTalk}
              onMouseUp={handlePushToTalk}
              onMouseLeave={() => pushToTalk && handlePushToTalk()}
              className={`${
                pushToTalk ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
              } text-white p-4 rounded-full shadow-lg transition-all`}
            >
              <Mic size={24} />
            </button>
          </div>
        </div>
      </main>

      {showChat && (
        <div className="fixed bottom-24 right-24 w-96 h-[600px] z-50">
          <ChatContainer onEmotionChange={setCurrentEmotion} />
        </div>
      )}
    </div>
  );
}

export default App;