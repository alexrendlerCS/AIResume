import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json()

    const { text: analysis } = await generateText({
      model: openai("gpt-4"),
      system:
        "You are an expert resume analyzer and job matcher. Extract key information from resumes and job descriptions, and match skills to experiences.",
      prompt: `
        Analyze the following resume and job description. Extract:
        1. Skills required by the job (categorized as hard skills, soft skills, and responsibilities)
           - For hard skills, extract individual programming languages and technologies
           - Example: "Strong proficiency in HTML, CSS, and JavaScript" should be split into separate skills: HTML, CSS, JavaScript
        2. Experiences from the resume (including title, company, date)

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}

        Provide the output in the following JSON format:
        {
          "skills": [
            { "id": "unique_id", "text": "skill_text", "type": "hard|soft|responsibility" }
          ],
          "experiences": [
            {
              "id": "unique_id",
              "title": "job_title",
              "company": "company_name",
              "date": "employment_date"
            }
          ]
        }
      `,
    })

    return NextResponse.json(JSON.parse(analysis))
  } catch (error) {
    console.error("Error analyzing resume and job:", error)
    return NextResponse.json({ error: "Failed to analyze resume and job" }, { status: 500 })
  }
}

