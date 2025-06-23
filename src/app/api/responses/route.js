// File: ./app/api/responses/route.js
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null

export async function POST(request) {
  try {
    const { instructions, input } = await request.json()

    // Validate required parameters
    if (!input) {
      return NextResponse.json(
        { error: 'Missing required parameter: input' },
        { status: 400 }
      )
    }

    // Use mock response if OpenAI API key is not available
    if (!openai) {
      const mockResponses = [
        "I'm a demo assistant. Thanks for your message: " + input,
        "Hello! I'm running in demo mode. Your input was: " + input,
        "Demo response: I understand you said '" + input + "'. In a real setup, I'd use the OpenAI API to provide more helpful responses."
      ]
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      
      return NextResponse.json({ 
        output: randomResponse
      })
    }

    // Kick off the Responses API call without streaming
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      instructions,
      input,
      stream: false
    })

    // Return the complete output
    const { output } = await response
    return NextResponse.json({ output })

  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
