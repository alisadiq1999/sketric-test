// 'use client'; // No longer needed here as ChatProvider is in layout

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Workflow, MessageSquare } from 'lucide-react';

// Chat functionality is now primarily handled by components in RootLayout.
// This page can render specific page content or serve as a placeholder.

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Sketric</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your AI assistant platform with powerful agent workflow orchestration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Chat Widget Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              Chat Assistant
            </CardTitle>
            <CardDescription>
              Interactive chat with your AI assistant for immediate help and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Click the chat icon in the bottom right to start a conversation with your AI assistant.
            </p>
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        {/* Agent Workflow Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="w-6 h-6 text-purple-500" />
              Agent Workflow Canvas
            </CardTitle>
            <CardDescription>
              Build and orchestrate multi-agent workflows with visual no-code interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Create complex agent workflows with tools, handoffs, and structured outputs. Generate OpenAI Agents SDK code automatically.
            </p>
            <Link href="/agent-workflow">
              <Button className="w-full">
                <Workflow className="w-4 h-4 mr-2" />
                Open Workflow Canvas
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-green-500" />
              Platform Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Interactive Chat</h3>
                <p className="text-sm text-gray-600">Real-time conversations with AI assistants</p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Workflow className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Visual Workflows</h3>
                <p className="text-sm text-gray-600">Drag-and-drop agent orchestration</p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Code Generation</h3>
                <p className="text-sm text-gray-600">Auto-generate OpenAI Agents SDK code</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example of how a page might use the fullScreen chat widget if needed on a specific route */}
      {/* This would typically be on a dedicated /embed route as per the spec */}
      {/* <div className="mt-8 w-full max-w-3xl h-[600px] border rounded-lg shadow-lg">
        <ChatProvider endpoint="/api/chat-sse" agent="sketric_agent">
          <ChatWidget fullScreen />
        </ChatProvider>
      </div> */}
    </main>
  );
}
