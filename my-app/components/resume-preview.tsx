"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

// ✅ Define Resume Type
interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export function ResumePreview({ id }: { id: string }) {
  const [resume, setResume] = useState<Resume | null>(null);

  // ✅ Use useCallback to prevent recreation of fetchResume function
  const fetchResume = useCallback(async () => {
    const response = await fetch(`/api/resumes/${id}`);
    if (!response.ok) {
      console.error("Failed to fetch resume");
      return;
    }
    const data: Resume = await response.json();
    setResume(data);
  }, [id]);

  // ✅ Include fetchResume in the dependency array to avoid ESLint warning
  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  if (!resume) {
    return <div>Loading...</div>;
  }

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation and download
    console.log("Downloading PDF...");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{resume.name}</h2>
      <p>
        {resume.email} | {resume.phone}
      </p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Professional Summary</h3>
      <p>{resume.summary}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Work Experience</h3>
      <p>{resume.experience}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Education</h3>
      <p>{resume.education}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Skills</h3>
      <p>{resume.skills}</p>
      <Button onClick={handleDownloadPDF} className="mt-4">
        Download PDF
      </Button>
    </div>
  );
}
