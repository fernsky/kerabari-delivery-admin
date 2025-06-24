import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SafeMotherhoodIndicatorsSEOProps {
  latestYear: number;
  antenatalData: any[];
  deliveryData: any[];
  postnatalData: any[];
  newbornHealthData: any[];
  trendData: any[];
  maternalHealthIndex: number;
  indicatorLabels: Record<string, string>;
}

export default function SafeMotherhoodIndicatorsSEO({
  latestYear,
  antenatalData,
  deliveryData,
  postnatalData,
  newbornHealthData,
  trendData,
  maternalHealthIndex,
  indicatorLabels,
}: SafeMotherhoodIndicatorsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Find key indicator values for structured data
    const findIndicatorValue = (indicator: string, data: any[]) => {
      const item = data.find((d) => d.indicator === indicator);
      return item ? item.value || 0 : 0;
    };

    const institutionalDeliveries = findIndicatorValue(
      "INSTITUTIONAL_DELIVERIES",
      deliveryData,
    );
    const ancCheckups = findIndicatorValue(
      "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",
      antenatalData,
    );
    const pncVisits = findIndicatorValue(
      "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",
      postnatalData,
    );
    const newbornCare = findIndicatorValue(
      "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",
      newbornHealthData,
    );

    // Convert safe motherhood indicators to structured data format
    const mainIndicatorStats = [
      {
        "@type": "Observation",
        name: "Institutional Delivery Rate in Khajura Rural Municipality",
        observationDate: `${latestYear}`,
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Institutional Delivery Rate",
          unitText: "percentage",
        },
        measuredValue: institutionalDeliveries,
        description: `Institutional delivery rate was ${institutionalDeliveries.toFixed(1)}% in year ${latestYear} in Khajura Rural Municipality.`,
      },
      {
        "@type": "Observation",
        name: "ANC Checkup Protocol Adherence in Khajura Rural Municipality",
        observationDate: `${latestYear}`,
        measuredProperty: {
          "@type": "PropertyValue",
          name: "ANC Checkup Protocol Rate",
          unitText: "percentage",
        },
        measuredValue: ancCheckups,
        description: `Percentage of pregnant women who had four ANC checkups as per protocol was ${ancCheckups.toFixed(1)}% in year ${latestYear} in Khajura Rural Municipality.`,
      },
      {
        "@type": "Observation",
        name: "PNC Home Visits in Khajura Rural Municipality",
        observationDate: `${latestYear}`,
        measuredProperty: {
          "@type": "PropertyValue",
          name: "PNC Home Visits Rate",
          unitText: "percentage",
        },
        measuredValue: pncVisits,
        description: `Percentage of postpartum mothers receiving two PNC home visits was ${pncVisits.toFixed(1)}% in year ${latestYear} in Khajura Rural Municipality.`,
      },
      {
        "@type": "Observation",
        name: "Newborn CHX Application in Khajura Rural Municipality",
        observationDate: `${latestYear}`,
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Newborn CHX Application Rate",
          unitText: "percentage",
        },
        measuredValue: newbornCare,
        description: `Percentage of newborns who had CHX applied immediately after birth was ${newbornCare.toFixed(1)}% in year ${latestYear} in Khajura Rural Municipality.`,
      },
    ];

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Safe Motherhood Indicators in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of safe motherhood services and indicators for year ${latestYear} in Khajura Rural Municipality. Key indicators include institutional delivery rate (${institutionalDeliveries.toFixed(1)}%), ANC checkups as per protocol (${ancCheckups.toFixed(1)}%), PNC home visits (${pncVisits.toFixed(1)}%), and newborn care (${newbornCare.toFixed(1)}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Safe motherhood",
        "Maternal health",
        "Antenatal care",
        "Institutional delivery",
        "Postnatal care",
        "Newborn care",
        "Maternal health indicators",
        "Nepal health services",
        "Rural maternal health",
        "Maternal mortality reduction",
      ],
      url: "https://digital.gadhawamun.gov.np/profile/health/safe-motherhood-indicators",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.gadhawamun.gov.np",
      },
      temporalCoverage: latestYear.toString(),
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
          name: "Institutional Delivery Rate",
          unitText: "percentage",
          value: institutionalDeliveries,
        },
        {
          "@type": "PropertyValue",
          name: "ANC Protocol Adherence",
          unitText: "percentage",
          value: ancCheckups,
        },
        {
          "@type": "PropertyValue",
          name: "PNC Home Visits",
          unitText: "percentage",
          value: pncVisits,
        },
        {
          "@type": "PropertyValue",
          name: "Newborn Care (CHX Application)",
          unitText: "percentage",
          value: newbornCare,
        },
        {
          "@type": "PropertyValue",
          name: "Maternal Health Quality Index",
          unitText: "index",
          value: maternalHealthIndex.toFixed(2),
        },
      ],
      observation: mainIndicatorStats,
      about: [
        {
          "@type": "Thing",
          name: "Healthcare",
          description: "Maternal and child health services",
        },
        {
          "@type": "Thing",
          name: "Maternal Health",
          description: "Safe motherhood and maternal health indicators",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Safe Motherhood Program",
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
        id="safe-motherhood-indicators-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
