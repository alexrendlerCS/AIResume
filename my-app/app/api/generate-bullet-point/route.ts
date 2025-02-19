import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { skill, experience } = await request.json()

    const { text: bulletPoint } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert resume writer. Generate a concise, impactful bullet point for a resume based on the given skill and experience.",
      prompt: `
        Generate a resume bullet point that demonstrates the use of the following skill in the context of the given experience.
        Make it specific, action-oriented, and highlight the impact or result if possible.

        Skill: ${skill.text}
        Experience: 
        - Title: ${experience.title}
        - Company: ${experience.company}
        - Date: ${experience.date}

        Bullet point:
      `,
    })

    return NextResponse.json({ bulletPoint: bulletPoint.trim() })
  } catch (error) {
    console.error("Error generating bullet point:", error)
    return NextResponse.json({ error: "Failed to generate bullet point" }, { status: 500 })
  }
}

