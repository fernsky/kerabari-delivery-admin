import { pgEnum } from "drizzle-orm/pg-core";

export const accessibilityLevelEnum = pgEnum("accessibility_level", [
  "EASILY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "DIFFICULT_ACCESS",
  "CHALLENGING_ACCESS",
  "RESTRICTED_ACCESS",
  "ACCESSIBLE_FOR_DISABLED",
]);

// Define building condition enum
export const buildingConditionEnum = pgEnum("building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define usage frequency enum
export const usageFrequencyEnum = pgEnum("usage_frequency", [
  "DAILY",
  "SEVERAL_TIMES_WEEKLY",
  "WEEKLY",
  "MONTHLY",
  "OCCASIONALLY",
  "SEASONALLY",
  "RARELY",
  "NOT_IN_USE",
]);

// Define water quality enum
export const waterQualityEnum = pgEnum("water_quality", [
  "EXCELLENT",
  "GOOD",
  "ACCEPTABLE",
  "POOR",
  "VERY_POOR",
  "UNTESTED",
]);

// Define environmental impact level enum
export const environmentalImpactLevelEnum = pgEnum(
  "environmental_impact_level",
  ["HIGH", "MODERATE", "LOW", "MINIMAL", "UNKNOWN", "MONITORED"],
);
