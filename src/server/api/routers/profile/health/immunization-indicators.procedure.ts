import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { immunizationIndicators } from "@/server/db/schema/profile/health/immunization-indicators";
import { eq, and, sql } from "drizzle-orm";
import {
  immunizationIndicatorDataSchema,
  ImmunizationFiscalYearEnum,
  ImmunizationIndicatorEnum,
} from "./immunization-indicators.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Filter schema
const immunizationIndicatorFilterSchema = z.object({
  fiscalYear: ImmunizationFiscalYearEnum.optional(),
  indicator: ImmunizationIndicatorEnum.optional(),
});

export const getAllImmunizationIndicators = publicProcedure
  .input(immunizationIndicatorFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(immunizationIndicators);

        let conditions = [];
        if (input?.fiscalYear) {
          conditions.push(eq(immunizationIndicators.fiscalYear, input.fiscalYear));
        }
        if (input?.indicator) {
          conditions.push(eq(immunizationIndicators.indicator, input.indicator));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        data = await queryWithFilters.orderBy(
          immunizationIndicators.fiscalYear,
          immunizationIndicators.indicator,
        );
      } catch (err) {
        data = [];
      }

      // Optionally: fallback to ACME table if needed (not implemented here)
      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve immunization indicators data",
      });
    }
  });

export const getImmunizationIndicatorById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id))
      .limit(1);

    return data.length > 0 ? data[0] : null;
  });

export const createImmunizationIndicator = protectedProcedure
  .input(immunizationIndicatorDataSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create immunization indicator data",
      });
    }

    // Check if entry already exists for this fiscal year and indicator
    const existing = await ctx.db
      .select({ id: immunizationIndicators.id })
      .from(immunizationIndicators)
      .where(
        and(
          eq(immunizationIndicators.fiscalYear, input.fiscalYear),
          eq(immunizationIndicators.indicator, input.indicator),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for fiscal year ${input.fiscalYear} and indicator ${input.indicator} already exists`,
      });
    }

    await ctx.db.insert(immunizationIndicators).values({
      id: input.id || uuidv4(),
      fiscalYear: input.fiscalYear,
      indicator: input.indicator,
      value: input.value,
    });

    return { success: true };
  });

export const updateImmunizationIndicator = protectedProcedure
  .input(immunizationIndicatorDataSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update immunization indicator data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    const existing = await ctx.db
      .select({ id: immunizationIndicators.id })
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    await ctx.db
      .update(immunizationIndicators)
      .set({
        fiscalYear: input.fiscalYear,
        indicator: input.indicator,
        value: input.value,
      })
      .where(eq(immunizationIndicators.id, input.id));

    return { success: true };
  });

export const deleteImmunizationIndicator = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete immunization indicator data",
      });
    }

    await ctx.db
      .delete(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id));

    return { success: true };
  });

// Summary: total by indicator for a fiscal year
export const getImmunizationIndicatorsSummary = publicProcedure
  .input(z.object({ fiscalYear: ImmunizationFiscalYearEnum.optional() }).optional())
  .query(async ({ ctx, input }) => {
    try {
      let summarySql = sql`
        SELECT 
          indicator, 
          SUM(value) as total_value
        FROM 
          acme_immunization_indicators
      `;
      if (input?.fiscalYear) {
        summarySql = sql`
          SELECT 
            indicator, 
            SUM(value) as total_value
          FROM 
            acme_immunization_indicators
          WHERE 
            fiscal_year = ${input.fiscalYear}
          GROUP BY 
            indicator
          ORDER BY 
            indicator
        `;
      } else {
        summarySql = sql`
          SELECT 
            indicator, 
            SUM(value) as total_value
          FROM 
            acme_immunization_indicators
          GROUP BY 
            indicator
          ORDER BY 
            indicator
        `;
      }
      const summaryData = await ctx.db.execute(summarySql);
      return summaryData;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve immunization indicators summary",
      });
    }
  });

export const immunizationIndicatorsRouter = createTRPCRouter({
  getAll: getAllImmunizationIndicators,
  getById: getImmunizationIndicatorById,
  create: createImmunizationIndicator,
  update: updateImmunizationIndicator,
  delete: deleteImmunizationIndicator,
  summary: getImmunizationIndicatorsSummary,
});
