import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface LandOwnershipSEOProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  LAND_OWNERSHIP_TYPES: Record<string, string>;
  LAND_OWNERSHIP_TYPES_EN: Record<string, string>;
  wardNumbers: number[];
  securityScore: number;
}

export default function LandOwnershipSEO({
  overallSummary,
  totalHouseholds,
  LAND_OWNERSHIP_TYPES,
  LAND_OWNERSHIP_TYPES_EN,
  wardNumbers,
  securityScore,
}: LandOwnershipSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert land ownership stats to structured data format
    const landOwnershipStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${LAND_OWNERSHIP_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${LAND_OWNERSHIP_TYPES_EN[item.type] || item.type}`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality live on ${LAND_OWNERSHIP_TYPES_EN[item.type] || item.type} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common land ownership type
    const mostCommonType = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeEN = mostCommonType
      ? LAND_OWNERSHIP_TYPES_EN[mostCommonType.type] || mostCommonType.type
      : "";
    const mostCommonTypePercentage =
      mostCommonType && totalHouseholds > 0
        ? ((mostCommonType.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Find public/eilani land data
    const publicLandData = overallSummary.find(
      (item) => item.type === "PUBLIC_EILANI",
    );
    const publicLandPercentage =
      publicLandData && totalHouseholds > 0
        ? ((publicLandData.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Land Ownership Types in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Land ownership statistics across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. The most common land ownership type is ${mostCommonTypeEN} with ${mostCommonType?.households.toLocaleString()} households (${mostCommonTypePercentage}%). Public/Eilani land accounts for ${publicLandPercentage}% of all households. Land security score is ${securityScore}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Land ownership",
        "Land ownership types",
        "Private land",
        "Public land",
        "Guthi land",
        "Nepal land ownership statistics",
        "Ward-wise land ownership",
        ...Object.values(LAND_OWNERSHIP_TYPES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(LAND_OWNERSHIP_TYPES).map(
          (name) => `${name} घरपरिवार संख्या`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-land-ownership",
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
          name: `${LAND_OWNERSHIP_TYPES_EN[item.type] || item.type} households`,
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
          name: "Land Security Score",
          unitText: "percentage",
          value: securityScore,
        },
      ],
      observation: landOwnershipStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="land-ownership-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
