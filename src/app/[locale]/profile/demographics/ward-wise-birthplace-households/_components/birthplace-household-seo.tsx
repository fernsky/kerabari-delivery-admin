import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthplaceHouseholdSEOProps {
  overallSummary: Array<{
    birthPlace: string;
    birthPlaceName: string;
    households: number;
  }>;
  totalHouseholds: number;
  BIRTH_PLACE_NAMES: Record<string, string>;
  BIRTH_PLACE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function BirthplaceHouseholdSEO({
  overallSummary,
  totalHouseholds,
  BIRTH_PLACE_NAMES,
  BIRTH_PLACE_NAMES_EN,
  wardNumbers,
}: BirthplaceHouseholdSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert birthplace stats to structured data format
    const birthplaceStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${BIRTH_PLACE_NAMES_EN[item.birthPlace] || item.birthPlace} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${BIRTH_PLACE_NAMES_EN[item.birthPlace] || item.birthPlace} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality are from ${BIRTH_PLACE_NAMES_EN[item.birthPlace] || item.birthPlace} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    // Find most common birthplace
    const mostCommonBirthplace =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonBirthplaceEN = mostCommonBirthplace
      ? BIRTH_PLACE_NAMES_EN[mostCommonBirthplace.birthPlace] ||
        mostCommonBirthplace.birthPlace
      : "";
    const mostCommonBirthplacePercentage =
      mostCommonBirthplace && totalHouseholds > 0
        ? ((mostCommonBirthplace.households / totalHouseholds) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Household Birthplaces in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Household birthplace data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. The most common origin is ${mostCommonBirthplaceEN} with ${mostCommonBirthplace?.households.toLocaleString()} households (${mostCommonBirthplacePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Household birthplaces",
        "Birthplace distribution",
        "Ward-wise birthplace data",
        "Nepal demographics",
        "Migration statistics",
        ...Object.values(BIRTH_PLACE_NAMES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(BIRTH_PLACE_NAMES).map(
          (name) => `${name} घरपरिवार तथ्याङ्क`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-wise-birthplace-households",
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
          name: `${BIRTH_PLACE_NAMES_EN[item.birthPlace] || item.birthPlace} households`,
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
      observation: birthplaceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="birthplace-household-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
