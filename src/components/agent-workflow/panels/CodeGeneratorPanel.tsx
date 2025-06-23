'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentWorkflow } from '@/lib/types';
import { Code, Download, Copy } from 'lucide-react';
import { generateAgentsSDKCode } from '../utils/codeGenerator';

interface CodeGeneratorPanelProps {
  workflow: AgentWorkflow;
}

export function CodeGeneratorPanel({ workflow }: CodeGeneratorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [workflowJson, setWorkflowJson] = useState('');

  const handleGenerateCode = () => {
    const code = generateAgentsSDKCode(workflow);
    const json = JSON.stringify(workflow, null, 2);
    setGeneratedCode(code);
    setWorkflowJson(json);
    setIsOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name || 'workflow'}.py`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([workflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name || 'workflow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          onClick={handleGenerateCode}
          className="flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          Generate Code
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Generated Agents SDK Code</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="python" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="python">Python Code</TabsTrigger>
            <TabsTrigger value="json">Workflow JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="python" className="flex-1 flex flex-col">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generatedCode)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadCode}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
            
            <div className="flex-1 border rounded-md overflow-hidden">
              <pre className="h-full p-4 overflow-auto bg-gray-50 text-sm">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="flex-1 flex flex-col">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(workflowJson)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadJson}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
            
            <div className="flex-1 border rounded-md overflow-hidden">
              <pre className="h-full p-4 overflow-auto bg-gray-50 text-sm">
                <code>{workflowJson}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}