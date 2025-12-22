import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui";
import {
  CapabilityTypeSelector,
  type CapabilityType,
} from "../features/capabilities/components/CapabilityTypeSelector";
import { BandSearch } from "../features/capabilities/components/BandSearch";
import { ComboSearch } from "../features/capabilities/components/ComboSearch";
import { FeatureSearch } from "../features/capabilities/components/FeatureSearch";
import { ProviderSelector } from "../features/devices/components/ProviderSelector";
import {
  DeviceFieldSelector,
  type CapabilityDisplayFields,
} from "../features/capabilities/components/DeviceFieldSelector";
import { CapabilityResults } from "../features/capabilities/components/CapabilityResults";
import { Radio } from "lucide-react";

export function CapabilityQueryPage() {
  const [capabilityType, setCapabilityType] = useState<CapabilityType>("band");
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<
    string | null
  >(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );
  const [displayFields, setDisplayFields] = useState<CapabilityDisplayFields>({
    marketName: true,
    releaseDate: true,
    softwareDetails: false,
  });

  const handleCapabilityTypeChange = (type: CapabilityType) => {
    setCapabilityType(type);
    setSelectedCapabilityId(null); // Reset selection when changing type
  };

  const handleToggleField = (field: keyof CapabilityDisplayFields) => {
    setDisplayFields((prev) => ({
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
            <Radio className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Query by Capability
            </h1>
            <p className="text-gray-600">
              Search for devices by band, combo, or feature
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Search and Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Capability Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select Capability Type</CardTitle>
            </CardHeader>
            <CardContent>
              <CapabilityTypeSelector
                selectedType={capabilityType}
                onTypeChange={handleCapabilityTypeChange}
              />
            </CardContent>
          </Card>

          {/* Capability Search */}
          <Card>
            <CardHeader>
              <CardTitle>
                2. Search{" "}
                {capabilityType === "band"
                  ? "Band"
                  : capabilityType === "combo"
                  ? "Combo"
                  : "Feature"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {capabilityType === "band" && (
                <BandSearch
                  onBandSelect={setSelectedCapabilityId}
                  selectedBandId={selectedCapabilityId || undefined}
                />
              )}
              {capabilityType === "combo" && (
                <ComboSearch
                  onComboSelect={setSelectedCapabilityId}
                  selectedComboId={selectedCapabilityId || undefined}
                />
              )}
              {capabilityType === "feature" && (
                <FeatureSearch
                  onFeatureSelect={setSelectedCapabilityId}
                  selectedFeatureId={selectedCapabilityId || undefined}
                />
              )}
            </CardContent>
          </Card>

          {/* Provider Filter */}
          {selectedCapabilityId && (
            <Card>
              <CardHeader>
                <CardTitle>3. Filter by Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderSelector
                  selectedProviderId={selectedProviderId}
                  onProviderChange={setSelectedProviderId}
                />
              </CardContent>
            </Card>
          )}

          {/* Field Selector */}
          {selectedCapabilityId && (
            <Card>
              <CardHeader>
                <CardTitle>4. Display Options</CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceFieldSelector
                  selectedFields={displayFields}
                  onToggleField={handleToggleField}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Results */}
        <div className="lg:col-span-2">
          {selectedCapabilityId ? (
            <CapabilityResults
              capabilityType={capabilityType}
              capabilityId={selectedCapabilityId}
              providerId={selectedProviderId}
              displayFields={displayFields}
            />
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Radio className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No capability selected
                </h3>
                <p className="text-gray-600">
                  Select a capability type and search for a specific band,
                  combo, or feature
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
