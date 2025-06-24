'use client';

import React from 'react';
import { TriggerNode as TriggerNodeType, Position } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Webhook, Clock, Hand } from 'lucide-react';

interface TriggerNodeProps {
  node: TriggerNodeType;
  isSelected: boolean;
  isEditable: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, handleId: string, position: Position) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
}

export function TriggerNode({
  node,
  isSelected,
  isEditable,
  onClick,
  onDragStart,
  onConnectionStart,
  onConnectionEnd
}: TriggerNodeProps) {
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

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'webhook':
        return <Webhook className="h-4 w-4 text-blue-500" />;
      case 'schedule':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'manual':
        return <Hand className="h-4 w-4 text-orange-500" />;
      default:
        return <Play className="h-4 w-4 text-muted-foreground" />;
    }
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
        className={`w-52 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${isEditable ? 'cursor-move' : 'cursor-default'} bg-green-50 border-green-200`}
        onClick={onClick}
        onMouseDown={isEditable ? onDragStart : undefined}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTriggerIcon(node.data.triggerType)}
              <span className="font-medium text-sm">{node.data.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-green-100">
              Trigger
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs capitalize">
              {node.data.triggerType}
            </Badge>
          </div>
        </CardContent>

        {/* Connection Handles - Only Output for triggers */}
        {isEditable && (
          <div
            className="absolute right-0 top-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-background transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
            onMouseDown={(e) => handleConnectionHandleMouseDown('output', e)}
            onMouseUp={(e) => handleConnectionHandleMouseUp('output', e)}
          />
        )}
      </Card>
    </div>
  );
}