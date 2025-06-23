-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the fire incidents table
CREATE TABLE IF NOT EXISTS acme_fire_incident (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  incident_type fire_incident_type NOT NULL,
  severity fire_incident_severity NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  address TEXT,

  -- Temporal information
  incident_date DATE NOT NULL,
  incident_time TIMESTAMP,
  reported_time TIMESTAMP,
  response_time TIMESTAMP,
  contained_time TIMESTAMP,
  extinguished_time TIMESTAMP,

  -- Incident details
  incident_description TEXT,
  probable_cause TEXT,
  fire_source TEXT,
  affected_area_sqm DECIMAL(10, 2),

  -- Impact assessment
  casualties_count INTEGER DEFAULT 0,
  injuries_count INTEGER DEFAULT 0,
  missing_count INTEGER DEFAULT 0,
  affected_families_count INTEGER DEFAULT 0,
  affected_population_count INTEGER DEFAULT 0,
  displaced_count INTEGER DEFAULT 0,
  animals_lost_count INTEGER DEFAULT 0,

  -- Damage assessment
  property_damage_description TEXT,
  estimated_loss_npr DECIMAL(14, 2),
  residential_structures_damaged INTEGER DEFAULT 0,
  commercial_structures_damaged INTEGER DEFAULT 0,
  public_buildings_damaged INTEGER DEFAULT 0,
  vehicles_damaged INTEGER DEFAULT 0,
  infrastructure_damage_details TEXT,

  -- Response details
  response_agencies JSONB DEFAULT '[]'::jsonb,
  fire_fighters_deployed INTEGER DEFAULT 0,
  fire_engines_deployed INTEGER DEFAULT 0,
  water_tankers_used INTEGER DEFAULT 0,
  police_forces_deployed INTEGER DEFAULT 0,
  ambulances_deployed INTEGER DEFAULT 0,
  rescue_teams_deployed INTEGER DEFAULT 0,
  volunteer_count INTEGER DEFAULT 0,
  response_description TEXT,
  water_sources_used TEXT,
  special_equipment_used TEXT,

  -- Evacuation details
  evacuation_required BOOLEAN DEFAULT false,
  evacuation_details TEXT,
  evacuation_center_used BOOLEAN DEFAULT false,
  evacuation_center_details TEXT,

  -- Relief and recovery
  relief_provided_description TEXT,
  relief_agencies JSONB DEFAULT '[]'::jsonb,
  compensation_provided_npr DECIMAL(14, 2),
  rehabilitation_measures TEXT,
  recovery_status TEXT,

  -- Challenges faced
  response_delay_factors TEXT,
  water_supply_challenges TEXT,
  access_challenges TEXT,
  other_challenges TEXT,

  -- Lessons and prevention
  lessons_learned TEXT,
  recommended_preventions TEXT,
  follow_up_actions TEXT,

  -- Insurance and legal
  was_insured BOOLEAN DEFAULT false,
  insurance_details TEXT,
  insurance_claim_amount_npr DECIMAL(14, 2),
  legal_proceeding_initiated BOOLEAN DEFAULT false,
  legal_details TEXT,

  -- Documentation
  has_photos BOOLEAN DEFAULT false,
  has_incident_report BOOLEAN DEFAULT false,
  has_news_coverage BOOLEAN DEFAULT false,
  media_links JSONB DEFAULT '[]'::jsonb,
  report_links JSONB DEFAULT '[]'::jsonb,

  -- Linkages to other entities
  linked_fire_stations JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_police_stations JSONB DEFAULT '[]'::jsonb,
  linked_disaster_management_centers JSONB DEFAULT '[]'::jsonb,

  -- Notes and metadata
  notes TEXT,
  investigation_status TEXT,
  case_closure_status TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  affected_area GEOMETRY(Polygon, 4326),

  -- Status and metadata
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_fire_incident_location_point ON acme_fire_incident USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_fire_incident_affected_area ON acme_fire_incident USING GIST (affected_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_fire_incident_name ON acme_fire_incident(name);
CREATE INDEX IF NOT EXISTS idx_fire_incident_slug ON acme_fire_incident(slug);
CREATE INDEX IF NOT EXISTS idx_fire_incident_type ON acme_fire_incident(incident_type);
CREATE INDEX IF NOT EXISTS idx_fire_incident_severity ON acme_fire_incident(severity);
CREATE INDEX IF NOT EXISTS idx_fire_incident_date ON acme_fire_incident(incident_date);
