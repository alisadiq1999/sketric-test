'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  Download, 
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ExecutionPanelProps {
  savedWorkflow: any;
  onExecute: (input: string) => void;
  isExecuting: boolean;
}

export function ExecutionPanel({ 
  savedWorkflow, 
  onExecute, 
  isExecuting 
}: ExecutionPanelProps) {
  const [testInput, setTestInput] = useState('How can I rank resumes for a job in Resumes Ranker?');
  const [executionHistory, setExecutionHistory] = useState<Array<{
    id: string;
    input: string;
    timestamp: number;
    status: 'running' | 'completed' | 'failed';
    duration?: number;
  }>>([]);

  const handleExecute = () => {
    if (!testInput.trim()) return;
    
    const execution = {
      id: Date.now().toString(),
      input: testInput,
      timestamp: Date.now(),
      status: 'running' as const
    };
    
    setExecutionHistory(prev => [execution, ...prev]);
    onExecute(testInput);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="h-full flex flex-col p-4 bg-card">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Node Inspector</h2>
        <p className="text-sm text-muted-foreground">
          Configure and test your workflow
        </p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Workflow Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Workflow Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Saved:</span>
              <Badge variant={savedWorkflow ? 'default' : 'secondary'}>
                {savedWorkflow ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Nodes:</span>
              <Badge variant="outline">
                {savedWorkflow?.nodes?.length || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Connections:</span>
              <Badge variant="outline">
                {savedWorkflow?.connections?.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Test Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="test-input" className="text-xs">
                Message to send to workflow
              </Label>
              <Textarea
                id="test-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type your message..."
                className="mt-1 text-sm"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleExecute}
              disabled={!savedWorkflow || isExecuting || !testInput.trim()}
              className="w-full"
              size="sm"
            >
              {isExecuting ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Agent
                </>
              )}
            </Button>
            
            {!savedWorkflow && (
              <p className="text-xs text-muted-foreground">
                Save your workflow first to enable testing
              </p>
            )}
          </CardContent>
        </Card>

        {/* Execution History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            {executionHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No executions yet
              </p>
            ) : (
              <div className="space-y-2">
                {executionHistory.slice(0, 5).map((execution) => (
                  <div 
                    key={execution.id}
                    className="flex items-start gap-2 p-2 rounded border text-xs"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {execution.status === 'running' && (
                        <Clock className="w-3 h-3 text-blue-500 animate-spin" />
                      )}
                      {execution.status === 'completed' && (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      )}
                      {execution.status === 'failed' && (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-foreground">
                        {execution.input}
                      </p>
                      <p className="text-muted-foreground">
                        {formatTime(execution.timestamp)}
                        {execution.duration && ` • ${execution.duration}ms`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              disabled={!savedWorkflow}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">
            Powered by <span className="font-medium">SkeltricGen</span>
          </p>
          <p>
            When the workflow is completed and run the widget pops up for testing
          </p>
        </div>
      </div>
    </div>
  );
}