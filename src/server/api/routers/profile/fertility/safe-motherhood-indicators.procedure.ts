import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { safeMotherhoodIndicators } from "@/server/db/schema/profile/fertility/safe-motherhood-indicators";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import {
  safeMotherhoodIndicatorSchema,
  safeMotherhoodIndicatorFilterSchema,
  updateSafeMotherhoodIndicatorSchema,
  SafeMotherhoodIndicatorTypeEnum,
} from "./safe-motherhood-indicators.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all safe motherhood indicators with optional filtering
export const getAllSafeMotherhoodIndicators = publicProcedure
  .input(safeMotherhoodIndicatorFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(safeMotherhoodIndicators);

        let conditions = [];

        if (input?.indicator) {
          conditions.push(
            eq(safeMotherhoodIndicators.indicator, input.indicator),
          );
        }

        if (input?.year) {
          conditions.push(eq(safeMotherhoodIndicators.year, input.year));
        }

        if (input?.minValue !== undefined) {
          conditions.push(gte(safeMotherhoodIndicators.value, input.minValue));
        }

        if (input?.maxValue !== undefined) {
          conditions.push(lte(safeMotherhoodIndicators.value, input.maxValue));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by year (desc) and indicator
        data = await queryWithFilters.orderBy(
          desc(safeMotherhoodIndicators.year),
          safeMotherhoodIndicators.indicator,
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
            indicator,
            year,
            value,
            updated_at,
            created_at
          FROM 
            acme_safe_motherhood_indicators
          ORDER BY 
            year DESC, indicator
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            indicator: row.indicator,
            year: parseInt(String(row.year)),
            value: parseFloat(String(row.value)),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.indicator) {
            data = data.filter((item) => item.indicator === input.indicator);
          }

          if (input?.year) {
            data = data.filter((item) => item.year === input.year);
          }

          //   if (input?.minValue !== undefined) {
          //     data = data.filter((item) => item.value >= input.minValue);
          //   }

          //   if (input?.maxValue !== undefined) {
          //     data = data.filter((item) => item.value <= input.maxValue);
          //   }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching safe motherhood indicators data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get safe motherhood indicator by ID
export const getSafeMotherhoodIndicatorById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(safeMotherhoodIndicators)
      .where(eq(safeMotherhoodIndicators.id, input.id))
      .limit(1);

    if (data.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Safe motherhood indicator with ID ${input.id} not found`,
      });
    }

    return data[0];
  });

// Get safe motherhood indicators by year
export const getSafeMotherhoodIndicatorsByYear = publicProcedure
  .input(z.object({ year: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(safeMotherhoodIndicators)
      .where(eq(safeMotherhoodIndicators.year, input.year))
      .orderBy(safeMotherhoodIndicators.indicator);

    return data;
  });

// Get safe motherhood indicators by indicator type
export const getSafeMotherhoodIndicatorsByType = publicProcedure
  .input(z.object({ indicator: SafeMotherhoodIndicatorTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(safeMotherhoodIndicators)
      .where(eq(safeMotherhoodIndicators.indicator, input.indicator))
      .orderBy(desc(safeMotherhoodIndicators.year));

    return data;
  });

// Create a new safe motherhood indicator entry
export const createSafeMotherhoodIndicator = protectedProcedure
  .input(safeMotherhoodIndicatorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create safe motherhood indicator data",
      });
    }

    // Check if entry already exists for this indicator and year
    const existing = await ctx.db
      .select({ id: safeMotherhoodIndicators.id })
      .from(safeMotherhoodIndicators)
      .where(
        and(
          eq(safeMotherhoodIndicators.indicator, input.indicator),
          eq(safeMotherhoodIndicators.year, input.year),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for indicator ${input.indicator} and year ${input.year} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(safeMotherhoodIndicators).values({
      id: input.id || uuidv4(),
      indicator: input.indicator,
      year: input.year,
      value: input.value,
    });

    return { success: true };
  });

// Update an existing safe motherhood indicator entry
export const updateSafeMotherhoodIndicator = protectedProcedure
  .input(updateSafeMotherhoodIndicatorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update safe motherhood indicator data",
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
      .select({ id: safeMotherhoodIndicators.id })
      .from(safeMotherhoodIndicators)
      .where(eq(safeMotherhoodIndicators.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Check if updating would create a duplicate for indicator and year
    if (input.indicator || input.year) {
      const duplicateCheck = await ctx.db
        .select({ id: safeMotherhoodIndicators.id })
        .from(safeMotherhoodIndicators)
        .where(
          and(
            eq(safeMotherhoodIndicators.indicator, input.indicator || ""),
            eq(safeMotherhoodIndicators.year, input.year || 0),
            sql`id != ${input.id}`,
          ),
        )
        .limit(1);

      if (duplicateCheck.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Another record with indicator ${input.indicator} and year ${input.year} already exists`,
        });
      }
    }

    // Update the record
    await ctx.db
      .update(safeMotherhoodIndicators)
      .set({
        indicator: input.indicator,
        year: input.year,
        value: input.value,
      })
      .where(eq(safeMotherhoodIndicators.id, input.id));

    return { success: true };
  });

// Delete a safe motherhood indicator entry
export const deleteSafeMotherhoodIndicator = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete safe motherhood indicator data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(safeMotherhoodIndicators)
      .where(eq(safeMotherhoodIndicators.id, input.id));

    return { success: true };
  });

// Get newborn health indicators summary
export const getNewbornHealthSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get the most recent year for which we have data
      const latestYearQuery = sql`
        SELECT MAX(year) as latest_year
        FROM acme_safe_motherhood_indicators
        WHERE indicator IN (
          'NEWBORNS_CHX_APPLIED_AFTER_BIRTH',
          'NEWBORNS_CHECKUP_24HRS_BIRTH',
          'NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL',
          'NEWBORNS_LOW_BIRTH_WEIGHT', 
          'NEONATES_BIRTH_ASPHYXIA', 
          'PRETERM_BIRTH',
          'NEONATES_CONGENITAL_ANOMALIES',
          'NEONATAL_MORTALITY_HEALTH_FACILITY',
          'STILL_BIRTHS'
        )
      `;

      const latestYearResult = await ctx.db.execute(latestYearQuery);
      
      if (!latestYearResult || latestYearResult.length === 0 || !latestYearResult[0]?.latest_year) {
        return {
          latestYear: null,
          keyIndicators: [],
        };
      }

      const latestYear = parseInt(String(latestYearResult[0].latest_year));

      // Get key newborn health indicators for the latest year
      const keyIndicatorsSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'NEWBORNS_CHX_APPLIED_AFTER_BIRTH',
            'NEWBORNS_CHECKUP_24HRS_BIRTH',
            'NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL',
            'NEWBORNS_LOW_BIRTH_WEIGHT', 
            'NEONATES_BIRTH_ASPHYXIA', 
            'PRETERM_BIRTH',
            'NEONATES_CONGENITAL_ANOMALIES',
            'NEONATAL_MORTALITY_HEALTH_FACILITY',
            'STILL_BIRTHS'
          )
        ORDER BY 
          indicator
      `;

      const keyIndicatorsData = await ctx.db.execute(keyIndicatorsSql);

      return {
        latestYear,
        keyIndicators: keyIndicatorsData,
      };
    } catch (error) {
      console.error("Error in getNewbornHealthSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve newborn health summary",
      });
    }
  },
);

// Get nutrition indicators summary
export const getNutritionSummary = publicProcedure.query(async ({ ctx }) => {
  try {
    // Get the most recent year for which we have data
    const latestYearQuery = sql`
        SELECT MAX(year) as latest_year
        FROM acme_safe_motherhood_indicators
        WHERE indicator IN (
          'POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID',
          'POSTPARTUM_MOTHERS_VITAMIN_A',
          'WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY',
          'WOMEN_180_CALCIUM_TABLETS_PREGNANCY',
          'PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS'
        )
      `;

    const latestYearResult = await ctx.db.execute(latestYearQuery);
    
    if (!latestYearResult || latestYearResult.length === 0 || !latestYearResult[0]?.latest_year) {
      return {
        latestYear: null,
        keyIndicators: [],
      };
    }

    const latestYear = parseInt(String(latestYearResult[0].latest_year));

    // Get key nutrition indicators for the latest year
    const keyIndicatorsSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
        acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID',
            'POSTPARTUM_MOTHERS_VITAMIN_A',
            'WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY',
            'WOMEN_180_CALCIUM_TABLETS_PREGNANCY',
            'PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS'
          )
        ORDER BY 
          indicator
      `;

    const keyIndicatorsData = await ctx.db.execute(keyIndicatorsSql);

    return {
      latestYear,
      keyIndicators: keyIndicatorsData,
    };
  } catch (error) {
    console.error("Error in getNutritionSummary:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve nutrition summary",
    });
  }
});

// Get delivery indicators summary
export const getDeliverySummary = publicProcedure.query(async ({ ctx }) => {
  try {
    // Get the most recent year for which we have data
    const latestYearQuery = sql`
      SELECT MAX(year) as latest_year
      FROM acme_safe_motherhood_indicators
      WHERE indicator IN (
        'INSTITUTIONAL_DELIVERIES',
        'NORMAL_VAGINAL_DELIVERIES',
        'BIRTHS_ATTENDED_SBA_TRAINED_ANMS',
        'BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL',
        'DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL'
      )
    `;

    const latestYearResult = await ctx.db.execute(latestYearQuery);
    
    if (!latestYearResult || latestYearResult.length === 0 || !latestYearResult[0]?.latest_year) {
      return {
        latestYear: null,
        keyIndicators: [],
      };
    }

    const latestYear = parseInt(String(latestYearResult[0].latest_year));

    // Get key delivery indicators for the latest year
    const keyIndicatorsSql = sql`
      SELECT 
        indicator, 
        value
      FROM 
        acme_safe_motherhood_indicators
      WHERE 
        year = ${latestYear}
        AND indicator IN (
          'INSTITUTIONAL_DELIVERIES',
          'NORMAL_VAGINAL_DELIVERIES',
          'BIRTHS_ATTENDED_SBA_TRAINED_ANMS',
          'BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL',
          'DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL'
        )
      ORDER BY 
        indicator
    `;

    const keyIndicatorsData = await ctx.db.execute(keyIndicatorsSql);

    return {
      latestYear,
      keyIndicators: keyIndicatorsData,
    };
  } catch (error) {
    console.error("Error in getDeliverySummary:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve delivery summary",
    });
  }
});

// Get comprehensive safe motherhood summary data
export const getSafeMotherhoodSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get the most recent year from all relevant indicator types
      const latestYearQuery = sql`
        SELECT MAX(year) as latest_year
        FROM acme_safe_motherhood_indicators
      `;

      const latestYearResult = await ctx.db.execute(latestYearQuery);
      
      if (!latestYearResult || latestYearResult.length === 0 || !latestYearResult[0]?.latest_year) {
        return {
          latestYear: null,
          newbornHealth: [],
          antenatal: [],
          postnatal: [],
          delivery: [],
          trends: [],
        };
      }

      const latestYear = parseInt(String(latestYearResult[0].latest_year));

      // Get newborn health indicators for the latest year
      const newbornHealthSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'NEWBORNS_CHX_APPLIED_AFTER_BIRTH',
            'NEWBORNS_CHECKUP_24HRS_BIRTH',
            'NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL',
            'NEWBORNS_LOW_BIRTH_WEIGHT', 
            'NEONATES_BIRTH_ASPHYXIA', 
            'PRETERM_BIRTH',
            'NEONATES_CONGENITAL_ANOMALIES',
            'NEONATAL_MORTALITY_HEALTH_FACILITY',
            'STILL_BIRTHS'
          )
        ORDER BY 
          indicator
      `;

      const newbornHealthData = await ctx.db.execute(newbornHealthSql);

      // Get antenatal care indicators for the latest year
      const antenatalSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP',
            'PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL',
            'PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL',
            'WOMEN_FIRST_ANC_CHECKUP_PROTOCOL',
            'PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS',
            'WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY',
            'WOMEN_180_CALCIUM_TABLETS_PREGNANCY'
          )
        ORDER BY 
          indicator
      `;

      const antenatalData = await ctx.db.execute(antenatalSql);

      // Get postnatal care indicators for the latest year
      const postnatalSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'WOMEN_PNC_WITHIN_24HRS_DELIVERY',
            'WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL',
            'POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS',
            'POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID',
            'POSTPARTUM_MOTHERS_VITAMIN_A'
          )
        ORDER BY 
          indicator
      `;

      const postnatalData = await ctx.db.execute(postnatalSql);

      // Get delivery indicators for the latest year
      const deliverySql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'INSTITUTIONAL_DELIVERIES',
            'NORMAL_VAGINAL_DELIVERIES',
            'BIRTHS_ATTENDED_SBA_TRAINED_ANMS',
            'BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL',
            'BIRTHS_ATTENDED_NON_SBA_SHP',
            'DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL',
            'ASSISTED_VACUUM_FORCEPS_DELIVERIES',
            'DELIVERIES_CAESAREAN_SECTION_REPORTED'
          )
        ORDER BY 
          indicator
      `;

      const deliveryData = await ctx.db.execute(deliverySql);

      // Get historical trend data for key indicators over the last 5 years
      const trendSql = sql`
        SELECT 
          indicator, 
          year, 
          value
        FROM 
          acme_safe_motherhood_indicators
        WHERE 
          year >= ${latestYear - 4}
          AND indicator IN (
            'INSTITUTIONAL_DELIVERIES',
            'PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL',
            'POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS',
            'NEWBORNS_CHX_APPLIED_AFTER_BIRTH',
            'WOMEN_PNC_WITHIN_24HRS_DELIVERY'
          )
        ORDER BY 
          indicator, year
      `;

      const trendData = await ctx.db.execute(trendSql);

      return {
        latestYear,
        newbornHealth: newbornHealthData,
        antenatal: antenatalData,
        postnatal: postnatalData,
        delivery: deliveryData,
        trends: trendData,
      };
    } catch (error) {
      console.error("Error in getSafeMotherhoodSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve safe motherhood summary",
      });
    }
  },
);

// Export the router with all procedures
export const safeMotherhoodIndicatorsRouter = createTRPCRouter({
  getAll: getAllSafeMotherhoodIndicators,
  getById: getSafeMotherhoodIndicatorById,
  getByYear: getSafeMotherhoodIndicatorsByYear,
  getByType: getSafeMotherhoodIndicatorsByType,
  create: createSafeMotherhoodIndicator,
  update: updateSafeMotherhoodIndicator,
  delete: deleteSafeMotherhoodIndicator,
  newbornSummary: getNewbornHealthSummary,
  nutritionSummary: getNutritionSummary,
  deliverySummary: getDeliverySummary,
  summary: getSafeMotherhoodSummary,
});
