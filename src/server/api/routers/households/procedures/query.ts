import { z } from "zod";
import { randomUUID } from "crypto";
import { protectedProcedure } from "@/server/api/trpc";
import { 
  householdQuerySchema,
  householdStatusSchema, 
  updateHouseholdSchema 
} from "../households.schema";
import { householdEditRequests, households } from "@/server/db/schema/households/households";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

// UUID Utility Functions
function formatDbUuid(uuid: string): string {
  // Remove any existing prefix and whitespace
  const cleanUuid = uuid.replace(/^(uuid:)?/, '').trim();
  // Add the prefix consistently
  return `uuid:${cleanUuid}`;
}

function normalizeUuid(uuid: string): string {
  // Remove any prefix and format consistently
  return uuid.replace(/^(uuid:)?/, '').trim().toLowerCase();
}

// Procedure to get a paginated list of households with basic info for cards
export const getHouseholdsProcedure = protectedProcedure
  .input(householdQuerySchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset, sortBy, sortOrder, filters } = input;

      let query = sql`
        SELECT 
          id,
          family_head_name,
          family_head_phone_no,
          ward_no,
          total_members,
          locality,
          house_symbol_no,
          date_of_interview
        FROM acme_buddhashanti_households
        WHERE profile_id = 'buddhashanti'
      `;

      if (input.search) {
        const searchTerm = `%${input.search}%`;
        query = sql`
          ${query} AND (
            family_head_name ILIKE ${searchTerm} OR
            family_head_phone_no ILIKE ${searchTerm} OR
            locality ILIKE ${searchTerm} OR
            house_symbol_no ILIKE ${searchTerm}
          )
        `;
      }

      if (filters) {
        if (filters.wardNo !== undefined) {
          query = sql`${query} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          query = sql`${query} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          query = sql`${query} AND district = ${filters.district}`;
        }

        if (filters.haveAgriculturalLand) {
          query = sql`${query} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.houseOwnership) {
          query = sql`${query} AND house_ownership = ${filters.houseOwnership}`;
        }

        if (filters.timeToPublicBus) {
          query = sql`${query} AND time_to_public_bus = ${filters.timeToPublicBus}`;
        }
      }

      if (sortBy === "family_head_name") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') ASC NULLS LAST`
          : sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') DESC NULLS LAST`;
      } else if (sortBy === "ward_no") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY ward_no ASC NULLS LAST`
          : sql`${query} ORDER BY ward_no DESC NULLS LAST`;
      } else if (sortBy === "date_of_interview") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY date_of_interview ASC NULLS LAST`
          : sql`${query} ORDER BY date_of_interview DESC NULLS LAST`;
      } else {
        query = sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') ASC NULLS LAST`;
      }

      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

      const result = await ctx.db.execute(query);
      
      const households = result.map(row => ({
        id: row.id,
        familyHeadName: row.family_head_name || "",
        familyHeadPhoneNo: row.family_head_phone_no || "",
        wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
        totalMembers: typeof row.total_members === 'number' ? row.total_members : null,
        locality: row.locality || "",
        houseSymbolNo: row.house_symbol_no || "",
        dateOfInterview: row.date_of_interview && (typeof row.date_of_interview === 'string' || typeof row.date_of_interview === 'number' || row.date_of_interview instanceof Date) ? new Date(row.date_of_interview) : null
      }));

      let countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_buddhashanti_households
        WHERE profile_id = 'buddhashanti'
      `;
      
      if (input.search) {
        const searchTerm = `%${input.search}%`;
        countQuery = sql`
          ${countQuery} AND (
            family_head_name ILIKE ${searchTerm} OR
            family_head_phone_no ILIKE ${searchTerm} OR
            locality ILIKE ${searchTerm} OR
            house_symbol_no ILIKE ${searchTerm}
          )
        `;
      }
      
      if (filters) {
        if (filters.wardNo !== undefined) {
          countQuery = sql`${countQuery} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          countQuery = sql`${countQuery} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          countQuery = sql`${countQuery} AND district = ${filters.district}`;
        }

        if (filters.haveAgriculturalLand) {
          countQuery = sql`${countQuery} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.houseOwnership) {
          countQuery = sql`${countQuery} AND house_ownership = ${filters.houseOwnership}`;
        }

        if (filters.timeToPublicBus) {
          countQuery = sql`${countQuery} AND time_to_public_bus = ${filters.timeToPublicBus}`;
        }
      }
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);

      return {
        households,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching households:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch households list",
      });
    }
  });

// Procedure to get a specific household by ID with complete details
export const getHouseholdByIdProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const normalizedId = normalizeUuid(input.id);
      const formattedId = formatDbUuid(normalizedId);
      
      let query = sql`
        SELECT * FROM acme_buddhashanti_households
        WHERE id = ${formattedId}
      `;
      
      let result = await ctx.db.execute(query);

      if (!result || result.length === 0) {
        query = sql`
          SELECT * FROM acme_buddhashanti_households
          WHERE id = ${normalizedId}
        `;
        result = await ctx.db.execute(query);
      }

      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found",
        });
      }

      const household = result[0];
      
      const parseArrayField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string' && field.startsWith('{') && field.endsWith('}')) {
          return field
            .substring(1, field.length - 1)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        }
        return [];
      };

      const parseDate = (dateField: any): Date | null => {
        if (!dateField) return null;
        try {
          return new Date(dateField);
        } catch (e) {
          return null;
        }
      };

      return {
        id: household.id,
        profileId: household.profile_id || "",
        province: household.province || "",
        district: household.district || "",
        localLevel: household.local_level || "",
        wardNo: typeof household.ward_no === 'number' ? household.ward_no : null,
        houseSymbolNo: household.house_symbol_no || "",
        familySymbolNo: household.family_symbol_no || "",
        dateOfInterview: parseDate(household.date_of_interview),
        householdLocation: parseArrayField(household.household_location),
        locality: household.locality || "",
        developmentOrganization: household.development_organization || "",
        familyHeadName: household.family_head_name || "",
        familyHeadPhoneNo: household.family_head_phone_no || "",
        totalMembers: typeof household.total_members === 'number' ? household.total_members : null,
        areMembersElsewhere: household.are_members_elsewhere || "",
        totalElsewhereMembers: typeof household.total_elsewhere_members === 'number' ? household.total_elsewhere_members : null,
        houseOwnership: household.house_ownership || "",
        houseOwnershipOther: household.house_ownership_other || "",
        landOwnership: household.land_ownership || "",
        landOwnershipOther: household.land_ownership_other || "",
        houseBase: household.house_base || "",
        houseBaseOther: household.house_base_other || "",
        houseOuterWall: household.house_outer_wall || "",
        houseOuterWallOther: household.house_outer_wall_other || "",
        houseRoof: household.house_roof || "",
        houseRoofOther: household.house_roof_other || "",
        houseFloor: household.house_floor || "",
        houseFloorOther: household.house_floor_other || "",
        isHousePassed: household.is_house_passed || "",
        isMapArchived: household.is_map_archived || "",
        naturalDisasters: parseArrayField(household.natural_disasters),
        isSafe: household.is_safe || "",
        waterSource: household.water_source || "",
        waterPurificationMethods: household.water_purification_methods || "",
        toiletType: household.toilet_type || "",
        solidWasteManagement: household.solid_waste_management || "",
        primaryCookingFuel: household.primary_cooking_fuel || "",
        primaryEnergySource: household.primary_energy_source || "",
        roadStatus: household.road_status || "",
        timeToPublicBus: household.time_to_public_bus || "",
        timeToMarket: household.time_to_market || "",
        distanceToActiveRoad: household.distance_to_active_road || "",
        facilities: parseArrayField(household.facilities),
        hasPropertiesElsewhere: household.has_properties_elsewhere || "",
        hasFemaleNamedProperties: household.has_female_named_properties || "",
        organizationsLoanedFrom: parseArrayField(household.organizations_loaned_from),
        loanUses: parseArrayField(household.loan_uses),
        timeToBank: household.time_to_bank || "",
        financialAccounts: parseArrayField(household.financial_accounts),
        incomeSources: parseArrayField(household.income_sources),
        haveRemittance: household.have_remittance || "",
        remittanceExpenses: parseArrayField(household.remittance_expenses),
        haveHealthInsurance: household.have_health_insurance || "",
        consultingHealthOrganization: household.consulting_health_organization || "",
        timeToHealthOrganization: household.time_to_health_organization || "",
        municipalSuggestions: parseArrayField(household.municipal_suggestions),
        haveAgriculturalLand: household.have_agricultural_land || "",
        agriculturalLands: parseArrayField(household.agricultural_lands),
        areInvolvedInAgriculture: household.are_involved_in_agriculture || "",
        foodCrops: parseArrayField(household.food_crops),
        pulses: parseArrayField(household.pulses),
        oilSeeds: parseArrayField(household.oil_seeds),
        vegetables: parseArrayField(household.vegetables),
        fruits: parseArrayField(household.fruits),
        spices: parseArrayField(household.spices),
        cashCrops: parseArrayField(household.cash_crops),
        areInvolvedInHusbandry: household.are_involved_in_husbandry || "",
        animals: parseArrayField(household.animals),
        animalProducts: parseArrayField(household.animal_products),
        haveAquaculture: household.have_aquaculture || "",
        pondNumber: typeof household.pond_number === 'number' ? household.pond_number : null,
        pondArea: typeof household.pond_area === 'number' ? household.pond_area : null,
        fishProduction: typeof household.fish_production === 'number' ? household.fish_production : null,
        haveApiary: household.have_apiary || "",
        hiveNumber: typeof household.hive_number === 'number' ? household.hive_number : null,
        honeyProduction: typeof household.honey_production === 'number' ? household.honey_production : null,
        honeySales: typeof household.honey_sales === 'number' ? household.honey_sales : null,
        honeyRevenue: typeof household.honey_revenue === 'number' ? household.honey_revenue : null,
        hasAgriculturalInsurance: household.has_agricultural_insurance || "",
        monthsInvolvedInAgriculture: household.months_involved_in_agriculture || "",
        agriculturalMachines: parseArrayField(household.agricultural_machines),
        birthPlace: household.birth_place || "",
        birthProvince: household.birth_province || "",
        birthDistrict: household.birth_district || "",
        birthCountry: household.birth_country || "",
        priorLocation: household.prior_location || "",
        priorProvince: household.prior_province || "",
        priorDistrict: household.prior_district || "",
        priorCountry: household.prior_country || "",
        residenceReason: household.residence_reason || "",
        hasBusiness: household.has_business || "",
        deviceId: household.device_id || "",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching household by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch household details",
      });
    }
  });

// Procedure to request edits for a household
export const requestHouseholdEditProcedure = protectedProcedure
  .input(householdStatusSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const formattedHouseholdId = formatDbUuid(input.householdId);
      
      const existingHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      if (!existingHousehold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found"
        });
      }
      
      const editRequestId = randomUUID();
      
      await ctx.db.insert(householdEditRequests).values({
        id: formatDbUuid(editRequestId),
        householdId: formattedHouseholdId,
        message: input.message || "Edit requested",
        requestedAt: new Date()
      });
      
      return {
        success: true,
        message: "Edit request submitted successfully",
        id: editRequestId
      };
    } catch (error) {
      console.error("Error requesting household edit:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to request household edit",
        cause: error
      });
    }
  });

// Procedure to edit a household
export const editHouseholdProcedure = protectedProcedure
  .input(z.object({
    householdId: z.string(),
    editRequestId: z.string().optional(),
    ...updateHouseholdSchema.shape
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const formattedHouseholdId = formatDbUuid(input.householdId);
      const formattedEditRequestId = input.editRequestId 
        ? formatDbUuid(input.editRequestId)
        : undefined;

      const { editRequestId: _, householdId: __, ...updateData } = input;

      const existingHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      if (!existingHousehold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found"
        });
      }
      
      await ctx.db.update(households)
        .set(updateData)
        .where(eq(households.id, formattedHouseholdId));
      
      if (formattedEditRequestId) {
        await ctx.db.delete(householdEditRequests)
          .where(eq(householdEditRequests.id, formattedEditRequestId));
      }
      
      const updatedHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      return {
        success: true,
        message: "Household updated successfully",
        data: updatedHousehold
      };
    } catch (error) {
      console.error("Error updating household:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update household",
        cause: error
      });
    }
  });

// Procedure to get all edit requests
export const getHouseholdEditRequestsProcedure = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset } = input;
      
      const query = sql`
        SELECT 
          e.id, 
          e.household_id, 
          e.message, 
          e.requested_at,
          h.family_head_name,
          h.ward_no,
          h.locality
        FROM acme_buddhashanti_household_edit_requests e
        JOIN acme_buddhashanti_households h ON h.id = e.household_id
        ORDER BY e.requested_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const editRequests = await ctx.db.execute(query);
      
      const countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_buddhashanti_household_edit_requests
      `;
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);
      
      const mappedRequests = editRequests.map(req => ({
        id: req.id,
        householdId: req.household_id,
        message: req.message || "",
        requestedAt: req.requested_at && (typeof req.requested_at === 'string' || typeof req.requested_at === 'number' || req.requested_at instanceof Date) ? new Date(req.requested_at) : null,
        familyHeadName: req.family_head_name || "",
        wardNo: typeof req.ward_no === 'number' ? req.ward_no : null,
        locality: req.locality || ""
      }));
      
      return {
        editRequests: mappedRequests,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching edit requests:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch edit requests",
      });
    }
  });