import { useDrag } from "react-dnd";
import { Card, CardContent } from "@/components/ui/card";

interface Skill {
  id: string;
  text: string;
  type: "hard" | "soft" | "responsibility";
}

interface SkillItemProps {
  skill: Skill;
}

function SkillItem({ skill }: SkillItemProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "SKILL",
    item: { id: skill.id, text: skill.text, type: skill.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) dragRef(node); // ✅ Use callback ref to correctly apply dragRef
      }}
      className={`p-2 mb-2 rounded cursor-move ${
        isDragging ? "opacity-50" : ""
      } ${
        skill.type === "hard"
          ? "bg-blue-100"
          : skill.type === "soft"
          ? "bg-green-100"
          : "bg-yellow-100"
      }`}
    >
      {skill.text}
    </div>
  );
}

export function JobRequirements({ skills }: { skills: Skill[] }) {
  const hardSkills = skills.filter((skill) => skill.type === "hard");
  const softSkills = skills.filter((skill) => skill.type === "soft");
  const responsibilities = skills.filter(
    (skill) => skill.type === "responsibility"
  );

  return (
    <Card className="max-h-[calc(100vh-200px)] overflow-y-auto">
      <CardContent>
        <h3 className="font-semibold mb-2">Hard Skills</h3>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </div>
        <h3 className="font-semibold mb-2 mt-4">Soft Skills</h3>
        <div className="flex flex-wrap gap-2">
          {softSkills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </div>
        <h3 className="font-semibold mb-2 mt-4">Responsibilities</h3>
        <div className="flex flex-wrap gap-2">
          {responsibilities.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
