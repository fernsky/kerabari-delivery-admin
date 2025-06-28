import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { businessQuerySchema } from "../business.schema";
import { business } from "@/server/db/schema/business/business";
import { surveyAttachments } from "@/server/db/schema";
import { and, eq, sql, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

// UUID utility functions (reusing from households)
function formatDbUuid(uuid: string): string {
  // Remove any existing prefix and whitespace
  const cleanUuid = uuid.replace(/^(uuid:)?/, '').trim();
  // Add the prefix consistently
  return `${cleanUuid}`;
}

function normalizeUuid(uuid: string): string {
  // Remove any prefix and format consistently
  return uuid.replace(/^(uuid:)?/, '').trim().toLowerCase();
}

export const getAll = protectedProcedure
  .input(businessQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy = "businessName", sortOrder = "asc", filters, search } = input;

    let query = sql`
      SELECT 
        id,
        business_name,
        operator_name,
        ward_no,
        business_nature,
        business_type,
        operator_phone,
        is_business_registered,
        business_investment,
        status
      FROM acme_buddhashanti_business
      WHERE 1=1
    `;

    // Add search functionality
    if (search && search.length > 2) {
      const searchTerm = `%${search}%`;
      query = sql`
        ${query} AND (
          business_name ILIKE ${searchTerm} OR
          operator_name ILIKE ${searchTerm} OR
          business_nature ILIKE ${searchTerm} OR
          business_type ILIKE ${searchTerm}
        )
      `;
    }

    // Add filters
    if (filters) {
      if (filters.wardNo !== undefined) {
        query = sql`${query} AND ward_no = ${filters.wardNo}`;
      }
      
      if (filters.businessDistrict) {
        query = sql`${query} AND business_district = ${filters.businessDistrict}`;
      }
      
      if (filters.businessProvince) {
        query = sql`${query} AND business_province = ${filters.businessProvince}`;
      }
      
      if (filters.status && filters.status !== "all") {
        query = sql`${query} AND status = ${filters.status}`;
      }
    }

    // Add sorting
    if (sortBy === "businessName") {
      query = sortOrder === "asc" 
        ? sql`${query} ORDER BY business_name ASC NULLS LAST`
        : sql`${query} ORDER BY business_name DESC NULLS LAST`;
    } else if (sortBy === "ward_no") {
      query = sortOrder === "asc" 
        ? sql`${query} ORDER BY ward_no ASC NULLS LAST`
        : sql`${query} ORDER BY ward_no DESC NULLS LAST`;
    } else if (sortBy === "business_district") {
      query = sortOrder === "asc" 
        ? sql`${query} ORDER BY business_district ASC NULLS LAST`
        : sql`${query} ORDER BY business_district DESC NULLS LAST`;
    } else if (sortBy === "operator_name") {
      query = sortOrder === "asc" 
        ? sql`${query} ORDER BY operator_name ASC NULLS LAST`
        : sql`${query} ORDER BY operator_name DESC NULLS LAST`;
    } else if (sortBy === "status") {
      query = sortOrder === "asc" 
        ? sql`${query} ORDER BY status ASC NULLS LAST`
        : sql`${query} ORDER BY status DESC NULLS LAST`;
    } else {
      // Default sorting
      query = sql`${query} ORDER BY business_name ASC NULLS LAST`;
    }

    // Add pagination
    query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

    try {
      // Execute the query
      const result = await ctx.db.execute(query);
      
      // Transform the raw DB result to ensure proper field names
      const businessList = result.map(row => ({
        id: row.id,
        businessName: row.business_name || "",
        operatorName: row.operator_name || "",
        wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
        businessNature: row.business_nature || "",
        businessType: row.business_type || "",
        operatorPhone: row.operator_phone || "",
        registrationStatus: row.is_business_registered || "",
        businessInvestment: typeof row.business_investment === 'number' ? row.business_investment : 0,
        status: row.status || "pending"
      }));

      // Build count query with the same filters
      let countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_buddhashanti_business
        WHERE 1=1
      `;
      
      // Apply the same filters to the count query
      if (search && search.length > 2) {
        const searchTerm = `%${search}%`;
        countQuery = sql`
          ${countQuery} AND (
            business_name ILIKE ${searchTerm} OR
            operator_name ILIKE ${searchTerm} OR
            business_nature ILIKE ${searchTerm} OR
            business_type ILIKE ${searchTerm}
          )
        `;
      }
      
      if (filters) {
        if (filters.wardNo !== undefined) {
          countQuery = sql`${countQuery} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.businessDistrict) {
          countQuery = sql`${countQuery} AND business_district = ${filters.businessDistrict}`;
        }
        
        if (filters.businessProvince) {
          countQuery = sql`${countQuery} AND business_province = ${filters.businessProvince}`;
        }
        
        if (filters.status && filters.status !== "all") {
          countQuery = sql`${countQuery} AND status = ${filters.status}`;
        }
      }
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);

      return {
        data: businessList,
        pagination: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch businesses list",
      });
    }
  });

export const getById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    try {

      const finalId=`uuid:${input.id}`;

      console.log(finalId);

      // Try to fetch with the formatted ID
      let query = sql`
        SELECT * FROM acme_buddhashanti_business
        WHERE id = ${finalId}
      `;
      
      let result = await ctx.db.execute(query);

      // If not found, try with just the normalized ID
      if (!result || result.length === 0) {
        query = sql`
          SELECT * FROM acme_buddhashanti_business
          WHERE id = ${finalId}
        `;
        result = await ctx.db.execute(query);
      }

      // If still not found, throw error
      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      const businessData = result[0];
      
      // Helper functions to parse fields
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
      
      // Process location data for map display
      let latitude = null;
      let longitude = null;
      
      // Try to extract lat/long from businessLocation array or from geom field
      const locationArray = parseArrayField(businessData.business_location);
      if (locationArray.length >= 2) {
        const possibleLat = parseFloat(locationArray[0]);
        const possibleLng = parseFloat(locationArray[1]);
        
        if (!isNaN(possibleLat) && !isNaN(possibleLng)) {
          latitude = possibleLat;
          longitude = possibleLng;
        }
      } else if (businessData.geom) {
        // If there's a geom field, try to extract coordinates
        try {
          // Example assuming geom is a Point: "POINT(lng lat)"
          const geomStr = businessData.geom.toString();
          const match = geomStr.match(/POINT\(([^ ]+) ([^)]+)\)/i);
          if (match) {
            longitude = parseFloat(match[1]);
            latitude = parseFloat(match[2]);
          }
        } catch (e) {
          console.error("Error parsing geom:", e);
        }
      }
      
      // Transform the business data to a consistent format
      const formattedBusiness = {
        // Primary identification
        id: businessData.id,
        wardNo: typeof businessData.ward_no === 'number' ? businessData.ward_no : null,
        tenantId: businessData.tenant_id || "",
        deviceId: businessData.device_id || "",
        
        // Location and basic information
        businessLocation: parseArrayField(businessData.business_location),
        dateOfInterview: parseDate(businessData.date_of_interview),
        businessName: businessData.business_name || "",
        businessProvince: businessData.business_province || "",
        businessDistrict: businessData.business_district || "",
        businessLocalLevel: businessData.business_local_level || "",
        businessLocality: businessData.business_locality || "",
        
        // Operator details
        operatorName: businessData.operator_name || "",
        operatorPhone: businessData.operator_phone || "",
        operatorAge: typeof businessData.operator_age === 'number' ? businessData.operator_age : null,
        operatorGender: businessData.operator_gender || "",
        operatorEducationalLevel: businessData.operator_educational_level || "",
        
        // Business classification
        businessNature: businessData.business_nature || "",
        businessNatureOther: businessData.business_nature_other || "",
        businessType: businessData.business_type || "",
        businessTypeOther: businessData.business_type_other || "",
        
        // Registration and legal information
        isBusinessRegistered: businessData.is_business_registered || "",
        registeredBodies: parseArrayField(businessData.registered_bodies),
        registeredBodiesOther: parseArrayField(businessData.registered_bodies_other),
        statutoryStatus: businessData.statutory_status || "",
        statutoryStatusOther: businessData.statutory_status_other || "",
        hasPanNumber: businessData.has_pan_number || "",
        panNumber: typeof businessData.pan_number === 'number' ? businessData.pan_number : null,
        
        // Ownership and property information
        businessOwnershipStatus: businessData.business_ownership_status || "",
        businessOwnershipStatusOther: businessData.business_ownership_status_other || "",
        businessLocationOwnership: businessData.business_location_ownership || "",
        businessLocationOwnershipOther: businessData.business_location_ownership_other || "",
        
        // Hotel-specific information
        hotelAccomodationType: businessData.hotel_accomodation_type || "",
        hotelRoomNumbers: typeof businessData.hotel_room_numbers === 'number' ? businessData.hotel_room_numbers : null,
        hotelBedNumbers: typeof businessData.hotel_bed_numbers === 'number' ? businessData.hotel_bed_numbers : null,
        hotelRoomTypes: parseArrayField(businessData.hotel_room_types),
        
        // Agricultural business details
        agriculturalBusinesses: parseArrayField(businessData.agricultural_businesses),
        businessFoodCrops: parseArrayField(businessData.business_food_crops),
        businessPulses: parseArrayField(businessData.business_pulses),
        businessOilSeeds: parseArrayField(businessData.business_oil_seeds),
        businessVegetables: parseArrayField(businessData.business_vegetables),
        businessFruits: parseArrayField(businessData.business_fruits),
        businessSpices: parseArrayField(businessData.business_spices),
        businessCashCrops: parseArrayField(businessData.business_cash_crops),
        businessAnimals: parseArrayField(businessData.business_animals),
        businessAnimalProducts: parseArrayField(businessData.business_animal_products),
        
        // Financial information
        businessInvestment: typeof businessData.business_investment === 'number' ? businessData.business_investment : null,
        businessProfit: typeof businessData.business_profit === 'number' ? businessData.business_profit : null,
        businessPastYearInvestment: typeof businessData.business_past_year_investment === 'number' ? businessData.business_past_year_investment : null,
        
        // Partner information
        hasBusinessPartners: businessData.has_business_partners || "",
        totalPartners: typeof businessData.total_partners === 'number' ? businessData.total_partners : null,
        nepaliMalePartners: typeof businessData.nepali_male_partners === 'number' ? businessData.nepali_male_partners : null,
        nepaliFemalePartners: typeof businessData.nepali_female_partners === 'number' ? businessData.nepali_female_partners : null,
        hasForeignPartners: businessData.has_foreign_partners || "",
        foreignMalePartners: typeof businessData.foreign_male_partners === 'number' ? businessData.foreign_male_partners : null,
        foreignFemalePartners: typeof businessData.foreign_female_partners === 'number' ? businessData.foreign_female_partners : null,
        
        // Family involvement
        hasInvolvedFamily: businessData.has_involved_family || "",
        totalInvolvedFamily: typeof businessData.total_involved_family === 'number' ? businessData.total_involved_family : null,
        maleInvolvedFamily: typeof businessData.male_involved_family === 'number' ? businessData.male_involved_family : null,
        femaleInvolvedFamily: typeof businessData.female_involved_family === 'number' ? businessData.female_involved_family : null,
        
        // Permanent employee information
        hasPermanentEmployees: businessData.has_permanent_employees || "",
        totalPermanentEmployees: typeof businessData.total_permanent_employees === 'number' ? businessData.total_permanent_employees : null,
        nepaliMalePermanentEmployees: typeof businessData.nepali_male_permanent_employees === 'number' ? businessData.nepali_male_permanent_employees : null,
        nepaliFemalePermanentEmployees: typeof businessData.nepali_female_permanent_employees === 'number' ? businessData.nepali_female_permanent_employees : null,
        hasForeignPermanentEmployees: businessData.has_foreign_permanent_employees || "",
        foreignMalePermanentEmployees: typeof businessData.foreign_male_permanent_employees === 'number' ? businessData.foreign_male_permanent_employees : null,
        foreignFemalePermanentEmployees: typeof businessData.foreign_female_permanent_employees === 'number' ? businessData.foreign_female_permanent_employees : null,
        foreignPermanentEmployeeCountries: parseArrayField(businessData.foreign_permanent_employee_countries),
        
        // Temporary employee information
        hasTemporaryEmployees: businessData.has_temporary_employees || "",
        totalTemporaryEmployees: typeof businessData.total_temporary_employees === 'number' ? businessData.total_temporary_employees : null,
        nepaliMaleTemporaryEmployees: typeof businessData.nepali_male_temporary_employees === 'number' ? businessData.nepali_male_temporary_employees : null,
        nepaliTemporaryFemaleEmployees: typeof businessData.nepali_female_temporary_employees === 'number' ? businessData.nepali_female_temporary_employees : null,
        hasForeignTemporaryEmployees: businessData.has_foreign_temporary_employees || "",
        foreignMaleTemporaryEmployees: typeof businessData.foreign_male_temporary_employees === 'number' ? businessData.foreign_male_temporary_employees : null,
        foreignFemaleTemporaryEmployees: typeof businessData.foreign_female_temporary_employees === 'number' ? businessData.foreign_female_temporary_employees : null,
        foreignTemporaryEmployeeCountries: parseArrayField(businessData.foreign_temporary_employee_countries),
        
        // Location data for mapping
        gps: {
          latitude,
          longitude
        },
        name: businessData.name || "",
        
        // Status
        status: businessData.status || "pending",
      };

      return formattedBusiness;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching business by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch business details",
      });
    }
  });
// Add a function to get business districts for filtering
export const getBusinessDistricts = protectedProcedure.query(async ({ ctx }) => {
  try {
    const results = await ctx.db
      .selectDistinct({
        district: sql<string>`business_district`,
      })
      .from(business)
      .where(sql`business_district IS NOT NULL`)
      .orderBy(sql`business_district`);

    return results.map(result => result.district).filter(Boolean);
  } catch (error) {
    console.error("Error fetching business districts:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch business districts",
    });
  }
});

// Add a function to get business provinces for filtering
export const getBusinessProvinces = protectedProcedure.query(async ({ ctx }) => {
  try {
    const results = await ctx.db
      .selectDistinct({
        province: sql<string>`business_province`,
      })
      .from(business)
      .where(sql`business_province IS NOT NULL`)
      .orderBy(sql`business_province`);

    return results.map(result => result.province).filter(Boolean);
  } catch (error) {
    console.error("Error fetching business provinces:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch business provinces",
    });
  }
});