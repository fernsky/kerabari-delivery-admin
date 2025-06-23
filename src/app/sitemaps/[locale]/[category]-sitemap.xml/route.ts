import { NextRequest } from "next/server";
import { getServerSideSitemap } from "next-sitemap";
import { api } from "@/trpc/server";
import { locales } from "@/i18n/config";

// Base URL from environment or default
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://digital.khajuramun.gov.np";

export async function GET(
  request: NextRequest,
  context: { params: { locale: string; category: string } },
) {
  const { locale, category } = context.params;

  // Validate locale
  if (!locales.includes(locale as "en" | "ne")) {
    return new Response("Invalid locale", { status: 400 });
  }

  // Define current date for lastModified
  const currentDate = new Date().toISOString();

  // Initialize empty sitemap array
  const sitemapEntries = [];
  console.log(category);
  // Generate different entries based on category
  switch (category) {
    case "main-sitemap.xml":
      // Main static pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}`,
          lastmod: currentDate,
          changefreq: "daily",
          priority: 1.0,
        },
        {
          loc: `${baseUrl}/${locale}/profile`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.9,
        },
      );
      break;

    case "demographics-sitemap.xml":
      // Demographics pages
      // Add main demographics page
      sitemapEntries.push({
        loc: `${baseUrl}/${locale}/profile/demographics`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: 0.8,
      });

      // Define all demographic pages
      const demographicPages = [
        "ward-age-wise-religion-population",
        "ward-age-wise-population",
        "ward-wise-caste-population",
        "ward-wise-househead-gender",
        "ward-wise-mother-tongue-population",
        "ward-wise-religion-population",
        "ward-wise-summary",
        "ward-age-wise-marital-status",
      ];

      // Add all demographic sub-pages
      sitemapEntries.push(
        ...demographicPages.map((page) => ({
          loc: `${baseUrl}/${locale}/profile/demographics/${page}`,
          lastmod: currentDate,
          changefreq: "monthly",
          priority: 0.7,
        })),
      );

      break;

    case "education-sitemap.xml":
      // Education pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}/profile/education`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        },
        // Add more education related pages as needed
      );
      break;

    case "health-sitemap.xml":
      // Health pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}/profile/health`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        },
        // Add more health related pages as needed
      );
      break;

    case "infrastructure-sitemap.xml":
      // Infrastructure pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}/profile/infrastructure`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        },
        // Add more infrastructure related pages as needed
      );
      break;

    case "economy-sitemap.xml":
      // Economy pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}/profile/economy`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        },
        // Add more economy related pages as needed
      );
      break;

    case "maps-sitemap.xml":
      // Maps pages
      sitemapEntries.push(
        {
          loc: `${baseUrl}/${locale}/profile/maps`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        },
        // Add more maps related pages as needed
      );
      break;

    default:
      // Invalid category
      return new Response("Invalid sitemap category", { status: 400 });
  }

  // Return XML sitemap
  //@ts-ignore
  return getServerSideSitemap(sitemapEntries);
}

export const dynamic = "force-dynamic"; // Make sure the sitemap is generated on-demand
