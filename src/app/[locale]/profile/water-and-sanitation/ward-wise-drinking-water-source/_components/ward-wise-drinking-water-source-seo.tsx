import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseDrinkingWaterSourceSEOProps {
  wardWiseDrinkingWaterSourceData: any[];
  totalHouseholds: number;
  waterSourceGroupTotals: Record<string, number>;
  waterSourceGroupPercentages: Record<string, number>;
  highestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  WATER_SOURCE_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
      sources: string[];
    }
  >;
  wardNumbers: number[];
}

export default function WardWiseDrinkingWaterSourceSEO({
  wardWiseDrinkingWaterSourceData,
  totalHouseholds,
  waterSourceGroupTotals,
  waterSourceGroupPercentages,
  highestPipedWaterWard,
  lowestPipedWaterWard,
  WATER_SOURCE_GROUPS,
  wardNumbers,
}: WardWiseDrinkingWaterSourceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise drinking water source to structured data format
    const waterSourceStats = wardNumbers
      .map((wardNumber) => {
        const wardData = wardWiseDrinkingWaterSourceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );

        // Calculate piped water percentage for this ward
        const pipedSources = WATER_SOURCE_GROUPS.PIPED_WATER.sources;
        const pipedWaterHouseholds = wardData
          .filter((item) => pipedSources.includes(item.drinkingWaterSource))
          .reduce((sum, item) => sum + item.households, 0);

        const pipedWaterPercent =
          totalWardHouseholds > 0
            ? ((pipedWaterHouseholds / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Drinking Water Source Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Piped water access rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(pipedWaterPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${pipedWaterHouseholds.toLocaleString()} households (${pipedWaterPercent}%) have access to piped water out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate water quality index (0-100) based on water source types
    const waterQualityIndex =
      waterSourceGroupPercentages.PIPED_WATER * 1.0 +
      waterSourceGroupPercentages.WELL_WATER * 0.7 +
      waterSourceGroupPercentages.NATURAL_SOURCE * 0.4 +
      waterSourceGroupPercentages.OTHER_SOURCE * 0.5;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Drinking Water Sources in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Analysis of drinking water sources across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${waterSourceGroupTotals.PIPED_WATER.toLocaleString()} households (${waterSourceGroupPercentages.PIPED_WATER.toFixed(2)}%) have access to piped water. The highest piped water access rate is in Ward ${highestPipedWaterWard?.wardNumber || ""} with ${highestPipedWaterWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Drinking water sources",
        "Piped water access",
        "Ward-wise water sources",
        "Rural water supply",
        "Nepal water access",
        "Water source distribution",
        "Water source analysis",
        "Water quality index",
        "Safe drinking water",
        "Water source availability",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/water-and-sanitation/ward-wise-drinking-water-source",
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
          name: "Piped water households",
          unitText: "households",
          value: waterSourceGroupTotals.PIPED_WATER,
        },
        {
          "@type": "PropertyValue",
          name: "Well water households",
          unitText: "households",
          value: waterSourceGroupTotals.WELL_WATER,
        },
        {
          "@type": "PropertyValue",
          name: "Natural source water households",
          unitText: "households",
          value: waterSourceGroupTotals.NATURAL_SOURCE,
        },
        {
          "@type": "PropertyValue",
          name: "Other water source households",
          unitText: "households",
          value: waterSourceGroupTotals.OTHER_SOURCE,
        },
        {
          "@type": "PropertyValue",
          name: "Piped Water Access Rate",
          unitText: "percentage",
          value: parseFloat(waterSourceGroupPercentages.PIPED_WATER.toFixed(2)),
        },
        {
          "@type": "PropertyValue",
          name: "Water Quality Index",
          unitText: "index",
          value: waterQualityIndex.toFixed(2),
        },
      ],
      observation: waterSourceStats,
      about: [
        {
          "@type": "Thing",
          name: "Water and Sanitation",
          description: "Drinking water sources and access",
        },
        {
          "@type": "Thing",
          name: "Drinking Water",
          description: "Analysis of household water sources",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Water Sources Survey",
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
        id="drinking-water-source-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
