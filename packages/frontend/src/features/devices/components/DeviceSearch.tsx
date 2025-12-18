import { useState, useEffect } from "react";
import { useSearchDevicesQuery } from "../../../graphql/generated/graphql";
import { Input, Spinner, EmptyState } from "../../../components/ui";
import { Search, Smartphone } from "lucide-react";
import { debounce } from "../../../lib/utils";

interface DeviceSearchProps {
  onDeviceSelect: (deviceId: string) => void;
  selectedDeviceId?: string;
}

export function DeviceSearch({
  onDeviceSelect,
  selectedDeviceId,
}: DeviceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    handler();
  }, [searchTerm]);

  const { data, loading, error } = useSearchDevicesQuery({
    variables: {
      vendor: debouncedSearch || undefined,
      modelNum: debouncedSearch || undefined,
      limit: 20,
    },
    skip: !debouncedSearch, // Don't query until user types something
  });

  const devices = data?.devices
    ? Array.from(new Map(data.devices.map((d) => [d.id, d])).values())
    : [];

  return (
    <div className="space-y-4">
      <Input
        label="Search for a device"
        placeholder="Enter vendor or model number (e.g., Apple, iPhone, SM-S928W)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        helperText="Search by vendor name or model number"
      />

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading devices: {error.message}
        </div>
      )}

      {/* Results */}
      {!loading && !error && debouncedSearch && (
        <div className="space-y-2">
          {devices && devices.length > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                Found {devices.length} device
                {devices.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => onDeviceSelect(device.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedDeviceId === device.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {device.vendor} {device.modelNum}
                          </p>
                          {device.marketName && (
                            <p className="text-sm text-gray-600">
                              {device.marketName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Released:{" "}
                            {new Date(device.releaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedDeviceId === device.id && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <Search className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No devices found"
              description="Try searching with a different vendor or model number"
            />
          )}
        </div>
      )}

      {/* Initial state */}
      {!loading && !error && !debouncedSearch && (
        <div className="text-center py-12 text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Start typing to search for devices</p>
        </div>
      )}
    </div>
  );
}
