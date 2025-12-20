import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui";
import { DeviceSearch } from "../features/devices/components/DeviceSearch";
import { ProviderSelector } from "../features/devices/components/ProviderSelector";
import { TechnologyFilter } from "../features/devices/components/TechnologyFilter";
import { FieldSelector } from "../features/devices/components/FieldSelector";
import type { SelectedFields } from "../features/devices/components/FieldSelector";
import { DeviceResults } from "../features/devices/components/DeviceResults";
import { Smartphone } from "lucide-react";

export function DeviceQueryPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    software: true,
    bands: true,
    combos: true,
    features: true,
  });

  const handleToggleTechnology = (technology: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(technology)
        ? prev.filter((t) => t !== technology)
        : [...prev, technology]
    );
  };

  const handleToggleField = (field: keyof SelectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Query by Device
            </h1>
            <p className="text-gray-600">
              Search for a device and view its capabilities
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Search and Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Device Search */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select Device</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceSearch
                onDeviceSelect={setSelectedDeviceId}
                selectedDeviceId={selectedDeviceId || undefined}
              />
            </CardContent>
          </Card>

          {/* Provider Selection */}
          {selectedDeviceId && (
            <Card>
              <CardHeader>
                <CardTitle>2. Select Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderSelector
                  selectedProviderId={selectedProviderId}
                  onProviderChange={setSelectedProviderId}
                />
              </CardContent>
            </Card>
          )}

          {/* Technology Filter */}
          {selectedDeviceId && (
            <Card>
              <CardHeader>
                <CardTitle>3. Filter Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <TechnologyFilter
                  selectedTechnologies={selectedTechnologies}
                  onToggleTechnology={handleToggleTechnology}
                />
              </CardContent>
            </Card>
          )}

          {/* Field Selector */}
          {selectedDeviceId && (
            <Card>
              <CardHeader>
                <CardTitle>4. Select Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldSelector
                  selectedFields={selectedFields}
                  onToggleField={handleToggleField}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Results */}
        <div className="lg:col-span-2">
          {selectedDeviceId ? (
            <DeviceResults
              deviceId={selectedDeviceId}
              providerId={selectedProviderId}
              selectedTechnologies={selectedTechnologies}
              selectedFields={selectedFields}
            />
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No device selected
                </h3>
                <p className="text-gray-600">
                  Search and select a device from the sidebar to view its
                  capabilities
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
