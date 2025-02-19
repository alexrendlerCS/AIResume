import { NextResponse } from "next/server"

// Define Resume Interface
interface Resume {
  id: string
  name: string
  contact: string
  summary: string
  experiences: {
    title: string
    company: string
    date: string
    bullets: string[]
  }[]
  skills: string
}

// Use typed array instead of `any[]`
let resumes: Resume[] = []

export async function GET() {
  return NextResponse.json(resumes)
}

export async function POST(request: Request) {
  const resume: Omit<Resume, "id"> = await request.json()
  const newResume: Resume = { ...resume, id: Date.now().toString() } // Assign ID
  resumes.push(newResume)
  return NextResponse.json(newResume)
}

export async function PUT(request: Request) {
  const { id, ...updatedResume }: Resume = await request.json()
  const index = resumes.findIndex((r) => r.id === id)
  if (index !== -1) {
    resumes[index] = { ...resumes[index], ...updatedResume }
    return NextResponse.json(resumes[index])
  }
  return NextResponse.json({ error: "Resume not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id }: { id: string } = await request.json()
  resumes = resumes.filter((r) => r.id !== id)
  return NextResponse.json({ success: true })
}
