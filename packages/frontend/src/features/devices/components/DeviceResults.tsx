import {
  useGetDeviceCompleteQuery,
  useGetProviderDeviceCompleteQuery,
  type Device,
} from "../../../graphql/generated/graphql";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Spinner,
  EmptyState,
  Button,
} from "../../../components/ui";
import { Smartphone, Calendar, Code, Radio, Zap, Settings } from "lucide-react";
import {
  formatDate,
  groupBandsByNumberAndTechnology,
} from "../../../lib/utils";
import type { SelectedFields } from "./FieldSelector";

interface DeviceResultsProps {
  deviceId: string;
  providerId: string | null;
  softwareId: string | null;
  selectedTechnologies: string[];
  selectedFields: SelectedFields;
}

export function DeviceResults({
  deviceId,
  providerId,
  softwareId,
  selectedTechnologies,
  selectedFields,
}: DeviceResultsProps) {
  // State for toggling between grouped and original view
  const [showGroupedView, setShowGroupedView] = useState(true);

  const singleSelectedTechnology =
    selectedTechnologies.length === 1 ? selectedTechnologies[0] : undefined;

  const {
    data: providerData,
    loading: providerLoading,
    error: providerError,
  } = useGetProviderDeviceCompleteQuery({
    variables: {
      id: deviceId,
      // When providerId is null we skip this query, but the variable
      // is still required by the generated hook type.
      providerId: providerId ?? "",
      softwareId: softwareId,
      bandTechnology: singleSelectedTechnology,
      comboTechnology: singleSelectedTechnology,
    },
    skip: !providerId,
  });

  const {
    data: globalData,
    loading: globalLoading,
    error: globalError,
  } = useGetDeviceCompleteQuery({
    variables: {
      id: deviceId,
      softwareId: softwareId,
      bandTechnology: singleSelectedTechnology,
      comboTechnology: singleSelectedTechnology,
    },
    skip: !!providerId,
  });

  const loading = providerId ? providerLoading : globalLoading;
  const error = providerId ? providerError : globalError;
  const data = providerId ? providerData : globalData;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <Spinner size="lg" className="mx-auto" />
          <p className="text-center text-gray-600 mt-4">
            Loading device details...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            icon={Smartphone}
            title="Error loading device"
            description={error.message}
          />
        </CardContent>
      </Card>
    );
  }

  if (!data?.device) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            icon={Smartphone}
            title="Device not found"
            description="The requested device could not be found"
          />
        </CardContent>
      </Card>
    );
  }

  const device = data.device as Device;

  // Filter bands by selected technologies
  const filteredBands = providerId
    ? selectedTechnologies.length > 0
      ? device.supportedBandsForProvider?.filter(
          (band) =>
            band.technology && selectedTechnologies.includes(band.technology)
        )
      : device.supportedBandsForProvider
    : selectedTechnologies.length > 0
    ? device.supportedBands?.filter(
        (band) =>
          band.technology && selectedTechnologies.includes(band.technology)
      )
    : device.supportedBands;

  const filteredCombos = providerId
    ? selectedTechnologies.length > 0
      ? device.supportedCombosForProvider?.filter(
          (combo) =>
            combo.technology && selectedTechnologies.includes(combo.technology)
        )
      : device.supportedCombosForProvider
    : selectedTechnologies.length > 0
    ? device.supportedCombos?.filter(
        (combo) =>
          combo.technology && selectedTechnologies.includes(combo.technology)
      )
    : device.supportedCombos;

  // Group bands by bandNumber and technology, combining dlBandClass and ulBandClass
  const groupedBands = groupBandsByNumberAndTechnology(filteredBands);

  // Determine which bands to display and their count
  const displayBands = showGroupedView ? groupedBands : filteredBands || [];
  const bandCount = showGroupedView
    ? groupedBands.length
    : filteredBands?.length || 0;

  return (
    <div className="space-y-6">
      {/* Device Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {device.vendor} {device.modelNum}
                </CardTitle>
                {device.marketName && (
                  <p className="text-lg text-gray-600 mt-1">
                    {device.marketName}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Released{" "}
                    {device.releaseDate
                      ? formatDate(device.releaseDate)
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant={providerId ? "default" : "secondary"}>
              {providerId ? "Provider-Specific" : "Global Capabilities"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Software Versions */}
      {selectedFields.software &&
        softwareId === null &&
        device.software &&
        device.software.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-gray-600" />
                <CardTitle>Software Versions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Build Number</TableHead>
                    <TableHead>Release Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {device.software.map((sw) => (
                    <TableRow key={sw.id}>
                      <TableCell className="font-medium">{sw.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sw.platform}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {sw.buildNumber}
                      </TableCell>
                      <TableCell>
                        {sw.releaseDate ? formatDate(sw.releaseDate) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      {/* Supported Bands */}
      {selectedFields.bands && bandCount > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-gray-600" />
                <CardTitle>Supported Bands</CardTitle>
                <Badge variant="outline">
                  {bandCount} {showGroupedView ? "bands" : "band variations"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                  <Button
                    variant={showGroupedView ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setShowGroupedView(true)}
                    className="h-7 px-3 text-xs"
                  >
                    Grouped
                  </Button>
                  <Button
                    variant={!showGroupedView ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setShowGroupedView(false)}
                    className="h-7 px-3 text-xs"
                  >
                    Detailed
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Downlink Band Class</TableHead>
                  <TableHead>Uplink Band Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayBands.map((band) => (
                  <TableRow key={band.id}>
                    <TableCell className="font-semibold">
                      {band.bandNumber}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-sm">
                      {band.dlBandClass || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {band.ulBandClass || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Supported Combos */}
      {selectedFields.combos && filteredCombos && filteredCombos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <CardTitle>Carrier Aggregation Combos</CardTitle>
              <Badge variant="outline">{filteredCombos.length} combos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Combo Name</TableHead>
                  <TableHead>Technology</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCombos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell className="font-semibold">
                      {combo.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{combo.technology}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {selectedFields.features &&
        device.features &&
        device.features.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-gray-600" />
                <CardTitle>Features</CardTitle>
                <Badge variant="outline">
                  {device.features.length} features
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {device.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900">
                      {feature.name}
                    </p>
                    {feature.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Empty state for filtered results */}
      {selectedFields.bands &&
        bandCount === 0 &&
        selectedFields.combos &&
        (!filteredCombos || filteredCombos.length === 0) &&
        selectedTechnologies.length > 0 && (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={Radio}
                title="No results for selected technologies"
                description="This device doesn't support the selected technologies"
              />
            </CardContent>
          </Card>
        )}
    </div>
  );
}
