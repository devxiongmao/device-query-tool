import { Radio, Settings, Zap } from "lucide-react";

export type CapabilityType = "band" | "combo" | "feature";

interface CapabilityTypeSelectorProps {
  selectedType: CapabilityType;
  onTypeChange: (type: CapabilityType) => void;
}

const CAPABILITY_TYPES = [
  {
    type: "band" as const,
    label: "Band",
    icon: Radio,
    description: "Search by frequency band",
    color: "bg-blue-100 text-blue-700",
  },
  {
    type: "combo" as const,
    label: "Combo",
    icon: Settings,
    description: "Search by carrier aggregation combo",
    color: "bg-green-100 text-green-700",
  },
  {
    type: "feature" as const,
    label: "Feature",
    icon: Zap,
    description: "Search by device feature",
    color: "bg-purple-100 text-purple-700",
  },
];

export function CapabilityTypeSelector({
  selectedType,
  onTypeChange,
}: CapabilityTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Capability Type
      </label>
      <div className="grid grid-cols-1 gap-3">
        {CAPABILITY_TYPES.map((capType) => {
          const Icon = capType.icon;
          const isSelected = selectedType === capType.type;

          return (
            <button
              key={capType.type}
              onClick={() => onTypeChange(capType.type)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${capType.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{capType.label}</p>
                  <p className="text-sm text-gray-600">{capType.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
