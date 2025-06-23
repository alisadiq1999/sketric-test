'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WorkflowAgent, AgentTool, AgentHandoff, StructuredOutput, AgentGuardrail } from '@/lib/types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { nanoid } from 'nanoid';

interface AgentPropertiesPanelProps {
  agent: WorkflowAgent;
  onUpdate: (updates: Partial<WorkflowAgent>) => void;
}

export function AgentPropertiesPanel({ agent, onUpdate }: AgentPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('general');

  const updateAgent = (field: keyof WorkflowAgent, value: any) => {
    onUpdate({ [field]: value });
  };

  const addTool = () => {
    const newTool: AgentTool = {
      id: nanoid(),
      name: 'New Tool',
      description: 'A new tool',
      type: 'function',
      parameters: [],
    };
    updateAgent('tools', [...agent.tools, newTool]);
  };

  const updateTool = (toolId: string, updates: Partial<AgentTool>) => {
    const updatedTools = agent.tools.map(tool =>
      tool.id === toolId ? { ...tool, ...updates } : tool
    );
    updateAgent('tools', updatedTools);
  };

  const deleteTool = (toolId: string) => {
    updateAgent('tools', agent.tools.filter(tool => tool.id !== toolId));
  };

  const addHandoff = () => {
    const newHandoff: AgentHandoff = {
      id: nanoid(),
      targetAgentId: '',
      preserveContext: true,
    };
    updateAgent('handoffs', [...agent.handoffs, newHandoff]);
  };

  const updateHandoff = (handoffId: string, updates: Partial<AgentHandoff>) => {
    const updatedHandoffs = agent.handoffs.map(handoff =>
      handoff.id === handoffId ? { ...handoff, ...updates } : handoff
    );
    updateAgent('handoffs', updatedHandoffs);
  };

  const deleteHandoff = (handoffId: string) => {
    updateAgent('handoffs', agent.handoffs.filter(handoff => handoff.id !== handoffId));
  };

  const addStructuredOutput = () => {
    const newOutput: StructuredOutput = {
      id: nanoid(),
      name: 'New Output',
      schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
    updateAgent('structuredOutputs', [...agent.structuredOutputs, newOutput]);
  };

  const addGuardrail = () => {
    const newGuardrail: AgentGuardrail = {
      id: nanoid(),
      name: 'New Guardrail',
      type: 'input_validation',
      condition: '',
      action: 'block',
    };
    updateAgent('guardrails', [...agent.guardrails, newGuardrail]);
  };

  return (
    <div className="h-full overflow-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-lg">Agent Properties</CardTitle>
          <div className="text-sm text-gray-500">{agent.name}</div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="handoffs">Handoffs</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={agent.name}
                  onChange={(e) => updateAgent('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={agent.instructions}
                  onChange={(e) => updateAgent('instructions', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={agent.model} onValueChange={(value) => updateAgent('model', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={agent.temperature}
                    onChange={(e) => updateAgent('temperature', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={agent.maxTokens}
                    onChange={(e) => updateAgent('maxTokens', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Tools ({agent.tools.length})</h3>
                <Button size="sm" onClick={addTool}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tool
                </Button>
              </div>

              <div className="space-y-3">
                {agent.tools.map((tool) => (
                  <Card key={tool.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Input
                          value={tool.name}
                          onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                          className="font-medium mb-2"
                        />
                        <Select
                          value={tool.type}
                          onValueChange={(value: any) => updateTool(tool.id, { type: value })}
                        >
                          <SelectTrigger className="mb-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="function">Function</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          value={tool.description}
                          onChange={(e) => updateTool(tool.id, { description: e.target.value })}
                          placeholder="Tool description..."
                          rows={2}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTool(tool.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="handoffs" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Handoffs ({agent.handoffs.length})</h3>
                <Button size="sm" onClick={addHandoff}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Handoff
                </Button>
              </div>

              <div className="space-y-3">
                {agent.handoffs.map((handoff) => (
                  <Card key={handoff.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Input
                          value={handoff.targetAgentId}
                          onChange={(e) => updateHandoff(handoff.id, { targetAgentId: e.target.value })}
                          placeholder="Target Agent ID"
                          className="mb-2"
                        />
                        <Input
                          value={handoff.condition || ''}
                          onChange={(e) => updateHandoff(handoff.id, { condition: e.target.value })}
                          placeholder="Condition (optional)"
                          className="mb-2"
                        />
                        <Input
                          value={handoff.message || ''}
                          onChange={(e) => updateHandoff(handoff.id, { message: e.target.value })}
                          placeholder="Handoff message (optional)"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHandoff(handoff.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Structured Outputs ({agent.structuredOutputs.length})</h3>
                  <Button size="sm" onClick={addStructuredOutput}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Output
                  </Button>
                </div>
                {agent.structuredOutputs.map((output) => (
                  <Card key={output.id} className="p-3">
                    <div className="text-sm font-medium">{output.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {output.schema.type}
                    </Badge>
                  </Card>
                ))}
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Guardrails ({agent.guardrails.length})</h3>
                  <Button size="sm" onClick={addGuardrail}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Guardrail
                  </Button>
                </div>
                {agent.guardrails.map((guardrail) => (
                  <Card key={guardrail.id} className="p-3">
                    <div className="text-sm font-medium">{guardrail.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {guardrail.type}
                    </Badge>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}