"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { UserHydration } from "@/components/providers/user-hydration";
import { User } from "lucia";

interface ProvidersProps {
  children: React.ReactNode;
  user: User | null;
}

export function Providers({ children, user }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserHydration user={user} />
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <Toaster />
    </ThemeProvider>
  );
}
