-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- School type enum
DO $$ 
BEGIN
  CREATE TYPE school_type AS ENUM (
    'PRIMARY', 'LOWER_SECONDARY', 'SECONDARY', 'HIGHER_SECONDARY',
    'INTEGRATED', 'BASIC', 'SPECIAL_EDUCATION', 'ALTERNATIVE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- School category enum
DO $$ 
BEGIN
  CREATE TYPE school_category AS ENUM (
    'GENERAL', 'SCIENCE', 'MANAGEMENT', 'HUMANITIES', 'TECHNICAL',
    'VOCATIONAL', 'RELIGIOUS', 'RESIDENTIAL', 'DAY_SCHOOL', 
    'SPECIAL_NEEDS', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the school table
CREATE TABLE IF NOT EXISTS acme_school (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  school_type school_type NOT NULL,
  school_category school_category,
  status educational_institution_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  
  -- Basic information
  established_year INTEGER,
  registration_number TEXT,
  pan_number TEXT,
  ownership_type educational_institution_ownership NOT NULL,
  affiliated_to TEXT,
  affiliation_number TEXT,
  principal_name TEXT,
  education_medium education_medium,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  built_up_area_sqm DECIMAL(10, 2),
  building_count INTEGER,
  total_classrooms INTEGER,
  library_room_count INTEGER,
  lab_room_count INTEGER,
  admin_room_count INTEGER,
  toilet_count INTEGER,
  has_separate_toilets_for_girls BOOLEAN DEFAULT false,
  has_disabled_friendly_toilets BOOLEAN DEFAULT false,
  has_compound_wall BOOLEAN DEFAULT false,
  has_playground BOOLEAN DEFAULT false,
  playground_area_sqm DECIMAL(10, 2),
  has_sports_facilities BOOLEAN DEFAULT false,
  sports_facilities_details TEXT,
  building_condition infrastructure_condition,
  classroom_condition TEXT,
  furniture_condition TEXT,
  infrastructure_remarks TEXT,
  
  -- Academic information
  academic_calendar TEXT, -- Nepal/Bikram Sambat, Western/Gregorian
  annual_school_days INTEGER,
  class_start_time TIME,
  class_end_time TIME,
  working_days_per_week INTEGER,
  lowest_grade_offered TEXT,
  highest_grade_offered TEXT,
  grade_range TEXT, -- E.g., "1-10" or "Pre-Primary to 12"
  curriculum_followed TEXT, -- Nepal Government, CBSE, Cambridge, etc.
  teaching_approaches TEXT,
  assessment_methods TEXT,
  student_teacher_ratio DECIMAL(5, 2),
  average_class_size INTEGER,
  
  -- Enrollment and capacity
  total_enrolled_students INTEGER,
  female_students_count INTEGER,
  male_students_count INTEGER,
  other_gender_students_count INTEGER,
  student_capacity INTEGER,
  admission_process TEXT,
  has_scholarship_program BOOLEAN DEFAULT false,
  scholarship_details TEXT,
  average_attendance_rate DECIMAL(5, 2),
  dropout_rate DECIMAL(5, 2),
  
  -- Staff information
  total_teaching_staff INTEGER,
  female_teachers_count INTEGER,
  male_teachers_count INTEGER,
  teachers_with_required_qualification INTEGER,
  permanent_teachers INTEGER,
  temporary_teachers INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  teacher_vacancy_count INTEGER,
  staffing_adequacy staffing_adequacy,
  
  -- Utilities and facilities
  electricity_availability utility_availability,
  water_availability utility_availability,
  internet_availability utility_availability,
  internet_type TEXT,
  internet_speed_mbps DECIMAL(7, 2),
  has_canteen BOOLEAN DEFAULT false,
  canteen_details TEXT,
  has_hostel BOOLEAN DEFAULT false,
  hostel_capacity INTEGER,
  has_transportation_service BOOLEAN DEFAULT false,
  transportation_details TEXT,
  has_health_checkup_program BOOLEAN DEFAULT false,
  health_program_details TEXT,
  has_drinking_water BOOLEAN DEFAULT true,
  drinking_water_source TEXT,
  
  -- Academic facilities
  library_status facility_availability,
  book_count INTEGER,
  has_digital_library BOOLEAN DEFAULT false,
  digital_library_details TEXT,
  science_lab_status facility_availability,
  computer_lab_status facility_availability,
  computer_count INTEGER,
  student_computer_ratio DECIMAL(7, 2),
  has_smart_classes BOOLEAN DEFAULT false,
  smart_class_count INTEGER,
  
  -- Technology integration
  uses_school_management_system BOOLEAN DEFAULT false,
  software_used TEXT,
  digital_readiness digital_readiness_level,
  has_ict_curriculum BOOLEAN DEFAULT false,
  technology_integration_details TEXT,
  
  -- Academic performance
  national_exam_pass_rate DECIMAL(5, 2),
  average_graduation_rate DECIMAL(5, 2),
  last_year_top_gpa DECIMAL(3, 2),
  notable_achievements TEXT,
  academic_rank_district TEXT,
  academic_rank_national TEXT,
  
  -- Extracurricular activities
  has_extracurricular_activities BOOLEAN DEFAULT true,
  extracurricular_details TEXT,
  sports_offered TEXT,
  cultural_activities TEXT,
  clubs_societies TEXT,
  annual_events TEXT,
  
  -- Finances
  annual_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  monthly_fee_structure TEXT,
  additional_fees TEXT,
  financial_aid_availability BOOLEAN DEFAULT false,
  financial_aid_details TEXT,
  
  -- Management and governance
  has_school_management_committee BOOLEAN DEFAULT true,
  committee_structure TEXT,
  meeting_frequency TEXT,
  parent_involvement TEXT,
  community_involvement TEXT,
  has_parent_teacher_association BOOLEAN DEFAULT false,
  pta_activities TEXT,
  
  -- Safety and security
  has_safety_policy BOOLEAN DEFAULT false,
  safety_measures TEXT,
  has_disaster_preparedness BOOLEAN DEFAULT false,
  disaster_preparedness_details TEXT,
  has_first_aid_facilities BOOLEAN DEFAULT false,
  has_emergency_protocols BOOLEAN DEFAULT false,
  has_cctv_system BOOLEAN DEFAULT false,
  
  -- Compliance and quality
  is_government_approved BOOLEAN DEFAULT true,
  last_inspection_date DATE,
  inspection_rating TEXT,
  accreditation_status TEXT,
  accreditation_details TEXT,
  quality_improvement_initiatives TEXT,
  
  -- Accessibility
  accessibility_level educational_accessibility_level,
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_availability TEXT,
  disabled_accessibility TEXT,
  
  -- Community relations
  community_service_programs TEXT,
  community_engagement_activities TEXT,
  alumni_association BOOLEAN DEFAULT false,
  alumni_activities TEXT,
  
  -- Development plans
  development_plans TEXT,
  infrastructure_improvement_plans TEXT,
  academic_improvement_plans TEXT,
  recent_improvements TEXT,
  funding_needs TEXT,
  
  -- Challenges and issues
  major_challenges TEXT,
  infrastructure_challenges TEXT,
  academic_challenges TEXT,
  staffing_challenges TEXT,
  financial_challenges TEXT,
  
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
  campus_boundary GEOMETRY(Polygon, 4326),
  buildings GEOMETRY(MultiPolygon, 4326),
  playgrounds GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_school_location_point ON acme_school USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_school_campus_boundary ON acme_school USING GIST (campus_boundary);
CREATE INDEX IF NOT EXISTS idx_school_buildings ON acme_school USING GIST (buildings);
CREATE INDEX IF NOT EXISTS idx_school_playgrounds ON acme_school USING GIST (playgrounds);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_school_name ON acme_school(name);
CREATE INDEX IF NOT EXISTS idx_school_slug ON acme_school(slug);
CREATE INDEX IF NOT EXISTS idx_school_type ON acme_school(school_type);
CREATE INDEX IF NOT EXISTS idx_school_status ON acme_school(status);
CREATE INDEX IF NOT EXISTS idx_school_ownership ON acme_school(ownership_type);
