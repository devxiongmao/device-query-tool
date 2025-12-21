import { useState, useEffect } from "react";
import { useSearchBandsQuery } from "../../../graphql/generated/graphql";
import {
  Select,
  Input,
  Spinner,
  EmptyState,
  Badge,
} from "../../../components/ui";
import { Radio } from "lucide-react";

interface BandSearchProps {
  onBandSelect: (bandId: string) => void;
  selectedBandId?: string;
}

const TECHNOLOGIES = [
  { value: "", label: "All Technologies" },
  { value: "GSM", label: "GSM" },
  { value: "HSPA", label: "HSPA / 3G" },
  { value: "LTE", label: "LTE / 4G" },
  { value: "NR", label: "5G NR" },
];

export function BandSearch({ onBandSelect, selectedBandId }: BandSearchProps) {
  const [technology, setTechnology] = useState("");
  const [bandNumber, setBandNumber] = useState("");

  const { data, loading, error } = useSearchBandsQuery({
    variables: {
      technology: technology || undefined,
      bandNumber: bandNumber || undefined,
    },
  });

  // Auto-select if only one result
  useEffect(() => {
    if (data?.bands && data.bands.length === 1 && !selectedBandId) {
      onBandSelect(data.bands[0].id);
    }
  }, [data, selectedBandId, onBandSelect]);

  return (
    <div className="space-y-4">
      <Select
        label="Technology"
        options={TECHNOLOGIES}
        value={technology}
        onChange={setTechnology}
      />

      <Input
        label="Band Number"
        placeholder="e.g., 2, 66, n77"
        value={bandNumber}
        onChange={(e) => setBandNumber(e.target.value)}
        helperText="Enter band number to filter results"
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

      {!loading && !error && data?.bands && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Found {data.bands.length} band{data.bands.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.bands.map((band) => (
              <button
                key={band.id}
                onClick={() => onBandSelect(band.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedBandId === band.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Radio className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">
                          Band {band.bandNumber}
                        </p>
                        <Badge
                          variant={
                            band.technology === "NR"
                              ? "default"
                              : band.technology === "LTE"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {band.technology}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {band.dlBandClass}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {band.ulBandClass}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && data?.bands && data.bands.length === 0 && (
        <EmptyState
          icon={Radio}
          title="No bands found"
          description="Try adjusting your search criteria"
        />
      )}
    </div>
  );
}
