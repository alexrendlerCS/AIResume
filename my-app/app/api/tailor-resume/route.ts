import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json()

    const { text: tailoredResume } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert resume tailor. Your task is to analyze a given resume and job description, then produce a tailored version of the resume that highlights relevant skills and experiences for the specific job.",
      prompt: `
        Original Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}

        Please tailor the resume to match the job description. Highlight relevant skills and experiences, and adjust the wording to better align with the job requirements. Maintain the original structure and information, but optimize it for this specific job opportunity.
      `,
    })

    return NextResponse.json({ tailoredResume })
  } catch (error) {
    console.error("Error tailoring resume:", error)
    return NextResponse.json({ error: "Failed to tailor resume" }, { status: 500 })
  }
}

