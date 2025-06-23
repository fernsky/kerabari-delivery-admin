-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define landfill_site_type enum
DO $$
BEGIN
  CREATE TYPE landfill_site_type AS ENUM (
    'SANITARY_LANDFILL', 'CONTROLLED_DUMP', 'ENGINEERED_LANDFILL', 'BIOREACTOR_LANDFILL',
    'SECURE_LANDFILL', 'CONSTRUCTION_DEBRIS_LANDFILL', 'TEMPORARY_LANDFILL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define landfill_site_status enum
DO $$
BEGIN
  CREATE TYPE landfill_site_status AS ENUM (
    'OPERATIONAL', 'PLANNED', 'UNDER_CONSTRUCTION', 'CLOSED', 'POST_CLOSURE_MONITORING',
    'FULL', 'ABANDONED', 'TEMPORARY_CLOSED', 'REMEDIATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define waste_type enum
DO $$
BEGIN
  CREATE TYPE waste_type AS ENUM (
    'MUNICIPAL_SOLID_WASTE', 'CONSTRUCTION_DEBRIS', 'INDUSTRIAL_NON_HAZARDOUS', 'HAZARDOUS_WASTE',
    'BIOMEDICAL_WASTE', 'MIXED_WASTE', 'INERT_WASTE', 'ORGANIC_WASTE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define operation_frequency enum
DO $$
BEGIN
  CREATE TYPE operation_frequency AS ENUM (
    'DAILY', 'WEEKDAYS_ONLY', 'SPECIFIC_DAYS', 'SEASONAL', 'ON_DEMAND', 'IRREGULAR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define liner_type enum
DO $$
BEGIN
  CREATE TYPE liner_type AS ENUM (
    'CLAY', 'GEOMEMBRANE', 'COMPOSITE_LINER', 'GCL', 'HDPE', 'NONE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define environmental_impact_level enum
DO $$
BEGIN
  CREATE TYPE environmental_impact_level AS ENUM (
    'LOW', 'MODERATE', 'HIGH', 'SEVERE', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the landfill_site table
CREATE TABLE IF NOT EXISTS acme_landfill_site (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  landfill_type landfill_site_type NOT NULL,
  status landfill_site_status NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,

  -- Basic information
  established_year INTEGER,
  planned_closure_year INTEGER,
  actual_closure_year INTEGER,
  operator_name TEXT,
  operator_type TEXT,
  license_number VARCHAR(100),
  licensing_authority TEXT,
  license_issue_date DATE,
  license_expiry_date DATE,
  environmental_clearance_number VARCHAR(100),
  environmental_clearance_date DATE,
  has_eia BOOLEAN DEFAULT false,
  eia_details TEXT,

  -- Site specifications
  total_area_sq_m DECIMAL(14,2),
  total_active_area_sq_m DECIMAL(14,2),
  total_cell_count INTEGER,
  active_cell_count INTEGER,
  closed_cell_count INTEGER,
  total_capacity_tons DECIMAL(14,2),
  remaining_capacity_tons DECIMAL(14,2),
  estimated_remaining_life_years DECIMAL(5,2),
  maximum_height_m DECIMAL(8,2),
  waste_depth_m DECIMAL(8,2),

  -- Waste specifications
  accepted_waste_types JSONB DEFAULT '[]'::jsonb,
  primary_waste_type waste_type,
  daily_waste_receipt_tons DECIMAL(10,2),
  annual_waste_receipt_tons DECIMAL(14,2),
  waste_compaction_density_kg_m3 DECIMAL(8,2),
  waste_diversion_percentage DECIMAL(5,2),
  has_waste_sorting BOOLEAN DEFAULT false,
  waste_sorting_method TEXT,
  has_recycling_program BOOLEAN DEFAULT false,
  recycling_details TEXT,
  has_composting_program BOOLEAN DEFAULT false,
  composting_details TEXT,

  -- Technical specifications
  has_liner BOOLEAN DEFAULT false,
  liner_type liner_type,
  liner_thickness_mm DECIMAL(6,2),
  has_leachate_collection BOOLEAN DEFAULT false,
  leachate_collection_system TEXT,
  leachate_treatment_method TEXT,
  leachate_generation_litres_day DECIMAL(10,2),
  has_gas_collection BOOLEAN DEFAULT false,
  gas_collection_system TEXT,
  gas_utilization_method TEXT,
  methane_generation_estimate_m3_day DECIMAL(10,2),
  has_energy_generation BOOLEAN DEFAULT false,
  energy_generation_capacity_kw DECIMAL(10,2),
  has_groundwater_monitoring BOOLEAN DEFAULT false,
  monitoring_well_count INTEGER,
  has_surface_water_monitoring BOOLEAN DEFAULT false,
  has_gas_monitoring BOOLEAN DEFAULT false,
  has_settlement_monitoring BOOLEAN DEFAULT false,
  has_final_cover BOOLEAN DEFAULT false,
  final_cover_type TEXT,
  final_cover_thickness_cm DECIMAL(6,2),
  has_daily_cover BOOLEAN DEFAULT false,
  daily_cover_material TEXT,

  -- Environmental factors
  distance_to_nearest_settlement_m DECIMAL(10,2),
  distance_to_nearest_water_body_m DECIMAL(10,2),
  distance_to_nearest_aquifer_m DECIMAL(10,2),
  depth_to_groundwater_m DECIMAL(8,2),
  annual_rainfall_mm DECIMAL(8,2),
  flood_risk TEXT,
  has_flood_control BOOLEAN DEFAULT false,
  flood_control_measures TEXT,
  soil_type TEXT,
  geological_formation TEXT,
  environmental_impact_level environmental_impact_level,
  known_contamination_issues TEXT,
  remediation_efforts TEXT,

  -- Operations
  operating_hours TEXT,
  operation_frequency operation_frequency,
  equipment_on_site TEXT,
  vehicle_count INTEGER,
  staff_count INTEGER,
  has_weighbridge BOOLEAN DEFAULT false,
  weighbridge_details TEXT,
  waste_tracking_system TEXT,
  maintenance_schedule TEXT,
  operational_challenges TEXT,

  -- Safety and security
  has_fencing BOOLEAN DEFAULT false,
  fencing_type TEXT,
  has_gate BOOLEAN DEFAULT false,
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  has_fire_control_system BOOLEAN DEFAULT false,
  fire_control_details TEXT,
  has_emergency_response_plan BOOLEAN DEFAULT false,
  emergency_response_details TEXT,
  has_health_safety_procedures BOOLEAN DEFAULT false,
  onsite_accident_history TEXT,
  has_pest_control BOOLEAN DEFAULT false,
  pest_control_measures TEXT,

  -- Community relations
  distance_to_nearest_community_km DECIMAL(6,2),
  community_consultation_process TEXT,
  has_received_complaints BOOLEAN DEFAULT false,
  complaint_types TEXT,
  complaint_resolution_process TEXT,
  community_benefit_programs TEXT,
  public_access_status TEXT,
  public_awareness_programs TEXT,

  -- Financial aspects
  establishment_cost_npr DECIMAL(18,2),
  annual_operating_cost_npr DECIMAL(14,2),
  cost_per_ton_npr DECIMAL(10,2),
  funding_source TEXT,
  has_tipping_fee BOOLEAN DEFAULT false,
  tipping_fee_structure TEXT,
  average_tipping_fee_per_ton_npr DECIMAL(10,2),
  annual_revenue_npr DECIMAL(14,2),
  has_closure_fund BOOLEAN DEFAULT false,
  closure_fund_amount_npr DECIMAL(14,2),
  post_closure_maintenance_plan_exists BOOLEAN DEFAULT false,
  post_closure_budget_npr DECIMAL(14,2),

  -- Compliance and monitoring
  compliance_status TEXT,
  regulatory_inspection_frequency TEXT,
  last_inspection_date DATE,
  inspection_findings TEXT,
  environmental_monitoring_frequency TEXT,
  environmental_monitoring_parameters TEXT,
  air_quality_monitoring TEXT,
  water_quality_monitoring TEXT,
  compliance_reporting TEXT,
  violation_history TEXT,

  -- Future plans
  expansion_plans TEXT,
  expected_closure_date DATE,
  post_closure_land_use_plan TEXT,
  improvement_plans TEXT,
  waste_reduction_targets TEXT,
  long_term_management_strategy TEXT,

  -- Contact information
  contact_person TEXT,
  contact_designation TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  alternate_contact_info TEXT,

  -- Linkages to other entities
  linked_waste_collection_centers JSONB DEFAULT '[]'::jsonb,
  linked_recycling_facilities JSONB DEFAULT '[]'::jsonb,
  linked_transfer_stations JSONB DEFAULT '[]'::jsonb,
  linked_waste_treatment_facilities JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  site_perimeter GEOMETRY(Polygon, 4326),
  cell_boundaries GEOMETRY(MultiPolygon, 4326),
  access_roads GEOMETRY(MultiLineString, 4326),

  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_landfill_location_point ON acme_landfill_site USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_landfill_site_perimeter ON acme_landfill_site USING GIST (site_perimeter);
CREATE INDEX IF NOT EXISTS idx_landfill_cell_boundaries ON acme_landfill_site USING GIST (cell_boundaries);
CREATE INDEX IF NOT EXISTS idx_landfill_access_roads ON acme_landfill_site USING GIST (access_roads);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_landfill_name ON acme_landfill_site(name);
CREATE INDEX IF NOT EXISTS idx_landfill_slug ON acme_landfill_site(slug);
CREATE INDEX IF NOT EXISTS idx_landfill_type ON acme_landfill_site(landfill_type);
CREATE INDEX IF NOT EXISTS idx_landfill_status ON acme_landfill_site(status);
