import { getRequestConfig } from "next-intl/server";
import { promises as fs } from "fs";
import path from "path";
import { locales, domains, defaultLocale } from "./config";

/**
 * Loads message files for all domains for a specific locale
 */
async function loadDomainMessages(locale: string) {
  const messages: Record<string, unknown> = {};

  for (const domain of domains) {
    try {
      // In production, we use import() for proper bundling
      if (process.env.NODE_ENV === "production") {
        const domainMessages = (
          await import(`../messages/${domain}/${locale}.json`)
        ).default;
        messages[domain] = domainMessages;
      } else {
        // In development, read files directly for better hot reloading
        const filePath = path.join(
          process.cwd(),
          "src",
          "messages",
          domain,
          `${locale}.json`,
        );
        const fileContent = await fs.readFile(filePath, "utf8");
        messages[domain] = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error(
        `Failed to load translations for domain ${domain} and locale ${locale}:`,
        error,
      );
      // If a domain file is missing, use an empty object for that domain
      messages[domain] = {};
    }
  }

  return messages;
}

export default getRequestConfig(async ({ locale }) => {
  try {
    // Guard against undefined locale - use defaultLocale as fallback
    const safeLocale = locale || defaultLocale;

    // Check if the locale is supported
    if (!locales.includes(safeLocale as "ne" | "en")) {
      console.warn(
        `Unsupported locale: ${safeLocale}, falling back to ${defaultLocale}`,
      );
      // Use default locale if the requested one isn't supported
      const messages = await loadDomainMessages(defaultLocale);
      return {
        locale: defaultLocale,
        messages,
        timeZone: "Asia/Kathmandu",
      };
    }

    // Load and merge messages for the requested locale from all domains
    const messages = await loadDomainMessages(safeLocale);

    // Return locale configuration
    return {
      locale: safeLocale,
      messages,
      timeZone: "Asia/Kathmandu",
      // You could add more locale-specific settings here
    };
  } catch (error) {
    console.error(`Error setting up i18n for locale ${locale}:`, error);
    // Handle error gracefully instead of calling notFound()
    // This prevents the error cascade
    const messages = await loadDomainMessages(defaultLocale);
    return {
      locale: defaultLocale,
      messages,
      timeZone: "Asia/Kathmandu",
    };
  }
});
