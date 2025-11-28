import React, { createContext, useContext, useReducer } from 'react';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIState {
  selectedModel: AIModel | null;
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

type AIAction =
  | { type: 'SET_MODEL'; payload: AIModel }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_TEMPERATURE'; payload: number }
  | { type: 'SET_MAX_TOKENS'; payload: number }
  | { type: 'SET_TOP_P'; payload: number }
  | { type: 'SET_FREQUENCY_PENALTY'; payload: number }
  | { type: 'SET_PRESENCE_PENALTY'; payload: number }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CHAT' };

const initialState: AIState = {
  selectedModel: null,
  prompt: '',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1.0,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  chatHistory: [],
  isLoading: false,
  error: null,
};

const aiReducer = (state: AIState, action: AIAction): AIState => {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_TEMPERATURE':
      return { ...state, temperature: action.payload };
    case 'SET_MAX_TOKENS':
      return { ...state, maxTokens: action.payload };
    case 'SET_TOP_P':
      return { ...state, topP: action.payload };
    case 'SET_FREQUENCY_PENALTY':
      return { ...state, frequencyPenalty: action.payload };
    case 'SET_PRESENCE_PENALTY':
      return { ...state, presencePenalty: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };
    default:
      return state;
  }
};

const AIContext = createContext<{
  state: AIState;
  dispatch: React.Dispatch<AIAction>;
} | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  return (
    <AIContext.Provider value={{ state, dispatch }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};