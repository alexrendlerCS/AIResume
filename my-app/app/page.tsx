import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">AI-Powered Resume Tailor</h1>
      <p className="text-xl mb-8 text-center">
        Upload your resume and paste a job description to get a tailored resume in minutes
      </p>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/resume/create">Create Tailored Resume</Link>
        </Button>
      </div>
    </div>
  )
}

