import React, { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { agentStorage } from '@/utils/agentStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bot, Save, Trash2 } from 'lucide-react';

interface AgentFormProps {
  selectedAgent: Agent | null;
  onAgentSaved: (agent: Agent) => void;
  onAgentDeleted: (agentId: string) => void;
}

export const AgentForm: React.FC<AgentFormProps> = ({
  selectedAgent,
  onAgentSaved,
  onAgentDeleted
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    systemInstructions: '',
    temperature: 0.7,
    topP: 1,
    modelOverride: ''
  });

  useEffect(() => {
    if (selectedAgent) {
      setFormData(selectedAgent);
    } else {
      setFormData({
        name: '',
        systemInstructions: '',
        temperature: 0.7,
        topP: 1,
        modelOverride: ''
      });
    }
  }, [selectedAgent]);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Agent name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.systemInstructions?.trim()) {
      toast({
        title: "Validation Error", 
        description: "System instructions are required.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const agent: Agent = {
      id: selectedAgent?.id || agentStorage.generateId(),
      name: formData.name.trim(),
      systemInstructions: formData.systemInstructions.trim(),
      temperature: formData.temperature || 0.7,
      topP: formData.topP || 1,
      modelOverride: formData.modelOverride?.trim() || undefined,
      createdAt: selectedAgent?.createdAt || now,
      updatedAt: now
    };

    agentStorage.save(agent);
    onAgentSaved(agent);
    
    toast({
      title: "Success",
      description: `Agent "${agent.name}" saved successfully.`
    });
  };

  const handleDelete = () => {
    if (selectedAgent && window.confirm('Are you sure you want to delete this agent?')) {
      agentStorage.delete(selectedAgent.id);
      onAgentDeleted(selectedAgent.id);
      
      toast({
        title: "Success",
        description: `Agent "${selectedAgent.name}" deleted successfully.`
      });
    }
  };

  const handleNewAgent = () => {
    setFormData({
      name: '',
      systemInstructions: '',
      temperature: 0.7,
      topP: 1,
      modelOverride: ''
    });
  };

  return (
    <Card className="agent-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {selectedAgent ? 'Edit Agent' : 'Create New Agent'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter agent name..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">System Instructions</Label>
          <Textarea
            id="instructions"
            value={formData.systemInstructions || ''}
            onChange={(e) => setFormData({ ...formData, systemInstructions: e.target.value })}
            placeholder="Define how your agent should behave..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label>Temperature: {formData.temperature?.toFixed(2)}</Label>
          <Slider
            value={[formData.temperature || 0.7]}
            onValueChange={(value) => setFormData({ ...formData, temperature: value[0] })}
            max={2}
            min={0}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More focused</span>
            <span>More creative</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Top P: {formData.topP?.toFixed(2)}</Label>
          <Slider
            value={[formData.topP || 1]}
            onValueChange={(value) => setFormData({ ...formData, topP: value[0] })}
            max={1}
            min={0}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More deterministic</span>
            <span>More diverse</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model Override (Optional)</Label>
          <Input
            id="model"
            value={formData.modelOverride || ''}
            onChange={(e) => setFormData({ ...formData, modelOverride: e.target.value })}
            placeholder="e.g., gpt-4, gpt-3.5-turbo"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Agent
          </Button>
          
          {selectedAgent && (
            <Button 
              onClick={handleDelete} 
              variant="destructive"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={handleNewAgent} 
            variant="outline"
          >
            New
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};