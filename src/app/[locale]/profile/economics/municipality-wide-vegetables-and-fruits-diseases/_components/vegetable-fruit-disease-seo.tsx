import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VegetableFruitDiseaseSEOProps {
  vegetableFruitSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalVegetableFruits: number;
  totalPests: number;
  totalDiseases: number;
  VEGETABLE_FRUIT_TYPES: Record<string, string>;
  VEGETABLE_FRUIT_TYPES_EN: Record<string, string>;
  mostAffectedVegetableFruit: any;
}

export default function VegetableFruitDiseaseSEO({
  vegetableFruitSummary,
  totalVegetableFruits,
  totalPests,
  totalDiseases,
  VEGETABLE_FRUIT_TYPES,
  VEGETABLE_FRUIT_TYPES_EN,
  mostAffectedVegetableFruit,
}: VegetableFruitDiseaseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert vegetable/fruit disease stats to structured data format
    const vegetableFruitDiseaseStats = vegetableFruitSummary.map((item) => ({
      "@type": "Observation",
      name: `${VEGETABLE_FRUIT_TYPES_EN[item.crop] || item.crop} Diseases and Pests in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${VEGETABLE_FRUIT_TYPES_EN[item.crop] || item.crop} Agricultural Issues`,
        unitText: "count",
      },
      measuredValue: item.totalIssues,
      description: `${item.totalIssues} agricultural issues affecting ${VEGETABLE_FRUIT_TYPES_EN[item.crop] || item.crop} in Khajura Rural Municipality: ${item.diseasesCount} diseases (${item.majorDiseases.slice(0, 3).join(", ")}) and ${item.pestsCount} pests (${item.majorPests.slice(0, 3).join(", ")}). This represents ${((item.totalIssues / (totalPests + totalDiseases)) * 100).toFixed(2)}% of all vegetable/fruit issues in the municipality.`,
    }));

    // Find most problematic vegetable/fruit
    const mostProblematicVegetableFruit = mostAffectedVegetableFruit;
    const mostProblematicVegetableFruitEN = mostProblematicVegetableFruit
      ? VEGETABLE_FRUIT_TYPES_EN[mostProblematicVegetableFruit.crop] ||
        mostProblematicVegetableFruit.crop
      : "";
    const mostProblematicPercentage = mostProblematicVegetableFruit
      ? (
          (mostProblematicVegetableFruit.totalIssues /
            (totalPests + totalDiseases)) *
          100
        ).toFixed(2)
      : "0";

    // Calculate disease vs pest ratio
    const diseaseRatio = totalDiseases / (totalDiseases + totalPests);
    const pestRatio = totalPests / (totalDiseases + totalPests);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Vegetable and Fruit Diseases and Pests in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Comprehensive analysis of vegetable and fruit diseases and pests affecting agriculture in Khajura Rural Municipality. The study covers ${totalVegetableFruits} different vegetable and fruit types with a total of ${totalDiseases + totalPests} identified issues: ${totalDiseases} diseases and ${totalPests} pests. The most affected vegetable/fruit is ${mostProblematicVegetableFruitEN} with ${mostProblematicVegetableFruit?.totalIssues || 0} issues (${mostProblematicPercentage}% of all problems). Disease to pest ratio is ${(diseaseRatio * 100).toFixed(1)}% to ${(pestRatio * 100).toFixed(1)}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Vegetable diseases",
        "Fruit diseases",
        "Agricultural pests",
        "Integrated Pest Management",
        "Vegetable protection",
        "Fruit protection",
        "Agricultural problems Nepal",
        "Municipality-wide vegetable diseases",
        "Tomato diseases pests",
        "Cauliflower diseases pests",
        "Cabbage diseases pests",
        "Potato diseases pests",
        "Mustard diseases pests",
        ...Object.values(VEGETABLE_FRUIT_TYPES_EN).map(
          (name) => `${name} diseases pests`,
        ),
        ...Object.values(VEGETABLE_FRUIT_TYPES).map(
          (name) => `${name} रोग कीट`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
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
        ...vegetableFruitSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${VEGETABLE_FRUIT_TYPES_EN[item.crop] || item.crop} diseases`,
          unitText: "count",
          value: item.diseasesCount,
        })),
        ...vegetableFruitSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${VEGETABLE_FRUIT_TYPES_EN[item.crop] || item.crop} pests`,
          unitText: "count",
          value: item.pestsCount,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Vegetable/Fruit Types Studied",
          unitText: "count",
          value: totalVegetableFruits,
        },
        {
          "@type": "PropertyValue",
          name: "Total Diseases Identified",
          unitText: "count",
          value: totalDiseases,
        },
        {
          "@type": "PropertyValue",
          name: "Total Pests Identified",
          unitText: "count",
          value: totalPests,
        },
        {
          "@type": "PropertyValue",
          name: "Disease to Pest Ratio",
          unitText: "percentage",
          value: diseaseRatio * 100,
        },
      ],
      observation: vegetableFruitDiseaseStats,
      about: [
        {
          "@type": "Thing",
          name: "Vegetable Protection",
          description:
            "Practices and methods used to protect vegetables from diseases, pests, and other harmful factors",
        },
        {
          "@type": "Thing",
          name: "Fruit Protection",
          description:
            "Practices and methods used to protect fruits from diseases, pests, and other harmful factors",
        },
        {
          "@type": "Thing",
          name: "Integrated Pest Management",
          description:
            "Sustainable approach to managing pests by combining biological, cultural, physical and chemical tools",
        },
        {
          "@type": "Thing",
          name: "Agricultural Sustainability",
          description:
            "Farming practices that meet current food needs without compromising future generations",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Agricultural Data Collection",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Khajura Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Khajura",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="vegetable-fruit-disease-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
