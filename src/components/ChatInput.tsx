import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ChatInputProps } from '../types';

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
    >
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          data-chat-input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 
                    focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-2 rounded-full ${
            !message.trim() || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 transition-colors'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
      
      {disabled && (
        <p className="text-xs text-gray-500 mt-2 text-center animate-pulse">
          BuddyBot is thinking...
        </p>
      )}
    </form>
  );
};

export default ChatInput;