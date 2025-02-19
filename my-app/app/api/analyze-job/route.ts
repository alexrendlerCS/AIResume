import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json()

    // Extract key requirements and skills from job description
    const { text: analysis } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert ATS system and resume analyzer. Extract and analyze key requirements, skills, and qualifications from job descriptions.",
      prompt: `Analyze this job description and provide a structured output with:
1. Required technical skills
2. Required soft skills
3. Required experience level
4. Key responsibilities
5. Important keywords and phrases

Job Description:
${jobDescription}`,
    })

    // Get structured data from the analysis
    const { text: structuredData } = await generateText({
      model: openai("gpt-4"),
      system: "Convert the analysis into a structured JSON format.",
      prompt: `Convert this analysis into a JSON object with the following structure:
{
  "technicalSkills": string[],
  "softSkills": string[],
  "experienceLevel": string,
  "responsibilities": string[],
  "keywords": string[]
}

Analysis:
${analysis}`,
    })

    return NextResponse.json(JSON.parse(structuredData))
  } catch (error) {
    console.error("Error analyzing job description:", error)
    return NextResponse.json({ error: "Failed to analyze job description" }, { status: 500 })
  }
}

