import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { updateHouseholdSchema } from "../households.schema";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const updateHouseholdProcedure = protectedProcedure
  .input(updateHouseholdSchema.extend({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    let { id: rawId, ...data } = input;
    
    // Ensure proper UUID format with 'uuid:' prefix
    const id = rawId.startsWith('uuid:') ? rawId : `uuid:${rawId}`;
    
    console.log("Using household ID for update:", id);

    // First check if the household exists and belongs to the right profile
    const checkQuery = sql`
      SELECT COUNT(*) as count 
      FROM acme_khajura_households
      WHERE id = ${id} AND profile_id = ${'khajura'}
    `;
    
    const checkResult = await ctx.db.execute(checkQuery);
    const count = parseInt(checkResult[0].count as string, 10);
    
    if (count === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Household not found or you do not have permission to update it',
      });
    }

    // Prepare column updates for the SET clause
    const updates: { column: string; value: any }[] = [];
    
    // Helper function to add a field to the update array
    const addField = (fieldName: string, value: any) => {
      if (value !== undefined) {
        updates.push({ column: fieldName, value });
      }
    };

    // Add all fields that need updating
    if (data.profileId !== undefined) addField('profile_id', data.profileId);
    if (data.province !== undefined) addField('province', data.province);
    if (data.district !== undefined) addField('district', data.district);
    if (data.localLevel !== undefined) addField('local_level', data.localLevel);
    if (data.wardNo !== undefined) addField('ward_no', data.wardNo);
    if (data.houseSymbolNo !== undefined) addField('house_symbol_no', data.houseSymbolNo);
    if (data.familySymbolNo !== undefined) addField('family_symbol_no', data.familySymbolNo);
    if (data.dateOfInterview !== undefined) addField('date_of_interview', data.dateOfInterview);
    if (data.householdLocation !== undefined) addField('household_location', data.householdLocation);
    if (data.locality !== undefined) addField('locality', data.locality);
    if (data.developmentOrganization !== undefined) addField('development_organization', data.developmentOrganization);
    
    // Family information
    if (data.familyHeadName !== undefined) addField('family_head_name', data.familyHeadName);
    if (data.familyHeadPhoneNo !== undefined) addField('family_head_phone_no', data.familyHeadPhoneNo);
    if (data.totalMembers !== undefined) addField('total_members', data.totalMembers);
    if (data.areMembersElsewhere !== undefined) addField('are_members_elsewhere', data.areMembersElsewhere);
    if (data.totalElsewhereMembers !== undefined) addField('total_elsewhere_members', data.totalElsewhereMembers);
    
    // House details
    if (data.houseOwnership !== undefined) addField('house_ownership', data.houseOwnership);
    if (data.houseOwnershipOther !== undefined) addField('house_ownership_other', data.houseOwnershipOther);
    if (data.landOwnership !== undefined) addField('land_ownership', data.landOwnership);
    if (data.landOwnershipOther !== undefined) addField('land_ownership_other', data.landOwnershipOther);
    if (data.houseBase !== undefined) addField('house_base', data.houseBase);
    if (data.houseBaseOther !== undefined) addField('house_base_other', data.houseBaseOther);
    if (data.houseOuterWall !== undefined) addField('house_outer_wall', data.houseOuterWall);
    if (data.houseOuterWallOther !== undefined) addField('house_outer_wall_other', data.houseOuterWallOther);
    if (data.houseRoof !== undefined) addField('house_roof', data.houseRoof);
    if (data.houseRoofOther !== undefined) addField('house_roof_other', data.houseRoofOther);
    if (data.houseFloor !== undefined) addField('house_floor', data.houseFloor);
    if (data.houseFloorOther !== undefined) addField('house_floor_other', data.houseFloorOther);
    
    // Safety information
    if (data.isHousePassed !== undefined) addField('is_house_passed', data.isHousePassed);
    if (data.isMapArchived !== undefined) addField('is_map_archived', data.isMapArchived);
    if (data.naturalDisasters !== undefined) addField('natural_disasters', data.naturalDisasters);
    if (data.isSafe !== undefined) addField('is_safe', data.isSafe);
    
    // Water, sanitation and energy
    if (data.waterSource !== undefined) addField('water_source', data.waterSource);
    if (data.waterPurificationMethods !== undefined) addField('water_purification_methods', data.waterPurificationMethods);
    if (data.toiletType !== undefined) addField('toilet_type', data.toiletType);
    if (data.solidWasteManagement !== undefined) addField('solid_waste_management', data.solidWasteManagement);
    if (data.primaryCookingFuel !== undefined) addField('primary_cooking_fuel', data.primaryCookingFuel);
    if (data.primaryEnergySource !== undefined) addField('primary_energy_source', data.primaryEnergySource);
    
    // Accessibility
    if (data.roadStatus !== undefined) addField('road_status', data.roadStatus);
    if (data.timeToPublicBus !== undefined) addField('time_to_public_bus', data.timeToPublicBus);
    if (data.timeToMarket !== undefined) addField('time_to_market', data.timeToMarket);
    if (data.distanceToActiveRoad !== undefined) addField('distance_to_active_road', data.distanceToActiveRoad);
    if (data.facilities !== undefined) addField('facilities', data.facilities);
    
    // Economic details
    if (data.hasPropertiesElsewhere !== undefined) addField('has_properties_elsewhere', data.hasPropertiesElsewhere);
    if (data.hasFemaleNamedProperties !== undefined) addField('has_female_named_properties', data.hasFemaleNamedProperties);
    if (data.organizationsLoanedFrom !== undefined) addField('organizations_loaned_from', data.organizationsLoanedFrom);
    if (data.loanUses !== undefined) addField('loan_uses', data.loanUses);
    if (data.timeToBank !== undefined) addField('time_to_bank', data.timeToBank);
    if (data.financialAccounts !== undefined) addField('financial_accounts', data.financialAccounts);
    if (data.incomeSources !== undefined) addField('income_sources', data.incomeSources);
    if (data.haveRemittance !== undefined) addField('have_remittance', data.haveRemittance);
    if (data.remittanceExpenses !== undefined) addField('remittance_expenses', data.remittanceExpenses);
    
    // Health
    if (data.haveHealthInsurance !== undefined) addField('have_health_insurance', data.haveHealthInsurance);
    if (data.consultingHealthOrganization !== undefined) addField('consulting_health_organization', data.consultingHealthOrganization);
    if (data.timeToHealthOrganization !== undefined) addField('time_to_health_organization', data.timeToHealthOrganization);
    
    // Municipal & Suggestions
    if (data.municipalSuggestions !== undefined) addField('municipal_suggestions', data.municipalSuggestions);
    
    // Agriculture & Livestock
    if (data.haveAgriculturalLand !== undefined) addField('have_agricultural_land', data.haveAgriculturalLand);
    if (data.agriculturalLands !== undefined) addField('agricultural_lands', data.agriculturalLands);
    if (data.areInvolvedInAgriculture !== undefined) addField('are_involved_in_agriculture', data.areInvolvedInAgriculture);
    if (data.foodCrops !== undefined) addField('food_crops', data.foodCrops);
    if (data.pulses !== undefined) addField('pulses', data.pulses);
    if (data.oilSeeds !== undefined) addField('oil_seeds', data.oilSeeds);
    if (data.vegetables !== undefined) addField('vegetables', data.vegetables);
    if (data.fruits !== undefined) addField('fruits', data.fruits);
    if (data.spices !== undefined) addField('spices', data.spices);
    if (data.cashCrops !== undefined) addField('cash_crops', data.cashCrops);
    if (data.areInvolvedInHusbandry !== undefined) addField('are_involved_in_husbandry', data.areInvolvedInHusbandry);
    if (data.animals !== undefined) addField('animals', data.animals);
    if (data.animalProducts !== undefined) addField('animal_products', data.animalProducts);
    
    // Aquaculture & Apiary
    if (data.haveAquaculture !== undefined) addField('have_aquaculture', data.haveAquaculture);
    if (data.pondNumber !== undefined) addField('pond_number', data.pondNumber);
    if (data.pondArea !== undefined) addField('pond_area', data.pondArea);
    if (data.fishProduction !== undefined) addField('fish_production', data.fishProduction);
    if (data.haveApiary !== undefined) addField('have_apiary', data.haveApiary);
    if (data.hiveNumber !== undefined) addField('hive_number', data.hiveNumber);
    if (data.honeyProduction !== undefined) addField('honey_production', data.honeyProduction);
    if (data.honeySales !== undefined) addField('honey_sales', data.honeySales);
    if (data.honeyRevenue !== undefined) addField('honey_revenue', data.honeyRevenue);
    
    // Agricultural operations
    if (data.hasAgriculturalInsurance !== undefined) addField('has_agricultural_insurance', data.hasAgriculturalInsurance);
    if (data.monthsInvolvedInAgriculture !== undefined) addField('months_involved_in_agriculture', data.monthsInvolvedInAgriculture);
    if (data.agriculturalMachines !== undefined) addField('agricultural_machines', data.agriculturalMachines);
    
    // Migration details
    if (data.birthPlace !== undefined) addField('birth_place', data.birthPlace);
    if (data.birthProvince !== undefined) addField('birth_province', data.birthProvince);
    if (data.birthDistrict !== undefined) addField('birth_district', data.birthDistrict);
    if (data.birthCountry !== undefined) addField('birth_country', data.birthCountry);
    if (data.priorLocation !== undefined) addField('prior_location', data.priorLocation);
    if (data.priorProvince !== undefined) addField('prior_province', data.priorProvince);
    if (data.priorDistrict !== undefined) addField('prior_district', data.priorDistrict);
    if (data.priorCountry !== undefined) addField('prior_country', data.priorCountry);
    if (data.residenceReason !== undefined) addField('residence_reason', data.residenceReason);
    
    // Business
    if (data.hasBusiness !== undefined) addField('has_business', data.hasBusiness);
    
    // Update timestamp
    addField('updated_at', new Date());

    // If there are fields to update
    if (updates.length > 0) {
      // Build update parts with proper sql parameter binding
      const setParts = updates.map(update => {
        return sql.raw(`${update.column} = ${sql.placeholder(update.column)}`);
      });
      
      const setClause = sql.join(setParts, sql`, `);
      
      // Create parameter object dynamically
      const params = updates.reduce((acc, update) => {
        acc[update.column] = update.value;
        return acc;
      }, {} as Record<string, any>);
      
      // Build the complete update query with parameters
      const updateQuery = sql`
        UPDATE acme_khajura_households
        SET ${setClause}
        WHERE id = ${id} AND profile_id = ${'khajura'}
        RETURNING id
      `;
      
      // Execute the query
      const result = await ctx.db.execute(updateQuery);
      
      return { id: result[0]?.id, success: true };
    } else {
      // No fields to update
      return { id, success: true };
    }
  });