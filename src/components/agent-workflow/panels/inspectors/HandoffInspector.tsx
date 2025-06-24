'use client';

import React from 'react';
import { HandoffNode } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, Trash2 } from 'lucide-react';

interface HandoffInspectorProps {
  node: HandoffNode;
  onUpdate: (updates: Partial<HandoffNode['data']>) => void;
  onDelete: () => void;
}

export function HandoffInspector({ node, onUpdate, onDelete }: HandoffInspectorProps) {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">Handoff Configuration</CardTitle>
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
            <Label htmlFor="from-agent">From Agent</Label>
            <Input
              id="from-agent"
              value={node.data.fromAgent}
              onChange={(e) => onUpdate({ fromAgent: e.target.value })}
              placeholder="Source agent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-agent">To Agent</Label>
            <Input
              id="to-agent"
              value={node.data.toAgent}
              onChange={(e) => onUpdate({ toAgent: e.target.value })}
              placeholder="Target agent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handoff-condition">Condition (Optional)</Label>
            <Input
              id="handoff-condition"
              value={node.data.condition || ''}
              onChange={(e) => onUpdate({ condition: e.target.value })}
              placeholder="Handoff condition"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}