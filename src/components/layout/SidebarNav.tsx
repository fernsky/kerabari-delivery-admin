"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSidebarNavStore, NavItem } from "@/store/sidebar-nav-store";
import { useStore } from "@/hooks/use-store";
import { navItems } from "@/constants/nav-items";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSheetStore } from "@/hooks/use-sheet-store";

export default function SidebarNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const { setIsOpen } = useSheetStore();

  // Use the custom hook to prevent hydration issues
  const openSections =
    useStore(useSidebarNavStore, (state) => state.openSections) ?? {};

  const { toggleSection, autoExpandForPath, isPathActive, isSectionActive } =
    useSidebarNavStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-expand sections for current path
  useEffect(() => {
    if (isMounted && pathname) {
      autoExpandForPath(pathname, navItems);
    }
  }, [pathname, isMounted, autoExpandForPath]);

  // Handle navigation item click - close mobile sheet if on mobile
  const handleNavigationClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-2 max-w-[290px] lg:max-w-[260px]">
      <div className="text-sm font-semibold text-[#123772] mb-3 pl-2 truncate">
        तथ्याङ्क वर्गहरू
      </div>
      {navItems.map((section) => {
        const isSectionCurrentlyActive = isSectionActive(section, pathname);

        return (
          <div key={section.title} className="mb-2">
            {section.items.length > 0 ? (
              <Collapsible
                open={openSections[section.title]}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-sm transition-all duration-200 group relative",
                    isSectionCurrentlyActive
                      ? "bg-gradient-to-r from-[#0b1f42]/15 to-[#1a4894]/15 text-[#123772] font-semibold shadow-sm border border-[#123772]/20"
                      : "hover:bg-[#123772]/5 text-gray-600 hover:text-[#123772]",
                  )}
                >
                  {/* Active section indicator */}
                  {isSectionCurrentlyActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-[#123772] to-[#1a4894] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 group-hover:scale-105 flex-shrink-0",
                        isSectionCurrentlyActive
                          ? "bg-[#123772]/15 text-[#123772] shadow-sm"
                          : "bg-gray-100 group-hover:bg-[#123772]/10",
                      )}
                    >
                      {section.icon}
                    </div>
                    <span
                      className={cn(
                        "font-medium truncate text-sm",
                        isSectionCurrentlyActive ? "text-[#123772]" : "",
                      )}
                    >
                      {section.title}
                    </span>
                    {section.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0 px-1.5 py-0.5"
                      >
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-all duration-200 ml-2",
                      openSections[section.title] ? "rotate-180" : "rotate-0",
                      isSectionCurrentlyActive
                        ? "text-[#123772]"
                        : "text-gray-400 group-hover:text-[#123772]",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-2 pl-4 mt-1 border-l-2 border-[#123772]/10 animate-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1 pt-1">
                    {section.items.map((item) => {
                      const isCurrentlyActive = isPathActive(
                        item.href,
                        pathname,
                      );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleNavigationClick}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-200 group relative w-full",
                            isCurrentlyActive
                              ? "bg-gradient-to-r from-[#123772] to-[#1a4894] text-white font-semibold shadow-md"
                              : "text-gray-600 hover:bg-[#123772]/8 hover:text-[#123772]",
                          )}
                          title={item.title} // Add tooltip for long text
                        >
                          <FileText
                            className={cn(
                              "w-3 h-3 transition-colors flex-shrink-0",
                              isCurrentlyActive
                                ? "text-white"
                                : "text-[#123772] opacity-70 group-hover:opacity-100",
                            )}
                          />
                          <span className="truncate flex-1 min-w-0 text-sm leading-snug">
                            {item.title}
                          </span>
                          {isCurrentlyActive && (
                            <>
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                              <div className="flex-shrink-0 ml-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              </div>
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                href={section.href}
                onClick={handleNavigationClick}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition-all duration-200 w-full group relative",
                  isPathActive(section.href, pathname)
                    ? "bg-gradient-to-r from-[#123772] to-[#1a4894] text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-[#123772]/5 hover:text-[#123772]",
                )}
                title={section.title} // Add tooltip for long text
              >
                {/* Active section indicator for single items */}
                {isPathActive(section.href, pathname) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-7 bg-white rounded-r-full" />
                )}

                <div
                  className={cn(
                    "p-1.5 rounded-md transition-all duration-200 group-hover:scale-105 flex-shrink-0",
                    isPathActive(section.href, pathname)
                      ? "bg-white/20 shadow-sm"
                      : "bg-gray-100 group-hover:bg-[#123772]/10",
                  )}
                >
                  {section.icon}
                </div>
                <span className="font-medium truncate flex-1 min-w-0 text-sm">
                  {section.title}
                </span>
                {section.badge && (
                  <Badge
                    variant={
                      isPathActive(section.href, pathname)
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs flex-shrink-0 ml-2 px-1.5 py-0.5"
                  >
                    {section.badge}
                  </Badge>
                )}
                {isPathActive(section.href, pathname) && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                )}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
