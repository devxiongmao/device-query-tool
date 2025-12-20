import { useGetProvidersQuery } from "../../../graphql/generated/graphql";
import { Card, CardContent, Spinner } from "../../../components/ui";
import { Globe, Building2 } from "lucide-react";

interface ProviderSelectorProps {
  selectedProviderId: string | null;
  onProviderChange: (providerId: string | null) => void;
}

export function ProviderSelector({
  selectedProviderId,
  onProviderChange,
}: ProviderSelectorProps) {
  const { data, loading, error } = useGetProvidersQuery();

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
          <p className="text-sm text-red-600">Error loading providers</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Global option */}
      <button
        onClick={() => onProviderChange(null)}
        className={`p-4 rounded-lg border-2 transition-all text-left ${
          selectedProviderId === null
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">Global</p>
            <p className="text-xs text-gray-600">All capabilities</p>
          </div>
        </div>
      </button>

      {/* Provider options */}
      {data?.providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onProviderChange(provider.id)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedProviderId === provider.id
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{provider.name}</p>
              <p className="text-xs text-gray-600">{provider.country}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
