-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Government forest type enum
DO $$ 
BEGIN
  CREATE TYPE government_forest_type AS ENUM (
    'NATIONAL_FOREST', 'PROTECTED_FOREST', 'CONSERVATION_AREA', 
    'BUFFER_ZONE_FOREST', 'RESERVED_FOREST', 'SCIENTIFIC_FOREST', 
    'PLANTATION_FOREST', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the government_forest table
CREATE TABLE IF NOT EXISTS acme_government_forest (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  forest_type government_forest_type NOT NULL,
  
  -- Basic information
  description TEXT,
  forest_area_hectares DECIMAL(12, 2),
  gazette_notification_number VARCHAR(50),
  gazette_notification_date DATE,
  notified_area_hectares DECIMAL(12, 2),
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  boundary_description TEXT,
  elevation_range_meters TEXT,
  min_elevation_meters INTEGER,
  max_elevation_meters INTEGER,
  
  -- Management details
  managing_division TEXT,
  division_office_location TEXT,
  management_status forest_management_status,
  has_management_plan BOOLEAN DEFAULT FALSE,
  management_plan_period TEXT,
  last_inventory_year INTEGER,
  forest_officer_in_charge TEXT,
  forest_guard_count INTEGER,
  forest_ranger_count INTEGER,
  total_staff_count INTEGER,
  annual_budget_npr DECIMAL(14, 2),
  implementing_partners TEXT,
  
  -- Forest characteristics
  forest_condition forest_condition,
  dominant_species JSONB DEFAULT '[]'::jsonb,
  key_flora_species JSONB DEFAULT '[]'::jsonb,
  key_fauna_species JSONB DEFAULT '[]'::jsonb,
  has_endangered_species BOOLEAN DEFAULT FALSE,
  endangered_species_list JSONB DEFAULT '[]'::jsonb,
  forest_density_percent DECIMAL(5, 2),
  age_structure TEXT,
  soil_type TEXT,
  watershed_details TEXT,
  has_water_bodies BOOLEAN DEFAULT FALSE,
  water_bodies_details TEXT,
  
  -- Ecological significance
  biodiversity_richness TEXT,
  ecological_significance TEXT,
  ecosystem_services TEXT,
  carbon_stock_assessment TEXT,
  research_value TEXT,
  has_rare_habitats BOOLEAN DEFAULT FALSE,
  rare_habitats_details TEXT,
  
  -- Threats and challenges
  encroachment_status TEXT,
  encroachment_area_hectares DECIMAL(10, 2),
  illegal_logging_intensity TEXT,
  poaching_intensity TEXT,
  fire_risk_level fire_risk_level,
  fire_incidents_last_five_years INTEGER,
  diseases_and_pests TEXT,
  invasive_species TEXT,
  grazing BOOLEAN DEFAULT FALSE,
  grazing_intensity TEXT,
  other_threats TEXT,
  
  -- Conservation efforts
  has_firelines BOOLEAN DEFAULT FALSE,
  fireline_kilometers DECIMAL(8, 2),
  has_firewatchers BOOLEAN DEFAULT FALSE,
  firewatcher_count INTEGER,
  has_firefighting_equipment BOOLEAN DEFAULT FALSE,
  firefighting_equipment_details TEXT,
  annual_plantation_hectares DECIMAL(10, 2),
  soil_conservation_measures TEXT,
  watershed_conservation_activities TEXT,
  wildlife_conservation_measures TEXT,
  
  -- Infrastructure
  has_roads_within BOOLEAN DEFAULT FALSE,
  road_kilometers DECIMAL(8, 2),
  has_checkposts BOOLEAN DEFAULT FALSE,
  checkpost_count INTEGER,
  has_watchtowers BOOLEAN DEFAULT FALSE,
  watchtower_count INTEGER,
  has_nursery BOOLEAN DEFAULT FALSE,
  nursery_capacity INTEGER,
  has_ranger_post BOOLEAN DEFAULT FALSE,
  ranger_post_count INTEGER,
  infrastructure_needs TEXT,
  
  -- Resource utilization
  annual_timber_harvest_cubic_meters DECIMAL(10, 2),
  annual_firewood_collection_cubic_meters DECIMAL(10, 2),
  ntfp_collection BOOLEAN DEFAULT FALSE,
  ntfp_details TEXT,
  medicinal_herb_collection BOOLEAN DEFAULT FALSE,
  medicinal_herb_details TEXT,
  annual_revenue_npr DECIMAL(14, 2),
  revenue_sharing TEXT,
  
  -- Community interface
  adjacent_communities JSONB DEFAULT '[]'::jsonb,
  community_access_rights TEXT,
  has_resource_dependent_communities BOOLEAN DEFAULT FALSE,
  resource_dependent_community_details TEXT,
  community_conflicts TEXT,
  has_community_outreach BOOLEAN DEFAULT FALSE,
  community_outreach_activities TEXT,
  
  -- Policy and governance
  governing_legislation TEXT,
  has_legal_disputes BOOLEAN DEFAULT FALSE,
  legal_dispute_details TEXT,
  policy_issues TEXT,
  
  -- Cultural significance
  cultural_significance TEXT,
  religious_significance TEXT,
  historical_significance TEXT,
  indigenous_knowledge TEXT,
  
  -- Tourism aspects
  has_tourism_potential BOOLEAN DEFAULT FALSE,
  tourism_activities TEXT,
  annual_visitor_count INTEGER,
  tourist_facilities TEXT,
  trekking_routes BOOLEAN DEFAULT FALSE,
  trekking_route_details TEXT,
  
  -- Future plans
  development_plans TEXT,
  restoration_plans TEXT,
  expansion_plans TEXT,
  research_priorities TEXT,
  
  -- Contact information
  contact_office_name TEXT,
  contact_office_address TEXT,
  contact_officer_name TEXT,
  contact_officer_designation TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_waterbodies JSONB DEFAULT '[]'::jsonb,
  linked_community_forests JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  forest_boundary GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_government_forest_location_point ON acme_government_forest USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_government_forest_boundary ON acme_government_forest USING GIST (forest_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_government_forest_name ON acme_government_forest(name);
CREATE INDEX IF NOT EXISTS idx_government_forest_slug ON acme_government_forest(slug);
CREATE INDEX IF NOT EXISTS idx_government_forest_type ON acme_government_forest(forest_type);
CREATE INDEX IF NOT EXISTS idx_government_forest_condition ON acme_government_forest(forest_condition);
