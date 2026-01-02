import { Checkbox } from "../../../components/ui";

export interface SelectedFields {
  software: boolean;
  bands: boolean;
  combos: boolean;
  features: boolean;
}

interface FieldSelectorProps {
  selectedSoftwareId: string | null;
  selectedFields: SelectedFields;
  onToggleField: (field: keyof SelectedFields) => void;
}

const FIELDS = [
  {
    key: "software" as const,
    label: "Software Versions",
    description: "OS versions and build numbers",
  },
  {
    key: "bands" as const,
    label: "Supported Bands",
    description: "Individual frequency bands",
  },
  {
    key: "combos" as const,
    label: "Carrier Aggregation",
    description: "LTE CA, EN-DC, NR CA combos",
  },
  {
    key: "features" as const,
    label: "Features",
    description: "VoLTE, VoWiFi, 5G SA, etc.",
  },
];

export function FieldSelector({
  selectedSoftwareId,
  selectedFields,
  onToggleField,
}: FieldSelectorProps) {
  const visibleFields = selectedSoftwareId
    ? FIELDS.filter((field) => field.key !== "software")
    : FIELDS;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Data to Display
      </label>
      <div className="space-y-3">
        {visibleFields.map((field) => (
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
