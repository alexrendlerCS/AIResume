import { ResumeForm } from "@/components/resume-form"

export default function NewResumePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Create Your Resume</h1>
      <ResumeForm />
    </div>
  )
}

