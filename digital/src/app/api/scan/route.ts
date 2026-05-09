export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { base64, mediaType, materialList } = await req.json()

    if (!base64 || !mediaType || !materialList) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,

  // 👇 THIS is the key fix
  response_format: { type: "json" },

  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64
          }
        },
        {
          type: 'text',
          text: `Return ONLY JSON like:
{"detected": ["Card Name 1"]}

Valid cards:
${materialList}`
        }
      ]
    }
  ]
})

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Scan API error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    )
  }
}