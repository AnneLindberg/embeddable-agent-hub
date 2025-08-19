import React from 'react';
import { Agent } from '@/types/agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Calendar, Settings } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
}

export const AgentList: React.FC<AgentListProps> = ({
  agents,
  selectedAgent,
  onSelectAgent
}) => {
  if (agents.length === 0) {
    return (
      <Card className="agent-card">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Bot className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Agents Yet</h3>
          <p className="text-muted-foreground">
            Create your first AI agent to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        Your Agents ({agents.length})
      </h2>
      
      <div className="space-y-3">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className={`agent-card cursor-pointer transition-all ${
              selectedAgent?.id === agent.id
                ? 'ring-2 ring-primary bg-accent/50'
                : 'hover:bg-accent/30'
            }`}
            onClick={() => onSelectAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  {agent.name}
                </CardTitle>
                
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    T: {agent.temperature.toFixed(1)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    P: {agent.topP.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {agent.systemInstructions.length > 120
                  ? `${agent.systemInstructions.substring(0, 120)}...`
                  : agent.systemInstructions
                }
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(agent.updatedAt).toLocaleDateString()}
                </div>
                
                {agent.modelOverride && (
                  <Badge variant="outline" className="text-xs">
                    {agent.modelOverride}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};