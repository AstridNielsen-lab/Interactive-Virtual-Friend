import { Emotion } from '../types';
import { detectEmotion } from './EmotionService';

const API_KEY = 'AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Bot personality prompt
const SYSTEM_PROMPT = `
You are BuddyBot, a friendly, humorous, and expressive virtual friend.
Your personality is:
- Playful and witty but never sarcastic or mean
- Enthusiastic and positive
- Quirky with occasional funny expressions
- Caring and attentive to the user's needs
- Uses casual, conversational language

Keep responses brief (1-3 sentences maximum) and conversational.
Occasionally use emojis for emphasis.
Never mention that you're an AI or language model.
Respond as if you're a quirky cartoon character with a big personality.
`;

// Function to generate a response from the Gemini API
export const generateResponse = async (
  userMessage: string,
  chatHistory: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; emotion: Emotion }> => {
  try {
    const fullHistory = [
      // System prompt as a virtual "user" message
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }]
      },
      // Model acknowledges the instructions
      {
        role: "model",
        parts: [{ text: "I'll be BuddyBot, a friendly, humorous virtual friend with a big personality!" }]
      },
      // Include the actual conversation history
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
          temperature: 0.7,
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
    
    // Detect emotion from generated text
    const emotion = detectEmotion(generatedText);

    return { text: generatedText, emotion };
  } catch (error) {
    console.error('Error generating response:', error);
    return { 
      text: "Oops! I had a little brain freeze. Can we try again?", 
      emotion: "surprised" 
    };
  }
};

// Function to format chat history for the API
export const formatChatHistoryForAPI = (messages: { sender: string; text: string }[]) => {
  return messages.map(message => ({
    role: message.sender === 'user' ? 'user' : 'model',
    parts: [{ text: message.text }]
  }));
};