import { useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";

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

interface ExperienceItemProps {
  experience: Experience;
  onDrop: (skill: Skill, experienceId: string) => void;
  onUpdateBullet: (experienceId: string, bulletId: string, newText: string) => void;
  onDeleteBullet: (experienceId: string, bulletId: string) => void;
}

function ExperienceItem({ experience, onDrop, onUpdateBullet, onDeleteBullet }: ExperienceItemProps) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "SKILL",
    drop: (item: Skill) => onDrop(item, experience.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [editingBullet, setEditingBullet] = useState<string | null>(null);

  const handleBulletChange = (bulletId: string, newValue: string) => {
    onUpdateBullet(experience.id, bulletId, newValue);
  };

  const handleSaveBullet = () => {
    setEditingBullet(null);
  };

  return (
    <Card
      ref={(node) => {
        if (node) dropRef(node); // ✅ Fixed TypeScript issue with callback ref
      }}
      className={`mb-4 ${isOver ? "border-2 border-blue-500" : ""}`}
    >
      <CardHeader>
        <CardTitle>
          {experience.title} at {experience.company}
        </CardTitle>
        <p className="text-sm text-gray-500">{experience.date}</p>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">Experience</h4>
        <ul className="space-y-2">
          {experience.bullets.map((bullet) => (
            <li key={bullet.id} className="flex items-center">
              {editingBullet === bullet.id ? (
                <div className="flex items-center w-full">
                  <Input
                    value={bullet.text}
                    onChange={(e) => handleBulletChange(bullet.id, e.target.value)}
                    className="mr-2 flex-grow"
                  />
                  <Button onClick={handleSaveBullet} size="sm">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span>{bullet.text}</span>
                  <div>
                    <Button onClick={() => setEditingBullet(bullet.id)} size="sm" variant="outline" className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => onDeleteBullet(experience.id, bullet.id)} size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ResumeExperience({
  experiences,
  onDrop,
  onUpdateBullet,
  onDeleteBullet,
}: {
  experiences: Experience[];
  onDrop: (skill: Skill, experienceId: string) => void;
  onUpdateBullet: (experienceId: string, bulletId: string, newText: string) => void;
  onDeleteBullet: (experienceId: string, bulletId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <ExperienceItem
          key={experience.id}
          experience={experience}
          onDrop={onDrop}
          onUpdateBullet={onUpdateBullet}
          onDeleteBullet={onDeleteBullet}
        />
      ))}
    </div>
  );
}
