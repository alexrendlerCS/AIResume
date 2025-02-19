"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ Define a specific type instead of `any`
interface JobAnalysis {
  technicalSkills: string[];
  softSkills: string[];
  experienceLevel: string;
  responsibilities: string[];
  keywords: string[];
}

interface JobAnalyzerProps {
  onAnalysisComplete: (analysis: JobAnalysis) => void; // ✅ No more `any`
}

export function JobAnalyzer({ onAnalysisComplete }: JobAnalyzerProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJob = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) throw new Error("Failed to analyze job description");

      const data: JobAnalysis = await response.json(); // ✅ Enforcing correct type
      onAnalysisComplete(data);

      toast({
        title: "Analysis Complete",
        description: "Job requirements have been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing job:", error); // ✅ Prevents unused `error` warning
      toast({
        title: "Error",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    </div>
  );
}
