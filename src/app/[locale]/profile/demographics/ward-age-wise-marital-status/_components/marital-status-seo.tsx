import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MaritalStatusSEOProps {
  overallByMaritalStatus: Array<{
    status: string;
    statusName: string;
    population: number;
  }>;
  totalPopulation: number;
  MARITAL_STATUS_NAMES: Record<string, string>;
  wardNumbers: number[];
  AGE_GROUP_NAMES: Record<string, string>;
}

export default function MaritalStatusSEO({
  overallByMaritalStatus,
  totalPopulation,
  MARITAL_STATUS_NAMES,
  wardNumbers,
  AGE_GROUP_NAMES,
}: MaritalStatusSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for marital status
    const MARITAL_STATUS_NAMES_EN: Record<string, string> = {
      SINGLE: "Single",
      MARRIED: "Married",
      DIVORCED: "Divorced",
      WIDOWED: "Widowed",
      SEPARATED: "Separated",
      NOT_STATED: "Not Stated",
    };

    const AGE_GROUP_NAMES_EN: Record<string, string> = {
      AGE_BELOW_15: "Below 15 years",
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

    // Convert marital stats to structured data format
    const maritalStatusStats = overallByMaritalStatus.map((item) => ({
      "@type": "Observation",
      name: `${MARITAL_STATUS_NAMES_EN[item.status] || item.status} population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${MARITAL_STATUS_NAMES_EN[item.status] || item.status}`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${localizeNumber(item.population, "ne")} people in Khajura Rural Municipality are ${MARITAL_STATUS_NAMES_EN[item.status] || item.status} (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Marital Status Demographics of Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Age-wise and ward-wise marital status distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${localizeNumber(totalPopulation, "ne")} people.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Marital status demographics",
        "Age-wise marital status",
        "Ward-wise marital status data",
        "Nepal census",
        ...Object.values(MARITAL_STATUS_NAMES_EN).map(
          (name) => `${name} population`,
        ),
        ...Object.values(MARITAL_STATUS_NAMES).map(
          (name) => `${name} जनसंख्या`,
        ),
        ...Object.values(AGE_GROUP_NAMES_EN).map(
          (name) => `${name} marital status`,
        ),
        ...Object.values(AGE_GROUP_NAMES).map(
          (name) => `${name} वैवाहिक स्थिति`,
        ),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/demographics/ward-age-wise-marital-status",
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
      variableMeasured: overallByMaritalStatus.map((item) => ({
        "@type": "PropertyValue",
        name: `${MARITAL_STATUS_NAMES_EN[item.status] || item.status} population`,
        unitText: "people",
        value: item.population,
      })),
      observation: maritalStatusStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="marital-status-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
