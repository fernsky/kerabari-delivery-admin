import Script from "next/script";

interface HouseholdChoresSEOProps {
  overallSummary: Array<{
    timeSpent: string;
    timeSpentName: string;
    population: number;
  }>;
  totalPopulation: number;
  TIME_SPENT_NAMES: Record<string, string>;
  wardNumbers: number[];
}

export default function HouseholdChoresSEO({
  overallSummary,
  totalPopulation,
  TIME_SPENT_NAMES,
  wardNumbers,
}: HouseholdChoresSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for time spent categories
    const TIME_SPENT_NAMES_EN: Record<string, string> = {
      LESS_THAN_1_HOUR: "Less than 1 hour",
      HOURS_1_TO_3: "1-3 hours",
      HOURS_4_TO_6: "4-6 hours",
      HOURS_7_TO_9: "7-9 hours",
      HOURS_10_TO_12: "10-12 hours",
      MORE_THAN_12_HOURS: "More than 12 hours",
    };

    // Convert time spent category stats to structured data format
    const timeSpentStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${TIME_SPENT_NAMES_EN[item.timeSpent] || item.timeSpent} spent on household chores in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `People spending ${TIME_SPENT_NAMES_EN[item.timeSpent] || item.timeSpent} on household chores`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality spend ${TIME_SPENT_NAMES_EN[item.timeSpent] || item.timeSpent} on household chores (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Household Chores Time Distribution in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Time spent on household chores distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalPopulation.toLocaleString()} people surveyed.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Household chores",
        "Time spent on household work",
        "Ward-wise household chores data",
        "Nepal household survey",
        "Domestic work",
        "Time use survey",
        ...Object.values(TIME_SPENT_NAMES_EN).map(
          (name) => `${name} on household chores`,
        ),
        ...Object.values(TIME_SPENT_NAMES).map(
          (name) => `घरायसी कामकाजमा ${name}`,
        ),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/ward-household-chores",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${TIME_SPENT_NAMES_EN[item.timeSpent] || item.timeSpent} on household chores`,
        unitText: "people",
        value: item.population,
      })),
      observation: timeSpentStats,
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "CSV",
        contentUrl:
          "https://digital.gadhawamun.gov.np/data/household-chores-time-distribution.csv",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="household-chores-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
