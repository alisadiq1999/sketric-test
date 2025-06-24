'use client';

import React from 'react';
import { HandoffNode as HandoffNodeType, Position } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft } from 'lucide-react';

interface HandoffNodeProps {
  node: HandoffNodeType;
  isSelected: boolean;
  isEditable: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, handleId: string, position: Position) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
}

export function HandoffNode({
  node,
  isSelected,
  isEditable,
  onClick,
  onDragStart,
  onConnectionStart,
  onConnectionEnd
}: HandoffNodeProps) {
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
        className={`w-60 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${isEditable ? 'cursor-move' : 'cursor-default'} bg-purple-50 border-purple-200`}
        onClick={onClick}
        onMouseDown={isEditable ? onDragStart : undefined}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">Handoff</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-purple-100">
              Handoff
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-xs">
              <span className="text-muted-foreground">From: </span>
              <span className="font-medium">{node.data.fromAgent || 'Not set'}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">To: </span>
              <span className="font-medium">{node.data.toAgent || 'Not set'}</span>
            </div>
            {node.data.condition && (
              <div className="text-xs">
                <span className="text-muted-foreground">Condition: </span>
                <span className="font-mono text-xs bg-muted px-1 rounded">
                  {node.data.condition}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Connection Handles */}
        {isEditable && (
          <>
            {/* Input Handle (Left) */}
            <div
              className="absolute left-0 top-1/2 w-3 h-3 bg-purple-500 rounded-full border-2 border-background transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('input', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('input', e)}
            />
            
            {/* Output Handle (Right) */}
            <div
              className="absolute right-0 top-1/2 w-3 h-3 bg-purple-500 rounded-full border-2 border-background transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('output', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('output', e)}
            />
          </>
        )}
      </Card>
    </div>
  );
}