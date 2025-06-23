import Script from "next/script";

interface ExportedProductsSEOProps {
  totalProducts: number;
  categoryDistribution: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function ExportedProductsSEO({
  totalProducts,
  categoryDistribution,
}: ExportedProductsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for categories
    const CATEGORY_NAMES_EN: Record<string, string> = {
      "कृषि उत्पादन": "Agricultural Products",
      हस्तकला: "Handicrafts",
      "औद्योगिक उत्पादन": "Industrial Products",
      "खनिज पदार्थ": "Minerals",
      "प्रशोधित खाद्य": "Processed Food",
      अन्य: "Other",
    };

    // Convert category stats to structured data format
    const categoryStats = categoryDistribution.map((item) => ({
      "@type": "Observation",
      name: `${CATEGORY_NAMES_EN[item.name] || item.name} exports from Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${CATEGORY_NAMES_EN[item.name] || item.name} exported products`,
        unitText: "items",
      },
      measuredValue: item.value,
      description: `${item.value.toLocaleString()} products in ${
        CATEGORY_NAMES_EN[item.name] || item.name
      } category are exported from Khajura Rural Municipality (${item.percentage}% of total exports)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Exported Products Catalog of Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Comprehensive catalog of ${totalProducts.toLocaleString()} products exported from Khajura Rural Municipality, categorized by type and market potential.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Export catalog",
        "Economic profile",
        "Exported goods",
        "Nepal exports",
        ...Object.values(CATEGORY_NAMES_EN).map((name) => `${name} exports`),
        ...categoryDistribution.map((cat) => `${cat.name} निर्यातित वस्तु`),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/exported-products",
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
      variableMeasured: categoryDistribution.map((item) => ({
        "@type": "PropertyValue",
        name: `${CATEGORY_NAMES_EN[item.name] || item.name} export count`,
        unitText: "products",
        value: item.value,
      })),
      observation: categoryStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="exported-products-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
