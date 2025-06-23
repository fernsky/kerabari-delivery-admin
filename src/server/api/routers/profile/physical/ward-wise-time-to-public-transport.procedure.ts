import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseTimeToPublicTransport } from "@/server/db/schema/profile/physical/ward-wise-time-to-public-transport";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseTimeToPublicTransportSchema,
  wardWiseTimeToPublicTransportFilterSchema,
  updateWardWiseTimeToPublicTransportSchema,
  TimeToPublicTransportTypeEnum,
} from "./ward-wise-time-to-public-transport.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise time to public transport data with optional filtering
export const getAllWardWiseTimeToPublicTransport = publicProcedure
  .input(wardWiseTimeToPublicTransportFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseTimeToPublicTransport);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseTimeToPublicTransport.wardNumber, input.wardNumber),
          );
        }

        if (input?.timeToPublicTransport) {
          conditions.push(
            eq(
              wardWiseTimeToPublicTransport.timeToPublicTransport,
              input.timeToPublicTransport,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and time category
        data = await queryWithFilters.orderBy(
          wardWiseTimeToPublicTransport.wardNumber,
          wardWiseTimeToPublicTransport.timeToPublicTransport,
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            time_to_public_transport,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_time_to_public_transport
          ORDER BY 
            ward_number, time_to_public_transport
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeToPublicTransport: row.time_to_public_transport,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.timeToPublicTransport) {
            data = data.filter(
              (item) =>
                item.timeToPublicTransport === input.timeToPublicTransport,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise time to public transport data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTimeToPublicTransportByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTimeToPublicTransport)
      .where(eq(wardWiseTimeToPublicTransport.wardNumber, input.wardNumber))
      .orderBy(wardWiseTimeToPublicTransport.timeToPublicTransport);

    return data;
  });

// Create a new ward-wise time to public transport entry
export const createWardWiseTimeToPublicTransport = protectedProcedure
  .input(wardWiseTimeToPublicTransportSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise time to public transport data",
      });
    }

    // Check if entry already exists for this ward and time category
    const existing = await ctx.db
      .select({ id: wardWiseTimeToPublicTransport.id })
      .from(wardWiseTimeToPublicTransport)
      .where(
        and(
          eq(wardWiseTimeToPublicTransport.wardNumber, input.wardNumber),
          eq(
            wardWiseTimeToPublicTransport.timeToPublicTransport,
            input.timeToPublicTransport,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and time category ${input.timeToPublicTransport} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTimeToPublicTransport).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      timeToPublicTransport: input.timeToPublicTransport,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise time to public transport entry
export const updateWardWiseTimeToPublicTransport = protectedProcedure
  .input(updateWardWiseTimeToPublicTransportSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise time to public transport data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: wardWiseTimeToPublicTransport.id })
      .from(wardWiseTimeToPublicTransport)
      .where(eq(wardWiseTimeToPublicTransport.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTimeToPublicTransport)
      .set({
        wardNumber: input.wardNumber,
        timeToPublicTransport: input.timeToPublicTransport,
        households: input.households,
      })
      .where(eq(wardWiseTimeToPublicTransport.id, input.id));

    return { success: true };
  });

// Delete a ward-wise time to public transport entry
export const deleteWardWiseTimeToPublicTransport = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise time to public transport data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTimeToPublicTransport)
      .where(eq(wardWiseTimeToPublicTransport.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTimeToPublicTransportSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by time category across all wards
      const summarySql = sql`
        SELECT 
          time_to_public_transport, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_time_to_public_transport
        GROUP BY 
          time_to_public_transport
        ORDER BY 
          time_to_public_transport
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseTimeToPublicTransportSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-wise time to public transport summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTimeToPublicTransportRouter = createTRPCRouter({
  getAll: getAllWardWiseTimeToPublicTransport,
  getByWard: getWardWiseTimeToPublicTransportByWard,
  create: createWardWiseTimeToPublicTransport,
  update: updateWardWiseTimeToPublicTransport,
  delete: deleteWardWiseTimeToPublicTransport,
  summary: getWardWiseTimeToPublicTransportSummary,
});
