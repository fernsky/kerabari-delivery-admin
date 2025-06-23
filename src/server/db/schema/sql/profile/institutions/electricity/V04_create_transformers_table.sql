-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create transformer type enum
DO $$ 
BEGIN
  CREATE TYPE transformer_type AS ENUM (
    'DISTRIBUTION',
    'POWER',
    'AUTO',
    'STEP_UP',
    'STEP_DOWN',
    'ISOLATING',
    'INSTRUMENT',
    'CURRENT',
    'VOLTAGE',
    'POLE_MOUNTED',
    'PAD_MOUNTED',
    'GROUNDING',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create transformer cooling enum
DO $$ 
BEGIN
  CREATE TYPE transformer_cooling AS ENUM (
    'OIL_NATURAL_AIR_NATURAL', -- ONAN
    'OIL_NATURAL_AIR_FORCED', -- ONAF
    'OIL_FORCED_AIR_FORCED', -- OFAF
    'OIL_FORCED_WATER_FORCED', -- OFWF
    'DRY_TYPE',
    'CAST_RESIN',
    'SEALED',
    'NON_SEALED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create insulation type enum
DO $$ 
BEGIN
  CREATE TYPE insulation_type AS ENUM (
    'OIL_IMMERSED',
    'DRY_TYPE',
    'SF6_GAS',
    'AIR_CORE',
    'VACUUM',
    'RESIN_IMPREGNATED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the electricity_transformer table
CREATE TABLE IF NOT EXISTS electricity_transformer (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  transformer_type transformer_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  installed_at_substation_id VARCHAR(36),
  installed_at_substation_name TEXT,
  is_pole_mount BOOLEAN DEFAULT FALSE,
  is_ground_mount BOOLEAN DEFAULT FALSE,
  has_dedicated_enclosure BOOLEAN DEFAULT FALSE,

  -- Basic information
  serial_number VARCHAR(100),
  manufacturer TEXT,
  manufacturing_year INTEGER,
  capacity_kva DECIMAL(10, 2) NOT NULL, -- In Kilo Volt Amperes
  primary_voltage_v INTEGER NOT NULL, -- In volts
  secondary_voltage_v INTEGER NOT NULL, -- In volts
  tertiary_voltage_v INTEGER, -- In volts (if applicable)
  phases INTEGER NOT NULL, -- Usually 1 or 3
  frequency_hz INTEGER NOT NULL, -- In Hertz, typically 50 or 60
  operational_status operational_status NOT NULL,
  installation_date DATE,
  commissioned_date DATE,
  ownership_type ownership_type NOT NULL,
  owner_organization TEXT,
  operator_organization TEXT,

  -- Technical specifications
  impedance_percent DECIMAL(5, 2),
  cooling_type transformer_cooling NOT NULL,
  insulation_type insulation_type NOT NULL,
  insulation_class TEXT, -- e.g., "A", "B", "F", "H"
  temperature_rise_limit_celsius INTEGER, -- In degrees Celsius
  vector_group TEXT, -- e.g., "Dyn11", "YNyn0", etc.
  tap_changer_type TEXT, -- e.g., "OLTC", "DETC", "None"
  tap_positions INTEGER,
  tap_range TEXT, -- e.g., "+/- 10%"
  no_load_losses_watts DECIMAL(10, 2),
  load_losses_watts DECIMAL(10, 2),
  efficiency_percent DECIMAL(5, 2),
  weight_kg DECIMAL(10, 2),
  oil_weight_kg DECIMAL(10, 2),
  oil_type TEXT, -- e.g., "Mineral", "Synthetic", "Bio-degradable"
  has_bushings BOOLEAN DEFAULT TRUE,
  bushing_type TEXT,
  has_conservator BOOLEAN DEFAULT FALSE,
  has_breather_system BOOLEAN DEFAULT FALSE,
  has_buchholz_relay BOOLEAN DEFAULT FALSE,
  has_pressure_relief_device BOOLEAN DEFAULT FALSE,
  has_oil_level_indicator BOOLEAN DEFAULT FALSE,
  has_temperature_indicator BOOLEAN DEFAULT FALSE,
  has_cooling_fans BOOLEAN DEFAULT FALSE,
  has_oil_pump BOOLEAN DEFAULT FALSE,

  -- Protection devices
  has_fuses BOOLEAN DEFAULT FALSE,
  fuse_rating TEXT,
  has_circuit_breaker BOOLEAN DEFAULT FALSE,
  circuit_breaker_type TEXT,
  has_lightning_arresters BOOLEAN DEFAULT FALSE,
  lightning_arrester_type TEXT,
  has_earthing_protection BOOLEAN DEFAULT TRUE,
  earthing_details TEXT,
  has_overload_protection BOOLEAN DEFAULT TRUE,
  has_short_circuit_protection BOOLEAN DEFAULT TRUE,

  -- Metering and monitoring
  has_meter BOOLEAN DEFAULT FALSE,
  meter_type TEXT,
  has_remote_monitoring BOOLEAN DEFAULT FALSE,
  monitoring_parameters TEXT, -- e.g., "Temperature, Oil level, Load"
  has_alarm_system BOOLEAN DEFAULT FALSE,
  alarm_system_details TEXT,

  -- Load details
  maximum_load_kva DECIMAL(10, 2),
  average_load_kva DECIMAL(10, 2),
  load_factor_percent DECIMAL(5, 2),
  number_of_consumers INTEGER,
  peak_load_time TEXT, -- e.g., "Evening 6-8 PM"
  load_profile TEXT,

  -- Maintenance
  maintenance_schedule TEXT,
  last_maintenance_date DATE,
  maintenance_responsibility TEXT, -- e.g., "NEA", "Local Authority", "Private Contractor"
  oil_test_frequency TEXT, -- e.g., "Annual", "Bi-annual"
  last_oil_test DATE,
  oil_condition TEXT,
  insulation_resistance_mega_ohms DECIMAL(10, 2),
  last_insulation_test DATE,

  -- Financial aspects
  acquisition_cost_npr DECIMAL(14, 2),
  installation_cost_npr DECIMAL(14, 2),
  annual_maintenance_cost_npr DECIMAL(14, 2),
  depreciation TEXT, -- Depreciation method or rate
  estimated_life_years INTEGER,
  remaining_life_years INTEGER,

  -- Environmental aspects
  environmentally_certified BOOLEAN DEFAULT FALSE,
  environmental_certification_type TEXT,
  pcb_free BOOLEAN DEFAULT TRUE, -- Polychlorinated biphenyls
  containment_system BOOLEAN DEFAULT FALSE, -- For oil leakages
  containment_details TEXT,
  noise_level_db DECIMAL(5, 2),

  -- Safety and security
  fenced_enclosure BOOLEAN DEFAULT FALSE,
  locked_enclosure BOOLEAN DEFAULT FALSE,
  warning_signs_posted BOOLEAN DEFAULT TRUE,
  security_measures TEXT,
  fire_protection TEXT,
  accident_history TEXT,

  -- Service area
  residential_area_served BOOLEAN DEFAULT FALSE,
  commercial_area_served BOOLEAN DEFAULT FALSE,
  industrial_area_served BOOLEAN DEFAULT FALSE,
  service_area_description TEXT,
  households_served INTEGER,

  -- Contact information
  responsible_person_name TEXT,
  contact_phone TEXT,
  emergency_contact_phone TEXT,
  email TEXT,

  -- Issues and challenges
  operational_issues TEXT,
  overloading_issues BOOLEAN DEFAULT FALSE,
  voltage_fluctuation_issues BOOLEAN DEFAULT FALSE,
  frequent_failures BOOLEAN DEFAULT FALSE,
  failure_causes TEXT,

  -- Future plans
  replacement_planned BOOLEAN DEFAULT FALSE,
  planned_replacement_year INTEGER,
  upgrade_planned BOOLEAN DEFAULT FALSE,
  planned_upgrade_capacity_kva DECIMAL(10, 2),

  -- Linkages to other entities
  linked_substation JSONB DEFAULT '[]'::jsonb,
  linked_poles JSONB DEFAULT '[]'::jsonb,
  linked_feeders JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  service_area_coverage GEOMETRY(MultiPolygon, 4326),

  -- Status and metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_transformer_location_point 
ON electricity_transformer USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_transformer_service_area 
ON electricity_transformer USING GIST (service_area_coverage);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_transformer_name 
ON electricity_transformer(name);
CREATE INDEX IF NOT EXISTS idx_transformer_slug 
ON electricity_transformer(slug);
CREATE INDEX IF NOT EXISTS idx_transformer_type 
ON electricity_transformer(transformer_type);
CREATE INDEX IF NOT EXISTS idx_transformer_status 
ON electricity_transformer(operational_status);
CREATE INDEX IF NOT EXISTS idx_transformer_ownership 
ON electricity_transformer(ownership_type);
CREATE INDEX IF NOT EXISTS idx_transformer_substation 
ON electricity_transformer(installed_at_substation_id);
