'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToolNodeData } from '@/lib/types';
import { Wrench, Settings, Trash2 } from 'lucide-react';

export function ToolNode({ data, selected }: NodeProps<ToolNodeData>) {
  const { tool, onUpdate, onDelete } = data;

  const getToolIcon = () => {
    switch (tool.type) {
      case 'function':
        return '🔧';
      case 'api':
        return '🌐';
      case 'database':
        return '🗄️';
      case 'file':
        return '📁';
      default:
        return '⚙️';
    }
  };

  return (
    <div className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 !bg-blue-500"
      />
      
      <Card className="shadow-md border border-gray-200 bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{getToolIcon()}</span>
              <h3 className="font-semibold text-sm truncate max-w-[120px]">
                {tool.name}
              </h3>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would open the tool settings
                }}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          <div>
            <Badge variant="outline" className="text-xs">
              {tool.type}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-gray-700 line-clamp-2">
              {tool.description}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            {tool.parameters.length} parameters
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 !bg-green-500"
      />
    </div>
  );
}