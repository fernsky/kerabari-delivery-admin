-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the disaster management centers table
CREATE TABLE IF NOT EXISTS acme_disaster_management_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  center_type disaster_center_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  elevation_m DECIMAL(8, 2),
  
  -- Basic information
  established_year INTEGER,
  management_type disaster_center_management NOT NULL,
  operating_organization TEXT,
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT,
  jurisdiction TEXT,
  operational_status operational_status NOT NULL,
  
  -- Contact information
  primary_contact_person TEXT,
  primary_contact_position TEXT,
  primary_contact_phone TEXT,
  secondary_contact_person TEXT,
  secondary_contact_phone TEXT,
  emergency_hotline TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Building details
  facility_area_sqm DECIMAL(10, 2),
  building_type TEXT,
  number_of_floors INTEGER,
  number_of_rooms INTEGER,
  has_compound_wall BOOLEAN DEFAULT true,
  compound_wall_description TEXT,
  has_guard_house BOOLEAN DEFAULT false,
  facility_condition facility_condition,
  last_renovation_date DATE,
  
  -- Emergency response capacity
  response_capacity_level TEXT,
  service_coverage_area TEXT,
  service_coverage_population INTEGER,
  response_time_minutes INTEGER,
  operational_radius_km DECIMAL(6, 2),
  
  -- Personnel
  total_staff_count INTEGER,
  professional_staff_count INTEGER,
  administrative_staff_count INTEGER,
  volunteer_count INTEGER,
  staff_shifts TEXT,
  staff_accommodation_available BOOLEAN DEFAULT false,
  staff_accommodation_capacity INTEGER,
  
  -- Equipment and vehicles
  has_emergency_vehicles BOOLEAN DEFAULT false,
  ambulance_count INTEGER,
  fire_engine_count INTEGER,
  rescue_vehicle_count INTEGER,
  water_tanker_count INTEGER,
  boat_count INTEGER,
  helicopter_access BOOLEAN DEFAULT false,
  
  -- Equipment
  has_firefighting_equipment BOOLEAN DEFAULT false,
  firefighting_equipment_details TEXT,
  has_search_rescue_equipment BOOLEAN DEFAULT false,
  search_rescue_equipment_details TEXT,
  has_medical_equipment BOOLEAN DEFAULT false,
  medical_equipment_details TEXT,
  has_communication_equipment BOOLEAN DEFAULT false,
  communication_equipment_details TEXT,
  has_power_backup BOOLEAN DEFAULT true,
  power_backup_details TEXT,
  equipment_condition TEXT,
  equipment_last_updated_date DATE,
  
  -- Facilities
  has_emergency_operation_center BOOLEAN DEFAULT false,
  has_control_room BOOLEAN DEFAULT false,
  has_training_facility BOOLEAN DEFAULT false,
  training_facility_capacity INTEGER,
  has_storage_facility BOOLEAN DEFAULT true,
  storage_capacity_sqm DECIMAL(8, 2),
  has_kitchen_facility BOOLEAN DEFAULT false,
  kitchen_capacity TEXT,
  has_dormitory BOOLEAN DEFAULT false,
  dormitory_capacity INTEGER,
  has_conference_room BOOLEAN DEFAULT false,
  conference_room_capacity INTEGER,
  has_helipad BOOLEAN DEFAULT false,
  helipad_details TEXT,
  
  -- Resources
  has_food_stock BOOLEAN DEFAULT false,
  food_stock_capacity TEXT,
  has_water_reserve BOOLEAN DEFAULT true,
  water_reserve_capacity_liters INTEGER,
  has_fuel_reserve BOOLEAN DEFAULT true,
  fuel_reserve_capacity_liters INTEGER,
  has_medical_supplies BOOLEAN DEFAULT false,
  medical_supplies_details TEXT,
  has_emergency_shelter_materials BOOLEAN DEFAULT false,
  shelter_materials_details TEXT,
  relief_supplies_capacity TEXT,
  resource_last_updated_date DATE,
  
  -- Communication
  communication_systems TEXT,
  has_satellite_phone BOOLEAN DEFAULT false,
  satellite_phone_count INTEGER,
  has_radio_communication BOOLEAN DEFAULT true,
  radio_frequency TEXT,
  has_internet_connectivity BOOLEAN DEFAULT true,
  internet_connectivity_details TEXT,
  has_alert_system BOOLEAN DEFAULT false,
  alert_system_details TEXT,
  has_public_address_system BOOLEAN DEFAULT false,
  
  -- Training and capacity building
  conducts_regular_training BOOLEAN DEFAULT false,
  training_frequency TEXT,
  training_types TEXT,
  last_drill_date DATE,
  drill_frequency TEXT,
  staff_certification_details TEXT,
  community_training_programs TEXT,
  
  -- Special capabilities
  has_fire_fighting_capability BOOLEAN DEFAULT false,
  has_flood_rescue_capability BOOLEAN DEFAULT false,
  has_mountain_rescue_capability BOOLEAN DEFAULT false,
  has_earthquake_response_capability BOOLEAN DEFAULT false,
  has_chemical_hazard_capability BOOLEAN DEFAULT false,
  has_medical_emergency_capability BOOLEAN DEFAULT false,
  special_capabilities TEXT,
  
  -- Coordination
  coordinates_with_agencies TEXT,
  coordination_mechanism TEXT,
  inter_agency_drills BOOLEAN DEFAULT false,
  reports_to TEXT,
  community_engagement_activities TEXT,
  
  -- Plans and protocols
  has_standard_operating_procedures BOOLEAN DEFAULT true,
  sop_last_updated_date DATE,
  has_emergency_response_plan BOOLEAN DEFAULT true,
  response_plan_last_updated_date DATE,
  has_evacuation_plan BOOLEAN DEFAULT true,
  evacuation_plan_details TEXT,
  has_business_continuity_plan BOOLEAN DEFAULT false,
  
  -- Recent deployments
  recent_emergency_responses TEXT,
  major_achievements TEXT,
  response_statistics TEXT,
  
  -- Funding and financial aspects
  primary_funding_source TEXT,
  annual_budget_npr DECIMAL(14, 2),
  funding_adequacy TEXT,
  financial_sustainability TEXT,
  
  -- Challenges and needs
  operational_challenges TEXT,
  resource_gaps TEXT,
  improvement_needs TEXT,
  expansion_plans TEXT,
  
  -- Accessibility
  accessibility_by_road BOOLEAN DEFAULT true,
  distance_from_main_road_km DECIMAL(6, 2),
  nearest_hospital_distance_km DECIMAL(8, 2),
  nearest_police_station_distance_km DECIMAL(8, 2),
  public_transport_accessibility TEXT,
  
  -- Linkages to other entities
  linked_evacuation_centers JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_police_stations JSONB DEFAULT '[]'::jsonb,
  linked_fire_stations JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_roads JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_area GEOMETRY(Polygon, 4326),
  service_coverage_area_polygon GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_disaster_center_location_point ON acme_disaster_management_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_disaster_center_facility_area ON acme_disaster_management_center USING GIST (facility_area);
CREATE INDEX IF NOT EXISTS idx_disaster_center_coverage_area ON acme_disaster_management_center USING GIST (service_coverage_area_polygon);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_disaster_center_name ON acme_disaster_management_center(name);
CREATE INDEX IF NOT EXISTS idx_disaster_center_slug ON acme_disaster_management_center(slug);
CREATE INDEX IF NOT EXISTS idx_disaster_center_type ON acme_disaster_management_center(center_type);
CREATE INDEX IF NOT EXISTS idx_disaster_center_operational_status ON acme_disaster_management_center(operational_status);
CREATE INDEX IF NOT EXISTS idx_disaster_center_management_type ON acme_disaster_management_center(management_type);
