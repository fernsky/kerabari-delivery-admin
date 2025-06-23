import { getServerSideSitemap, getServerSideSitemapIndex } from 'next-sitemap';
import { locales } from '@/i18n/config';

// Base URL from environment or default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digital.khajuramun.gov.np';

// Define your sitemap categories
const sitemapCategories = [
  'main',
  'demographics',
  'education',
  'health',
  'infrastructure',
  'economy',
  'maps'
];

export async function GET(request: Request) {
  // Create sitemap entries for each category and locale
  const sitemapUrls = sitemapCategories.flatMap(category => 
    locales.map(locale => `${baseUrl}/sitemaps/${locale}/${category}-sitemap.xml`)
  );
  
  // Return the XML sitemap index
  return getServerSideSitemapIndex(sitemapUrls);
}
