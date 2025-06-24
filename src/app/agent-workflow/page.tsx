'use client';

import React, { useState, useCallback } from 'react';
import { AgentCanvas } from '@/components/agent-workflow/AgentCanvas';
import { WorkflowToolbar } from '@/components/agent-workflow/WorkflowToolbar';
import { AddNodePanel } from '@/components/agent-workflow/panels/AddNodePanel';
import { NodeInspectorPanel } from '@/components/agent-workflow/panels/NodeInspectorPanel';
import { ExecutionPanel } from '@/components/agent-workflow/panels/ExecutionPanel';
import { TraceDisplay } from '@/components/agent-workflow/TraceDisplay';
import { CodeGeneratorPanel } from '@/components/agent-workflow/panels/CodeGeneratorPanel';
import { 
  WorkflowNode, 
  NodeConnection, 
  CanvasState, 
  UIState,
  WorkflowExecution 
} from '@/lib/workflow-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Play,
  Square,
  Code,
  TestTube,
  Rocket
} from 'lucide-react';

export default function AgentWorkflowPage() {
  // Canvas State
  const [canvasState, setCanvasState] = useState<CanvasState>({
    nodes: [],
    connections: [],
    selectedNodeId: null,
    selectedConnectionId: null,
    draggedNodeType: null,
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  // UI State
  const [uiState, setUIState] = useState<UIState>({
    isNodeInspectorOpen: true,
    isAddNodePanelOpen: true,
    isTracePanelOpen: false,
    activeTab: 'design',
    canvasMode: 'edit'
  });

  // Execution State
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Canvas Event Handlers
  const handleNodeAdd = useCallback((nodeType: string, position: { x: number; y: number }) => {
    const newNode = createNodeFromType(nodeType, position);

    setCanvasState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      selectedNodeId: newNode.id
    }));
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<WorkflowNode['data']>) => {
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    }));
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.source !== nodeId && conn.target !== nodeId
      ),
      selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId
    }));
  }, []);

  const handleConnectionAdd = useCallback((connection: NodeConnection) => {
    setCanvasState(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
  }, []);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setCanvasState(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId),
      selectedConnectionId: prev.selectedConnectionId === connectionId ? null : prev.selectedConnectionId
    }));
  }, []);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setCanvasState(prev => ({
      ...prev,
      selectedNodeId: nodeId,
      selectedConnectionId: null
    }));
  }, []);

  // UI Event Handlers
  const togglePanel = useCallback((panel: keyof UIState) => {
    setUIState(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  }, []);

  // Workflow Execution
  const handleExecuteWorkflow = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setUIState(prev => ({ ...prev, isTracePanelOpen: true }));
    
    try {
      // TODO: Implement actual workflow execution
      const execution: WorkflowExecution = {
        id: `exec-${Date.now()}`,
        workflowId: 'current-workflow',
        status: 'running',
        startTime: new Date(),
        input: {},
        traces: []
      };
      
      setCurrentExecution(execution);
      
      // Simulate execution
      setTimeout(() => {
        setCurrentExecution(prev => prev ? {
          ...prev,
          status: 'completed',
          endTime: new Date(),
          output: { result: 'Workflow completed successfully' }
        } : null);
        setIsExecuting(false);
      }, 3000);
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setIsExecuting(false);
    }
  }, [isExecuting]);

  const handleStopExecution = useCallback(() => {
    setIsExecuting(false);
    setCurrentExecution(prev => prev ? {
      ...prev,
      status: 'failed',
      endTime: new Date(),
      error: 'Execution stopped by user'
    } : null);
  }, []);

  const selectedNode = canvasState.nodes.find(node => node.id === canvasState.selectedNodeId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Agent Workflow Designer</h1>
            <WorkflowToolbar 
              onExecute={handleExecuteWorkflow}
              onStop={handleStopExecution}
              isExecuting={isExecuting}
              canvasState={canvasState}
            />
          </div>
          
          <Tabs value={uiState.activeTab} onValueChange={(tab) => 
            setUIState(prev => ({ ...prev, activeTab: tab as UIState['activeTab'] }))
          }>
            <TabsList>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panels */}
        <div className={`flex flex-col border-r bg-card transition-all duration-300 ${
          uiState.isAddNodePanelOpen || uiState.isNodeInspectorOpen ? 'w-80' : 'w-0'
        }`}>
          {/* Add Node Panel */}
          {uiState.isAddNodePanelOpen && (
            <div className="flex-1 border-b">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-medium">Add Nodes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePanel('isAddNodePanelOpen')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <AddNodePanel onNodeAdd={handleNodeAdd} />
            </div>
          )}

          {/* Node Inspector Panel */}
          {uiState.isNodeInspectorOpen && (
            <div className="flex-1">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-medium">Node Inspector</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePanel('isNodeInspectorOpen')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <NodeInspectorPanel 
                selectedNode={selectedNode}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={handleNodeDelete}
              />
            </div>
          )}
        </div>

        {/* Collapsed Panel Toggle Buttons */}
        {!uiState.isAddNodePanelOpen && !uiState.isNodeInspectorOpen && (
          <div className="flex flex-col border-r">
            <Button
              variant="ghost"
              size="sm"
              className="h-12 px-2"
              onClick={() => togglePanel('isAddNodePanelOpen')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={uiState.activeTab} className="flex-1 flex flex-col">
            <TabsContent value="design" className="flex-1 m-0">
              <AgentCanvas
                canvasState={canvasState}
                onCanvasStateChange={setCanvasState}
                onNodeSelect={handleNodeSelect}
                onConnectionAdd={handleConnectionAdd}
                onConnectionDelete={handleConnectionDelete}
                mode={uiState.canvasMode}
              />
            </TabsContent>
            
            <TabsContent value="code" className="flex-1 m-0">
              <CodeGeneratorPanel canvasState={canvasState} />
            </TabsContent>
            
            <TabsContent value="test" className="flex-1 m-0">
              <ExecutionPanel 
                execution={currentExecution}
                onExecute={handleExecuteWorkflow}
                onStop={handleStopExecution}
                isExecuting={isExecuting}
              />
            </TabsContent>
            
            <TabsContent value="deploy" className="flex-1 m-0 p-8">
              <div className="text-center">
                <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Deployment Coming Soon</h3>
                <p className="text-muted-foreground">
                  Deploy your agent workflows to production environments.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Trace Panel */}
      {uiState.isTracePanelOpen && (
        <div className="border-t bg-card">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Execution Traces</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePanel('isTracePanelOpen')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-64 overflow-y-auto">
            <TraceDisplay execution={currentExecution} />
          </div>
        </div>
      )}

      {/* Collapsed Trace Panel Toggle */}
      {!uiState.isTracePanelOpen && currentExecution && (
        <div className="border-t bg-card">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8"
            onClick={() => togglePanel('isTracePanelOpen')}
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            Show Execution Traces
          </Button>
        </div>
      )}
    </div>
  );
}

function createNodeFromType(nodeType: string, position: { x: number; y: number }): WorkflowNode {
  const id = `${nodeType}-${Date.now()}`;
  
  switch (nodeType) {
    case 'agent':
      return {
        id,
        type: 'agent',
        position,
        data: {
          name: 'New Agent',
          instructions: 'You are a helpful assistant.',
          model: 'gpt-4o',
          tools: [],
          temperature: 0.7,
          maxTokens: 4000
        }
      };
    case 'tool':
      return {
        id,
        type: 'tool',
        position,
        data: {
          name: 'New Tool',
          description: 'A custom tool function',
          function: '',
          parameters: [],
          category: 'data',
          riskLevel: 'low'
        }
      };
    case 'trigger':
      return {
        id,
        type: 'trigger',
        position,
        data: {
          name: 'New Trigger',
          triggerType: 'manual',
          config: {}
        }
      };
    case 'handoff':
      return {
        id,
        type: 'handoff',
        position,
        data: {
          fromAgent: '',
          toAgent: '',
          condition: '',
          context: {}
        }
      };
    default:
      // Return a basic agent node as fallback
      return {
        id,
        type: 'agent',
        position,
        data: {
          name: 'New Agent',
          instructions: 'You are a helpful assistant.',
          model: 'gpt-4o',
          tools: [],
          temperature: 0.7,
          maxTokens: 4000
        }
      };
  }
}