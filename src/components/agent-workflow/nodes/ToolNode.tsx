'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle, XCircle } from 'lucide-react';
import { WorkflowNode, ToolNodeData } from '@/lib/workflow-types';
import { cn } from '@/lib/utils';

interface ToolNodeProps {
  node: WorkflowNode;
  selected: boolean;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (data: Partial<ToolNodeData>) => void;
  style?: React.CSSProperties;
}

export function ToolNode({ 
  node, 
  selected, 
  onClick, 
  onDragStart, 
  onUpdate,
  style 
}: ToolNodeProps) {
  const data = node.data as ToolNodeData;

  const getToolIcon = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'webscrape':
      case 'web_scrape':
        return '🌐';
      case 'seotool':
      case 'seo_tool':
        return '⚡';
      case 'email':
        return '📧';
      case 'database':
        return '🗄️';
      default:
        return '🔧';
    }
  };

  const getToolStatus = (toolName: string) => {
    // Mock status for demo - in real app this would come from execution state
    const mockStatuses = {
      'webscrape': 'success',
      'web_scrape': 'success',
      'seotool': 'error',
      'seo_tool': 'error',
    };
    return mockStatuses[toolName.toLowerCase() as keyof typeof mockStatuses];
  };

  const status = getToolStatus(data.toolName);

  return (
    <div style={style}>
      <Card 
        className={cn(
          "w-48 cursor-pointer transition-all duration-200 hover:shadow-md relative",
          selected && "ring-2 ring-primary shadow-lg",
          status === 'success' && "border-green-200 dark:border-green-800",
          status === 'error' && "border-red-200 dark:border-red-800"
        )}
        onClick={onClick}
        onMouseDown={onDragStart}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Wrench className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm flex items-center gap-2">
                {data.toolName}
                <span className="text-lg">{getToolIcon(data.toolName)}</span>
              </h3>
              <Badge variant="secondary" className="text-xs">
                Tool
              </Badge>
            </div>
            {status && (
              <div className="flex items-center">
                {status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {status === 'error' && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            {data.description && (
              <p className="line-clamp-2" title={data.description}>
                {data.description}
              </p>
            )}
            
            {data.parameters && Object.keys(data.parameters).length > 0 && (
              <div>
                <p className="font-medium">Parameters:</p>
                <div className="space-y-1">
                  {Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (
                    <p key={key} className="truncate">
                      <span className="font-mono">{key}:</span> {String(value)}
                    </p>
                  ))}
                  {Object.keys(data.parameters).length > 2 && (
                    <p className="text-muted-foreground/60">
                      +{Object.keys(data.parameters).length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {(!data.parameters || Object.keys(data.parameters).length === 0) && (
              <p className="text-muted-foreground/60">No parameters configured</p>
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