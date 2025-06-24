'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Wrench, 
  Play, 
  ArrowRightLeft, 
  Search,
  Database,
  Zap,
  Clock,
  Hand,
  Webhook
} from 'lucide-react';

interface NodeTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface AddNodePanelProps {
  onNodeAdd: (nodeType: string, position: { x: number; y: number }) => void;
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    id: 'agent',
    name: 'Agent',
    type: 'agent',
    description: 'AI agent with instructions and tools',
    icon: <Bot className="h-4 w-4" />,
    category: 'core'
  },
  {
    id: 'tool-data',
    name: 'Data Tool',
    type: 'tool',
    description: 'Tool for reading and retrieving data',
    icon: <Database className="h-4 w-4" />,
    category: 'tools'
  },
  {
    id: 'tool-action',
    name: 'Action Tool',
    type: 'tool',
    description: 'Tool for performing actions',
    icon: <Zap className="h-4 w-4" />,
    category: 'tools'
  },
  {
    id: 'tool-custom',
    name: 'Custom Tool',
    type: 'tool',
    description: 'Custom function or API tool',
    icon: <Wrench className="h-4 w-4" />,
    category: 'tools'
  },
  {
    id: 'trigger-manual',
    name: 'Manual Trigger',
    type: 'trigger',
    description: 'Manual workflow trigger',
    icon: <Hand className="h-4 w-4" />,
    category: 'triggers'
  },
  {
    id: 'trigger-api',
    name: 'API Trigger',
    type: 'trigger',
    description: 'API endpoint trigger',
    icon: <Play className="h-4 w-4" />,
    category: 'triggers'
  },
  {
    id: 'trigger-webhook',
    name: 'Webhook Trigger',
    type: 'trigger',
    description: 'Webhook-based trigger',
    icon: <Webhook className="h-4 w-4" />,
    category: 'triggers'
  },
  {
    id: 'trigger-schedule',
    name: 'Scheduled Trigger',
    type: 'trigger',
    description: 'Time-based trigger',
    icon: <Clock className="h-4 w-4" />,
    category: 'triggers'
  },
  {
    id: 'handoff',
    name: 'Handoff',
    type: 'handoff',
    description: 'Transfer control between agents',
    icon: <ArrowRightLeft className="h-4 w-4" />,
    category: 'core'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All', count: NODE_TEMPLATES.length },
  { id: 'core', name: 'Core', count: NODE_TEMPLATES.filter(t => t.category === 'core').length },
  { id: 'tools', name: 'Tools', count: NODE_TEMPLATES.filter(t => t.category === 'tools').length },
  { id: 'triggers', name: 'Triggers', count: NODE_TEMPLATES.filter(t => t.category === 'triggers').length }
];

export function AddNodePanel({ onNodeAdd }: AddNodePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTemplate, setDraggedTemplate] = useState<NodeTemplate | null>(null);

  const filteredTemplates = NODE_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = (template: NodeTemplate) => {
    // Add node at center of canvas
    onNodeAdd(template.type, { x: 400, y: 300 });
  };

  const handleDragStart = (template: NodeTemplate, e: React.DragEvent) => {
    setDraggedTemplate(template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedTemplate(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-b">
        <div className="flex p-2 gap-1">
          {CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-60">
                ({category.count})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Node Templates */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${
                draggedTemplate?.id === template.id ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(template, e)}
              onDragEnd={handleDragEnd}
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 text-primary">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No nodes found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="border-t p-3 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          Click or drag nodes to add them to your workflow.
        </p>
      </div>
    </div>
  );
}