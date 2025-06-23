-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Industrial sector type enum
DO $$ 
BEGIN
  CREATE TYPE industrial_sector_type AS ENUM (
    'SPECIAL_ECONOMIC_ZONE', 
    'INDUSTRIAL_PARK', 
    'EXPORT_PROCESSING_ZONE',
    'INDUSTRIAL_CORRIDOR', 
    'INDUSTRIAL_VILLAGE', 
    'INDUSTRIAL_ESTATE',
    'SPECIAL_INDUSTRIAL_AREA', 
    'INDUSTRIAL_DISTRICT',
    'INDUSTRIAL_CLUSTER', 
    'ECONOMIC_DEVELOPMENT_ZONE', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Development status enum
DO $$ 
BEGIN
  CREATE TYPE development_status AS ENUM (
    'ANNOUNCED_ONLY', 
    'PLANNING_PHASE', 
    'LAND_ACQUISITION_PHASE',
    'DEVELOPMENT_PHASE', 
    'PARTIALLY_OPERATIONAL', 
    'FULLY_OPERATIONAL',
    'EXPANSION_PHASE', 
    'REHABILITATION',
    'ON_HOLD', 
    'ABANDONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the government_announced_industrial_sector table
CREATE TABLE IF NOT EXISTS acme_government_announced_industrial_sector (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  sector_type industrial_sector_type NOT NULL,
  development_status development_status NOT NULL,
  
  -- Location details
  ward_numbers TEXT, -- Multiple ward numbers as comma-separated list
  location TEXT,
  address TEXT,
  
  -- Basic information
  announcement_date DATE,
  announcement_authority TEXT,
  announcement_reference_number TEXT,
  gazette_notification_details TEXT,
  implementation_agency TEXT,
  ownership_type VARCHAR(50), -- Government, Public-Private, etc.
  
  -- Area details
  total_land_area_hectares DECIMAL(10, 2),
  developed_area_hectares DECIMAL(10, 2),
  industrial_plots_area_hectares DECIMAL(10, 2),
  commercial_plots_area_hectares DECIMAL(10, 2),
  residential_plots_area_hectares DECIMAL(10, 2),
  infrastructure_area_hectares DECIMAL(10, 2),
  green_area_hectares DECIMAL(10, 2),
  
  -- Land acquisition status
  land_acquisition_status TEXT,
  land_acquisition_progress_percentage INTEGER,
  land_acquisition_challenges TEXT,
  land_ownership_status TEXT,
  land_compensation_status TEXT,
  resettlement_issues TEXT,
  
  -- Development plan
  master_plan_exists BOOLEAN DEFAULT false,
  master_plan_details TEXT,
  development_phases TEXT,
  development_timeline TEXT,
  current_development_phase TEXT,
  development_progress_percentage INTEGER,
  
  -- Infrastructure status
  boundary_wall_status TEXT,
  road_infrastructure_status TEXT,
  water_supply_status TEXT,
  electricity_supply_status TEXT,
  sewage_system_status TEXT,
  waste_management_status TEXT,
  communication_infrastructure_status TEXT,
  drainage_system_status TEXT,
  
  -- Infrastructure details
  water_supply_source TEXT,
  water_supply_capacity_liters_per_day DECIMAL(14, 2),
  electricity_supply_source TEXT,
  electricity_capacity_mw DECIMAL(10, 2),
  has_dedicated_power_station BOOLEAN DEFAULT false,
  power_station_details TEXT,
  has_waste_treatment_plant BOOLEAN DEFAULT false,
  waste_treatment_details TEXT,
  road_connectivity_details TEXT,
  nearest_highway_distance_km DECIMAL(6, 2),
  
  -- Investment details
  total_estimated_investment_npr DECIMAL(18, 2),
  government_investment_npr DECIMAL(18, 2),
  private_investment_npr DECIMAL(18, 2),
  foreign_investment_npr DECIMAL(18, 2),
  annual_development_budget_npr DECIMAL(18, 2),
  funding_sources TEXT,
  
  -- Capacity and units
  total_plot_count INTEGER,
  allocated_plot_count INTEGER,
  operational_unit_count INTEGER,
  under_construction_unit_count INTEGER,
  planned_unit_count INTEGER,
  maximum_capacity_units INTEGER,
  
  -- Industry focus
  primary_industry_focus TEXT,
  secondary_industry_focus TEXT,
  restricted_industries TEXT,
  target_investment_size TEXT, -- Small, Medium, Large, Mixed
  target_export_percentage INTEGER,
  
  -- Incentives and facilities
  tax_incentives TEXT,
  duty_exemptions TEXT,
  subsidy_provisions TEXT,
  one_window_service BOOLEAN DEFAULT false,
  one_window_service_details TEXT,
  single_point_clearance BOOLEAN DEFAULT false,
  streamlined_approvals TEXT,
  other_incentives TEXT,
  
  -- Management details
  managing_authority TEXT,
  management_structure TEXT,
  governance_model TEXT,
  onsite_administration BOOLEAN DEFAULT false,
  administration_details TEXT,
  stakeholder_involvement TEXT,
  
  -- Employment and economic impact
  current_employment_generated INTEGER,
  projected_employment_at_full_capacity INTEGER,
  current_investment_amount_npr DECIMAL(18, 2),
  projected_investment_at_full_capacity_npr DECIMAL(18, 2),
  current_annual_turnover_npr DECIMAL(18, 2),
  projected_annual_turnover_npr DECIMAL(18, 2),
  export_contribution_npr DECIMAL(18, 2),
  
  -- Challenges and issues
  development_challenges TEXT,
  infrastructure_challenges TEXT,
  investment_challenges TEXT,
  regulatory_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  
  -- Environmental aspects
  has_environmental_impact_assessment BOOLEAN DEFAULT false,
  eia_details TEXT,
  environmental_management_plan TEXT,
  green_zone_percentage INTEGER,
  pollution_control_measures TEXT,
  environmental_monitoring TEXT,
  
  -- Social aspects
  local_community_impact TEXT,
  community_engagement_activities TEXT,
  csr_initiatives TEXT,
  local_employment_preference BOOLEAN DEFAULT true,
  local_employment_details TEXT,
  
  -- Connectivity and logistics
  distance_to_nearest_city_km DECIMAL(6, 2),
  distance_to_highway_km DECIMAL(6, 2),
  distance_to_railway_km DECIMAL(6, 2),
  distance_to_airport_km DECIMAL(6, 2),
  distance_to_dry_port_km DECIMAL(6, 2),
  logistics_facilities TEXT,
  
  -- Support facilities
  has_administrative_building BOOLEAN DEFAULT false,
  has_bank_branches BOOLEAN DEFAULT false,
  bank_details TEXT,
  has_customs_office BOOLEAN DEFAULT false,
  has_post_office BOOLEAN DEFAULT false,
  has_health_facilities BOOLEAN DEFAULT false,
  health_facility_details TEXT,
  has_training_center BOOLEAN DEFAULT false,
  training_center_details TEXT,
  has_housing_facilities BOOLEAN DEFAULT false,
  housing_facility_details TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  infrastructure_upgrade_plans TEXT,
  new_facility_plans TEXT,
  investment_targets TEXT,
  strategic_direction TEXT,
  
  -- Marketing and promotion
  marketing_strategy TEXT,
  investment_promotion_activities TEXT,
  promotional_materials TEXT,
  target_investor_countries TEXT,
  investor_outreach_programs TEXT,
  
  -- Contact information
  contact_office TEXT,
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  information_center_details TEXT,
  
  -- Additional details
  unique_selling_points TEXT,
  competitive_advantages TEXT,
  success_stories TEXT,
  major_setbacks TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  area_boundary GEOMETRY(Polygon, 4326),
  zoning_map GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_location_point ON acme_government_announced_industrial_sector USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_boundary ON acme_government_announced_industrial_sector USING GIST (area_boundary);
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_zoning ON acme_government_announced_industrial_sector USING GIST (zoning_map);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_name ON acme_government_announced_industrial_sector(name);
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_slug ON acme_government_announced_industrial_sector(slug);
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_type ON acme_government_announced_industrial_sector(sector_type);
CREATE INDEX IF NOT EXISTS idx_gov_industrial_sector_status ON acme_government_announced_industrial_sector(development_status);
