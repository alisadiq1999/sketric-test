import { NextRequest, NextResponse } from 'next/server';
import { WorkflowTrace, WorkflowNode, WorkflowConnection } from '@/lib/workflow-types';

// Mock implementation following OpenAI Agents SDK patterns
class WorkflowRunner {
  private traces: WorkflowTrace[] = [];

  async runWorkflow(nodes: WorkflowNode[], connections: WorkflowConnection[], input: string) {
    // Find the trigger node
    const triggerNode = nodes.find(node => node.type === 'trigger');
    if (!triggerNode) {
      throw new Error('No trigger node found');
    }

    // Execute workflow following the connection path
    await this.executeNode(triggerNode, input, nodes, connections);
    
    return {
      output: 'Workflow completed successfully',
      traces: this.traces
    };
  }

  private async executeNode(
    node: WorkflowNode, 
    input: any, 
    allNodes: WorkflowNode[], 
    connections: WorkflowConnection[]
  ) {
    const startTrace: WorkflowTrace = {
      id: `${node.id}-start-${Date.now()}`,
      timestamp: Date.now(),
      type: `${node.type}_start` as any,
      nodeId: node.id,
      nodeName: node.type === 'agent' ? `Agent (${(node.data as any).model})` : 
                node.type === 'tool' ? (node.data as any).toolName :
                'Trigger',
      status: 'running',
      input
    };

    this.traces.push(startTrace);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let output = input;
    let success = true;

    try {
      switch (node.type) {
        case 'trigger':
          output = `Triggered with: ${input}`;
          break;
        
        case 'agent':
          // Simulate agent processing following OpenAI Agents SDK
          const agentData = node.data as any;
          output = await this.runAgent(agentData, input);
          break;
        
        case 'tool':
          // Simulate tool execution
          const toolData = node.data as any;
          output = await this.runTool(toolData, input);
          // Simulate tool failure for SEOTool
          if (toolData.toolName?.toLowerCase().includes('seo')) {
            success = false;
            throw new Error('SEO Tool execution failed');
          }
          break;
      }
    } catch (error: any) {
      success = false;
      output = error.message;
    }

    const endTrace: WorkflowTrace = {
      id: `${node.id}-end-${Date.now()}`,
      timestamp: Date.now(),
      type: `${node.type}_end` as any,
      nodeId: node.id,
      nodeName: startTrace.nodeName,
      status: success ? 'success' : 'error',
      input,
      output,
      error: success ? undefined : output,
      duration: Date.now() - startTrace.timestamp
    };

    this.traces.push(endTrace);

    // Update start trace status
    startTrace.status = success ? 'success' : 'error';
    startTrace.duration = endTrace.duration;

    if (success) {
      // Find next connected nodes
      const nextConnections = connections.filter(conn => conn.source === node.id);
      
      for (const connection of nextConnections) {
        const nextNode = allNodes.find(n => n.id === connection.target);
        if (nextNode) {
          await this.executeNode(nextNode, output, allNodes, connections);
        }
      }
    }

    return output;
  }

  private async runAgent(agentData: any, input: string): Promise<string> {
    // Simulate OpenAI Agents SDK Agent.run()
    const responses = [
      `Based on your query "${input}", I can help you with resume ranking. Here's what I found...`,
      `I've analyzed your request about "${input}". Let me process this through the available tools.`,
      `Processing your input: "${input}". I'll use my knowledge to provide the best response.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async runTool(toolData: any, input: string): Promise<string> {
    // Simulate tool execution
    const toolName = toolData.toolName?.toLowerCase() || '';
    
    if (toolName.includes('webscrape') || toolName.includes('web_scrape')) {
      return `Web scraping completed for: ${input}. Found relevant resume ranking information.`;
    }
    
    if (toolName.includes('seo')) {
      throw new Error('SEO analysis failed - API rate limit exceeded');
    }
    
    return `Tool ${toolData.toolName} executed successfully with input: ${input}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workflow, input } = await request.json();
    
    if (!workflow || !workflow.nodes) {
      return NextResponse.json(
        { error: 'Invalid workflow data' },
        { status: 400 }
      );
    }

    const runner = new WorkflowRunner();
    
    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial traces as they're generated
          const originalPush = runner['traces'].push;
          runner['traces'].push = function(trace: WorkflowTrace) {
            const result = originalPush.call(this, trace);
            
            // Send trace via SSE
            const data = JSON.stringify({
              type: 'trace',
              trace
            });
            controller.enqueue(`data: ${data}\n\n`);
            
            return result;
          };

          // Execute workflow
          const result = await runner.runWorkflow(
            workflow.nodes,
            workflow.connections || [],
            input
          );

          // Send final result
          const finalData = JSON.stringify({
            type: 'complete',
            result
          });
          controller.enqueue(`data: ${finalData}\n\n`);
          
          controller.close();
        } catch (error: any) {
          const errorData = JSON.stringify({
            type: 'error',
            error: error.message
          });
          controller.enqueue(`data: ${errorData}\n\n`);
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}