import { z } from "zod";

// Schema for ward-wise child bearers data
export const wardWiseChildBearersSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  age15to49ChildBearers: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise child bearers data
export const wardWiseChildBearersFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseChildBearersSchema = wardWiseChildBearersSchema;

export type WardWiseChildBearersData = z.infer<
  typeof wardWiseChildBearersSchema
>;
export type UpdateWardWiseChildBearersData = WardWiseChildBearersData;
export type WardWiseChildBearersFilter = z.infer<
  typeof wardWiseChildBearersFilterSchema
>;
