
// 'use client'; // No longer needed here as ChatProvider is in layout

// Chat functionality is now primarily handled by components in RootLayout.
// This page can render specific page content or serve as a placeholder.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Workflow } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Sketric</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your AI assistant is ready to help. Click the chat icon to get started!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/agent-workflow" className="flex items-center gap-2">
              <Workflow className="w-5 h-5" />
              Agent Workflow Builder
            </Link>
          </Button>
          
          <Button variant="outline" size="lg">
            <Bot className="w-5 h-5 mr-2" />
            Start Chat
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Build no-code AI workflows with tracing and execution monitoring
        </p>
      </div>
    </main>
  );
}
