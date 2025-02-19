"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { JobAnalyzer } from "@/components/job-analyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormField = "summary" | "experience" | "education" | "skills";

export function ResumeForm() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState<FormField | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [activeTab, setActiveTab] = useState("resume");
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      const data = await response.json();
      toast({
        title: "Success",
        description: "Resume saved successfully",
      });
      router.push(`/resume/${data.id}`);
    } catch (error) {
      console.error("Error saving resume:", error); // ✅ Logs error

      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateAIContent = async (field: FormField) => {
    setIsGenerating(field);
    try {
      const fieldPrompts = {
        summary: `Generate a professional summary for someone with the following details: ${formData.name}, focusing on their career goals and key strengths.`,
        experience: `Generate professional work experience entries based on the following information: ${formData.experience}`,
        education: `Format the following education details professionally: ${formData.education}`,
        skills: `Create a well-organized list of skills based on the following information: ${formData.skills}`,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fieldPrompts[field],
          type: field,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setFormData((prev) => ({ ...prev, [field]: data.result }));
      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error("Error generating AI content:", error); // ✅ Logs error

      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const optimizeForJob = async () => {
    if (!jobAnalysis) return;

    try {
      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: formData,
          jobRequirements: jobAnalysis,
        }),
      });

      if (!response.ok) throw new Error("Failed to optimize resume");

      const { analysis, optimizedContent } = await response.json();
      setFormData((prev) => ({
        ...prev,
        ...optimizedContent,
      }));
      setMatchScore(analysis.matchPercentage);

      toast({
        title: "Resume Optimized",
        description: `Your resume has been optimized for the job. Match score: ${analysis.matchPercentage}%`,
      });
    } catch (error) {
      console.error("Error optimizing resume:", error); // ✅ Logs error

      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="resume">Resume Details</TabsTrigger>
        <TabsTrigger value="job">Job Description</TabsTrigger>
      </TabsList>

      <TabsContent value="resume">
        <Card>
          <CardHeader>
            <CardTitle>Resume Information</CardTitle>
            <CardDescription>
              Enter your resume details or generate content with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  onClick={() => generateAIContent("summary")}
                  disabled={isGenerating !== null}
                  className="mt-2"
                >
                  {isGenerating === "summary" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate AI Content"
                  )}
                </Button>
              </div>
              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  onClick={() => generateAIContent("experience")}
                  disabled={isGenerating !== null}
                  className="mt-2"
                >
                  {isGenerating === "experience" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate AI Content"
                  )}
                </Button>
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  onClick={() => generateAIContent("education")}
                  disabled={isGenerating !== null}
                  className="mt-2"
                >
                  {isGenerating === "education" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate AI Content"
                  )}
                </Button>
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  onClick={() => generateAIContent("skills")}
                  disabled={isGenerating !== null}
                  className="mt-2"
                >
                  {isGenerating === "skills" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate AI Content"
                  )}
                </Button>
              </div>
              {matchScore && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Job Match Score</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                    <span className="font-medium">{matchScore}%</span>
                  </div>
                </div>
              )}
              <Button type="submit" disabled={isGenerating !== null}>
                Save Resume
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="job">
        <Card>
          <CardHeader>
            <CardTitle>Job Analysis</CardTitle>
            <CardDescription>
              Paste the job description to optimize your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobAnalyzer
              onAnalysisComplete={(analysis) => {
                setJobAnalysis(analysis);
                setActiveTab("resume");
                toast({
                  title: "Job Analyzed",
                  description: "Now optimize your resume for this position",
                });
              }}
            />
            {jobAnalysis && (
              <Button onClick={optimizeForJob} className="mt-4 w-full">
                Optimize Resume for This Job
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
