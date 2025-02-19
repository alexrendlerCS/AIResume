import { ResumeTailor } from "@/components/resume-tailor"

export default function CreateResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Tailored Resume</h1>
      <ResumeTailor />
    </div>
  )
}

