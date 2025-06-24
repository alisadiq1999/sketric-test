'use client';

import React from 'react';
import { ToolNode as ToolNodeType, Position } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertTriangle, Database, Zap } from 'lucide-react';

interface ToolNodeProps {
  node: ToolNodeType;
  isSelected: boolean;
  isEditable: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, handleId: string, position: Position) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
}

export function ToolNode({
  node,
  isSelected,
  isEditable,
  onClick,
  onDragStart,
  onConnectionStart,
  onConnectionEnd
}: ToolNodeProps) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'action':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'agent':
        return <Wrench className="h-4 w-4 text-purple-500" />;
      default:
        return <Wrench className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        className={`w-56 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${isEditable ? 'cursor-move' : 'cursor-default'}`}
        onClick={onClick}
        onMouseDown={isEditable ? onDragStart : undefined}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(node.data.category)}
              <span className="font-medium text-sm">{node.data.name}</span>
            </div>
            <Badge className={`text-xs ${getRiskColor(node.data.riskLevel)}`}>
              {node.data.riskLevel}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {node.data.description}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <Badge variant="outline" className="text-xs">
              {node.data.category}
            </Badge>
            {node.data.parameters && (
              <span className="text-muted-foreground">
                {node.data.parameters.length} params
              </span>
            )}
          </div>
        </CardContent>

        {/* Connection Handles */}
        {isEditable && (
          <>
            {/* Input Handle (Left) */}
            <div
              className="absolute left-0 top-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-background transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('input', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('input', e)}
            />
            
            {/* Output Handle (Right) */}
            <div
              className="absolute right-0 top-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-background transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleConnectionHandleMouseDown('output', e)}
              onMouseUp={(e) => handleConnectionHandleMouseUp('output', e)}
            />
          </>
        )}
      </Card>
    </div>
  );
}