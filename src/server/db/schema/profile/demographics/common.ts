import { pgEnum } from "drizzle-orm/pg-core";

// Define the gender enum type
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);
