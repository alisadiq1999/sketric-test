// Workflow Node Types following OpenAI Agents SDK patterns
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'tool';
  position: { x: number; y: number };
  data: TriggerNodeData | AgentNodeData | ToolNodeData;
}

export interface TriggerNodeData {
  triggerType: 'text' | 'webhook' | 'schedule';
  content?: string;
  webhookUrl?: string;
  schedule?: string;
}

export interface AgentNodeData {
  name?: string;
  model: string;
  instructions: string;
  tools: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface ToolNodeData {
  toolName: string;
  parameters: Record<string, any>;
  description?: string;
}

export interface WorkflowConnection {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Trace Types following OpenAI Agents SDK tracing patterns
export interface WorkflowTrace {
  id: string;
  timestamp: number;
  type: 'agent_start' | 'agent_end' | 'tool_start' | 'tool_end' | 'handoff' | 'error';
  nodeId: string;
  nodeName: string;
  status: 'running' | 'success' | 'error';
  input?: any;
  output?: any;
  error?: string;
  duration?: number;
  children?: WorkflowTrace[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  input: any;
  output?: any;
  traces: WorkflowTrace[];
  error?: string;
}

// Agent SDK Types
export interface Agent {
  name: string;
  instructions: string;
  model?: string;
  tools?: Tool[];
  temperature?: number;
  maxTokens?: number;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (params: any) => Promise<any>;
}

export interface Runner {
  runSync: (agent: Agent, input: string) => Promise<RunResult>;
  runAsync: (agent: Agent, input: string) => AsyncGenerator<TraceEvent>;
}

export interface RunResult {
  finalOutput: string;
  traces: WorkflowTrace[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TraceEvent {
  type: 'trace' | 'output' | 'error';
  data: WorkflowTrace | string | Error;
}

// Handoff Types
export interface HandoffTarget {
  target: string;
  context?: Record<string, any>;
}

export interface Handoff {
  from: string;
  to: string;
  context: Record<string, any>;
  timestamp: number;
}