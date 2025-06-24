'use client';

import React, { useState, useMemo } from 'react';
import { CanvasState } from '@/lib/workflow-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Download, AlertTriangle, CheckCircle } from 'lucide-react';

interface CodeGeneratorPanelProps {
  canvasState: CanvasState;
}

export function CodeGeneratorPanel({ canvasState }: CodeGeneratorPanelProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Generate Python code based on canvas state
  const generatedCode = useMemo(() => {
    const agents = canvasState.nodes.filter(node => node.type === 'agent');
    const tools = canvasState.nodes.filter(node => node.type === 'tool');
    const triggers = canvasState.nodes.filter(node => node.type === 'trigger');
    const handoffs = canvasState.nodes.filter(node => node.type === 'handoff');

    // Python imports
    const imports = `from agents import Agent, Runner
from typing import Dict, Any
import json`;

    // Tool functions
    const toolFunctions = tools.map((tool, index) => {
      const toolData = tool.data as any;
      return `
def ${toolData.name.toLowerCase().replace(/\s+/g, '_')}(${toolData.parameters?.map((p: any) => `${p.name}: ${p.type}`).join(', ') || ''}):
    """${toolData.description}"""
    ${toolData.function || '# TODO: Implement tool function'}
    pass`;
    }).join('\n');

    // Agent definitions
    const agentDefinitions = agents.map((agent, index) => {
      const agentData = agent.data as any;
      const toolNames = agentData.tools?.map((t: string) => t.toLowerCase().replace(/\s+/g, '_')) || [];
      
      return `
${agentData.name.toLowerCase().replace(/\s+/g, '_')}_agent = Agent(
    name="${agentData.name}",
    instructions="""${agentData.instructions}""",
    model="${agentData.model || 'gpt-4o'}",
    tools=[${toolNames.join(', ')}],
    temperature=${agentData.temperature || 0.7},
    max_tokens=${agentData.maxTokens || 4000}
)`;
    }).join('\n');

    // Main execution function
    const mainFunction = `
async def run_workflow(input_data: Dict[str, Any]):
    """Execute the agent workflow"""
    try:
        # TODO: Implement workflow execution logic based on your canvas design
        result = await Runner.run(${agents.length > 0 ? `${agents[0].data.name.toLowerCase().replace(/\s+/g, '_')}_agent` : 'None'}, input_data)
        return result.final_output
    except Exception as e:
        print(f"Workflow execution failed: {e}")
        raise

if __name__ == "__main__":
    import asyncio
    
    # Example input
    sample_input = {"message": "Hello, world!"}
    
    # Run the workflow
    result = asyncio.run(run_workflow(sample_input))
    print("Workflow result:", result)`;

    const fullCode = [imports, toolFunctions, agentDefinitions, mainFunction].filter(Boolean).join('\n\n');

    return {
      python: fullCode,
      typescript: '// TypeScript implementation coming soon...',
      dependencies: ['openai-agents', 'asyncio', 'typing'],
      errors: [],
      warnings: []
    };
  }, [canvasState]);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (canvasState.nodes.length === 0) {
      errors.push('No nodes in workflow');
    }

    const agents = canvasState.nodes.filter(node => node.type === 'agent');
    if (agents.length === 0) {
      warnings.push('No agents defined');
    }

    const triggers = canvasState.nodes.filter(node => node.type === 'trigger');
    if (triggers.length === 0) {
      warnings.push('No trigger nodes defined');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set([
      ...canvasState.connections.map(conn => conn.source),
      ...canvasState.connections.map(conn => conn.target)
    ]);
    
    const disconnectedNodes = canvasState.nodes.filter(node => !connectedNodeIds.has(node.id));
    if (disconnectedNodes.length > 0) {
      warnings.push(`${disconnectedNodes.length} disconnected nodes`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [canvasState]);

  const handleCopy = async (content: string, section: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Generated Code</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Issues Found
            </Badge>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Validation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            ))}
            {validation.warnings.map((warning, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                {warning}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Code Tabs */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Generated Implementation</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(generatedCode.python, 'python')}
                className="flex items-center gap-2"
              >
                {copiedSection === 'python' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(generatedCode.python, 'workflow.py')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="h-full">
          <Tabs defaultValue="python" className="h-full">
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="typescript" disabled>TypeScript</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="python" className="h-full mt-4">
              <pre className="h-full overflow-auto p-4 bg-muted rounded-md text-sm font-mono">
                <code>{generatedCode.python}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="typescript" className="h-full mt-4">
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Code className="h-8 w-8 mx-auto mb-2" />
                  <p>TypeScript implementation coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dependencies" className="h-full mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Dependencies</h4>
                  <div className="space-y-2">
                    {generatedCode.dependencies.map((dep, index) => (
                      <Badge key={index} variant="secondary">{dep}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h5 className="font-medium mb-2">Installation Command</h5>
                  <code className="text-sm">pip install {generatedCode.dependencies.join(' ')}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleCopy(`pip install ${generatedCode.dependencies.join(' ')}`, 'install')}
                  >
                    {copiedSection === 'install' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}