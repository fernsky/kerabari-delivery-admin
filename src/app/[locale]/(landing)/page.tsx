import { Metadata } from "next";
import React from "react";
import { LanguageParams } from "./_store/types";
import { api } from "@/trpc/server";
import HomePageSEO from "./_components/home-page-seo";
import Home from "./_components/home";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using server-side API
    const demographicData = await api.profile.demographics.summary.get.query();

    // SEO metadata setup - municipality name and details
    const municipalityName = "बुद्धशान्ति गाउँपालिका";
    const municipalityNameEn = "Khajura Rural Municipality";
    const districtName = "झापा";
    const districtNameEn = "Banke";
    const provinceName = "कोशी प्रदेश";
    const provinceNameEn = "Lumbini Province";

    // Process demographic data for SEO
    const totalPopulation = demographicData?.totalPopulation || 0;
    const totalHouseholds = demographicData?.totalHouseholds || 0;
    const malePopulation = demographicData?.populationMale || 0;
    const femalePopulation = demographicData?.populationFemale || 0;
    const literacyRate = demographicData?.literacyRateAbove15 || "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      `${municipalityName}`,
      `${municipalityName} डिजिटल प्रोफाइल`,
      `${municipalityName} वेबसाइट`,
      `${districtName} जिल्ला`,
      `${municipalityName} जनसंख्या`,
      `${municipalityName} वडा विवरण`,
      `${municipalityName} ${totalPopulation} जनसंख्या`,
      `${municipalityName} ${totalHouseholds} घरधुरी`,
      `${provinceName} पालिका प्रोफाइल`,
    ];

    const keywordsEN = [
      `${municipalityNameEn}`,
      `${municipalityNameEn} Digital Profile`,
      `${municipalityNameEn} Website`,
      `${districtNameEn} District`,
      `${municipalityNameEn} population`,
      `${municipalityNameEn} ward details`,
      `${municipalityNameEn} ${totalPopulation} population`,
      `${municipalityNameEn} ${totalHouseholds} households`,
      `${provinceNameEn} municipality profile`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `${municipalityName} झापा जिल्लाको एक प्रमुख स्थानीय तह हो। यहाँको कुल जनसंख्या ${totalPopulation.toLocaleString()} र कुल घरधुरी संख्या ${totalHouseholds.toLocaleString()} छ।  यस पालिकामा पुरुष जनसंख्या ${malePopulation.toLocaleString()}, महिला जनसंख्या ${femalePopulation.toLocaleString()} र साक्षरता दर ${literacyRate}% रहेको छ। ${municipalityName}को आधिकारिक वेबसाइटमा स्वागत छ।`;

    const descriptionEN = `${municipalityNameEn} is a major local body of ${districtNameEn} district. It has a total population of ${totalPopulation.toLocaleString()} and ${totalHouseholds.toLocaleString()} households. The municipality has ${malePopulation.toLocaleString()} male population, ${femalePopulation.toLocaleString()} female population, and a literacy rate of ${literacyRate}%. Welcome to the official website of ${municipalityNameEn}.`;

    return {
      title: `${municipalityName} | आधिकारिक वेबसाइट (${municipalityNameEn} Official Website)`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/",
        languages: {
          en: "/en",
          ne: "/ne",
        },
      },
      openGraph: {
        title: `${municipalityName} | आधिकारिक वेबसाइट`,
        description: descriptionNP,
        type: "website",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
        images: [
          {
            url: "https://digital.buddhashantimun.gov.np/images/municipality-logo.png",
            width: 1200,
            height: 630,
            alt: municipalityName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${municipalityName} | आधिकारिक वेबसाइट`,
        description: descriptionNP,
        images: [
          "https://digital.buddhashantimun.gov.np/images/municipality-logo.png",
        ],
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "बुद्धशान्ति गाउँपालिका | आधिकारिक वेबसाइट",
      description:
        "बुद्धशान्ति गाउँपालिका झापा जिल्लाको एक प्रमुख स्थानीय तह हो। पालिकाको आधिकारिक वेबसाइटमा स्वागत छ।",
    };
  }
}

export default async function Page({ params }: LanguageParams) {
  const { lng } = params;

  // Fetch demographic summary data
  const demographicData = await api.profile.demographics.summary.get.query();

  // Fetch ward time series data (latest year)
  const wardData =
    await api.profile.demographics.wardTimeSeries.summary.query();

  // SEO metadata setup - municipality name and details
  const municipalityName = "बुद्धशान्ति गाउँपालिका";
  const municipalityNameEn = "Khajura Rural Municipality";
  const districtName = "झापा";
  const provinceNumber = 5;
  const provinceName = "कोशी प्रदेश";

  return (
    <>
      <HomePageSEO
        municipalityName={municipalityName}
        municipalityNameEn={municipalityNameEn}
        districtName={districtName}
        provinceName={provinceName}
        provinceNumber={provinceNumber}
        demographicData={demographicData}
      />
      <Home
        lng={lng}
        municipalityName={municipalityName}
        municipalityNameEn={municipalityNameEn}
        districtName={districtName}
        provinceName={provinceName}
        demographicData={demographicData}
        wardData={wardData}
      />
    </>
  );
}
