# Sketric AI Assistant

A Next.js application with AI chat functionality and a visual agent workflow builder following OpenAI Agents SDK patterns.

## Features

### 🤖 AI Chat Assistant
- Real-time streaming chat interface
- Server-sent events (SSE) for smooth message delivery
- Action cards and interactive elements
- Responsive design with floating chat widget

### 🔧 Agent Workflow Builder
- Visual no-code workflow builder
- Drag-and-drop interface for creating AI workflows
- Real-time trace display following OpenAI Agents SDK patterns
- Node-based architecture with Agents, Tools, and Triggers

## OpenAI Agents SDK Integration

This application demonstrates the key concepts from the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/):

### Core Primitives
- **Agents**: AI agents with instructions and tools
- **Handoffs**: Delegation between agents for specific tasks  
- **Tools**: External functions and APIs
- **Tracing**: Built-in visualization and debugging

### Workflow Execution
The workflow engine follows the Agents SDK patterns:
```typescript
// Agent creation
const agent = {
  name: "Marketing Agent",
  instructions: "You are a marketing specialist...",
  model: "gpt-4o",
  tools: ["seo_tool", "web_scrape"]
};

// Workflow execution with tracing
const result = await runner.runWorkflow(nodes, connections, input);
```

### Trace Display
Real-time trace visualization showing:
- Agent execution flows
- Tool calls and results
- Handoffs between agents
- Performance metrics and debugging info

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd firebase-widget

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### Chat Widget
1. Click the floating chat button to open the assistant
2. Type messages to interact with the AI
3. The assistant provides helpful responses and action cards

### Agent Workflow Builder
1. Navigate to `/agent-workflow` or click "Agent Workflow Builder"
2. Use the left sidebar to add nodes:
   - **Trigger**: Start workflow with text, webhook, or schedule
   - **Agent**: AI agents with specific instructions and tools
   - **Tool**: External functions and APIs
3. Connect nodes by dragging between connection points
4. Save your workflow using the "Save Workflow" button
5. Test execution with the "Run Agent" button
6. View real-time traces in the bottom panel
7. Chat with "Max" in the bottom-right widget for workflow testing

### Workflow Features
- **Visual Builder**: Drag-and-drop interface for creating workflows
- **Live Tracing**: Real-time execution visualization
- **Node Inspector**: Configure and test individual components
- **Chat Integration**: Test workflows through conversational interface

## Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── agent-workflow/          # Workflow builder page
│   └── api/                     # API routes
│       ├── execute-workflow/    # Workflow execution endpoint
│       └── workflow-chat/       # Workflow chat endpoint
├── components/
│   ├── agent-workflow/          # Workflow builder components
│   │   ├── nodes/              # Node types (Agent, Tool, Trigger)
│   │   ├── panels/             # Side panels and settings
│   │   ├── AgentCanvas.tsx     # Main workflow canvas
│   │   ├── TraceDisplay.tsx    # Trace visualization
│   │   └── WorkflowToolbar.tsx # Node library
│   ├── chat/                   # Chat interface components
│   └── ui/                     # Reusable UI components
├── hooks/                      # React hooks
├── lib/                        # Utilities and types
│   ├── types.ts               # Chat and general types
│   └── workflow-types.ts      # Workflow-specific types
```

## API Endpoints

### Chat API
- `POST /api/responses` - Main chat endpoint
- `POST /api/workflow-chat` - Workflow-specific chat

### Workflow API  
- `POST /api/execute-workflow` - Execute saved workflows with tracing

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Chat**: Server-sent events (SSE) for real-time streaming
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.
