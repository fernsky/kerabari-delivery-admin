-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Research center type enum
DO $$ 
BEGIN
  CREATE TYPE research_center_type AS ENUM (
    'INDUSTRIAL_RESEARCH', 
    'AGRICULTURAL_RESEARCH', 
    'TECHNOLOGICAL_RESEARCH',
    'PRODUCT_DEVELOPMENT_CENTER', 
    'INNOVATION_HUB', 
    'TESTING_LABORATORY',
    'QUALITY_CONTROL_CENTER', 
    'INCUBATION_CENTER',
    'TRAINING_AND_RESEARCH_CENTER', 
    'VOCATIONAL_RESEARCH_CENTER', 
    'MIXED_RESEARCH', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Research focus enum
DO $$ 
BEGIN
  CREATE TYPE research_focus_area AS ENUM (
    'MANUFACTURING', 
    'AGRICULTURE', 
    'FOOD_PROCESSING', 
    'TEXTILES', 
    'CONSTRUCTION',
    'RENEWABLE_ENERGY', 
    'PHARMACEUTICALS', 
    'INFORMATION_TECHNOLOGY', 
    'BIOTECHNOLOGY', 
    'HANDICRAFTS',
    'MULTIPLE_SECTORS', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the research_center table
CREATE TABLE IF NOT EXISTS acme_research_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  center_type research_center_type NOT NULL,
  primary_focus_area research_focus_area NOT NULL,
  secondary_focus_areas TEXT,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Registration details
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT, -- Department/Authority
  pan_number VARCHAR(20),
  legal_status TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type VARCHAR(50), -- Government, Private, Public-Private, etc.
  parent_organization TEXT,
  affiliated_institutions TEXT,
  
  -- Facility details
  facility_area_sqm DECIMAL(10, 2),
  research_space_sqm DECIMAL(10, 2),
  laboratory_space_sqm DECIMAL(10, 2),
  office_space_sqm DECIMAL(10, 2),
  training_space_sqm DECIMAL(10, 2),
  facility_ownership VARCHAR(50), -- Owned, Rented, Leased
  building_condition TEXT,
  
  -- Research infrastructure
  has_specialized_laboratories BOOLEAN DEFAULT true,
  laboratory_types TEXT,
  has_testing_equipment BOOLEAN DEFAULT true,
  main_equipment_details TEXT,
  has_pilot_production_facility BOOLEAN DEFAULT false,
  pilot_facility_details TEXT,
  has_computer_facilities BOOLEAN DEFAULT true,
  computer_facility_details TEXT,
  has_library BOOLEAN DEFAULT false,
  library_details TEXT,
  has_conference_facilities BOOLEAN DEFAULT false,
  conference_facility_details TEXT,
  other_infrastructure TEXT,
  
  -- Research activities
  current_research_projects TEXT,
  completed_research_projects TEXT,
  planned_research_projects TEXT,
  research_methodologies TEXT,
  data_collection_methods TEXT,
  analysis_capabilities TEXT,
  specialization_areas TEXT,
  
  -- Human resources
  total_staff INTEGER,
  research_scientists INTEGER,
  technical_staff INTEGER,
  administrative_staff INTEGER,
  support_staff INTEGER,
  phd_holders INTEGER,
  masters_holders INTEGER,
  staff_with_international_experience INTEGER,
  visiting_researchers INTEGER,
  
  -- Funding and financial aspects
  primary_funding_sources TEXT,
  annual_operating_budget_npr DECIMAL(18, 2),
  research_grant_funding_npr DECIMAL(18, 2),
  commercial_service_revenue_npr DECIMAL(18, 2),
  has_sustainable_funding BOOLEAN DEFAULT false,
  funding_challenges TEXT,
  budget_allocation_details TEXT,
  
  -- Outputs and achievements
  patents_registered INTEGER,
  papers_published INTEGER,
  technologies_developed INTEGER,
  products_developed INTEGER,
  processes_improved INTEGER,
  standards_developed INTEGER,
  major_achievements TEXT,
  impact_on_industry TEXT,
  
  -- Services offered
  testing_services_offered TEXT,
  certification_services BOOLEAN DEFAULT false,
  certification_details TEXT,
  training_services BOOLEAN DEFAULT true,
  training_details TEXT,
  consultancy_services BOOLEAN DEFAULT true,
  consultancy_details TEXT,
  product_development_services BOOLEAN DEFAULT false,
  technology_transfer_services BOOLEAN DEFAULT false,
  other_services TEXT,
  
  -- Collaboration and partnerships
  industry_partnerships TEXT,
  academic_partnerships TEXT,
  government_partnerships TEXT,
  international_partnerships TEXT,
  joint_research_projects TEXT,
  collaborative_achievements TEXT,
  
  -- Knowledge dissemination
  publishes_research_findings BOOLEAN DEFAULT true,
  publication_details TEXT,
  conducts_seminars_workshops BOOLEAN DEFAULT true,
  seminar_workshop_frequency TEXT,
  has_technology_demonstration BOOLEAN DEFAULT false,
  technology_demonstration_details TEXT,
  training_programs_conducted TEXT,
  knowledge_sharing_mechanisms TEXT,
  
  -- Technology transfer
  technologies_transferred INTEGER,
  technology_transfer_mechanism TEXT,
  commercialization_success TEXT,
  intellectual_property_strategy TEXT,
  startup_incubation BOOLEAN DEFAULT false,
  incubated_startups INTEGER,
  business_development_support TEXT,
  
  -- Quality and standards
  follows_quality_standards BOOLEAN DEFAULT true,
  quality_standards_details TEXT,
  has_accreditations BOOLEAN DEFAULT false,
  accreditation_details TEXT,
  laboratory_certification TEXT,
  quality_management_system TEXT,
  
  -- Challenges and needs
  research_infrastructure_needs TEXT,
  human_resource_challenges TEXT,
  funding_challenges TEXT,
  technology_challenges TEXT,
  collaboration_challenges TEXT,
  regulatory_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  new_research_areas TEXT,
  infrastructure_development_plans TEXT,
  capacity_building_plans TEXT,
  strategic_goals TEXT,
  
  -- Community and industry engagement
  industry_outreach_programs TEXT,
  community_engagement TEXT,
  public_awareness_activities TEXT,
  industry_problem_solving TEXT,
  stakeholder_involvement TEXT,
  
  -- Impact assessment
  economic_impact TEXT,
  social_impact TEXT,
  environmental_impact TEXT,
  research_utilization TEXT,
  success_stories TEXT,
  
  -- Contact information
  director_name TEXT,
  director_qualification TEXT,
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  
  -- Additional details
  unique_capabilities TEXT,
  comparative_advantages TEXT,
  historical_significance TEXT,
  recognition_and_awards TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_research_center_location_point ON acme_research_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_research_center_boundary ON acme_research_center USING GIST (facility_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_research_center_name ON acme_research_center(name);
CREATE INDEX IF NOT EXISTS idx_research_center_slug ON acme_research_center(slug);
CREATE INDEX IF NOT EXISTS idx_research_center_type ON acme_research_center(center_type);
CREATE INDEX IF NOT EXISTS idx_research_center_focus ON acme_research_center(primary_focus_area);
