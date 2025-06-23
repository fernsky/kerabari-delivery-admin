import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseSEOProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function DisabilityCauseSEO({
  overallSummary,
  totalPopulationWithDisability,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_NAMES_EN,
  wardNumbers,
}: DisabilityCauseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Get top 3 disability causes for description
    const topCauses = overallSummary.slice(0, 3);
    const topCausesDescription = topCauses
      .map(
        (cause) =>
          `${DISABILITY_CAUSE_NAMES_EN[cause.disabilityCause] || cause.disabilityCause} (${
            cause.disabilityCauseName
          }): ${cause.population} people (${(
            (cause.population / totalPopulationWithDisability) *
            100
          ).toFixed(2)}%)`,
      )
      .join(", ");

    // Convert disability cause stats to structured data format
    const disabilityCauseStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} disability population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population} people in Khajura Rural Municipality have disabilities due to ${
        DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause
      } (${((item.population / totalPopulationWithDisability) * 100).toFixed(2)}% of total disability population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Disability Cause Demographics of Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Disability cause distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population with disabilities of ${totalPopulationWithDisability.toLocaleString()} people. Main causes include ${topCausesDescription}.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Disability cause demographics",
        "Disability statistics",
        "Ward-wise disability cause data",
        "Nepal disability census",
        ...Object.values(DISABILITY_CAUSE_NAMES_EN).map(
          (name) => `${name} disability`,
        ),
        ...Object.values(DISABILITY_CAUSE_NAMES).map(
          (name) => `${name} अपाङ्गता`,
        ),
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-wise-disability-cause",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] || item.disabilityCause} disability population`,
        unitText: "people",
        value: item.population,
      })),
      observation: disabilityCauseStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="disability-cause-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
