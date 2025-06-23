-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Industry type enum
DO $$ 
BEGIN
  CREATE TYPE industry_type AS ENUM (
    'MANUFACTURING', 'PROCESSING', 'ASSEMBLY', 'EXTRACTION', 
    'PACKAGING', 'RECYCLING', 'PRODUCTION', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Industry sector enum
DO $$ 
BEGIN
  CREATE TYPE industry_sector AS ENUM (
    'FOOD_PROCESSING', 'TEXTILES', 'METAL', 'WOOD', 
    'PLASTIC', 'ELECTRONICS', 'CHEMICAL', 'PHARMACEUTICAL',
    'CONSTRUCTION_MATERIALS', 'PAPER', 'AUTOMOTIVE', 'MACHINERY', 
    'AGRO_PROCESSING', 'LEATHER', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the industries table
CREATE TABLE IF NOT EXISTS acme_industry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  industry_type industry_type NOT NULL,
  industry_sector industry_sector NOT NULL,
  status industry_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number VARCHAR(50),
  registered_with TEXT,
  pan_vat_number VARCHAR(50),
  ownership_type industry_ownership_type NOT NULL,
  industry_size industry_size NOT NULL,
  
  -- Physical infrastructure
  land_area_hectares DECIMAL(10, 2),
  built_up_area_sqm DECIMAL(10, 2),
  number_of_buildings INTEGER,
  facility_age_years INTEGER,
  has_expansion_space BOOLEAN DEFAULT false,
  available_expansion_area_hectares DECIMAL(10, 2),
  building_condition TEXT,
  
  -- Production details
  main_products TEXT,
  production_capacity TEXT,
  capacity_utilization production_capacity_utilization,
  annual_production_volume TEXT,
  production_unit TEXT,
  production_value_npr DECIMAL(18, 2),
  production_season TEXT,
  raw_materials TEXT,
  raw_material_sources TEXT,
  
  -- Technology and machinery
  technology_level technology_level,
  key_machinery_equipment TEXT,
  machinery_age_years DECIMAL(5, 2),
  machinery_condition TEXT,
  automation_level TEXT,
  quality_control_measures TEXT,
  has_laboratory BOOLEAN DEFAULT false,
  laboratory_facilities TEXT,
  
  -- Human resources
  total_employees INTEGER,
  skilled_employees INTEGER,
  unskilled_employees INTEGER,
  female_employees INTEGER,
  male_employees INTEGER,
  local_employees INTEGER,
  management_staff INTEGER,
  technical_staff INTEGER,
  employee_benefits TEXT,
  training_programs TEXT,
  labor_union_presence BOOLEAN DEFAULT false,
  
  -- Market and distribution
  market_scope market_scope,
  major_markets TEXT,
  distribution_channels TEXT,
  has_export_activity BOOLEAN DEFAULT false,
  export_countries TEXT,
  annual_export_value_npr DECIMAL(18, 2),
  competition_level TEXT,
  marketing_strategies TEXT,
  branding_initiatives TEXT,
  
  -- Financial aspects
  initial_investment_npr DECIMAL(18, 2),
  current_estimated_value_npr DECIMAL(18, 2),
  annual_turnover_npr DECIMAL(18, 2),
  profitability_status TEXT,
  major_financial_challenges TEXT,
  funding_sources TEXT,
  bank_credit_access TEXT,
  
  -- Utilities and infrastructure
  primary_energy_source energy_source,
  backup_energy_source energy_source,
  monthly_electricity_consumption_kwh DECIMAL(12, 2),
  water_source water_source,
  daily_water_consumption_liters INTEGER,
  waste_management_system TEXT,
  effluent_treatment_exists BOOLEAN DEFAULT false,
  effluent_treatment_details TEXT,
  
  -- Environmental aspects
  environmental_compliance environmental_compliance,
  environmental_certification TEXT,
  pollution_control_measures TEXT,
  waste_recycling_initiatives TEXT,
  environmental_challenges TEXT,
  annual_environmental_expenditure_npr DECIMAL(14, 2),
  
  -- Social impact
  community_engagement_activities TEXT,
  csr_initiatives TEXT,
  community_complaints TEXT,
  response_to_complaints TEXT,
  local_value_chain_impact TEXT,
  
  -- Challenges and constraints
  operational_challenges TEXT,
  infrastructure_constraints TEXT,
  policy_constraints TEXT,
  market_challenges TEXT,
  technology_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  technology_upgrade_plans TEXT,
  investment_plans TEXT,
  
  -- Supply chain
  primary_suppliers TEXT,
  supply_chain_challenges TEXT,
  inventory_management_system TEXT,
  logistics_arrangements TEXT,
  
  -- Certifications and standards
  quality_certifications TEXT,
  product_standards_compliance TEXT,
  safety_standards_compliance TEXT,
  organic_certifications TEXT,
  
  -- Safety and health
  occupational_safety_measures TEXT,
  safety_equipment_provided TEXT,
  accident_history TEXT,
  health_measures_for_workers TEXT,
  has_medical_facility BOOLEAN DEFAULT false,
  
  -- Innovation and research
  r_and_d_activities TEXT,
  innovation_initiatives TEXT,
  collaboration_with_research_institutions TEXT,
  new_product_development TEXT,
  patents_and_intellectual_property TEXT,
  
  -- Government relations and support
  government_incentives_received TEXT,
  tax_exemptions TEXT,
  government_support_programs TEXT,
  regulatory_compliance_status TEXT,
  major_regulatory_challenges TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  
  -- Linkages to other entities
  linked_suppliers JSONB DEFAULT '[]'::jsonb,
  linked_distributors JSONB DEFAULT '[]'::jsonb,
  linked_training_institutes JSONB DEFAULT '[]'::jsonb,
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  property_boundary GEOMETRY(Polygon, 4326),
  building_footprints GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_industry_location_point ON acme_industry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_industry_boundary ON acme_industry USING GIST (property_boundary);
CREATE INDEX IF NOT EXISTS idx_industry_buildings ON acme_industry USING GIST (building_footprints);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_industry_name ON acme_industry(name);
CREATE INDEX IF NOT EXISTS idx_industry_slug ON acme_industry(slug);
CREATE INDEX IF NOT EXISTS idx_industry_type ON acme_industry(industry_type);
CREATE INDEX IF NOT EXISTS idx_industry_sector ON acme_industry(industry_sector);
CREATE INDEX IF NOT EXISTS idx_industry_status ON acme_industry(status);
CREATE INDEX IF NOT EXISTS idx_industry_size ON acme_industry(industry_size);
