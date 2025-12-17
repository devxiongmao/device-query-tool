import { useGetDeviceCompleteQuery } from "../../../graphql/generated/graphql";
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
} from "../../../components/ui";
import { Smartphone, Calendar, Code, Radio, Zap, Settings } from "lucide-react";
import { formatDate } from "../../../lib/utils";
import type { SelectedFields } from "./FieldSelector";

interface DeviceResultsProps {
  deviceId: string;
  providerId: string | null;
  selectedTechnologies: string[];
  selectedFields: SelectedFields;
}

export function DeviceResults({
  deviceId,
  providerId,
  selectedTechnologies,
  selectedFields,
}: DeviceResultsProps) {
  const { data, loading, error } = useGetDeviceCompleteQuery({
    variables: {
      id: deviceId,
      providerId: providerId || undefined,
      bandTechnology:
        selectedTechnologies.length === 1 ? selectedTechnologies[0] : undefined,
      comboTechnology:
        selectedTechnologies.length === 1 ? selectedTechnologies[0] : undefined,
    },
  });

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

  const device = data.device;

  // Filter bands by selected technologies
  const filteredBands =
    selectedTechnologies.length > 0
      ? device.supportedBands?.filter((band) =>
          selectedTechnologies.includes(band.technology)
        )
      : device.supportedBands;

  const filteredCombos =
    selectedTechnologies.length > 0
      ? device.supportedCombos?.filter((combo) =>
          selectedTechnologies.includes(combo.technology)
        )
      : device.supportedCombos;

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
                    Released {formatDate(device.releaseDate)}
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
                      <TableCell>{formatDate(sw.releaseDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      {/* Supported Bands */}
      {selectedFields.bands && filteredBands && filteredBands.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-gray-600" />
              <CardTitle>Supported Bands</CardTitle>
              <Badge variant="outline">{filteredBands.length} bands</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Frequency Range</TableHead>
                  <TableHead>Band Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBands.map((band) => (
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
                      {band.dlBandClass}
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
                  <TableHead>Component Bands</TableHead>
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
                    <TableCell>
                      {/* We'll need to query bands separately or use a fragment */}
                      <span className="text-sm text-gray-600">-</span>
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
        (!filteredBands || filteredBands.length === 0) &&
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
