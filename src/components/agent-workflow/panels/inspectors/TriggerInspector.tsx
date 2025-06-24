'use client';

import React from 'react';
import { TriggerNode } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Trash2 } from 'lucide-react';

interface TriggerInspectorProps {
  node: TriggerNode;
  onUpdate: (updates: Partial<TriggerNode['data']>) => void;
  onDelete: () => void;
}

export function TriggerInspector({ node, onUpdate, onDelete }: TriggerInspectorProps) {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base">Trigger Configuration</CardTitle>
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
            <Label htmlFor="trigger-name">Name</Label>
            <Input
              id="trigger-name"
              value={node.data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Trigger name"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <p className="text-sm text-muted-foreground capitalize">
              {node.data.triggerType}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}