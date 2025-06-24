import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CropDiseaseSEOProps {
  cropSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalCrops: number;
  totalPests: number;
  totalDiseases: number;
  CROP_TYPES: Record<string, string>;
  CROP_TYPES_EN: Record<string, string>;
  mostAffectedCrop: any;
}

export default function CropDiseaseSEO({
  cropSummary,
  totalCrops,
  totalPests,
  totalDiseases,
  CROP_TYPES,
  CROP_TYPES_EN,
  mostAffectedCrop,
}: CropDiseaseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert crop disease stats to structured data format
    const cropDiseaseStats = cropSummary.map((item) => ({
      "@type": "Observation",
      name: `${CROP_TYPES_EN[item.crop] || item.crop} Diseases and Pests in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${CROP_TYPES_EN[item.crop] || item.crop} Agricultural Issues`,
        unitText: "count",
      },
      measuredValue: item.totalIssues,
      description: `${item.totalIssues} agricultural issues affecting ${CROP_TYPES_EN[item.crop] || item.crop} in Khajura Rural Municipality: ${item.diseasesCount} diseases (${item.majorDiseases.slice(0, 3).join(", ")}) and ${item.pestsCount} pests (${item.majorPests.slice(0, 3).join(", ")}). This represents ${((item.totalIssues / (totalPests + totalDiseases)) * 100).toFixed(2)}% of all crop issues in the municipality.`,
    }));

    // Find most problematic crop
    const mostProblematicCrop = mostAffectedCrop;
    const mostProblematicCropEN = mostProblematicCrop
      ? CROP_TYPES_EN[mostProblematicCrop.crop] || mostProblematicCrop.crop
      : "";
    const mostProblematicPercentage = mostProblematicCrop
      ? (
          (mostProblematicCrop.totalIssues / (totalPests + totalDiseases)) *
          100
        ).toFixed(2)
      : "0";

    // Calculate disease vs pest ratio
    const diseaseRatio = totalDiseases / (totalDiseases + totalPests);
    const pestRatio = totalPests / (totalDiseases + totalPests);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Crop Diseases and Pests in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Comprehensive analysis of crop diseases and pests affecting agriculture in Khajura Rural Municipality. The study covers ${totalCrops} different crop types with a total of ${totalDiseases + totalPests} identified issues: ${totalDiseases} diseases and ${totalPests} pests. The most affected crop is ${mostProblematicCropEN} with ${mostProblematicCrop?.totalIssues || 0} issues (${mostProblematicPercentage}% of all problems). Disease to pest ratio is ${(diseaseRatio * 100).toFixed(1)}% to ${(pestRatio * 100).toFixed(1)}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Crop diseases",
        "Agricultural pests",
        "Integrated Pest Management",
        "Crop protection",
        "Agricultural problems Nepal",
        "Municipality-wide crop diseases",
        "Rice diseases pests",
        "Wheat diseases pests",
        "Corn diseases pests",
        "Vegetable diseases pests",
        "Fruit diseases pests",
        ...Object.values(CROP_TYPES_EN).map((name) => `${name} diseases pests`),
        ...Object.values(CROP_TYPES).map((name) => `${name} रोग कीट`),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/municipality-wide-crop-diseases",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.gadhawamun.gov.np",
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
        ...cropSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${CROP_TYPES_EN[item.crop] || item.crop} diseases`,
          unitText: "count",
          value: item.diseasesCount,
        })),
        ...cropSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${CROP_TYPES_EN[item.crop] || item.crop} pests`,
          unitText: "count",
          value: item.pestsCount,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Crop Types Studied",
          unitText: "count",
          value: totalCrops,
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
      observation: cropDiseaseStats,
      about: [
        {
          "@type": "Thing",
          name: "Integrated Pest Management",
          description:
            "Sustainable approach to managing pests by combining biological, cultural, physical and chemical tools",
        },
        {
          "@type": "Thing",
          name: "Crop Protection",
          description:
            "Practices and methods used to protect crops from diseases, pests, and other harmful factors",
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
        id="crop-disease-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
