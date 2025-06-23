'use client';

import React from 'react';

interface ConnectionLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  animated?: boolean;
  status?: 'default' | 'success' | 'error' | 'running';
}

export function ConnectionLine({ 
  start, 
  end, 
  animated = false,
  status = 'default'
}: ConnectionLineProps) {
  const getLineColor = () => {
    switch (status) {
      case 'success':
        return '#22c55e'; // green-500
      case 'error':
        return '#ef4444'; // red-500
      case 'running':
        return '#3b82f6'; // blue-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getLineWidth = () => {
    return status === 'running' ? 3 : 2;
  };

  // Calculate curved path
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Create a smooth curve
  const controlPoint1X = start.x + (midX - start.x) * 0.5;
  const controlPoint1Y = start.y;
  const controlPoint2X = end.x - (end.x - midX) * 0.5;
  const controlPoint2Y = end.y;

  const pathData = `M ${start.x} ${start.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${end.x} ${end.y}`;

  return (
    <g>
      {/* Shadow/glow effect for running state */}
      {status === 'running' && (
        <path
          d={pathData}
          stroke={getLineColor()}
          strokeWidth={getLineWidth() + 2}
          fill="none"
          opacity={0.3}
          strokeLinecap="round"
        />
      )}
      
      {/* Main line */}
      <path
        d={pathData}
        stroke={getLineColor()}
        strokeWidth={getLineWidth()}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={status === 'running' ? '5,5' : undefined}
        className={animated || status === 'running' ? 'animate-pulse' : ''}
      />
      
      {/* Arrow marker */}
      <defs>
        <marker
          id={`arrowhead-${status}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={getLineColor()}
          />
        </marker>
      </defs>
      
      {/* Arrow at the end */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={getLineWidth()}
        fill="none"
        markerEnd={`url(#arrowhead-${status})`}
      />

      {/* Status indicator dot */}
      {status !== 'default' && (
        <circle
          cx={midX}
          cy={midY}
          r="4"
          fill={getLineColor()}
          className={status === 'running' ? 'animate-pulse' : ''}
        />
      )}
    </g>
  );
}