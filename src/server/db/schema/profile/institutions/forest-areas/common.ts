import { pgEnum } from "drizzle-orm/pg-core";

// Define forest condition enum
export const forestConditionEnum = pgEnum("forest_condition", [
  "PRISTINE",
  "WELL_MAINTAINED",
  "MODERATELY_DEGRADED",
  "HEAVILY_DEGRADED",
  "UNDER_RESTORATION",
  "PLANTATION",
  "MIXED",
]);

// Define forest management status enum
export const forestManagementStatusEnum = pgEnum("forest_management_status", [
  "WELL_MANAGED",
  "MODERATELY_MANAGED",
  "POORLY_MANAGED",
  "UNMANAGED",
  "UNDER_DEVELOPMENT",
]);

// Define biodiversity level enum
export const biodiversityLevelEnum = pgEnum("biodiversity_level", [
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "VERY_LOW",
]);

// Define fire risk level enum
export const fireRiskLevelEnum = pgEnum("fire_risk_level", [
  "EXTREME",
  "HIGH",
  "MODERATE",
  "LOW",
  "MINIMAL",
]);

// Define forest density enum
export const forestDensityEnum = pgEnum("forest_density", [
  "VERY_DENSE",
  "DENSE",
  "MODERATE",
  "SPARSE",
  "VERY_SPARSE",
  "OPEN",
]);

// Define topography type enum
export const topographyTypeEnum = pgEnum("topography_type", [
  "FLAT",
  "GENTLE_SLOPE",
  "MODERATE_SLOPE",
  "STEEP",
  "VERY_STEEP",
  "MOUNTAINOUS",
  "MIXED",
]);

// Define ecosystem type enum
export const ecosystemTypeEnum = pgEnum("ecosystem_type", [
  "TROPICAL",
  "SUBTROPICAL",
  "TEMPERATE",
  "ALPINE",
  "GRASSLAND",
  "WETLAND",
  "RIPARIAN",
  "MIXED",
]);

// Define accessibility level enum
export const forestAccessibilityEnum = pgEnum("forest_accessibility", [
  "HIGHLY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "DIFFICULT_ACCESS",
  "REMOTE",
  "VERY_REMOTE",
]);

// Define land tenure status
export const landTenureEnum = pgEnum("land_tenure", [
  "REGISTERED",
  "UNREGISTERED",
  "DISPUTED",
  "COMMUNAL",
  "PUBLIC",
  "PRIVATE",
  "TRUST",
  "LEASED",
  "OTHER",
]);
