import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// UUID utility functions (reusing from other procedures)
function formatDbUuid(uuid: string): string {
  // Remove any existing prefix and whitespace
  const cleanUuid = uuid.replace(/^(uuid:)?/, '').trim();
  // Add the prefix consistently
  return `uuid:${cleanUuid}`;
}

/**
 * Procedure to get the GPS location of a specific household
 */
export const getHouseholdLocationProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      // Format the household ID correctly for the database
      const formattedId = formatDbUuid(input.id);
      
      // Query to get household location
      const query = sql`
        SELECT 
          id,
          household_location,
          province,
          district,
          ward_no,
          family_head_name
        FROM acme_khajura_households
        WHERE id = ${formattedId}
      `;
      
      const result = await ctx.db.execute(query);
      
      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found",
        });
      }

      const household = result[0];
      
      // Parse the location data
      const parseLocationArray = (field: any): string[] => {
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

      const location = parseLocationArray(household.household_location);
      
      // Extract latitude and longitude if available
      let latitude: number | null = null;
      let longitude: number | null = null;

      // Typically location would be stored as [longitude, latitude] in some formats
      // Or as separate entries. We'll handle both possibilities
      if (location.length >= 2) {
        const possibleLat = parseFloat(location[0]);
        const possibleLng = parseFloat(location[1]);
        
        if (!isNaN(possibleLat) && !isNaN(possibleLng)) {
          latitude = possibleLat;
          longitude = possibleLng;
        }
      }

      return {
        id: household.id,
        familyHeadName: household.family_head_name || "",
        province: household.province || "",
        district: household.district || "",
        wardNo: typeof household.ward_no === 'number' ? household.ward_no : null,
        location: {
          raw: location,
          latitude,
          longitude
        }
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching household location:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch household location",
      });
    }
  });

/**
 * Procedure to get the GPS locations of multiple households
 * for mapping purposes
 */
export const getHouseholdsLocationsProcedure = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(1000).default(100),
    offset: z.number().min(0).default(0),
    wardNo: z.number().optional(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset, wardNo } = input;
      
      // Build the query base
      let query = sql`
        SELECT 
          id,
          family_head_name,
          household_location,
          ward_no,
          province,
          district,
          locality
        FROM acme_khajura_households
        WHERE household_location IS NOT NULL
      `;
      
      // Add filter by ward if specified
      if (wardNo !== undefined) {
        query = sql`${query} AND ward_no = ${wardNo}`;
      }
      
      // Add pagination
      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;
      
      const results = await ctx.db.execute(query);
      
      // Transform results
      const households = results.map(row => {
        // Parse the location data
        const parseLocationArray = (field: any): string[] => {
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

        const location = parseLocationArray(row.household_location);
        
        // Extract latitude and longitude if available
        let latitude: number | null = null;
        let longitude: number | null = null;

        if (location.length >= 2) {
          const possibleLat = parseFloat(location[0]);
          const possibleLng = parseFloat(location[1]);
          
          if (!isNaN(possibleLat) && !isNaN(possibleLng)) {
            latitude = possibleLat;
            longitude = possibleLng;
          }
        }

        return {
          id: row.id,
          familyHeadName: row.family_head_name || "",
          province: row.province || "",
          district: row.district || "",
          wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
          locality: row.locality || "",
          location: {
            raw: location,
            latitude,
            longitude
          }
        };
      });
      
      // Count query for total households with locations
      let countQuery = sql`
        SELECT COUNT(*) as total
        FROM acme_khajura_households 
        WHERE household_location IS NOT NULL
      `;
      
      if (wardNo !== undefined) {
        countQuery = sql`${countQuery} AND ward_no = ${wardNo}`;
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
        }
      };
    } catch (error) {
      console.error("Error fetching household locations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch household locations",
      });
    }
  });
