'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CanvasState } from '@/lib/workflow-types';
import { Play, Square, Save, Download, Upload } from 'lucide-react';

interface WorkflowToolbarProps {
  onExecute: () => void;
  onStop: () => void;
  isExecuting: boolean;
  canvasState: CanvasState;
}

export function WorkflowToolbar({
  onExecute,
  onStop,
  isExecuting,
  canvasState
}: WorkflowToolbarProps) {
  const hasNodes = canvasState.nodes.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Execution Controls */}
      {!isExecuting ? (
        <Button
          onClick={onExecute}
          disabled={!hasNodes}
          size="sm"
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Run Workflow
        </Button>
      ) : (
        <Button
          onClick={onStop}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}

      {/* Workflow Actions */}
      <div className="flex items-center gap-1 ml-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasNodes}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasNodes}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>
    </div>
  );
}