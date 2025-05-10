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

// Initialize speech synthesis and get voices
let synth = window.speechSynthesis;
let voices: SpeechSynthesisVoice[] = [];

const initVoices = () => {
  voices = synth.getVoices();
};

// Load voices when they become available
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = initVoices;
  initVoices();
}

// Function to get the best American female voice
const getAmericanFemaleVoice = (): SpeechSynthesisVoice | null => {
  const preferredVoices = [
    'Google US English Female',
    'Microsoft Zira Desktop',
    'Samantha',
    'Victoria'
  ];

  // First try to find one of our preferred voices
  for (const preferredVoice of preferredVoices) {
    const voice = voices.find(v => v.name === preferredVoice);
    if (voice) return voice;
  }

  // If no preferred voice is found, try to find any US English female voice
  const americanVoice = voices.find(voice => 
    voice.lang.includes('en-US') && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('woman'))
  );

  if (americanVoice) return americanVoice;

  // Fallback to any English female voice
  const englishVoice = voices.find(voice => 
    voice.lang.includes('en') && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('woman'))
  );

  return englishVoice || null;
};

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

  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    const matchCount = patterns.reduce((count, pattern) => {
      const matches = (lowerText.match(new RegExp(pattern, 'gi')) || []).length;
      return count + matches;
    }, 0);

    if (matchCount > highestScore) {
      highestScore = matchCount;
      detectedEmotion = emotion as Emotion;
      intensity = Math.min(1.5, 1 + (matchCount * 0.1));
    }
  });

  if (lowerText.includes('?')) {
    detectedEmotion = 'thinking';
    intensity = 1.2;
  }

  if (detectedEmotion === lastEmotion) {
    intensity = Math.min(1.5, intensity + 0.1);
  }

  lastEmotion = detectedEmotion;
  emotionIntensity = intensity;

  return { emotion: detectedEmotion, intensity };
};

export const getRandomBlinkInterval = (): number => {
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
    
    const femaleVoice = getAmericanFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Base voice settings for American accent
    utterance.lang = 'en-US';
    utterance.pitch = 1.2; // Slightly higher pitch for feminine voice
    utterance.rate = 1.0;  // Normal speaking rate

    // Emotion-specific voice modulations
    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = 1.4 * emotionIntensity;
        utterance.rate = 1.15 * emotionIntensity;
        break;
      case 'sad':
        utterance.pitch = 1.1;
        utterance.rate = 0.85;
        break;
      case 'angry':
        utterance.pitch = 1.3 * emotionIntensity;
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
      case 'thinking':
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        break;
      case 'sleepy':
        utterance.pitch = 1.1;
        utterance.rate = 0.8;
        break;
      default:
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }
};
