import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSolidWasteManagementSEOProps {
  wardWiseSolidWasteManagementData: any[];
  totalHouseholds: number;
  wasteManagementTotals: Record<string, number>;
  wasteManagementPercentages: Record<string, number>;
  highestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_COLORS: Record<string, string>;
  wardNumbers: number[];
  sourceMap: Record<string, string>;
}

export default function WardWiseSolidWasteManagementSEO({
  wardWiseSolidWasteManagementData,
  totalHouseholds,
  wasteManagementTotals,
  wasteManagementPercentages,
  highestHomeCollectionWard,
  lowestHomeCollectionWard,
  WASTE_MANAGEMENT_COLORS,
  wardNumbers,
  sourceMap,
}: WardWiseSolidWasteManagementSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise solid waste management to structured data format
    const wasteManagementStats = wardNumbers
      .map((wardNumber) => {
        const wardData = wardWiseSolidWasteManagementData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );

        // Calculate home collection percentage for this ward
        const homeCollectionHouseholds = wardData
          .filter((item) => item.solidWasteManagement === "HOME_COLLECTION")
          .reduce((sum, item) => sum + item.households, 0);

        const homeCollectionPercent =
          totalWardHouseholds > 0
            ? ((homeCollectionHouseholds / totalWardHouseholds) * 100).toFixed(
                2,
              )
            : "0";

        return {
          "@type": "Observation",
          name: `Solid Waste Management Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Home waste collection rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(homeCollectionPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${homeCollectionHouseholds.toLocaleString()} households (${homeCollectionPercent}%) use home waste collection methods out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Group waste management methods for environmental impact score calculation
    const environmentallyFriendlyMethods = [
      "HOME_COLLECTION",
      "WASTE_COLLECTING_PLACE",
      "COMPOST_MANURE",
    ];
    const moderateImpactMethods = ["DIGGING"];
    const highImpactMethods = ["BURNING", "RIVER", "ROAD_OR_PUBLIC_PLACE"];

    // Calculate environmental impact score based on waste management types
    let environmentalImpactScore = 0;
    let totalWeightedScore = 0;

    Object.entries(wasteManagementPercentages).forEach(
      ([method, percentage]) => {
        if (environmentallyFriendlyMethods.includes(method)) {
          environmentalImpactScore += percentage * 1.0;
        } else if (moderateImpactMethods.includes(method)) {
          environmentalImpactScore += percentage * 0.7;
        } else if (highImpactMethods.includes(method)) {
          environmentalImpactScore += percentage * 0.1;
        } else {
          environmentalImpactScore += percentage * 0.5; // OTHER methods
        }

        totalWeightedScore += percentage;
      },
    );

    // Normalize to 0-100 scale
    environmentalImpactScore =
      totalWeightedScore > 0
        ? (environmentalImpactScore / totalWeightedScore) * 100
        : 0;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Solid Waste Management in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Analysis of solid waste management methods across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${wasteManagementTotals.HOME_COLLECTION?.toLocaleString() || 0} households (${wasteManagementPercentages.HOME_COLLECTION?.toFixed(2) || 0}%) use home waste collection methods. The highest home collection rate is in Ward ${highestHomeCollectionWard?.wardNumber || ""} with ${highestHomeCollectionWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Solid waste management",
        "Home waste collection",
        "Ward-wise waste management",
        "Rural waste management",
        "Nepal waste management",
        "Waste disposal methods",
        "Sustainable waste management",
        "Environmental impact assessment",
        "Household waste practices",
        "Waste collection services",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/water-and-sanitation/ward-wise-solid-waste-management",
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
        ...Object.entries(wasteManagementTotals).map(([method, value]) => ({
          "@type": "PropertyValue",
          name: `${sourceMap[method] || method} households`,
          unitText: "households",
          value: value,
        })),
        ...Object.entries(wasteManagementPercentages).map(
          ([method, value]) => ({
            "@type": "PropertyValue",
            name: `${sourceMap[method] || method} rate`,
            unitText: "percentage",
            value: parseFloat(value.toFixed(2)),
          }),
        ),
        {
          "@type": "PropertyValue",
          name: "Environmental Impact Score",
          unitText: "index",
          value: environmentalImpactScore.toFixed(2),
        },
      ],
      observation: wasteManagementStats,
      about: [
        {
          "@type": "Thing",
          name: "Water and Sanitation",
          description: "Solid waste management methods and practices",
        },
        {
          "@type": "Thing",
          name: "Waste Management",
          description: "Analysis of household waste disposal methods",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Waste Management Survey",
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
        id="solid-waste-management-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
