'use client';

import React from 'react';
import { WorkflowExecution, ExecutionTrace } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TraceDisplayProps {
  execution: WorkflowExecution | null;
}

export function TraceDisplay({ execution }: TraceDisplayProps) {
  if (!execution) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No execution traces available
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Execution Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Execution Overview</CardTitle>
            <Badge className={getStatusColor(execution.status)}>
              {execution.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Started:</span>
              <span className="ml-2">{execution.startTime.toLocaleTimeString()}</span>
            </div>
            {execution.endTime && (
              <div>
                <span className="text-muted-foreground">Ended:</span>
                <span className="ml-2">{execution.endTime.toLocaleTimeString()}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2">
                {execution.endTime 
                  ? `${Math.round((execution.endTime.getTime() - execution.startTime.getTime()) / 1000)}s`
                  : 'Running...'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Traces:</span>
              <span className="ml-2">{execution.traces.length}</span>
            </div>
          </div>
          
          {execution.error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <strong>Error:</strong> {execution.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Traces */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Execution Traces</h4>
        
        {execution.traces.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              No traces available yet
            </CardContent>
          </Card>
        ) : (
          execution.traces.map((trace, index) => (
            <Card key={trace.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(trace.status)}
                    <span className="font-medium text-sm">{trace.nodeName}</span>
                    <Badge variant="outline" className="text-xs">
                      {trace.nodeType}
                    </Badge>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(trace.status)}`}>
                    {trace.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <div>Started: {trace.startTime.toLocaleTimeString()}</div>
                  {trace.endTime && (
                    <div>Completed: {trace.endTime.toLocaleTimeString()}</div>
                  )}
                  {trace.error && (
                    <div className="text-red-600 mt-1">Error: {trace.error}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}