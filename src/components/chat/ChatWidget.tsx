
'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { Message }  from './Message';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatWidgetProps {
  fullScreen?: boolean;
  className?: string;
  onExecuteWorkflow?: (input: string) => void;
  workflowEnabled?: boolean;
}

export function ChatWidget({ 
  fullScreen = false, 
  className, 
  onExecuteWorkflow,
  workflowEnabled = false 
}: ChatWidgetProps) {
  const { messages, isStreaming, sendMessage, isWidgetOpen, toggleWidget } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isStreaming]);

  const assistantIsActive = isStreaming;

  const chatInterface = (
    <div
      className={cn(
        "flex flex-col h-full max-h-full bg-background shadow-2xl border",
        fullScreen
          ? "fixed inset-0 z-[100] rounded-none"
          : "fixed bottom-6 right-6 z-[100] md:max-w-md md:h-[calc(100vh-8rem)] md:max-h-[600px] rounded-lg overflow-hidden",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sketric-chat-widget-title"
    >
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center">
          <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center mr-3">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h2 id="sketric-chat-widget-title" className="text-xl font-headline font-semibold text-foreground">
            {workflowEnabled ? 'Max' : 'Sketric Assistant'}
          </h2>
        </div>
        {!fullScreen && (
           <Button variant="ghost" size="icon" onClick={toggleWidget} className="text-muted-foreground hover:text-foreground h-7 w-7 p-1">
            <X className="h-5 w-5" />
            <span className="sr-only">Close chat</span>
          </Button>
        )}
      </header>

      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div ref={viewportRef} className="p-4 md:p-6 space-y-4">
          {messages.length === 0 && workflowEnabled && (
            <div className="text-center text-muted-foreground">
              <div className="mb-2">
                <Bot className="h-8 w-8 mx-auto text-primary" />
              </div>
              <p className="text-sm">Hello! How can I help you today?</p>
              <p className="text-xs mt-1">
                Your messages will be processed through the saved workflow.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} onActionSelect={(actionCardId, selectedValue) => {
                sendMessage(`Selected "${selectedValue}" from card ID "${actionCardId}"`);
            }} />
          ))}
          {assistantIsActive && <TypingIndicator />}
        </div>
      </ScrollArea>

      <Separator />
      <ChatInput onSendMessage={sendMessage} isStreaming={isStreaming} />
    </div>
  );

  if (fullScreen) {
    return chatInterface;
  }

  // If not fullScreen, render conditionally based on isWidgetOpen
  return isWidgetOpen ? chatInterface : null;
}
