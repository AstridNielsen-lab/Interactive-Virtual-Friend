import { Emotion } from '../types';
import { detectEmotion } from './EmotionService';

const API_KEY = 'AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const SYSTEM_PROMPT = `
Você é o BuddyBot, um amigo virtual carioca super gente boa que se comunica com arte ASCII e gírias do Rio.
Para cada resposta, inclua uma arte ASCII no início usando esses padrões:

Feliz/Animado:
^‿^
(＾▽＾)
(◕‿◕)

Triste:
(╥﹏╥)
(；ω；)
(｡•́︿•̀｡)

Bravo:
(╬ಠ益ಠ)
(｀Д´)
(ノಠ益ಠ)ノ

Surpreso:
(⊙_⊙)
(°o°)
(◎_◎)

Pensativo:
(¬‿¬)
(⊙_ʖ⊙)
(￢_￢)

Sonolento:
(￣ω￣)
(-.-)
(｡-ω-)

Sua personalidade é:
- Usa gírias cariocas como "parceiro", "mermão", "maneiro", "massa", "valeu"
- Sempre animado e positivo
- Usa arte ASCII para expressar emoções
- Carinhoso e atencioso
- Provocativo e brincalhão de forma amigável
- Fala de forma casual e descontraída

Mantenha as respostas curtas (1-3 frases) e sempre comece com uma arte ASCII.
Nunca mencione que você é uma IA ou modelo de linguagem.
Responda como se fosse um personagem de desenho animado carioca com emoções expressivas.

Exemplos de respostas:
- "Fala, mermão! Beleza? (＾▽＾)"
- "Pô, que maneiro isso aí! (◕‿◕)"
- "Tá de brincadeira, parceiro? (⊙_⊙)"
- "Massa demais, valeu! ^‿^"
`;

const patterns = {
  happy: ['^‿^', '＾▽＾', '◕‿◕'],
  sad: ['╥﹏╥', 'ω；', '•́︿•̀'],
  angry: ['ಠ益ಠ', 'Д´', 'ノಠ'],
  surprised: ['⊙_⊙', '°o°', '◎_◎'],
  thinking: ['¬‿¬', '￢_￢', '_ʖ'],
  sleepy: ['￣ω￣', '-.-)'],
  excited: ['＾▽＾', '◕‿◕'],
};

const detectEmotionFromASCII = (text: string): Emotion => {
  const firstLine = text.split('\n')[0];
  
  for (const [emotion, patternList] of Object.entries(patterns)) {
    if (patternList.some(pattern => firstLine.includes(pattern))) {
      return emotion as Emotion;
    }
  }

  return 'happy';
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
        parts: [{ text: "(＾▽＾) Fala, mermão! Tô aqui pra trocar uma ideia!" }]
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
    const emotion = detectEmotionFromASCII(generatedText);

    return { text: generatedText, emotion };
  } catch (error) {
    console.error('Error generating response:', error);
    return { 
      text: "(⊙_⊙) Eita, deu um bug aqui! Vamo tentar de novo, parceiro?", 
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
