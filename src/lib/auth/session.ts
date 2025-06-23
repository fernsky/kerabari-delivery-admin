import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "./index";
import { db } from "@/server/db";
import { users as userTable } from "@/server/db/schema/basic";
import { eq } from "drizzle-orm";
import { Session, User } from "lucia";

/**
 * Server-side function to get the current authenticated session
 * For use in API routes and server components
 */
export const getServerAuthSession = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    try {
      // Get the session cookie
      const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
      // If no session cookie exists, return null for both user and session
      if (!sessionId) {
        return { user: null, session: null };
      }

      // Validate the session
      const { user, session } = await lucia.validateSession(sessionId);

      // Handle session refresh if needed
      if (session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      // Clear invalid session cookies
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      // If we have a validated user, fetch full user data from database
      if (user) {
        // Fetch additional user data if needed
        const userData = await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, user.id))
          .limit(1);
        console.log(userData);

        if (userData.length > 0) {
          // Merge additional user data with the Lucia user
          const enhancedUser = {
            ...user,
            ...userData[0],
          };

          return { user: enhancedUser as User, session };
        }
      }

      return { user, session };
    } catch (error) {
      console.error("Error getting server auth session:", error);
      return { user: null, session: null };
    }
  },
);
