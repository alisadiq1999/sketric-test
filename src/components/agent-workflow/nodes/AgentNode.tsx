'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AgentNodeData } from '@/lib/types';
import { Bot, Settings, Trash2, Zap } from 'lucide-react';

export function AgentNode({ data, selected }: NodeProps<AgentNodeData>) {
  const { agent, onUpdate, onDelete } = data;

  return (
    <div className={`min-w-[280px] ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 !bg-green-500"
      />
      
      <Card className="shadow-lg border-2 border-gray-200 bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm truncate max-w-[150px]">
                {agent.name}
              </h3>
              {agent.isEntryPoint && (
                <Badge variant="secondary" className="text-xs">
                  Entry
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would open the agent settings
                }}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
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
        
        <CardContent className="pt-0 space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Model</div>
            <Badge variant="outline" className="text-xs">
              {agent.model}
            </Badge>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Instructions</div>
            <p className="text-xs text-gray-700 line-clamp-2">
              {agent.instructions}
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {agent.tools.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {agent.tools.length} Tools
              </Badge>
            )}
            {agent.handoffs.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {agent.handoffs.length} Handoffs
              </Badge>
            )}
            {agent.structuredOutputs.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {agent.structuredOutputs.length} Outputs
              </Badge>
            )}
            {agent.guardrails.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {agent.guardrails.length} Guards
              </Badge>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Temp: {agent.temperature}</span>
            <span>Max: {agent.maxTokens}</span>
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-orange-500"
      />

      {/* Additional handles for specific handoffs */}
      {agent.handoffs.map((handoff, index) => (
        <Handle
          key={handoff.id}
          type="source"
          position={Position.Bottom}
          id={`handoff-${handoff.id}`}
          style={{ left: `${30 + index * 20}%` }}
          className="w-3 h-3 !bg-purple-500"
        />
      ))}
    </div>
  );
}