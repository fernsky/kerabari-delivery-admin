"use client";
import { Navbar } from "@/components/admin-panel/navbar";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ContentLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  backHref?: string; // Add backHref prop
}

export function ContentLayout({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  backHref, // Include backHref in the props
}: ContentLayoutProps) {
  return (
    <div className={className}>
      <Navbar title={title} subtitle={subtitle} actions={actions} />
      <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        {/* Back button navigation */}
        {backHref && (
          <div className="mb-4">
            <Link href={backHref}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 pl-0 hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                फिर्ता जानुहोस्
              </Button>
            </Link>
          </div>
        )}
        <div className="min-h-[calc(100vh-10rem)]">{children}</div>
      </div>
    </div>
  );
}
