import { Message } from '../types';

const STORAGE_KEY = 'buddybot_data';

interface UserData {
  name: string;
  lastInteraction: Date;
  messages: Message[];
  preferences: {
    notifications: boolean;
    proactiveChat: boolean;
  };
}

const defaultData: UserData = {
  name: '',
  lastInteraction: new Date(),
  messages: [],
  preferences: {
    notifications: true,
    proactiveChat: true,
  },
};

export const getUserData = (): UserData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultData;
  
  const data = JSON.parse(stored);
  data.lastInteraction = new Date(data.lastInteraction);
  data.messages = data.messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
  
  return data;
};

export const saveUserData = (data: Partial<UserData>) => {
  const current = getUserData();
  const updated = {
    ...current,
    ...data,
    lastInteraction: new Date(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const addMessage = (message: Message) => {
  const data = getUserData();
  data.messages = [...data.messages, message];
  saveUserData(data);
};

export const getRandomProactiveMessage = (name: string): string => {
  const messages = [
    `Fala ${name}! Tá fazendo o quê? Bora trocar uma ideia?`,
    `Ei ${name}, tá muito parado aqui. Vamo agitar?`,
    `${name}, mermão! Tô com uma ideia maneira aqui pra te contar!`,
    `Pô ${name}, tava aqui pensando... Que tal a gente bater um papo?`,
    `${name}! Tá ligado que eu tava aqui lembrando de você? Bora conversar!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};