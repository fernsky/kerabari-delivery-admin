import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { cooperatives } from "@/server/db/schema/profile/economics/cooperatives";
import { eq, and, sql, ilike } from "drizzle-orm";
import {
  cooperativeSchema,
  cooperativeFilterSchema,
  updateCooperativeSchema,
  CooperativeTypeEnum,
} from "./cooperatives.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all cooperatives data with optional filtering
export const getAllCooperatives = publicProcedure
  .input(cooperativeFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(cooperatives);

        let conditions = [];

        if (input?.cooperativeName) {
          conditions.push(ilike(cooperatives.cooperativeName, `%${input.cooperativeName}%`));
        }

        if (input?.wardNumber) {
          conditions.push(eq(cooperatives.wardNumber, input.wardNumber));
        }

        if (input?.cooperativeType) {
          conditions.push(eq(cooperatives.cooperativeType, input.cooperativeType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by name
        data = await queryWithFilters.orderBy(
          cooperatives.cooperativeName,
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
            cooperative_name,
            ward_number,
            cooperative_type,
            phone_number,
            remarks,
            updated_at,
            created_at
          FROM 
            acme_cooperatives
          ORDER BY 
            cooperative_name
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            cooperativeName: row.cooperative_name,
            wardNumber: row.ward_number,
            cooperativeType: row.cooperative_type,
            phoneNumber: row.phone_number,
            remarks: row.remarks,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.cooperativeName) {
            data = data.filter((item) => 
              item.cooperativeName.toLowerCase().includes(input.cooperativeName!.toLowerCase())
            );
          }
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
          if (input?.cooperativeType) {
            data = data.filter((item) => item.cooperativeType === input.cooperativeType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching cooperatives data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data by ID
export const getCooperativeById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(cooperatives)
      .where(eq(cooperatives.id, input.id))
      .limit(1);

    return data[0];
  });

// Create a new cooperative entry
export const createCooperative = protectedProcedure
  .input(cooperativeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create cooperative data",
      });
    }

    // Create new record
    await ctx.db.insert(cooperatives).values({
      id: input.id || uuidv4(),
      cooperativeName: input.cooperativeName,
      wardNumber: input.wardNumber,
      cooperativeType: input.cooperativeType,
      phoneNumber: input.phoneNumber,
      remarks: input.remarks,
    });

    return { success: true };
  });

// Update an existing cooperative entry
export const updateCooperative = protectedProcedure
  .input(updateCooperativeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update cooperative data",
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
      .select({ id: cooperatives.id })
      .from(cooperatives)
      .where(eq(cooperatives.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(cooperatives)
      .set({
        cooperativeName: input.cooperativeName,
        wardNumber: input.wardNumber,
        cooperativeType: input.cooperativeType,
        phoneNumber: input.phoneNumber,
        remarks: input.remarks,
      })
      .where(eq(cooperatives.id, input.id));

    return { success: true };
  });

// Delete a cooperative entry
export const deleteCooperative = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete cooperative data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(cooperatives)
      .where(eq(cooperatives.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const cooperativesRouter = createTRPCRouter({
  getAll: getAllCooperatives,
  getById: getCooperativeById,
  create: createCooperative,
  update: updateCooperative,
  delete: deleteCooperative,
});
