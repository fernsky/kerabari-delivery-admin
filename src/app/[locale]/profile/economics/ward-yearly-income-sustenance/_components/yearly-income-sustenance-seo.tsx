import Script from "next/script";
import { MonthsSustainedEnum } from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

interface YearlyIncomeSustenanceSEOProps {
  overallSummary: Array<{
    monthsSustained: string;
    monthsSustainedName: string;
    households: number;
  }>;
  totalHouseholds: number;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
  wardNumbers: number[];
}

export default function YearlyIncomeSustenanceSEO({
  overallSummary,
  totalHouseholds,
  MONTHS_SUSTAINED_NAMES,
  wardNumbers,
}: YearlyIncomeSustenanceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for months sustained categories
    const MONTHS_SUSTAINED_NAMES_EN: Record<string, string> = {
      UPTO_THREE_MONTHS: "Up to 3 months",
      THREE_TO_SIX_MONTHS: "3-6 months",
      SIX_TO_NINE_MONTHS: "6-9 months",
      TWELVE_MONTHS: "Year-round",
    };

    // Convert income sustenance stats to structured data format
    const incomeSustenanceStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${MONTHS_SUSTAINED_NAMES_EN[item.monthsSustained] || item.monthsSustained} income sufficiency in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Households with ${MONTHS_SUSTAINED_NAMES_EN[item.monthsSustained] || item.monthsSustained} income sufficiency`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality have income that is sufficient for ${MONTHS_SUSTAINED_NAMES_EN[item.monthsSustained] || item.monthsSustained} (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Yearly Income Sustenance in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Yearly income sufficiency distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Yearly income sustenance",
        "Income sufficiency",
        "Food security",
        "Ward-wise economic data",
        "Nepal household survey",
        "Economic self-reliance",
        "वार्षिक आयको पर्याप्तता",
        "आय पर्याप्तता",
        "खाद्य सुरक्षा",
      ],
      url: "https://buddhashanti-rm.gov.np/profile/economics/ward-yearly-income-sustenance",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://buddhashanti-rm.gov.np",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${MONTHS_SUSTAINED_NAMES_EN[item.monthsSustained] || item.monthsSustained} income sufficiency`,
        unitText: "households",
        value: item.households,
      })),
      observation: incomeSustenanceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="yearly-income-sustenance-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
