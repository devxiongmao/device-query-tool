import { useState, useEffect } from "react";
import { useSearchFeaturesQuery } from "../../../graphql/generated/graphql";
import { Input, Spinner, EmptyState } from "../../../components/ui";
import { Zap } from "lucide-react";

interface FeatureSearchProps {
  onFeatureSelect: (featureId: string) => void;
  selectedFeatureId?: string;
}

export function FeatureSearch({
  onFeatureSelect,
  selectedFeatureId,
}: FeatureSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useSearchFeaturesQuery({
    variables: {
      name: searchTerm || undefined,
    },
  });

  // Auto-select if only one result
  useEffect(() => {
    if (data?.features && data.features.length === 1 && !selectedFeatureId) {
      onFeatureSelect(data.features[0].id);
    }
  }, [data, selectedFeatureId, onFeatureSelect]);

  return (
    <div className="space-y-4">
      <Input
        label="Feature Name"
        placeholder="e.g., VoLTE, VoWiFi, 5G SA"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        helperText="Enter feature name to search"
      />

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error: {error.message}
        </div>
      )}

      {!loading && !error && data?.features && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Found {data.features.length} feature
            {data.features.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => onFeatureSelect(feature.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedFeatureId === feature.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {feature.name}
                      </p>
                      {feature.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && data?.features && data.features.length === 0 && (
        <EmptyState
          icon={Zap}
          title="No features found"
          description="Try a different search term"
        />
      )}
    </div>
  );
}
