'use client';

import React, { useState, useCallback } from 'react';
import { AgentCanvas } from '@/components/agent-workflow/AgentCanvas';
import { WorkflowToolbar } from '@/components/agent-workflow/WorkflowToolbar';
import { ExecutionPanel } from '@/components/agent-workflow/panels/ExecutionPanel';
import { TraceDisplay } from '@/components/agent-workflow/TraceDisplay';
import { ChatProvider } from '@/components/chat/ChatProvider';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { Button } from '@/components/ui/button';
import { Play, Save } from 'lucide-react';
import { WorkflowNode, WorkflowTrace, WorkflowExecution } from '@/lib/workflow-types';

export default function AgentWorkflowPage() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 200 },
      data: { triggerType: 'text', content: 'User input trigger' }
    },
    {
      id: 'router-agent', 
      type: 'agent',
      position: { x: 350, y: 200 },
      data: { 
        name: 'Router Agent',
        model: 'gpt-4o',
        instructions: 'You are a router agent that analyzes requests and routes them to appropriate marketing agents.',
        tools: ['handoff']
      }
    },
    {
      id: 'marketing-agent',
      type: 'agent', 
      position: { x: 600, y: 200 },
      data: {
        name: 'Marketing Agent',
        model: 'gpt-4o',
        instructions: 'You are a marketing specialist that helps with SEO and web scraping tasks.',
        tools: ['seo_tool', 'web_scrape']
      }
    },
    {
      id: 'seo-tool',
      type: 'tool',
      position: { x: 850, y: 150 },
      data: {
        toolName: 'SEOTool',
        description: 'Analyzes SEO metrics and rankings',
        parameters: { url: '', keywords: [] }
      }
    },
    {
      id: 'web-scraper',
      type: 'tool',
      position: { x: 850, y: 250 },
      data: {
        toolName: 'Web Scrape',
        description: 'Scrapes web content and data',
        parameters: { url: '', selectors: [] }
      }
    }
  ]);
  
  const [connections, setConnections] = useState([
    { source: 'trigger-1', target: 'router-agent' },
    { source: 'router-agent', target: 'marketing-agent' },
    { source: 'marketing-agent', target: 'seo-tool' },
    { source: 'marketing-agent', target: 'web-scraper' }
  ]);
  
  const [traces, setTraces] = useState<WorkflowTrace[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [savedWorkflow, setSavedWorkflow] = useState<any>(null);

  const handleSaveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      connections,
      timestamp: Date.now()
    };
    setSavedWorkflow(workflow);
    // In a real app, you'd save this to a backend
    console.log('Workflow saved:', workflow);
  }, [nodes, connections]);

  const handleExecuteWorkflow = useCallback(async (input: string) => {
    if (!savedWorkflow) {
      alert('Please save the workflow first');
      return;
    }

    setIsExecuting(true);
    setTraces([]);

    try {
      const response = await fetch('/api/execute-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: savedWorkflow,
          input
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'trace') {
                  setTraces(prev => [...prev, data.trace]);
                }
              } catch (e) {
                console.error('Error parsing trace data:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [savedWorkflow]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agent Workflow Builder</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveWorkflow} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
            <Button 
              onClick={() => handleExecuteWorkflow('Test input')}
              disabled={!savedWorkflow || isExecuting}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Node Library */}
        <WorkflowToolbar />

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <AgentCanvas 
              nodes={nodes}
              connections={connections}
              onNodesChange={setNodes}
              onConnectionsChange={setConnections}
            />
          </div>

          {/* Bottom - Trace Display */}
          <div className="h-48 border-t bg-card">
            <TraceDisplay 
              traces={traces}
              isExecuting={isExecuting}
            />
          </div>
        </div>

        {/* Right Panel - Properties/Settings */}
        <div className="w-80 border-l bg-card">
          <ExecutionPanel 
            savedWorkflow={savedWorkflow}
            onExecute={handleExecuteWorkflow}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      {/* Chat Widget - Bottom Right for this page only */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatProvider 
          endpoint="/api/workflow-chat"
          agent="workflow_agent"
        >
          <ChatWidget 
            className="w-80 h-96 rounded-lg shadow-2xl"
            workflowEnabled={!!savedWorkflow}
          />
        </ChatProvider>
      </div>
    </div>
  );
}