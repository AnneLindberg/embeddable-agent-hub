import React, { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { agentStorage } from '@/utils/agentStorage';
import { AgentForm } from '@/components/AgentForm';
import { AgentList } from '@/components/AgentList';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Zap, MessageSquare } from 'lucide-react';

const AgentBuilder: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const loadedAgents = agentStorage.getAll();
    setAgents(loadedAgents);
    
    // If we had a selected agent, try to find it in the updated list
    if (selectedAgent) {
      const updatedAgent = loadedAgents.find(a => a.id === selectedAgent.id);
      setSelectedAgent(updatedAgent || null);
    }
  };

  const handleAgentSaved = (agent: Agent) => {
    loadAgents();
    setSelectedAgent(agent);
  };

  const handleAgentDeleted = (agentId: string) => {
    loadAgents();
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null);
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Agent Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Create, customize, and embed AI agents
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {agents.length} agents
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Ready to embed
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Column - Agent List */}
          <div className="lg:col-span-1 space-y-6">
            <AgentList
              agents={agents}
              selectedAgent={selectedAgent}
              onSelectAgent={handleSelectAgent}
            />
          </div>

          {/* Middle Column - Agent Form */}
          <div className="lg:col-span-1">
            <AgentForm
              selectedAgent={selectedAgent}
              onAgentSaved={handleAgentSaved}
              onAgentDeleted={handleAgentDeleted}
            />
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface agent={selectedAgent} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-1">
              Create intelligent agents and embed them anywhere with iframe support
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgentBuilder;