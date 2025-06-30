import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DeceasedPopulationSEOProps {
  totalDeceasedPopulation: number;
  ageGroupData: Record<
    string,
    { male: number; female: number; other: number; total: number }
  >;
  wardData: Record<
    number,
    { male: number; female: number; other: number; total: number }
  >;
  genderTotals: { male: number; female: number; other: number };
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_GROUP_NAMES_EN: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  GENDER_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function DeceasedPopulationSEO({
  totalDeceasedPopulation,
  ageGroupData,
  wardData,
  genderTotals,
  AGE_GROUP_NAMES,
  AGE_GROUP_NAMES_EN,
  GENDER_NAMES,
  GENDER_NAMES_EN,
  wardNumbers,
}: DeceasedPopulationSEOProps) {
  // Find most affected age group for SEO description
  const mostAffectedAgeGroup = Object.entries(ageGroupData).sort(
    ([, a], [, b]) => b.total - a.total,
  )[0];

  const mostAffectedAgeGroupKey = mostAffectedAgeGroup
    ? mostAffectedAgeGroup[0]
    : "";
  const mostAffectedAgeGroupTotal = mostAffectedAgeGroup
    ? mostAffectedAgeGroup[1].total
    : 0;
  const mostAffectedAgeGroupPercentage =
    totalDeceasedPopulation > 0
      ? ((mostAffectedAgeGroupTotal / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  // Find most affected ward for SEO description
  const mostAffectedWard = Object.entries(wardData).sort(
    ([, a], [, b]) => b.total - a.total,
  )[0];

  const mostAffectedWardNumber = mostAffectedWard ? mostAffectedWard[0] : "";
  const mostAffectedWardTotal = mostAffectedWard
    ? mostAffectedWard[1].total
    : 0;
  const mostAffectedWardPercentage =
    totalDeceasedPopulation > 0
      ? ((mostAffectedWardTotal / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert age group stats to structured data format
    const ageGroupStats = Object.entries(ageGroupData).map(
      ([ageGroup, data]) => ({
        "@type": "Observation",
        name: `${AGE_GROUP_NAMES_EN[ageGroup] || ageGroup} deceased population in Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: `${AGE_GROUP_NAMES_EN[ageGroup] || ageGroup} deceased count`,
          unitText: "people",
        },
        measuredValue: data.total,
        description: `${data.total.toLocaleString()} deceased people in Khajura Rural Municipality in the age group ${AGE_GROUP_NAMES_EN[ageGroup] || ageGroup} (${((data.total / totalDeceasedPopulation) * 100).toFixed(2)}% of total deceased population)`,
      }),
    );

    // Convert gender stats to structured data format
    const genderStats = [
      {
        "@type": "Observation",
        name: `${GENDER_NAMES_EN.MALE} deceased population in Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.MALE} deceased count`,
          unitText: "people",
        },
        measuredValue: genderTotals.male,
        description: `${genderTotals.male.toLocaleString()} deceased ${GENDER_NAMES_EN.MALE} in Khajura Rural Municipality (${((genderTotals.male / totalDeceasedPopulation) * 100).toFixed(2)}% of total deceased population)`,
      },
      {
        "@type": "Observation",
        name: `${GENDER_NAMES_EN.FEMALE} deceased population in Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.FEMALE} deceased count`,
          unitText: "people",
        },
        measuredValue: genderTotals.female,
        description: `${genderTotals.female.toLocaleString()} deceased ${GENDER_NAMES_EN.FEMALE} in Khajura Rural Municipality (${((genderTotals.female / totalDeceasedPopulation) * 100).toFixed(2)}% of total deceased population)`,
      },
      {
        "@type": "Observation",
        name: `${GENDER_NAMES_EN.OTHER} deceased population in Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.OTHER} deceased count`,
          unitText: "people",
        },
        measuredValue: genderTotals.other,
        description: `${genderTotals.other.toLocaleString()} deceased ${GENDER_NAMES_EN.OTHER} in Khajura Rural Municipality (${((genderTotals.other / totalDeceasedPopulation) * 100).toFixed(2)}% of total deceased population)`,
      },
    ].filter((item) => item.measuredValue > 0); // Only include non-zero values

    // Convert ward stats to structured data
    const wardStats = Object.entries(wardData).map(([ward, data]) => ({
      "@type": "Observation",
      name: `Ward ${ward} deceased population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Ward ${ward} deceased count`,
        unitText: "people",
      },
      measuredValue: data.total,
      description: `${data.total.toLocaleString()} deceased people in Ward ${ward} of Khajura Rural Municipality (${((data.total / totalDeceasedPopulation) * 100).toFixed(2)}% of total deceased population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Age and Gender Wise Deceased Population in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Mortality data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total deceased population of ${totalDeceasedPopulation.toLocaleString()}. The most affected age group is ${AGE_GROUP_NAMES_EN[mostAffectedAgeGroupKey] || mostAffectedAgeGroupKey} with ${mostAffectedAgeGroupTotal.toLocaleString()} deceased (${mostAffectedAgeGroupPercentage}%), and the most affected ward is Ward ${mostAffectedWardNumber} with ${mostAffectedWardTotal.toLocaleString()} deceased (${mostAffectedWardPercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Mortality statistics",
        "Age-gender wise mortality",
        "Ward-wise mortality data",
        "Nepal demographics",
        "Death statistics",
        "Age-specific mortality rates",
        "Gender-specific mortality rates",
        ...Object.values(AGE_GROUP_NAMES_EN).map(
          (name) => `${name} mortality statistics`,
        ),
        ...Object.values(GENDER_NAMES).map((name) => `${name} मृत्यु तथ्याङ्क`),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-age-gender-wise-deceased-population",
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
        // Age group variables
        ...Object.entries(ageGroupData).map(([ageGroup, data]) => ({
          "@type": "PropertyValue",
          name: `${AGE_GROUP_NAMES_EN[ageGroup] || ageGroup} deceased count`,
          unitText: "people",
          value: data.total,
        })),
        // Gender variables
        {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.MALE} deceased count`,
          unitText: "people",
          value: genderTotals.male,
        },
        {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.FEMALE} deceased count`,
          unitText: "people",
          value: genderTotals.female,
        },
        {
          "@type": "PropertyValue",
          name: `${GENDER_NAMES_EN.OTHER} deceased count`,
          unitText: "people",
          value: genderTotals.other,
        },
        {
          "@type": "PropertyValue",
          name: "Total Deceased Population",
          unitText: "people",
          value: totalDeceasedPopulation,
        },
      ],
      observation: [...ageGroupStats, ...genderStats, ...wardStats],
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="deceased-population-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
