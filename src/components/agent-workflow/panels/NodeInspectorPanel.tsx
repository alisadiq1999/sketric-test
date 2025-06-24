'use client';

import React from 'react';
import { WorkflowNode } from '@/lib/workflow-types';
import { AgentInspector } from './inspectors/AgentInspector';
import { ToolInspector } from './inspectors/ToolInspector';
import { TriggerInspector } from './inspectors/TriggerInspector';
import { HandoffInspector } from './inspectors/HandoffInspector';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface NodeInspectorPanelProps {
  selectedNode: WorkflowNode | undefined;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode['data']>) => void;
  onNodeDelete: (nodeId: string) => void;
}

export function NodeInspectorPanel({
  selectedNode,
  onNodeUpdate,
  onNodeDelete
}: NodeInspectorPanelProps) {
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Info className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Select a node to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const renderInspector = () => {
    const commonProps = {
      node: selectedNode,
      onUpdate: (updates: Partial<WorkflowNode['data']>) => onNodeUpdate(selectedNode.id, updates),
      onDelete: () => onNodeDelete(selectedNode.id)
    };

    switch (selectedNode.type) {
      case 'agent':
        return <AgentInspector {...commonProps} />;
      case 'tool':
        return <ToolInspector {...commonProps} />;
      case 'trigger':
        return <TriggerInspector {...commonProps} />;
      case 'handoff':
        return <HandoffInspector {...commonProps} />;
      default:
        return (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                No inspector available for this node type.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderInspector()}
    </div>
  );
}