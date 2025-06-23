import { locales } from '@/i18n/config';
import { generateCategorySitemap, generateSitemapIndex } from '@/lib/sitemap-utils';

/**
 * This script generates all sitemaps for all locales and categories
 */
async function generateAllSitemaps() {
  console.log('Starting sitemap generation...');
  
  const categories = ['main', 'demographics', 'education', 'health', 'infrastructure', 'economy', 'maps'];
  
  for (const locale of locales) {
    console.log(`Generating sitemaps for locale: ${locale}`);
    
    for (const category of categories) {
      await generateCategorySitemap(locale, category);
    }
  }
  
  // Generate the sitemap index
  await generateSitemapIndex();
  
  console.log('All sitemaps generated successfully!');
}

// Run the script if it's called directly
if (require.main === module) {
  generateAllSitemaps().catch(err => {
    console.error('Error generating sitemaps:', err);
    process.exit(1);
  });
}
