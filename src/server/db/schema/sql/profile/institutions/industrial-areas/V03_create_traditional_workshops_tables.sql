-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Traditional workshop type enum
DO $$ 
BEGIN
  CREATE TYPE traditional_workshop_type AS ENUM (
    'METAL_CRAFTING', 'WOOD_CARVING', 'POTTERY', 
    'TEXTILES_WEAVING', 'LEATHER_CRAFTING', 'STONE_CARVING', 
    'BAMBOO_CRAFTING', 'JEWELRY_MAKING', 'PAPER_MAKING', 
    'MUSICAL_INSTRUMENT_MAKING', 'MASK_MAKING', 'THANGKA_PAINTING',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Craft originality enum
DO $$ 
BEGIN
  CREATE TYPE craft_originality AS ENUM (
    'ANCESTRAL', 'TRADITIONAL', 'MODERN_ADAPTATION', 
    'FUSION', 'CONTEMPORARY', 'REVIVED_TRADITION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the traditional workshops table
CREATE TABLE IF NOT EXISTS acme_traditional_workshop (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  workshop_type traditional_workshop_type NOT NULL,
  status industry_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  generation_in_business INTEGER,
  family_tradition BOOLEAN DEFAULT false,
  registration_status TEXT,
  registration_number VARCHAR(50),
  ownership_type industry_ownership_type NOT NULL,
  industry_size industry_size NOT NULL,
  
  -- Physical infrastructure
  workshop_area_sqm DECIMAL(10, 2),
  building_type TEXT,
  building_condition TEXT,
  has_dedicated_workspace BOOLEAN DEFAULT true,
  has_display_area BOOLEAN DEFAULT false,
  has_storage_area BOOLEAN DEFAULT false,
  
  -- Craft details
  main_products TEXT,
  craft_techniques TEXT,
  craft_originality craft_originality,
  cultural_significance TEXT,
  traditional_practices_maintained TEXT,
  modern_adaptations TEXT,
  artistic_value TEXT,
  materials_used TEXT,
  material_sources TEXT,
  special_tools_used TEXT,
  
  -- Production details
  production_capacity_monthly TEXT,
  production_unit TEXT,
  production_value_npr DECIMAL(14, 2),
  production_season TEXT,
  production_time_per_piece TEXT,
  quality_control_process TEXT,
  
  -- Technology and tools
  technology_level technology_level,
  traditional_tools_used TEXT,
  modern_tools_incorporated TEXT,
  tool_making_capability BOOLEAN DEFAULT false,
  tool_maintenance TEXT,
  
  -- Human resources
  artisans_count INTEGER,
  apprentices_count INTEGER,
  female_artisans INTEGER,
  male_artisans INTEGER,
  family_members_involved INTEGER,
  hired_workers INTEGER,
  skill_transfer_method TEXT,
  apprenticeship_system TEXT,
  skill_level_required TEXT,
  
  -- Market and distribution
  market_scope market_scope,
  major_markets TEXT,
  selling_channels TEXT,
  direct_to_consumer BOOLEAN DEFAULT false,
  has_middlemen BOOLEAN DEFAULT false,
  tourism_dependency TEXT,
  customer_demographics TEXT,
  pricing_strategy TEXT,
  has_export_activity BOOLEAN DEFAULT false,
  export_destinations TEXT,
  
  -- Financial aspects
  monthly_income_range_npr TEXT,
  production_cost_breakdown TEXT,
  price_range_of_products_npr TEXT,
  financial_support_received TEXT,
  financial_challenges TEXT,
  seasonal_income_variation TEXT,
  
  -- Cultural preservation
  cultural_heritage_value TEXT,
  recognition_and_awards TEXT,
  featured_in_exhibitions TEXT,
  documented_in_publications TEXT,
  preservation_efforts TEXT,
  knowledge_documentation TEXT,
  endangered_craft_status TEXT,
  
  -- Challenges and constraints
  craft_preservation_challenges TEXT,
  market_challenges TEXT,
  raw_material_challenges TEXT,
  skill_transfer_challenges TEXT,
  competition_with_modern_products TEXT,
  
  -- Support and associations
  member_of_craft_association BOOLEAN DEFAULT false,
  association_names TEXT,
  government_support_received TEXT,
  ngo_support_received TEXT,
  tourism_promotion TEXT,
  
  -- Innovation and adaptation
  design_innovations TEXT,
  product_adaptations TEXT,
  modern_market_adaptations TEXT,
  contemporary_applications TEXT,
  innovation_challenges TEXT,
  
  -- Continuation and future
  succession_plan TEXT,
  next_generation_interest TEXT,
  sustainability_plan TEXT,
  business_expansion_plans TEXT,
  diversification_plans TEXT,
  
  -- Training and education
  provides_training BOOLEAN DEFAULT false,
  training_programs TEXT,
  workshop_for_tourists BOOLEAN DEFAULT false,
  educational_collaborations TEXT,
  
  -- Recognition and certification
  geographical_indication_status TEXT,
  craft_certifications TEXT,
  quality_marks TEXT,
  heritage_recognition TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  social_media_presence TEXT,
  online_portfolio TEXT,
  
  -- Linkages to other entities
  linked_artisan_networks JSONB DEFAULT '[]'::jsonb,
  linked_craft_associations JSONB DEFAULT '[]'::jsonb,
  linked_cultural_institutions JSONB DEFAULT '[]'::jsonb,
  linked_tourism_services JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  workshop_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_location_point ON acme_traditional_workshop USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_area ON acme_traditional_workshop USING GIST (workshop_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_name ON acme_traditional_workshop(name);
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_slug ON acme_traditional_workshop(slug);
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_type ON acme_traditional_workshop(workshop_type);
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_status ON acme_traditional_workshop(status);
CREATE INDEX IF NOT EXISTS idx_traditional_workshop_originality ON acme_traditional_workshop(craft_originality);
