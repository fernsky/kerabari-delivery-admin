import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PulseSEOProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  PULSE_TYPES: Record<string, string>;
  PULSE_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function PulseSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  PULSE_TYPES,
  PULSE_TYPES_EN,
  commercializationScore,
}: PulseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert pulse stats to structured data format
    const pulseStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${PULSE_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${PULSE_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${PULSE_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced crop
    const mostProducedPulse =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedPulseEN = mostProducedPulse
      ? PULSE_TYPES_EN[mostProducedPulse.type] || mostProducedPulse.type
      : "";
    const mostProducedPercentage =
      mostProducedPulse && totalProduction > 0
        ? ((mostProducedPulse.production / totalProduction) * 100).toFixed(2)
        : "0";

    // Calculate self-consumption percentage
    const selfConsumptionAmount = totalProduction - totalSales;
    const selfConsumptionPercentage =
      totalProduction > 0
        ? ((selfConsumptionAmount / totalProduction) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Pulse Types in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Pulse production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(2)} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${((totalSales / totalProduction) * 100).toFixed(2)}% of production). The most common pulse crop is ${mostProducedPulseEN} with ${mostProducedPulse?.production.toFixed(2)} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from pulse sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Pulse production",
        "Pulse sales",
        "Lentil production",
        "Chickpea production",
        "Nepal agriculture statistics",
        "Municipality-wide pulses",
        ...Object.values(PULSE_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(PULSE_TYPES).map((name) => `${name} उत्पादन तथ्याङ्क`),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/municipality-wide-pulses",
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
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${PULSE_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Pulse Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Pulse Sales",
          unitText: "tonnes",
          value: totalSales,
        },
        {
          "@type": "PropertyValue",
          name: "Total Revenue",
          unitText: "NPR",
          value: totalRevenue,
        },
        {
          "@type": "PropertyValue",
          name: "Pulse Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: pulseStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="pulse-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
