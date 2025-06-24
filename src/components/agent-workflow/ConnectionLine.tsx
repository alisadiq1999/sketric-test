'use client';

import React from 'react';
import { NodeConnection, WorkflowNode } from '@/lib/workflow-types';

interface ConnectionLineProps {
  connection: NodeConnection;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<SVGGElement>) => void;
}

export function ConnectionLine({
  connection,
  sourceNode,
  targetNode,
  isSelected,
  onClick
}: ConnectionLineProps) {
  // Calculate connection points
  const sourceX = sourceNode.position.x + 128; // Half of node width (256px)
  const sourceY = sourceNode.position.y;
  const targetX = targetNode.position.x - 128; // Half of node width (256px)  
  const targetY = targetNode.position.y;

  // Create a curved path
  const midX = (sourceX + targetX) / 2;
  const curvature = Math.abs(targetX - sourceX) * 0.3;
  
  const pathData = `
    M ${sourceX} ${sourceY}
    C ${sourceX + curvature} ${sourceY}
      ${targetX - curvature} ${targetY}
      ${targetX} ${targetY}
  `;

  return (
    <g 
      className="pointer-events-auto cursor-pointer"
      onClick={onClick}
    >
      {/* Shadow/background path for easier clicking */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
      />
      
      {/* Main connection line */}
      <path
        d={pathData}
        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
        strokeWidth={isSelected ? "3" : "2"}
        fill="none"
        markerEnd="url(#arrowhead)"
        className="transition-all duration-200"
      />
      
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          />
        </marker>
      </defs>
      
      {/* Connection label */}
      <text
        x={midX}
        y={(sourceY + targetY) / 2 - 10}
        textAnchor="middle"
        className="text-xs fill-muted-foreground font-medium pointer-events-none"
      >
        {connection.sourceHandle} → {connection.targetHandle}
      </text>
    </g>
  );
}