import {
  useDevicesByBandQuery,
  useDevicesByBandProviderQuery,
  useDevicesByComboQuery,
  useDevicesByComboProviderQuery,
  useDevicesByFeatureProviderQuery,
  useDevicesByFeatureQuery,
} from "../../../graphql/generated/graphql";
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
import { Smartphone } from "lucide-react";
import { formatDate } from "../../../lib/utils";
import type { CapabilityType } from "./CapabilityTypeSelector";
import type { CapabilityDisplayFields } from "./DeviceFieldSelector";

interface CapabilityResultsProps {
  capabilityType: CapabilityType;
  capabilityId: string;
  providerId: string | null;
  displayFields: CapabilityDisplayFields;
}

export function CapabilityResults({
  capabilityType,
  capabilityId,
  providerId,
  displayFields,
}: CapabilityResultsProps) {
  // Determine which query to use based on capability type and provider
  const useBandQuery = providerId
    ? useDevicesByBandProviderQuery
    : useDevicesByBandQuery;
  const useComboQuery = providerId
    ? useDevicesByComboProviderQuery
    : useDevicesByComboQuery;
  const useFeatureQuery = providerId
    ? useDevicesByFeatureProviderQuery
    : useDevicesByFeatureQuery;

  // Execute the appropriate query
  const bandResult = useBandQuery({
    variables: {
      bandId: capabilityId,
      ...(providerId && { providerId }),
    },
    skip: capabilityType !== "band",
  });

  const comboResult = useComboQuery({
    variables: {
      comboId: capabilityId,
      ...(providerId && { providerId }),
    },
    skip: capabilityType !== "combo",
  });

  const featureResult = useFeatureQuery({
    variables: {
      featureId: capabilityId,
      ...(providerId && { providerId }),
    },
    skip: capabilityType !== "feature",
  });

  // Get the relevant result
  const { data, loading, error } =
    capabilityType === "band"
      ? bandResult
      : capabilityType === "combo"
      ? comboResult
      : featureResult;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <Spinner size="lg" className="mx-auto" />
          <p className="text-center text-gray-600 mt-4">
            Searching for devices...
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
            title="Error loading results"
            description={error.message}
          />
        </CardContent>
      </Card>
    );
  }

  // Get results array based on capability type
  const results =
    (capabilityType === "band" && "devicesByBand" in data
      ? data.devicesByBand
      : null) ||
    (capabilityType === "combo" && "devicesByCombo" in data
      ? data.devicesByCombo
      : null) ||
    (capabilityType === "feature" && "devicesByFeature" in data
      ? data.devicesByFeature
      : null) ||
    [];

    console.log(results)

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            icon={Smartphone}
            title="No devices found"
            description={
              providerId
                ? "No devices support this capability for the selected provider"
                : "No devices found with this capability"
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Devices Found</CardTitle>
            <Badge variant="outline">
              {results.length} device{results.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <Badge variant={providerId ? "default" : "secondary"}>
            {providerId ? "Provider-Specific" : "Global Support"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Model</TableHead>
              {displayFields.marketName && <TableHead>Market Name</TableHead>}
              {displayFields.releaseDate && <TableHead>Release Date</TableHead>}
              {displayFields.softwareDetails && <TableHead>Software</TableHead>}
              <TableHead>Support Status</TableHead>
              {providerId && <TableHead>Provider</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={`${result.device.id}-${index}`}>
                <TableCell className="font-semibold">
                  {result.device.vendor}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {result.device.modelNum}
                </TableCell>
                {displayFields.marketName && (
                  <TableCell>{result.device.marketName || "-"}</TableCell>
                )}
                {displayFields.releaseDate && (
                  <TableCell className="text-sm">
                    {formatDate(result.device.releaseDate)}
                  </TableCell>
                )}
                {displayFields.softwareDetails && (
                  <TableCell>
                    {result.software && result.software.length > 0 ? (
                      <div className="space-y-1">
                        {result.software.map((sw) => (
                          <div key={sw.id} className="text-sm">
                            <span className="font-medium">{sw.name}</span>
                            {sw.buildNumber && (
                              <span className="text-gray-500 ml-2 font-mono text-xs">
                                ({sw.buildNumber})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Badge
                    variant={
                      result.supportStatus === "global" ? "success" : "default"
                    }
                  >
                    {result.supportStatus}
                  </Badge>
                </TableCell>
                {providerId && result.provider && (
                  <TableCell>{result.provider.name}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
