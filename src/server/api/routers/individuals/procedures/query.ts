import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { individualQuerySchema } from "../individuals.schema";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { individuals } from "@/server/db/schema/individuals/individuals";
import { eq } from "drizzle-orm";

// UUID utility functions (reusing from households)
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

// Procedure to get a paginated list of individuals
export const getIndividualsProcedure = protectedProcedure
  .input(individualQuerySchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset, sortBy, sortOrder, filters } = input;

      // Build the base query
      let query = sql`
        SELECT 
          id,
          tenant_id,
          parent_id,
          ward_no,
          name,
          gender,
          age,
          family_role,
          is_present,
          educational_level,
          is_disabled,
          marital_status
        FROM acme_buddhashanti_individuals
        WHERE 1=1
      `;

      // Add search functionality
      if (input.search) {
        const searchTerm = `%${input.search}%`;
        query = sql`
          ${query} AND (
            name ILIKE ${searchTerm} OR
            family_role ILIKE ${searchTerm}
          )
        `;
      }

      // Add filters
      if (filters) {
        if (filters.wardNo !== undefined) {
          query = sql`${query} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.gender) {
          query = sql`${query} AND gender = ${filters.gender}`;
        }
        
        if (filters.age !== undefined) {
          query = sql`${query} AND age = ${filters.age}`;
        }
        
        if (filters.familyRole) {
          query = sql`${query} AND family_role = ${filters.familyRole}`;
        }
        
        if (filters.isPresent) {
          query = sql`${query} AND is_present = ${filters.isPresent}`;
        }
        
        if (filters.educationalLevel) {
          query = sql`${query} AND educational_level = ${filters.educationalLevel}`;
        }
        
        if (filters.isDisabled) {
          query = sql`${query} AND is_disabled = ${filters.isDisabled}`;
        }
        
        // Filter by parent_id (household ID)
        if (filters.parentId) {
          const formattedParentId = formatDbUuid(filters.parentId);
          query = sql`${query} AND parent_id = ${formattedParentId}`;
        }
      }

      // Add sorting
      if (sortBy === "name") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY name ASC NULLS LAST`
          : sql`${query} ORDER BY name DESC NULLS LAST`;
      } else if (sortBy === "age") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY age ASC NULLS LAST`
          : sql`${query} ORDER BY age DESC NULLS LAST`;
      } else if (sortBy === "gender") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY gender ASC NULLS LAST`
          : sql`${query} ORDER BY gender DESC NULLS LAST`;
      } else if (sortBy === "familyRole") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY family_role ASC NULLS LAST`
          : sql`${query} ORDER BY family_role DESC NULLS LAST`;
      } else {
        // Default sorting
        query = sql`${query} ORDER BY name ASC NULLS LAST`;
      }

      // Add pagination
      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

      // Execute the query
      const result = await ctx.db.execute(query);
      
      // Transform the raw DB result to ensure proper field names
      const individualsList = result.map(row => ({
        id: row.id,
        tenantId: row.tenant_id || "",
        parentId: row.parent_id,
        wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
        name: row.name || "",
        gender: row.gender || "",
        age: typeof row.age === 'number' ? row.age : null,
        familyRole: row.family_role || "",
        isPresent: row.is_present || "",
        educationalLevel: row.educational_level || "",
        isDisabled: row.is_disabled || "",
        maritalStatus: row.marital_status || ""
      }));

      // Build count query with the same filters
      let countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_buddhashanti_individuals
        WHERE 1=1
      `;
      
      // Apply the same filters to the count query
      if (input.search) {
        const searchTerm = `%${input.search}%`;
        countQuery = sql`
          ${countQuery} AND (
            name ILIKE ${searchTerm} OR
            family_role ILIKE ${searchTerm}
          )
        `;
      }
      
      if (filters) {
        if (filters.wardNo !== undefined) {
          countQuery = sql`${countQuery} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.gender) {
          countQuery = sql`${countQuery} AND gender = ${filters.gender}`;
        }
        
        if (filters.age !== undefined) {
          countQuery = sql`${countQuery} AND age = ${filters.age}`;
        }
        
        if (filters.familyRole) {
          countQuery = sql`${countQuery} AND family_role = ${filters.familyRole}`;
        }
        
        if (filters.isPresent) {
          countQuery = sql`${countQuery} AND is_present = ${filters.isPresent}`;
        }
        
        if (filters.educationalLevel) {
          countQuery = sql`${countQuery} AND educational_level = ${filters.educationalLevel}`;
        }
        
        if (filters.isDisabled) {
          countQuery = sql`${countQuery} AND is_disabled = ${filters.isDisabled}`;
        }
        
        if (filters.parentId) {
          const formattedParentId = formatDbUuid(filters.parentId);
          countQuery = sql`${countQuery} AND parent_id = ${formattedParentId}`;
        }
      }
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);

      return {
        individuals: individualsList,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching individuals:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch individuals list",
      });
    }
  });

// Procedure to get a specific individual by ID
export const getIndividualByIdProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const normalizedId = normalizeUuid(input.id);
      const formattedId = formatDbUuid(normalizedId);
      
      // Try to fetch with formatted ID
      let result = await ctx.db.select()
        .from(individuals)
        .where(eq(individuals.id, formattedId))
        .limit(1);
      
      // If not found, try with normalized ID
      if (!result || result.length === 0) {
        result = await ctx.db.select()
          .from(individuals)
          .where(eq(individuals.id, normalizedId))
          .limit(1);
      }

      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Individual not found",
        });
      }

      const individual = result[0];
      
      return {
        id: individual.id,
        tenantId: individual.tenantId || "",
        parentId: individual.parentId,
        wardNo: individual.wardNo,
        deviceId: individual.deviceId || "",
        
        // Personal information
        name: individual.name,
        gender: individual.gender,
        age: individual.age,
        familyRole: individual.familyRole || "",
        
        // Citizenship and demographics
        citizenOf: individual.citizenOf || "",
        citizenOfOther: individual.citizenOfOther || "",
        caste: individual.caste || "",
        casteOther: individual.casteOther || "",
        
        // Language and religion
        ancestorLanguage: individual.ancestorLanguage || "",
        ancestorLanguageOther: individual.ancestorLanguageOther || "",
        primaryMotherTongue: individual.primaryMotherTongue || "",
        primaryMotherTongueOther: individual.primaryMotherTongueOther || "",
        religion: individual.religion || "",
        religionOther: individual.religionOther || "",
        
        // Marital status
        maritalStatus: individual.maritalStatus || "",
        marriedAge: individual.marriedAge,
        
        // Health information
        hasChronicDisease: individual.hasChronicDisease || "",
        primaryChronicDisease: individual.primaryChronicDisease || "",
        isSanitized: individual.isSanitized || "",
        
        // Disability information
        isDisabled: individual.isDisabled || "",
        disabilityType: individual.disabilityType || "",
        disabilityTypeOther: individual.disabilityTypeOther || "",
        disabilityCause: individual.disabilityCause || "",
        
        // Birth and children information
        hasBirthCertificate: individual.hasBirthCertificate || "",
        gaveLiveBirth: individual.gaveLiveBirth || "",
        aliveSons: individual.aliveSons,
        aliveDaughters: individual.aliveDaughters,
        totalBornChildren: individual.totalBornChildren,
        hasDeadChildren: individual.hasDeadChildren || "",
        deadSons: individual.deadSons,
        deadDaughters: individual.deadDaughters,
        totalDeadChildren: individual.totalDeadChildren,
        
        // Recent childbirth information
        gaveRecentLiveBirth: individual.gaveRecentLiveBirth || "",
        recentBornSons: individual.recentBornSons,
        recentBornDaughters: individual.recentBornDaughters,
        totalRecentChildren: individual.totalRecentChildren,
        recentDeliveryLocation: individual.recentDeliveryLocation || "",
        prenatalCheckups: individual.prenatalCheckups,
        firstDeliveryAge: individual.firstDeliveryAge,
        
        // Presence and absence information
        isPresent: individual.isPresent || "",
        absenteeAge: individual.absenteeAge,
        absenteeEducationalLevel: individual.absenteeEducationalLevel || "",
        absenceReason: individual.absenceReason || "",
        absenteeLocation: individual.absenteeLocation || "",
        absenteeProvince: individual.absenteeProvince || "",
        absenteeDistrict: individual.absenteeDistrict || "",
        absenteeCountry: individual.absenteeCountry || "",
        absenteeHasSentCash: individual.absenteeHasSentCash || "",
        absenteeCashAmount: individual.absenteeCashAmount,
        
        // Education information
        literacyStatus: individual.literacyStatus || "",
        schoolPresenceStatus: individual.schoolPresenceStatus || "",
        educationalLevel: individual.educationalLevel || "",
        primarySubject: individual.primarySubject || "",
        goesSchool: individual.goesSchool || "",
        schoolBarrier: individual.schoolBarrier || "",
        
        // Skills and training
        hasTraining: individual.hasTraining || "",
        training: individual.training || "",
        monthsTrained: individual.monthsTrained,
        primarySkill: individual.primarySkill || "",
        
        // Internet access
        hasInternetAccess: individual.hasInternetAccess || "",
        
        // Employment information
        financialWorkDuration: individual.financialWorkDuration || "",
        primaryOccupation: individual.primaryOccupation || "",
        workBarrier: individual.workBarrier || "",
        workAvailability: individual.workAvailability || "",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching individual by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch individual details",
      });
    }
  });

// Procedure to get individuals by household ID (parent_id)
export const getIndividualsByHouseholdIdProcedure = protectedProcedure
  .input(z.object({
    householdId: z.string(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { householdId, limit, offset } = input;
      
      // Format the household ID correctly for the database
      const formattedHouseholdId = formatDbUuid(householdId);
      
      // Query to get individuals with the specified parent_id
      const query = sql`
        SELECT * FROM acme_buddhashanti_individuals
        WHERE parent_id = ${formattedHouseholdId}
        ORDER BY 
          CASE 
            WHEN family_role = 'head' THEN 1
            WHEN family_role = 'spouse' THEN 2
            ELSE 3
          END,
          age DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const result = await ctx.db.execute(query);
      
      // Get count for pagination
      const countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_buddhashanti_individuals
        WHERE parent_id = ${formattedHouseholdId}
      `;
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);
      
      // Transform the results
      const individuals = result.map(row => ({
        id: row.id,
        tenantId: row.tenant_id || "",
        parentId: row.parent_id,
        wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
        name: row.name || "",
        gender: row.gender || "",
        age: typeof row.age === 'number' ? row.age : null,
        familyRole: row.family_role || "",
        isPresent: row.is_present || "",
        maritalStatus: row.marital_status || "",
        citizenOf: row.citizen_of || "",
        caste: row.caste || "",
        educationalLevel: row.educational_level || "",
        isDisabled: row.is_disabled || "",
        disabilityType: row.disability_type || "",
        primaryOccupation: row.primary_occupation || "",
      }));
      
      return {
        individuals,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
          householdId,
        },
      };
    } catch (error) {
      console.error("Error fetching individuals by household ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch family members",
      });
    }
  });
