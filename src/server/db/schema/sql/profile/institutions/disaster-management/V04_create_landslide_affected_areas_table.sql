-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the landslide affected areas table
CREATE TABLE IF NOT EXISTS acme_landslide_affected_area (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  location_description TEXT,
  nearest_landmark TEXT,

  -- Landslide characteristics
  landslide_type landslide_type NOT NULL,
  severity landslide_severity NOT NULL,
  status landslide_status NOT NULL,
  trigger_mechanism trigger_mechanism,
  initial_occurrence_date DATE,
  most_recent_activity_date DATE,

  -- Physical attributes
  area_sq_km DECIMAL(10, 6),
  length_m DECIMAL(10, 2),
  width_m DECIMAL(10, 2),
  depth_m DECIMAL(8, 2),
  volume_estimate_cubic_m DECIMAL(14, 2),
  slope_angle_degrees DECIMAL(5, 2),
  elevation_range_m TEXT,
  aspect_direction TEXT, -- N, NE, E, SE, etc.

  -- Geology and soil
  geological_formation TEXT,
  rock_types TEXT,
  soil_types TEXT,
  groundwater_conditions TEXT,

  -- Impact assessment
  casualties_count INTEGER,
  injuries_count INTEGER,
  missing_persons_count INTEGER,
  affected_families_count INTEGER,
  displaced_people_count INTEGER,
  lives_endangered_count INTEGER,

  -- Infrastructure damage
  buildings_damaged_count INTEGER,
  buildings_destroyed_count INTEGER,
  roads_damaged_km DECIMAL(8, 2),
  bridges_damaged_count INTEGER,
  critical_infrastructure_damaged TEXT,
  economic_loss_estimate_npr DECIMAL(14, 2),
  agricultural_land_damaged_hectares DECIMAL(10, 2),
  forest_area_damaged_hectares DECIMAL(10, 2),

  -- Risk factors
  risk_level TEXT, -- High, Medium, Low
  future_risk_assessment TEXT,
  vulnerable_structures TEXT,
  potential_impact_zone TEXT,
  estimated_risk_population INTEGER,

  -- Monitoring details
  is_being_monitored BOOLEAN DEFAULT false,
  monitoring_methods TEXT, -- GPS, inclinometers, etc.
  monitoring_frequency TEXT,
  last_inspection_date DATE,
  movement_rate_mm_per_year DECIMAL(8, 2),
  has_early_warning_system BOOLEAN DEFAULT false,
  early_warning_system_details TEXT,

  -- Mitigation and management
  mitigation_measures_taken TEXT,
  mitigation_effectiveness TEXT,
  proposed_future_measures TEXT,
  stabilization_methods_used TEXT,
  drainage_improvements TEXT,
  vegetation_management TEXT,
  evacuation_plan_exists BOOLEAN DEFAULT false,
  evacuation_plan_details TEXT,

  -- Response and recovery
  emergency_response_actions TEXT,
  recovery_efforts TEXT,
  relief_provided_details TEXT,
  resettlement_details TEXT,
  compensation_provided_npr DECIMAL(14, 2),

  -- Responsible authorities
  lead_agency TEXT,
  supporting_agencies TEXT,
  local_contact_person TEXT,
  local_contact_phone TEXT,

  -- Environmental factors
  environmental_impacts TEXT,
  hydrological_changes TEXT,
  proximity_to_water_bodies TEXT,

  -- Research and documentation
  scientific_studies_conducted TEXT,
  research_institutions_involved TEXT,
  has_geotechnical_data BOOLEAN DEFAULT false,
  has_drone_imagery BOOLEAN DEFAULT false,
  has_satellite_imagery BOOLEAN DEFAULT false,

  -- Community engagement
  community_awareness_level TEXT,
  community_mitigation_participation TEXT,
  community_training_conducted BOOLEAN DEFAULT false,
  community_training_details TEXT,

  -- Financial aspects
  estimated_mitigation_cost_npr DECIMAL(14, 2),
  allocated_budget_npr DECIMAL(14, 2),
  funding_source TEXT,

  -- Linkages to other entities and assets
  linked_disaster_management_centers JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_evacuation_centers JSONB DEFAULT '[]'::jsonb,
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,

  -- Notes and additional information
  additional_notes TEXT,
  historical_incidents TEXT,
  reference_materials TEXT,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  affected_area GEOMETRY(Polygon, 4326),
  danger_zone GEOMETRY(Polygon, 4326),
  monitoring_points GEOMETRY(MultiPoint, 4326),

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
CREATE INDEX IF NOT EXISTS idx_landslide_location_point ON acme_landslide_affected_area USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_landslide_affected_area ON acme_landslide_affected_area USING GIST (affected_area);
CREATE INDEX IF NOT EXISTS idx_landslide_danger_zone ON acme_landslide_affected_area USING GIST (danger_zone);
CREATE INDEX IF NOT EXISTS idx_landslide_monitoring_points ON acme_landslide_affected_area USING GIST (monitoring_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_landslide_name ON acme_landslide_affected_area(name);
CREATE INDEX IF NOT EXISTS idx_landslide_slug ON acme_landslide_affected_area(slug);
CREATE INDEX IF NOT EXISTS idx_landslide_type ON acme_landslide_affected_area(landslide_type);
CREATE INDEX IF NOT EXISTS idx_landslide_severity ON acme_landslide_affected_area(severity);
CREATE INDEX IF NOT EXISTS idx_landslide_status ON acme_landslide_affected_area(status);
CREATE INDEX IF NOT EXISTS idx_landslide_trigger ON acme_landslide_affected_area(trigger_mechanism);
