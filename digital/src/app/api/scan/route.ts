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
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `You are scanning a photo of material cards from a board game.
Here is the complete list of valid card names (exact spelling matters):
${materialList}

Look at the photo and identify which card names from the list above are visible.
Only return names that exactly match the list above.

Respond with ONLY a JSON object in this exact format:
{"detected": ["Card Name 1", "Card Name 2"]}`,
            },
          ],
        },
      ],
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