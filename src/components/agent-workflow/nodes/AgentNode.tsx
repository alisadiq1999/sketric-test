'use client';

import React from 'react';
import { AgentNode as AgentNodeType, Position } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, Plug } from 'lucide-react';

interface AgentNodeProps {
  node: AgentNodeType;
  isSelected: boolean;
  isEditable: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, handleId: string, position: Position) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
}

export function AgentNode({
  node,
  isSelected,
  isEditable,
  onClick,
  onDragStart,
  onConnectionStart,
  onConnectionEnd
}: AgentNodeProps) {
  const handleConnectionHandleMouseDown = (handleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onConnectionStart(node.id, handleId, position);
  };

  const handleConnectionHandleMouseUp = (handleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectionEnd(node.id, handleId);
  };

  return (
    <div
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Card
        className={`w-64 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${isEditable ? 'cursor-move' : 'cursor-default'}`}
        onClick={onClick}
        onMouseDown={isEditable ? onDragStart : undefined}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{node.data.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {node.data.model || 'gpt-4o'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {node.data.instructions}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {node.data.tools && node.data.tools.length > 0 && (
              <div className="flex items-center gap-1">
                <Plug className="h-3 w-3" />
                <span>{node.data.tools.length} tools</span>
              </div>
            )}
            
            {node.data.guardrails && node.data.guardrails.length > 0 && (
              <div className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                <span>{node.data.guardrails.length} guardrails</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Connection Handles */}
        {isEditable && (
          <>
            {/* Input Handle (Left) */}
            <div
              className="absolute left-0 top-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('input', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('input', e)}
            />
            
            {/* Output Handle (Right) */}
            <div
              className="absolute right-0 top-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('output', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('output', e)}
            />
          </>
        )}
      </Card>
    </div>
  );
}