'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings } from 'lucide-react';
import { WorkflowNode, AgentNodeData } from '@/lib/workflow-types';
import { cn } from '@/lib/utils';

interface AgentNodeProps {
  node: WorkflowNode;
  selected: boolean;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (data: Partial<AgentNodeData>) => void;
  style?: React.CSSProperties;
}

export function AgentNode({ 
  node, 
  selected, 
  onClick, 
  onDragStart, 
  onUpdate,
  style 
}: AgentNodeProps) {
  const data = node.data as AgentNodeData;

  return (
    <div style={style}>
      <Card 
        className={cn(
          "w-64 cursor-pointer transition-all duration-200 hover:shadow-md relative",
          selected && "ring-2 ring-primary shadow-lg"
        )}
        onClick={onClick}
        onMouseDown={onDragStart}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">AI Agent</h3>
              <Badge variant="secondary" className="text-xs">
                {data.model}
              </Badge>
            </div>
            <Settings className="w-3 h-3 text-muted-foreground" />
          </div>
          
          <div className="text-xs text-muted-foreground space-y-2">
            <div>
              <p className="font-medium">Model:</p>
              <p className="text-foreground">{data.model}</p>
            </div>
            
            <div>
              <p className="font-medium">Instructions:</p>
              <p className="text-foreground line-clamp-2" title={data.instructions}>
                {data.instructions}
              </p>
            </div>

            {data.tools && data.tools.length > 0 && (
              <div>
                <p className="font-medium">Tools: {data.tools.length}/5</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.tools.slice(0, 3).map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {tool}
                    </Badge>
                  ))}
                  {data.tools.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{data.tools.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {(!data.tools || data.tools.length === 0) && (
              <div>
                <p className="font-medium">Tools: 0/5</p>
                <p className="text-muted-foreground/60">No tools configured</p>
              </div>
            )}
          </div>

          {/* Connection points */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-muted-foreground rounded-full border-2 border-background shadow-sm" />
          </div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}