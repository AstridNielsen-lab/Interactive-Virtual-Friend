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

let synth = window.speechSynthesis;
let voices: SpeechSynthesisVoice[] = [];

const initVoices = () => {
  voices = synth.getVoices();
};

if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = initVoices;
  initVoices();
}

const getBrazilianVoice = (): SpeechSynthesisVoice | null => {
  const preferredVoices = [
    'Google português do Brasil',
    'Microsoft Maria Desktop - Portuguese(Brazil)',
    'Luciana'
  ];

  for (const preferredVoice of preferredVoices) {
    const voice = voices.find(v => v.name === preferredVoice);
    if (voice) return voice;
  }

  const ptBRVoice = voices.find(voice => 
    voice.lang.includes('pt-BR')
  );

  if (ptBRVoice) return ptBRVoice;

  return voices.find(voice => 
    voice.lang.includes('pt') || voice.lang.includes('por')
  ) || null;
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

const voiceModulation = {
  basePitch: 1.0,
  baseRate: 1.0,
  emotional: {
    pitchRange: 0.3,
    rateRange: 0.2,
    volumeRange: 0.15
  }
};

export const speakMessage = (text: string, emotion: Emotion) => {
  if ('speechSynthesis' in window && !isMuted) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const brazilianVoice = getBrazilianVoice();
    if (brazilianVoice) {
      utterance.voice = brazilianVoice;
    }

    utterance.lang = 'pt-BR';
    utterance.pitch = voiceModulation.basePitch;
    utterance.rate = voiceModulation.baseRate;

    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = voiceModulation.basePitch + (voiceModulation.emotional.pitchRange * emotionIntensity);
        utterance.rate = voiceModulation.baseRate + (voiceModulation.emotional.rateRange * emotionIntensity);
        utterance.volume = 1;
        break;
      case 'sad':
        utterance.pitch = voiceModulation.basePitch - (voiceModulation.emotional.pitchRange * 0.5);
        utterance.rate = voiceModulation.baseRate - (voiceModulation.emotional.rateRange * 0.4);
        utterance.volume = 0.85;
        break;
      case 'angry':
        utterance.pitch = voiceModulation.basePitch + (voiceModulation.emotional.pitchRange * emotionIntensity * 0.8);
        utterance.rate = voiceModulation.baseRate + (voiceModulation.emotional.rateRange * emotionIntensity * 0.6);
        utterance.volume = 1;
        break;
      case 'surprised':
        utterance.pitch = voiceModulation.basePitch + (voiceModulation.emotional.pitchRange * 0.7);
        utterance.rate = voiceModulation.baseRate + (voiceModulation.emotional.rateRange * 0.4);
        utterance.volume = 1;
        break;
      case 'love':
        utterance.pitch = voiceModulation.basePitch + (voiceModulation.emotional.pitchRange * 0.4);
        utterance.rate = voiceModulation.baseRate - (voiceModulation.emotional.rateRange * 0.2);
        utterance.volume = 0.9;
        break;
      case 'thinking':
        utterance.pitch = voiceModulation.basePitch - (voiceModulation.emotional.pitchRange * 0.2);
        utterance.rate = voiceModulation.baseRate - (voiceModulation.emotional.rateRange * 0.3);
        utterance.volume = 0.95;
        break;
      case 'sleepy':
        utterance.pitch = voiceModulation.basePitch - (voiceModulation.emotional.pitchRange * 0.4);
        utterance.rate = voiceModulation.baseRate - (voiceModulation.emotional.rateRange * 0.5);
        utterance.volume = 0.8;
        break;
      default:
        utterance.pitch = voiceModulation.basePitch;
        utterance.rate = voiceModulation.baseRate;
        utterance.volume = 1;
    }

    window.speechSynthesis.speak(utterance);
  }
};
