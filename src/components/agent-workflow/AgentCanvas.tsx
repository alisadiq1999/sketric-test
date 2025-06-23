'use client';

import React, { useCallback, useState } from 'react';
import { WorkflowNode, WorkflowConnection } from '@/lib/workflow-types';
import { AgentNode } from './nodes/AgentNode';
import { ToolNode } from './nodes/ToolNode';
import { TriggerNode } from './nodes/TriggerNode';
import { ConnectionLine } from './ConnectionLine';

interface AgentCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onConnectionsChange: (connections: WorkflowConnection[]) => void;
}

export function AgentCanvas({ 
  nodes, 
  connections, 
  onNodesChange, 
  onConnectionsChange 
}: AgentCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  }, [selectedNode]);

  const handleNodeDragStart = useCallback((nodeId: string, event: React.MouseEvent) => {
    setDraggedNode(nodeId);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleNodeDrag = useCallback((event: React.MouseEvent) => {
    if (!draggedNode) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    onNodesChange(nodes.map(node => 
      node.id === draggedNode
        ? { ...node, position: { x: node.position.x + deltaX, y: node.position.y + deltaY } }
        : node
    ));

    setDragStart({ x: event.clientX, y: event.clientY });
  }, [draggedNode, dragStart, nodes, onNodesChange]);

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    onNodesChange(nodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    ));
  }, [nodes, onNodesChange]);

  const renderNode = (node: WorkflowNode) => {
    const commonProps = {
      key: node.id,
      node,
      selected: selectedNode === node.id,
      onClick: () => handleNodeClick(node.id),
      onDragStart: (e: React.MouseEvent) => handleNodeDragStart(node.id, e),
      onUpdate: (data: any) => handleNodeUpdate(node.id, data),
      style: {
        position: 'absolute' as const,
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)'
      }
    };

    switch (node.type) {
      case 'trigger':
        return <TriggerNode {...commonProps} />;
      case 'agent':
        return <AgentNode {...commonProps} />;
      case 'tool':
        return <ToolNode {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-background overflow-hidden"
      onMouseMove={handleNodeDrag}
      onMouseUp={handleNodeDragEnd}
      onMouseLeave={handleNodeDragEnd}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => {
          const sourceNode = nodes.find(n => n.id === connection.source);
          const targetNode = nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <ConnectionLine
              key={`${connection.source}-${connection.target}-${index}`}
              start={sourceNode.position}
              end={targetNode.position}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(renderNode)}

      {/* Canvas overlay for clicks */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={() => setSelectedNode(null)}
        style={{ zIndex: -1 }}
      />
    </div>
  );
}