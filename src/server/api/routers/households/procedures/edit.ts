import { z } from "zod";
import { randomUUID } from "crypto";
import { protectedProcedure } from "@/server/api/trpc";
import { householdStatusSchema, updateHouseholdSchema } from "../households.schema";
import { householdEditRequests, households } from "@/server/db/schema/households/households";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { formatDbUuid } from "@/lib/utils";
/**
 * Procedure to request edits for a household
 */
export const requestHouseholdEditProcedure = protectedProcedure
  .input(householdStatusSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const formattedHouseholdId = formatDbUuid(input.householdId);
      
      // Check if the household exists
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
      
      // Rest of your code remains the same...
    } catch (error) {
      // Error handling remains the same
    }
  });
  
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

      // Check if the household exists
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
      
      // Update the household
      await ctx.db.update(households)
        .set(updateData)
        .where(eq(households.id, formattedHouseholdId));
      
      // Rest of your code remains the same...
    } catch (error) {
      // Error handling remains the same
    }
  });
/**
 * Procedure to get all edit requests
 */


export const getHouseholdEditRequestsProcedure = protectedProcedure
  .input(z.object({
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0)
  }))
  .query(async ({ ctx, input }) => {
    try {
      // Use parameterized queries with the sql template tag
      const query = sql`
        SELECT 
          e.id, 
          e.household_id, 
          e.message, 
          e.requested_at,
          h.family_head_name,
          h.ward_no,
          h.locality
        FROM ${householdEditRequests} e
        JOIN ${households} h ON h.id = e.household_id
        ORDER BY e.requested_at DESC
        LIMIT ${input?.limit || 10} OFFSET ${input?.offset || 0}
      `;
      
      const editRequests = await ctx.db.execute(query);
      
      // Rest of your code remains the same...
    } catch (error) {
      // Error handling remains the same
    }
  });