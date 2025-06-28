import Script from "next/script";

interface LandPossessionSEOProps {
  landPossessionData: Array<{
    wardNumber: number;
    households: number;
  }>;
  totalHouseholdsWithLand: number;
  wardNumbers: number[];
  estimatedTotalHouseholds: number;
}

export default function LandPossessionSEO({
  landPossessionData,
  totalHouseholdsWithLand,
  wardNumbers,
  estimatedTotalHouseholds,
}: LandPossessionSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert land possession stats to structured data format
    const landPossessionStats = landPossessionData.map((item) => ({
      "@type": "Observation",
      name: `Ward ${item.wardNumber} land-owning households in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `Households with land in Ward ${item.wardNumber}`,
        unitText: "households",
      },
      measuredValue: item.households,
      description: `${item.households.toLocaleString()} households in Ward ${item.wardNumber} of Khajura Rural Municipality own land (${((item.households / totalHouseholdsWithLand) * 100).toFixed(2)}% of total land-owning households)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Household Land Ownership in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Land ownership distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholdsWithLand.toLocaleString()} land-owning households.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Land ownership",
        "Household land possession",
        "Ward-wise land data",
        "Nepal economic survey",
        "Land distribution",
        "Rural land ownership",
        "जग्गा स्वामित्व",
        "भूमिको वितरण",
        "आर्थिक सर्वेक्षण",
      ],
      url: "https://buddhashanti-rm.gov.np/profile/economics/ward-household-land-possessions",
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
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "Land-owning households",
          unitText: "households",
          value: totalHouseholdsWithLand,
        },
        {
          "@type": "PropertyValue",
          name: "Landless households (estimated)",
          unitText: "households",
          value: Math.round(estimatedTotalHouseholds - totalHouseholdsWithLand),
        },
        {
          "@type": "PropertyValue",
          name: "Land ownership percentage",
          unitText: "percent",
          value: (
            (totalHouseholdsWithLand / estimatedTotalHouseholds) *
            100
          ).toFixed(2),
        },
      ],
      observation: landPossessionStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="land-possession-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
