import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseOwnershipSEOProps {
  overallSummary: Array<{
    ownershipType: string;
    ownershipTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  OWNERSHIP_TYPE_NAMES: Record<string, string>;
  OWNERSHIP_TYPE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function HouseOwnershipSEO({
  overallSummary,
  totalHouseholds,
  OWNERSHIP_TYPE_NAMES,
  OWNERSHIP_TYPE_NAMES_EN,
  wardNumbers,
}: HouseOwnershipSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ownership type stats to structured data format
    const ownershipTypeStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${OWNERSHIP_TYPE_NAMES_EN[item.ownershipType] || item.ownershipType} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${OWNERSHIP_TYPE_NAMES_EN[item.ownershipType] || item.ownershipType} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality have ${OWNERSHIP_TYPE_NAMES_EN[item.ownershipType] || item.ownershipType} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common ownership type
    const mostCommonType = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeEN = mostCommonType
      ? OWNERSHIP_TYPE_NAMES_EN[mostCommonType.ownershipType] ||
        mostCommonType.ownershipType
      : "";
    const mostCommonTypePercentage =
      mostCommonType && totalHouseholds > 0
        ? ((mostCommonType.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "House Ownership Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `House ownership data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. The most common type is ${mostCommonTypeEN} with ${mostCommonType?.households.toLocaleString()} households (${mostCommonTypePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "House ownership",
        "Ownership distribution",
        "Ward-wise ownership data",
        "Nepal economics",
        "Household statistics",
        ...Object.values(OWNERSHIP_TYPE_NAMES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(OWNERSHIP_TYPE_NAMES).map(
          (name) => `${name} घरधुरी तथ्याङ्क`,
        ),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/ward-wise-house-ownership",
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
          name: `${OWNERSHIP_TYPE_NAMES_EN[item.ownershipType] || item.ownershipType} households`,
          unitText: "households",
          value: item.households,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: totalHouseholds,
        },
      ],
      observation: ownershipTypeStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="house-ownership-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
