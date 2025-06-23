-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Library type enum
DO $$ 
BEGIN
  CREATE TYPE library_type AS ENUM (
    'PUBLIC', 'ACADEMIC', 'SCHOOL', 'SPECIAL', 'RESEARCH',
    'COMMUNITY', 'CHILDRENS', 'MOBILE', 'DIGITAL', 'SPECIALIZED',
    'PRIVATE', 'GOVERNMENT', 'RELIGIOUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the library table
CREATE TABLE IF NOT EXISTS acme_library (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  library_type library_type NOT NULL,
  status educational_institution_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number TEXT,
  ownership_type educational_institution_ownership NOT NULL,
  parent_institution TEXT,
  chief_librarian_name TEXT,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  built_up_area_sqm DECIMAL(10, 2),
  floors_count INTEGER,
  reading_room_count INTEGER,
  seating_capacity INTEGER,
  shelf_capacity_meters DECIMAL(10, 2),
  has_separate_sections BOOLEAN DEFAULT true,
  section_details TEXT,
  has_toilet BOOLEAN DEFAULT true,
  has_separate_toilets_by_gender BOOLEAN DEFAULT false,
  has_disabled_friendly_facilities BOOLEAN DEFAULT false,
  building_condition infrastructure_condition,
  furniture_condition TEXT,
  infrastructure_remarks TEXT,
  
  -- Collection information
  total_volumes_count INTEGER,
  book_count INTEGER,
  reference_material_count INTEGER,
  periodical_count INTEGER,
  newspaper_count INTEGER,
  magazine_count INTEGER,
  journal_count INTEGER,
  thesis_dissertation_count INTEGER,
  government_document_count INTEGER,
  rare_book_count INTEGER,
  manuscript_count INTEGER,
  audio_visual_material_count INTEGER,
  digital_resource_count INTEGER,
  subject_categories TEXT,
  language_distribution TEXT,
  collection_specialties TEXT,
  oldest_material_year INTEGER,
  acquisition_policy TEXT,
  
  -- Services and operations
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  annual_operating_days INTEGER,
  has_membership_system BOOLEAN DEFAULT true,
  membership_types TEXT,
  total_members_count INTEGER,
  active_members_count INTEGER,
  membership_fee_structure TEXT,
  has_lending_service BOOLEAN DEFAULT true,
  lending_policy TEXT,
  reference_service_availability BOOLEAN DEFAULT true,
  has_online_catalog BOOLEAN DEFAULT false,
  has_reservation_system BOOLEAN DEFAULT false,
  average_daily_visitors INTEGER,
  average_daily_circulation INTEGER,
  
  -- Staff information
  total_staff_count INTEGER,
  professional_librarian_count INTEGER,
  female_staff_count INTEGER,
  male_staff_count INTEGER,
  full_time_staff_count INTEGER,
  part_time_staff_count INTEGER,
  volunteer_count INTEGER,
  staff_qualification_details TEXT,
  
  -- Technology and digitization
  automation_status TEXT,
  library_management_software TEXT,
  catalog_system TEXT,
  classification_system TEXT, -- DDC, UDC, etc.
  has_digital_catalog BOOLEAN DEFAULT false,
  digital_catalog_access_method TEXT,
  has_digital_archive BOOLEAN DEFAULT false,
  digital_archive_details TEXT,
  internet_availability utility_availability,
  internet_access_for_users BOOLEAN DEFAULT false,
  computer_count_for_users INTEGER,
  has_online_resources BOOLEAN DEFAULT false,
  online_resource_details TEXT,
  has_digitization_program BOOLEAN DEFAULT false,
  digitization_progress TEXT,
  
  -- Utilities and facilities
  electricity_availability utility_availability,
  power_backup_availability BOOLEAN DEFAULT false,
  water_availability utility_availability,
  has_air_conditioning BOOLEAN DEFAULT false,
  has_reading_room_lighting BOOLEAN DEFAULT true,
  lighting_quality TEXT,
  has_photocopying_service BOOLEAN DEFAULT false,
  has_printing_service BOOLEAN DEFAULT false,
  has_scanning_service BOOLEAN DEFAULT false,
  has_cafeteria BOOLEAN DEFAULT false,
  has_drinking_water BOOLEAN DEFAULT true,
  
  -- Programs and activities
  conducts_literacy_programs BOOLEAN DEFAULT false,
  conducts_reading_programs BOOLEAN DEFAULT false,
  conducts_workshops_trainings BOOLEAN DEFAULT false,
  conducts_author_events BOOLEAN DEFAULT false,
  conducts_exhibitions BOOLEAN DEFAULT false,
  program_details TEXT,
  outreach_activities TEXT,
  community_engagement TEXT,
  
  -- Collaboration and networking
  collaborative_partnerships TEXT,
  library_network_memberships TEXT,
  interlibrary_loan_services BOOLEAN DEFAULT false,
  resource_sharing_agreements TEXT,
  collaborative_programs TEXT,
  
  -- Finances
  annual_budget_npr DECIMAL(14, 2),
  budget_allocation_categories TEXT,
  annual_acquisition_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  self_generated_income_npr DECIMAL(14, 2),
  income_generating_activities TEXT,
  financial_sustainability TEXT,
  
  -- Preservation and conservation
  has_preservation_policy BOOLEAN DEFAULT false,
  preservation_measures TEXT,
  has_conservation_program BOOLEAN DEFAULT false,
  conservation_facilities TEXT,
  rare_material_storage TEXT,
  environmental_control_measures TEXT,
  
  -- Safety and security
  has_safety_measures BOOLEAN DEFAULT false,
  safety_measure_details TEXT,
  has_fire_safety_equipment BOOLEAN DEFAULT false,
  has_disaster_management_plan BOOLEAN DEFAULT false,
  has_security_system BOOLEAN DEFAULT false,
  security_system_details TEXT,
  has_cctv BOOLEAN DEFAULT false,
  material_security_measures TEXT,
  
  -- User services
  has_reference_desk BOOLEAN DEFAULT true,
  has_information_service BOOLEAN DEFAULT true,
  has_reading_promotion BOOLEAN DEFAULT true,
  has_children_section BOOLEAN DEFAULT false,
  childrens_section_details TEXT,
  has_user_orientation_program BOOLEAN DEFAULT false,
  user_support_services TEXT,
  accessibility_features TEXT,
  
  -- Management and governance
  has_library_committee BOOLEAN DEFAULT true,
  management_structure TEXT,
  decision_making_process TEXT,
  has_strategic_plan BOOLEAN DEFAULT false,
  has_collection_development_policy BOOLEAN DEFAULT false,
  has_user_policy BOOLEAN DEFAULT false,
  
  -- Performance and impact
  performance_metrics TEXT,
  impact_assessment TEXT,
  user_satisfaction_surveys BOOLEAN DEFAULT false,
  user_feedback_mechanism BOOLEAN DEFAULT false,
  community_impact TEXT,
  success_stories TEXT,
  
  -- Challenges and needs
  operational_challenges TEXT,
  infrastructure_needs TEXT,
  collection_development_needs TEXT,
  technology_upgrade_needs TEXT,
  staff_development_needs TEXT,
  
  -- Development plans
  future_development_plans TEXT,
  expansion_plans TEXT,
  digitization_plans TEXT,
  service_improvement_plans TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_phone TEXT,
  email TEXT,
  website TEXT,
  social_media_links TEXT,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_library_location_point ON acme_library USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_library_building_footprint ON acme_library USING GIST (building_footprint);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_library_name ON acme_library(name);
CREATE INDEX IF NOT EXISTS idx_library_slug ON acme_library(slug);
CREATE INDEX IF NOT EXISTS idx_library_type ON acme_library(library_type);
CREATE INDEX IF NOT EXISTS idx_library_status ON acme_library(status);
CREATE INDEX IF NOT EXISTS idx_library_ownership ON acme_library(ownership_type);
