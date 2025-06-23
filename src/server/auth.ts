import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "@/lib/auth";
import type { Session, User } from "lucia";

/**
 * Server-side function to get the current authenticated session
 * Similar to validateRequest but for server components/API routes
 */
export const getServerAuthSession = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const { user, session } = await lucia.validateSession(sessionId);

    try {
      // Handle session cookie management for fresh sessions
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
    } catch (error) {
      console.error("Failed to set session cookie:", error);
    }

    return { user, session };
  },
);
