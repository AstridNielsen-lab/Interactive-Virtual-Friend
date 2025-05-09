import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Message, Emotion } from '../types';
import { generateResponse, formatChatHistoryForAPI } from '../services/GeminiService';
import { speakMessage } from '../services/EmotionService';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

interface ChatContainerProps {
  onEmotionChange: (emotion: Emotion) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onEmotionChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      text: "Hi there! I'm your new buddy! How are you feeling today? 😊",
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'happy'
    };
    
    setMessages([welcomeMessage]);
    onEmotionChange('happy');
    speakMessage(welcomeMessage.text, 'happy');
  }, [onEmotionChange]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
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
      onEmotionChange(response.emotion);
      speakMessage(response.text, response.emotion);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Oops! I had a little hiccup. Can we try again?",
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'surprised'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      onEmotionChange('surprised');
      speakMessage(errorMessage.text, 'surprised');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl h-full overflow-hidden border border-purple-500/30">
      <div className="bg-purple-900/50 text-white p-4 text-center">
        <h2 className="text-xl font-bold">Chat with BuddyBot</h2>
      </div>
      
      <ChatHistory messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatContainer;