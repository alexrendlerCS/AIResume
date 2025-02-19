"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ResumeTailorInterface } from "@/components/resume-tailor-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeTailor() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showInterface, setShowInterface] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ Define isLoading state

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setResumeText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTailorResume = async () => {
    if (!resumeText || !jobDescription) {
      toast({
        title: "Error",
        description: "Please provide both a resume and a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true); // ✅ Set loading state

    try {
      // Simulate a small delay (e.g., API request processing)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowInterface(true);
    } catch (error) {
      console.error("Error tailoring resume:", error);
      toast({
        title: "Error",
        description: "Failed to tailor resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // ✅ Reset loading state
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resume Tailor</CardTitle>
        <CardDescription>Upload your resume and paste a job description to get a tailored resume</CardDescription>
      </CardHeader>
      <CardContent>
        {!showInterface ? (
          <>
            <Tabs defaultValue="upload" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                <TabsTrigger value="paste">Paste Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <Input id="resume-upload" type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleResumeUpload} />
              </TabsContent>
              <TabsContent value="paste">
                <Textarea
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="h-40"
                />
              </TabsContent>
            </Tabs>
            <div className="mt-4">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="h-40"
              />
            </div>
            <Button onClick={handleTailorResume} disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Tailor Resume"
              )}
            </Button>
          </>
        ) : (
          <ResumeTailorInterface resumeText={resumeText} jobDescription={jobDescription} />
        )}
      </CardContent>
    </Card>
  );
}
