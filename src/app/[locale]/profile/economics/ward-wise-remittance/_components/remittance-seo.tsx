import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceSEOProps {
  overallSummary: Array<{
    amountGroup: string;
    amountGroupLabel: string;
    sendingPopulation: number;
    color: string;
  }>;
  totalSendingPopulation: number;
  AMOUNT_RANGE_MAP: Record<
    string,
    { min: number; max: number | null; color: string; label: string }
  >;
  wardNumbers: number[];
  totalData: {
    totalSendingPopulation: number;
    highRemittanceSendingPopulation: number;
    highRemittancePercentage: string;
    mediumRemittanceSendingPopulation: number;
    mediumRemittancePercentage: string;
    lowRemittanceSendingPopulation: number;
    lowRemittancePercentage: string;
    veryHighRemittanceSendingPopulation: number;
    veryHighRemittancePercentage: string;
    averageRemittance: number;
    totalEstimatedRemittance: number;
    estimatedAnnualRemittanceCrores: string;
  };
}

export default function RemittanceSEO({
  overallSummary,
  totalSendingPopulation,
  AMOUNT_RANGE_MAP,
  wardNumbers,
  totalData,
}: RemittanceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert remittance stats to structured data format
    const remittanceStats = overallSummary.slice(0, 10).map((item) => ({
      "@type": "Observation",
      name: `${item.amountGroupLabel} remittance from Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${item.amountGroupLabel} remittance senders`,
        unitText: "people",
      },
      measuredValue: item.sendingPopulation,
      description: `${item.sendingPopulation.toLocaleString()} people from Khajura Rural Municipality send remittance in the range of ${item.amountGroupLabel} (${((item.sendingPopulation / totalSendingPopulation) * 100).toFixed(2)}% of total remittance senders)`,
    }));

    // Find most common remittance amount group
    const mostCommonGroup =
      overallSummary.length > 0
        ? overallSummary.sort(
            (a, b) => b.sendingPopulation - a.sendingPopulation,
          )[0]
        : null;

    const mostCommonGroupPercentage =
      mostCommonGroup && totalSendingPopulation > 0
        ? (
            (mostCommonGroup.sendingPopulation / totalSendingPopulation) *
            100
          ).toFixed(2)
        : "0";

    // Calculate high remittance statistics
    const highRemittancePercentage = totalData.highRemittancePercentage;
    const veryHighRemittancePercentage = totalData.veryHighRemittancePercentage;

    // Format average remittance and total estimated remittance
    const averageRemittance = totalData.averageRemittance;
    const estimatedAnnualRemittanceCrores =
      totalData.estimatedAnnualRemittanceCrores;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Remittance Distribution from Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Remittance statistics across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalSendingPopulation.toLocaleString()} people sending remittances. The most common amount range is ${mostCommonGroup?.amountGroupLabel} with ${mostCommonGroup?.sendingPopulation.toLocaleString()} senders (${mostCommonGroupPercentage}%). High remittance senders (above Rs. 300,000) account for ${highRemittancePercentage}% of all remittance senders. The estimated annual remittance is NPR ${estimatedAnnualRemittanceCrores} crore with an average of NPR ${averageRemittance.toLocaleString()} per person.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Remittance distribution",
        "Ward-wise remittance",
        "Nepal remittance statistics",
        "Foreign employment income",
        "Migrant workers remittance",
        "Rural economy",
        "High remittance",
        "Remittance utilization",
        "Economic development through remittance",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-remittance",
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
          name: `${item.amountGroupLabel} remittance senders`,
          unitText: "people",
          value: item.sendingPopulation,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Remittance Senders",
          unitText: "people",
          value: totalSendingPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "High Remittance Senders Percentage",
          unitText: "percentage",
          value: highRemittancePercentage,
        },
        {
          "@type": "PropertyValue",
          name: "Estimated Annual Remittance",
          unitText: "NPR crore",
          value: estimatedAnnualRemittanceCrores,
        },
        {
          "@type": "PropertyValue",
          name: "Average Remittance Per Person",
          unitText: "NPR",
          value: averageRemittance,
        },
      ],
      observation: remittanceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="remittance-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
