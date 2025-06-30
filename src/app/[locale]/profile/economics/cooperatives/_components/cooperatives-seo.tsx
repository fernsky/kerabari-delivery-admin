import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CooperativesSEOProps {
  cooperativeSummary: Array<{
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalCooperatives: number;
  cooperativesByWard: Array<{
    wardNumber: number;
    cooperativeCount: number;
    cooperatives: Array<{
      id: string;
      cooperativeName: string;
      cooperativeType: string;
      typeName: string;
      phoneNumber: string;
      remarks: string;
      icon: string;
    }>;
  }>;
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_TYPES_EN: Record<string, string>;
  statistics: {
    totalCooperatives: number;
    totalWards: number;
    avgCooperativesPerWard: number;
    mostPopularCooperativeType: string;
    mostPopularCooperativeTypeName: string;
    mostPopularCooperativeTypePercentage: number;
    wardWithMostCooperatives: number;
    maximumCooperativesInAWard: number;
    provinceLevelCooperatives: number;
  };
}

export default function CooperativesSEO({
  cooperativeSummary,
  totalCooperatives,
  cooperativesByWard,
  COOPERATIVE_TYPES,
  COOPERATIVE_TYPES_EN,
  statistics,
}: CooperativesSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert cooperative stats to structured data format
    const cooperativeTypeStats = cooperativeSummary.map((item) => ({
      "@type": "Dataset",
      name: `${COOPERATIVE_TYPES_EN[item.type] || item.type} Cooperatives in Khajura Rural Municipality`,
      description: `There are ${item.count} ${COOPERATIVE_TYPES_EN[item.type] || item.type} cooperatives operating in Khajura Rural Municipality, representing ${item.percentage.toFixed(2)}% of total cooperatives.`,
      keywords: [
        item.type,
        COOPERATIVE_TYPES_EN[item.type],
        "cooperative",
        "Khajura",
      ],
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
      },
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Number of Cooperatives",
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
    const wardDistributionData = cooperativesByWard.map((ward) => ({
      "@type": "Dataset",
      name: `Ward ${ward.wardNumber} Cooperatives`,
      description: `Ward ${ward.wardNumber} has ${ward.cooperativeCount} cooperatives, including ${ward.cooperatives
        .slice(0, 3)
        .map((coop) => coop.cooperativeName)
        .join(", ")}${ward.cooperatives.length > 3 ? " and others" : ""}.`,
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
      },
      variableMeasured: {
        "@type": "PropertyValue",
        name: "Number of Cooperatives in Ward",
        unitText: "count",
        value: ward.cooperativeCount,
      },
    }));

    // Find most common cooperative type
    const mostCommonCooperativeType = statistics.mostPopularCooperativeType;
    const mostCommonCooperativeTypeEN =
      COOPERATIVE_TYPES_EN[mostCommonCooperativeType] ||
      mostCommonCooperativeType;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Cooperatives in Khajura Rural Municipality",
      description: `Comprehensive analysis of ${totalCooperatives} cooperatives in Khajura Rural Municipality. The most common type is ${mostCommonCooperativeTypeEN} (${statistics.mostPopularCooperativeTypePercentage.toFixed(1)}%), and Ward ${statistics.wardWithMostCooperatives} has the highest concentration with ${statistics.maximumCooperativesInAWard} cooperatives. This dataset includes ${statistics.provinceLevelCooperatives} province-level cooperatives and covers all 9 wards of the municipality.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Cooperatives",
        "सहकारी संस्था",
        "Savings and Credit",
        "Multi-Purpose Cooperatives",
        "Agricultural Cooperatives",
        "Women's Cooperatives",
        "Community Cooperatives",
        "Province Level Cooperatives",
        "Rural Finance",
        "Nepal Cooperatives",
        "Lumbini Province",
        ...cooperativeSummary.map(
          (item) => COOPERATIVE_TYPES_EN[item.type] || item.type,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/cooperatives",
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
          name: "Total Cooperatives",
          unitText: "count",
          value: totalCooperatives,
        },
        {
          "@type": "PropertyValue",
          name: "Province Level Cooperatives",
          unitText: "count",
          value: statistics.provinceLevelCooperatives,
        },
        {
          "@type": "PropertyValue",
          name: "Average Cooperatives per Ward",
          unitText: "count",
          value: statistics.avgCooperativesPerWard,
        },
        {
          "@type": "PropertyValue",
          name: "Most Common Cooperative Type",
          value: mostCommonCooperativeTypeEN,
        },
        {
          "@type": "PropertyValue",
          name: "Most Common Cooperative Type Percentage",
          unitText: "percentage",
          value: statistics.mostPopularCooperativeTypePercentage,
        },
      ],
      distribution: cooperativeTypeStats,
      hasPart: wardDistributionData,
      about: [
        {
          "@type": "Thing",
          name: "Cooperative Movement",
          description:
            "Organizations owned and operated by their members for mutual benefit",
        },
        {
          "@type": "Thing",
          name: "Rural Finance",
          description:
            "Financial services provided in rural areas including savings, loans, and investments",
        },
        {
          "@type": "Thing",
          name: "Economic Development",
          description:
            "Process of improving economic well-being and quality of life through cooperative institutions",
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
        id="cooperatives-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
