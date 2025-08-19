import React, { useState, useRef, useEffect } from 'react';
import { Agent, ChatMessage } from '@/types/agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Loader2, Copy, Code } from 'lucide-react';

interface ChatInterfaceProps {
  agent: Agent | null;
  isEmbedded?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, isEmbedded = false }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = async () => {
    if (!inputMessage.trim() || !agent || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Limit to last 40 messages for API call
      const recentMessages = [...messages, userMessage].slice(-40);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: recentMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          agentConfig: {
            systemInstructions: agent.systemInstructions,
            temperature: agent.temperature,
            topP: agent.topP,
            modelOverride: agent.modelOverride
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyEmbedCode = () => {
    if (!agent) return;
    
    const embedCode = `<iframe src="${window.location.origin}/embed/${agent.id}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard"
    });
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been cleared"
    });
  };

  if (!agent) {
    return (
      <Card className="agent-card h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an agent to start chatting</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="agent-card h-full flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Chat with {agent.name}
          </CardTitle>
          
          {!isEmbedded && (
            <div className="flex items-center gap-2">
              <Button
                onClick={copyEmbedCode}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Code className="h-4 w-4 mr-2" />
                Embed
              </Button>
              <Button
                onClick={clearChat}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        
        {!isEmbedded && (
          <div className="embed-preview">
            <div className="flex items-center justify-between">
              <span>Embed code:</span>
              <Button onClick={copyEmbedCode} variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <code className="block mt-2 text-xs break-all">
              {`<iframe src="${window.location.origin}/embed/${agent.id}" width="100%" height="600"></iframe>`}
            </code>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>Start a conversation with {agent.name}</p>
                <p className="text-sm mt-2">Temperature: {agent.temperature} | Top P: {agent.topP}</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={
                    message.role === 'user'
                      ? 'chat-message-user'
                      : 'chat-message-assistant'
                  }
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-message-assistant flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-none p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};