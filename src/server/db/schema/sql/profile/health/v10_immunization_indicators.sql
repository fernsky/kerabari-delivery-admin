DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'immunization_fiscal_year') THEN
        CREATE TYPE immunization_fiscal_year AS ENUM (
            'FY_2079_2080',
            'FY_2080_2081',
            'FY_2081_2082',
            'FY_2082_2083',
            'FY_2083_2084',
            'FY_2084_2085',
            'FY_2085_2086'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'immunization_indicator') THEN
        CREATE TYPE immunization_indicator AS ENUM (
            'DPT_HEPB_HIB1_COVERAGE',
            'OPV1_COVERAGE',
            'PCV1_COVERAGE',
            'ROTA1_COVERAGE',
            'DPT_HEPB_HIB3_COVERAGE',
            'OPV3_COVERAGE',
            'ROTA2_COVERAGE',
            'PLANNED_IMMUNIZATION_SESSIONS_CONDUCTED',
            'PLANNED_IMMUNIZATION_CLINICS_CONDUCTED',
            'HYGIENE_PROMOTION_SESSION_AMONG_ROUTINE_IMMUNIZATION',
            'PCV3_COVERAGE',
            'MEASLES_RUBELLA1_COVERAGE',
            'MEASLES_RUBELLA2_COVERAGE',
            'FULLY_IMMUNIZED_NIP_SCHEDULE',
            'BCG_COVERAGE',
            'TCV_COVERAGE',
            'JE_COVERAGE',
            'FIPV1_COVERAGE',
            'TD2_TD2PLUS_COMPLETED_PREGNANT_WOMEN',
            'VACCINE_WASTAGE_BCG',
            'TD2PLUS_PREGNANT_WOMEN',
            'FIPV2_COVERAGE',
            'TD2_PREGNANT_WOMEN',
            'VACCINE_WASTAGE_JE',
            'VACCINE_WASTAGE_MR',
            'VACCINE_WASTAGE_FIPV',
            'VACCINE_WASTAGE_TCV',
            'MEASLES_INCIDENCE_RATE',
            'VACCINE_WASTAGE_TD',
            'VACCINE_WASTAGE_OPV',
            'VACCINE_WASTAGE_DPT_HEPB_HIB',
            'DPT_HEPB_HIB1_VS_MR2_DROPOUT',
            'PCV_DROPOUT',
            'VACCINE_WASTAGE_PCV',
            'DPT_HEPB_HIB_DROPOUT',
            'VACCINE_WASTAGE_ROTA',
            'HPV1_COVERAGE',
            'HPV2_COVERAGE',
            'MEASLES_RUBELLA_DROPOUT',
            'SERIOUS_AEFI_PERCENT',
            'AES_RATE',
            'NEONATAL_TETANUS_RATE',
            'HPV_DROPOUT'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'acme_immunization_indicators'
    ) THEN
        CREATE TABLE acme_immunization_indicators (
            id VARCHAR(36) PRIMARY KEY,
            fiscal_year immunization_fiscal_year NOT NULL,
            indicator immunization_indicator NOT NULL,
            value DOUBLE PRECISION,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_immunization_indicators) THEN
        INSERT INTO acme_immunization_indicators (
            id, fiscal_year, indicator, value
        )
        VALUES
        (gen_random_uuid(), 'FY_2079_2080', 'DPT_HEPB_HIB1_COVERAGE', 105.6),
        (gen_random_uuid(), 'FY_2079_2080', 'OPV1_COVERAGE', 105.6),
        (gen_random_uuid(), 'FY_2079_2080', 'PCV1_COVERAGE', 105.4),
        (gen_random_uuid(), 'FY_2079_2080', 'ROTA1_COVERAGE', 104.8),
        (gen_random_uuid(), 'FY_2079_2080', 'DPT_HEPB_HIB3_COVERAGE', 104),
        (gen_random_uuid(), 'FY_2079_2080', 'OPV3_COVERAGE', 103.5),
        (gen_random_uuid(), 'FY_2079_2080', 'ROTA2_COVERAGE', 101.5),
        (gen_random_uuid(), 'FY_2079_2080', 'PLANNED_IMMUNIZATION_SESSIONS_CONDUCTED', 100),
        (gen_random_uuid(), 'FY_2079_2080', 'PLANNED_IMMUNIZATION_CLINICS_CONDUCTED', 100),
        (gen_random_uuid(), 'FY_2079_2080', 'HYGIENE_PROMOTION_SESSION_AMONG_ROUTINE_IMMUNIZATION', 98.7),
        (gen_random_uuid(), 'FY_2079_2080', 'PCV3_COVERAGE', 98.1),
        (gen_random_uuid(), 'FY_2079_2080', 'MEASLES_RUBELLA1_COVERAGE', 97.4),
        (gen_random_uuid(), 'FY_2079_2080', 'MEASLES_RUBELLA2_COVERAGE', 97.3),
        (gen_random_uuid(), 'FY_2079_2080', 'FULLY_IMMUNIZED_NIP_SCHEDULE', 97.3),
        (gen_random_uuid(), 'FY_2079_2080', 'BCG_COVERAGE', 96.9),
        (gen_random_uuid(), 'FY_2079_2080', 'TCV_COVERAGE', 93.5),
        (gen_random_uuid(), 'FY_2079_2080', 'JE_COVERAGE', 93.3),
        (gen_random_uuid(), 'FY_2079_2080', 'FIPV1_COVERAGE', 92.67),
        (gen_random_uuid(), 'FY_2079_2080', 'TD2_TD2PLUS_COMPLETED_PREGNANT_WOMEN', 92.6),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_BCG', 76.4),
        (gen_random_uuid(), 'FY_2079_2080', 'TD2PLUS_PREGNANT_WOMEN', 59.7),
        (gen_random_uuid(), 'FY_2079_2080', 'FIPV2_COVERAGE', 56.8),
        (gen_random_uuid(), 'FY_2079_2080', 'TD2_PREGNANT_WOMEN', 32.9),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_JE', 32.6),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_MR', 29.9),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_FIPV', 22.2),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_TCV', 18.8),
        (gen_random_uuid(), 'FY_2079_2080', 'MEASLES_INCIDENCE_RATE', 18.4),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_TD', 15.5),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_OPV', 11.1),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_DPT_HEPB_HIB', 10.6),
        (gen_random_uuid(), 'FY_2079_2080', 'DPT_HEPB_HIB1_VS_MR2_DROPOUT', 7.8),
        (gen_random_uuid(), 'FY_2079_2080', 'PCV_DROPOUT', 7),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_PCV', 4.4),
        (gen_random_uuid(), 'FY_2079_2080', 'DPT_HEPB_HIB_DROPOUT', 1.5),
        (gen_random_uuid(), 'FY_2079_2080', 'VACCINE_WASTAGE_ROTA', 0.89),
        (gen_random_uuid(), 'FY_2079_2080', 'HPV1_COVERAGE', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'HPV2_COVERAGE', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'MEASLES_RUBELLA_DROPOUT', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'SERIOUS_AEFI_PERCENT', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'AES_RATE', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'NEONATAL_TETANUS_RATE', 0),
        (gen_random_uuid(), 'FY_2079_2080', 'HPV_DROPOUT', NULL);
    END IF;
END
$$;
