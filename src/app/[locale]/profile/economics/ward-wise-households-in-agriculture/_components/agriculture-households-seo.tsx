import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgricultureHouseholdsSEOProps {
  agricultureHouseholdsData: any[];
  totalHouseholds: number;
  totalInvolved: number;
  totalNonInvolved: number;
  involvedPercentage: number;
  nonInvolvedPercentage: number;
  highestInvolvementWard: any;
  lowestInvolvementWard: any;
  AGRICULTURE_STATUS: {
    INVOLVED: { name: string; nameEn: string; color: string };
    NOT_INVOLVED: { name: string; nameEn: string; color: string };
  };
  wardNumbers: number[];
}

export default function AgricultureHouseholdsSEO({
  agricultureHouseholdsData,
  totalHouseholds,
  totalInvolved,
  totalNonInvolved,
  involvedPercentage,
  nonInvolvedPercentage,
  highestInvolvementWard,
  lowestInvolvementWard,
  AGRICULTURE_STATUS,
  wardNumbers,
}: AgricultureHouseholdsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise agriculture household stats to structured data format
    const agricultureHouseholdStats = wardNumbers
      .map((wardNumber) => {
        const wardData = agricultureHouseholdsData.find(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData) return null;

        const total =
          wardData.involvedInAgriculture + wardData.nonInvolvedInAgriculture;
        const involvedPercentage =
          total > 0
            ? ((wardData.involvedInAgriculture / total) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Agriculture Households in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Agricultural involvement rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(involvedPercentage),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${wardData.involvedInAgriculture.toLocaleString()} households (${involvedPercentage}%) are involved in agriculture or animal husbandry out of a total of ${total.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Agricultural Households Distribution in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Distribution of households involved in agriculture or animal husbandry across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${totalInvolved.toLocaleString()} households (${involvedPercentage.toFixed(2)}%) are involved in agriculture or animal husbandry. The highest agricultural involvement is in Ward ${highestInvolvementWard?.wardNumber || ""} with ${highestInvolvementWard?.involvedPercentage.toFixed(2) || ""}% involvement rate.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Agricultural households",
        "Farming families",
        "Animal husbandry",
        "Ward-wise agricultural data",
        "Nepal agricultural demographics",
        "Rural economy statistics",
        "Agricultural involvement",
        "Non-agricultural households",
        "Khajura farming statistics",
        "Ward-wise farming distribution",
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/ward-wise-households-in-agriculture",
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
        {
          "@type": "PropertyValue",
          name: "Households Involved in Agriculture",
          unitText: "households",
          value: totalInvolved,
        },
        {
          "@type": "PropertyValue",
          name: "Households Not Involved in Agriculture",
          unitText: "households",
          value: totalNonInvolved,
        },
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Agricultural Involvement Rate",
          unitText: "percentage",
          value: involvedPercentage,
        },
      ],
      observation: agricultureHouseholdStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="agriculture-households-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
