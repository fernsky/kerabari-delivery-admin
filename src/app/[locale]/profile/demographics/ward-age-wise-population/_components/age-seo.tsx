import Script from "next/script";

interface AgeSEOProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  totalPopulation: number;
  AGE_GROUP_NAMES: Record<string, string>;
  wardNumbers: number[];
  demographicIndicators: {
    childrenPercentage: number;
    youthPercentage: number;
    adultPercentage: number;
    elderlyPercentage: number;
    dependencyRatio: number;
    childDependencyRatio: number;
    oldAgeDependencyRatio: number;
    medianAge: number;
  };
}

export default function AgeSEO({
  overallSummaryByAge,
  totalPopulation,
  AGE_GROUP_NAMES,
  wardNumbers,
  demographicIndicators,
}: AgeSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for age groups
    const AGE_GROUP_NAMES_EN: Record<string, string> = {
      AGE_0_4: "0-4 years",
      AGE_5_9: "5-9 years",
      AGE_10_14: "10-14 years",
      AGE_15_19: "15-19 years",
      AGE_20_24: "20-24 years",
      AGE_25_29: "25-29 years",
      AGE_30_34: "30-34 years",
      AGE_35_39: "35-39 years",
      AGE_40_44: "40-44 years",
      AGE_45_49: "45-49 years",
      AGE_50_54: "50-54 years",
      AGE_55_59: "55-59 years",
      AGE_60_64: "60-64 years",
      AGE_65_69: "65-69 years",
      AGE_70_74: "70-74 years",
      AGE_75_AND_ABOVE: "75 years and above",
    };

    // Convert age stats to structured data format
    const ageStats = overallSummaryByAge.map((item) => ({
      "@type": "Observation",
      name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} population`,
        unitText: "people",
      },
      measuredValue: item.total,
      description: `${item.total.toLocaleString()} people in Khajura Rural Municipality belong to age group ${
        AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup
      } (${((item.total / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    // Add demographic indicators as observations
    const indicatorObservations = [
      {
        "@type": "Observation",
        name: "Dependency Ratio in Khajura Rural Municipality",
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Dependency Ratio",
        },
        measuredValue: demographicIndicators.dependencyRatio.toFixed(1),
        description: `The dependency ratio in Khajura Rural Municipality is ${demographicIndicators.dependencyRatio.toFixed(
          1,
        )}, indicating the ratio of dependents to the working-age population.`,
      },
      {
        "@type": "Observation",
        name: "Median Age in Khajura Rural Municipality",
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Median Age",
          unitText: "years",
        },
        measuredValue: Math.round(demographicIndicators.medianAge),
        description: `The median age of the population in Khajura Rural Municipality is approximately ${Math.round(
          demographicIndicators.medianAge,
        )} years.`,
      },
    ];

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Age Demographics of Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Age distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people. The median age is approximately ${Math.round(
        demographicIndicators.medianAge,
      )} years with a dependency ratio of ${demographicIndicators.dependencyRatio.toFixed(
        1,
      )}.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Age demographics",
        "Population pyramid",
        "Dependency ratio",
        "Median age",
        "Ward-wise age data",
        "Nepal census",
        "उमेर वितरण",
        "जनसंख्या पिरामिड",
        "निर्भरता अनुपात",
        "मध्यम उमेर",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-age-wise-population",
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
        {
          "@type": "PropertyValue",
          name: "Age distribution",
          unitText: "people by age group",
        },
        {
          "@type": "PropertyValue",
          name: "Dependency Ratio",
          value: demographicIndicators.dependencyRatio.toFixed(1),
        },
        {
          "@type": "PropertyValue",
          name: "Median Age",
          unitText: "years",
          value: Math.round(demographicIndicators.medianAge),
        },
      ],
      observation: [...ageStats, ...indicatorObservations],
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="age-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
