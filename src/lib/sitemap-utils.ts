import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { locales } from "@/i18n/config";
import { api } from "@/trpc/server";
import { navItems } from "@/constants/nav-items";

// Base URL from environment or default
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://digital.khajuramun.gov.np";

interface SitemapRoute {
  url: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string | Date;
}

/**
 * Extract routes from navItems organized by category
 */
function getRoutesByCategory(): Record<string, string[]> {
  const routesByCategory: Record<string, string[]> = {
    main: ["/", "/profile"],
  };

  navItems.forEach((section) => {
    // Determine category from href
    const categoryMatch = section.href.match(/\/profile\/([^\/]+)/);
    const category = categoryMatch ? categoryMatch[1] : "main";

    if (!routesByCategory[category]) {
      routesByCategory[category] = [];
    }

    // Add main section route
    routesByCategory[category].push(section.href);

    // Add sub-routes
    section.items.forEach((item) => {
      routesByCategory[category].push(item.href);
    });
  });

  return routesByCategory;
}

/**
 * Generate and save a sitemap for a specific category and locale
 */
export async function generateCategorySitemap(
  locale: string,
  category: string,
): Promise<void> {
  const routes: SitemapRoute[] = [];
  const currentDate = new Date();
  const routesByCategory = getRoutesByCategory();

  try {
    // Get routes for the specified category
    const categoryRoutes = routesByCategory[category] || [];

    // Convert routes to sitemap format
    categoryRoutes.forEach((route) => {
      const priority =
        route === "/"
          ? 1.0
          : route.includes("/profile") && !route.includes("/profile/")
            ? 0.8
            : 0.7;
      const changefreq = route === "/" ? "daily" : "weekly";

      routes.push({
        url: `/${locale}${route}`,
        changefreq: changefreq as any,
        priority,
        lastmod: currentDate,
      });
    });

    // If no routes found for category, add default
    if (routes.length === 0) {
      routes.push({
        url: `/${locale}`,
        changefreq: "daily",
        priority: 1.0,
        lastmod: currentDate,
      });
    }

    // Create sitemap
    const stream = new SitemapStream({ hostname: baseUrl });

    // Add all routes to the sitemap
    routes.forEach((route) => {
      stream.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: route.lastmod
          ? new Date(route.lastmod).toISOString()
          : new Date().toISOString(),
      });
    });

    // End the stream
    stream.end();

    // Convert the stream to XML
    const sitemap = await streamToPromise(Readable.from(stream)).then((data) =>
      data.toString(),
    );

    // Ensure directory exists
    const dir = path.join(process.cwd(), "public", "sitemaps", locale);
    fs.mkdirSync(dir, { recursive: true });

    // Write sitemap to file
    fs.writeFileSync(path.join(dir, `${category}-sitemap.xml`), sitemap);

    console.log(`Generated sitemap for ${locale}/${category}`);
  } catch (error) {
    console.error(`Error generating sitemap for ${locale}/${category}:`, error);
  }
}

/**
 * Generate a sitemap index file that references all other sitemaps
 */
export async function generateSitemapIndex(): Promise<void> {
  try {
    // Get categories dynamically from navItems
    const routesByCategory = getRoutesByCategory();
    const categories = Object.keys(routesByCategory);

    // Create sitemap index
    const smis = new SitemapStream({ hostname: baseUrl });

    // Add entries for each locale and category
    for (const locale of locales) {
      for (const category of categories) {
        smis.write({
          url: `/sitemaps/${locale}/${category}-sitemap.xml`,
          lastmod: new Date().toISOString(),
        });
      }
    }

    // End the stream
    smis.end();

    // Convert the stream to XML
    const sitemapIndex = await streamToPromise(Readable.from(smis)).then(
      (data) => data.toString(),
    );

    // Write sitemap index to file
    fs.writeFileSync(
      path.join(process.cwd(), "public", "sitemap-index.xml"),
      sitemapIndex,
    );

    console.log("Generated sitemap index");
  } catch (error) {
    console.error("Error generating sitemap index:", error);
  }
}
