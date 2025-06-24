import Script from "next/script";

interface LoanHouseholdSEOProps {
  loanData: Array<{
    wardNumber: number;
    households: number;
  }>;
  totalHouseholdsOnLoan: number;
  wardNumbers: number[];
}

export default function LoanHouseholdSEO({
  loanData,
  totalHouseholdsOnLoan,
  wardNumbers,
}: LoanHouseholdSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert loan statistics to structured data format
    const loanStats = loanData.map((item) => ({
      "@type": "Observation",
      name: `Ward ${item.wardNumber} households with loans in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Households with loans in Ward ${item.wardNumber}`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Ward ${item.wardNumber} of Khajura Rural Municipality have taken loans (${((item.households / totalHouseholdsOnLoan) * 100).toFixed(2)}% of total households with loans)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Households with Loans in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Distribution of households with loans across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholdsOnLoan.toLocaleString()} households having loans.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Household loans",
        "Ward-wise loan data",
        "Nepal economic survey",
        "Financial inclusion",
        "Rural credit access",
        "Household debt",
        "ऋणी घरपरिवार",
        "आर्थिक सर्वेक्षण",
      ],
      url: "https://gadhawa-rm.gov.np/profile/economics/ward-households-in-loan",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://gadhawa-rm.gov.np",
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
      variableMeasured: loanData.map((item) => ({
        "@type": "PropertyValue",
        name: `Ward ${item.wardNumber} households with loans`,
        unitText: "households",
        value: item.households,
      })),
      observation: loanStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="loan-households-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
