import { z } from "zod";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createHouseholdSchema } from "../households.schema";
import { households } from "@/server/db/schema/households/households";
import { eq } from "drizzle-orm";

/**
 * Procedure to create a new household
 */
export const createHouseholdProcedure = publicProcedure
  .input(createHouseholdSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const id = randomUUID();

      // Prepare household data
      const householdData = {
        id,
        profileId: input.profileId || "khajura",
        
        // Location information
        province: input.province || null,
        district: input.district || null,
        localLevel: input.localLevel || null,
        wardNo: input.wardNo || null,
        houseSymbolNo: input.houseSymbolNo || null,
        familySymbolNo: input.familySymbolNo || null,
        dateOfInterview: input.dateOfInterview || null,
        householdLocation: input.householdLocation || null,
        locality: input.locality || null,
        developmentOrganization: input.developmentOrganization || null,
        
        // Family information
        familyHeadName: input.familyHeadName,
        familyHeadPhoneNo: input.familyHeadPhoneNo || null,
        totalMembers: input.totalMembers || null,
        areMembersElsewhere: input.areMembersElsewhere || null,
        totalElsewhereMembers: input.totalElsewhereMembers || null,
        
        // House details
        houseOwnership: input.houseOwnership || null,
        houseOwnershipOther: input.houseOwnershipOther || null,
        landOwnership: input.landOwnership || null,
        landOwnershipOther: input.landOwnershipOther || null,
        houseBase: input.houseBase || null,
        houseBaseOther: input.houseBaseOther || null,
        houseOuterWall: input.houseOuterWall || null,
        houseOuterWallOther: input.houseOuterWallOther || null,
        houseRoof: input.houseRoof || null,
        houseRoofOther: input.houseRoofOther || null,
        houseFloor: input.houseFloor || null,
        houseFloorOther: input.houseFloorOther || null,
        
        // Safety information
        isHousePassed: input.isHousePassed || null,
        isMapArchived: input.isMapArchived || null,
        naturalDisasters: input.naturalDisasters || null,
        isSafe: input.isSafe || null,
        
        // Water, sanitation and energy
        waterSource: input.waterSource || null,
        waterPurificationMethods: input.waterPurificationMethods || null,
        toiletType: input.toiletType || null,
        solidWasteManagement: input.solidWasteManagement || null,
        primaryCookingFuel: input.primaryCookingFuel || null,
        primaryEnergySource: input.primaryEnergySource || null,
        
        // Accessibility
        roadStatus: input.roadStatus || null,
        timeToPublicBus: input.timeToPublicBus || null,
        timeToMarket: input.timeToMarket || null,
        distanceToActiveRoad: input.distanceToActiveRoad || null,
        facilities: input.facilities || null,
        
        // Economic details
        hasPropertiesElsewhere: input.hasPropertiesElsewhere || null,
        hasFemaleNamedProperties: input.hasFemaleNamedProperties || null,
        organizationsLoanedFrom: input.organizationsLoanedFrom || null,
        loanUses: input.loanUses || null,
        timeToBank: input.timeToBank || null,
        financialAccounts: input.financialAccounts || null,
        incomeSources: input.incomeSources || null,
        
        // Remittance fields
        haveRemittance: input.haveRemittance || null,
        remittanceExpenses: input.remittanceExpenses || null,
        
        // Health
        haveHealthInsurance: input.haveHealthInsurance || null,
        consultingHealthOrganization: input.consultingHealthOrganization || null,
        timeToHealthOrganization: input.timeToHealthOrganization || null,
        
        // Municipal & Suggestions
        municipalSuggestions: input.municipalSuggestions || null,
        
        // Agriculture & Livestock
        haveAgriculturalLand: input.haveAgriculturalLand || null,
        agriculturalLands: input.agriculturalLands || null,
        areInvolvedInAgriculture: input.areInvolvedInAgriculture || null,
        foodCrops: input.foodCrops || null,
        pulses: input.pulses || null,
        oilSeeds: input.oilSeeds || null,
        vegetables: input.vegetables || null,
        fruits: input.fruits || null,
        spices: input.spices || null,
        cashCrops: input.cashCrops || null,
        areInvolvedInHusbandry: input.areInvolvedInHusbandry || null,
        animals: input.animals || null,
        animalProducts: input.animalProducts || null,
        
        // Aquaculture & Apiary
        haveAquaculture: input.haveAquaculture || null,
        pondNumber: input.pondNumber || null,
        pondArea: input.pondArea || null,
        fishProduction: input.fishProduction || null,
        haveApiary: input.haveApiary || null,
        hiveNumber: input.hiveNumber || null,
        honeyProduction: input.honeyProduction || null,
        honeySales: input.honeySales || null,
        honeyRevenue: input.honeyRevenue || null,
        
        // Agricultural operations
        hasAgriculturalInsurance: input.hasAgriculturalInsurance || null,
        monthsInvolvedInAgriculture: input.monthsInvolvedInAgriculture || null,
        agriculturalMachines: input.agriculturalMachines || null,
        
        // Migration details
        birthPlace: input.birthPlace || null,
        birthProvince: input.birthProvince || null,
        birthDistrict: input.birthDistrict || null,
        birthCountry: input.birthCountry || null,
        priorLocation: input.priorLocation || null,
        priorProvince: input.priorProvince || null,
        priorDistrict: input.priorDistrict || null,
        priorCountry: input.priorCountry || null,
        residenceReason: input.residenceReason || null,
        
        // Business
        hasBusiness: input.hasBusiness || null,
        
        // System fields
        deviceId: input.deviceId || null,
      };

      // Insert household into database
      //@ts-ignore
      await ctx.db.insert(households).values(householdData);

      // Retrieve the created household 
      const createdHousehold = await ctx.db
        .select()
        .from(households)
        .where(eq(households.id, id))
        .then((rows) => rows[0]);

      return {
        success: true,
        message: "Household created successfully",
        data: createdHousehold,
      };
    } catch (error) {
      console.error("Error creating household:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create household",
        cause: error,
      });
    }
  });
