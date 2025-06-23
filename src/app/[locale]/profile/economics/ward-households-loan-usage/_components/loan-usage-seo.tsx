import Script from "next/script";

interface LoanUsageSEOProps {
  overallSummary: Array<{
    loanUse: string;
    loanUseName: string;
    households: number;
  }>;
  totalHouseholds: number;
  loanUseLabels: Record<string, string>;
  wardNumbers: number[];
}

export default function LoanUsageSEO({
  overallSummary,
  totalHouseholds,
  loanUseLabels,
  wardNumbers,
}: LoanUsageSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for loan use categories
    const LOAN_USE_NAMES_EN: Record<string, string> = {
      AGRICULTURE: "Agriculture",
      BUSINESS: "Business",
      HOUSEHOLD_EXPENSES: "Household Expenses",
      FOREIGN_EMPLOYMENT: "Foreign Employment",
      EDUCATION: "Education",
      HEALTH_TREATMENT: "Health Treatment",
      HOME_CONSTRUCTION: "Home Construction",
      VEHICLE_PURCHASE: "Vehicle Purchase",
      CEREMONY: "Wedding/Ceremonies",
      OTHER: "Other",
    };

    // Convert loan use stats to structured data format
    const loanUseStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${LOAN_USE_NAMES_EN[item.loanUse] || item.loanUse} loans in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Households borrowing for ${LOAN_USE_NAMES_EN[item.loanUse] || item.loanUse}`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Khajura Rural Municipality have taken loans for ${LOAN_USE_NAMES_EN[item.loanUse] || item.loanUse} purposes (${((item.households / totalHouseholds) * 100).toFixed(2)}% of total households with loans)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Loan Usage Patterns in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Loan usage purpose distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households with loans.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Loan usage purposes",
        "Credit utilization",
        "Ward-wise loan data",
        "Nepal household finance",
        "Rural credit study",
        ...Object.values(LOAN_USE_NAMES_EN).map((name) => `${name} loans`),
        ...Object.values(loanUseLabels).map((name) => `${name} कर्जा`),
      ],
      url: "https://khajura-rm.gov.np/profile/economics/ward-households-loan-usage",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://khajura-rm.gov.np",
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
        name: `${LOAN_USE_NAMES_EN[item.loanUse] || item.loanUse} loan households`,
        unitText: "households",
        value: item.households,
      })),
      observation: loanUseStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="loan-usage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
