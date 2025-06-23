import { TRPCError } from "@trpc/server";

/**
 * Helper function to handle tRPC API calls with proper error handling
 * for use in dynamic pages that shouldn't be statically generated.
 *
 * @param apiCall A function that calls a tRPC procedure
 * @param defaultValue A default value to return in case of error
 * @returns The result of the API call or the default value if there's an error
 */
export async function safeTrpcQuery<T>(
  apiCall: () => Promise<T>,
  defaultValue: T,
): Promise<T> {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    console.error("Error fetching data from tRPC:", error);

    // If it's a TRPCError, we can handle it more specifically
    if (error instanceof TRPCError) {
      console.error(
        `TRPC Error code: ${error.code}, message: ${error.message}`,
      );
    }

    return defaultValue;
  }
}

/**
 * Use this function to check if the application is running in development mode
 * Useful for conditionally enabling/disabling features in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
