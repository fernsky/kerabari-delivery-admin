import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { GeistSans } from "geist/font/sans";
import { validateRequest } from "@/lib/auth/validate-request";
import { Providers } from "@/components/providers";
import { extractRouterConfig } from "uploadthing/server";

import "@/app/globals.css";

// Define Inter font for English
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Define Noto Sans Devanagari font for Nepali
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-noto-sans-devanagari",
});

// Pre-generate all locale variants at build time
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The key fix here is accessing params directly, not destructuring immediately
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  // Explicitly get the locale from params and use it
  const locale = params.locale;

  // Validate locale
  if (!locales.includes(locale as "en" | "ne")) {
    return {
      title: "Unsupported Locale",
    };
  }

  try {
    // Properly await translations
    const t = await getTranslations({ locale, namespace: "seo.default" });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://digital.gadhawamun.gov.np";

    const appUrl = process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`;

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: t("title"),
        template: `%s | ${t("title")}`,
      },
      description: t("description"),
      keywords: [
        "gadhawa",
        "Digital Profile",
        "Nepal",
        "Government",
        "Citizen Portal",
        "नागरिक प्रोफाइल",
        "डिजिटल प्रोफाइल",
        "नेपाल",
        "सरकार",
        "गढवा",
      ],
      authors: [
        { name: "Digital Profile Information System, Government of Nepal" },
        { name: "त्रिलोचन भुसाल | सर्वज्ञ घो श्रेष्ठ" },
        { name: "Trilochan Bhusal, Sarbagya Gho Shrestha" },
      ],
      creator: "Government of Nepal",
      publisher: "Digital Profile Information System",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      alternates: {
        canonical: `${baseUrl}/${locale}`,
        languages: {
          en: `${baseUrl}/en`,
          ne: `${baseUrl}/ne`,
        },
      },
      openGraph: {
        type: "website",
        locale: locale,
        url: `${baseUrl}/${locale}`,
        siteName: t("title"),
        title: t("title"),
        description: t("description"),
        images: [
          {
            url: `${baseUrl}/images/og-image-${locale}.jpg`,
            width: 1200,
            height: 630,
            alt: t("title"),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("title"),
        description: t("description"),
        images: [`${baseUrl}/images/twitter-image-${locale}.jpg`],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      manifest: `${baseUrl}/site.webmanifest`,
      icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
      },
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
        other: {
          "facebook-domain-verification":
            process.env.NEXT_PUBLIC_FB_VERIFICATION,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Digital Profile System",
      description: "Government of Nepal's Digital Profile System",
    };
  }
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  // Extract the locale parameter directly without destructuring
  const locale = params.locale;

  // Check if locale is supported
  if (!locales.includes(locale as "en" | "ne")) {
    notFound();
  }

  // Get authenticated user
  const { user } = await validateRequest();

  // Choose the appropriate font based on locale
  const fontClass = notoSansDevanagari.className;
  // Include both font variables for theming purposes
  const fontVariables = `${GeistSans.className} ${inter.variable} ${notoSansDevanagari.variable}`;

  // Load domain-structured messages for the current locale
  let messages;
  try {
    const commonMessages = (await import(`@/messages/common/${locale}.json`))
      .default;
    const seoMessages = (await import(`@/messages/seo/${locale}.json`)).default;
    const authMessages = (await import(`@/messages/auth/${locale}.json`))
      .default;
    const citizenMessages = (await import(`@/messages/citizen/${locale}.json`))
      .default;
    const dashboardMessages = (
      await import(`@/messages/dashboard/${locale}.json`)
    ).default;
    const profileMessages = (await import(`@/messages/profile/${locale}.json`))
      .default;
    messages = {
      common: commonMessages,
      seo: seoMessages,
      auth: authMessages,
      citizen: citizenMessages,
      dashboard: dashboardMessages,
      profile: profileMessages,
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={locale === "ne" ? "ltr" : "ltr"}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Government required meta tags */}
        <meta name="gov:portal" content="gadhawa Digital Profile" />
        <meta
          name="gov:department"
          content="Digital Profile Information System"
        />
        <meta name="gov:confidentiality" content="public" />
        <meta name="author" content="त्रिलोचन भुसाल, सर्वज्ञ घो श्रेष्ठ" />
        <meta name="author" content="Trilochan Bhusal, Sarbagya Gho Shrestha" />
      </head>
      <body className={fontClass}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers user={user}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
