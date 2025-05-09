export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking' | 'excited' | 'love' | 'sleepy' | 'confused';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: Emotion;
}

export interface ChatHistoryProps {
  messages: Message[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export interface VirtualFriendProps {
  currentEmotion: Emotion;
  blinking: boolean;
}

export interface EyesProps {
  emotion: Emotion;
  blinking: boolean;
}