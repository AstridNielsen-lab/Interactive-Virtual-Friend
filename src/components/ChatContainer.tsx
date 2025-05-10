import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Message, Emotion } from '../types';
import { generateResponse, formatChatHistoryForAPI } from '../services/GeminiService';
import { speakMessage } from '../services/EmotionService';
import { getUserData, saveUserData, addMessage, getRandomProactiveMessage } from '../services/UserService';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

interface ChatContainerProps {
  onEmotionChange: (emotion: Emotion) => void;
  setOnMessageCallback: (callback: (message: string) => void) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onEmotionChange, setOnMessageCallback }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = getUserData();
    setMessages(userData.messages);
    
    if (!userData.name) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        text: "Fala, meu parceiro! Eu sou o BuddyBot, seu amigo virtual carioca! Qual é o seu nome?",
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'happy'
      };
      
      setMessages([welcomeMessage]);
      onEmotionChange('happy');
      speakMessage(welcomeMessage.text, 'happy');
    } else {
      setUserName(userData.name);
      
      const proactiveTimer = setInterval(() => {
        const lastInteraction = new Date(userData.lastInteraction);
        const timeSinceLastInteraction = Date.now() - lastInteraction.getTime();
        
        if (timeSinceLastInteraction > 5 * 60 * 1000) {
          const proactiveMessage: Message = {
            id: uuidv4(),
            text: getRandomProactiveMessage(userData.name),
            sender: 'bot',
            timestamp: new Date(),
            emotion: 'excited'
          };
          
          setMessages(prev => [...prev, proactiveMessage]);
          onEmotionChange('excited');
          speakMessage(proactiveMessage.text, 'excited');
          addMessage(proactiveMessage);
        }
      }, 60000);
      
      return () => clearInterval(proactiveTimer);
    }
  }, [onEmotionChange]);

  useEffect(() => {
    setOnMessageCallback((message: string) => handleSendMessage(message));
  }, [setOnMessageCallback]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);
    setLoading(true);
    
    try {
      if (!userName) {
        const name = text.split(' ')[0];
        setUserName(name);
        saveUserData({ name });
        
        const response: Message = {
          id: uuidv4(),
          text: `Massa conhecer você, ${name}! Tô muito feliz de ser seu parceiro! Pode me contar qualquer coisa que eu tô aqui pra trocar uma ideia!`,
          sender: 'bot',
          timestamp: new Date(),
          emotion: 'excited'
        };
        
        setMessages(prev => [...prev, response]);
        addMessage(response);
        onEmotionChange('excited');
        speakMessage(response.text, 'excited');
      } else {
        const recentMessages = messages.slice(-6).map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));
        
        const formattedHistory = formatChatHistoryForAPI([
          ...recentMessages,
          { sender: 'user', text }
        ]);
        
        const response = await generateResponse(text, formattedHistory);
        
        const botMessage: Message = {
          id: uuidv4(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          emotion: response.emotion
        };
        
        setMessages(prev => [...prev, botMessage]);
        addMessage(botMessage);
        onEmotionChange(response.emotion);
        speakMessage(response.text, response.emotion);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Eita, deu um bug aqui! Vamo tentar de novo, parceiro?",
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'surprised'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      addMessage(errorMessage);
      onEmotionChange('surprised');
      speakMessage(errorMessage.text, 'surprised');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl h-full overflow-hidden border border-purple-500/30">
      <div className="bg-purple-900/50 text-white p-4 text-center">
        <h2 className="text-xl font-bold">
          {userName ? `Papo com ${userName}` : 'BuddyBot'}
        </h2>
      </div>
      
      <ChatHistory messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatContainer;
