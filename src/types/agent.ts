export interface Agent {
  id: string;
  name: string;
  systemInstructions: string;
  temperature: number;
  topP: number;
  modelOverride?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  agentId: string;
  messages: ChatMessage[];
  createdAt: string;
}