import { builder } from "./builder";

// Import all type definitions
import "./types/device";
import "./types/software";
import "./types/band";
import "./types/combo";
import "./types/feature";
import "./types/provider";
import "./types/junctions";
import "./types/capability-results";

// Import all query definitions
import "./queries/device.queries";
import "./queries/band.queries";
import "./queries/combo.queries";
import "./queries/feature.queries";
import "./queries/provider.queries";
import "./queries/capability.queries";

// Build and export the schema
export const schema = builder.toSchema();
