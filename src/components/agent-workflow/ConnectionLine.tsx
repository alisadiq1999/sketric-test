'use client';

import React from 'react';
import { ConnectionLineComponentProps } from 'reactflow';

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2}
        strokeDasharray="5,5"
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#f59e0b"
        r={3}
        stroke="#fff"
        strokeWidth={1.5}
      />
    </g>
  );
}