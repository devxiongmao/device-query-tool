import {
  useGetProvidersQuery,
  useSearchDevicesQuery,
} from "../../graphql/generated/graphql";

export function TestCodegen() {
  // Test 1: Simple query with generated hook
  const {
    data: providersData,
    loading: providersLoading,
    error: providersError,
  } = useGetProvidersQuery();

  // Test 2: Query with variables
  const { data: devicesData, loading: devicesLoading } = useSearchDevicesQuery({
    variables: {
      vendor: "Apple",
      limit: 5,
    },
  });

  if (providersLoading || devicesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (providersError) {
    return (
      <div className="p-4 text-red-600">Error: {providersError.message}</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Providers (Generated Hook Test)
        </h2>
        <ul className="space-y-2">
          {providersData?.providers.map((provider) => (
            <li
              key={provider.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="font-medium">{provider.name}</span>
              <span className="text-sm text-gray-600">{provider.country}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Apple Devices (Generated Hook Test)
        </h2>
        <ul className="space-y-2">
          {devicesData?.devices.map((device) => (
            <li key={device.id} className="p-2 bg-gray-50 rounded">
              <div className="font-medium">
                {device.vendor} {device.modelNum}
              </div>
              <div className="text-sm text-gray-600">{device.marketName}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
