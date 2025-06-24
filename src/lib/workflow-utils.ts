import { WorkflowConfig, WorkflowNode, NodeConnection, WorkflowSettings } from './workflow-types';

// Default workflow settings
export const DEFAULT_WORKFLOW_SETTINGS: WorkflowSettings = {
  maxRetries: 3,
  timeout: 300,
  enableTracing: true,
  enableLogging: true,
  humanInterventionThreshold: 3
};

// Built-in workflow templates
export const WORKFLOW_TEMPLATES: WorkflowConfig[] = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'AI agent for handling customer inquiries and support tickets',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          name: 'Customer Inquiry',
          triggerType: 'api',
          config: {}
        }
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: {
          name: 'Support Agent',
          instructions: `You are a helpful customer support agent. Your role is to:
1. Understand customer inquiries and problems
2. Provide clear, helpful solutions
3. Escalate complex issues when needed
4. Maintain a friendly and professional tone

Always ask clarifying questions if the customer's issue is unclear.`,
          model: 'gpt-4o',
          tools: ['knowledge_base_search', 'create_ticket'],
          temperature: 0.3,
          maxTokens: 1000
        }
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 700, y: 100 },
        data: {
          name: 'knowledge_base_search',
          description: 'Search the knowledge base for relevant articles',
          function: `def knowledge_base_search(query: str) -> str:
    """Search knowledge base for relevant information"""
    # TODO: Implement knowledge base search
    return f"Searching knowledge base for: {query}"`,
          parameters: [
            { name: 'query', type: 'string', description: 'Search query', required: true }
          ],
          category: 'data',
          riskLevel: 'low'
        }
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 700, y: 300 },
        data: {
          name: 'create_ticket',
          description: 'Create a support ticket for complex issues',
          function: `def create_ticket(title: str, description: str, priority: str = "medium") -> str:
    """Create a support ticket"""
    # TODO: Implement ticket creation
    return f"Ticket created: {title}"`,
          parameters: [
            { name: 'title', type: 'string', description: 'Ticket title', required: true },
            { name: 'description', type: 'string', description: 'Ticket description', required: true },
            { name: 'priority', type: 'string', description: 'Ticket priority', required: false, default: 'medium' }
          ],
          category: 'action',
          riskLevel: 'medium'
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-1',
        target: 'agent-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ],
    settings: DEFAULT_WORKFLOW_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  {
    id: 'content-creation',
    name: 'Content Creation Pipeline',
    description: 'Multi-agent workflow for creating and reviewing content',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          name: 'Content Request',
          triggerType: 'manual',
          config: {}
        }
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 350, y: 200 },
        data: {
          name: 'Content Writer',
          instructions: `You are a professional content writer. Create engaging, well-structured content based on the given topic and requirements. Focus on:
1. Clear, compelling headlines
2. Well-organized content structure
3. Engaging and informative writing
4. SEO-friendly language when appropriate`,
          model: 'gpt-4o',
          tools: ['research_tool'],
          temperature: 0.7,
          maxTokens: 2000
        }
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 600, y: 200 },
        data: {
          name: 'Content Reviewer',
          instructions: `You are a content reviewer and editor. Review the provided content for:
1. Grammar and spelling errors
2. Clarity and readability
3. Factual accuracy
4. Tone and style consistency
5. Overall quality and engagement

Provide specific feedback and suggestions for improvement.`,
          model: 'gpt-4o',
          tools: [],
          temperature: 0.3,
          maxTokens: 1500
        }
      },
      {
        id: 'handoff-1',
        type: 'handoff',
        position: { x: 475, y: 200 },
        data: {
          fromAgent: 'Content Writer',
          toAgent: 'Content Reviewer',
          condition: 'content_ready',
          context: {}
        }
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 350, y: 350 },
        data: {
          name: 'research_tool',
          description: 'Research information on a given topic',
          function: `def research_tool(topic: str, sources: str = "web") -> str:
    """Research information on a topic"""
    # TODO: Implement research functionality
    return f"Research results for: {topic}"`,
          parameters: [
            { name: 'topic', type: 'string', description: 'Research topic', required: true },
            { name: 'sources', type: 'string', description: 'Research sources', required: false, default: 'web' }
          ],
          category: 'data',
          riskLevel: 'low'
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-1',
        target: 'agent-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'conn-2',
        source: 'agent-1',
        target: 'handoff-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'conn-3',
        source: 'handoff-1',
        target: 'agent-2',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ],
    settings: DEFAULT_WORKFLOW_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Utility functions
export function validateWorkflow(workflow: WorkflowConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for nodes
  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  // Check for trigger nodes
  const triggers = workflow.nodes.filter(node => node.type === 'trigger');
  if (triggers.length === 0) {
    errors.push('Workflow must have at least one trigger node');
  }

  // Check for agent nodes
  const agents = workflow.nodes.filter(node => node.type === 'agent');
  if (agents.length === 0) {
    errors.push('Workflow must have at least one agent node');
  }

  // Validate agent configurations
  agents.forEach((agent, index) => {
    const agentData = agent.data as any;
    if (!agentData.name || !agentData.instructions) {
      errors.push(`Agent ${index + 1} is missing required configuration`);
    }
  });

  // Check for disconnected nodes
  const connectedNodeIds = new Set([
    ...workflow.connections.map(conn => conn.source),
    ...workflow.connections.map(conn => conn.target)
  ]);
  
  const disconnectedNodes = workflow.nodes.filter(node => !connectedNodeIds.has(node.id));
  if (disconnectedNodes.length > 0) {
    errors.push(`${disconnectedNodes.length} nodes are not connected to the workflow`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generateWorkflowSummary(workflow: WorkflowConfig): string {
  const nodeTypes = workflow.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const summary = [
    `Workflow: ${workflow.name}`,
    `Nodes: ${workflow.nodes.length} total`,
    ...Object.entries(nodeTypes).map(([type, count]) => `  - ${count} ${type}(s)`),
    `Connections: ${workflow.connections.length}`,
    `Last updated: ${workflow.updatedAt.toLocaleDateString()}`
  ];

  return summary.join('\n');
}

export function exportWorkflow(workflow: WorkflowConfig): string {
  return JSON.stringify(workflow, null, 2);
}

export function importWorkflow(data: string): WorkflowConfig | null {
  try {
    const parsed = JSON.parse(data);
    // Basic validation
    if (!parsed.id || !parsed.name || !parsed.nodes) {
      return null;
    }
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt || Date.now()),
      updatedAt: new Date(parsed.updatedAt || Date.now())
    };
  } catch {
    return null;
  }
}

export function createEmptyWorkflow(): WorkflowConfig {
  return {
    id: `workflow-${Date.now()}`,
    name: 'New Workflow',
    description: 'A new agent workflow',
    nodes: [],
    connections: [],
    settings: DEFAULT_WORKFLOW_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}