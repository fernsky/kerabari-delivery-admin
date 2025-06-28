import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MigratedHouseholdSEOProps {
  overallSummary: Array<{
    migratedFrom: string;
    migratedFromName: string;
    households: number;
  }>;
  totalHouseholds: number;
  MIGRATED_FROM_NAMES: Record<string, string>;
  MIGRATED_FROM_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function MigratedHouseholdSEO({
  overallSummary,
  totalHouseholds,
  MIGRATED_FROM_NAMES,
  MIGRATED_FROM_NAMES_EN,
  wardNumbers,
}: MigratedHouseholdSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert migration stats to structured data format
    const migrationStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${MIGRATED_FROM_NAMES_EN[item.migratedFrom] || item.migratedFrom} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${MIGRATED_FROM_NAMES_EN[item.migratedFrom] || item.migratedFrom} households`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality are from ${MIGRATED_FROM_NAMES_EN[item.migratedFrom] || item.migratedFrom} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total migrated households)`,
    }));

    // Find most common migration origin
    const mostCommonMigratedFrom =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonMigratedFromEN = mostCommonMigratedFrom
      ? MIGRATED_FROM_NAMES_EN[mostCommonMigratedFrom.migratedFrom] ||
        mostCommonMigratedFrom.migratedFrom
      : "";
    const mostCommonMigratedFromPercentage =
      mostCommonMigratedFrom && totalHouseholds > 0
        ? ((mostCommonMigratedFrom.households / totalHouseholds) * 100).toFixed(
            2,
          )
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Migrated Households in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Migrated household data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} migrated households. The most common origin is ${mostCommonMigratedFromEN} with ${mostCommonMigratedFrom?.households.toLocaleString()} households (${mostCommonMigratedFromPercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Migrated households",
        "Migration distribution",
        "Ward-wise migration data",
        "Nepal demographics",
        "Migration statistics",
        ...Object.values(MIGRATED_FROM_NAMES_EN).map(
          (name) => `${name} households statistics`,
        ),
        ...Object.values(MIGRATED_FROM_NAMES).map(
          (name) => `${name} घरपरिवार तथ्याङ्क`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-wise-migrated-households",
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
          name: `${MIGRATED_FROM_NAMES_EN[item.migratedFrom] || item.migratedFrom} households`,
          unitText: "households",
          value: item.households,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Migrated Households",
          unitText: "households",
          value: totalHouseholds,
        },
      ],
      observation: migrationStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="migrated-household-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
