-- Create entity_type enum with all required values
DO $$ 
DECLARE
    v text;
BEGIN
    CREATE TYPE entity_type AS ENUM (
        -- Local Areas
        'LOCATION', 'WARD', 'SETTLEMENT', 'SQUATTER_AREA', 
        'AGRICULTURAL_AREA', 'BUSINESS_AREA', 'INDUSTRIAL_AREA',
        
        -- Roads
        'ROAD', 'PARKING_FACILITY', 'PUBLIC_TRANSPORT', 'PETROL_PUMP',
        
        -- Agricultural
        'AGRIC_ZONE', 'FARM', 'FISH_FARM', 'GRASSLAND', 'GRAZING_AREA',
        
        -- Cultural
        'CULTURAL_HERITAGE', 'HISTORICAL_SITE', 'RELIGIOUS_PLACE'
    );
EXCEPTION
    WHEN duplicate_object THEN 
        -- If the type already exists, try to add the new values safely
        BEGIN
            -- Check and add missing enum values
            FOR v IN 
                SELECT unnest(ARRAY[
                    'PARKING_FACILITY', 'PUBLIC_TRANSPORT', 'PETROL_PUMP',
                    'AGRIC_ZONE', 'FARM', 'FISH_FARM', 'GRASSLAND', 'GRAZING_AREA',
                    'CULTURAL_HERITAGE', 'HISTORICAL_SITE', 'RELIGIOUS_PLACE'
                ])
            LOOP
                IF NOT EXISTS (
                    SELECT 1 
                    FROM pg_enum 
                    WHERE enumlabel = v 
                        AND enumtypid = 'entity_type'::regtype
                ) THEN
                    EXECUTE format('ALTER TYPE entity_type ADD VALUE %L', v);
                END IF;
            END LOOP;
        EXCEPTION
            WHEN others THEN null;
        END;
END $$;
