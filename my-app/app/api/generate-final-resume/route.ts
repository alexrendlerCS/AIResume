import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import jsPDF from "jspdf"

// Define TypeScript interfaces
interface Experience {
  title: string
  company: string
  date: string
  bullets: string[]
}

interface ResumeData {
  name: string
  contact: string
  summary: string
  experiences: Experience[]
  skills: string
}

export async function POST(request: Request) {
  try {
    const { experiences }: { experiences: Experience[] } = await request.json()

    const { text: optimizedResume } = await generateText({
      model: openai("gpt-4"),
      system: "You are an expert resume writer. Optimize resume content based on matched skills and experiences.",
      prompt: `
        Given the following experiences and their associated bullet points, create an optimized resume.
        Focus on highlighting the relevance of each experience to the matched skills.
        Use the provided bullet points, but feel free to refine or combine them if necessary for better flow and impact.

        Experiences:
        ${JSON.stringify(experiences, null, 2)}

        Provide the output as a JSON object with the following structure:
        {
          "name": "Candidate Name",
          "contact": "email@example.com | phone | location",
          "summary": "Professional summary paragraph",
          "experiences": [
            {
              "title": "Job Title",
              "company": "Company Name",
              "date": "Employment Date",
              "bullets": ["Optimized bullet point 1", "Optimized bullet point 2"]
            }
          ],
          "skills": "Comma-separated list of all skills"
        }
      `,
    })

    const resumeData: ResumeData = JSON.parse(optimizedResume)

    // Generate PDF
    const doc = new jsPDF()
    let yOffset = 10

    // Add content to PDF
    doc.setFontSize(18)
    doc.text(resumeData.name, 105, yOffset, { align: "center" })
    yOffset += 10

    doc.setFontSize(12)
    doc.text(resumeData.contact, 105, yOffset, { align: "center" })
    yOffset += 15

    doc.setFontSize(14)
    doc.text("Professional Summary", 10, yOffset)
    yOffset += 7

    doc.setFontSize(12)
    const summaryLines = doc.splitTextToSize(resumeData.summary, 190)
    doc.text(summaryLines, 10, yOffset)
    yOffset += summaryLines.length * 7 + 10

    doc.setFontSize(14)
    doc.text("Experience", 10, yOffset)
    yOffset += 7

    resumeData.experiences.forEach((exp: Experience) => {
      doc.setFontSize(12)
      doc.text(`${exp.title} - ${exp.company}`, 10, yOffset)
      yOffset += 5
      doc.setFontSize(10)
      doc.text(exp.date, 10, yOffset)
      yOffset += 5
      exp.bullets.forEach((bullet: string) => {
        const bulletLines = doc.splitTextToSize(`• ${bullet}`, 180)
        doc.text(bulletLines, 15, yOffset)
        yOffset += bulletLines.length * 5
      })
      yOffset += 5
    })

    doc.setFontSize(14)
    doc.text("Skills", 10, yOffset)
    yOffset += 7

    doc.setFontSize(12)
    const skillLines = doc.splitTextToSize(resumeData.skills, 190)
    doc.text(skillLines, 10, yOffset)

    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=tailored_resume.pdf",
      },
    })
  } catch (error) {
    console.error("Error generating final resume:", error)
    return NextResponse.json({ error: "Failed to generate final resume" }, { status: 500 })
  }
}
