
// 'use client'; // No longer needed here as ChatProvider is in layout

// Chat functionality is now primarily handled by components in RootLayout.
// This page can render specific page content or serve as a placeholder.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MessageSquare, Workflow, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Sketric</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build powerful AI agent workflows with a visual canvas-based designer. 
          Create, connect, and deploy intelligent agents using the OpenAI Agents SDK.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Agent Workflow Designer */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Workflow className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Agent Workflow Designer</CardTitle>
                <CardDescription>
                  Build complex AI workflows with a visual node-based editor
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Design multi-agent workflows, configure tools and guardrails, 
              and generate production-ready code based on the OpenAI Agents SDK.
            </p>
            <Link href="/agent-workflow">
              <Button className="w-full">
                Open Workflow Designer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Chat Assistant */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>AI Chat Assistant</CardTitle>
                <CardDescription>
                  Get help and support from our AI assistant
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ask questions, get guidance on building workflows, 
              or receive help with agent configuration and best practices.
            </p>
            <Button variant="outline" className="w-full">
              Open Chat Assistant
              <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="mt-16 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Visual Agent Builder</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop agents, tools, and triggers to build complex workflows
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Workflow className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Code Generation</h3>
            <p className="text-sm text-muted-foreground">
              Automatically generate production-ready Python code using OpenAI Agents SDK
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Live Testing</h3>
            <p className="text-sm text-muted-foreground">
              Test your workflows with live execution and detailed trace visualization
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
