export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const { base64, mediaType, materialList } = await req.json()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 }
          },
          {
            type: 'text',
            text: `You are scanning a photo of material cards from a board game.
Here is the complete list of valid card names (exact spelling matters):
${materialList}

Look at the photo and identify which card names from the list above are visible.
Cards will have their name printed prominently on them.
Only return names that exactly match the list above.

Respond with ONLY a JSON object in this exact format, no other text:
{"detected": ["Card Name 1", "Card Name 2"]}`
          }
        ]
      }
    ]
  })

  const text = response.content.map((c: { type: string; text?: string }) => c.type === 'text' ? c.text : '').join('')
  return NextResponse.json({ text })
}