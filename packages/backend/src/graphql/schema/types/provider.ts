import { builder } from "../builder";

// Provider type definition
export const ProviderType = builder.objectRef<{
  id: number;
  name: string;
  country: string;
  networkType: string;
}>("Provider");

ProviderType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      description: 'Provider name (e.g., "Telus", "Rogers")',
    }),
    country: t.exposeString("country"),
    networkType: t.exposeString("networkType", {
      description: 'Network type (e.g., "5G", "LTE")',
    }),
  }),
});
