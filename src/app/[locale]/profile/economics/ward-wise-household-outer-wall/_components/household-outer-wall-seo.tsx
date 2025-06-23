import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdOuterWallSEOProps {
  overallSummary: Array<{
    wallType: string;
    wallTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  WALL_TYPE_NAMES: Record<string, string>;
  WALL_TYPE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function HouseholdOuterWallSEO({
  overallSummary,
  totalHouseholds,
  WALL_TYPE_NAMES,
  WALL_TYPE_NAMES_EN,
  wardNumbers,
}: HouseholdOuterWallSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert wall type stats to structured data format
    const wallTypeStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${WALL_TYPE_NAMES_EN[item.wallType] || item.wallType} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${WALL_TYPE_NAMES_EN[item.wallType] || item.wallType} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality have ${WALL_TYPE_NAMES_EN[item.wallType] || item.wallType} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common wall type
    const mostCommonType = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeEN = mostCommonType
      ? WALL_TYPE_NAMES_EN[mostCommonType.wallType] || mostCommonType.wallType
      : "";
    const mostCommonTypePercentage =
      mostCommonType && totalHouseholds > 0
        ? ((mostCommonType.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Calculate high quality walls
    const highQualityCount = overallSummary
      .filter(
        (item) =>
          item.wallType === "CEMENT_JOINED" || item.wallType === "PREFAB",
      )
      .reduce((sum, item) => sum + item.households, 0);

    const highQualityPercentage =
      totalHouseholds > 0
        ? ((highQualityCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "House Outer Wall Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `House outer wall data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. The most common type is ${mostCommonTypeEN} with ${mostCommonType?.households.toLocaleString()} households (${mostCommonTypePercentage}%). High quality walls account for ${highQualityPercentage}% of all households.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "House outer wall",
        "Wall distribution",
        "Ward-wise wall data",
        "Nepal housing quality",
        "Household wall statistics",
        "Housing structure safety",
        "Cement-bonded walls statistics",
        ...Object.values(WALL_TYPE_NAMES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(WALL_TYPE_NAMES).map(
          (name) => `${name} घरधुरी तथ्याङ्क`,
        ),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/ward-wise-household-outer-wall",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.khajuramun.gov.np",
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
          name: `${WALL_TYPE_NAMES_EN[item.wallType] || item.wallType} households`,
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
          name: "High Quality Wall Percentage",
          unitText: "percentage",
          value: highQualityPercentage,
        },
      ],
      observation: wallTypeStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="household-outer-wall-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
