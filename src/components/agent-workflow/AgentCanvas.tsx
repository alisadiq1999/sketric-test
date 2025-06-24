'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { CanvasState, WorkflowNode, NodeConnection, Position } from '@/lib/workflow-types';
import { AgentNode } from './nodes/AgentNode';
import { ToolNode } from './nodes/ToolNode';
import { TriggerNode } from './nodes/TriggerNode';
import { HandoffNode } from './nodes/HandoffNode';
import { ConnectionLine } from './ConnectionLine';

interface AgentCanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  onNodeSelect: (nodeId: string | null) => void;
  onConnectionAdd: (connection: NodeConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  mode: 'edit' | 'view' | 'debug';
}

export function AgentCanvas({
  canvasState,
  onCanvasStateChange,
  onNodeSelect,
  onConnectionAdd,
  onConnectionDelete,
  mode
}: AgentCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{
    sourceId: string;
    sourceHandle: string;
    position: Position;
  } | null>(null);

  // Handle canvas click to deselect nodes
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  // Handle node selection
  const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect(nodeId);
  }, [onNodeSelect]);

  // Handle node drag start
  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (mode !== 'edit') return;
    
    e.preventDefault();
    setIsDragging(true);
    setDraggedNodeId(nodeId);
    
    const node = canvasState.nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.position.x,
        y: e.clientY - rect.top - node.position.y
      });
    }
  }, [mode, canvasState.nodes]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };

    onCanvasStateChange({
      ...canvasState,
      nodes: canvasState.nodes.map(node =>
        node.id === draggedNodeId
          ? { ...node, position: newPosition }
          : node
      )
    });
  }, [isDragging, draggedNodeId, dragOffset, canvasState, onCanvasStateChange]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Handle connection start
  const handleConnectionStart = useCallback((nodeId: string, handleId: string, position: Position) => {
    if (mode !== 'edit') return;
    
    setConnecting({
      sourceId: nodeId,
      sourceHandle: handleId,
      position
    });
  }, [mode]);

  // Handle connection end
  const handleConnectionEnd = useCallback((nodeId: string, handleId: string) => {
    if (!connecting || mode !== 'edit') return;

    // Don't allow self-connections
    if (connecting.sourceId === nodeId) {
      setConnecting(null);
      return;
    }

    // Check if connection already exists
    const connectionExists = canvasState.connections.some(conn =>
      conn.source === connecting.sourceId &&
      conn.target === nodeId &&
      conn.sourceHandle === connecting.sourceHandle &&
      conn.targetHandle === handleId
    );

    if (!connectionExists) {
      const newConnection: NodeConnection = {
        id: `conn-${Date.now()}`,
        source: connecting.sourceId,
        target: nodeId,
        sourceHandle: connecting.sourceHandle,
        targetHandle: handleId
      };
      onConnectionAdd(newConnection);
    }

    setConnecting(null);
  }, [connecting, mode, canvasState.connections, onConnectionAdd]);

  // Handle connection delete
  const handleConnectionClick = useCallback((connectionId: string, e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    if (mode === 'edit') {
      onConnectionDelete(connectionId);
    }
  }, [mode, onConnectionDelete]);

  // Add event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDraggedNodeId(null);
      setConnecting(null);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Render node based on type
  const renderNode = (node: WorkflowNode) => {
    const isSelected = canvasState.selectedNodeId === node.id;
    const commonProps = {
      node,
      isSelected,
      isEditable: mode === 'edit',
      onClick: (e: React.MouseEvent) => handleNodeClick(node.id, e),
      onDragStart: (e: React.MouseEvent) => handleNodeDragStart(node.id, e),
      onConnectionStart: handleConnectionStart,
      onConnectionEnd: handleConnectionEnd
    };

    switch (node.type) {
      case 'agent':
        return <AgentNode key={node.id} {...commonProps} />;
      case 'tool':
        return <ToolNode key={node.id} {...commonProps} />;
      case 'trigger':
        return <TriggerNode key={node.id} {...commonProps} />;
      case 'handoff':
        return <HandoffNode key={node.id} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-muted/20 overflow-hidden cursor-grab"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
        transformOrigin: '0 0'
      }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {canvasState.connections.map(connection => {
          const sourceNode = canvasState.nodes.find(n => n.id === connection.source);
          const targetNode = canvasState.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              sourceNode={sourceNode}
              targetNode={targetNode}
              isSelected={canvasState.selectedConnectionId === connection.id}
              onClick={(e) => handleConnectionClick(connection.id, e)}
            />
          );
        })}
        
        {/* Temporary connection line while connecting */}
        {connecting && (
          <line
            x1={connecting.position.x}
            y1={connecting.position.y}
            x2={connecting.position.x + 100}
            y2={connecting.position.y}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="pointer-events-none"
          />
        )}
      </svg>

      {/* Nodes */}
      {canvasState.nodes.map(renderNode)}

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          className="p-2 bg-card border rounded-md shadow-sm hover:bg-accent"
          onClick={() => onCanvasStateChange({
            ...canvasState,
            zoom: Math.min(canvasState.zoom * 1.2, 2)
          })}
          disabled={mode !== 'edit'}
        >
          +
        </button>
        <button
          className="p-2 bg-card border rounded-md shadow-sm hover:bg-accent"
          onClick={() => onCanvasStateChange({
            ...canvasState,
            zoom: Math.max(canvasState.zoom / 1.2, 0.5)
          })}
          disabled={mode !== 'edit'}
        >
          -
        </button>
        <button
          className="p-2 bg-card border rounded-md shadow-sm hover:bg-accent text-xs"
          onClick={() => onCanvasStateChange({
            ...canvasState,
            zoom: 1,
            pan: { x: 0, y: 0 }
          })}
          disabled={mode !== 'edit'}
        >
          Fit
        </button>
      </div>
    </div>
  );
}