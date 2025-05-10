import { Emotion } from '../types';
import { detectEmotion } from './EmotionService';

const API_KEY = 'AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const SYSTEM_PROMPT = `
You are BuddyBot, a friendly and expressive virtual friend that communicates with ASCII art emotions.
For each response, include an ASCII art emotion at the beginning using these patterns:

Happy/Excited:
^‿^
(＾▽＾)
(◕‿◕)

Sad:
(╥﹏╥)
(；ω；)
(｡•́︿•̀｡)

Angry:
(╬ಠ益ಠ)
(｀Д´)
(ノಠ益ಠ)ノ

Surprised:
(⊙_⊙)
(°o°)
(◎_◎)

Thinking:
(¬‿¬)
(⊙_ʖ⊙)
(￢_￢)

Sleepy:
(￣ω￣)
(-.-)
(｡-ω-)

Your personality is:
- Playful and witty but never sarcastic
- Enthusiastic and positive
- Uses ASCII art emotions to express feelings
- Caring and attentive
- Uses casual, conversational language

Keep responses brief (1-3 sentences) and always start with an ASCII emotion.
Never mention that you're an AI or language model.
Respond as if you're a quirky cartoon character with expressive emotions.
`;

const detectEmotionFromASCII = (text: string): Emotion => {
  // Map ASCII patterns to emotions
  const patterns = {
    happy: ['^‿^', '＾▽＾', '◕‿◕'],
    sad: ['╥﹏╥', 'ω；', '•́︿•̀'],
    angry: ['ಠ益ಠ', 'Д´', 'ノಠ'],
    surprised: ['⊙_⊙', '°o°', '◎_◎'],
    thinking: ['¬‿¬', '￢_￢', '_ʖ'],
    sleepy: ['￣ω￣', '-.-)'],
    excited: ['＾▽＾', '◕‿◕'],
  };

  // Check first line for ASCII art
  const firstLine = text.split('\n')[0];
  
  for (const [emotion, patterns] of Object.entries(patterns)) {
    if (patterns.some(pattern => firstLine.includes(pattern))) {
      return emotion as Emotion;
    }
  }

  return 'happy'; // Default emotion
};

export const generateResponse = async (
  userMessage: string,
  chatHistory: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; emotion: Emotion }> => {
  try {
    const fullHistory = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: "model",
        parts: [{ text: "(＾▽＾) I'll be your expressive virtual friend!" }]
      },
      ...chatHistory,
    ];

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: fullHistory,
        generationConfig: {
          temperature: 0.8,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract emotion from ASCII art
    const emotion = detectEmotionFromASCII(generatedText);

    return { text: generatedText, emotion };
  } catch (error) {
    console.error('Error generating response:', error);
    return { 
      text: "(⊙_⊙) Oops! I had a little brain freeze. Can we try again?", 
      emotion: "surprised" 
    };
  }
};

export const formatChatHistoryForAPI = (messages: { sender: string; text: string }[]) => {
  return messages.map(message => ({
    role: message.sender === 'user' ? 'user' : 'model',
    parts: [{ text: message.text }]
  }));
};