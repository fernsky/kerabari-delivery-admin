import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DeathCauseSEOProps {
  overallSummary: Array<{
    deathCause: string;
    deathCauseName: string;
    population: number;
  }>;
  totalDeaths: number;
  deathCauseLabels: Record<string, string>;
  DEATH_CAUSE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function DeathCauseSEO({
  overallSummary,
  totalDeaths,
  deathCauseLabels,
  DEATH_CAUSE_NAMES_EN,
  wardNumbers,
}: DeathCauseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert death cause stats to structured data format
    const deathCauseStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause} deaths in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause} deaths`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} deaths in Khajura Rural Municipality due to ${DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause} (${((item.population / totalDeaths) * 100).toFixed(2)}% of total deaths)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Causes of Death in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Death cause distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalDeaths.toLocaleString()} recorded deaths.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Death causes",
        "Mortality statistics",
        "Ward-wise death cause data",
        "Nepal health statistics",
        ...Object.values(DEATH_CAUSE_NAMES_EN).map(
          (name) => `${name} mortality statistics`,
        ),
        ...Object.values(deathCauseLabels).map(
          (name) => `${name} मृत्यु तथ्याङ्क`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-death-causes",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause} deaths`,
        unitText: "people",
        value: item.population,
      })),
      observation: deathCauseStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="death-cause-distribution-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
