import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardData {
  wardNumber: number;
  wardName: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  otherPopulation: number;
  totalHouseholds: number;
  averageHouseholdSize: number;
  sexRatio: number;
}

interface WardWiseSEOProps {
  processedWardData: WardData[];
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function WardWiseSEO({
  processedWardData,
  municipalityStats,
  municipalityAverages,
}: WardWiseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward stats to structured data format
    const wardObservations = processedWardData.map((ward) => ({
      "@type": "Observation",
      name: `केराबारी गाउँपालिका वडा ${ward.wardNumber} demographics`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Population",
          unitText: "people",
          value: ward.totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Male Population",
          unitText: "people",
          value: ward.malePopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Female Population",
          unitText: "people",
          value: ward.femalePopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: ward.totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Average Household Size",
          value: ward.averageHouseholdSize,
        },
        {
          "@type": "PropertyValue",
          name: "Sex Ratio",
          value: ward.sexRatio,
        },
      ],
      description: `केराबारी गाउँपालिका वडा ${localizeNumber(
        ward.wardNumber,
        "ne",
      )} मा जनसंख्या ${localizeNumber(
        ward.totalPopulation.toLocaleString(),
        "ne",
      )} जना छन्, जसमा ${localizeNumber(
        ward.malePopulation.toLocaleString(),
        "ne",
      )} पुरुष र ${localizeNumber(
        ward.femalePopulation.toLocaleString(),
        "ne",
      )} महिला रहेका छन्, साथै यस वडामा ${localizeNumber(
        ward.totalHouseholds.toLocaleString(),
        "ne",
      )} घरधुरी छन्।`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "केराबारी गाउँपालिका - वडागत जनसांख्यिकी तथ्याङ्क",
      description: `केराबारी गाउँपालिकाको ${localizeNumber(
        processedWardData.length,
        "ne",
      )} वडाहरूको जनसंख्या वितरण, जसमा कुल जनसंख्या ${localizeNumber(
        municipalityStats.totalPopulation.toLocaleString(),
        "ne",
      )} र कुल ${localizeNumber(
        municipalityStats.totalHouseholds.toLocaleString(),
        "ne",
      )} घरधुरी रहेका छन्।`,
      keywords: [
        "केराबारी गाउँपालिका",
        "Khajura Rural Municipality",
        "वडागत जनसांख्यिकी",
        "केराबारी वडा जनसंख्या",
        "नेपाल जनगणना",
        "केराबारी जनसंख्या वितरण",
        "केराबारी लैङ्गिक अनुपात",
        "केराबारी घरधुरी तथ्याङ्क",
        "मोरङ जिल्ला जनसंख्या",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/demographics/ward-wise-summary",
      creator: {
        "@type": "Organization",
        name: "केराबारी गाउँपालिका",
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
          name: "Total Population",
          unitText: "people",
          value: municipalityStats.totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: municipalityStats.totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Average Household Size",
          value: municipalityAverages.averageHouseholdSize,
        },
        {
          "@type": "PropertyValue",
          name: "Sex Ratio",
          value: municipalityAverages.sexRatio,
        },
      ],
      observation: wardObservations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="ward-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
