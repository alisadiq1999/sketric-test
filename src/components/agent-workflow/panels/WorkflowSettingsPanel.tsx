'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AgentWorkflow } from '@/lib/types';
import { Settings } from 'lucide-react';

interface WorkflowSettingsPanelProps {
  workflow: AgentWorkflow;
  onUpdate: (workflow: AgentWorkflow) => void;
}

export function WorkflowSettingsPanel({ workflow, onUpdate }: WorkflowSettingsPanelProps) {
  const updateWorkflow = (field: keyof AgentWorkflow, value: any) => {
    onUpdate({ ...workflow, [field]: value });
  };

  const updateGlobalSettings = (field: string, value: any) => {
    onUpdate({
      ...workflow,
      globalSettings: {
        ...workflow.globalSettings,
        [field]: value,
      },
    });
  };

  const updateMetadata = (field: string, value: any) => {
    onUpdate({
      ...workflow,
      metadata: {
        ...workflow.metadata,
        [field]: value,
      },
    });
  };

  return (
    <div className="h-full overflow-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Workflow Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflow.name}
                onChange={(e) => updateWorkflow('name', e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>

            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={workflow.description}
                onChange={(e) => updateWorkflow('description', e.target.value)}
                placeholder="Describe your workflow"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workflow-version">Version</Label>
              <Input
                id="workflow-version"
                value={workflow.version}
                onChange={(e) => updateWorkflow('version', e.target.value)}
                placeholder="1.0.0"
              />
            </div>
          </div>

          {/* Global Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Global Settings</h3>
            
            <div>
              <Label htmlFor="default-model">Default Model</Label>
              <Select
                value={workflow.globalSettings.defaultModel}
                onValueChange={(value) => updateGlobalSettings('defaultModel', value)}
              >
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

            <div>
              <Label htmlFor="default-temperature">Default Temperature</Label>
              <Input
                id="default-temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={workflow.globalSettings.defaultTemperature}
                onChange={(e) => updateGlobalSettings('defaultTemperature', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="max-retries">Max Retries</Label>
              <Input
                id="max-retries"
                type="number"
                min="0"
                max="10"
                value={workflow.globalSettings.maxRetries}
                onChange={(e) => updateGlobalSettings('maxRetries', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min="1"
                value={workflow.globalSettings.timeoutSeconds}
                onChange={(e) => updateGlobalSettings('timeoutSeconds', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable-tracing"
                checked={workflow.globalSettings.enableTracing}
                onCheckedChange={(checked) => updateGlobalSettings('enableTracing', checked)}
              />
              <Label htmlFor="enable-tracing">Enable Tracing</Label>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Metadata</h3>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={workflow.metadata.author}
                onChange={(e) => updateMetadata('author', e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={workflow.metadata.tags.join(', ')}
                onChange={(e) => updateMetadata('tags', e.target.value.split(',').map(tag => tag.trim()))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Agents</div>
                <div className="font-medium">{workflow.agents.length}</div>
              </div>
              <div>
                <div className="text-gray-500">Connections</div>
                <div className="font-medium">{workflow.connections.length}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Tools</div>
                <div className="font-medium">
                  {workflow.agents.reduce((sum, agent) => sum + agent.tools.length, 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Total Handoffs</div>
                <div className="font-medium">
                  {workflow.agents.reduce((sum, agent) => sum + agent.handoffs.length, 0)}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {new Date(workflow.metadata.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(workflow.metadata.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}