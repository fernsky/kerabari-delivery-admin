import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface EconomicallyActivePopulationSEOProps {
  overallSummary: Array<{
    ageGroup: string;
    ageGroupName: string;
    population: number;
  }>;
  totalPopulation: number;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_GROUP_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function EconomicallyActivePopulationSEO({
  overallSummary,
  totalPopulation,
  AGE_GROUP_NAMES,
  AGE_GROUP_NAMES_EN,
  wardNumbers,
}: EconomicallyActivePopulationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert age group stats to structured data format
    const ageGroupStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality are in the ${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} age group (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    // Calculate economically active population (15-59 age group)
    const economicallyActivePopulation =
      overallSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
        ?.population || 0;

    // Calculate dependency ratio
    const dependentPopulation = totalPopulation - economicallyActivePopulation;
    const dependencyRatio =
      economicallyActivePopulation > 0
        ? ((dependentPopulation / economicallyActivePopulation) * 100).toFixed(
            2,
          )
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Economically Active Population of Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Age-wise economically active population data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people. The working age population (15-59 years) is ${economicallyActivePopulation.toLocaleString()} people (${((economicallyActivePopulation / totalPopulation) * 100).toFixed(2)}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Economically active population",
        "Age distribution",
        "Ward-wise population data",
        "Dependency ratio",
        "Working age population",
        "Nepal demographics",
        ...Object.values(AGE_GROUP_NAMES_EN).map(
          (name) => `${name} statistics`,
        ),
        ...Object.values(AGE_GROUP_NAMES).map((name) => `${name} तथ्याङ्क`),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-age-wise-economically-active-population",
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
          name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} population`,
          unitText: "people",
          value: item.population,
        })),
        {
          "@type": "PropertyValue",
          name: "Dependency Ratio",
          unitText: "percentage",
          value: dependencyRatio,
        },
      ],
      observation: ageGroupStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="economically-active-population-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
