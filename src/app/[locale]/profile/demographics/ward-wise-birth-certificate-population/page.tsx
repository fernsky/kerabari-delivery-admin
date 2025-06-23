import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthCertificateCharts from "./_components/birth-certificate-charts";
import BirthCertificateAnalysisSection from "./_components/birth-certificate-analysis-section";
import BirthCertificateSEO from "./_components/birth-certificate-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const birthCertificateData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Try to get summary data
    let totalWithCertificate = 0;
    let totalWithoutCertificate = 0;
    let totalPopulation = 0;

    try {
      const summaryData =
        await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();
      console.log("This is summary data", summaryData);

      if (summaryData && summaryData.statusBreakdown) {
        const withCertStatus = summaryData.statusBreakdown.find(
          (item) => item.birthCertificateStatus === "With",
        );
        const withoutCertStatus = summaryData.statusBreakdown.find(
          (item) => item.birthCertificateStatus === "Without",
        );

        totalWithCertificate = withCertStatus?.totalPopulation || 0;
        totalWithoutCertificate = withoutCertStatus?.totalPopulation || 0;
        totalPopulation =
          summaryData.total?.totalPopulation ||
          totalWithCertificate + totalWithoutCertificate;
      } else {
        // Fallback if summary data structure is different
        totalWithCertificate = 0;
        totalWithoutCertificate = 0;
        totalPopulation = 0;
      }

      console.log(summaryData);
    } catch (error) {
      // Calculate from raw data if summary API fails
      const withEntries = birthCertificateData.filter(
        (item) => item.birthCertificateStatus === "With",
      );
      const withoutEntries = birthCertificateData.filter(
        (item) => item.birthCertificateStatus === "Without",
      );

      totalWithCertificate = withEntries.reduce(
        (sum, item) => sum + (item.population || 0),
        0,
      );
      totalWithoutCertificate = withoutEntries.reduce(
        (sum, item) => sum + (item.population || 0),
        0,
      );
      totalPopulation = totalWithCertificate + totalWithoutCertificate;
    }

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका जन्मदर्ता",
      "पाँच वर्षमुनिका बालबालिका जन्मदर्ता",
      "वडा अनुसार जन्मदर्ता विवरण",
      "बालबालिका जन्मदर्ता विश्लेषण",
      "जन्मदर्ता प्रमाणपत्र धारक बालबालिका",
      `गढवा जन्मदर्ताको स्थिति: जन्मदर्ता भएका ${localizeNumber(totalWithCertificate.toString(), "ne")}, नभएका ${localizeNumber(totalWithoutCertificate.toString(), "ne")}`,
      `गढवा पाँच वर्षमुनिका कुल बालबालिका संख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality birth registration",
      "Children under five birth certificate",
      "Ward-wise birth registration data",
      "Birth certificate analysis",
      "Birth certificate holders in Khajura",
      `Khajura birth registration status: with certificate ${totalWithCertificate}, without certificate ${totalWithoutCertificate}`,
      `Khajura total children under five years: ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र वितरण र विश्लेषण। कुल ${localizeNumber(totalPopulation.toString(), "ne")} बालबालिकामध्ये ${localizeNumber(totalWithCertificate.toString(), "ne")} जनासँग जन्मदर्ता प्रमाणपत्र छ भने ${localizeNumber(totalWithoutCertificate.toString(), "ne")} जनासँग छैन।`;

    const descriptionEN = `Ward-wise distribution and analysis of birth certificate holders among children under five in Khajura Rural Municipality. Out of ${totalPopulation} total children, ${totalWithCertificate} have birth certificates and ${totalWithoutCertificate} do not have birth certificates.`;

    return {
      title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/demographics/ward-wise-birth-certificate-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-birth-certificate-population",
          ne: "/ne/profile/demographics/ward-wise-birth-certificate-population",
        },
      },
      openGraph: {
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "पाँच वर्षमुनिका बालबालिका जन्मदर्ता | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "पाँच वर्षमुनिका बालबालिका जन्मदर्ता",
    slug: "birth-certificate-status",
  },
  {
    level: 2,
    text: "वडा अनुसार जन्मदर्ता वितरण",
    slug: "ward-wise-birth-certificates",
  },
  { level: 2, text: "जन्मदर्ता विश्लेषण", slug: "birth-certificate-analysis" },
];

export default async function WardWiseBirthCertificatePopulationPage() {
  // Fetch all birth certificate data using tRPC
  const birthCertificateData =
    await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  let totalWithCertificate = 0;
  let totalWithoutCertificate = 0;
  let totalPopulation = 0;

  try {
    summaryData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();

    // Extract the summary data based on the statusBreakdown
    if (summaryData && summaryData.statusBreakdown) {
      const withCertStatus = summaryData.statusBreakdown.find(
        (item) => item.birthCertificateStatus === "With",
      );
      const withoutCertStatus = summaryData.statusBreakdown.find(
        (item) => item.birthCertificateStatus === "Without",
      );

      totalWithCertificate = withCertStatus?.totalPopulation || 0;
      totalWithoutCertificate = withoutCertStatus?.totalPopulation || 0;
      totalPopulation =
        summaryData.total?.totalPopulation ||
        totalWithCertificate + totalWithoutCertificate;
    } else {
      // Fallback if summary data structure is different
      totalWithCertificate = 0;
      totalWithoutCertificate = 0;
      totalPopulation = 0;
    }

    console.log(summaryData);
  } catch (error) {
    console.error("Could not fetch summary data", error);
    // Calculate from raw data if summary API fails
    const withEntries = birthCertificateData.filter(
      (item) => item.birthCertificateStatus === "With",
    );
    const withoutEntries = birthCertificateData.filter(
      (item) => item.birthCertificateStatus === "Without",
    );

    totalWithCertificate = withEntries.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );
    totalWithoutCertificate = withoutEntries.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );
    totalPopulation = totalWithCertificate + totalWithoutCertificate;
  }

  // Sort data by ward number for consistent presentation
  const sortedData = [...birthCertificateData].sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(birthCertificateData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Calculate ward-wise analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    // Get all records for this ward
    const wardItems = birthCertificateData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Find the population values based on birthCertificateStatus
    const withEntry = wardItems.find(
      (item) => item.birthCertificateStatus === "With",
    );
    const withoutEntry = wardItems.find(
      (item) => item.birthCertificateStatus === "Without",
    );

    const withCertificate = withEntry ? withEntry.population : 0;
    const withoutCertificate = withoutEntry ? withoutEntry.population : 0;
    const total = withCertificate + withoutCertificate;

    const percentageWithCertificate =
      totalWithCertificate > 0
        ? ((withCertificate / totalWithCertificate) * 100).toFixed(2)
        : "0";

    const percentageOfTotal =
      totalPopulation > 0 ? ((total / totalPopulation) * 100).toFixed(2) : "0";

    const coverageRate =
      total > 0 ? ((withCertificate / total) * 100).toFixed(2) : "0";

    return {
      wardNumber,
      withCertificate,
      withoutCertificate,
      total,
      percentageWithCertificate,
      percentageOfTotal,
      coverageRate,
    };
  });

  // Find wards with highest and lowest birth certificate registration
  const wardsRanked = [...wardWiseAnalysis].sort(
    (a, b) => b.withCertificate - a.withCertificate,
  );

  const highestWard = wardsRanked[0];
  const lowestWard = wardsRanked[wardsRanked.length - 1];

  // Find ward with highest and lowest coverage rate
  const wardsRankedByCoverage = [...wardWiseAnalysis].sort(
    (a, b) => parseFloat(b.coverageRate) - parseFloat(a.coverageRate),
  );

  const highestCoverageWard = wardsRankedByCoverage[0];
  const lowestCoverageWard =
    wardsRankedByCoverage[wardsRankedByCoverage.length - 1];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <BirthCertificateSEO
        birthCertificateData={birthCertificateData}
        totalWithCertificate={totalWithCertificate}
        totalWithoutCertificate={totalWithoutCertificate}
        totalPopulation={totalPopulation}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/birth-certificate.svg"
              width={1200}
              height={400}
              alt="पाँच वर्षमुनिका बालबालिका जन्मदर्ता - गढवा गाउँपालिका (Birth Certificates for Children Under Five - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              जन्मदर्ता प्रमाणपत्र हरेक नागरिकको अधिकार हो र यसले बालबालिकाको
              पहिचान, शिक्षा, स्वास्थ्य सेवा लगायत विभिन्न सरकारी सेवाहरूमा
              पहुँच सुनिश्चित गर्दछ। यस खण्डमा गढवा गाउँपालिकामा रहेका पाँच
              वर्षमुनिका बालबालिकाहरूको जन्मदर्ता स्थिति प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकाभरि पाँच वर्षमुनिका बालबालिकाहरूको कुल संख्या
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} रहेको छ।
              यसमध्ये
              {localizeNumber(totalWithCertificate.toLocaleString(), "ne")} जना
              (
              {localizeNumber(
                ((totalWithCertificate / totalPopulation) * 100).toFixed(2),
                "ne",
              )}
              %) बालबालिकासँग जन्मदर्ता प्रमाणपत्र छ भने{" "}
              {localizeNumber(totalWithoutCertificate.toLocaleString(), "ne")}{" "}
              जना (
              {localizeNumber(
                ((totalWithoutCertificate / totalPopulation) * 100).toFixed(2),
                "ne",
              )}
              %) बालबालिकासँग जन्मदर्ता प्रमाणपत्र छैन।
            </p>

            <h2
              id="birth-certificate-status"
              className="scroll-m-20 border-b pb-2"
            >
              पाँच वर्षमुनिका बालबालिका जन्मदर्ता स्थिति
            </h2>
            <p>
              गढवा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता स्थिति
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <BirthCertificateCharts
            birthCertificateData={sortedData}
            totalWithCertificate={totalWithCertificate}
            totalWithoutCertificate={totalWithoutCertificate}
            totalPopulation={totalPopulation}
            wardNumbers={wardNumbers}
            wardWiseAnalysis={wardWiseAnalysis}
            highestWard={highestWard}
            lowestWard={lowestWard}
            highestCoverageWard={highestCoverageWard}
            lowestCoverageWard={lowestCoverageWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="birth-certificate-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              जन्मदर्ता विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता
              विश्लेषण गर्दा, सबैभन्दा बढी जन्मदर्ता प्रमाणपत्र धारकहरू वडा नं{" "}
              {localizeNumber(highestWard.wardNumber.toString(), "ne")} मा
              {localizeNumber(
                highestWard.withCertificate.toLocaleString(),
                "ne",
              )}{" "}
              जना ({localizeNumber(highestWard.percentageWithCertificate, "ne")}
              %) रहेको पाइन्छ।
            </p>
            <p>
              जन्मदर्ता प्रमाणपत्र कभरेज दर (कुल बालबालिकामा जन्मदर्ता भएकाको
              अनुपात) सबैभन्दा उच्च वडा नं
              {localizeNumber(
                highestCoverageWard.wardNumber.toString(),
                "ne",
              )}{" "}
              मा {localizeNumber(highestCoverageWard.coverageRate, "ne")}% र
              सबैभन्दा कम वडा नं{" "}
              {localizeNumber(lowestCoverageWard.wardNumber.toString(), "ne")}{" "}
              मा
              {localizeNumber(lowestCoverageWard.coverageRate, "ne")}% रहेको छ।
            </p>

            {/* Client component for analysis section */}
            <BirthCertificateAnalysisSection
              wardWiseAnalysis={wardWiseAnalysis}
              totalWithCertificate={totalWithCertificate}
              totalWithoutCertificate={totalWithoutCertificate}
              totalPopulation={totalPopulation}
              highestWard={highestWard}
              lowestWard={lowestWard}
              highestCoverageWard={highestCoverageWard}
              lowestCoverageWard={lowestCoverageWard}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
