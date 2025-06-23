import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseEducationalLevelSEOProps {
  wardWiseEducationalLevelData: any[];
  totalPopulation: number;
  educationGroupTotals: Record<string, number>;
  educationGroupPercentages: Record<string, number>;
  bestEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  leastEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  EDUCATIONAL_LEVEL_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
      levels: string[];
    }
  >;
  wardNumbers: number[];
}

export default function WardWiseEducationalLevelSEO({
  wardWiseEducationalLevelData,
  totalPopulation,
  educationGroupTotals,
  educationGroupPercentages,
  bestEducatedWard,
  leastEducatedWard,
  EDUCATIONAL_LEVEL_GROUPS,
  wardNumbers,
}: WardWiseEducationalLevelSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise educational level to structured data format
    const educationStats = wardNumbers
      .map((wardNumber) => {
        const wardData = wardWiseEducationalLevelData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardPopulation = wardData.reduce(
          (sum, item) => sum + item.population,
          0,
        );

        // Calculate higher education percentage for this ward
        const higherEducationLevels =
          EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.levels;
        const higherEducation = wardData
          .filter((item) =>
            higherEducationLevels.includes(item.educationalLevelType),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const higherEducationPercent =
          totalWardPopulation > 0
            ? ((higherEducation / totalWardPopulation) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Educational Level Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Higher education rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(higherEducationPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${higherEducation.toLocaleString()} people (${higherEducationPercent}%) have attained higher education out of a total of ${totalWardPopulation.toLocaleString()} people.`,
        };
      })
      .filter(Boolean);

    // Calculate education index (0-100)
    const educationIndex =
      (educationGroupPercentages.PRIMARY * 0.1 +
        educationGroupPercentages.LOWER_SECONDARY * 0.2 +
        educationGroupPercentages.SECONDARY * 0.3 +
        educationGroupPercentages.HIGHER_SECONDARY * 0.5 +
        educationGroupPercentages.HIGHER_EDUCATION * 1.0 +
        educationGroupPercentages.OTHER * 0.1) /
      100;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Educational Level Distribution in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of educational levels across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()}. ${educationGroupTotals.HIGHER_EDUCATION.toLocaleString()} people (${educationGroupPercentages.HIGHER_EDUCATION.toFixed(2)}%) have attained higher education. The highest educational level is in Ward ${bestEducatedWard?.wardNumber || ""} with ${bestEducatedWard?.percentage.toFixed(2) || ""}% of people having higher education.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Educational level",
        "Higher education rate",
        "Ward-wise educational level",
        "Rural education",
        "Nepal education",
        "Educational attainment",
        "Primary education",
        "Secondary education",
        "Higher education",
        "Education status",
        "Educational distribution",
        "Education index",
      ],
      url: "https://digital.khajuramun.gov.np/profile/education/ward-wise-educational-level",
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
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Primary education",
          unitText: "people",
          value: educationGroupTotals.PRIMARY,
        },
        {
          "@type": "PropertyValue",
          name: "Lower secondary education",
          unitText: "people",
          value: educationGroupTotals.LOWER_SECONDARY,
        },
        {
          "@type": "PropertyValue",
          name: "Secondary education",
          unitText: "people",
          value: educationGroupTotals.SECONDARY,
        },
        {
          "@type": "PropertyValue",
          name: "Higher secondary education",
          unitText: "people",
          value: educationGroupTotals.HIGHER_SECONDARY,
        },
        {
          "@type": "PropertyValue",
          name: "Higher education",
          unitText: "people",
          value: educationGroupTotals.HIGHER_EDUCATION,
        },
        {
          "@type": "PropertyValue",
          name: "Higher Education Rate",
          unitText: "percentage",
          value: parseFloat(
            educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
          ),
        },
        {
          "@type": "PropertyValue",
          name: "Educational Index",
          unitText: "index",
          value: educationIndex.toFixed(2),
        },
      ],
      observation: educationStats,
      about: [
        {
          "@type": "Thing",
          name: "Education",
          description: "Educational attainment levels of population",
        },
        {
          "@type": "Thing",
          name: "Education Status",
          description: "Measure of educational achievement in a population",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Education Survey",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Khajura Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Khajura",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="educational-level-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
