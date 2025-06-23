'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Bot, Wrench, Plus } from 'lucide-react';

interface WorkflowToolbarProps {
  onAddNode?: (nodeType: 'trigger' | 'agent' | 'tool') => void;
}

export function WorkflowToolbar({ onAddNode }: WorkflowToolbarProps) {
  const nodeTypes = [
    {
      type: 'trigger' as const,
      icon: Zap,
      title: 'Trigger',
      description: 'Start your workflow with text, webhook, or schedule triggers'
    },
    {
      type: 'agent' as const,
      icon: Bot,
      title: 'Agent',
      description: 'AI Agent with instructions and tools'
    },
    {
      type: 'tool' as const,
      icon: Wrench,
      title: 'Tool',
      description: 'External tools and functions'
    }
  ];

  return (
    <div className="w-64 border-r bg-card p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Add Node</h2>
        <p className="text-sm text-muted-foreground">
          Drag & drop nodes onto the canvas to build your workflow
        </p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <Card key={nodeType.type} className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{nodeType.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-auto"
                    onClick={() => onAddNode?.(nodeType.type)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Quick Start</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>1. Add a Trigger node</p>
          <p>2. Connect to an Agent</p>
          <p>3. Add Tools as needed</p>
          <p>4. Save & run your workflow</p>
        </div>
      </div>
    </div>
  );
}