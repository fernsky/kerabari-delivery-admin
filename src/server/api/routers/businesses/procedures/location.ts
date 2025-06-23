import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// UUID utility functions (reusing from other procedures)
function formatDbUuid(uuid: string): string {
  // Remove any existing prefix and whitespace
  const cleanUuid = uuid.replace(/^(uuid:)?/, '').trim();
  // Add the prefix consistently
  return `${cleanUuid}`;
}

/**
 * Procedure to get the GPS location of a specific business
 */
export const getBusinessLocationProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      // Format the business ID correctly for the database
      const formattedId = formatDbUuid(input.id);
      
      // Query to get business location
      const query = sql`
        SELECT 
          id,
          business_name,
          business_province,
          business_district,
          ward_no,
          business_location,
          geom,
          operator_name
        FROM acme_khajura_business
        WHERE id = ${formattedId}
      `;
      
      const result = await ctx.db.execute(query);
      
      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      const business = result[0];
      
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

      const location = parseLocationArray(business.business_location);
      
      // Extract latitude and longitude if available
      let latitude: number | null = null;
      let longitude: number | null = null;

      // Try to extract from business_location array
      if (location.length >= 2) {
        const possibleLat = parseFloat(location[0]);
        const possibleLng = parseFloat(location[1]);
        
        if (!isNaN(possibleLat) && !isNaN(possibleLng)) {
          latitude = possibleLat;
          longitude = possibleLng;
        }
      } 
      // If not found, try to extract from geom field
      else if (business.geom) {
        try {
          // Example assuming geom is a Point: "POINT(lng lat)"
          const geomStr = business.geom.toString();
          const match = geomStr.match(/POINT\(([^ ]+) ([^)]+)\)/i);
          if (match) {
            longitude = parseFloat(match[1]);
            latitude = parseFloat(match[2]);
          }
        } catch (e) {
          console.error("Error parsing geom:", e);
        }
      }

      return {
        id: business.id,
        businessName: business.business_name || "",
        province: business.business_province || "",
        district: business.business_district || "",
        wardNo: typeof business.ward_no === 'number' ? business.ward_no : null,
        operatorName: business.operator_name || "",
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
      console.error("Error fetching business location:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch business location",
      });
    }
  });

/**
 * Procedure to get the GPS locations of multiple businesses
 * for mapping purposes
 */
export const getBusinessesLocationsProcedure = protectedProcedure
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
          business_name,
          operator_name,
          business_location,
          ward_no,
          business_province,
          business_district,
          business_locality
        FROM acme_khajura_business
        WHERE (business_location IS NOT NULL OR geom IS NOT NULL)
      `;
      
      // Add filter by ward if specified
      if (wardNo !== undefined) {
        query = sql`${query} AND ward_no = ${wardNo}`;
      }
      
      // Add pagination
      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;
      
      const results = await ctx.db.execute(query);
      
      // Transform results
      const businesses = results.map(row => {
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

        const location = parseLocationArray(row.business_location);
        
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
          businessName: row.business_name || "",
          operatorName: row.operator_name || "",
          province: row.business_province || "",
          district: row.business_district || "",
          wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
          locality: row.business_locality || "",
          location: {
            raw: location,
            latitude,
            longitude
          }
        };
      });
      
      // Count query for total businesses with locations
      let countQuery = sql`
        SELECT COUNT(*) as total
        FROM acme_khajura_business 
        WHERE (business_location IS NOT NULL OR geom IS NOT NULL)
      `;
      
      if (wardNo !== undefined) {
        countQuery = sql`${countQuery} AND ward_no = ${wardNo}`;
      }
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);
      
      return {
        businesses,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      console.error("Error fetching business locations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch business locations",
      });
    }
  });
