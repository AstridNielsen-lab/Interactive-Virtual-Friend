import { Emotion } from '../types';

const emotionPatterns = {
  happy: [
    'massa', 'maneiro', 'legal', 'show', 'bacana', 'top', 'beleza', 
    'dahora', 'irado', 'supimpa', 'valeu', 'boa', 'tranquilo'
  ],
  sad: [
    'pô', 'putz', 'triste', 'chateado', 'bolado', 'mal', 'caramba', 
    'poxa', 'nossa', 'vixe', 'puts', 'barra'
  ],
  angry: [
    'vacilão', 'caô', 'mané', 'absurdo', 'palhaçada', 'sacanagem', 
    'zuado', 'tenso', 'osso', 'embaçado'
  ],
  surprised: [
    'caraca', 'ih', 'eita', 'nossa', 'vixe', 'meu deus', 'orra', 
    'sinistro', 'que isso', 'não creio'
  ],
  thinking: [
    'tipo', 'então', 'assim', 'será', 'como', 'porque', 'qual', 
    'quando', 'onde', 'pô', 'hmm'
  ],
  excited: [
    'caraca', 'massa', 'maneiro', 'show', 'top', 'dahora', 'irado',
    'sinistro', 'animal', 'sensacional'
  ],
  love: [
    'amor', 'querido', 'fofo', 'lindo', 'meu bem', 'coração', 'fofura'
  ],
  sleepy: [
    'sono', 'cansado', 'exausto', 'dormindo', 'cochilando', 'bocejando'
  ],
  confused: [
    'viajou', 'nada a ver', 'que isso', 'que que é isso', 'tô boiando',
    'tô perdido', 'não entendi'
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
    voice.lang.includes('pt-BR') && voice.name.toLowerCase().includes('female')
  );

  if (ptBRVoice) return ptBRVoice;

  return voices.find(voice => 
    (voice.lang.includes('pt') || voice.lang.includes('por')) &&
    voice.name.toLowerCase().includes('female')
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
  basePitch: 1.2, // Pitch base mais alto para voz feminina
  baseRate: 1.0,
  emotional: {
    pitchRange: 0.4, // Maior variação de pitch para sotaque carioca
    rateRange: 0.3,  // Maior variação de velocidade para expressividade
    volumeRange: 0.2
  },
  // Características do sotaque carioca
  carioca: {
    musicalityFactor: 1.2,    // Fator de musicalidade do sotaque
    rhythmVariation: 0.15,    // Variação do ritmo característico
    intonationCurve: 0.25     // Curva de entonação ascendente no fim das frases
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
    
    // Base da voz feminina carioca
    utterance.pitch = voiceModulation.basePitch * voiceModulation.carioca.musicalityFactor;
    utterance.rate = voiceModulation.baseRate;

    // Ajustes específicos por emoção com características cariocas
    switch (emotion) {
      case 'happy':
      case 'excited':
        utterance.pitch = voiceModulation.basePitch + 
          (voiceModulation.emotional.pitchRange * emotionIntensity * voiceModulation.carioca.musicalityFactor);
        utterance.rate = voiceModulation.baseRate + 
          (voiceModulation.emotional.rateRange * emotionIntensity) + 
          voiceModulation.carioca.rhythmVariation;
        utterance.volume = 1;
        break;
      case 'sad':
        utterance.pitch = voiceModulation.basePitch - 
          (voiceModulation.emotional.pitchRange * 0.3);
        utterance.rate = voiceModulation.baseRate - 
          (voiceModulation.emotional.rateRange * 0.4) + 
          voiceModulation.carioca.rhythmVariation;
        utterance.volume = 0.85;
        break;
      case 'angry':
        utterance.pitch = voiceModulation.basePitch + 
          (voiceModulation.emotional.pitchRange * emotionIntensity * 0.9);
        utterance.rate = voiceModulation.baseRate + 
          (voiceModulation.emotional.rateRange * emotionIntensity * 0.7) + 
          voiceModulation.carioca.rhythmVariation;
        utterance.volume = 1;
        break;
      case 'surprised':
        utterance.pitch = voiceModulation.basePitch + 
          (voiceModulation.emotional.pitchRange * 0.8 * voiceModulation.carioca.musicalityFactor);
        utterance.rate = voiceModulation.baseRate + 
          (voiceModulation.emotional.rateRange * 0.5) + 
          voiceModulation.carioca.intonationCurve;
        utterance.volume = 1;
        break;
      case 'love':
        utterance.pitch = voiceModulation.basePitch + 
          (voiceModulation.emotional.pitchRange * 0.5 * voiceModulation.carioca.musicalityFactor);
        utterance.rate = voiceModulation.baseRate - 
          (voiceModulation.emotional.rateRange * 0.1) + 
          voiceModulation.carioca.rhythmVariation;
        utterance.volume = 0.9;
        break;
      case 'thinking':
        utterance.pitch = voiceModulation.basePitch - 
          (voiceModulation.emotional.pitchRange * 0.1);
        utterance.rate = voiceModulation.baseRate - 
          (voiceModulation.emotional.rateRange * 0.2) + 
          voiceModulation.carioca.rhythmVariation;
        utterance.volume = 0.95;
        break;
      case 'sleepy':
        utterance.pitch = voiceModulation.basePitch - 
          (voiceModulation.emotional.pitchRange * 0.3);
        utterance.rate = voiceModulation.baseRate - 
          (voiceModulation.emotional.rateRange * 0.4);
        utterance.volume = 0.8;
        break;
      default:
        utterance.pitch = voiceModulation.basePitch * voiceModulation.carioca.musicalityFactor;
        utterance.rate = voiceModulation.baseRate + voiceModulation.carioca.rhythmVariation;
        utterance.volume = 1;
    }

    window.speechSynthesis.speak(utterance);
  }
};
