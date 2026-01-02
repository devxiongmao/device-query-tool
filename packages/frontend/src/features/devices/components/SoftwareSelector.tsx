import { useGetDeviceQuery } from "../../../graphql/generated/graphql";
import { Card, CardContent, Spinner } from "../../../components/ui";
import { Globe, Code } from "lucide-react";

interface SoftwareSelectorProps {
  selectedDeviceId: string | null;
  selectedSoftwareId: string | null;
  onSoftwareChange: (softwareId: string | null) => void;
}

export function SoftwareSelector({
  selectedDeviceId,
  selectedSoftwareId,
  onSoftwareChange,
}: SoftwareSelectorProps) {
  const { data, loading, error } = useGetDeviceQuery({
    variables: {
      id: selectedDeviceId!,
    },
    skip: !selectedDeviceId, // Don't query unless device is selected
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <Spinner size="md" className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-red-600">Error loading software</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* All Sofwares option */}
      <button
        onClick={() => onSoftwareChange(null)}
        className={`p-4 rounded-lg border-2 transition-all text-left ${
          selectedSoftwareId === null
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">All software</p>
            <p className="text-xs text-gray-600">All capabilities</p>
          </div>
        </div>
      </button>

      {/* Software options */}
      {data?.device?.software?.map((software) => (
        <button
          key={software.id}
          onClick={() => onSoftwareChange(software.id ?? null)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedSoftwareId === software.id
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Code className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{software.name}</p>
              <div className="flex flex-col gap-0.5 mt-0.5">
                <p className="text-xs text-gray-600">{software.platform}</p>
                {software.buildNumber && (
                  <p className="text-xs text-gray-500">
                    Build: {software.buildNumber}
                  </p>
                )}
                {software.releaseDate && (
                  <p className="text-xs text-gray-500">
                    Released:{" "}
                    {new Date(software.releaseDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
