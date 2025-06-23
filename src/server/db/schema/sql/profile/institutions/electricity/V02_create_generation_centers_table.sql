-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the electricity_generation_center table
CREATE TABLE IF NOT EXISTS electricity_generation_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  generation_type generation_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  river_basin TEXT, -- For hydropower
  river_name TEXT, -- For hydropower

  -- Basic information
  capacity_mw DECIMAL(10, 3) NOT NULL, -- In Megawatts
  operational_status operational_status NOT NULL,
  commissioned_date DATE,
  license_number VARCHAR(50),
  licensing_authority TEXT,
  license_issue_date DATE,
  license_expiry_date DATE,
  ownership_type ownership_type NOT NULL,
  owner_organization TEXT,
  operator_organization TEXT,

  -- Technical specifications
  design_discharge_cumecs DECIMAL(10, 3), -- For hydropower, cubic meters per second
  gross_head_m DECIMAL(10, 2), -- For hydropower, in meters
  net_head_m DECIMAL(10, 2), -- For hydropower, in meters
  turbine_type TEXT, -- For hydropower (e.g., Francis, Pelton, Kaplan)
  turbine_count INTEGER,
  generator_capacity_kva DECIMAL(10, 2),
  generator_type TEXT,
  generator_count INTEGER,
  transformer_count INTEGER,
  main_transformer_capacity_mva DECIMAL(10, 2),
  has_reservoir BOOLEAN DEFAULT FALSE, -- For hydropower
  reservoir_capacity_million_cubic_meters DECIMAL(12, 3),
  has_dam BOOLEAN DEFAULT FALSE, -- For hydropower
  dam_height_m DECIMAL(8, 2), -- For hydropower, in meters
  dam_length_m DECIMAL(8, 2), -- For hydropower, in meters
  dam_type TEXT, -- For hydropower
  canal_length_meters DECIMAL(10, 2), -- For hydropower
  has_penstock BOOLEAN DEFAULT FALSE, -- For hydropower
  penstock_length_meters DECIMAL(10, 2), -- For hydropower
  penstock_diameter_meters DECIMAL(6, 2), -- For hydropower
  penstock_material TEXT, -- For hydropower
  design_efficiency_percent DECIMAL(5, 2),

  -- For micro-hydro
  is_micro_hydro BOOLEAN DEFAULT FALSE,
  service_area_details TEXT,
  households_served INTEGER,
  beneficiary_population INTEGER,
  community_contribution TEXT,

  -- Power generation and transmission
  annual_generation_gwh DECIMAL(12, 3), -- Gigawatt-hours
  design_energy_gwh DECIMAL(12, 3), -- Gigawatt-hours
  power_factor_percent DECIMAL(5, 2),
  grid_connected BOOLEAN DEFAULT TRUE,
  voltage_level_kv INTEGER NOT NULL, -- In kilovolts
  transmission_line_details TEXT,
  transmission_line_length_km DECIMAL(8, 2),
  interconnection_substation TEXT,

  -- Environmental aspects
  environmental_impact_assessment BOOLEAN DEFAULT FALSE,
  environmental_mitigation_measures TEXT,
  minimum_flow_release_percent DECIMAL(5, 2), -- For hydropower
  fish_ladder BOOLEAN DEFAULT FALSE, -- For hydropower
  tree_planting_compensation INTEGER, -- Number of trees
  carbon_offset_tons_per_year DECIMAL(10, 2),

  -- Staff and management
  total_staff_count INTEGER,
  technical_staff_count INTEGER,
  administrative_staff_count INTEGER,
  security_staff_count INTEGER,
  local_employment_count INTEGER,

  -- Financial aspects
  total_project_cost_npr DECIMAL(18, 2),
  annual_revenue_million_npr DECIMAL(14, 2),
  power_purchase_agreement BOOLEAN DEFAULT FALSE,
  power_purchase_rate_npr_per_unit DECIMAL(8, 4),
  power_purchase_agreement_expiry_date DATE,
  royalty_payment_million_npr DECIMAL(14, 2),

  -- Safety and security
  has_security_system BOOLEAN DEFAULT TRUE,
  security_system_details TEXT,
  has_fire_safety_measures BOOLEAN DEFAULT TRUE,
  fire_safety_details TEXT,
  emergency_response_plan BOOLEAN DEFAULT FALSE,
  safety_trainings TEXT,
  has_accident_history BOOLEAN DEFAULT FALSE,
  accident_details TEXT,

  -- Operation and maintenance
  maintenance_schedule TEXT,
  last_major_maintenance DATE,
  planned_outages TEXT,
  performance_issues TEXT,
  upgrade_plans TEXT,
  refurbishment_history TEXT,

  -- Community relations
  local_benefit_sharing_mechanism TEXT,
  community_development_programs TEXT,
  local_complaint_mechanism TEXT,
  corporate_social_responsibility TEXT,

  -- Access and infrastructure
  access_road_condition TEXT,
  accessibility_details TEXT,
  nearest_town_distance_km DECIMAL(6, 2),

  -- Monitoring and automation
  has_scada BOOLEAN DEFAULT FALSE,
  automation_level TEXT,
  remote_operation_capability BOOLEAN DEFAULT FALSE,
  monitoring_system TEXT,

  -- Contact information
  plant_manager_name TEXT,
  contact_phone TEXT,
  emergency_contact_phone TEXT,
  email TEXT,
  website_url TEXT,

  -- Challenges and issues
  operational_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  technical_challenges TEXT,

  -- Future development
  expansion_plans TEXT,
  future_capacity_mw DECIMAL(10, 3),
  rehabilitation_needs TEXT,

  -- Linkages to other entities
  linked_substations JSONB DEFAULT '[]'::jsonb,
  linked_transformers JSONB DEFAULT '[]'::jsonb,
  linked_water_bodies JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_area GEOMETRY(Polygon, 4326),
  reservoir_area GEOMETRY(Polygon, 4326),
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
CREATE INDEX IF NOT EXISTS idx_generation_center_location_point 
ON electricity_generation_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_generation_center_facility_area 
ON electricity_generation_center USING GIST (facility_area);
CREATE INDEX IF NOT EXISTS idx_generation_center_reservoir_area 
ON electricity_generation_center USING GIST (reservoir_area);
CREATE INDEX IF NOT EXISTS idx_generation_center_service_area 
ON electricity_generation_center USING GIST (service_area_coverage);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_generation_center_name 
ON electricity_generation_center(name);
CREATE INDEX IF NOT EXISTS idx_generation_center_slug 
ON electricity_generation_center(slug);
CREATE INDEX IF NOT EXISTS idx_generation_center_type 
ON electricity_generation_center(generation_type);
CREATE INDEX IF NOT EXISTS idx_generation_center_status 
ON electricity_generation_center(operational_status);
CREATE INDEX IF NOT EXISTS idx_generation_center_ownership 
ON electricity_generation_center(ownership_type);
