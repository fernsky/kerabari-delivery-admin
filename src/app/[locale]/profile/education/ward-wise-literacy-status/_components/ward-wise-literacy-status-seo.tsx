import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseLiteracyStatusSEOProps {
  wardWiseLiteracyStatusData: any[];
  totalPopulation: number;
  bothReadingWritingTotal: number;
  readingOnlyTotal: number;
  illiterateTotal: number;
  bothReadingWritingPercentage: number;
  readingOnlyPercentage: number;
  illiteratePercentage: number;
  bestLiteracyWard: any;
  worstLiteracyWard: any;
  LITERACY_STATUS_TYPES: {
    BOTH_READING_AND_WRITING: { name: string; nameEn: string; color: string };
    READING_ONLY: { name: string; nameEn: string; color: string };
    ILLITERATE: { name: string; nameEn: string; color: string };
  };
  wardNumbers: number[];
}

export default function WardWiseLiteracyStatusSEO({
  wardWiseLiteracyStatusData,
  totalPopulation,
  bothReadingWritingTotal,
  readingOnlyTotal,
  illiterateTotal,
  bothReadingWritingPercentage,
  readingOnlyPercentage,
  illiteratePercentage,
  bestLiteracyWard,
  worstLiteracyWard,
  LITERACY_STATUS_TYPES,
  wardNumbers,
}: WardWiseLiteracyStatusSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise literacy status to structured data format
    const literacyStats = wardNumbers
      .map((wardNumber) => {
        const wardData = wardWiseLiteracyStatusData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardPopulation = wardData.reduce(
          (sum, item) => sum + item.population,
          0,
        );
        const bothReadingWriting =
          wardData.find(
            (item) => item.literacyType === "BOTH_READING_AND_WRITING",
          )?.population || 0;
        const bothReadingWritingPercent =
          totalWardPopulation > 0
            ? ((bothReadingWriting / totalWardPopulation) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Literacy Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Literacy rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(bothReadingWritingPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${bothReadingWriting.toLocaleString()} people (${bothReadingWritingPercent}%) can read and write out of a total of ${totalWardPopulation.toLocaleString()} people.`,
        };
      })
      .filter(Boolean);

    // Calculate literacy rate (people who can read and write + read only)
    const literacyRate = (
      bothReadingWritingPercentage + readingOnlyPercentage
    ).toFixed(2);

    // Calculate literacy index (0-100)
    const literacyIndex =
      (bothReadingWritingPercentage * 1.0 +
        readingOnlyPercentage * 0.5 +
        illiteratePercentage * 0.0) /
      100;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Literacy Status Distribution in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of literacy status across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()}. ${bothReadingWritingTotal.toLocaleString()} people (${bothReadingWritingPercentage.toFixed(2)}%) can both read and write, while ${illiterateTotal.toLocaleString()} people (${illiteratePercentage.toFixed(2)}%) are illiterate. The best literacy is in Ward ${bestLiteracyWard?.wardNumber || ""} with ${bestLiteracyWard?.bothReadingWritingPercent.toFixed(2) || ""}% of people who can read and write.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Literacy status",
        "Literacy rate",
        "Illiteracy rate",
        "Ward-wise literacy status",
        "Rural literacy",
        "Nepal literacy",
        "Reading and writing skills",
        "Education status",
        "Literacy distribution",
        "Literacy index",
      ],
      url: "https://digital.khajuramun.gov.np/profile/education/ward-wise-literacy-status",
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
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "People who can both read and write",
          unitText: "people",
          value: bothReadingWritingTotal,
        },
        {
          "@type": "PropertyValue",
          name: "People who can read only",
          unitText: "people",
          value: readingOnlyTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Illiterate people",
          unitText: "people",
          value: illiterateTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Literacy Rate",
          unitText: "percentage",
          value: parseFloat(literacyRate),
        },
        {
          "@type": "PropertyValue",
          name: "Literacy Index",
          unitText: "index",
          value: literacyIndex.toFixed(2),
        },
      ],
      observation: literacyStats,
      about: [
        {
          "@type": "Thing",
          name: "Literacy",
          description: "Ability to read and write in a language",
        },
        {
          "@type": "Thing",
          name: "Education Status",
          description:
            "Measure of educational achievement and literacy in a population",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Literacy Survey",
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
        id="literacy-status-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
