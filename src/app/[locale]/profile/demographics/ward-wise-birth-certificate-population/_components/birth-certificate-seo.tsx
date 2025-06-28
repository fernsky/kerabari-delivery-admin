import Script from "next/script";

interface BirthCertificateSEOProps {
  birthCertificateData: Array<{
    id?: string;
    wardNumber: number;
    birthCertificateStatus: string;
    population: number;
    malePopulation?: number | null;
    femalePopulation?: number | null;
    otherPopulation?: number | null;
  }>;
  totalWithCertificate: number;
  totalWithoutCertificate: number;
  totalPopulation: number;
  wardNumbers: number[];
}

export default function BirthCertificateSEO({
  birthCertificateData,
  totalWithCertificate,
  totalWithoutCertificate,
  totalPopulation,
  wardNumbers,
}: BirthCertificateSEOProps) {
  const generateStructuredData = () => {
    type WardSummary = {
      wardNumber: number;
      withCertificate: number;
      withoutCertificate: number;
      total: number;
      coverageRate: string;
    };

    type WardDataMap = {
      [key: number]: WardSummary;
    };

    // Group data by ward number
    const wardDataMap: WardDataMap = {};
    birthCertificateData.forEach((item) => {
      if (!wardDataMap[item.wardNumber]) {
        wardDataMap[item.wardNumber] = {
          wardNumber: item.wardNumber,
          withCertificate: 0,
          withoutCertificate: 0,
          total: 0,
          coverageRate: "0",
        };
      }

      if (item.birthCertificateStatus === "With") {
        wardDataMap[item.wardNumber].withCertificate = item.population;
      } else if (item.birthCertificateStatus === "Without") {
        wardDataMap[item.wardNumber].withoutCertificate = item.population;
      }
    });

    // Calculate totals and coverage rates
    Object.values(wardDataMap).forEach((ward) => {
      ward.total = ward.withCertificate + ward.withoutCertificate;
      ward.coverageRate =
        ward.total > 0
          ? ((ward.withCertificate / ward.total) * 100).toFixed(2)
          : "0";
    });

    const wardSummaries = Object.values(wardDataMap);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Birth Certificate Status for Children Under 5 Years in Khajura Rural Municipality",
      description: `Ward-wise distribution of birth certificate status for children under 5 years in Khajura Rural Municipality. Total children: ${totalPopulation}, with certificates: ${totalWithCertificate}, without certificates: ${totalWithoutCertificate}`,
      url: "https://buddhashanti.gov.np/profile/demographics/ward-wise-birth-certificate-population",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Khajura",
          addressRegion: "Lumbini Province",
          addressCountry: "NP",
        },
      },
      temporalCoverage: "2024",
      variableMeasured: [
        "Birth Certificate Status",
        "Children Under 5 Years",
        "Ward-wise Distribution",
      ],
      keywords: [
        "birth certificate",
        "children under 5",
        "ward-wise data",
        "Khajura Rural Municipality",
        "demographics",
        "birth registration",
      ],
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl:
            "https://buddhashanti.gov.np/api/profile/demographics/ward-wise-birth-certificate-population",
        },
      ],
      hasPart: wardSummaries.map((ward) => ({
        "@type": "Dataset",
        name: `Ward ${ward.wardNumber} Birth Certificate Data`,
        description: `Birth certificate status for children under 5 in Ward ${ward.wardNumber}. Total: ${ward.total}, with certificates: ${ward.withCertificate}, without certificates: ${ward.withoutCertificate}, coverage rate: ${ward.coverageRate}%`,
        variableMeasured: [
          "Birth Certificate Status",
          "Children Under 5 Years",
        ],
        spatialCoverage: {
          "@type": "Place",
          name: `Ward ${ward.wardNumber}, Khajura Rural Municipality`,
        },
      })),
      mainEntity: {
        "@type": "StatisticalPopulation",
        name: "Children Under 5 Years in Khajura Rural Municipality",
        populationType: "Children under 5 years",
        numConstraints: totalPopulation,
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "With Birth Certificate",
            value: totalWithCertificate,
            unitCode: "C62",
          },
          {
            "@type": "PropertyValue",
            name: "Without Birth Certificate",
            value: totalWithoutCertificate,
            unitCode: "C62",
          },
          {
            "@type": "PropertyValue",
            name: "Coverage Rate",
            value:
              totalPopulation > 0
                ? ((totalWithCertificate / totalPopulation) * 100).toFixed(2)
                : "0",
            unitCode: "P1",
          },
        ],
      },
    };
  };

  return (
    <>
      <Script
        id="birth-certificate-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />
    </>
  );
}
