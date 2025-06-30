import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface ForeignEmploymentSEOProps {
  overallSummary: Array<{
    country: string;
    countryName: string;
    population: number;
  }>;
  totalPopulation: number;
  COUNTRY_NAMES: Record<string, string>;
  COUNTRY_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
  estimatedAnnualRemittance: number;
}

export default function ForeignEmploymentSEO({
  overallSummary,
  totalPopulation,
  COUNTRY_NAMES,
  COUNTRY_NAMES_EN,
  wardNumbers,
  estimatedAnnualRemittance,
}: ForeignEmploymentSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert country stats to structured data format
    const countryStats = overallSummary.slice(0, 10).map((item) => ({
      "@type": "Observation",
      name: `${COUNTRY_NAMES_EN[item.country] || item.country} workers from Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${COUNTRY_NAMES_EN[item.country] || item.country} migrant workers`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people from Khajura Rural Municipality work in ${COUNTRY_NAMES_EN[item.country] || item.country} (${((item.population / totalPopulation) * 100).toFixed(2)}% of total migrant workers)`,
    }));

    // Find most common destination country
    const mostCommonCountry =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonCountryEN = mostCommonCountry
      ? COUNTRY_NAMES_EN[mostCommonCountry.country] || mostCommonCountry.country
      : "";
    const mostCommonCountryPercentage =
      mostCommonCountry && totalPopulation > 0
        ? ((mostCommonCountry.population / totalPopulation) * 100).toFixed(2)
        : "0";

    // Calculate Gulf countries total
    const gulfCountries = [
      "QATAR",
      "SAUDI_ARABIA",
      "UNITED_ARAB_EMIRATES",
      "KUWAIT",
      "BAHRAIN",
      "OMAN",
    ];
    const gulfCountriesCount = overallSummary
      .filter((item) => gulfCountries.includes(item.country))
      .reduce((sum, item) => sum + item.population, 0);

    const gulfCountriesPercentage =
      totalPopulation > 0
        ? ((gulfCountriesCount / totalPopulation) * 100).toFixed(2)
        : "0";

    // Format remittance to crores
    const remittanceCrores = (estimatedAnnualRemittance / 10000000).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Foreign Employment Destinations from Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Foreign employment statistics across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalPopulation.toLocaleString()} migrant workers. The most common destination is ${mostCommonCountryEN} with ${mostCommonCountry?.population.toLocaleString()} workers (${mostCommonCountryPercentage}%). Gulf countries account for ${gulfCountriesPercentage}% of all foreign employment. Estimated annual remittance is NPR ${remittanceCrores} crore.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Foreign employment",
        "Migrant workers",
        "Destination countries",
        "Nepal migration statistics",
        "Remittance",
        "Gulf employment",
        "Ward-wise foreign employment",
        ...Object.values(COUNTRY_NAMES_EN)
          .slice(0, 10)
          .map((name) => `${name} Nepali workers statistics`),
        ...Object.values(COUNTRY_NAMES)
          .slice(0, 10)
          .map((name) => `${name} मा कार्यरत केराबारीवासी`),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-foreign-employment-countries",
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
        ...overallSummary.slice(0, 8).map((item) => ({
          "@type": "PropertyValue",
          name: `${COUNTRY_NAMES_EN[item.country] || item.country} workers`,
          unitText: "people",
          value: item.population,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Migrant Workers",
          unitText: "people",
          value: totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Gulf Countries Workers Percentage",
          unitText: "percentage",
          value: gulfCountriesPercentage,
        },
        {
          "@type": "PropertyValue",
          name: "Estimated Annual Remittance",
          unitText: "NPR",
          value: estimatedAnnualRemittance,
        },
      ],
      observation: countryStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="foreign-employment-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
