import { useState, useEffect } from "react";
import { useSearchCombosQuery } from "../../../graphql/generated/graphql";
import {
  Select,
  Input,
  Spinner,
  EmptyState,
  Badge,
} from "../../../components/ui";
import { Settings } from "lucide-react";

interface ComboSearchProps {
  onComboSelect: (comboId: string) => void;
  selectedComboId?: string;
}

const COMBO_TECHNOLOGIES = [
  { value: "", label: "All Technologies" },
  { value: "LTE CA", label: "LTE Carrier Aggregation" },
  { value: "EN-DC", label: "EN-DC (LTE + 5G)" },
  { value: "NR CA", label: "5G NR Carrier Aggregation" },
];

export function ComboSearch({
  onComboSelect,
  selectedComboId,
}: ComboSearchProps) {
  const [technology, setTechnology] = useState("");
  const [name, setName] = useState("");

  const { data, loading, error } = useSearchCombosQuery({
    variables: {
      technology: technology || undefined,
      name: name || undefined,
    },
  });

  // Auto-select if only one result
  useEffect(() => {
    if (data?.combos && data.combos.length === 1 && !selectedComboId) {
      onComboSelect(data.combos[0].id);
    }
  }, [data, selectedComboId, onComboSelect]);

  return (
    <div className="space-y-4">
      <Select
        label="Technology"
        options={COMBO_TECHNOLOGIES}
        value={technology}
        onChange={setTechnology}
      />

      <Input
        label="Combo Name"
        placeholder="e.g., B2-n66, 2A-4A"
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="Enter combo name to filter results"
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

      {!loading && !error && data?.combos && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Found {data.combos.length} combo
            {data.combos.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.combos.map((combo) => (
              <button
                key={combo.id}
                onClick={() => onComboSelect(combo.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedComboId === combo.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">
                          {combo.name}
                        </p>
                        <Badge variant="default">{combo.technology}</Badge>
                      </div>
                      {combo.bands && combo.bands.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {combo.bands.map((band) => (
                            <span
                              key={band.id}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                            >
                              {band.bandNumber}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && data?.combos && data.combos.length === 0 && (
        <EmptyState
          icon={Settings}
          title="No combos found"
          description="Try adjusting your search criteria"
        />
      )}
    </div>
  );
}
