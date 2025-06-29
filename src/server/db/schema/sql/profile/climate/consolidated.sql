-- Consolidated Climate Data Schema
-- This table stores all climate and weather data in a unified format for analysis
-- Create enums for climate domains
CREATE TYPE climate_domain AS ENUM(
    'WEATHER_EXTREMES',
    'AGRICULTURE_IRRIGATION',
    'ENERGY',
    'CLIMATE_CHANGE',
    'DISASTER_RISK'
);

-- Create enum for consolidated climate variable types
CREATE TYPE consolidated_climate_variable_type AS ENUM(
    -- Weather Extremes
    'TOTAL_PRECIPITATION',
    'CONVECTIVE_PRECIPITATION',
    'LARGE_SCALE_PRECIPITATION',
    'MEAN_TOTAL_PRECIPITATION_RATE',
    'RUNOFF',
    'SURFACE_RUNOFF',
    'SUB_SURFACE_RUNOFF',
    'TEMPERATURE_2M',
    'MAXIMUM_TEMPERATURE_2M',
    'MINIMUM_TEMPERATURE_2M',
    'SKIN_TEMPERATURE',
    'WIND_U_COMPONENT_10M',
    'WIND_V_COMPONENT_10M',
    'WIND_GUST_10M',
    'INSTANTANEOUS_WIND_GUST_10M',
    'BOUNDARY_LAYER_HEIGHT',
    -- Agriculture & Irrigation
    'VOLUMETRIC_SOIL_WATER_LAYER_1',
    'VOLUMETRIC_SOIL_WATER_LAYER_2',
    'VOLUMETRIC_SOIL_WATER_LAYER_3',
    'VOLUMETRIC_SOIL_WATER_LAYER_4',
    'EVAPORATION',
    'POTENTIAL_EVAPORATION',
    'SURFACE_LATENT_HEAT_FLUX',
    'MEAN_EVAPORATION_RATE',
    'MEAN_RUNOFF_RATE',
    'LEAF_AREA_INDEX_HIGH_VEGETATION',
    'LEAF_AREA_INDEX_LOW_VEGETATION',
    'HIGH_VEGETATION_COVER',
    'LOW_VEGETATION_COVER',
    'SOIL_TYPE',
    -- Energy
    'SURFACE_SOLAR_RADIATION_DOWNWARDS',
    'TOA_INCIDENT_SOLAR_RADIATION',
    'SURFACE_NET_SOLAR_RADIATION',
    'CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE',
    'WIND_U_COMPONENT_100M',
    'WIND_V_COMPONENT_100M',
    'FRICTION_VELOCITY',
    'SNOWMELT',
    -- Climate Change
    'MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX',
    'MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX',
    'MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX',
    'TOTAL_CLOUD_COVER',
    'LOW_CLOUD_COVER',
    'HIGH_CLOUD_COVER',
    'ALBEDO_UV_DIFFUSE',
    'ALBEDO_UV_PARALLEL',
    'ALBEDO_NIR_DIFFUSE',
    'ALBEDO_NIR_PARALLEL',
    'TOTAL_COLUMN_WATER_VAPOUR',
    'VERTICAL_INTEGRAL_OF_TOTAL_ENERGY',
    'TOTAL_COLUMN_OZONE',
    -- Disaster Risk
    'SURFACE_PRESSURE',
    'MEAN_SEA_LEVEL_PRESSURE',
    'CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY',
    'CONVECTIVE_INHIBITION',
    'PRECIPITATION_TYPE',
    'CONVECTIVE_RAIN_RATE',
    'LARGE_SCALE_RAIN_RATE',
    'INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION'
);

-- Create enum for measurement units
CREATE TYPE consolidated_unit_type AS ENUM(
    'MM', -- millimeters for precipitation
    'MM_PER_HOUR', -- mm/hour for rates
    'CELSIUS', -- degrees Celsius for temperature
    'KELVIN', -- Kelvin for temperature
    'M_PER_S', -- meters per second for wind
    'M', -- meters for height
    'KG_PER_M2', -- kg/m² for other measurements
    'M3_PER_M3', -- m³/m³ for soil moisture
    'W_PER_M2', -- W/m² for heat flux
    'M2_PER_M2', -- m²/m² for leaf area index
    'PERCENTAGE', -- percentage for cover
    'UNITLESS', -- unitless for soil type
    'J_PER_M2', -- J/m² for solar radiation
    'PA', -- Pascal for pressure
    'J_PER_KG' -- J/kg for CAPE/CIN
);

-- Create the consolidated climate table
CREATE TABLE
    consolidated_climate (
        id VARCHAR(36) PRIMARY KEY,
        -- Date and time of measurement
        measurement_date TIMESTAMP NOT NULL,
        -- Climate domain for categorization
        domain climate_domain NOT NULL,
        -- Climate variable type
        variable_type consolidated_climate_variable_type NOT NULL,
        -- Measurement value
        value DECIMAL(12, 4) NOT NULL,
        -- Unit of measurement
        unit consolidated_unit_type NOT NULL,
        -- Optional ward number for ward-specific data
        ward_number INTEGER,
        -- Optional location coordinates (if available)
        latitude DECIMAL(8, 6),
        longitude DECIMAL(9, 6),
        -- Data source or station information
        data_source VARCHAR(255),
        station_id VARCHAR(100),
        -- Additional context fields
        additional_context TEXT, -- JSON or text for additional data
        quality_flag VARCHAR(50), -- Data quality indicator
        confidence_level DECIMAL(3, 2), -- 0-1 range
        -- Metadata
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
    );

-- Create indexes for better query performance
CREATE INDEX idx_consolidated_climate_measurement_date ON consolidated_climate (measurement_date);

CREATE INDEX idx_consolidated_climate_domain ON consolidated_climate (domain);

CREATE INDEX idx_consolidated_climate_variable_type ON consolidated_climate (variable_type);

CREATE INDEX idx_consolidated_climate_ward_number ON consolidated_climate (ward_number);

CREATE INDEX idx_consolidated_climate_data_source ON consolidated_climate (data_source);

CREATE INDEX idx_consolidated_climate_station_id ON consolidated_climate (station_id);

CREATE INDEX idx_consolidated_climate_quality_flag ON consolidated_climate (quality_flag);

-- Create composite indexes for common query patterns
CREATE INDEX idx_consolidated_climate_domain_variable ON consolidated_climate (domain, variable_type);

CREATE INDEX idx_consolidated_climate_date_domain ON consolidated_climate (measurement_date, domain);

CREATE INDEX idx_consolidated_climate_ward_date ON consolidated_climate (ward_number, measurement_date);

CREATE INDEX idx_consolidated_climate_variable_date ON consolidated_climate (variable_type, measurement_date);

-- Create spatial index for location-based queries (if PostGIS is available)
-- CREATE INDEX idx_consolidated_climate_location ON consolidated_climate USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
-- Add comments for documentation
COMMENT ON TABLE consolidated_climate IS 'Consolidated climate and weather data table for storing all climate variables in a unified format';

COMMENT ON COLUMN consolidated_climate.id IS 'Unique identifier for each climate data record';

COMMENT ON COLUMN consolidated_climate.measurement_date IS 'Date and time when the measurement was taken';

COMMENT ON COLUMN consolidated_climate.domain IS 'Climate domain category (Weather Extremes, Agriculture, Energy, Climate Change, Disaster Risk)';

COMMENT ON COLUMN consolidated_climate.variable_type IS 'Specific climate variable being measured';

COMMENT ON COLUMN consolidated_climate.value IS 'Numeric value of the measurement';

COMMENT ON COLUMN consolidated_climate.unit IS 'Unit of measurement for the value';

COMMENT ON COLUMN consolidated_climate.ward_number IS 'Optional ward number for ward-specific data';

COMMENT ON COLUMN consolidated_climate.latitude IS 'Latitude coordinate of measurement location';

COMMENT ON COLUMN consolidated_climate.longitude IS 'Longitude coordinate of measurement location';

COMMENT ON COLUMN consolidated_climate.data_source IS 'Source of the climate data (e.g., weather station, satellite, model)';

COMMENT ON COLUMN consolidated_climate.station_id IS 'Identifier for the weather station or data collection point';

COMMENT ON COLUMN consolidated_climate.additional_context IS 'Additional context or metadata in JSON or text format';

COMMENT ON COLUMN consolidated_climate.quality_flag IS 'Data quality indicator';

COMMENT ON COLUMN consolidated_climate.confidence_level IS 'Confidence level of the measurement (0-1 range)';

-- Create a trigger to automatically update the updated_at timestamp
CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consolidated_climate_updated_at BEFORE
UPDATE ON consolidated_climate FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- Create a view for easy access to climate data with domain labels
CREATE VIEW
    consolidated_climate_view AS
SELECT
    id,
    measurement_date,
    domain,
    CASE domain
        WHEN 'WEATHER_EXTREMES' THEN 'Weather Extremes'
        WHEN 'AGRICULTURE_IRRIGATION' THEN 'Agriculture & Irrigation'
        WHEN 'ENERGY' THEN 'Energy'
        WHEN 'CLIMATE_CHANGE' THEN 'Climate Change'
        WHEN 'DISASTER_RISK' THEN 'Disaster Risk'
    END as domain_display,
    variable_type,
    value,
    unit,
    ward_number,
    latitude,
    longitude,
    data_source,
    station_id,
    additional_context,
    quality_flag,
    confidence_level,
    updated_at,
    created_at
FROM
    consolidated_climate;

-- Create a materialized view for summary statistics (optional, for performance)
CREATE MATERIALIZED VIEW
    consolidated_climate_summary AS
SELECT
    domain,
    variable_type,
    COUNT(*) as record_count,
    AVG(value) as avg_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    STDDEV(value) as stddev_value,
    MIN(measurement_date) as earliest_date,
    MAX(measurement_date) as latest_date
FROM
    consolidated_climate
GROUP BY
    domain,
    variable_type;

-- Create index on the materialized view
CREATE INDEX idx_consolidated_climate_summary_domain ON consolidated_climate_summary (domain);

CREATE INDEX idx_consolidated_climate_summary_variable ON consolidated_climate_summary (variable_type);

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON consolidated_climate TO your_app_user;
-- GRANT SELECT ON consolidated_climate_view TO your_app_user;
-- GRANT SELECT ON consolidated_climate_summary TO your_app_user;