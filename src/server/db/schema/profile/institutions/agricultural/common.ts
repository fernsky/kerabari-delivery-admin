import { pgEnum } from "drizzle-orm/pg-core";

// Define ownership type enum
export const ownershipTypeEnum = pgEnum("fish_farm_ownership_type", [
  "PRIVATE",
  "GOVERNMENT",
  "COMMUNITY",
  "COOPERATIVE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "MIXED",
]);
