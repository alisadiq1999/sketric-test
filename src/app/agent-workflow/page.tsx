'use client';

import React, { useState } from 'react';
import { AgentCanvas } from '@/components/agent-workflow/AgentCanvas';
import { AgentWorkflow } from '@/lib/types';
import { nanoid } from 'nanoid';

// Default workflow to start with
const createDefaultWorkflow = (): AgentWorkflow => {
  const now = new Date().toISOString();
  
  return {
    id: nanoid(),
    name: 'Sample Multi-Agent Workflow',
    description: 'A sample workflow demonstrating multiple agents with tools and handoffs',
    version: '1.0.0',
    agents: [
      {
        id: nanoid(),
        name: 'Research Assistant',
        instructions: 'You are a research assistant that helps users find information and prepare summaries. When you need to analyze data or create reports, hand off to the Data Analyst.',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        tools: [
          {
            id: nanoid(),
            name: 'web_search',
            description: 'Search the web for information',
            type: 'api',
            parameters: [
              {
                name: 'query',
                type: 'string',
                description: 'The search query',
                required: true,
              },
              {
                name: 'max_results',
                type: 'number',
                description: 'Maximum number of results to return',
                required: false,
                defaultValue: 10,
              }
            ],
          }
        ],
        handoffs: [
          {
            id: nanoid(),
            targetAgentId: '', // Will be set after creating the second agent
            condition: 'when analysis or reporting is needed',
            message: 'I need you to analyze this data and create a report',
            preserveContext: true,
          }
        ],
        structuredOutputs: [
          {
            id: nanoid(),
            name: 'ResearchSummary',
            schema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                sources: { type: 'array', items: { type: 'string' } },
                summary: { type: 'string' },
                confidence: { type: 'number' }
              },
              required: ['query', 'summary']
            },
            description: 'Structured summary of research findings'
          }
        ],
        guardrails: [],
        position: { x: 100, y: 100 },
        isEntryPoint: true,
      },
      {
        id: nanoid(),
        name: 'Data Analyst',
        instructions: 'You are a data analyst that processes information and creates detailed reports. You excel at finding patterns and insights in data.',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1500,
        tools: [
          {
            id: nanoid(),
            name: 'create_chart',
            description: 'Create a chart or visualization',
            type: 'function',
            parameters: [
              {
                name: 'data',
                type: 'object',
                description: 'The data to visualize',
                required: true,
              },
              {
                name: 'chart_type',
                type: 'string',
                description: 'Type of chart (bar, line, pie, etc.)',
                required: true,
              }
            ],
          },
          {
            id: nanoid(),
            name: 'generate_report',
            description: 'Generate a detailed report',
            type: 'function',
            parameters: [
              {
                name: 'data',
                type: 'object',
                description: 'The data to analyze',
                required: true,
              },
              {
                name: 'format',
                type: 'string',
                description: 'Report format (markdown, pdf, html)',
                required: false,
                defaultValue: 'markdown',
              }
            ],
          }
        ],
        handoffs: [],
        structuredOutputs: [
          {
            id: nanoid(),
            name: 'AnalysisReport',
            schema: {
              type: 'object',
              properties: {
                findings: { type: 'array', items: { type: 'string' } },
                recommendations: { type: 'array', items: { type: 'string' } },
                charts: { type: 'array', items: { type: 'object' } },
                confidence_score: { type: 'number' }
              },
              required: ['findings', 'recommendations']
            },
            description: 'Comprehensive analysis report'
          }
        ],
        guardrails: [
          {
            id: nanoid(),
            name: 'Data Quality Check',
            type: 'input_validation',
            condition: 'data is not null and has required fields',
            action: 'block',
            message: 'Invalid data provided for analysis'
          }
        ],
        position: { x: 400, y: 100 },
        isEntryPoint: false,
      }
    ],
    connections: [],
    globalSettings: {
      defaultModel: 'gpt-4',
      defaultTemperature: 0.7,
      maxRetries: 3,
      timeoutSeconds: 60,
      enableTracing: true,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      author: 'Agent Workflow Builder',
      tags: ['research', 'analysis', 'sample'],
    },
  };
};

export default function AgentWorkflowPage() {
  const [workflow, setWorkflow] = useState<AgentWorkflow>(() => {
    const defaultWorkflow = createDefaultWorkflow();
    
    // Set up the handoff connection
    if (defaultWorkflow.agents.length >= 2) {
      const researchAgent = defaultWorkflow.agents[0];
      const dataAnalyst = defaultWorkflow.agents[1];
      
      // Update the handoff target
      researchAgent.handoffs[0].targetAgentId = dataAnalyst.id;
      
      // Add connection
      defaultWorkflow.connections.push({
        id: nanoid(),
        source: researchAgent.id,
        target: dataAnalyst.id,
        type: 'handoff',
        condition: 'when analysis needed',
      });
    }
    
    return defaultWorkflow;
  });

  const handleWorkflowChange = (updatedWorkflow: AgentWorkflow) => {
    setWorkflow({
      ...updatedWorkflow,
      metadata: {
        ...updatedWorkflow.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="h-screen w-full">
      <AgentCanvas 
        workflow={workflow} 
        onWorkflowChange={handleWorkflowChange}
      />
    </div>
  );
}