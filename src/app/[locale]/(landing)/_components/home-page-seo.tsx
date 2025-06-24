import Script from "next/script";

interface HomePageSEOProps {
  municipalityName: string;
  municipalityNameEn: string;
  districtName: string;
  provinceName: string;
  provinceNumber: number;
  demographicData?: {
    totalPopulation?: number | null;
    totalHouseholds?: number | null;
    areaSqKm?: string | null;
    populationDensity?: string | null;
    populationMale?: number | null;
    populationFemale?: number | null;
    sexRatio?: string | null;
    literacyRateAbove15?: string | null;
    growthRate?: string | null;
    populationAbsenteeTotal?: number | null;
    averageHouseholdSize?: string | null;
  } | null;
}

export default function HomePageSEO({
  municipalityName,
  municipalityNameEn,
  districtName,
  provinceName,
  provinceNumber,
  demographicData,
}: HomePageSEOProps) {
  // Extract data with fallbacks for structured data
  const totalPopulation = demographicData?.totalPopulation || 0;
  const totalHouseholds = demographicData?.totalHouseholds || 0;
  const areaSqKm = demographicData?.areaSqKm || "124.38";
  const malePopulation = demographicData?.populationMale || 0;
  const femalePopulation = demographicData?.populationFemale || 0;
  const absenteePopulation = demographicData?.populationAbsenteeTotal || 0;
  const literacyRate = demographicData?.literacyRateAbove15 || "0";
  const sexRatio = demographicData?.sexRatio || "100";
  const growthRate = demographicData?.growthRate || "0";
  const populationDensity = demographicData?.populationDensity || "0";
  const averageHouseholdSize = demographicData?.averageHouseholdSize || "4.4";

  // Create LocalGovernment structured data
  const localGovernmentData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: municipalityName,
    alternateName: municipalityNameEn,
    description: `${municipalityName} (${municipalityNameEn}) ${districtName} जिल्लामा अवस्थित एक स्थानीय सरकार हो। यहाँ ${totalPopulation.toLocaleString()} जनसंख्या र ${totalHouseholds.toLocaleString()} घरधुरी छन्।`,
    url: "https://digital.gadhawamun.gov.np",
    logo: "https://digital.gadhawamun.gov.np/images/municipality-logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "गढवा",
      addressRegion: provinceName,
      addressCountry: "नेपाल",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-000000000",
      contactType: "customer service",
      email: "info@digital.gadhawamun.gov.np",
    },
    sameAs: [
      "https://www.facebook.com/gadhawaruralmun/",
      "https://twitter.com/gadhawarural",
      "https://www.youtube.com/channel/gadhawaruralmun",
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: municipalityNameEn,
      containedIn: {
        "@type": "AdministrativeArea",
        name: districtName,
        containedIn: {
          "@type": "AdministrativeArea",
          name: provinceName,
        },
      },
    },
  };

  // Create Dataset structured data for demographic information
  const demographicDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${municipalityName} जनसांख्यिकीय तथ्याङ्क`,
    description: `${municipalityName}को प्रमुख जनसांख्यिकीय तथ्याङ्क, जनगणना अनुसार`,
    url: "https://digital.gadhawamun.gov.np/profile/demographics",
    keywords: [
      "गढवा गाउँपालिका जनसंख्या",
      "Khajura Rural Municipality demographics",
      "गढवा जनगणना",
      "दाङ जनसंख्या",
      "नेपालको जनसंख्या",
    ],
    creator: {
      "@type": "Organization",
      name: municipalityName,
      url: "https://digital.gadhawamun.gov.np",
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "नेपाल जनगणना",
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl: "https://digital.gadhawamun.gov.np/data/demographics.csv",
      encodingFormat: "CSV",
    },
    temporalCoverage: "2021/2023",
    spatialCoverage: {
      "@type": "Place",
      name: `${municipalityNameEn}, ${districtName}, Nepal`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.1356",
        longitude: "81.6314",
      },
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "कुल जनसंख्या",
        value: totalPopulation,
      },
      {
        "@type": "PropertyValue",
        name: "कुल घरधुरी",
        value: totalHouseholds,
      },
      {
        "@type": "PropertyValue",
        name: "क्षेत्रफल",
        value: areaSqKm,
        unitText: "square kilometers",
      },
      {
        "@type": "PropertyValue",
        name: "पुरुष जनसंख्या",
        value: malePopulation,
      },
      {
        "@type": "PropertyValue",
        name: "महिला जनसंख्या",
        value: femalePopulation,
      },
      {
        "@type": "PropertyValue",
        name: "प्रवासी जनसंख्या",
        value: absenteePopulation,
      },
      {
        "@type": "PropertyValue",
        name: "लैङ्गिक अनुपात",
        value: sexRatio,
      },
      {
        "@type": "PropertyValue",
        name: "साक्षरता दर",
        value: literacyRate,
        unitText: "percentage",
      },
      {
        "@type": "PropertyValue",
        name: "जनघनत्व",
        value: populationDensity,
        unitText: "people per square kilometer",
      },
      {
        "@type": "PropertyValue",
        name: "जनसंख्या वृद्धि दर",
        value: growthRate,
        unitText: "percentage",
      },
      {
        "@type": "PropertyValue",
        name: "औसत घरधुरी आकार",
        value: averageHouseholdSize,
        unitText: "people",
      },
    ],
  };

  // Create Place structured data
  const placeData = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: municipalityName,
    alternateName: municipalityNameEn,
    description: `${municipalityName} (${municipalityNameEn}) ${districtName} जिल्लामा अवस्थित एक स्थानीय तह हो।`,
    hasMap: "https://digital.gadhawamun.gov.np/map",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.1356",
      longitude: "81.6314",
      addressCountry: "Nepal",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: districtName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: provinceName,
      },
    },
    photo: "https://digital.gadhawamun.gov.np/images/municipality-photo.jpg",
  };

  // Create WebSite structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${municipalityName} अधिकारिक वेबसाइट`,
    alternateName: `${municipalityNameEn} Official Website`,
    url: "https://digital.gadhawamun.gov.np",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://digital.gadhawamun.gov.np/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["ne-NP", "en-US"],
  };

  // Create breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "मुख्य पृष्ठ",
        item: "https://digital.gadhawamun.gov.np",
      },
    ],
  };

  return (
    <>
      <Script
        id="municipality-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localGovernmentData),
        }}
      />
      <Script
        id="demographic-data-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(demographicDataset),
        }}
      />
      <Script
        id="place-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeData),
        }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
    </>
  );
}
