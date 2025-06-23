import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";
import { getRequiredEnvVar } from "@/lib/utils/getRequiredEnvVar";

let connection;
const dbUrl = getRequiredEnvVar("DATABASE_URL");
try {
  connection = postgres(dbUrl, {
    max_lifetime: 10, // Remove this line if you're deploying to Docker / VPS
    // idle_timeout: 20, // Uncomment this line if you're deploying to Docker / VPS
  });
} catch (error) {
  console.error("Database connection error:", error);
  console.error("Database URL used:", dbUrl);
  throw new Error("Failed to connect to the database");
}

export const db = drizzle(connection, { schema });

/*
okay somewhere around this token list what i need to do is to allow printing a client side form like this:
1. there will be a generate form.
it will have the following things:
Title: product Rural Municipality 
Address: Jhapa, Koshi Province
Logo of nepal government as svg

the name of the enumerator hardcoded, the area code hardcoded, the 
*/
