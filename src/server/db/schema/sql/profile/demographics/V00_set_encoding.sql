-- Set database encoding to UTF-8
DO $$
BEGIN
    -- Set client_encoding to UTF8 for the session
    SET client_encoding = 'UTF8';
    
    -- Set database-level encoding parameters if they're not already set
    IF NOT EXISTS (SELECT 1 FROM pg_settings WHERE name = 'client_encoding' AND setting = 'UTF8') THEN
        EXECUTE 'ALTER DATABASE CURRENT_DATABASE() SET client_encoding TO ''UTF8''';
        EXECUTE 'ALTER DATABASE CURRENT_DATABASE() SET standard_conforming_strings TO on';
        EXECUTE 'ALTER DATABASE CURRENT_DATABASE() SET client_min_messages TO warning';
    END IF;

    RAISE NOTICE 'Database encoding set to UTF-8';
END
$$;
