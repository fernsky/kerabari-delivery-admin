import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WaterPurificationSEOProps {
  overallSummary: Array<{
    waterPurification: string;
    waterPurificationName: string;
    households: number;
  }>;
  totalHouseholds: number;
  methodMap: Record<string, string>;
  wardNumbers: number[];
  safetyIndex: number;
  highestTreatmentWard:
    | {
        wardNumber: number;
        treatingPercentage: string;
      }
    | undefined;
  lowestTreatmentWard:
    | {
        wardNumber: number;
        treatingPercentage: string;
      }
    | undefined;
}

export default function WaterPurificationSEO({
  overallSummary,
  totalHouseholds,
  methodMap,
  wardNumbers,
  safetyIndex,
  highestTreatmentWard,
  lowestTreatmentWard,
}: WaterPurificationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Create English descriptions for SEO
    const purificationTypeStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${item.waterPurificationName} water purification method in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${item.waterPurificationName} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality use ${item.waterPurificationName} method for water purification (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common purification method
    const mostCommonMethod =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeName = mostCommonMethod
      ? mostCommonMethod.waterPurificationName
      : "";
    const mostCommonTypePercentage =
      mostCommonMethod && totalHouseholds > 0
        ? ((mostCommonMethod.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Find percentage of households treating water
    const treatingHouseholds = overallSummary
      .filter((item) => item.waterPurification !== "NO_ANY_FILTERING")
      .reduce((sum, item) => sum + item.households, 0);

    const treatingPercentage = (
      (treatingHouseholds / totalHouseholds) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Water Purification Methods in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of water purification methods across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${treatingPercentage}% of households treat their water before drinking. The most common method is ${mostCommonTypeName} with ${mostCommonMethod?.households.toLocaleString()} households (${mostCommonTypePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Water purification",
        "Safe drinking water",
        "Household water treatment",
        "Ward-wise water purification",
        "Nepal water safety",
        "Water boiling",
        "Water filtering",
        "Chemical water treatment",
        "Piyush usage",
        "Water safety measures",
      ],
      url: "https://digital.gadhawamun.gov.np/profile/water-and-sanitation/ward-wise-water-purification",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.gadhawamun.gov.np",
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
          name: `${item.waterPurificationName} households`,
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
          name: "Water Safety Index",
          unitText: "index",
          value: safetyIndex.toFixed(2),
        },
        {
          "@type": "PropertyValue",
          name: "Water Treatment Rate",
          unitText: "percentage",
          value: treatingPercentage,
        },
      ],
      observation: purificationTypeStats,
      about: [
        {
          "@type": "Thing",
          name: "Water and Sanitation",
          description: "Water purification methods and practices",
        },
        {
          "@type": "Thing",
          name: "Public Health",
          description: "Household water treatment for disease prevention",
        },
      ],
      isAccessibleForFree: true,
      isPartOf: {
        "@type": "WebSite",
        name: "Khajura Rural Municipality Digital Profile",
        url: "https://digital.gadhawamun.gov.np",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="water-purification-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
