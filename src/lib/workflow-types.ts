// OpenAI Agents SDK Workflow Types

export interface Position {
  x: number;
  y: number;
}

export interface NodeConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

// Base Node Types
export interface BaseNode {
  id: string;
  type: string;
  position: Position;
  data: Record<string, any>;
  selected?: boolean;
}

// Agent Node - represents an LLM agent with instructions and tools
export interface AgentNode extends BaseNode {
  type: 'agent';
  data: {
    name: string;
    instructions: string;
    model?: string;
    tools?: string[];
    guardrails?: GuardrailConfig[];
    outputType?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

// Tool Node - represents a function/API tool
export interface ToolNode extends BaseNode {
  type: 'tool';
  data: {
    name: string;
    description: string;
    function: string;
    parameters: ToolParameter[];
    category: 'data' | 'action' | 'agent';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

// Trigger Node - represents workflow entry points
export interface TriggerNode extends BaseNode {
  type: 'trigger';
  data: {
    name: string;
    triggerType: 'api' | 'webhook' | 'schedule' | 'manual';
    config: Record<string, any>;
  };
}

// Handoff Node - represents agent handoffs
export interface HandoffNode extends BaseNode {
  type: 'handoff';
  data: {
    fromAgent: string;
    toAgent: string;
    condition?: string;
    context?: Record<string, any>;
  };
}

export type WorkflowNode = AgentNode | ToolNode | TriggerNode | HandoffNode;

// Tool Parameter Definition
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  default?: any;
}

// Guardrail Configuration
export interface GuardrailConfig {
  id: string;
  name: string;
  type: 'input' | 'output' | 'tool';
  function: string;
  enabled: boolean;
  config: Record<string, any>;
}

// Workflow Configuration
export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  settings: WorkflowSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowSettings {
  maxRetries: number;
  timeout: number;
  enableTracing: boolean;
  enableLogging: boolean;
  humanInterventionThreshold: number;
}

// Execution and Runtime Types
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  input: Record<string, any>;
  output?: Record<string, any>;
  traces: ExecutionTrace[];
  error?: string;
}

export interface ExecutionTrace {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// Canvas State Management
export interface CanvasState {
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  draggedNodeType: string | null;
  zoom: number;
  pan: Position;
}

// UI State
export interface UIState {
  isNodeInspectorOpen: boolean;
  isAddNodePanelOpen: boolean;
  isTracePanelOpen: boolean;
  activeTab: 'design' | 'code' | 'test' | 'deploy';
  canvasMode: 'edit' | 'view' | 'debug';
}

// Node Templates
export interface NodeTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  category: string;
  defaultData: Record<string, any>;
}

// Code Generation
export interface GeneratedCode {
  python: string;
  typescript: string;
  dependencies: string[];
  errors: string[];
  warnings: string[];
}

// Validation
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  nodeId?: string;
  connectionId?: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

// Events
export interface WorkflowEvent {
  type: string;
  payload: Record<string, any>;
  timestamp: Date;
}

// Built-in Tool Categories
export const TOOL_CATEGORIES = {
  DATA: 'data',
  ACTION: 'action', 
  AGENT: 'agent'
} as const;

// Model Options
export const MODEL_OPTIONS = [
  { value: 'gpt-4o', label: 'GPT-4o (Recommended)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Cost-effective)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
] as const;

// Risk Levels for Tool Safety
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;