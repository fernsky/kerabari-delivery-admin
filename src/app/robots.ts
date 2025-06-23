import type { MetadataRoute } from 'next';

// Base URL from environment or default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digital.khajuramun.gov.np';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Uncomment if you want to disallow specific paths
       disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`, 
      `${baseUrl}/sitemap-index.xml`
    ],
    host: baseUrl,
  }
}
