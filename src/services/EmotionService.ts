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

// Function to get the best Brazilian Portuguese female voice
const getBrazilianPortugueseVoice = (): SpeechSynthesisVoice | null => {
  const preferredVoices = [
    'Google português do Brasil',
    'Microsoft Maria Desktop - Portuguese (Brazil)',
    'Luciana',
    'Helena'
  ];

  // First try to find one of our preferred voices
  for (const preferredVoice of preferredVoices) {
    const voice = voices.find(v => v.name === preferredVoice);
    if (voice) return voice;
  }

  // Try to find any Brazilian Portuguese female voice
  const brPortugueseVoice = voices.find(voice => 
    (voice.lang === 'pt-BR' || voice.lang === 'pt_BR') && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('mulher') ||
     voice.name.toLowerCase().includes('feminino'))
  );

  if (brPortugueseVoice) return brPortugueseVoice;

  // Fallback to any Portuguese voice
  const portugueseVoice = voices.find(voice => 
    voice.lang.startsWith('pt') && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('mulher') ||
     voice.name.toLowerCase().includes('feminino'))
  );

  return portugueseVoice || null;
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

// Carioca accent characteristics
const cariocaAccentModulation = {
  // Pitch modulation for "s" and "z" palatalization
  palatalization: 1.1,
  // Rate variation for melodic intonation
  melodicRate: 1.05,
  // Pitch variation for open vowels
  openVowels: 1.15,
  // Base pitch for feminine voice
  femininePitch: 1.2
};

export const speakMessage = (text: string, emotion: Emotion) => {
  if ('speechSynthesis' in window && !isMuted) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const brPortugueseVoice = getBrazilianPortugueseVoice();
    if (brPortugueseVoice) {
      utterance.voice = brPortugueseVoice;
    }

    // Base voice settings for Carioca accent
    utterance.lang = 'pt-BR';
    utterance.pitch = cariocaAccentModulation.femininePitch;
    utterance.rate = cariocaAccentModulation.melodicRate;

    // Emotion-specific voice modulations with Carioca characteristics
    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = cariocaAccentModulation.femininePitch * 1.2 * emotionIntensity;
        utterance.rate = cariocaAccentModulation.melodicRate * 1.15 * emotionIntensity;
        break;
      case 'sad':
        utterance.pitch = cariocaAccentModulation.femininePitch * 0.9;
        utterance.rate = cariocaAccentModulation.melodicRate * 0.85;
        break;
      case 'angry':
        utterance.pitch = cariocaAccentModulation.femininePitch * 1.3 * emotionIntensity;
        utterance.rate = cariocaAccentModulation.melodicRate * 1.2 * emotionIntensity;
        break;
      case 'surprised':
        utterance.pitch = cariocaAccentModulation.femininePitch * 1.4;
        utterance.rate = cariocaAccentModulation.melodicRate * 1.1;
        break;
      case 'love':
        utterance.pitch = cariocaAccentModulation.femininePitch * 1.2;
        utterance.rate = cariocaAccentModulation.melodicRate * 0.95;
        break;
      case 'thinking':
        utterance.pitch = cariocaAccentModulation.femininePitch * 1.1;
        utterance.rate = cariocaAccentModulation.melodicRate * 0.9;
        break;
      case 'sleepy':
        utterance.pitch = cariocaAccentModulation.femininePitch * 0.9;
        utterance.rate = cariocaAccentModulation.melodicRate * 0.8;
        break;
      default:
        utterance.pitch = cariocaAccentModulation.femininePitch;
        utterance.rate = cariocaAccentModulation.melodicRate;
    }

    // Apply Carioca-specific modulations
    utterance.pitch *= cariocaAccentModulation.palatalization;
    utterance.rate *= cariocaAccentModulation.melodicRate;

    window.speechSynthesis.speak(utterance);
  }
};
