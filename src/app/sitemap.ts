import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { api } from "@/trpc/server";
import {navItems} from "@/constants/nav-items"

// Base URL from environment or default
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://digital.khajuramun.gov.np";

// Recursively extract all routes from navItems
function extractRoutesFromNavItems(items: typeof navItems): string[] {
  const routes: string[] = ["/"];

  function traverse(navItem: (typeof navItems)[0]) {
    // Add the main route
    routes.push(navItem.href);

    // Recursively add sub-routes
    if (navItem.items && navItem.items.length > 0) {
      navItem.items.forEach((subItem) => {
        routes.push(subItem.href);
      });
    }
  }

  items.forEach(traverse);

  // Remove duplicates and sort
  return Array.from(new Set(routes)).sort();
}

// Generate static routes from navigation structure
const staticRoutes = extractRoutesFromNavItems(navItems);

// This function will generate the sitemap entries
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // Generate entries for static routes in all locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: route === "/" ? 1.0 : 0.8,
      });
    }
  }


  // Add other dynamic routes here as the application grows
  // For example, fetch and add news articles, events, etc.

  return sitemapEntries;
}
