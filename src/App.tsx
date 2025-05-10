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
  const [onMessageCallback, setOnMessageCallback] = useState<((message: string) => void) | null>(null);

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
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'pt-BR';
        
        recognition.onstart = () => {
          setShowChat(true);
          setHasInteracted(true);
          setInterimTranscript('');
          if (silenceTimer) clearTimeout(silenceTimer);
        };

        recognition.onresult = (event) => {
          try {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }

            setInterimTranscript(interimTranscript);

            if (finalTranscript && onMessageCallback) {
              onMessageCallback(finalTranscript.trim());
              recognition.stop();
            }
          } catch (error) {
            console.error('Error processing speech result:', error);
            recognition.stop();
          }
        };

        recognition.onaudiostart = () => {
          if (silenceTimer) clearTimeout(silenceTimer);
          
          const timer = setTimeout(() => {
            recognition.stop();
          }, 10000);
          
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
          if (event.error === 'not-allowed') {
            alert('Por favor, permita o acesso ao microfone para usar o recurso de voz.');
          }
          recognition.stop();
          setIsListening(false);
          setPushToTalk(false);
        };

        setRecognition(recognition);
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        alert('Erro ao inicializar o reconhecimento de voz. Por favor, tente novamente.');
      }
    } else {
      console.warn('Speech recognition not supported in this browser');
      alert('Seu navegador não suporta reconhecimento de voz.');
    }
  }, [onMessageCallback, silenceTimer]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasInteracted(true);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }
    
    try {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
      alert('Erro ao iniciar o reconhecimento de voz. Por favor, tente novamente.');
    }
  };

  const handlePushToTalk = () => {
    if (!recognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }
    
    try {
      if (!pushToTalk) {
        recognition.start();
        setPushToTalk(true);
      } else {
        recognition.stop();
      }
    } catch (error) {
      console.error('Error with push-to-talk:', error);
      setPushToTalk(false);
      alert('Erro ao usar o push-to-talk. Por favor, tente novamente.');
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
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col relative">
      <main className="flex-1 flex items-center justify-center p-4 pb-32">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2">
            <VirtualFriend currentEmotion={currentEmotion} blinking={blinking} />
          </div>
          
          {showChat && (
            <div className="w-full md:w-1/2 h-[500px] max-h-[80vh]">
              <ChatContainer 
                onEmotionChange={setCurrentEmotion} 
                setOnMessageCallback={setOnMessageCallback}
              />
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-4 px-4 z-50">
        {interimTranscript && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {interimTranscript}
          </div>
        )}
        
        <button
          onClick={handleToggleMute}
          className={`${
            isMuted ? 'bg-red-600 active:bg-red-700' : 'bg-purple-600 active:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all touch-manipulation`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <button
          onClick={handleToggleChat}
          className={`${
            showChat ? 'bg-purple-800' : 'bg-purple-600 active:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all touch-manipulation`}
          aria-label="Toggle chat"
        >
          <MessageSquare size={24} />
        </button>
        
        <button
          onClick={toggleListening}
          className={`${
            isListening ? 'bg-red-600 active:bg-red-700' : 'bg-purple-600 active:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all touch-manipulation`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button
          onTouchStart={handlePushToTalk}
          onTouchEnd={handlePushToTalk}
          onMouseDown={handlePushToTalk}
          onMouseUp={handlePushToTalk}
          onMouseLeave={() => pushToTalk && handlePushToTalk()}
          className={`${
            pushToTalk ? 'bg-red-600 active:bg-red-700' : 'bg-purple-600 active:bg-purple-700'
          } text-white p-4 rounded-full shadow-lg transition-all touch-manipulation`}
          aria-label="Push to talk"
        >
          <Mic size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;
