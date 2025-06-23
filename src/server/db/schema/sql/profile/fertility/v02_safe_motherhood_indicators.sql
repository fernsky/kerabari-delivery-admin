-- Check if acme_safe_motherhood_indicators table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_safe_motherhood_indicators'
    ) THEN
        CREATE TABLE acme_safe_motherhood_indicators (
            id VARCHAR(36) PRIMARY KEY,
            indicator VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            value REAL NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_safe_motherhood_indicators) THEN
        INSERT INTO acme_safe_motherhood_indicators (
            id, indicator, year, value
        )
        VALUES
        -- 2080 Safe Motherhood Data (Shrawan 2079 to Asar 2080)
        (gen_random_uuid(), 'POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS', 2080, 142.3),
        (gen_random_uuid(), 'PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP', 2080, 136.8),
        (gen_random_uuid(), 'PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS', 2080, 117.5),
        (gen_random_uuid(), 'POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS', 2080, 114.6),
        (gen_random_uuid(), 'NORMAL_VAGINAL_DELIVERIES', 2080, 100.0),
        (gen_random_uuid(), 'NEWBORNS_CHX_APPLIED_AFTER_BIRTH', 2080, 99.9),
        (gen_random_uuid(), 'POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID', 2080, 96.7),
        (gen_random_uuid(), 'POSTPARTUM_MOTHERS_VITAMIN_A', 2080, 96.7),
        (gen_random_uuid(), 'WOMEN_CONTRACEPTIVES_AFTER_ABORTION', 2080, 94.2),
        (gen_random_uuid(), 'WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY', 2080, 92.1),
        (gen_random_uuid(), 'PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL', 2080, 81.4),
        (gen_random_uuid(), 'WOMEN_FIRST_ANC_CHECKUP_PROTOCOL', 2080, 78.7),
        (gen_random_uuid(), 'WOMEN_180_CALCIUM_TABLETS_PREGNANCY', 2080, 68.3),
        (gen_random_uuid(), 'INSTITUTIONAL_DELIVERIES', 2080, 61.6),
        (gen_random_uuid(), 'BIRTHS_ATTENDED_SBA_TRAINED_ANMS', 2080, 61.4),
        (gen_random_uuid(), 'WOMEN_PNC_WITHIN_24HRS_DELIVERY', 2080, 59.5),
        (gen_random_uuid(), 'NEWBORNS_CHECKUP_24HRS_BIRTH', 2080, 58.9),
        (gen_random_uuid(), 'WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL', 2080, 57.6),
        (gen_random_uuid(), 'NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL', 2080, 57.5),
        (gen_random_uuid(), 'PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL', 2080, 25.6),
        (gen_random_uuid(), 'PREGNANCIES_TERMINATED_INDUCED_PROCEDURE', 2080, 12.7),
        (gen_random_uuid(), 'NEWBORNS_LOW_BIRTH_WEIGHT', 2080, 7.95),
        (gen_random_uuid(), 'DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL', 2080, 7.7),
        (gen_random_uuid(), 'NEONATES_BIRTH_ASPHYXIA', 2080, 2.7),
        (gen_random_uuid(), 'PRETERM_BIRTH', 2080, 2.6),
        (gen_random_uuid(), 'STILL_BIRTHS', 2080, 0.68),
        (gen_random_uuid(), 'BIRTHS_ATTENDED_NON_SBA_SHP', 2080, 0.17),
        (gen_random_uuid(), 'NEONATES_CONGENITAL_ANOMALIES', 2080, 0.14),
        (gen_random_uuid(), 'NEONATAL_MORTALITY_HEALTH_FACILITY', 2080, 0.09),
        (gen_random_uuid(), 'ASSISTED_VACUUM_FORCEPS_DELIVERIES', 2080, 0),
        (gen_random_uuid(), 'DELIVERIES_CAESAREAN_SECTION_REPORTED', 2080, 0),
        (gen_random_uuid(), 'DELIVERY_BY_CAESAREAN_SECTION', 2080, 0),
        (gen_random_uuid(), 'PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_HAEMORRHAGE', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_ECTOPIC_PREGNANCY', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_RUPTURED_UTERUS', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_PREECLAMPSIA', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_ECLAMPSIA', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_RETAINED_PLACENTA', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_PUERPERAL_SEPSIS', 2080, 0),
        (gen_random_uuid(), 'WOMEN_TREATED_ABORTION_COMPLICATIONS', 2080, 0),
        (gen_random_uuid(), 'WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION', 2080, 0),
        (gen_random_uuid(), 'REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY', 2080, 0),
        (gen_random_uuid(), 'WOMEN_COMPLICATIONS_INDUCED_ABORTION', 2080, 0),
        (gen_random_uuid(), 'BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL', 2080, 0),
        (gen_random_uuid(), 'PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL', 2080, 0),
        (gen_random_uuid(), 'MET_NEED_EMERGENCY_OBSTETRIC_CARE', 2080, -5.7),
        (gen_random_uuid(), 'WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR', 2080, -6);
    END IF;
END
$$;