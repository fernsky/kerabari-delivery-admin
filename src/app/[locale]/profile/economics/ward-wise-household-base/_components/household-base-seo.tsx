import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdBaseSEOProps {
  overallSummary: Array<{
    baseType: string;
    baseTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  BASE_TYPE_NAMES: Record<string, string>;
  BASE_TYPE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function HouseholdBaseSEO({
  overallSummary,
  totalHouseholds,
  BASE_TYPE_NAMES,
  BASE_TYPE_NAMES_EN,
  wardNumbers,
}: HouseholdBaseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert base type stats to structured data format
    const baseTypeStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${BASE_TYPE_NAMES_EN[item.baseType] || item.baseType} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${BASE_TYPE_NAMES_EN[item.baseType] || item.baseType} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality have ${BASE_TYPE_NAMES_EN[item.baseType] || item.baseType} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common base type
    const mostCommonType = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonTypeEN = mostCommonType
      ? BASE_TYPE_NAMES_EN[mostCommonType.baseType] || mostCommonType.baseType
      : "";
    const mostCommonTypePercentage =
      mostCommonType && totalHouseholds > 0
        ? ((mostCommonType.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "House Foundation Types in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `House foundation data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. The most common type is ${mostCommonTypeEN} with ${mostCommonType?.households.toLocaleString()} households (${mostCommonTypePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "House foundation",
        "Foundation distribution",
        "Ward-wise foundation data",
        "Nepal housing quality",
        "Household statistics",
        ...Object.values(BASE_TYPE_NAMES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(BASE_TYPE_NAMES).map(
          (name) => `${name} घरधुरी तथ्याङ्क`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-household-base",
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
          name: `${BASE_TYPE_NAMES_EN[item.baseType] || item.baseType} households`,
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
      observation: baseTypeStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="household-base-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
