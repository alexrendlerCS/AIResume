import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Improved error handling and response types
type GenerateResponse = {
  result?: string
  error?: string
}

export async function POST(request: Request): Promise<NextResponse<GenerateResponse>> {
  try {
    const { prompt, type } = await request.json()

    // Different system prompts based on the type of content being generated
    const systemPrompts = {
      summary:
        "You are a professional resume writer. Create a compelling professional summary that highlights key strengths and career objectives.",
      experience:
        "You are a professional resume writer. Create detailed, achievement-focused work experience entries using action verbs and quantifiable results.",
      education: "You are a professional resume writer. Format educational background in a clear, professional manner.",
      skills:
        "You are a professional resume writer. List relevant technical and soft skills in a well-organized manner.",
    }

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.summary

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      system: systemPrompt,
    })

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error("Error generating resume content:", error)
    return NextResponse.json({ error: "Failed to generate resume content. Please try again." }, { status: 500 })
  }
}

