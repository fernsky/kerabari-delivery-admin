import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TimeToFinancialOrganizationSEOProps {
  timeToFinancialOrgData: any[];
  totalHouseholds: number;
  under15MinTotal: number;
  under30MinTotal: number;
  under1HourTotal: number;
  over1HourTotal: number;
  under15MinPercentage: number;
  under30MinPercentage: number;
  under1HourPercentage: number;
  over1HourPercentage: number;
  bestAccessWard: any;
  worstAccessWard: any;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string };
    UNDER_30_MIN: { name: string; nameEn: string; color: string };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string };
  };
  wardNumbers: number[];
}

export default function TimeToFinancialOrganizationSEO({
  timeToFinancialOrgData,
  totalHouseholds,
  under15MinTotal,
  under30MinTotal,
  under1HourTotal,
  over1HourTotal,
  under15MinPercentage,
  under30MinPercentage,
  under1HourPercentage,
  over1HourPercentage,
  bestAccessWard,
  worstAccessWard,
  TIME_TO_FINANCIAL_ORG_STATUS,
  wardNumbers,
}: TimeToFinancialOrganizationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise time to financial org stats to structured data format
    const timeToFinancialOrgStats = wardNumbers
      .map((wardNumber) => {
        const wardData = timeToFinancialOrgData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );
        const under15Min =
          wardData.find(
            (item) => item.timeToFinancialOrganizationType === "UNDER_15_MIN",
          )?.households || 0;
        const under15MinPercent =
          totalWardHouseholds > 0
            ? ((under15Min / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Financial Access in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Quick financial access rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(under15MinPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${under15Min.toLocaleString()} households (${under15MinPercent}%) can reach a financial institution within 15 minutes out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate combined quick access (under 30 min)
    const quickAccessTotal = under15MinTotal + under30MinTotal;
    const quickAccessPercentage = (
      under15MinPercentage + under30MinPercentage
    ).toFixed(2);

    // Calculate financial inclusion index (0-100)
    const financialInclusionIndex =
      (under15MinPercentage * 1.0 +
        under30MinPercentage * 0.75 +
        under1HourPercentage * 0.5 +
        over1HourPercentage * 0.25) /
      100;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Financial Organization Access Time in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Analysis of time taken to reach financial organizations across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${under15MinTotal.toLocaleString()} households (${under15MinPercentage.toFixed(2)}%) can reach a financial institution within 15 minutes, while ${over1HourTotal.toLocaleString()} households (${over1HourPercentage.toFixed(2)}%) need more than 1 hour. The best financial access is in Ward ${bestAccessWard?.wardNumber || ""} with ${bestAccessWard?.under15MinPercent.toFixed(2) || ""}% of households having access within 15 minutes.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Financial access",
        "Time to financial organizations",
        "Banking access",
        "Financial inclusion",
        "Ward-wise financial access",
        "Rural banking",
        "Nepal financial access",
        "Financial organization proximity",
        "Time to banks",
        "Financial service accessibility",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-time-to-financial-organization",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.buddhashantimun.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Households with access under 15 minutes",
          unitText: "households",
          value: under15MinTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with access under 30 minutes",
          unitText: "households",
          value: under30MinTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with access under 1 hour",
          unitText: "households",
          value: under1HourTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with access over 1 hour",
          unitText: "households",
          value: over1HourTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Quick Access Rate (under 30 min)",
          unitText: "percentage",
          value: parseFloat(quickAccessPercentage),
        },
        {
          "@type": "PropertyValue",
          name: "Financial Inclusion Index",
          unitText: "index",
          value: financialInclusionIndex.toFixed(2),
        },
      ],
      observation: timeToFinancialOrgStats,
      about: [
        {
          "@type": "Thing",
          name: "Financial Inclusion",
          description:
            "Access to affordable financial products and services that meet needs of households and businesses",
        },
        {
          "@type": "Thing",
          name: "Financial Access",
          description:
            "Ability to access banking and financial services in terms of geographic proximity",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Financial Access Survey",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Khajura Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Khajura",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="time-to-financial-organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
