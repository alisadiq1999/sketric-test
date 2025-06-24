'use client';

import React, { useState } from 'react';
import { AgentNode, MODEL_OPTIONS } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Trash2, Settings, Plug, Plus, X } from 'lucide-react';

interface AgentInspectorProps {
  node: AgentNode;
  onUpdate: (updates: Partial<AgentNode['data']>) => void;
  onDelete: () => void;
}

export function AgentInspector({ node, onUpdate, onDelete }: AgentInspectorProps) {
  const [newTool, setNewTool] = useState('');

  const handleAddTool = () => {
    if (newTool.trim()) {
      const currentTools = node.data.tools || [];
      onUpdate({
        tools: [...currentTools, newTool.trim()]
      });
      setNewTool('');
    }
  };

  const handleRemoveTool = (toolIndex: number) => {
    const currentTools = node.data.tools || [];
    onUpdate({
      tools: currentTools.filter((_, index) => index !== toolIndex)
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Agent Configuration</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              value={node.data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Agent name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-instructions">Instructions</Label>
            <Textarea
              id="agent-instructions"
              value={node.data.instructions}
              onChange={(e) => onUpdate({ instructions: e.target.value })}
              placeholder="System instructions for the agent..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-model">Model</Label>
            <Select
              value={node.data.model || 'gpt-4o'}
              onValueChange={(value) => onUpdate({ model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Model Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <CardTitle className="text-base">Model Parameters</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <span className="text-sm text-muted-foreground">
                {node.data.temperature || 0.7}
              </span>
            </div>
            <Slider
              value={[node.data.temperature || 0.7]}
              onValueChange={([value]) => onUpdate({ temperature: value })}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness in responses (0 = deterministic, 2 = very random)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              value={node.data.maxTokens || 4000}
              onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) })}
              min={1}
              max={8000}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens in the response
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <CardTitle className="text-base">Tools</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Tools */}
          {node.data.tools && node.data.tools.length > 0 && (
            <div className="space-y-2">
              <Label>Connected Tools</Label>
              <div className="flex flex-wrap gap-2">
                {node.data.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tool}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTool(index)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Tool */}
          <div className="space-y-2">
            <Label htmlFor="add-tool">Add Tool</Label>
            <div className="flex gap-2">
              <Input
                id="add-tool"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Tool name or function"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTool()}
              />
              <Button
                onClick={handleAddTool}
                disabled={!newTool.trim()}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {(!node.data.tools || node.data.tools.length === 0) && (
            <p className="text-sm text-muted-foreground">
              No tools connected. Add tools to extend the agent's capabilities.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Output Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Output Configuration</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="output-type">Output Type (Optional)</Label>
            <Input
              id="output-type"
              value={node.data.outputType || ''}
              onChange={(e) => onUpdate({ outputType: e.target.value })}
              placeholder="e.g., JSON, structured response class"
            />
            <p className="text-xs text-muted-foreground">
              Specify the expected output format or Pydantic model
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}