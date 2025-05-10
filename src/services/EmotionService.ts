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
let lastEmotion: Emotion = 'happy';
let emotionIntensity = 1;

export const toggleMute = () => {
  isMuted = !isMuted;
  if (isMuted) {
    window.speechSynthesis.cancel();
  }
  return isMuted;
};

export const detectEmotion = (text: string): { emotion: Emotion; intensity: number } => {
  let detectedEmotion: Emotion = 'happy';
  let highestScore = 0;
  let intensity = 1;

  const lowerText = text.toLowerCase();

  // Calculate emotion scores
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    const matchCount = patterns.reduce((count, pattern) => {
      const matches = (lowerText.match(new RegExp(pattern, 'gi')) || []).length;
      return count + matches;
    }, 0);

    if (matchCount > highestScore) {
      highestScore = matchCount;
      detectedEmotion = emotion as Emotion;
      intensity = Math.min(1.5, 1 + (matchCount * 0.1)); // Increase intensity based on matches
    }
  });

  // Special cases
  if (lowerText.includes('?')) {
    detectedEmotion = 'thinking';
    intensity = 1.2;
  }

  // Emotion persistence
  if (detectedEmotion === lastEmotion) {
    intensity = Math.min(1.5, intensity + 0.1); // Increase intensity for persistent emotions
  }

  lastEmotion = detectedEmotion;
  emotionIntensity = intensity;

  return { emotion: detectedEmotion, intensity };
};

export const getRandomBlinkInterval = (): number => {
  // More frequent blinking for certain emotions
  const baseInterval = Math.floor(Math.random() * 3000) + 2000;
  return lastEmotion === 'surprised' || lastEmotion === 'excited' 
    ? baseInterval * 0.7 
    : baseInterval;
};

export const getRandomEmotion = (): Emotion => {
  const emotions: Emotion[] = ['happy', 'excited', 'thinking', 'surprised'];
  const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  lastEmotion = newEmotion;
  return newEmotion;
};

export const speakMessage = (text: string, emotion: Emotion) => {
  if ('speechSynthesis' in window && !isMuted) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Enhanced emotion-based voice parameters
    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = 1.3 * emotionIntensity;
        utterance.rate = 1.1 * emotionIntensity;
        break;
      case 'sad':
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        break;
      case 'angry':
        utterance.pitch = 1.4 * emotionIntensity;
        utterance.rate = 1.2 * emotionIntensity;
        break;
      case 'surprised':
        utterance.pitch = 1.5;
        utterance.rate = 1.1;
        break;
      case 'love':
        utterance.pitch = 1.3;
        utterance.rate = 0.95;
        break;
      default:
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }
};
