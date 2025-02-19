import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { resumeContent, jobRequirements } = await request.json()

    // Analyze current resume content against job requirements
    const { text: matchAnalysis } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert resume optimizer. Analyze resumes against job requirements and provide optimization suggestions.",
      prompt: `Compare this resume content against the job requirements and provide:
1. Match percentage
2. Missing key skills/requirements
3. Found matching skills/requirements
4. Specific suggestions for improvement

Resume Content:
${JSON.stringify(resumeContent)}

Job Requirements:
${JSON.stringify(jobRequirements)}`,
    })

    // Generate optimized content
    const { text: optimizedContent } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert resume writer. Optimize resume content to better match job requirements while maintaining authenticity.",
      prompt: `Optimize this resume content to better match the job requirements. 
Maintain truthfulness but highlight relevant experience and skills.
Use industry-standard keywords where applicable.

Original Content:
${JSON.stringify(resumeContent)}

Job Requirements:
${JSON.stringify(jobRequirements)}

Analysis:
${matchAnalysis}`,
    })

    return NextResponse.json({
      analysis: JSON.parse(matchAnalysis),
      optimizedContent: JSON.parse(optimizedContent),
    })
  } catch (error) {
    console.error("Error optimizing resume:", error)
    return NextResponse.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}

