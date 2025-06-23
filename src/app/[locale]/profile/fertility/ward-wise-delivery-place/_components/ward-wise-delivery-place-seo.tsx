import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseDeliveryPlaceSEOProps {
  deliveryPlaceData: any[];
  totalDeliveries: number;
  deliveryCategoryTotals: Record<string, number>;
  deliveryCategoryPercentages: Record<string, number>;
  bestWard: {
    wardNumber: number;
    percentage: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
  };
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  institutionalDeliveryIndex: number;
}

export default function WardWiseDeliveryPlaceSEO({
  deliveryPlaceData,
  totalDeliveries,
  deliveryCategoryTotals,
  deliveryCategoryPercentages,
  bestWard,
  worstWard,
  DELIVERY_PLACE_CATEGORIES,
  wardNumbers,
  institutionalDeliveryIndex,
}: WardWiseDeliveryPlaceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise delivery place data to structured data format
    const deliveryStats = wardNumbers
      .map((wardNumber) => {
        const wardData = deliveryPlaceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardDeliveries = wardData.reduce(
          (sum, item) => sum + item.population,
          0,
        );

        // Calculate institutional delivery percentage for this ward
        const institutionalCategories = [
          "GOVERNMENTAL_HEALTH_INSTITUTION",
          "PRIVATE_HEALTH_INSTITUTION",
        ];
        const institutionalDeliveries = wardData
          .filter((item) =>
            institutionalCategories.includes(item.deliveryPlace),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const institutionalPercent =
          totalWardDeliveries > 0
            ? ((institutionalDeliveries / totalWardDeliveries) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Childbirth Location Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Institutional delivery rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(institutionalPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${institutionalDeliveries.toLocaleString()} deliveries (${institutionalPercent}%) occurred in health institutions out of a total of ${totalWardDeliveries.toLocaleString()} deliveries.`,
        };
      })
      .filter(Boolean);

    // Calculate institutional delivery percentage
    const institutionalTotal =
      deliveryCategoryTotals.GOVERNMENTAL_HEALTH_INSTITUTION +
      deliveryCategoryTotals.PRIVATE_HEALTH_INSTITUTION;
    const institutionalPercentage = (
      (institutionalTotal / totalDeliveries) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Childbirth Locations in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of childbirth locations across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalDeliveries.toLocaleString()} deliveries. ${institutionalTotal.toLocaleString()} deliveries (${institutionalPercentage}%) occurred in health institutions. The best institutional delivery rate is in Ward ${bestWard?.wardNumber || ""} with ${bestWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Institutional delivery",
        "Home delivery",
        "Childbirth locations",
        "Ward-wise delivery statistics",
        "Maternal health",
        "Nepal healthcare",
        "Safe delivery",
        "Health facility delivery",
        "Rural healthcare",
      ],
      url: "https://digital.khajuramun.gov.np/profile/fertility/ward-wise-delivery-place",
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
          name: "Government health institution deliveries",
          unitText: "deliveries",
          value: deliveryCategoryTotals.GOVERNMENTAL_HEALTH_INSTITUTION,
        },
        {
          "@type": "PropertyValue",
          name: "Private health institution deliveries",
          unitText: "deliveries",
          value: deliveryCategoryTotals.PRIVATE_HEALTH_INSTITUTION,
        },
        {
          "@type": "PropertyValue",
          name: "Home deliveries",
          unitText: "deliveries",
          value: deliveryCategoryTotals.HOUSE,
        },
        {
          "@type": "PropertyValue",
          name: "Other location deliveries",
          unitText: "deliveries",
          value: deliveryCategoryTotals.OTHER,
        },
        {
          "@type": "PropertyValue",
          name: "Institutional Delivery Rate",
          unitText: "percentage",
          value: parseFloat(institutionalPercentage),
        },
        {
          "@type": "PropertyValue",
          name: "Institutional Delivery Index",
          unitText: "index",
          value: institutionalDeliveryIndex.toFixed(2),
        },
      ],
      observation: deliveryStats,
      about: [
        {
          "@type": "Thing",
          name: "Maternal Health",
          description: "Childbirth location analysis",
        },
        {
          "@type": "Thing",
          name: "Delivery Places",
          description: "Analysis of where women give birth in the municipality",
        },
      ],
      isBasedOn: {
        "@type": "Dataset",
        name: "Municipality Health Survey",
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
        id="delivery-place-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
