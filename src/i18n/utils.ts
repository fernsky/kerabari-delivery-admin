import { locales, type Locale } from "./config";

/**
 * Gets the language direction (LTR or RTL) for a given locale
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  // Currently all supported locales are LTR
  // Add RTL locales here if needed in the future
  return "ltr";
}

/**
 * Creates path with the given locale
 */
export function getLocalizedPath(
  path: string,
  locale: Locale | string,
): string {
  // Handle paths that are already localized
  if (
    locales.some((supportedLocale) => path.startsWith(`/${supportedLocale}/`))
  ) {
    // Replace the existing locale part with the new locale
    return path.replace(/^\/[^/]+/, `/${locale}`);
  }

  // Handle paths without a locale
  return path.startsWith("/") ? `/${locale}${path}` : `/${locale}/${path}`;
}

/**
 * Extract locale information from a path
 */
export function parseLocaleFromPath(path: string): {
  locale: string | null;
  path: string;
} {
  const pathParts = path.split("/").filter(Boolean);

  if (pathParts.length === 0) {
    return { locale: null, path: "/" };
  }

  const firstPart = pathParts[0];
  if (locales.includes(firstPart as Locale)) {
    const remainingPath = pathParts.slice(1).join("/");
    return {
      locale: firstPart,
      path: remainingPath ? `/${remainingPath}` : "/",
    };
  }

  return { locale: null, path };
}
