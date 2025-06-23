-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create substation type enum
DO $$ 
BEGIN
  CREATE TYPE substation_type AS ENUM (
    'TRANSMISSION',
    'DISTRIBUTION',
    'SWITCHING',
    'STEP_UP',
    'STEP_DOWN',
    'COLLECTOR',
    'GRID_INTERCONNECTION',
    'CONSUMER',
    'MOBILE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create substation classification enum
DO $$ 
BEGIN
  CREATE TYPE substation_class AS ENUM (
    'PRIMARY',
    'SECONDARY',
    'GRID',
    'LOCAL',
    'INDUSTRIAL',
    'RURAL',
    'URBAN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the electricity_substation table
CREATE TABLE IF NOT EXISTS electricity_substation (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  substation_type substation_type NOT NULL,
  substation_class substation_class NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,

  -- Basic information
  primary_voltage_kv INTEGER NOT NULL, -- In kilovolts
  secondary_voltage_kv INTEGER NOT NULL, -- In kilovolts
  transformation_capacity_mva DECIMAL(10, 2) NOT NULL, -- In Mega Volt Amperes
  operational_status operational_status NOT NULL,
  commissioned_date DATE,
  ownership_type ownership_type NOT NULL,
  owner_organization TEXT,
  operator_organization TEXT,

  -- Technical specifications
  bus_configuration TEXT, -- e.g., "Single Bus", "Double Bus", "Ring Bus", etc.
  number_of_bays INTEGER,
  number_of_transformers INTEGER,
  transformer_details TEXT,
  has_capacitor_banks BOOLEAN DEFAULT FALSE,
  capacitor_banks_details TEXT,
  has_reactors BOOLEAN DEFAULT FALSE,
  reactors_details TEXT,
  has_switchgear BOOLEAN DEFAULT TRUE,
  switchgear_type TEXT, -- e.g., "AIS", "GIS", "Hybrid"
  breaker_count INTEGER,
  breaker_type TEXT, -- e.g., "Air", "Oil", "SF6", "Vacuum"
  disconnector_count INTEGER,
  has_earth_switch BOOLEAN DEFAULT TRUE,
  has_surge_arresters BOOLEAN DEFAULT TRUE,
  surge_arrester_details TEXT,
  has_metering_equipment BOOLEAN DEFAULT TRUE,
  metering_equipment_details TEXT,
  has_protection_relays BOOLEAN DEFAULT TRUE,
  protection_relays_type TEXT, -- e.g., "Electromechanical", "Numerical", "Digital"
  reliability_index DECIMAL(5, 2),

  -- Connectivity details
  incoming_feeders INTEGER,
  outgoing_feeders INTEGER,
  incoming_transmission_lines TEXT,
  outgoing_transmission_lines TEXT,
  connected_generation_sources TEXT,
  connected_substations TEXT,
  grid_connectivity BOOLEAN DEFAULT TRUE,
  isolation_capability BOOLEAN DEFAULT TRUE,

  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  has_boundary_wall BOOLEAN DEFAULT TRUE,
  has_control_building BOOLEAN DEFAULT TRUE,
  building_condition TEXT,
  construction_year INTEGER,
  last_renovated_year INTEGER,

  -- Control and monitoring
  control_type TEXT, -- e.g., "Manual", "Automated", "Semi-Automated"
  has_scada BOOLEAN DEFAULT FALSE,
  scada_system_details TEXT,
  has_remote_control BOOLEAN DEFAULT FALSE,
  has_distance_telemetry BOOLEAN DEFAULT FALSE,
  communication_system TEXT, -- e.g., "Fiber Optic", "Microwave", "PLC"
  has_dcs BOOLEAN DEFAULT FALSE, -- Distributed Control System
  automation_level TEXT,
  monitoring_parameters TEXT,

  -- Safety and security
  has_fire_protection BOOLEAN DEFAULT TRUE,
  fire_protection_system TEXT,
  has_lightning_protection BOOLEAN DEFAULT TRUE,
  lightning_protection_details TEXT,
  security_system TEXT,
  has_cctv BOOLEAN DEFAULT FALSE,
  has_perimeter_alarm BOOLEAN DEFAULT FALSE,
  has_manned_security BOOLEAN DEFAULT TRUE,
  security_personnel_count INTEGER,
  emergency_response_procedure BOOLEAN DEFAULT FALSE,
  safety_trainings TEXT,
  accident_history TEXT,

  -- Grounding and insulation
  grounding_system TEXT, -- e.g., "Grid", "Ring", "Radial"
  grounding_resistance_ohm DECIMAL(6, 2),
  insulation_coordination_level TEXT,
  basic_insulation_level_kv INTEGER,

  -- Power quality
  power_quality_monitoring BOOLEAN DEFAULT FALSE,
  harmonic_distortion_percent DECIMAL(5, 2),
  voltage_regulation_percent DECIMAL(5, 2),
  power_factor_correction BOOLEAN DEFAULT FALSE,
  power_factor_value DECIMAL(4, 2),

  -- Staff and management
  total_staff_count INTEGER,
  technical_staff_count INTEGER,
  administrative_staff_count INTEGER,
  security_staff_count INTEGER,
  operational_shifts INTEGER,
  staffing_per_shift INTEGER,

  -- Environmental aspects
  has_sound_proofing BOOLEAN DEFAULT FALSE,
  noise_level_db DECIMAL(5, 2),
  oil_containment_system BOOLEAN DEFAULT FALSE,
  oil_containment_details TEXT,
  pcb_status TEXT, -- Polychlorinated biphenyls status
  sf6_gas_amount_kg DECIMAL(8, 2),
  environmental_impact_assessment BOOLEAN DEFAULT FALSE,
  environmental_mitigation_measures TEXT,

  -- Maintenance
  maintenance_schedule TEXT,
  last_major_maintenance DATE,
  planned_outages TEXT,
  unplanned_outages TEXT,
  maintenance_responsibility TEXT, -- e.g., "Owner", "Contractor", "NEA"
  condition_monitoring_system TEXT,
  predictive_maintenance_capability BOOLEAN DEFAULT FALSE,

  -- Financial aspects
  total_project_cost_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(14, 2),
  annual_maintenance_cost_npr DECIMAL(14, 2),
  depreciation_schedule TEXT,
  asset_life_years INTEGER,

  -- Load details
  peak_load_mw DECIMAL(10, 2),
  average_load_mw DECIMAL(10, 2),
  load_factor DECIMAL(5, 2),
  load_growth_rate_percent DECIMAL(5, 2),
  load_profile TEXT,

  -- Outages and reliability
  annual_outage_hours DECIMAL(8, 2),
  planned_outage_hours DECIMAL(8, 2),
  unplanned_outage_hours DECIMAL(8, 2),
  saidi_minutes_per_year DECIMAL(8, 2), -- System Average Interruption Duration Index
  saifi_interruptions_per_year DECIMAL(6, 2), -- System Average Interruption Frequency Index
  main_failure_causes TEXT,

  -- Access and infrastructure
  access_road_condition TEXT,
  accessibility_details TEXT,
  nearest_town_distance_km DECIMAL(6, 2),
  available_transportation_modes TEXT,

  -- Utilities and amenities
  has_water_supply BOOLEAN DEFAULT TRUE,
  has_sanitation BOOLEAN DEFAULT TRUE,
  has_backup_power_supply BOOLEAN DEFAULT TRUE,
  backup_power_type TEXT, -- e.g., "Generator", "UPS", "Battery"
  has_staff_accommodation BOOLEAN DEFAULT FALSE,

  -- Contact information
  in_charge_person_name TEXT,
  contact_phone TEXT,
  emergency_contact_phone TEXT,
  email TEXT,

  -- Challenges and issues
  operational_challenges TEXT,
  technical_challenges TEXT,
  maintenance_challenges TEXT,
  security_challenges TEXT,

  -- Future development
  upgrade_plans TEXT,
  expansion_plans TEXT,
  future_capacity_mva DECIMAL(10, 2),

  -- Linkages to other entities
  linked_generation_centers JSONB DEFAULT '[]'::jsonb,
  linked_transformers JSONB DEFAULT '[]'::jsonb,
  linked_substations JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_area GEOMETRY(Polygon, 4326),
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
CREATE INDEX IF NOT EXISTS idx_substation_location_point 
ON electricity_substation USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_substation_facility_area 
ON electricity_substation USING GIST (facility_area);
CREATE INDEX IF NOT EXISTS idx_substation_service_area 
ON electricity_substation USING GIST (service_area_coverage);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_substation_name 
ON electricity_substation(name);
CREATE INDEX IF NOT EXISTS idx_substation_slug 
ON electricity_substation(slug);
CREATE INDEX IF NOT EXISTS idx_substation_type 
ON electricity_substation(substation_type);
CREATE INDEX IF NOT EXISTS idx_substation_class 
ON electricity_substation(substation_class);
CREATE INDEX IF NOT EXISTS idx_substation_status 
ON electricity_substation(operational_status);
CREATE INDEX IF NOT EXISTS idx_substation_ownership 
ON electricity_substation(ownership_type);
