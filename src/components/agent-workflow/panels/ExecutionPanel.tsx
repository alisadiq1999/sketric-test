'use client';

import React, { useState } from 'react';
import { WorkflowExecution } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Play, Square, TestTube, Settings, Clock } from 'lucide-react';

interface ExecutionPanelProps {
  execution: WorkflowExecution | null;
  onExecute: () => void;
  onStop: () => void;
  isExecuting: boolean;
}

export function ExecutionPanel({
  execution,
  onExecute,
  onStop,
  isExecuting
}: ExecutionPanelProps) {
  const [testInput, setTestInput] = useState('{"message": "Hello, world!"}');
  const [selectedEnvironment, setSelectedEnvironment] = useState('development');

  const environments = [
    { id: 'development', name: 'Development', color: 'bg-blue-100 text-blue-800' },
    { id: 'staging', name: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'production', name: 'Production', color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Test Workflow</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="environment">Environment:</Label>
          <select
            id="environment"
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {environments.map(env => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Input Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-input">Input Data (JSON)</Label>
                <Textarea
                  id="test-input"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder='{"message": "Hello, world!"}'
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {!isExecuting ? (
                  <Button onClick={onExecute} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Execute Workflow
                  </Button>
                ) : (
                  <Button onClick={onStop} variant="destructive" className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop Execution
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Execution Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <CardTitle className="text-base">Execution Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue={300}
                  min={30}
                  max={3600}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-retries">Max Retries</Label>
                <Input
                  id="max-retries"
                  type="number"
                  defaultValue={3}
                  min={0}
                  max={10}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="enable-debug" defaultChecked />
                <Label htmlFor="enable-debug">Enable Debug Mode</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Execution Results */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Execution Results</CardTitle>
                {execution && (
                  <Badge className={`
                    ${execution.status === 'running' ? 'bg-blue-100 text-blue-800' : ''}
                    ${execution.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${execution.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {execution.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {!execution ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No execution results yet</p>
                    <p className="text-sm">Run your workflow to see results here</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Execution Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <div className="font-mono">{execution.startTime.toLocaleString()}</div>
                    </div>
                    {execution.endTime && (
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <div className="font-mono">{execution.endTime.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {/* Output */}
                  {execution.output && (
                    <div>
                      <Label>Output:</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-md text-sm font-mono overflow-auto max-h-64">
                        {JSON.stringify(execution.output, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Error */}
                  {execution.error && (
                    <div>
                      <Label className="text-red-600">Error:</Label>
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                        {execution.error}
                      </div>
                    </div>
                  )}

                  {/* Traces Summary */}
                  <div>
                    <Label>Execution Summary:</Label>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {execution.traces.length} steps executed
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}