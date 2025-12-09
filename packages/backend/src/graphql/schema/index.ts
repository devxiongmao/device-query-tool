import { builder } from "./builder";

// Import all type definitions
import "./types/device";
import "./types/software";
import "./types/band";
import "./types/combo";
import "./types/feature";
import "./types/provider";
import './types/junctions';
import "./types/capability-results";

// Build and export the schema
export const schema = builder.toSchema();
