import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, workflowEnabled } = await request.json();

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send typing indicator
          controller.enqueue('data: {"event": "TEXT_MESSAGE_START", "data": "{\\"messageId\\": \\"msg-1\\", \\"role\\": \\"assistant\\", \\"timestamp\\": ' + Date.now() + '}"}\n\n');

          // Simulate thinking time
          await new Promise(resolve => setTimeout(resolve, 1000));

          let response = '';
          if (workflowEnabled) {
            response = `Hello! I can help you test your workflow. Your message: "${message}" will be processed through the saved workflow when you execute it. Click "Run Agent" to see the workflow in action with traces displayed at the bottom.`;
          } else {
            response = `I'm Max, your workflow assistant. Please save your workflow first, then I can help you test it by sending messages through the workflow execution engine.`;
          }

          // Send response chunks
          const words = response.split(' ');
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? words[i] : ' ' + words[i]);
            controller.enqueue('data: {"event": "TEXT_MESSAGE_CONTENT", "data": "{\\"messageId\\": \\"msg-1\\", \\"delta\\": \\"' + chunk + '\\", \\"timestamp\\": ' + Date.now() + '}"}\n\n');
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Send completion
          controller.enqueue('data: {"event": "TEXT_MESSAGE_END", "data": "{\\"messageId\\": \\"msg-1\\", \\"timestamp\\": ' + Date.now() + '}"}\n\n');
          controller.enqueue('data: {"event": "RUN_FINISHED", "data": "{\\"timestamp\\": ' + Date.now() + '}"}\n\n');

          controller.close();
        } catch (error: any) {
          controller.enqueue('data: {"event": "ERROR", "data": "{\\"message\\": \\"' + error.message + '\\"}"}\n\n');
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
    console.error('Workflow chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}