-- Check if table is empty first
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM acme_khajura_household) = 0 THEN
        -- Insert dummy households data
        INSERT INTO acme_khajura_household (
            id, profile_id, province, district, local_level, ward_no,
            house_symbol_no, family_symbol_no, date_of_interview,
            household_location, locality, family_head_name,
            family_head_phone_no, total_members, house_ownership,
            land_ownership, house_base, house_outer_wall, house_roof,
            house_floor, house_floors, room_count, is_house_passed,
            is_earthquake_resistant, disaster_risk_status, time_to_public_bus,
            time_to_market, geom
        ) VALUES
        -- Ward 1
        ('household_001', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 1, 
         'KH-W1-001', 'KH-F-001', '2023-09-15',
         ARRAY[81.6712, 28.1346], 'गढवा केन्द्र', 'रामेश्वर पौडेल',
         '9841234567', 5, 'own', 'own', 'concrete', 'brick', 'rcc', 'concrete',
         2, 5, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.6712, 28.1346), 4326)),
         
        ('household_002', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 1, 
         'KH-W1-002', 'KH-F-002', '2023-09-16',
         ARRAY[81.6734, 28.1367], 'गढवा केन्द्र', 'सरिता थापा',
         '9842345678', 4, 'own', 'own', 'stone', 'brick', 'tin', 'concrete',
         1, 3, 'yes', 'no', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.6734, 28.1367), 4326)),
         
        ('household_003', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 1, 
         'KH-W1-003', 'KH-F-003', '2023-09-17',
         ARRAY[81.6756, 28.1378], 'पूर्वी गढवा', 'नवराज शर्मा',
         '9843456789', 6, 'rent', 'rent', 'concrete', 'concrete', 'rcc', 'concrete',
         3, 6, 'yes', 'yes', 'safe', 'UNDER_30_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.6756, 28.1378), 4326)),
         
        -- Ward 2
        ('household_004', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 2, 
         'KH-W2-001', 'KH-F-004', '2023-09-18',
         ARRAY[81.6825, 28.1412], 'पश्चिम गढवा', 'विनोद कुमार खत्री',
         '9844567890', 3, 'own', 'own', 'stone', 'brick', 'tin', 'tile',
         2, 4, 'yes', 'no', 'safe', 'UNDER_15_MIN', 'UNDER_1_HOUR',
         ST_SetSRID(ST_MakePoint(81.6825, 28.1412), 4326)),
         
        ('household_005', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 2, 
         'KH-W2-002', 'KH-F-005', '2023-09-19',
         ARRAY[81.6847, 28.1423], 'पश्चिम गढवा', 'कमला देवी श्रेष्ठ',
         '9845678901', 5, 'relative', 'own', 'mud', 'wood', 'tile', 'mud',
         1, 2, 'no', 'no', 'flood_risk', 'UNDER_30_MIN', 'UNDER_1_HOUR',
         ST_SetSRID(ST_MakePoint(81.6847, 28.1423), 4326)),
         
        -- Ward 3
        ('household_006', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 3, 
         'KH-W3-001', 'KH-F-006', '2023-09-20',
         ARRAY[81.6912, 28.1489], 'उत्तर गढवा', 'प्रकाश बहादुर गिरी',
         '9846789012', 7, 'own', 'own', 'concrete', 'brick', 'rcc', 'tile',
         2, 5, 'yes', 'yes', 'safe', 'UNDER_1_HOUR', 'UNDER_1_HOUR',
         ST_SetSRID(ST_MakePoint(81.6912, 28.1489), 4326)),
         
        ('household_007', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 3, 
         'KH-W3-002', 'KH-F-007', '2023-09-21',
         ARRAY[81.6934, 28.1512], 'उत्तर गढवा', 'संगिता कुमारी बस्नेत',
         '9847890123', 4, 'own', 'government', 'concrete', 'concrete', 'rcc', 'concrete',
         3, 7, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.6934, 28.1512), 4326)),
         
        -- Ward 4
        ('household_008', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 4, 
         'KH-W4-001', 'KH-F-008', '2023-09-22',
         ARRAY[81.7015, 28.1578], 'दक्षिण गढवा', 'दिनेश थापा',
         '9848901234', 6, 'own', 'own', 'stone', 'brick', 'tin', 'concrete',
         2, 4, 'no', 'no', 'flood_risk', 'UNDER_30_MIN', 'UNDER_1_HOUR',
         ST_SetSRID(ST_MakePoint(81.7015, 28.1578), 4326)),
         
        ('household_009', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 4, 
         'KH-W4-002', 'KH-F-009', '2023-09-23',
         ARRAY[81.7034, 28.1592], 'दक्षिण गढवा', 'सुमन पौडेल',
         '9849012345', 3, 'rent', 'rent', 'concrete', 'concrete', 'rcc', 'concrete',
         1, 3, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.7034, 28.1592), 4326)),
         
        -- Ward 5
        ('household_010', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 5, 
         'KH-W5-001', 'KH-F-010', '2023-09-24',
         ARRAY[81.7112, 28.1634], 'पूर्व गढवा', 'मनोज कुमार यादव',
         '9850123456', 5, 'own', 'own', 'concrete', 'brick', 'rcc', 'concrete',
         2, 5, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.7112, 28.1634), 4326)),
         
        ('household_011', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 5, 
         'KH-W5-002', 'KH-F-011', '2023-09-25',
         ARRAY[81.7134, 28.1645], 'पूर्व गढवा', 'राजेन्द्र बहादुर कार्की',
         '9851234567', 4, 'own', 'own', 'stone', 'wood', 'tin', 'wood',
         1, 3, 'no', 'no', 'fire_risk', '1_HOUR_OR_MORE', 'UNDER_1_HOUR',
         ST_SetSRID(ST_MakePoint(81.7134, 28.1645), 4326)),
         
        -- Ward 6
        ('household_012', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 6, 
         'KH-W6-001', 'KH-F-012', '2023-09-26',
         ARRAY[81.7215, 28.1678], 'मध्य गढवा', 'शिव प्रसाद पन्त',
         '9852345678', 6, 'own', 'own', 'concrete', 'brick', 'rcc', 'tile',
         2, 4, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_15_MIN',
         ST_SetSRID(ST_MakePoint(81.7215, 28.1678), 4326)),
         
        ('household_013', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 6, 
         'KH-W6-002', 'KH-F-013', '2023-09-27',
         ARRAY[81.7234, 28.1689], 'मध्य गढवा', 'लक्ष्मी देवी पौडेल',
         '9853456789', 3, 'rent', 'rent', 'concrete', 'brick', 'rcc', 'concrete',
         3, 6, 'yes', 'yes', 'safe', 'UNDER_30_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.7234, 28.1689), 4326)),
         
        -- Ward 7
        ('household_014', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 7, 
         'KH-W7-001', 'KH-F-014', '2023-09-28',
         ARRAY[81.7312, 28.1723], 'सिमा क्षेत्र', 'हरि प्रसाद अधिकारी',
         '9854567890', 5, 'own', 'own', 'concrete', 'brick', 'rcc', 'concrete',
         2, 5, 'yes', 'yes', 'safe', 'UNDER_15_MIN', 'UNDER_30_MIN',
         ST_SetSRID(ST_MakePoint(81.7312, 28.1723), 4326)),
         
        ('household_015', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 7, 
         'KH-W7-002', 'KH-F-015', '2023-09-29',
         ARRAY[81.7334, 28.1734], 'सिमा क्षेत्र', 'मिना कुमारी श्रेष्ठ',
         '9855678901', 4, 'own', 'own', 'stone', 'bamboo', 'tin', 'mud',
         1, 2, 'no', 'no', 'landslide_risk', '1_HOUR_OR_MORE', '1_HOUR_OR_MORE',
         ST_SetSRID(ST_MakePoint(81.7334, 28.1734), 4326)),
         
        -- Ward 8
        ('household_016', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 8, 
         'KH-W8-001', 'KH-F-016', '2023-09-30',
         ARRAY[81.7412, 28.1756], 'पहाडी क्षेत्र', 'नारायण प्रसाद पौडेल',
         '9856789012', 7, 'own', 'own', 'stone', 'stone', 'tile', 'mud',
         1, 3, 'no', 'no', 'landslide_risk', 'UNDER_1_HOUR', '1_HOUR_OR_MORE',
         ST_SetSRID(ST_MakePoint(81.7412, 28.1756), 4326)),
         
        ('household_017', 'khajura', 'lumbini', '58', 'गढवा गाउँपालिका', 8, 
         'KH-W8-002', 'KH-F-017', '2023-10-01',
         ARRAY[81.7434, 28.1767], 'पहाडी क्षेत्र', 'सुरेश कुमार तामाङ',
         '9857890123', 5, 'own', 'own', 'stone', 'wood', 'tile', 'wood',
         1, 4, 'no', 'no', 'landslide_risk', '1_HOUR_OR_MORE', '1_HOUR_OR_MORE',
         ST_SetSRID(ST_MakePoint(81.7434, 28.1767), 4326));
    END IF;
END
$$;
