'use client';

import React from 'react';
import { ToolNode } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, Trash2 } from 'lucide-react';

interface ToolInspectorProps {
  node: ToolNode;
  onUpdate: (updates: Partial<ToolNode['data']>) => void;
  onDelete: () => void;
}

export function ToolInspector({ node, onUpdate, onDelete }: ToolInspectorProps) {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-base">Tool Configuration</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name">Name</Label>
            <Input
              id="tool-name"
              value={node.data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Tool name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tool-description">Description</Label>
            <Textarea
              id="tool-description"
              value={node.data.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Tool description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tool-function">Function</Label>
            <Textarea
              id="tool-function"
              value={node.data.function}
              onChange={(e) => onUpdate({ function: e.target.value })}
              placeholder="Function implementation..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}