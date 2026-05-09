export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function extractJSON(text: string) {
  try {
    return JSON.parse(text)
  } catch {}

  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch {}
  }

  return null
}

export async function POST(req: Request) {
  try {
    console.log("🔥 /api/scan HIT")

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { base64, mediaType, materialList } = await req.json()

    console.log("📩 REQUEST:", {
      hasBase64: !!base64,
      mediaType,
      materialListLength: materialList?.length
    })

    if (!base64 || !mediaType || !materialList) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log("🚀 CALLING CLAUDE...")

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      temperature: 0,
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
              text: `
Return ONLY valid JSON. No markdown. No explanation. No extra text.

Task:
Identify which card names are visible in the image AND how many copies of each card exist.

Valid names:
${materialList}

Return format:
{
  "detected": [
    { "name": "Card Name 1", "count": 2 },
    { "name": "Card Name 2", "count": 1 }
  ]
}

Rules:
- Only use names from the list
- Count how many copies are visible
- If none found, return {"detected": []}
              `.trim(),
            },
          ],
        },
      ],
    })

    console.log("🤖 CLAUDE RAW RESPONSE:", response)

    const text =
      response.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('') || ''

    console.log("🧾 CLAUDE TEXT OUTPUT:", text)

    const parsed = extractJSON(text)

    console.log("🧩 PARSED RESULT:", parsed)

    if (!parsed) {
      console.error("❌ FAILED PARSE")
      console.error("RAW OUTPUT:", text)

      return NextResponse.json({
        text,
        parsed: { detected: [] },
        warning: 'Failed to parse model output'
      })
    }

    return NextResponse.json({
      text,
      parsed,
    })

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