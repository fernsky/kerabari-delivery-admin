import Script from "next/script";

interface EconomicallyActiveSEOProps {
  ageGroupSummary: Array<{
    ageGroup: string;
    ageGroupName: string;
    population: number;
  }>;
  genderSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  wardNumbers: number[];
  dependencyRatio: string;
}

export default function EconomicallyActiveSEO({
  ageGroupSummary,
  genderSummary,
  totalPopulation,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
  wardNumbers,
  dependencyRatio,
}: EconomicallyActiveSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for age groups and genders
    const AGE_GROUP_NAMES_EN: Record<string, string> = {
      AGE_0_TO_14: "0-14 years",
      AGE_15_TO_59: "15-59 years",
      AGE_60_PLUS: "60+ years",
    };

    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Convert age group stats to structured data format
    const ageGroupStats = ageGroupSummary.map((item) => ({
      "@type": "Observation",
      name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} economically active population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in the ${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} age group are economically active in Khajura Rural Municipality (${((item.population / totalPopulation) * 100).toFixed(2)}% of total economically active population)`,
    }));

    // Convert gender stats to structured data format
    const genderStats = genderSummary.map((item) => ({
      "@type": "Observation",
      name: `${GENDER_NAMES_EN[item.gender] || item.gender} economically active population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${GENDER_NAMES_EN[item.gender] || item.gender} economically active population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} ${GENDER_NAMES_EN[item.gender] || item.gender} people are economically active in Khajura Rural Municipality (${((item.population / totalPopulation) * 100).toFixed(2)}% of total economically active population)`,
    }));

    // Calculate working age population (15-59)
    const workingAgePopulation =
      ageGroupSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
        ?.population || 0;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Economically Active Population of Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Economically active population distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalPopulation.toLocaleString()} people, categorized by age groups and gender.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Economically active population",
        "Working age population",
        "Demographic distribution",
        "Ward-wise demographics",
        "Dependency ratio",
        "Labor force",
        "Age-gender distribution",
        "Nepal census",
        ...Object.values(AGE_GROUP_NAMES_EN).map(
          (name) => `${name} economically active population`,
        ),
        ...Object.values(GENDER_NAMES_EN).map(
          (name) => `${name} economically active population`,
        ),
        ...Object.values(AGE_GROUP_NAMES).map(
          (name) => `${name} आर्थिक रूपमा सक्रिय जनसंख्या`,
        ),
        ...Object.values(GENDER_NAMES).map(
          (name) => `${name} आर्थिक रूपमा सक्रिय जनसंख्या`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-economically-active-population",
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
        ...ageGroupSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} economically active population`,
          unitText: "people",
          value: item.population,
        })),
        ...genderSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN[item.gender] || item.gender} economically active population`,
          unitText: "people",
          value: item.population,
        })),
        {
          "@type": "PropertyValue",
          name: "Working age population (15-59 years)",
          unitText: "people",
          value: workingAgePopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Dependency Ratio",
          unitText: "percentage",
          value: dependencyRatio,
        },
      ],
      observation: [...ageGroupStats, ...genderStats],
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "CSV",
        contentUrl:
          "https://digital.buddhashantimun.gov.np/data/economically-active-population.csv",
      },
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
