-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Disaster center type enum
DO $$ 
BEGIN
  CREATE TYPE disaster_center_type AS ENUM (
    'EMERGENCY_OPERATIONS_CENTER',
    'COORDINATION_CENTER',
    'EVACUATION_CENTER',
    'RELIEF_DISTRIBUTION_CENTER',
    'EARLY_WARNING_CENTER',
    'MULTIPURPOSE_DISASTER_CENTER',
    'FIRE_STATION',
    'SEARCH_AND_RESCUE_CENTER',
    'HEALTH_EMERGENCY_CENTER',
    'TRAINING_AND_AWARENESS_CENTER',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Disaster center management enum
DO $$ 
BEGIN
  CREATE TYPE disaster_center_management AS ENUM (
    'GOVERNMENT_MANAGED',
    'LOCAL_GOVERNMENT_MANAGED',
    'NGO_MANAGED',
    'RED_CROSS_MANAGED',
    'COMMUNITY_MANAGED',
    'JOINT_MANAGEMENT',
    'SECURITY_FORCES_MANAGED',
    'PRIVATE_SECTOR_MANAGED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Operational status enum
DO $$ 
BEGIN
  CREATE TYPE operational_status AS ENUM (
    'FULLY_OPERATIONAL',
    'PARTIALLY_OPERATIONAL',
    'UNDER_MAINTENANCE',
    'UNDER_CONSTRUCTION',
    'TEMPORARILY_CLOSED',
    'SEASONAL_OPERATION',
    'STANDBY_MODE',
    'OUT_OF_SERVICE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Facility condition enum
DO $$ 
BEGIN
  CREATE TYPE facility_condition AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'NEEDS_MAINTENANCE',
    'NEEDS_MAJOR_REPAIR',
    'POOR',
    'UNDER_RENOVATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Erosion severity enum
DO $$ 
BEGIN
  CREATE TYPE erosion_severity AS ENUM (
    'MINIMAL',
    'MILD',
    'MODERATE',
    'SEVERE',
    'EXTREME',
    'CATASTROPHIC'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Erosion status enum
DO $$ 
BEGIN
  CREATE TYPE erosion_status AS ENUM (
    'ACTIVE',
    'STABILIZED',
    'MITIGATED',
    'MONITORED',
    'WORSENING',
    'RECOVERING'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- River type enum
DO $$ 
BEGIN
  CREATE TYPE river_type AS ENUM (
    'MAJOR_RIVER',
    'MEDIUM_RIVER',
    'SMALL_RIVER',
    'STREAM',
    'TRIBUTARY',
    'SEASONAL_RIVER',
    'GLACIER_FED',
    'RAIN_FED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Landslide severity enum
DO $$ 
BEGIN
  CREATE TYPE landslide_severity AS ENUM (
    'VERY_LOW',
    'LOW',
    'MODERATE',
    'HIGH',
    'VERY_HIGH',
    'CATASTROPHIC'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Landslide status enum
DO $$ 
BEGIN
  CREATE TYPE landslide_status AS ENUM (
    'ACTIVE',
    'DORMANT',
    'STABILIZED',
    'MITIGATED',
    'MONITORED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Landslide type enum
DO $$ 
BEGIN
  CREATE TYPE landslide_type AS ENUM (
    'ROTATIONAL',
    'TRANSLATIONAL',
    'DEBRIS_FLOW',
    'ROCKFALL',
    'EARTHFLOW',
    'MUDFLOW',
    'CREEP',
    'COMPLEX',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Trigger mechanism enum
DO $$ 
BEGIN
  CREATE TYPE trigger_mechanism AS ENUM (
    'RAINFALL',
    'EARTHQUAKE',
    'SNOWMELT',
    'HUMAN_ACTIVITY',
    'EROSION',
    'VOLCANIC_ACTIVITY',
    'MULTIPLE_CAUSES',
    'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Flood severity enum
DO $$ 
BEGIN
  CREATE TYPE flood_severity AS ENUM (
    'MINOR',
    'MODERATE',
    'MAJOR',
    'SEVERE',
    'CATASTROPHIC'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Flood frequency enum
DO $$ 
BEGIN
  CREATE TYPE flood_frequency AS ENUM (
    'RARE',
    'OCCASIONAL',
    'FREQUENT',
    'ANNUAL',
    'SEASONAL',
    'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Flood cause enum
DO $$ 
BEGIN
  CREATE TYPE flood_cause AS ENUM (
    'HEAVY_RAINFALL',
    'RIVERINE_OVERFLOW',
    'FLASH_FLOOD',
    'GLACIAL_LAKE_OUTBURST',
    'DAM_FAILURE',
    'POOR_DRAINAGE',
    'STORM_SURGE',
    'SNOWMELT',
    'MULTIPLE_CAUSES',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest fire severity enum
DO $$ 
BEGIN
  CREATE TYPE forest_fire_severity AS ENUM (
    'LOW',
    'MODERATE',
    'HIGH',
    'VERY_HIGH',
    'EXTREME',
    'CATASTROPHIC'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest fire status enum
DO $$ 
BEGIN
  CREATE TYPE forest_fire_status AS ENUM (
    'ACTIVE',
    'CONTAINED',
    'CONTROLLED',
    'EXTINGUISHED',
    'MONITORING',
    'RECURRENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest fire cause enum
DO $$ 
BEGIN
  CREATE TYPE forest_fire_cause AS ENUM (
    'NATURAL_LIGHTNING',
    'HUMAN_NEGLIGENCE',
    'AGRICULTURE_BURNING',
    'INTENTIONAL',
    'ELECTRICAL_FAULT',
    'FOREST_MANAGEMENT',
    'UNCERTAIN',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest type enum
DO $$ 
BEGIN
  CREATE TYPE forest_type AS ENUM (
    'CONIFEROUS',
    'BROADLEAF',
    'MIXED',
    'SUBTROPICAL',
    'TEMPERATE',
    'ALPINE',
    'PLANTATION',
    'SHRUBLAND',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Fire incident type enum
DO $$ 
BEGIN
  CREATE TYPE fire_incident_type AS ENUM (
    'RESIDENTIAL_FIRE',
    'COMMERCIAL_FIRE',
    'INDUSTRIAL_FIRE',
    'FOREST_FIRE',
    'VEHICLE_FIRE',
    'ELECTRICAL_FIRE',
    'GAS_LEAKAGE_FIRE',
    'KITCHEN_FIRE',
    'STORAGE_FACILITY_FIRE',
    'PUBLIC_BUILDING_FIRE',
    'RELIGIOUS_BUILDING_FIRE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Fire incident severity enum
DO $$ 
BEGIN
  CREATE TYPE fire_incident_severity AS ENUM (
    'MINOR',
    'MODERATE',
    'MAJOR',
    'CATASTROPHIC'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
