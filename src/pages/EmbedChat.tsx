import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Agent } from '@/types/agent';
import { agentStorage } from '@/utils/agentStorage';
import { ChatInterface } from '@/components/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';

const EmbedChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No agent ID provided');
      setLoading(false);
      return;
    }

    try {
      const foundAgent = agentStorage.getById(id);
      if (!foundAgent) {
        setError('Agent not found');
      } else {
        setAgent(foundAgent);
      }
    } catch (err) {
      setError('Failed to load agent');
      console.error('Error loading agent:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Bot className="h-8 w-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-lg font-semibold mb-2">Agent Not Available</h2>
            <p className="text-muted-foreground text-sm">
              {error || 'The requested agent could not be found.'}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Agent ID: {id}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background p-2">
      <div className="h-full">
        <ChatInterface agent={agent} isEmbedded={true} />
      </div>
    </div>
  );
};

export default EmbedChat;