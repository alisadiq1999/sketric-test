'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AgentWorkflow } from '@/lib/types';
import { Plus, Save, Upload, Download, Play, Settings } from 'lucide-react';

interface WorkflowToolbarProps {
  onAddAgent: () => void;
  workflow: AgentWorkflow;
  onWorkflowChange: (workflow: AgentWorkflow) => void;
}

export function WorkflowToolbar({ onAddAgent, workflow, onWorkflowChange }: WorkflowToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveWorkflow = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name || 'workflow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadWorkflow = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedWorkflow = JSON.parse(e.target?.result as string);
          onWorkflowChange(loadedWorkflow);
        } catch (error) {
          console.error('Error loading workflow:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="p-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onAddAgent}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Agent
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleSaveWorkflow}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Save
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleLoadWorkflow}
          className="flex items-center gap-1"
        >
          <Upload className="w-4 h-4" />
          Load
        </Button>

        <div className="border-l mx-1" />
        
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </Card>
  );
}