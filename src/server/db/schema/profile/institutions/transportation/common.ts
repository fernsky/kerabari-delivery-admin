import { pgEnum } from "drizzle-orm/pg-core";

// Define drainage system enum
export const drainageSystemEnum = pgEnum("drainage_system", [
  "PROPER",
  "PARTIAL",
  "NONE",
  "BLOCKED",
]);
