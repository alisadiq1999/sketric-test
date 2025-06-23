'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AgentWorkflow, CanvasState } from '@/lib/types';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ExecutionPanelProps {
  workflow: AgentWorkflow;
  canvasState: CanvasState;
  onStateChange: (state: CanvasState) => void;
}

export function ExecutionPanel({ workflow, canvasState, onStateChange }: ExecutionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExecute = async () => {
    onStateChange({
      ...canvasState,
      isExecuting: true,
      executionResults: [],
      errors: [],
    });

    try {
      // Here you would integrate with your backend API to execute the workflow
      // For now, we'll simulate execution
      const response = await fetch('/api/execute-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }

      const results = await response.json();
      
      onStateChange({
        ...canvasState,
        isExecuting: false,
        executionResults: results,
        errors: [],
      });
    } catch (error) {
      onStateChange({
        ...canvasState,
        isExecuting: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    }
  };

  const handleStop = () => {
    // Stop execution logic here
    onStateChange({
      ...canvasState,
      isExecuting: false,
    });
  };

  const getExecutionStatus = () => {
    if (canvasState.isExecuting) {
      return { icon: Clock, color: 'text-yellow-500', text: 'Running' };
    }
    if (canvasState.errors.length > 0) {
      return { icon: AlertCircle, color: 'text-red-500', text: 'Error' };
    }
    if (canvasState.executionResults.length > 0) {
      return { icon: CheckCircle, color: 'text-green-500', text: 'Success' };
    }
    return { icon: Play, color: 'text-gray-500', text: 'Ready' };
  };

  const status = getExecutionStatus();
  const StatusIcon = status.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={canvasState.isExecuting ? "destructive" : "default"}
          onClick={canvasState.isExecuting ? handleStop : () => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          {canvasState.isExecuting ? 'Stop' : 'Execute'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
            Workflow Execution - {status.text}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Execution Controls */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-medium">{workflow.name}</div>
                <div className="text-gray-500">{workflow.agents.length} agents</div>
              </div>
              <Badge variant={canvasState.isExecuting ? "default" : "secondary"}>
                {status.text}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {!canvasState.isExecuting ? (
                <Button onClick={handleExecute} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Execute Workflow
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Stop Execution
                </Button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <ScrollArea className="h-96">
              <div className="p-4 space-y-4">
                {/* Errors */}
                {canvasState.errors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Errors
                    </h3>
                    {canvasState.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="text-sm text-red-800">{error}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution Results */}
                {canvasState.executionResults.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Results
                    </h3>
                    {canvasState.executionResults.map((result, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="text-sm">
                          <div className="font-medium mb-1">Agent: {result.agentName}</div>
                          <div className="text-gray-700">{result.output}</div>
                          {result.executionTime && (
                            <div className="text-xs text-gray-500 mt-2">
                              Execution time: {result.executionTime}ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Loading State */}
                {canvasState.isExecuting && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <div className="text-sm text-gray-600">Executing workflow...</div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!canvasState.isExecuting && 
                 canvasState.executionResults.length === 0 && 
                 canvasState.errors.length === 0 && (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <div className="text-center">
                      <Play className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <div className="text-sm">Click "Execute Workflow" to run your agents</div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}