import { builder } from "../builder";
import { DeviceType } from "./device";

// Software type definition
export const SoftwareType = builder.objectRef<{
  id: number;
  name: string;
  platform: string;
  ptcrb: number | null;
  svn: number | null;
  buildNumber: string | null;
  releaseDate: string;
  deviceId: number;
}>("Software");

SoftwareType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    platform: t.exposeString("platform", {
      description: "Operating system platform (iOS, Android, etc.)",
    }),
    ptcrb: t.exposeInt("ptcrb", { nullable: true }),
    svn: t.exposeInt("svn", { nullable: true }),
    buildNumber: t.exposeString("buildNumber", { nullable: true }),
    releaseDate: t.expose("releaseDate", { type: "DateTime" }),

    // Relationships
    device: t.field({
      type: DeviceType,
      description: "The device this software runs on",
      resolve: async (_software, _args, _ctx) => {
        // Will implement with DataLoader
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
  }),
});
