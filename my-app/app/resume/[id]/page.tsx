import { ResumePreview } from "@/components/resume-preview"

export default function ResumePreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Resume Preview</h1>
      <ResumePreview id={params.id} />
    </div>
  )
}

