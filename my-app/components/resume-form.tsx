"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// ✅ Define `JobAnalysis` Type
interface JobAnalysis {
  technicalSkills: string[];
  softSkills: string[];
  experienceLevel: string;
  responsibilities: string[];
  keywords: string[];
}

export function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [activeTab, setActiveTab] = useState("resume");

  // ✅ Fix: Properly define jobAnalysis state
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            <CardDescription>Enter your resume details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
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
            </form>

            {/* ✅ Display Job Analysis Results when available */}
            {jobAnalysis && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Job Analysis Results</CardTitle>
                  <CardDescription>
                    Extracted job requirements based on the provided description.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold">Technical Skills:</h4>
                    <ul className="list-disc pl-5">
                      {jobAnalysis.technicalSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Soft Skills:</h4>
                    <ul className="list-disc pl-5">
                      {jobAnalysis.softSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Responsibilities:</h4>
                    <ul className="list-disc pl-5">
                      {jobAnalysis.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="job">
        <Card>
          <CardHeader>
            <CardTitle>Job Analysis</CardTitle>
            <CardDescription>
              Paste the job description to optimize your resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobAnalyzer
              onAnalysisComplete={(analysis: JobAnalysis) => {
                setJobAnalysis(analysis);

                // ✅ Ensure jobAnalysis exists before calling toast
                if (analysis) {
                  setActiveTab("resume");
                  toast({
                    title: "Job Analyzed",
                    description: "Now optimize your resume for this position.",
                  });
                }
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
