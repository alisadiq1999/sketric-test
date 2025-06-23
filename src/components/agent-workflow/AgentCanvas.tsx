'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  Panel,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AgentWorkflow, WorkflowAgent, WorkflowConnection, CanvasState } from '@/lib/types';
import { AgentNode } from './nodes/AgentNode';
import { ToolNode } from './nodes/ToolNode';
import { ConnectionLine } from './ConnectionLine';
import { WorkflowToolbar } from './WorkflowToolbar';
import { AgentPropertiesPanel } from './panels/AgentPropertiesPanel';
import { WorkflowSettingsPanel } from './panels/WorkflowSettingsPanel';
import { CodeGeneratorPanel } from './panels/CodeGeneratorPanel';
import { ExecutionPanel } from './panels/ExecutionPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { nanoid } from 'nanoid';

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
};

interface AgentCanvasProps {
  workflow: AgentWorkflow;
  onWorkflowChange: (workflow: AgentWorkflow) => void;
}

export function AgentCanvas({ workflow, onWorkflowChange }: AgentCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    workflow,
    selectedNodeId: null,
    isExecuting: false,
    executionResults: [],
    errors: [],
  });

  // Convert workflow to React Flow format
  const initialNodes: Node[] = workflow.agents.map((agent) => ({
    id: agent.id,
    type: 'agent',
    position: agent.position,
    data: {
      agent,
      isSelected: canvasState.selectedNodeId === agent.id,
      onUpdate: (updates: Partial<WorkflowAgent>) => updateAgent(agent.id, updates),
      onDelete: () => deleteAgent(agent.id),
    },
  }));

  const initialEdges: Edge[] = workflow.connections.map((connection) => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: connection.type === 'handoff' ? 'default' : 'straight',
    animated: connection.type === 'handoff',
    style: {
      stroke: connection.type === 'handoff' ? '#f59e0b' : '#6b7280',
      strokeWidth: 2,
    },
    label: connection.condition || '',
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newConnection: WorkflowConnection = {
        id: nanoid(),
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'handoff',
      };

      const updatedWorkflow = {
        ...workflow,
        connections: [...workflow.connections, newConnection],
      };

      onWorkflowChange(updatedWorkflow);
      setEdges((eds) => addEdge(params, eds));
    },
    [workflow, onWorkflowChange, setEdges]
  );

  const addAgent = useCallback(() => {
    const newAgent: WorkflowAgent = {
      id: nanoid(),
      name: 'New Agent',
      instructions: 'You are a helpful assistant.',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      tools: [],
      handoffs: [],
      structuredOutputs: [],
      guardrails: [],
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      isEntryPoint: workflow.agents.length === 0,
    };

    const updatedWorkflow = {
      ...workflow,
      agents: [...workflow.agents, newAgent],
    };

    onWorkflowChange(updatedWorkflow);
    
    const newNode: Node = {
      id: newAgent.id,
      type: 'agent',
      position: newAgent.position,
      data: {
        agent: newAgent,
        isSelected: false,
        onUpdate: (updates: Partial<WorkflowAgent>) => updateAgent(newAgent.id, updates),
        onDelete: () => deleteAgent(newAgent.id),
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [workflow, onWorkflowChange, setNodes]);

  const updateAgent = useCallback((agentId: string, updates: Partial<WorkflowAgent>) => {
    const updatedWorkflow = {
      ...workflow,
      agents: workflow.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      ),
    };

    onWorkflowChange(updatedWorkflow);
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === agentId
          ? {
              ...node,
              data: {
                ...node.data,
                agent: { ...node.data.agent, ...updates },
              },
            }
          : node
      )
    );
  }, [workflow, onWorkflowChange, setNodes]);

  const deleteAgent = useCallback((agentId: string) => {
    const updatedWorkflow = {
      ...workflow,
      agents: workflow.agents.filter((agent) => agent.id !== agentId),
      connections: workflow.connections.filter(
        (conn) => conn.source !== agentId && conn.target !== agentId
      ),
    };

    onWorkflowChange(updatedWorkflow);
    
    setNodes((nds) => nds.filter((node) => node.id !== agentId));
    setEdges((eds) => eds.filter((edge) => edge.source !== agentId && edge.target !== agentId));
  }, [workflow, onWorkflowChange, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setCanvasState((prev) => ({
      ...prev,
      selectedNodeId: node.id,
    }));
  }, []);

  const onPaneClick = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      selectedNodeId: null,
    }));
  }, []);

  const selectedAgent = canvasState.selectedNodeId
    ? workflow.agents.find((agent) => agent.id === canvasState.selectedNodeId)
    : null;

  return (
    <div className="h-screen w-full flex">
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              connectionLineComponent={ConnectionLine}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  if (node.type === 'agent') return '#3b82f6';
                  return '#6b7280';
                }}
                className="!bg-white !border !border-gray-200"
              />
              
              <Panel position="top-left">
                <WorkflowToolbar
                  onAddAgent={addAgent}
                  workflow={workflow}
                  onWorkflowChange={onWorkflowChange}
                />
              </Panel>

              <Panel position="top-right">
                <div className="flex gap-2">
                  <CodeGeneratorPanel workflow={workflow} />
                  <ExecutionPanel 
                    workflow={workflow}
                    canvasState={canvasState}
                    onStateChange={setCanvasState}
                  />
                </div>
              </Panel>

              <Panel position="bottom-right">
                <Card className="p-4 min-w-[300px]">
                  <div className="text-sm text-gray-600">
                    Agents: {workflow.agents.length} | 
                    Connections: {workflow.connections.length}
                  </div>
                </Card>
              </Panel>
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      {/* Side Panels */}
      <div className="w-80 border-l bg-gray-50">
        {selectedAgent ? (
          <AgentPropertiesPanel
            agent={selectedAgent}
            onUpdate={(updates) => updateAgent(selectedAgent.id, updates)}
          />
        ) : (
          <WorkflowSettingsPanel
            workflow={workflow}
            onUpdate={onWorkflowChange}
          />
        )}
      </div>
    </div>
  );
}