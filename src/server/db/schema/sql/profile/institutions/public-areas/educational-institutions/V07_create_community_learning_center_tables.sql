-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Community learning center type enum
DO $$ 
BEGIN
  CREATE TYPE community_learning_center_type AS ENUM (
    'GENERAL', 'LITERACY', 'VOCATIONAL', 'ICT_FOCUSED', 
    'AGRICULTURAL', 'HEALTH_FOCUSED', 'WOMEN_FOCUSED', 
    'YOUTH_FOCUSED', 'MULTI_PURPOSE', 'ENVIRONMENTAL', 
    'CULTURAL', 'MOBILE', 'REMOTE_AREA', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the community_learning_center table
CREATE TABLE IF NOT EXISTS acme_community_learning_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  center_type community_learning_center_type NOT NULL,
  status educational_institution_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number TEXT,
  registration_authority TEXT,
  ownership_type educational_institution_ownership NOT NULL,
  coordinator_name TEXT,
  management_committee_chair TEXT,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  building_type TEXT, -- Own building, Rented, Community building, etc.
  building_condition infrastructure_condition,
  room_count INTEGER,
  classroom_count INTEGER,
  meeting_hall_available BOOLEAN DEFAULT false,
  meeting_hall_capacity INTEGER,
  computer_lab_available BOOLEAN DEFAULT false,
  computer_count INTEGER,
  library_corner_available BOOLEAN DEFAULT false,
  library_details TEXT,
  toilet_available BOOLEAN DEFAULT true,
  toilet_count INTEGER,
  has_separate_toilets_by_gender BOOLEAN DEFAULT false,
  has_disabled_friendly_facilities BOOLEAN DEFAULT false,
  has_electricity BOOLEAN DEFAULT true,
  electricity_reliability TEXT,
  has_internet BOOLEAN DEFAULT false,
  internet_type TEXT,
  has_drinking_water BOOLEAN DEFAULT true,
  water_source TEXT,
  has_furniture BOOLEAN DEFAULT true,
  furniture_condition TEXT,
  
  -- Programs and services
  primary_focus_areas TEXT,
  literacy_programs BOOLEAN DEFAULT true,
  literacy_program_details TEXT,
  vocational_training_programs BOOLEAN DEFAULT false,
  vocational_training_details TEXT,
  income_generation_programs BOOLEAN DEFAULT false,
  income_generation_details TEXT,
  health_awareness_programs BOOLEAN DEFAULT false,
  health_program_details TEXT,
  agricultural_programs BOOLEAN DEFAULT false,
  agricultural_program_details TEXT,
  environmental_programs BOOLEAN DEFAULT false,
  environmental_program_details TEXT,
  cultural_programs BOOLEAN DEFAULT false,
  cultural_program_details TEXT,
  ict_training_programs BOOLEAN DEFAULT false,
  ict_training_details TEXT,
  life_skills_programs BOOLEAN DEFAULT false,
  life_skills_details TEXT,
  other_programs TEXT,
  
  -- Target groups and participation
  primary_target_groups TEXT,
  secondary_target_groups TEXT,
  annual_beneficiary_count INTEGER,
  female_participation_percentage DECIMAL(5, 2),
  youth_participation_percentage DECIMAL(5, 2),
  marginalized_group_participation BOOLEAN DEFAULT false,
  marginalized_group_details TEXT,
  average_monthly_participant_count INTEGER,
  
  -- Staff information
  total_staff_count INTEGER,
  full_time_staff_count INTEGER,
  part_time_staff_count INTEGER,
  female_staff_count INTEGER,
  male_staff_count INTEGER,
  volunteer_count INTEGER,
  facilitator_qualification TEXT,
  staff_training_status TEXT,
  
  -- Management and governance
  has_management_committee BOOLEAN DEFAULT true,
  management_committee_size INTEGER,
  management_committee_composition TEXT,
  committee_meeting_frequency TEXT,
  community_involvement TEXT,
  decision_making_process TEXT,
  has_operational_guidelines BOOLEAN DEFAULT false,
  
  -- Partners and networks
  funding_agencies TEXT,
  technical_support_partners TEXT,
  local_government_support TEXT,
  network_memberships TEXT,
  collaborative_activities TEXT,
  
  -- Resources and materials
  teaching_learning_materials TEXT,
  equipment_available TEXT,
  reading_materials_available BOOLEAN DEFAULT true,
  reading_material_types TEXT,
  ict_resources_available BOOLEAN DEFAULT false,
  ict_resource_details TEXT,
  audiovisual_resources BOOLEAN DEFAULT false,
  audiovisual_details TEXT,
  
  -- Finances
  annual_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  local_contribution_percentage DECIMAL(5, 2),
  has_income_generating_activities BOOLEAN DEFAULT false,
  income_activity_details TEXT,
  fee_for_services BOOLEAN DEFAULT false,
  fee_structure TEXT,
  financial_sustainability TEXT,
  
  -- Monitoring and evaluation
  monitoring_mechanism TEXT,
  evaluation_frequency TEXT,
  last_evaluation_date DATE,
  reporting_system TEXT,
  success_indicators TEXT,
  impact_assessment TEXT,
  quality_assurance_measures TEXT,
  
  -- Challenges and needs
  major_challenges TEXT,
  infrastructure_needs TEXT,
  training_needs TEXT,
  resource_needs TEXT,
  priority_improvements TEXT,
  
  -- Community impact
  community_changes TEXT,
  success_stories TEXT,
  female_empowerment_impact TEXT,
  livelihood_improvement_impact TEXT,
  education_impact TEXT,
  health_impact TEXT,
  community_harmony_impact TEXT,
  
  -- Development plans
  future_development_plans TEXT,
  expansion_plans TEXT,
  sustainability_plans TEXT,
  program_development_plans TEXT,
  
  -- Operating information
  operating_hours TEXT,
  operating_days TEXT,
  seasonal_variations TEXT,
  special_day_programs TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  center_boundary GEOMETRY(Polygon, 4326),
  service_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_clc_location_point ON acme_community_learning_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_clc_center_boundary ON acme_community_learning_center USING GIST (center_boundary);
CREATE INDEX IF NOT EXISTS idx_clc_service_area ON acme_community_learning_center USING GIST (service_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_clc_name ON acme_community_learning_center(name);
CREATE INDEX IF NOT EXISTS idx_clc_slug ON acme_community_learning_center(slug);
CREATE INDEX IF NOT EXISTS idx_clc_type ON acme_community_learning_center(center_type);
CREATE INDEX IF NOT EXISTS idx_clc_status ON acme_community_learning_center(status);
CREATE INDEX IF NOT EXISTS idx_clc_ownership ON acme_community_learning_center(ownership_type);
