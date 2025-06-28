import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FarmersGroupSEOProps {
  groupSummary: Array<{
    type: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalGroups: number;
  farmsByWard: Array<{
    wardNumber: number;
    farmCount: number;
    farms: Array<{
      id: string;
      name: string;
      type: string;
      icon: string;
    }>;
  }>;
  statistics: {
    totalGroups: number;
    totalWards: number;
    avgGroupsPerWard: number;
    mostPopularGroupType: string;
    mostPopularGroupTypePercentage: number;
    wardWithMostGroups: number;
    maximumGroupsInAWard: number;
  };
  WARD_NAMES_EN: Record<number, string>;
}

export default function FarmersGroupSEO({
  groupSummary,
  totalGroups,
  farmsByWard,
  statistics,
  WARD_NAMES_EN,
}: FarmersGroupSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert group stats to structured data format
    const groupTypeStats = groupSummary.map((item) => ({
      "@type": "Dataset",
      name: `${item.type} in Khajura Rural Municipality`,
      description: `There are ${item.count} ${item.type} groups operating in Khajura Rural Municipality, representing ${item.percentage.toFixed(2)}% of total agricultural groups.`,
      keywords: [item.type, "agriculture", "farming groups", "Khajura"],
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
      },
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Number of Groups",
          unitText: "count",
          value: item.count,
        },
        {
          "@type": "PropertyValue",
          name: "Percentage of Total",
          unitText: "percentage",
          value: item.percentage,
        },
      ],
    }));

    // Ward distribution data
    const wardDistributionData = farmsByWard.map((ward) => ({
      "@type": "Dataset",
      name: `${WARD_NAMES_EN[ward.wardNumber]} Agricultural Groups`,
      description: `Ward ${ward.wardNumber} has ${ward.farmCount} agriculture related groups, with groups such as ${ward.farms
        .slice(0, 3)
        .map((farm) => farm.name)
        .join(", ")}${ward.farms.length > 3 ? " and others" : ""}.`,
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
      },
      variableMeasured: {
        "@type": "PropertyValue",
        name: "Number of Groups in Ward",
        unitText: "count",
        value: ward.farmCount,
      },
    }));

    // Find most common group type
    const mostCommonGroupType = statistics.mostPopularGroupType;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Agriculture Related Farmers Groups in Khajura Rural Municipality",
      description: `Comprehensive analysis of ${totalGroups} agriculture related farmers groups in Khajura Rural Municipality. The most common type is ${mostCommonGroupType} (${statistics.mostPopularGroupTypePercentage.toFixed(1)}%), and Ward ${statistics.wardWithMostGroups} has the highest concentration with ${statistics.maximumGroupsInAWard} groups. This dataset covers all 9 wards of the municipality.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Agriculture",
        "Farmers Groups",
        "Agricultural Development",
        "Rural Development",
        "Nepal Agriculture",
        "Farming Groups",
        ...groupSummary.map((item) => item.type),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/agriculture-related-farmers-group",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.buddhashantimun.gov.np",
      },
      temporalCoverage: "2023",
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
          name: "Total Farmers Groups",
          unitText: "count",
          value: totalGroups,
        },
        {
          "@type": "PropertyValue",
          name: "Average Groups per Ward",
          unitText: "count",
          value: statistics.avgGroupsPerWard,
        },
        {
          "@type": "PropertyValue",
          name: "Most Common Group Type",
          value: mostCommonGroupType,
        },
        {
          "@type": "PropertyValue",
          name: "Most Common Group Type Percentage",
          unitText: "percentage",
          value: statistics.mostPopularGroupTypePercentage,
        },
      ],
      distribution: groupTypeStats,
      hasPart: wardDistributionData,
      about: [
        {
          "@type": "Thing",
          name: "Agricultural Development",
          description:
            "The development and improvement of agricultural practices and systems",
        },
        {
          "@type": "Thing",
          name: "Rural Development",
          description: "Economic and social development focused on rural areas",
        },
        {
          "@type": "Thing",
          name: "Cooperative Farming",
          description:
            "Agricultural production carried out by farming groups or cooperatives",
        },
      ],
      isPartOf: {
        "@type": "Dataset",
        name: "Khajura Rural Municipality Digital Profile",
        url: "https://digital.buddhashantimun.gov.np",
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="farmers-group-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
