import { Checkbox } from "../../../components/ui";

interface TechnologyFilterProps {
  selectedTechnologies: string[];
  onToggleTechnology: (technology: string) => void;
}

const TECHNOLOGIES = [
  { value: "GSM", label: "GSM", color: "bg-gray-100 text-gray-700" },
  { value: "HSPA", label: "HSPA / 3G", color: "bg-blue-100 text-blue-700" },
  { value: "LTE", label: "LTE / 4G", color: "bg-green-100 text-green-700" },
  { value: "NR", label: "5G NR", color: "bg-purple-100 text-purple-700" },
];

export function TechnologyFilter({
  selectedTechnologies,
  onToggleTechnology,
}: TechnologyFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Filter by Technology
      </label>
      <div className="space-y-2">
        {TECHNOLOGIES.map((tech) => (
          <div key={tech.value} className="flex items-center">
            <Checkbox
              id={`tech-${tech.value}`}
              checked={selectedTechnologies.includes(tech.value)}
              onChange={() => onToggleTechnology(tech.value)}
            />
            <label
              htmlFor={`tech-${tech.value}`}
              className="ml-3 flex items-center cursor-pointer"
            >
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${tech.color}`}
              >
                {tech.label}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
