'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Bot,
  Wrench,
  Zap
} from 'lucide-react';
import { WorkflowTrace } from '@/lib/workflow-types';
import { cn } from '@/lib/utils';

interface TraceDisplayProps {
  traces: WorkflowTrace[];
  isExecuting: boolean;
}

export function TraceDisplay({ traces, isExecuting }: TraceDisplayProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Play className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'agent_start':
      case 'agent_end':
        return <Bot className="w-4 h-4 text-purple-500" />;
      case 'tool_start':
      case 'tool_end':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
  };

  const renderTraceFlow = () => {
    if (traces.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {isExecuting ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Executing workflow...</span>
            </div>
          ) : (
            <span>Traces will appear here when you run your workflow</span>
          )}
        </div>
      );
    }

    // Group traces by execution flow
    const traceFlow = traces.reduce((acc, trace) => {
      const key = trace.nodeId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(trace);
      return acc;
    }, {} as Record<string, WorkflowTrace[]>);

    return (
      <div className="flex items-center gap-2 p-4 overflow-x-auto">
        {Object.entries(traceFlow).map(([nodeId, nodeTraces], index) => {
          const latestTrace = nodeTraces[nodeTraces.length - 1];
          const isRunning = latestTrace.status === 'running';
          const hasError = nodeTraces.some(t => t.status === 'error');
          
          return (
            <React.Fragment key={nodeId}>
              <div className="flex flex-col items-center gap-2 min-w-0">
                <Card className={cn(
                  "w-32 transition-all duration-200",
                  isRunning && "ring-2 ring-blue-500 shadow-lg",
                  hasError && "border-red-200 dark:border-red-800",
                  latestTrace.status === 'success' && "border-green-200 dark:border-green-800"
                )}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      {getNodeIcon(latestTrace.type)}
                      {getStatusIcon(latestTrace.status)}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium truncate" title={latestTrace.nodeName}>
                        {latestTrace.nodeName}
                      </p>
                      <p className="text-muted-foreground">
                        {latestTrace.type.replace('_', ' ')}
                      </p>
                      {latestTrace.duration && (
                        <p className="text-muted-foreground">
                          {formatDuration(latestTrace.duration)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Show status badges */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {nodeTraces.map((trace, traceIndex) => (
                    <Badge 
                      key={traceIndex}
                      variant={
                        trace.status === 'success' ? 'default' :
                        trace.status === 'error' ? 'destructive' :
                        trace.status === 'running' ? 'secondary' : 'outline'
                      }
                      className="text-xs px-1 py-0"
                    >
                      {trace.type.split('_')[1] || trace.type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {index < Object.entries(traceFlow).length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card/50 p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Traces here</h3>
          {isExecuting && (
            <div className="flex items-center gap-2">
              <Progress value={undefined} className="w-20 h-2" />
              <span className="text-xs text-muted-foreground">Running</span>
            </div>
          )}
        </div>
        
        {traces.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            Each message run shows the trace here, what agent executed what, inputs 
            and outputs and how much the LLM calls for debugging
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {renderTraceFlow()}
      </ScrollArea>
    </div>
  );
}