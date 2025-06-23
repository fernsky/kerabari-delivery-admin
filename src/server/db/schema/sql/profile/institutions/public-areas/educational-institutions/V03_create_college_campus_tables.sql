-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- College type enum
DO $$ 
BEGIN
  CREATE TYPE college_type AS ENUM (
    'GENERAL', 'TECHNICAL', 'MANAGEMENT', 'HUMANITIES', 'SCIENCE',
    'MEDICAL', 'ENGINEERING', 'AGRICULTURE', 'FORESTRY', 'LAW',
    'COMPUTER_SCIENCE', 'FINE_ARTS', 'EDUCATION', 'VOCATIONAL',
    'MULTIDISCIPLINARY', 'COMMUNITY', 'CONSTITUENT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the college_campus table
CREATE TABLE IF NOT EXISTS acme_college_campus (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  college_type college_type NOT NULL,
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
  affiliated_university TEXT,
  affiliation_number TEXT,
  campus_chief_name TEXT,
  education_medium education_medium,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  built_up_area_sqm DECIMAL(10, 2),
  building_count INTEGER,
  total_classrooms INTEGER,
  library_room_count INTEGER,
  lab_count INTEGER,
  admin_block_count INTEGER,
  department_count INTEGER,
  toilet_count INTEGER,
  has_separate_toilets_for_females BOOLEAN DEFAULT false,
  has_disabled_friendly_toilets BOOLEAN DEFAULT false,
  has_compound_wall BOOLEAN DEFAULT false,
  has_open_ground BOOLEAN DEFAULT false,
  ground_area_sqm DECIMAL(10, 2),
  has_sports_facilities BOOLEAN DEFAULT false,
  sports_facilities_details TEXT,
  building_condition infrastructure_condition,
  classroom_condition TEXT,
  infrastructure_remarks TEXT,
  
  -- Academic information
  academic_calendar TEXT, -- Nepal/Bikram Sambat, Western/Gregorian
  annual_working_days INTEGER,
  class_schedule TEXT, -- Morning, Day, Evening shifts
  working_days_per_week INTEGER,
  degree_levels_offered TEXT, -- Bachelors, Masters, MPhil, PhD
  programs_offered TEXT,
  specializations_offered TEXT,
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
  phd_holder_faculty_count INTEGER,
  masters_holder_faculty_count INTEGER,
  bachelor_holder_faculty_count INTEGER,
  female_faculty_count INTEGER,
  male_faculty_count INTEGER,
  full_time_faculty_count INTEGER,
  part_time_faculty_count INTEGER,
  visiting_faculty_count INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  faculty_vacancy_count INTEGER,
  staffing_adequacy staffing_adequacy,
  
  -- Utilities and facilities
  electricity_availability utility_availability,
  water_availability utility_availability,
  internet_availability utility_availability,
  internet_type TEXT,
  internet_speed_mbps DECIMAL(7, 2),
  has_cafeteria BOOLEAN DEFAULT false,
  cafeteria_capacity INTEGER,
  has_hostel BOOLEAN DEFAULT false,
  male_hostel_capacity INTEGER,
  female_hostel_capacity INTEGER,
  has_transportation_service BOOLEAN DEFAULT false,
  transportation_details TEXT,
  has_health_services BOOLEAN DEFAULT false,
  health_services_details TEXT,
  has_drinking_water BOOLEAN DEFAULT true,
  drinking_water_source TEXT,
  
  -- Academic facilities
  library_status facility_availability,
  book_count INTEGER,
  journal_subscription_count INTEGER,
  has_digital_library BOOLEAN DEFAULT false,
  digital_library_details TEXT,
  lab_status facility_availability,
  lab_details TEXT,
  computer_lab_count INTEGER,
  computer_count INTEGER,
  student_computer_ratio DECIMAL(7, 2),
  has_smart_classrooms BOOLEAN DEFAULT false,
  smart_classroom_count INTEGER,
  has_conference_hall BOOLEAN DEFAULT false,
  conference_hall_capacity INTEGER,
  has_seminar_hall BOOLEAN DEFAULT false,
  seminar_hall_capacity INTEGER,
  has_auditorium BOOLEAN DEFAULT false,
  auditorium_capacity INTEGER,
  
  -- Technology integration
  uses_campus_management_system BOOLEAN DEFAULT false,
  software_used TEXT,
  digital_readiness digital_readiness_level,
  has_online_learning_platform BOOLEAN DEFAULT false,
  online_learning_platform_details TEXT,
  has_research_facilities BOOLEAN DEFAULT false,
  research_facility_details TEXT,
  
  -- Academic performance
  graduation_rate DECIMAL(5, 2),
  employment_rate_of_graduates DECIMAL(5, 2),
  notable_achievements TEXT,
  notable_alumni TEXT,
  academic_rank_provincial TEXT,
  academic_rank_national TEXT,
  
  -- Extracurricular activities
  has_student_clubs BOOLEAN DEFAULT true,
  student_club_count INTEGER,
  student_club_details TEXT,
  sports_offered TEXT,
  cultural_activities TEXT,
  annual_events TEXT,
  
  -- Research and publications
  annual_research_budget_npr DECIMAL(14, 2),
  research_projects_count INTEGER,
  research_focus_areas TEXT,
  faculty_publication_count INTEGER,
  student_research_involvement TEXT,
  research_partnerships TEXT,
  
  -- Finances
  annual_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  tuition_fee_structure TEXT,
  additional_fees TEXT,
  financial_aid_availability BOOLEAN DEFAULT false,
  financial_aid_details TEXT,
  has_endowment_fund BOOLEAN DEFAULT false,
  endowment_fund_details TEXT,
  
  -- Management and governance
  has_campus_management_committee BOOLEAN DEFAULT true,
  committee_structure TEXT,
  meeting_frequency TEXT,
  has_student_representation BOOLEAN DEFAULT false,
  has_quality_assurance_cell BOOLEAN DEFAULT false,
  quality_assurance_details TEXT,
  governance_model TEXT,
  
  -- Safety and security
  has_safety_policy BOOLEAN DEFAULT false,
  safety_measures TEXT,
  has_disaster_management_plan BOOLEAN DEFAULT false,
  disaster_management_details TEXT,
  has_medical_facility BOOLEAN DEFAULT false,
  medical_facility_details TEXT,
  has_grievance_redressal_mechanism BOOLEAN DEFAULT false,
  has_anti_ragging_committee BOOLEAN DEFAULT false,
  has_cctv_system BOOLEAN DEFAULT false,
  security_staff_count INTEGER,
  
  -- Compliance and quality
  accreditation_status TEXT,
  accreditation_body TEXT,
  accreditation_date DATE,
  accreditation_grade TEXT,
  last_quality_audit_date DATE,
  quality_audit_remarks TEXT,
  quality_initiatives TEXT,
  
  -- Accessibility
  accessibility_level educational_accessibility_level,
  distance_from_city_center_km DECIMAL(6, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  disabled_accessibility TEXT,
  
  -- Community relations
  has_extension_activities BOOLEAN DEFAULT false,
  extension_activity_details TEXT,
  community_engagement_programs TEXT,
  industry_linkages TEXT,
  alumni_association_status TEXT,
  alumni_activities TEXT,
  
  -- Development plans
  strategic_development_plan TEXT,
  infrastructure_expansion_plans TEXT,
  academic_development_plans TEXT,
  recent_developments TEXT,
  funding_requirements TEXT,
  
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
  open_areas GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_college_location_point ON acme_college_campus USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_college_campus_boundary ON acme_college_campus USING GIST (campus_boundary);
CREATE INDEX IF NOT EXISTS idx_college_buildings ON acme_college_campus USING GIST (buildings);
CREATE INDEX IF NOT EXISTS idx_college_open_areas ON acme_college_campus USING GIST (open_areas);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_college_name ON acme_college_campus(name);
CREATE INDEX IF NOT EXISTS idx_college_slug ON acme_college_campus(slug);
CREATE INDEX IF NOT EXISTS idx_college_type ON acme_college_campus(college_type);
CREATE INDEX IF NOT EXISTS idx_college_status ON acme_college_campus(status);
CREATE INDEX IF NOT EXISTS idx_college_ownership ON acme_college_campus(ownership_type);
