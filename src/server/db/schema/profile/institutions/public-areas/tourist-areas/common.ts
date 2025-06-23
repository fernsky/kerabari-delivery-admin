import { pgEnum } from "drizzle-orm/pg-core";
import { accessibilityLevelEnum } from "../../common";

// Common enums for tourist attractions
export const attractionOwnershipEnum = pgEnum("attraction_ownership", [
  "GOVERNMENT_FEDERAL",
  "GOVERNMENT_PROVINCIAL",
  "GOVERNMENT_LOCAL",
  "COMMUNITY_MANAGED",
  "PRIVATE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "TRUST_MANAGED",
  "RELIGIOUS_ORGANIZATION",
  "NGO_MANAGED",
  "OTHER",
]);

export const attractionStatusEnum = pgEnum("attraction_status", [
  "OPERATIONAL",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "SEASONAL",
  "CLOSED_TEMPORARILY",
  "CLOSED_PERMANENTLY",
  "PLANNED",
]);

export const attractionSizeEnum = pgEnum("attraction_size", [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
]);

export const tourismSeasonEnum = pgEnum("tourism_season", [
  "YEAR_ROUND",
  "SUMMER",
  "WINTER",
  "SPRING",
  "AUTUMN",
  "MONSOON",
  "DRY_SEASON",
  "FESTIVAL_PERIOD",
  "SPECIFIC_MONTHS",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_MAINTENANCE",
]);

export const attractionCrowdLevelEnum = pgEnum("attraction_crowd_level", [
  "USUALLY_QUIET",
  "MODERATELY_BUSY",
  "BUSY_ON_WEEKENDS",
  "CROWDED",
  "OVERCROWDED_SEASONALLY",
  "VARIES_BY_SEASON",
]);

export const entranceFeeTypeEnum = pgEnum("entrance_fee_type", [
  "FREE",
  "PAID",
  "DONATION_BASED",
  "MEMBERSHIP_REQUIRED",
  "DIFFERENT_RATES",
  "SPECIAL_EVENTS_ONLY",
]);

export const visitorExperienceLevelEnum = pgEnum("visitor_experience_level", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "BELOW_AVERAGE",
  "POOR",
]);

export { accessibilityLevelEnum } from "../../common";

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
