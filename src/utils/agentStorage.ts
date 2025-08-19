import { Agent } from '@/types/agent';

const AGENTS_STORAGE_KEY = 'ai_agents';

export const agentStorage = {
  getAll: (): Agent[] => {
    try {
      const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading agents from localStorage:', error);
      return [];
    }
  },

  getById: (id: string): Agent | null => {
    const agents = agentStorage.getAll();
    return agents.find(agent => agent.id === id) || null;
  },

  save: (agent: Agent): void => {
    try {
      const agents = agentStorage.getAll();
      const existingIndex = agents.findIndex(a => a.id === agent.id);
      
      if (existingIndex >= 0) {
        agents[existingIndex] = agent;
      } else {
        agents.push(agent);
      }
      
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
    } catch (error) {
      console.error('Error saving agent to localStorage:', error);
    }
  },

  delete: (id: string): void => {
    try {
      const agents = agentStorage.getAll();
      const filtered = agents.filter(agent => agent.id !== id);
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting agent from localStorage:', error);
    }
  },

  generateId: (): string => {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};