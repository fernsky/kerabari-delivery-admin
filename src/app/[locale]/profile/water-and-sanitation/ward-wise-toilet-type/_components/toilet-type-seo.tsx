import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface ToiletTypeSEOProps {
  overallSummary: Array<{
    toiletType: string;
    toiletTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  typeMap: Record<string, string>;
  wardNumbers: number[];
  sanitationIndex: number;
  highestSanitationWard:
    | {
        wardNumber: number;
        sanitationPercentage: string;
      }
    | undefined;
  lowestSanitationWard:
    | {
        wardNumber: number;
        sanitationPercentage: string;
      }
    | undefined;
  noToiletPercentage: string;
}

export default function ToiletTypeSEO({
  overallSummary,
  totalHouseholds,
  typeMap,
  wardNumbers,
  sanitationIndex,
  highestSanitationWard,
  lowestSanitationWard,
  noToiletPercentage,
}: ToiletTypeSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Create English descriptions for SEO
    const toiletTypeStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${item.toiletTypeName} toilet facilities in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${item.toiletTypeName} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality use ${item.toiletTypeName} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common toilet type
    const mostCommonType = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeName = mostCommonType
      ? mostCommonType.toiletTypeName
      : "";
    const mostCommonTypePercentage =
      mostCommonType && totalHouseholds > 0
        ? ((mostCommonType.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Find percentage of households with proper sanitation
    const sanitizedHouseholds = overallSummary
      .filter((item) => item.toiletType !== "NO_TOILET")
      .reduce((sum, item) => sum + item.households, 0);

    const sanitizedPercentage = (
      (sanitizedHouseholds / totalHouseholds) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Toilet Types in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Analysis of toilet types across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${sanitizedPercentage}% of households have proper toilet facilities. The most common toilet type is ${mostCommonTypeName} with ${mostCommonType?.households.toLocaleString()} households (${mostCommonTypePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Toilet types",
        "Sanitation facilities",
        "Flush toilets",
        "Ward-wise toilet distribution",
        "Nepal sanitation",
        "Septic tank usage",
        "Basic toilets",
        "Public toilet access",
        "No toilet households",
        "Sanitation improvement",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/water-and-sanitation/ward-wise-toilet-type",
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
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${item.toiletTypeName} households`,
          unitText: "households",
          value: item.households,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Sanitation Index",
          unitText: "index",
          value: sanitationIndex.toFixed(2),
        },
        {
          "@type": "PropertyValue",
          name: "No Toilet Percentage",
          unitText: "percentage",
          value: noToiletPercentage,
        },
      ],
      observation: toiletTypeStats,
      about: [
        {
          "@type": "Thing",
          name: "Water and Sanitation",
          description: "Toilet types and sanitation practices",
        },
        {
          "@type": "Thing",
          name: "Public Health",
          description: "Sanitation facilities for disease prevention",
        },
      ],
      isAccessibleForFree: true,
      isPartOf: {
        "@type": "WebSite",
        name: "Khajura Rural Municipality Digital Profile",
        url: "https://digital.buddhashantimun.gov.np",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="toilet-type-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
