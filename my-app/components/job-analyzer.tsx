"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface JobAnalysis {
  technicalSkills: string[]
  softSkills: string[]
  experienceLevel: string
  responsibilities: string[]
  keywords: string[]
}

export function JobAnalyzer() {
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)

  const analyzeJob = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      })

      if (!response.ok) throw new Error("Failed to analyze job description")

      const data = await response.json()
      setAnalysis(data)
      toast({
        title: "Analysis Complete",
        description: "Job requirements have been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing job description:", error) // ✅ Logs error to console
    
      toast({
        title: "Error",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Inc"
          />
        </div>
        <div>
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="h-48"
          />
        </div>
        <Button onClick={analyzeJob} disabled={!jobDescription || isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Job Description...
            </>
          ) : (
            "Analyze Job Description"
          )}
        </Button>
      </div>

      {analysis && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
              <CardDescription>Required technical skills and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.technicalSkills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soft Skills</CardTitle>
              <CardDescription>Required soft skills and attributes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.softSkills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
              <CardDescription>Main duties and responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.responsibilities.map((resp, index) => (
                  <li key={index} className="text-sm">
                    {resp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Keywords</CardTitle>
              <CardDescription>Keywords to include in your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.keywords.map((keyword, index) => (
                  <li key={index} className="text-sm">
                    {keyword}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

