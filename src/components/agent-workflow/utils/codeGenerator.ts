import { AgentWorkflow, WorkflowAgent, AgentTool, AgentHandoff, StructuredOutput } from '@/lib/types';

export function generateAgentsSDKCode(workflow: AgentWorkflow): string {
  const { agents, globalSettings } = workflow;

  // Generate imports
  const imports = `
from agents import Agent, Runner, Handoff
import json
from typing import List, Dict, Any
from pydantic import BaseModel
import os

# Set your OpenAI API key
os.environ["OPENAI_API_KEY"] = "your-openai-api-key-here"
`;

  // Generate tool functions
  const toolFunctions = agents
    .flatMap(agent => agent.tools)
    .filter((tool, index, self) => self.findIndex(t => t.id === tool.id) === index) // Remove duplicates
    .map(generateToolFunction)
    .join('\n\n');

  // Generate structured output models
  const outputModels = agents
    .flatMap(agent => agent.structuredOutputs)
    .filter((output, index, self) => self.findIndex(o => o.id === output.id) === index) // Remove duplicates
    .map(generateOutputModel)
    .join('\n\n');

  // Generate agent definitions
  const agentDefinitions = agents.map(generateAgentDefinition).join('\n\n');

  // Generate handoff logic
  const handoffDefinitions = generateHandoffDefinitions(agents);

  // Generate main execution function
  const mainFunction = generateMainFunction(workflow);

  return `${imports}

# ==== STRUCTURED OUTPUT MODELS ====
${outputModels}

# ==== TOOL FUNCTIONS ====
${toolFunctions}

# ==== HANDOFF DEFINITIONS ====
${handoffDefinitions}

# ==== AGENT DEFINITIONS ====
${agentDefinitions}

# ==== MAIN EXECUTION ====
${mainFunction}

if __name__ == "__main__":
    main()
`;
}

function generateToolFunction(tool: AgentTool): string {
  const parameters = tool.parameters.map(param => 
    `${param.name}: ${getPythonType(param.type)}`
  ).join(', ');

  const docstring = `"""
    ${tool.description}
    
    Parameters:
    ${tool.parameters.map(param => 
      `- ${param.name} (${param.type}): ${param.description}`
    ).join('\n    ')}
    """`;

  if (tool.implementation) {
    return `def ${tool.name.toLowerCase().replace(/\s+/g, '_')}(${parameters}):
    ${docstring}
    ${tool.implementation}`;
  }

  const defaultImplementation = generateDefaultToolImplementation(tool);
  
  return `def ${tool.name.toLowerCase().replace(/\s+/g, '_')}(${parameters}):
    ${docstring}
    ${defaultImplementation}`;
}

function generateDefaultToolImplementation(tool: AgentTool): string {
  switch (tool.type) {
    case 'api':
      return `# TODO: Implement API call logic
    import requests
    # Example: response = requests.get("your-api-endpoint")
    return f"API call executed with parameters: {locals()}"`;
    
    case 'database':
      return `# TODO: Implement database query logic  
    # Example: query your database here
    return f"Database query executed with parameters: {locals()}"`;
    
    case 'file':
      return `# TODO: Implement file operation logic
    # Example: read/write files here
    return f"File operation executed with parameters: {locals()}"`;
    
    default:
      return `# TODO: Implement your custom function logic here
    return f"Function {tool.name} executed with parameters: {locals()}"`;
  }
}

function generateOutputModel(output: StructuredOutput): string {
  const className = output.name.replace(/\s+/g, '');
  
  if (output.schema.type === 'object' && output.schema.properties) {
    const fields = Object.entries(output.schema.properties).map(([key, value]: [string, any]) => {
      const pythonType = getPythonType(value.type);
      const isRequired = output.schema.required?.includes(key);
      return `    ${key}: ${pythonType}${isRequired ? '' : ' = None'}`;
    }).join('\n');

    return `class ${className}(BaseModel):
    """${output.description || output.name}"""
${fields}`;
  }

  return `# Structured output model for ${output.name}
# Schema: ${JSON.stringify(output.schema, null, 2)}`;
}

function generateAgentDefinition(agent: WorkflowAgent): string {
  const agentName = agent.name.replace(/\s+/g, '');
  const tools = agent.tools.map(tool => 
    tool.name.toLowerCase().replace(/\s+/g, '_')
  );

  const toolsArray = tools.length > 0 ? `[${tools.join(', ')}]` : '[]';
  
  let agentCode = `${agentName.toLowerCase()}_agent = Agent(
    name="${agent.name}",
    instructions="""${agent.instructions}""",
    tools=${toolsArray},
    model="${agent.model}",
    temperature=${agent.temperature},
    max_tokens=${agent.maxTokens}
)`;

  // Add structured outputs if any
  if (agent.structuredOutputs.length > 0) {
    agentCode += `
# Structured outputs for ${agent.name}:
# ${agent.structuredOutputs.map(o => `- ${o.name}: ${o.schema.type}`).join('\n# ')}`;
  }

  return agentCode;
}

function generateHandoffDefinitions(agents: WorkflowAgent[]): string {
  const handoffs: string[] = [];
  
  agents.forEach(agent => {
    agent.handoffs.forEach(handoff => {
      const targetAgent = agents.find(a => a.id === handoff.targetAgentId);
      if (targetAgent) {
        const handoffName = `${agent.name.replace(/\s+/g, '')}_to_${targetAgent.name.replace(/\s+/g, '')}`;
        const targetAgentVar = `${targetAgent.name.replace(/\s+/g, '').toLowerCase()}_agent`;
        
        let handoffCode = `${handoffName.toLowerCase()}_handoff = Handoff(
    agent=${targetAgentVar}`;
        
        if (handoff.message) {
          handoffCode += `,
    message="${handoff.message}"`;
        }
        
        handoffCode += `
)`;
        
        handoffs.push(handoffCode);
      }
    });
  });

  return handoffs.join('\n\n');
}

function generateMainFunction(workflow: AgentWorkflow): string {
  const entryAgent = workflow.agents.find(agent => agent.isEntryPoint);
  if (!entryAgent) {
    return `def main():
    print("No entry point agent defined!")
    return`;
  }

  const entryAgentVar = `${entryAgent.name.replace(/\s+/g, '').toLowerCase()}_agent`;

  return `def main():
    """
    Execute the ${workflow.name} workflow
    
    Description: ${workflow.description}
    Version: ${workflow.version}
    """
    
    # Initialize the workflow with the entry point agent
    print(f"Starting workflow: ${workflow.name}")
    print(f"Entry point: ${entryAgent.name}")
    
    # Get user input
    user_message = input("Enter your message: ")
    
    # Execute the workflow
    try:
        result = Runner.run_sync(
            agent=${entryAgentVar},
            message=user_message,
            max_retries=${workflow.globalSettings.maxRetries},
            timeout=${workflow.globalSettings.timeoutSeconds}
        )
        
        print("\\n=== WORKFLOW EXECUTION COMPLETED ===")
        print(f"Final output: {result.final_output}")
        
        if hasattr(result, 'messages'):
            print("\\n=== CONVERSATION HISTORY ===")
            for message in result.messages:
                print(f"{message.role}: {message.content}")
                
    except Exception as e:
        print(f"Workflow execution failed: {str(e)}")`;
}

function getPythonType(type: string): string {
  switch (type) {
    case 'string':
      return 'str';
    case 'number':
      return 'float';
    case 'integer':
      return 'int';
    case 'boolean':
      return 'bool';
    case 'array':
      return 'List[Any]';
    case 'object':
      return 'Dict[str, Any]';
    default:
      return 'Any';
  }
}

// Utility function to validate workflow before code generation
export function validateWorkflow(workflow: AgentWorkflow): string[] {
  const errors: string[] = [];

  // Check if there's at least one agent
  if (workflow.agents.length === 0) {
    errors.push("Workflow must have at least one agent");
  }

  // Check if there's an entry point
  const entryPoints = workflow.agents.filter(agent => agent.isEntryPoint);
  if (entryPoints.length === 0) {
    errors.push("Workflow must have an entry point agent");
  }
  if (entryPoints.length > 1) {
    errors.push("Workflow can only have one entry point agent");
  }

  // Validate agent names
  const agentNames = workflow.agents.map(agent => agent.name);
  const duplicateNames = agentNames.filter((name, index) => agentNames.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    errors.push(`Duplicate agent names found: ${duplicateNames.join(', ')}`);
  }

  // Validate handoff targets
  workflow.agents.forEach(agent => {
    agent.handoffs.forEach(handoff => {
      const targetExists = workflow.agents.some(a => a.id === handoff.targetAgentId);
      if (!targetExists) {
        errors.push(`Agent "${agent.name}" has handoff to non-existent agent: ${handoff.targetAgentId}`);
      }
    });
  });

  return errors;
}