-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Dairy industry type enum
DO $$ 
BEGIN
  CREATE TYPE dairy_industry_type AS ENUM (
    'MILK_PROCESSING_PLANT', 
    'CHEESE_PRODUCTION', 
    'YOGURT_PRODUCTION',
    'BUTTER_AND_GHEE_PRODUCTION', 
    'ICE_CREAM_PRODUCTION', 
    'MILK_POWDER_PRODUCTION', 
    'MIXED_DAIRY_PRODUCTS', 
    'TRADITIONAL_DAIRY_PRODUCTS',
    'MODERN_DAIRY', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Dairy production scale enum
DO $$ 
BEGIN
  CREATE TYPE dairy_production_scale AS ENUM (
    'MICRO_SCALE', 
    'SMALL_SCALE', 
    'MEDIUM_SCALE', 
    'LARGE_SCALE', 
    'INDUSTRIAL_SCALE',
    'COOPERATIVE_SCALE', 
    'HOUSEHOLD_SCALE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Raw milk source enum
DO $$ 
BEGIN
  CREATE TYPE raw_milk_source AS ENUM (
    'COW', 
    'BUFFALO', 
    'MIXED_COW_BUFFALO', 
    'GOAT', 
    'SHEEP', 
    'YAK', 
    'CHAURI', 
    'MIXED_SOURCES', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the dairy_industry table
CREATE TABLE IF NOT EXISTS acme_dairy_industry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  industry_type dairy_industry_type NOT NULL,
  production_scale dairy_production_scale NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Registration details
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT, -- Department/Authority
  dairy_development_license_number VARCHAR(50),
  dairy_license_date DATE,
  pan_number VARCHAR(20),
  vat_registered BOOLEAN DEFAULT false,
  vat_number VARCHAR(20),
  
  -- Basic information
  established_year INTEGER,
  ownership_type VARCHAR(50), -- Private, Cooperative, Public, etc.
  owner_name TEXT,
  manager_name TEXT,
  legal_status TEXT, -- Sole proprietorship, Cooperative, etc.
  is_part_of_larger_group BOOLEAN DEFAULT false,
  parent_company TEXT,
  
  -- Facility details
  facility_area_sqm DECIMAL(10, 2),
  processing_area_sqm DECIMAL(10, 2),
  storage_area_sqm DECIMAL(10, 2),
  cold_storage_capacity_liters DECIMAL(10, 2),
  facility_ownership VARCHAR(50), -- Owned, Rented, Leased
  monthly_rent_npr DECIMAL(10, 2),
  building_condition TEXT,
  
  -- Production details
  operational_status VARCHAR(50),
  daily_milk_processing_capacity_liters DECIMAL(10, 2),
  actual_daily_milk_processing_liters DECIMAL(10, 2),
  milk_source_type raw_milk_source,
  number_of_milk_suppliers INTEGER,
  milk_collection_area_radius_km DECIMAL(6, 2),
  village_collection_centers INTEGER,
  seasonal_variations TEXT,
  peak_production_months TEXT,
  
  -- Milk collection and quality
  milk_collection_frequency TEXT, -- Daily, Twice daily, etc.
  has_chilling_centers BOOLEAN DEFAULT false,
  chilling_center_count INTEGER,
  milk_quality_testing_methods TEXT,
  milk_rejection_rate_percentage DECIMAL(5, 2),
  milk_quality_incentives TEXT,
  milk_pricing_system TEXT,
  average_price_per_liter_npr DECIMAL(6, 2),
  
  -- Products
  main_products TEXT,
  daily_product_output TEXT, -- E.g., "500L milk, 200kg cheese"
  product_specialties TEXT,
  traditional_products TEXT,
  product_packaging_types TEXT,
  packaging_material_source TEXT,
  product_shelf_life TEXT,
  
  -- Equipment and technology
  has_pasteurization_equipment BOOLEAN DEFAULT true,
  pasteurization_method TEXT,
  has_homogenization_equipment BOOLEAN DEFAULT false,
  has_cream_separation_equipment BOOLEAN DEFAULT false,
  has_cheese_making_equipment BOOLEAN DEFAULT false,
  has_yogurt_production_line BOOLEAN DEFAULT false,
  has_automated_packaging BOOLEAN DEFAULT false,
  laboratory_facilities TEXT,
  main_equipment_details TEXT,
  equipment_maintenance_system TEXT,
  technology_level TEXT, -- Traditional, Semi-modern, Modern
  
  -- Quality and standards
  has_quality_certification BOOLEAN DEFAULT false,
  certification_details TEXT,
  follows_haccp BOOLEAN DEFAULT false,
  follows_gmp BOOLEAN DEFAULT false,
  quality_control_procedures TEXT,
  testing_frequency TEXT,
  quality_parameters_tested TEXT,
  lab_technician_count INTEGER,
  food_safety_measures TEXT,
  
  -- Employment
  total_employees INTEGER,
  technical_staff INTEGER,
  production_staff INTEGER,
  quality_control_staff INTEGER,
  administrative_staff INTEGER,
  male_employees INTEGER,
  female_employees INTEGER,
  average_monthly_wage_npr DECIMAL(10, 2),
  employment_benefits TEXT,
  staff_training_programs TEXT,
  
  -- Market and sales
  primary_market_area TEXT,
  market_radius_km DECIMAL(6, 2),
  sales_channels TEXT,
  has_own_retail_outlets BOOLEAN DEFAULT false,
  retail_outlet_count INTEGER,
  institutional_sales_percentage DECIMAL(5, 2),
  wholesale_sales_percentage DECIMAL(5, 2),
  retail_sales_percentage DECIMAL(5, 2),
  exports_products BOOLEAN DEFAULT false,
  export_destinations TEXT,
  average_monthly_sales_volume_liters DECIMAL(10, 2),
  average_monthly_sales_npr DECIMAL(14, 2),
  annual_revenue_npr DECIMAL(18, 2),
  
  -- Marketing and branding
  has_branded_products BOOLEAN DEFAULT false,
  brand_names TEXT,
  marketing_strategies TEXT,
  has_advertising BOOLEAN DEFAULT false,
  advertising_channels TEXT,
  promotional_activities TEXT,
  customer_base_demographics TEXT,
  
  -- Financial aspects
  initial_investment_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(18, 2),
  profitability_status TEXT,
  has_loan_financing BOOLEAN DEFAULT false,
  financing_sources TEXT,
  financial_challenges TEXT,
  
  -- Cold chain and logistics
  has_refrigerated_transport BOOLEAN DEFAULT false,
  refrigerated_vehicle_count INTEGER,
  distribution_vehicle_count INTEGER,
  distribution_system TEXT,
  distribution_challenges TEXT,
  average_distribution_radius_km DECIMAL(6, 2),
  
  -- Environmental aspects
  has_effluent_treatment BOOLEAN DEFAULT false,
  effluent_treatment_details TEXT,
  waste_management_system TEXT,
  organic_waste_handling TEXT,
  water_source TEXT,
  daily_water_consumption_liters DECIMAL(10, 2),
  water_recycling_measures TEXT,
  energy_source TEXT,
  energy_efficiency_measures TEXT,
  
  -- Challenges and needs
  production_challenges TEXT,
  supply_chain_challenges TEXT,
  market_challenges TEXT,
  quality_challenges TEXT,
  infrastructure_needs TEXT,
  technology_needs TEXT,
  policy_support_needs TEXT,
  
  -- Relationships with milk producers
  supports_milk_producers BOOLEAN DEFAULT false,
  producer_support_details TEXT,
  provides_technical_assistance BOOLEAN DEFAULT false,
  technical_assistance_details TEXT,
  milk_producer_payment_frequency TEXT,
  producer_relationship_quality TEXT,
  
  -- Industry associations
  member_of_dairy_association BOOLEAN DEFAULT false,
  association_details TEXT,
  cooperative_affiliations TEXT,
  industry_collaboration_details TEXT,
  
  -- Government support and regulation
  received_government_support BOOLEAN DEFAULT false,
  government_support_details TEXT,
  regulatory_compliance_challenges TEXT,
  inspection_frequency TEXT,
  last_inspection_date DATE,
  
  -- Future plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  upgrading_plans TEXT,
  innovation_plans TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  website TEXT,
  
  -- Additional details
  unique_selling_points TEXT,
  contribution_to_local_economy TEXT,
  community_engagement TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  collection_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_dairy_industry_location_point ON acme_dairy_industry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_dairy_industry_boundary ON acme_dairy_industry USING GIST (facility_boundary);
CREATE INDEX IF NOT EXISTS idx_dairy_industry_collection_area ON acme_dairy_industry USING GIST (collection_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_dairy_industry_name ON acme_dairy_industry(name);
CREATE INDEX IF NOT EXISTS idx_dairy_industry_slug ON acme_dairy_industry(slug);
CREATE INDEX IF NOT EXISTS idx_dairy_industry_type ON acme_dairy_industry(industry_type);
CREATE INDEX IF NOT EXISTS idx_dairy_industry_scale ON acme_dairy_industry(production_scale);
