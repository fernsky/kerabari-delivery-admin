import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigatedAreaSEOProps {
  wardData: Array<{
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  }>;
  totalIrrigatedArea: number;
  totalUnirrigatedArea: number;
  totalArea: number;
  irrigatedPercentage: string;
  mostIrrigatedWard: {
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  } | null;
}

export default function IrrigatedAreaSEO({
  wardData,
  totalIrrigatedArea,
  totalUnirrigatedArea,
  totalArea,
  irrigatedPercentage,
  mostIrrigatedWard,
}: IrrigatedAreaSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise irrigated area stats to structured data format
    const wardIrrigatedStats = wardData.map((ward) => ({
      "@type": "Observation",
      name: `Ward ${ward.wardNumber} Irrigated Area in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: "Irrigated Area",
        unitText: "hectares",
      },
      measuredValue: ward.irrigatedArea,
      description: `Ward ${ward.wardNumber} has ${ward.irrigatedArea.toFixed(2)} hectares of irrigated area and ${ward.unirrigatedArea.toFixed(2)} hectares of unirrigated area (${((ward.irrigatedArea / ward.totalArea) * 100).toFixed(2)}% irrigation coverage)`,
    }));

    // Find ward with highest irrigation coverage (percentage)
    const highestIrrigationCoverageWard = [...wardData]
      .filter((ward) => ward.totalArea > 0)
      .sort(
        (a, b) => b.irrigatedArea / b.totalArea - a.irrigatedArea / a.totalArea,
      )[0];

    // Find ward with lowest irrigation coverage (percentage)
    const lowestIrrigationCoverageWard = [...wardData]
      .filter((ward) => ward.totalArea > 0)
      .sort(
        (a, b) => a.irrigatedArea / a.totalArea - b.irrigatedArea / a.totalArea,
      )[0];

    const highestCoveragePercentage = highestIrrigationCoverageWard
      ? (
          (highestIrrigationCoverageWard.irrigatedArea /
            highestIrrigationCoverageWard.totalArea) *
          100
        ).toFixed(2)
      : "0";

    const lowestCoveragePercentage = lowestIrrigationCoverageWard
      ? (
          (lowestIrrigationCoverageWard.irrigatedArea /
            lowestIrrigationCoverageWard.totalArea) *
          100
        ).toFixed(2)
      : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Irrigated Area in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Ward-wise irrigated and unirrigated area statistics of Khajura Rural Municipality with a total area of ${totalArea.toFixed(2)} hectares. ${irrigatedPercentage}% (${totalIrrigatedArea.toFixed(2)} hectares) of the total area is irrigated. Ward ${mostIrrigatedWard?.wardNumber || ""} has the highest irrigated area with ${mostIrrigatedWard?.irrigatedArea.toFixed(2) || "0"} hectares. Ward ${highestIrrigationCoverageWard?.wardNumber || ""} has the highest irrigation coverage percentage (${highestCoveragePercentage}%) and Ward ${lowestIrrigationCoverageWard?.wardNumber || ""} has the lowest (${lowestCoveragePercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Ward-wise irrigated area",
        "Irrigation coverage by ward",
        "Agricultural irrigation statistics",
        "Ward irrigation analysis",
        "Nepal irrigation statistics",
        "वडा अनुसार सिंचित क्षेत्रफल",
        "सिंचित र असिंचित क्षेत्रफल",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/ward-wise-irrigated-area",
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
        ...wardData.map((ward) => ({
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNumber} Irrigated Area`,
          unitText: "hectares",
          value: ward.irrigatedArea,
        })),
        ...wardData.map((ward) => ({
          "@type": "PropertyValue",
          name: `Ward ${ward.wardNumber} Unirrigated Area`,
          unitText: "hectares",
          value: ward.unirrigatedArea,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Irrigated Area",
          unitText: "hectares",
          value: totalIrrigatedArea,
        },
        {
          "@type": "PropertyValue",
          name: "Total Unirrigated Area",
          unitText: "hectares",
          value: totalUnirrigatedArea,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigation Coverage Percentage",
          unitText: "percentage",
          value: parseFloat(irrigatedPercentage),
        },
      ],
      observation: wardIrrigatedStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="irrigated-area-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
