'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { WorkflowNode, TriggerNodeData } from '@/lib/workflow-types';
import { cn } from '@/lib/utils';

interface TriggerNodeProps {
  node: WorkflowNode;
  selected: boolean;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (data: Partial<TriggerNodeData>) => void;
  style?: React.CSSProperties;
}

export function TriggerNode({ 
  node, 
  selected, 
  onClick, 
  onDragStart, 
  onUpdate,
  style 
}: TriggerNodeProps) {
  const data = node.data as TriggerNodeData;

  return (
    <div style={style}>
      <Card 
        className={cn(
          "w-48 cursor-pointer transition-all duration-200 hover:shadow-md",
          selected && "ring-2 ring-primary shadow-lg"
        )}
        onClick={onClick}
        onMouseDown={onDragStart}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">Trigger</h3>
              <Badge variant="secondary" className="text-xs">
                {data.triggerType}
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">TYPE: {data.triggerType}</p>
            {data.content && (
              <p className="truncate" title={data.content}>
                {data.content}
              </p>
            )}
            {data.webhookUrl && (
              <p className="truncate" title={data.webhookUrl}>
                Webhook: {data.webhookUrl}
              </p>
            )}
            {data.schedule && (
              <p>Schedule: {data.schedule}</p>
            )}
            {!data.content && !data.webhookUrl && !data.schedule && (
              <p className="text-muted-foreground/60">Click to configure</p>
            )}
          </div>

          {/* Connection points */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}