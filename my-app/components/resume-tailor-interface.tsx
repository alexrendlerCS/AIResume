"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { JobRequirements } from "@/components/job-requirements";
import { ResumeExperience } from "@/components/resume-experience";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  text: string;
  type: "hard" | "soft" | "responsibility";
}

interface Bullet {
  id: string;
  text: string;
  skill: Skill;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  date: string;
  bullets: Bullet[];
}

export function ResumeTailorInterface({
  resumeText,
  jobDescription,
}: {
  resumeText: string;
  jobDescription: string;
}) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyzeResumeAndJob = async () => {
      try {
        const response = await fetch("/api/analyze-resume-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jobDescription }),
        });

        if (!response.ok) throw new Error("Failed to analyze resume and job");

        const data = await response.json();
        setSkills(data.skills);
        setExperiences(
          data.experiences.map((exp: Experience) => ({ ...exp, bullets: [] }))
        );
      } catch (error) {
        console.error("Error analyzing resume and job:", error); // ✅ Logs error
        toast({
          title: "Error",
          description: "Failed to analyze resume and job. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    analyzeResumeAndJob();
  }, [resumeText, jobDescription]);

  const handleDrop = async (skill: Skill, experienceId: string) => {
    try {
      const experience = experiences.find((exp) => exp.id === experienceId);
      if (!experience) return;

      const response = await fetch("/api/generate-bullet-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, experience }),
      });

      if (!response.ok) throw new Error("Failed to generate bullet point");

      const { bulletPoint } = await response.json();

      // ✅ Use functional update to correctly append the new bullet point
      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                bullets: [
                  ...exp.bullets, // Preserve existing bullet points
                  {
                    id: `bullet-${Date.now()}`,
                    text: bulletPoint,
                    skill,
                  },
                ],
              }
            : exp
        )
      );

      // Remove the skill from the available skills list
      setSkills((prevSkills) => prevSkills.filter((s) => s.id !== skill.id));
    } catch (error) {
      console.error("Error generating bullet point:", error); // ✅ Logs error
      toast({
        title: "Error",
        description: "Failed to generate bullet point. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBullet = (
    experienceId: string,
    bulletId: string,
    newText: string
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              bullets: exp.bullets.map((bullet) =>
                bullet.id === bulletId ? { ...bullet, text: newText } : bullet
              ),
            }
          : exp
      )
    );
  };

  const handleDeleteBullet = (experienceId: string, bulletId: string) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              bullets: exp.bullets.filter((bullet) => bullet.id !== bulletId),
            }
          : exp
      )
    );
    // Add the skill back to the skills list
    const deletedBullet = experiences
      .find((exp) => exp.id === experienceId)
      ?.bullets.find((bullet) => bullet.id === bulletId);
    if (deletedBullet) {
      setSkills([...skills, deletedBullet.skill]);
    }
  };

  const handleGenerateFinalResume = async () => {
    try {
      const response = await fetch("/api/generate-final-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiences }),
      });

      if (!response.ok) throw new Error("Failed to generate final resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "tailored_resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating final resume:", error); // ✅ Logs error
      toast({
        title: "Error",
        description: "Failed to generate final resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Analyzing resume and job description...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Job Requirements</h2>
          <JobRequirements skills={skills} />
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Resume Experience</h2>
          <ResumeExperience
            experiences={experiences}
            onDrop={handleDrop}
            onUpdateBullet={handleUpdateBullet}
            onDeleteBullet={handleDeleteBullet}
          />
        </div>
      </div>
      <Button onClick={handleGenerateFinalResume} className="mt-8">
        Generate Final Resume
      </Button>
    </DndProvider>
  );
}
