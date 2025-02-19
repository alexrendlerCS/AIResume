"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ✅ Define Resume Type
interface Resume {
  id: string;
  name: string;
  jobTitle: string;
}

export function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const response = await fetch("/api/resumes");
    const data: Resume[] = await response.json(); // ✅ Ensure TypeScript knows this returns an array of Resume
    setResumes(data);
  };

  return (
    <div>
      {resumes.map((resume: Resume) => (
        <div key={resume.id} className="mb-4 p-4 border rounded">
          <h3 className="text-xl font-semibold">{resume.name}</h3>
          <p className="text-gray-600">{resume.jobTitle}</p>
          <div className="mt-2">
            <Button asChild variant="outline" className="mr-2">
              <Link href={`/resume/${resume.id}`}>View</Link>
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(resume.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  async function handleDelete(id: string) {
    await fetch("/api/resumes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchResumes();
  }
}
