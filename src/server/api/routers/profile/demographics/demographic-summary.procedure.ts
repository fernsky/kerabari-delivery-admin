import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { demographicSummary } from "@/server/db/schema/profile/demographics/demographic-summary";
import { eq } from "drizzle-orm";
import { updateDemographicSummarySchema } from "./demographic-summary.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// The singleton ID that's used for all operations
const SINGLETON_ID = "singleton";

// Get the current demographic summary
export const getDemographicSummary = publicProcedure.query(async ({ ctx }) => {
  const data = await ctx.db
    .select()
    .from(demographicSummary)
    .where(eq(demographicSummary.id, SINGLETON_ID))
    .limit(1);

  return data[0] || null;
});

// Update the demographic summary (or create if it doesn't exist)
export const updateDemographicSummary = protectedProcedure
  .input(updateDemographicSummarySchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update demographic summary data",
      });
    }

    // Process the input to handle decimal fields correctly
    const processedInput: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // If it's a number, ensure it's properly formatted for pg decimal fields
      if (
        typeof value === "number" &&
        key !== "totalPopulation" &&
        key !== "populationMale" &&
        key !== "populationFemale" &&
        key !== "populationOther" &&
        key !== "populationAbsenteeTotal" &&
        key !== "populationMaleAbsentee" &&
        key !== "populationFemaleAbsentee" &&
        key !== "populationOtherAbsentee" &&
        key !== "totalHouseholds" &&
        key !== "population0To14" &&
        key !== "population15To59" &&
        key !== "population60AndAbove"
      ) {
        processedInput[key] = value.toString();
      } else {
        processedInput[key] = value;
      }
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: demographicSummary.id })
      .from(demographicSummary)
      .where(eq(demographicSummary.id, SINGLETON_ID))
      .limit(1);

    if (existing.length === 0) {
      // Create if it doesn't exist
      await ctx.db.insert(demographicSummary).values({
        id: SINGLETON_ID,
        ...processedInput,
      });

      return { success: true, action: "created" };
    } else {
      // Update if it exists
      await ctx.db
        .update(demographicSummary)
        .set(processedInput)
        .where(eq(demographicSummary.id, SINGLETON_ID));

      return { success: true, action: "updated" };
    }
  });

// Update a single field in the demographic summary
export const updateSingleField = protectedProcedure
  .input(
    z.object({
      field: z.string(),
      value: z.union([z.number(), z.string(), z.null()]),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update demographic summary data",
      });
    }

    const { field, value } = input;
    const validFields = [
      "totalPopulation",
      "populationMale",
      "populationFemale",
      "populationOther",
      "populationAbsenteeTotal",
      "populationMaleAbsentee",
      "populationFemaleAbsentee",
      "populationOtherAbsentee",
      "sexRatio",
      "totalHouseholds",
      "averageHouseholdSize",
      "populationDensity",
      "totalWards",
      "totalLandArea",
      "population0To14",
      "population15To59",
      "population60AndAbove",
      "growthRate",
      "literacyRateAbove15",
      "literacyRate15To24",
    ];

    if (!validFields.includes(field)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid field: ${field}`,
      });
    }

    // Process the value if it's a decimal field
    let processedValue = value;
    if (
      typeof value === "number" &&
      [
        "sexRatio",
        "averageHouseholdSize",
        "populationDensity",
        "totalLandArea",
        "growthRate",
        "literacyRateAbove15",
        "literacyRate15To24",
      ].includes(field)
    ) {
      processedValue = value.toString();
    }

    // Check if the record exists and create if it doesn't
    const existing = await ctx.db
      .select({ id: demographicSummary.id })
      .from(demographicSummary)
      .where(eq(demographicSummary.id, SINGLETON_ID))
      .limit(1);

    if (existing.length === 0) {
      // Create a new record with just this field
      await ctx.db.insert(demographicSummary).values({
        id: SINGLETON_ID,
        [field]: processedValue,
      });
      return { success: true, action: "created" };
    } else {
      // Update just this field
      await ctx.db
        .update(demographicSummary)
        .set({ [field]: processedValue })
        .where(eq(demographicSummary.id, SINGLETON_ID));
      return { success: true, action: "updated" };
    }
  });

// Create a new router with the procedures
export const demographicSummaryRouter = createTRPCRouter({
  get: getDemographicSummary,
  update: updateDemographicSummary,
  updateField: updateSingleField,
});
