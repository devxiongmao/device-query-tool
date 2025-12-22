import { Checkbox } from "../../../components/ui";

export interface CapabilityDisplayFields {
  marketName: boolean;
  releaseDate: boolean;
  softwareDetails: boolean;
}

interface DeviceFieldSelectorProps {
  selectedFields: CapabilityDisplayFields;
  onToggleField: (field: keyof CapabilityDisplayFields) => void;
}

const FIELDS = [
  {
    key: "marketName" as const,
    label: "Market Name",
    description: "Consumer product name",
  },
  {
    key: "releaseDate" as const,
    label: "Release Date",
    description: "When device was released",
  },
  {
    key: "softwareDetails" as const,
    label: "Software Details",
    description: "OS version and build numbers",
  },
];

export function DeviceFieldSelector({
  selectedFields,
  onToggleField,
}: DeviceFieldSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Additional Device Information
      </label>
      <div className="space-y-3">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex items-start">
            <Checkbox
              id={`field-${field.key}`}
              checked={selectedFields[field.key]}
              onChange={() => onToggleField(field.key)}
            />
            <div className="ml-3">
              <label
                htmlFor={`field-${field.key}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {field.label}
              </label>
              <p className="text-xs text-gray-500">{field.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
