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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, getRandomBlinkInterval());

    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const emotionTimer = setInterval(() => {
      if (!showChat && !hasInteracted) {
        setCurrentEmotion(getRandomEmotion());
      }
    }, 5000);

    return () => clearInterval(emotionTimer);
  }, [showChat, hasInteracted]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      
      recognition.onstart = () => {
        setShowChat(true);
        setHasInteracted(true);
        setInterimTranscript('');
        if (silenceTimer) clearTimeout(silenceTimer);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setInterimTranscript(transcript);

        if (event.results[0].isFinal) {
          const finalTranscript = transcript.trim();
          if (finalTranscript) {
            const chatContainer = document.querySelector('[data-chat-input]') as HTMLInputElement;
            if (chatContainer) {
              chatContainer.value = finalTranscript;
              chatContainer.dispatchEvent(new Event('submit', { bubbles: true }));
            }
          }
          recognition.stop();
        }
      };

      recognition.onaudiostart = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        
        const timer = setTimeout(() => {
          recognition.stop();
        }, 5000); // Stop after 5 seconds maximum
        
        setSilenceTimer(timer);
      };

      recognition.onend = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        setIsListening(false);
        setPushToTalk(false);
        setInterimTranscript('');
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognition.stop();
      };

      setRecognition(recognition);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasInteracted(true);
  };

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
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
    }
  };

  const handleToggleMute = () => {
    const newMutedState = toggleMute();
    setIsMuted(newMutedState);
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
    setHasInteracted(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2">
            <VirtualFriend currentEmotion={currentEmotion} blinking={blinking} />
          </div>
          
          {showChat && (
            <div className="w-full md:w-1/2 h-[600px]">
              <ChatContainer onEmotionChange={setCurrentEmotion} />
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-4 px-4">
        {interimTranscript && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {interimTranscript}
          </div>
        )}
        
        <button
          onClick={handleToggleMute}
          className={`${
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <button
          onClick={handleToggleChat}
          className={`${
            showChat ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all`}
          aria-label="Toggle chat"
        >
          <MessageSquare size={24} />
        </button>
        
        <button
          onClick={toggleListening}
          className={`${
            isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
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
          aria-label="Push to talk"
        >
          <Mic size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;
