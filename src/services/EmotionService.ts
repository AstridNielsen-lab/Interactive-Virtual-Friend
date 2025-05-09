import { Emotion } from '../types';

const emotionPatterns = {
  happy: [
    'happy', 'glad', 'joy', 'excellent', 'great', 'awesome', 'wonderful', 
    'perfect', 'good', 'love', 'like', 'enjoy', 'fun', 'haha', 'lol'
  ],
  sad: [
    'sad', 'sorry', 'unfortunate', 'regret', 'unhappy', 'upset', 'depressed', 
    'disappointed', 'bad', 'miss', 'awful', 'terrible'
  ],
  angry: [
    'angry', 'mad', 'annoyed', 'frustrated', 'upset', 'hate', 'dislike',
    'terrible', 'worst', 'furious', 'rage'
  ],
  surprised: [
    'wow', 'amazing', 'incredible', 'unbelievable', 'surprised', 'shocked',
    'unexpected', 'astonished', 'what', 'really', 'seriously'
  ],
  thinking: [
    'think', 'question', 'curious', 'wonder', 'how', 'why', 'what', 'when', 'where',
    'consider', 'perhaps', 'maybe', 'possibly', 'hmm'
  ],
  excited: [
    'excited', 'amazing', 'fantastic', 'incredible', 'wonderful', 'wow', 'cool',
    'awesome', 'super', 'yay', 'woohoo', 'yes'
  ],
  love: [
    'love', 'adore', 'heart', 'sweet', 'darling', 'dear', 'lovely'
  ],
  sleepy: [
    'tired', 'sleepy', 'exhausted', 'rest', 'nap', 'yawn', 'zzz'
  ],
  confused: [
    'confused', 'weird', 'strange', 'odd', 'puzzled', 'unsure', 'lost'
  ]
};

let isMuted = false;

export const toggleMute = () => {
  isMuted = !isMuted;
  if (isMuted) {
    window.speechSynthesis.cancel();
  }
  return isMuted;
};

export const detectEmotion = (text: string): Emotion => {
  let detectedEmotion: Emotion = 'happy';
  let highestScore = 0;

  const lowerText = text.toLowerCase();

  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    const matchCount = patterns.reduce((count, pattern) => {
      return count + (lowerText.includes(pattern) ? 1 : 0);
    }, 0);

    if (matchCount > highestScore) {
      highestScore = matchCount;
      detectedEmotion = emotion as Emotion;
    }
  });

  if (lowerText.includes('?')) {
    detectedEmotion = 'thinking';
  }

  return detectedEmotion;
};

export const getRandomBlinkInterval = (): number => {
  return Math.floor(Math.random() * 3000) + 2000;
};

export const getRandomEmotion = (): Emotion => {
  const emotions: Emotion[] = ['happy', 'excited', 'thinking', 'surprised'];
  return emotions[Math.floor(Math.random() * emotions.length)];
};

export const speakMessage = (text: string, emotion: Emotion) => {
  if ('speechSynthesis' in window && !isMuted) {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and select a feminine voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Adjust voice parameters based on emotion
    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = 1.3;
        utterance.rate = 1.1;
        break;
      case 'sad':
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        break;
      case 'angry':
        utterance.pitch = 1.4;
        utterance.rate = 1.2;
        break;
      case 'surprised':
        utterance.pitch = 1.5;
        utterance.rate = 1.1;
        break;
      default:
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }
};