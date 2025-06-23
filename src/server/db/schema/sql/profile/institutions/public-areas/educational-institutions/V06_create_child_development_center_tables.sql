-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Child development center type enum
DO $$ 
BEGIN
  CREATE TYPE child_center_type AS ENUM (
    'ECD_CENTER', 'DAYCARE', 'MONTESSORI', 'KINDERGARTEN',
    'PREPARATORY', 'PRE_PRIMARY', 'INTEGRATED_CHILD_CENTER',
    'COMMUNITY_BASED', 'MOBILE_CHILD_CENTER', 'SPECIAL_NEEDS_CENTER',
    'REMOTE_AREA_CENTER', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Child development approach enum
DO $$ 
BEGIN
  CREATE TYPE child_development_approach AS ENUM (
    'MONTESSORI', 'REGGIO_EMILIA', 'WALDORF_STEINER', 
    'PLAY_BASED', 'PROJECT_BASED', 'TRADITIONAL', 'MULTIPLE_INTELLIGENCE',
    'HOLISTIC', 'CHILD_CENTERED', 'ECLECTIC', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the child_development_center table
CREATE TABLE IF NOT EXISTS acme_child_development_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  center_type child_center_type NOT NULL,
  status educational_institution_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number TEXT,
  affiliated_with TEXT,
  ownership_type educational_institution_ownership NOT NULL,
  coordinator_name TEXT,
  development_approach child_development_approach,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  indoor_area_sqm DECIMAL(10, 2),
  outdoor_area_sqm DECIMAL(10, 2),
  building_condition infrastructure_condition,
  room_count INTEGER,
  has_separate_activity_areas BOOLEAN DEFAULT true,
  has_outdoor_play_area BOOLEAN DEFAULT true,
  play_area_details TEXT,
  has_safety_features BOOLEAN DEFAULT true,
  safety_features_details TEXT,
  has_child_friendly_toilets BOOLEAN DEFAULT true,
  toilet_count INTEGER,
  has_hand_washing_facilities BOOLEAN DEFAULT true,
  handwashing_facility_count INTEGER,
  has_drinking_water BOOLEAN DEFAULT true,
  water_source TEXT,
  has_kitchen_facility BOOLEAN DEFAULT false,
  kitchen_details TEXT,
  has_proper_ventilation BOOLEAN DEFAULT true,
  has_proper_lighting BOOLEAN DEFAULT true,
  has_proper_furniture BOOLEAN DEFAULT true,
  furniture_condition TEXT,
  
  -- Educational programs
  age_group_served TEXT, -- E.g., "3-5 years"
  minimum_age_months INTEGER,
  maximum_age_years INTEGER,
  daily_schedule TEXT,
  curriculum_followed TEXT,
  learning_materials_available TEXT,
  language_of_instruction education_medium,
  special_programs TEXT,
  learning_through_play_approach TEXT,
  assessment_methods TEXT,
  parent_involvement_programs TEXT,
  
  -- Enrollment and capacity
  total_capacity INTEGER,
  current_enrollment INTEGER,
  female_children_count INTEGER,
  male_children_count INTEGER,
  children_with_disabilities_count INTEGER,
  average_attendance_rate DECIMAL(5, 2),
  child_to_facilitator_ratio DECIMAL(4, 1),
  operation_hours TEXT,
  operation_days TEXT,
  
  -- Staff information
  total_staff_count INTEGER,
  qualified_facilitator_count INTEGER,
  female_facilitator_count INTEGER,
  male_facilitator_count INTEGER,
  facilitator_qualification TEXT,
  supporting_staff_count INTEGER,
  staff_training_status TEXT,
  gets_regular_refresher_training BOOLEAN DEFAULT false,
  training_details TEXT,
  
  -- Health and nutrition
  provides_midday_meal BOOLEAN DEFAULT false,
  meal_program_details TEXT,
  nutrition_status_monitoring BOOLEAN DEFAULT false,
  nutrition_monitoring_details TEXT,
  regular_health_checkups BOOLEAN DEFAULT false,
  health_checkup_frequency TEXT,
  deworming_program BOOLEAN DEFAULT false,
  immunization_monitoring BOOLEAN DEFAULT false,
  growth_monitoring BOOLEAN DEFAULT false,
  hygiene_promotion_activities TEXT,
  
  -- Special needs and inclusion
  caters_to_special_needs BOOLEAN DEFAULT false,
  special_needs_facilities TEXT,
  has_inclusive_education_approach BOOLEAN DEFAULT false,
  inclusion_approach_details TEXT,
  accessibility_features TEXT,
  
  -- Material and resources
  has_adequate_play_materials BOOLEAN DEFAULT true,
  play_material_types TEXT,
  has_adequate_learning_materials BOOLEAN DEFAULT true,
  learning_material_types TEXT,
  has_storybooks BOOLEAN DEFAULT true,
  storybook_count INTEGER,
  has_outdoor_play_equipment BOOLEAN DEFAULT true,
  outdoor_equipment_details TEXT,
  has_multimedia_resources BOOLEAN DEFAULT false,
  multimedia_resource_details TEXT,
  
  -- Safety and child protection
  has_child_protection_policy BOOLEAN DEFAULT false,
  child_protection_measures TEXT,
  has_emergency_protocols BOOLEAN DEFAULT false,
  emergency_protocol_details TEXT,
  has_first_aid_kit BOOLEAN DEFAULT true,
  staff_trained_in_first_aid BOOLEAN DEFAULT false,
  boundary_wall_or_fence BOOLEAN DEFAULT true,
  visitor_screening_process BOOLEAN DEFAULT false,
  
  -- Monitoring and quality
  regular_government_inspection BOOLEAN DEFAULT true,
  last_inspection_date DATE,
  inspection_findings TEXT,
  has_quality_standards BOOLEAN DEFAULT false,
  quality_standard_details TEXT,
  internal_monitoring_system TEXT,
  parent_feedback_mechanism BOOLEAN DEFAULT false,
  
  -- Community involvement
  parental_involvement_level TEXT,
  community_support_details TEXT,
  parent_teacher_meetings_frequency TEXT,
  community_resource_persons_involvement TEXT,
  
  -- Finances
  monthly_fee_npr DECIMAL(10, 2),
  fee_structure TEXT,
  funding_sources TEXT,
  scholarship_provisions TEXT,
  financial_sustainability TEXT,
  
  -- Linkages
  linked_with_primary_school BOOLEAN DEFAULT false,
  primary_school_linkage_details TEXT,
  linked_with_health_facility BOOLEAN DEFAULT false,
  health_facility_linkage_details TEXT,
  other_partnerships TEXT,
  
  -- Challenges and needs
  major_challenges TEXT,
  infrastructure_needs TEXT,
  training_needs TEXT,
  material_needs TEXT,
  priority_improvements TEXT,
  
  -- Development plans
  future_development_plans TEXT,
  expansion_plans TEXT,
  quality_improvement_plans TEXT,
  
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
CREATE INDEX IF NOT EXISTS idx_cdc_location_point ON acme_child_development_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_cdc_center_boundary ON acme_child_development_center USING GIST (center_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_cdc_name ON acme_child_development_center(name);
CREATE INDEX IF NOT EXISTS idx_cdc_slug ON acme_child_development_center(slug);
CREATE INDEX IF NOT EXISTS idx_cdc_type ON acme_child_development_center(center_type);
CREATE INDEX IF NOT EXISTS idx_cdc_status ON acme_child_development_center(status);
CREATE INDEX IF NOT EXISTS idx_cdc_ownership ON acme_child_development_center(ownership_type);
