import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceSEOProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    coverage: number;
  }>;
  totalCoverage: number;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
  IRRIGATION_SOURCE_TYPES_EN: Record<string, string>;
  sustainabilityScore: number;
}

export default function IrrigationSourceSEO({
  overallSummary,
  totalCoverage,
  IRRIGATION_SOURCE_TYPES,
  IRRIGATION_SOURCE_TYPES_EN,
  sustainabilityScore,
}: IrrigationSourceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert irrigation source stats to structured data format
    const irrigationSourceStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${IRRIGATION_SOURCE_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${IRRIGATION_SOURCE_TYPES_EN[item.type] || item.type}`,
        unitText: "hectares",
      },
      measuredValue: item.coverage,
      description: `${item.coverage.toFixed(2)} hectares in Khajura Rural Municipality are irrigated through ${IRRIGATION_SOURCE_TYPES_EN[item.type] || item.type} (${((item.coverage / totalCoverage) * 100).toFixed(2)}% of total irrigated area)`,
    }));

    // Find most common irrigation source
    const mostCommonSource =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostCommonSourceEN = mostCommonSource
      ? IRRIGATION_SOURCE_TYPES_EN[mostCommonSource.type] ||
        mostCommonSource.type
      : "";
    const mostCommonSourcePercentage =
      mostCommonSource && totalCoverage > 0
        ? ((mostCommonSource.coverage / totalCoverage) * 100).toFixed(2)
        : "0";

    // Find traditional irrigation sources
    const traditionalSources = overallSummary
      .filter((item) => ["CANAL", "IRRIGATION_CANAL"].includes(item.type))
      .reduce((sum, item) => sum + item.coverage, 0);
    const traditionalSourcePercentage =
      totalCoverage > 0
        ? ((traditionalSources / totalCoverage) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Irrigation Source Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Irrigation source statistics of Khajura Rural Municipality with a total irrigation coverage of ${totalCoverage.toFixed(2)} hectares. The most common irrigation source is ${mostCommonSourceEN} with ${mostCommonSource?.coverage.toFixed(2)} hectares (${mostCommonSourcePercentage}%). Traditional irrigation methods account for ${traditionalSourcePercentage}% of all irrigated area. Irrigation sustainability score is ${sustainabilityScore}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Irrigation sources",
        "Irrigation source types",
        "Lake or reservoir irrigation",
        "Canal irrigation",
        "Nepal irrigation statistics",
        "Municipality-wide irrigation sources",
        ...Object.values(IRRIGATION_SOURCE_TYPES_EN).map(
          (name) => `${name} irrigation statistics`,
        ),
        ...Object.values(IRRIGATION_SOURCE_TYPES).map(
          (name) => `${name} सिंचाई क्षेत्रफल`,
        ),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/municipality-wide-irrigation-source",
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
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${IRRIGATION_SOURCE_TYPES_EN[item.type] || item.type} coverage`,
          unitText: "hectares",
          value: item.coverage,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Irrigated Area",
          unitText: "hectares",
          value: totalCoverage,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigation Sustainability Score",
          unitText: "percentage",
          value: sustainabilityScore,
        },
      ],
      observation: irrigationSourceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="irrigation-source-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
