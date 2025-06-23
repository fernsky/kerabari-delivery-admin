-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define dumping_site_type enum
DO $$
BEGIN
  CREATE TYPE dumping_site_type AS ENUM (
    'OPEN_DUMP', 'CONTROLLED_DUMP', 'TEMPORARY_COLLECTION_POINT', 'UNAUTHORIZED_DUMP',
    'EMERGENCY_DUMP', 'RIVERSIDE_DUMP', 'ROADSIDE_DUMP', 'QUARRY_DUMP',
    'LOW_LYING_AREA_FILLING', 'MIXED_WASTE_DUMP', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define dumping_site_status enum
DO $$
BEGIN
  CREATE TYPE dumping_site_status AS ENUM (
    'ACTIVE', 'INACTIVE', 'CLOSED', 'REMEDIATED', 'UNDER_REMEDIATION',
    'UNAUTHORIZED', 'MONITORED', 'SEASONAL', 'OCCASIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define site_management_level enum
DO $$
BEGIN
  CREATE TYPE site_management_level AS ENUM (
    'WELL_MANAGED', 'BASIC_MANAGEMENT', 'MINIMAL_MANAGEMENT', 'UNMANAGED', 'ABANDONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define wate_mgmt_ownership_type enum
DO $$
BEGIN
  CREATE TYPE wate_mgmt_ownership_type AS ENUM (
    'MUNICIPAL', 'WARD_LEVEL', 'PRIVATE', 'COMMUNITY', 'UNAUTHORIZED',
    'GOVERNMENT', 'MIXED', 'UNIDENTIFIED', 'OTHER'
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

-- Define environmental_impact_level enum
DO $$
BEGIN
  CREATE TYPE environmental_impact_level AS ENUM (
    'LOW', 'MODERATE', 'HIGH', 'SEVERE', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the dumping_site table
CREATE TABLE IF NOT EXISTS acme_dumping_site (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  dumping_type dumping_site_type NOT NULL,
  status dumping_site_status NOT NULL,
  management_level site_management_level NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  nearest_landmark TEXT,

  -- Basic information
  started_year INTEGER,
  ownership_type wate_mgmt_ownership_type NOT NULL,
  operator_name TEXT,
  has_legal_permission BOOLEAN DEFAULT false,
  permission_details TEXT,
  is_designated_site BOOLEAN DEFAULT false,
  is_temporary BOOLEAN DEFAULT false,
  planned_end_date DATE,
  has_closure BOOLEAN DEFAULT false,
  closure_year INTEGER,

  -- Site specifications
  total_area_sq_m DECIMAL(14,2),
  active_area_sq_m DECIMAL(14,2),
  estimated_waste_volume_cubic_m DECIMAL(14,2),
  estimated_waste_height_m DECIMAL(8,2),
  estimated_waste_weight_tons DECIMAL(14,2),
  waste_accumulation_rate DECIMAL(10,2),

  -- Waste specifications
  waste_types JSONB DEFAULT '[]'::jsonb,
  predominant_waste_type waste_type,
  has_domestic_waste BOOLEAN DEFAULT true,
  has_commercial_waste BOOLEAN DEFAULT false,
  has_construction_waste BOOLEAN DEFAULT false,
  has_industrial_waste BOOLEAN DEFAULT false,
  has_hazardous_waste BOOLEAN DEFAULT false,
  hazardous_waste_details TEXT,
  has_medical_waste BOOLEAN DEFAULT false,
  medical_waste_details TEXT,
  has_electronic_waste BOOLEAN DEFAULT false,
  has_waste_sorting BOOLEAN DEFAULT false,
  waste_sorting_details TEXT,
  has_informal_recycling BOOLEAN DEFAULT false,
  informal_recycling_details TEXT,
  has_waste_picking BOOLEAN DEFAULT false,
  waste_picker_count INTEGER,

  -- Environmental impact
  environmental_impact_level environmental_impact_level,
  has_contamination_evidence BOOLEAN DEFAULT false,
  contamination_details TEXT,
  has_leachate_generation BOOLEAN DEFAULT false,
  leachate_management TEXT,
  has_leachate_collection_system BOOLEAN DEFAULT false,
  has_visible_water_pollution BOOLEAN DEFAULT false,
  water_pollution_details TEXT,
  has_off_site_leachate_flow BOOLEAN DEFAULT false,
  has_odor_issues BOOLEAN DEFAULT false,
  odor_description TEXT,
  odor_range TEXT,
  has_vermin_presence BOOLEAN DEFAULT false,
  vermin_types TEXT,
  has_dust_issues BOOLEAN DEFAULT false,
  has_visual_impact BOOLEAN DEFAULT false,
  visual_impact_details TEXT,
  has_waste_burning BOOLEAN DEFAULT false,
  waste_burning_frequency TEXT,

  -- Environmental context
  topography_type TEXT,
  soil_type TEXT,
  land_use_before_dumping TEXT,
  surrounding_land_use TEXT,
  distance_to_nearest_residence_m DECIMAL(10,2),
  distance_to_nearest_water_body_m DECIMAL(10,2),
  water_body_type TEXT,
  distance_to_nearest_farmland_m DECIMAL(10,2),
  distance_to_nearest_road_m DECIMAL(10,2),
  distance_to_nearest_protected_area_m DECIMAL(10,2),
  is_in_flood_prone_area BOOLEAN DEFAULT false,
  is_in_landslide_prone_area BOOLEAN DEFAULT false,
  groundwater_table_depth_m DECIMAL(8,2),
  flood_history TEXT,

  -- Operations
  operating_status TEXT,
  operation_frequency operation_frequency,
  operating_days TEXT,
  access_control BOOLEAN DEFAULT false,
  access_control_type TEXT,
  has_waste_compaction BOOLEAN DEFAULT false,
  compaction_method TEXT,
  has_cover_material BOOLEAN DEFAULT false,
  cover_material_type TEXT,
  cover_frequency TEXT,
  access_road_exists BOOLEAN DEFAULT false,
  access_road_condition TEXT,
  equipment_used TEXT,
  vehicle_movements_per_day INTEGER,
  major_waste_sources TEXT,
  average_daily_waste_receipt_tons DECIMAL(10,2),

  -- Safety and security
  has_fencing BOOLEAN DEFAULT false,
  fencing_condition TEXT,
  fencing_type TEXT,
  has_gate BOOLEAN DEFAULT false,
  has_security_personnel BOOLEAN DEFAULT false,
  security_schedule TEXT,
  has_safety_signage BOOLEAN DEFAULT false,
  has_fire_prevention BOOLEAN DEFAULT false,
  fire_prevention_details TEXT,
  has_fire_incidents BOOLEAN DEFAULT false,
  fire_incidents_frequency TEXT,
  last_fire_incident_date DATE,

  -- Community relations
  community_complaints_received BOOLEAN DEFAULT false,
  complaint_types TEXT,
  complaint_frequency TEXT,
  complaint_resolution_process TEXT,
  community_awareness_programs TEXT,
  community_consultation_process TEXT,
  affected_communities TEXT,
  public_perception_level TEXT,

  -- Financial aspects
  maintenance_cost_npr DECIMAL(14,2),
  funding_source TEXT,
  funds_allocated_npr DECIMAL(14,2),
  actual_expenditure_npr DECIMAL(14,2),
  user_fees_collected BOOLEAN DEFAULT false,
  user_fee_details TEXT,
  has_formal_budget BOOLEAN DEFAULT false,

  -- Management and governance
  has_designated_manager BOOLEAN DEFAULT false,
  manager_details TEXT,
  has_waste_management_plan BOOLEAN DEFAULT false,
  management_plan_details TEXT,
  has_monitoring_system BOOLEAN DEFAULT false,
  monitoring_frequency TEXT,
  monitoring_parameters TEXT,
  has_reporting_system BOOLEAN DEFAULT false,
  reporting_frequency TEXT,
  governance_structure TEXT,

  -- Remediation and future plans
  has_remediation_plan BOOLEAN DEFAULT false,
  remediation_plan_details TEXT,
  remediation_start_date DATE,
  remediation_completion_date DATE,
  estimated_remediation_cost_npr DECIMAL(18,2),
  future_site_plans TEXT,
  planned_upgrades TEXT,
  conversion_plans TEXT,
  timeline_for_improvements TEXT,

  -- Health impacts
  reported_health_issues BOOLEAN DEFAULT false,
  health_issues_details TEXT,
  has_health_studies BOOLEAN DEFAULT false,
  health_study_findings TEXT,
  has_health_protection_measures BOOLEAN DEFAULT false,
  health_protection_details TEXT,

  -- Contact information
  contact_person TEXT,
  contact_designation TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  ward_contact_person TEXT,
  ward_contact_phone TEXT,

  -- Local governance information
  ward_awareness_level TEXT,
  ward_intervention_level TEXT,
  ward_action_taken TEXT,
  municipal_action_taken TEXT,

  -- Technical support
  received_technical_support BOOLEAN DEFAULT false,
  technical_support_source TEXT,
  technical_support_details TEXT,
  requested_support TEXT,

  -- Linkages to other entities
  linked_waste_collection_centers JSONB DEFAULT '[]'::jsonb,
  linked_transfer_stations JSONB DEFAULT '[]'::jsonb,
  linked_landfills JSONB DEFAULT '[]'::jsonb,
  linked_waste_pickers JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  site_perimeter GEOMETRY(Polygon, 4326),
  waste_extent GEOMETRY(Polygon, 4326),
  access_routes GEOMETRY(MultiLineString, 4326),

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
CREATE INDEX IF NOT EXISTS idx_dumping_location_point ON acme_dumping_site USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_dumping_site_perimeter ON acme_dumping_site USING GIST (site_perimeter);
CREATE INDEX IF NOT EXISTS idx_dumping_waste_extent ON acme_dumping_site USING GIST (waste_extent);
CREATE INDEX IF NOT EXISTS idx_dumping_access_routes ON acme_dumping_site USING GIST (access_routes);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_dumping_name ON acme_dumping_site(name);
CREATE INDEX IF NOT EXISTS idx_dumping_slug ON acme_dumping_site(slug);
CREATE INDEX IF NOT EXISTS idx_dumping_type ON acme_dumping_site(dumping_type);
CREATE INDEX IF NOT EXISTS idx_dumping_status ON acme_dumping_site(status);
