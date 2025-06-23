import { notFound } from "next/navigation";

// Define the list of all supported locales
export const locales = ["en", "ne"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en" as const;

// Define domains for which we have translations
export const domains = [
  "common",
  "auth",
  "citizen",
  "seo",
  "dashboard",
  "profile",
] as const;
export type Domain = (typeof domains)[number];

// Define locale display names
export const localeNames: Record<string, string> = {
  en: "English",
  ne: "नेपाली",
};

// Define time zones by locale
export const timeZones: Record<string, string> = {
  en: "Asia/Kathmandu",
  ne: "Asia/Kathmandu",
};

// Define date formats by locale
export const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
  en: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  ne: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
};

/**
 * Utility function to validate locale
 * @returns The validated locale or defaultLocale if the input is invalid
 */
export function validateLocale(locale: string | undefined): Locale {
  // Handle undefined case
  if (!locale) {
    console.warn(`Undefined locale provided, using default: ${defaultLocale}`);
    return defaultLocale;
  }

  // Check if locale is supported
  if (!locales.includes(locale as Locale)) {
    console.warn(
      `Unsupported locale: ${locale}, falling back to ${defaultLocale}`,
    );
    return defaultLocale;
  }

  return locale as Locale;
}

/**
 * Utility function that throws notFound for invalid locales
 * Use this in route handlers where you want to return 404 for invalid locales
 */
export function validateLocaleOrNotFound(
  locale: string | undefined,
): asserts locale is Locale {
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }
}
