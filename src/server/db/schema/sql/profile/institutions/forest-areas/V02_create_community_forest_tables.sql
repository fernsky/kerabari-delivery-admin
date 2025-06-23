-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the community_forest table
CREATE TABLE IF NOT EXISTS acme_community_forest (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  address TEXT,
  
  -- Registration and management details
  registration_number VARCHAR(50),
  registration_date DATE,
  handover_date DATE,
  forest_office_registered_with TEXT,
  certificate_number VARCHAR(50),
  forest_management_plan BOOLEAN DEFAULT FALSE,
  management_plan_period TEXT,
  renewal_date DATE,
  
  -- Forest user group details
  has_forest_user_group BOOLEAN DEFAULT TRUE,
  user_group_name TEXT,
  user_group_registration_number VARCHAR(50),
  user_group_formation_date DATE,
  total_user_households INTEGER,
  total_beneficiaries INTEGER,
  male_members INTEGER,
  female_members INTEGER,
  dalit_households INTEGER,
  janajati_households INTEGER,
  brahmin_chhetri_households INTEGER,
  other_ethnic_households INTEGER,
  executive_committee_size INTEGER,
  females_in_executive INTEGER,
  executive_committee_formation_date DATE,
  executive_committee_election_frequency_years INTEGER,
  chairperson_name TEXT,
  secretary_name TEXT,
  treasurer_name TEXT,
  
  -- Forest details
  total_area_hectares DECIMAL(10, 2),
  forest_coverage_percent DECIMAL(5, 2),
  open_area_percent DECIMAL(5, 2),
  encroachment_area_hectares DECIMAL(10, 2),
  forest_condition forest_condition,
  forest_density forest_density,
  forest_management_status forest_management_status,
  biodiversity_level biodiversity_level,
  fire_risk_level fire_risk_level,
  
  -- Topography and ecosystem
  elevation_range_meters TEXT,
  slope_percent DECIMAL(5, 2),
  aspect_direction TEXT,
  topography topography_type,
  soil_type TEXT,
  ecosystem_type ecosystem_type,
  watershed_name TEXT,
  nearest_water_body_name TEXT,
  distance_to_water_body_km DECIMAL(6, 2),
  
  -- Flora and fauna
  dominant_tree_species JSONB DEFAULT '[]'::jsonb,
  dominant_shrub_species JSONB DEFAULT '[]'::jsonb,
  native_species_count INTEGER,
  invasive_species_count INTEGER,
  invasive_species_names JSONB DEFAULT '[]'::jsonb,
  medicinal_plant_species_count INTEGER,
  notable_medicinal_plants JSONB DEFAULT '[]'::jsonb,
  endangered_flora_count INTEGER,
  endangered_fauna_count INTEGER,
  endangered_species JSONB DEFAULT '[]'::jsonb,
  wildlife_present JSONB DEFAULT '[]'::jsonb,
  
  -- Forest inventory details
  last_inventory_year INTEGER,
  estimated_annual_growth_percent DECIMAL(5, 2),
  estimated_carbon_stock_tonnes DECIMAL(10, 2),
  total_tree_count INTEGER,
  average_tree_age INTEGER,
  average_tree_height_meters DECIMAL(6, 2),
  average_dbh_cm DECIMAL(6, 2),
  timber_volume_estimate_cubic_meters DECIMAL(10, 2),
  
  -- Harvesting and utilization
  allows_harvesting BOOLEAN DEFAULT TRUE,
  annual_allowable_harvest_cubic_meters DECIMAL(10, 2),
  last_harvest_date DATE,
  last_harvest_volume_cubic_meters DECIMAL(10, 2),
  harvesting_system TEXT,
  major_forest_products JSONB DEFAULT '[]'::jsonb,
  annual_timber_production_cubic_meters DECIMAL(10, 2),
  annual_firewood_production_kg DECIMAL(10, 2),
  annual_fodder_production_kg DECIMAL(10, 2),
  other_forest_products_harvested TEXT,
  
  -- Financial aspects
  annual_revenue_npr DECIMAL(14, 2),
  timber_revenue_npr DECIMAL(14, 2),
  ntfp_revenue_npr DECIMAL(14, 2),
  other_income_sources_npr DECIMAL(14, 2),
  annual_operational_cost_npr DECIMAL(14, 2),
  has_bank_account BOOLEAN DEFAULT TRUE,
  bank_account_details TEXT,
  total_savings_npr DECIMAL(14, 2),
  receives_external_funding BOOLEAN DEFAULT FALSE,
  external_funding_sources_npr DECIMAL(14, 2),
  funding_organizations JSONB DEFAULT '[]'::jsonb,
  
  -- Forest management activities
  has_silvicultural_activities BOOLEAN DEFAULT FALSE,
  silvicultural_activities_details TEXT,
  has_plantation_activities BOOLEAN DEFAULT FALSE,
  plantation_area_hectares DECIMAL(10, 2),
  plantation_year INTEGER,
  planted_species JSONB DEFAULT '[]'::jsonb,
  planting_survival_rate_percent DECIMAL(5, 2),
  has_nursery BOOLEAN DEFAULT FALSE,
  nursery_capacity_seedlings INTEGER,
  
  -- Conservation and protection
  has_firelines BOOLEAN DEFAULT FALSE,
  fireline_length_km DECIMAL(6, 2),
  has_watch_tower BOOLEAN DEFAULT FALSE,
  watch_tower_count INTEGER,
  forest_fire_incidents_last_five_years INTEGER,
  last_forest_fire_date DATE,
  employs_forest_guards BOOLEAN DEFAULT FALSE,
  forest_guard_count INTEGER,
  has_encroachment_issues BOOLEAN DEFAULT FALSE,
  encroachment_details TEXT,
  illegal_logging_incidents_last_year INTEGER,
  
  -- Community development
  has_community_development_fund BOOLEAN DEFAULT FALSE,
  development_fund_allocation_percent DECIMAL(5, 2),
  develops_local_infrastructure BOOLEAN DEFAULT FALSE,
  infrastructure_development_details TEXT,
  provides_educational_support BOOLEAN DEFAULT FALSE,
  educational_support_details TEXT,
  livelihood_support_activities TEXT,
  has_equitable_distribution_system BOOLEAN DEFAULT FALSE,
  distribution_system_details TEXT,
  
  -- Governance and regulations
  has_constitution BOOLEAN DEFAULT TRUE,
  has_operational_plan BOOLEAN DEFAULT TRUE,
  operational_plan_period_years INTEGER,
  has_harvesting_rules BOOLEAN DEFAULT TRUE,
  harvesting_rules_details TEXT,
  has_monitoring_system BOOLEAN DEFAULT FALSE,
  monitoring_system_details TEXT,
  has_conflict_resolution_mechanism BOOLEAN DEFAULT FALSE,
  conflict_resolution_details TEXT,
  major_conflict_types JSONB DEFAULT '[]'::jsonb,
  
  -- External support and coordination
  receives_government_support BOOLEAN DEFAULT FALSE,
  government_support_details TEXT,
  receives_ngo_support BOOLEAN DEFAULT FALSE,
  ngo_support_details TEXT,
  coordinates_with_local_government BOOLEAN DEFAULT TRUE,
  coordination_mechanisms TEXT,
  
  -- Challenges and needs
  major_challenges JSONB DEFAULT '[]'::jsonb,
  technical_needs TEXT,
  capacity_building_needs TEXT,
  financial_needs TEXT,
  
  -- Future plans
  has_expansion_plan BOOLEAN DEFAULT FALSE,
  expansion_plan_details TEXT,
  sustainability_measures TEXT,
  climate_change_adaptation_measures TEXT,
  
  -- Accessibility and tourism
  accessibility forest_accessibility,
  distance_from_road_km DECIMAL(6, 2),
  distance_from_settlement_km DECIMAL(6, 2),
  has_foot_trails BOOLEAN DEFAULT FALSE,
  foot_trail_length_km DECIMAL(6, 2),
  has_ecotourism_activities BOOLEAN DEFAULT FALSE,
  ecotourism_activities_details TEXT,
  annual_visitors_count INTEGER,
  
  -- Contact information
  contact_person_name TEXT,
  contact_person_role TEXT,
  contact_phone TEXT,
  alternate_contact_phone TEXT,
  email_address TEXT,
  
  -- Tenure and boundaries
  land_tenure land_tenure,
  has_boundary_disputes BOOLEAN DEFAULT FALSE,
  boundary_dispute_details TEXT,
  has_boundary_markers BOOLEAN DEFAULT FALSE,
  boundary_marker_type TEXT,
  last_boundary_verification_date DATE,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_waterbodies JSONB DEFAULT '[]'::jsonb,
  linked_protected_areas JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  forest_boundary GEOMETRY(MultiPolygon, 4326),
  guard_post_locations GEOMETRY(MultiPoint, 4326),
  access_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_community_forest_boundary ON acme_community_forest USING GIST (forest_boundary);
CREATE INDEX IF NOT EXISTS idx_community_forest_guard_posts ON acme_community_forest USING GIST (guard_post_locations);
CREATE INDEX IF NOT EXISTS idx_community_forest_access_points ON acme_community_forest USING GIST (access_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_community_forest_name ON acme_community_forest(name);
CREATE INDEX IF NOT EXISTS idx_community_forest_slug ON acme_community_forest(slug);
CREATE INDEX IF NOT EXISTS idx_community_forest_condition ON acme_community_forest(forest_condition);
CREATE INDEX IF NOT EXISTS idx_community_forest_management ON acme_community_forest(forest_management_status);
