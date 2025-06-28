import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseLiteracyStatusCharts from "./_components/ward-wise-literacy-status-charts";
import WardWiseLiteracyStatusAnalysisSection from "./_components/ward-wise-literacy-status-analysis-section";
import WardWiseLiteracyStatusSEO from "./_components/ward-wise-literacy-status-seo";

const LITERACY_STATUS_TYPES = {
  BOTH_READING_AND_WRITING: {
    name: "पढ्न र लेख्न जान्ने",
    nameEn: "Can both read and write",
    color: "#4285F4", // Blue
  },
  READING_ONLY: {
    name: "पढ्न मात्र जान्ने",
    nameEn: "Can read only",
    color: "#FBBC05", // Yellow
  },
  ILLITERATE: {
    name: "निरक्षर",
    nameEn: "Cannot read or write",
    color: "#EA4335", // Red
  },
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const wardWiseLiteracyStatusData =
      await api.profile.education.wardWiseLiteracyStatus.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseLiteracyStatusData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalPopulation = 0;
    let bothReadingWritingTotal = 0;
    let readingOnlyTotal = 0;
    let illiterateTotal = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        if (item.literacyType === "BOTH_READING_AND_WRITING") {
          bothReadingWritingTotal += item.population;
          totalPopulation += item.population;
        } else if (item.literacyType === "READING_ONLY") {
          readingOnlyTotal += item.population;
          totalPopulation += item.population;
        } else if (item.literacyType === "ILLITERATE") {
          illiterateTotal += item.population;
          totalPopulation += item.population;
        }
      });
    });

    // Calculate percentages for SEO description
    const bothReadingWritingPercentage = (
      (bothReadingWritingTotal / totalPopulation) *
      100
    ).toFixed(2);
    const illiteratePercentage = (
      (illiterateTotal / totalPopulation) *
      100
    ).toFixed(2);

    // Find ward with best literacy rate
    let bestLiteracyWard = "1";
    let bestLiteracyPercentage = 0;
    let worstLiteracyWard = "1";
    let worstLiteracyPercentage = 0;

    Object.entries(wardGroups).forEach(([ward, data]: [string, any]) => {
      const wardTotalPopulation = data.reduce(
        (sum: number, item: any) => sum + item.population,
        0,
      );
      const literatePopulation = data.reduce((sum: number, item: any) => {
        if (
          item.literacyType === "BOTH_READING_AND_WRITING" ||
          item.literacyType === "READING_ONLY"
        ) {
          return sum + item.population;
        }
        return sum;
      }, 0);

      const literacyPercentage =
        (literatePopulation / wardTotalPopulation) * 100;
      const illiteracyPercentage = 100 - literacyPercentage;

      if (literacyPercentage > bestLiteracyPercentage) {
        bestLiteracyPercentage = literacyPercentage;
        bestLiteracyWard = ward;
      }

      if (illiteracyPercentage > worstLiteracyPercentage) {
        worstLiteracyPercentage = illiteracyPercentage;
        worstLiteracyWard = ward;
      }
    });

    // Create rich keywords
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका साक्षरता दर",
      "साक्षरताको अवस्था",
      "वडागत साक्षरता",
      "पढ्न लेख्न जान्ने",
      "शैक्षिक स्थिति",
      `साक्षरता दर ${bothReadingWritingPercentage}%`,
      "साक्षरता विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality literacy rate",
      "Literacy status",
      "Ward-wise literacy",
      "Reading and writing skills",
      "Educational status",
      `Literacy rate ${bothReadingWritingPercentage}%`,
      "Literacy analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्थाको विश्लेषण। कुल ${localizeNumber(totalPopulation.toLocaleString(), "ne")} जनसंख्या मध्ये ${localizeNumber(bothReadingWritingPercentage, "ne")}% (${localizeNumber(bothReadingWritingTotal.toLocaleString(), "ne")}) जना पढ्न र लेख्न जान्दछन्। वडा ${localizeNumber(bestLiteracyWard, "ne")} मा सबैभन्दा राम्रो साक्षरता स्थिति छ, जहाँ ${localizeNumber(bestLiteracyPercentage.toFixed(2), "ne")}% नागरिकहरू साक्षर छन्।`;

    const descriptionEN = `Analysis of literacy status in Khajura Rural Municipality. Out of a total of ${totalPopulation.toLocaleString()} people, ${bothReadingWritingPercentage}% (${bothReadingWritingTotal.toLocaleString()}) can both read and write. Ward ${bestLiteracyWard} has the best literacy status, where ${bestLiteracyPercentage.toFixed(2)}% of citizens are literate.`;

    return {
      title: `साक्षरता स्थिति | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/education/ward-wise-literacy-status",
        languages: {
          en: "/en/profile/education/ward-wise-literacy-status",
          ne: "/ne/profile/education/ward-wise-literacy-status",
        },
      },
      openGraph: {
        title: `साक्षरताको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `साक्षरताको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "साक्षरताको अवस्था | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार साक्षरताको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "साक्षरताको अवस्थाको वितरण",
    slug: "distribution-of-literacy-status",
  },
  {
    level: 2,
    text: "वडा अनुसार साक्षरताको अवस्था",
    slug: "ward-wise-literacy-status",
  },
  { level: 2, text: "साक्षरता विश्लेषण", slug: "literacy-analysis" },
  {
    level: 2,
    text: "साक्षरता प्रवर्द्धन रणनीति",
    slug: "literacy-promotion-strategy",
  },
];

export default async function WardWiseLiteracyStatusPage() {
  // Fetch all ward-wise literacy status data using tRPC
  const wardWiseLiteracyStatusData =
    await api.profile.education.wardWiseLiteracyStatus.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.education.wardWiseLiteracyStatus.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseLiteracyStatusData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Calculate ward totals and grand total
  let totalPopulation = 0;
  let bothReadingWritingTotal = 0;
  let readingOnlyTotal = 0;
  let illiterateTotal = 0;

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      if (item.literacyType === "BOTH_READING_AND_WRITING") {
        bothReadingWritingTotal += item.population;
        totalPopulation += item.population;
      } else if (item.literacyType === "READING_ONLY") {
        readingOnlyTotal += item.population;
        totalPopulation += item.population;
      } else if (item.literacyType === "ILLITERATE") {
        illiterateTotal += item.population;
        totalPopulation += item.population;
      }
    });
  });

  // Calculate percentages
  const bothReadingWritingPercentage = parseFloat(
    ((bothReadingWritingTotal / totalPopulation) * 100).toFixed(2),
  );
  const readingOnlyPercentage = parseFloat(
    ((readingOnlyTotal / totalPopulation) * 100).toFixed(2),
  );
  const illiteratePercentage = parseFloat(
    ((illiterateTotal / totalPopulation) * 100).toFixed(2),
  );

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = [
    {
      name: LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name,
      value: bothReadingWritingTotal,
      percentage: bothReadingWritingPercentage.toFixed(2),
      color: LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color,
    },
    {
      name: LITERACY_STATUS_TYPES.READING_ONLY.name,
      value: readingOnlyTotal,
      percentage: readingOnlyPercentage.toFixed(2),
      color: LITERACY_STATUS_TYPES.READING_ONLY.color,
    },
    {
      name: LITERACY_STATUS_TYPES.ILLITERATE.name,
      value: illiterateTotal,
      percentage: illiteratePercentage.toFixed(2),
      color: LITERACY_STATUS_TYPES.ILLITERATE.color,
    },
  ];

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardPopulation = wardData.reduce(
        (sum: number, item: any) => sum + item.population,
        0,
      );
      const bothReadingWriting =
        wardData.find(
          (item: any) => item.literacyType === "BOTH_READING_AND_WRITING",
        )?.population || 0;
      const readingOnly =
        wardData.find((item: any) => item.literacyType === "READING_ONLY")
          ?.population || 0;
      const illiterate =
        wardData.find((item: any) => item.literacyType === "ILLITERATE")
          ?.population || 0;

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        [LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name]:
          bothReadingWriting,
        [LITERACY_STATUS_TYPES.READING_ONLY.name]: readingOnly,
        [LITERACY_STATUS_TYPES.ILLITERATE.name]: illiterate,
        total: totalWardPopulation,
        bothReadingWritingPercent:
          totalWardPopulation > 0
            ? (bothReadingWriting / totalWardPopulation) * 100
            : 0,
        readingOnlyPercent:
          totalWardPopulation > 0
            ? (readingOnly / totalWardPopulation) * 100
            : 0,
        illiteratePercent:
          totalWardPopulation > 0
            ? (illiterate / totalWardPopulation) * 100
            : 0,
      };
    })
    .filter(Boolean);

  // Calculate ward-wise literacy status analysis
  const wardWiseAnalysis = wardWiseData
    .map((ward: any) => {
      return {
        wardNumber: ward?.wardNumber || 0,
        totalPopulation: ward?.total || 0,
        bothReadingWritingPopulation:
          ward?.[LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name] || 0,
        readingOnlyPopulation:
          ward?.[LITERACY_STATUS_TYPES.READING_ONLY.name] || 0,
        illiteratePopulation:
          ward?.[LITERACY_STATUS_TYPES.ILLITERATE.name] || 0,
        bothReadingWritingPercent: ward?.bothReadingWritingPercent || 0,
        readingOnlyPercent: ward?.readingOnlyPercent || 0,
        illiteratePercent: ward?.illiteratePercent || 0,
        literacyPercent:
          (ward?.bothReadingWritingPercent || 0) +
          (ward?.readingOnlyPercent || 0),
      };
    })
    .sort((a, b) => b.literacyPercent - a.literacyPercent);

  // Find wards with best and worst literacy rates
  const bestLiteracyWard = wardWiseAnalysis[0];
  const worstLiteracyWard = [...wardWiseAnalysis].sort(
    (a, b) => b.illiteratePercent - a.illiteratePercent,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseLiteracyStatusSEO
        wardWiseLiteracyStatusData={wardWiseLiteracyStatusData}
        totalPopulation={totalPopulation}
        bothReadingWritingTotal={bothReadingWritingTotal}
        readingOnlyTotal={readingOnlyTotal}
        illiterateTotal={illiterateTotal}
        bothReadingWritingPercentage={bothReadingWritingPercentage}
        readingOnlyPercentage={readingOnlyPercentage}
        illiteratePercentage={illiteratePercentage}
        bestLiteracyWard={bestLiteracyWard}
        worstLiteracyWard={worstLiteracyWard}
        LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/literacy-status.svg"
              width={1200}
              height={400}
              alt="साक्षरताको अवस्था - बुद्धशान्ति गाउँपालिका (Literacy Status - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              साक्षरता एक आधारभूत मानव अधिकार हो र यो व्यक्तिगत, सामाजिक र
              आर्थिक विकासको महत्वपूर्ण आधारशिला हो। यसले नागरिकको जीवनस्तरमा
              सुधार ल्याउनुका साथै राष्ट्रिय विकासमा पनि प्रत्यक्ष योगदान
              पुर्‍याउँछ। यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा
              नागरिकहरूको साक्षरताको अवस्थाको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा कुल{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}{" "}
              जनसंख्यामध्ये
              {localizeNumber(bothReadingWritingPercentage.toFixed(2), "ne")}%
              अर्थात्{" "}
              {localizeNumber(bothReadingWritingTotal.toLocaleString(), "ne")}
              जनाले पढ्न र लेख्न जान्दछन्,{" "}
              {localizeNumber(readingOnlyPercentage.toFixed(2), "ne")}% अर्थात्{" "}
              {localizeNumber(readingOnlyTotal.toLocaleString(), "ne")} जनाले
              पढ्न मात्र जान्दछन्, र
              {localizeNumber(illiteratePercentage.toFixed(2), "ne")}% अर्थात्{" "}
              {localizeNumber(illiterateTotal.toLocaleString(), "ne")}
              जना निरक्षर रहेका छन्।
            </p>

            <h2
              id="distribution-of-literacy-status"
              className="scroll-m-20 border-b pb-2"
            >
              साक्षरताको अवस्थाको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्थाको वितरण निम्नानुसार
              रहेको छ:
            </p>
          </div>

          <WardWiseLiteracyStatusCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalPopulation={totalPopulation}
            bothReadingWritingTotal={bothReadingWritingTotal}
            readingOnlyTotal={readingOnlyTotal}
            illiterateTotal={illiterateTotal}
            bothReadingWritingPercentage={bothReadingWritingPercentage}
            readingOnlyPercentage={readingOnlyPercentage}
            illiteratePercentage={illiteratePercentage}
            wardWiseAnalysis={wardWiseAnalysis}
            bestLiteracyWard={bestLiteracyWard}
            worstLiteracyWard={worstLiteracyWard}
            LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="literacy-analysis" className="scroll-m-20 border-b pb-2">
              साक्षरता विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्थाको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                (bothReadingWritingPercentage + readingOnlyPercentage).toFixed(
                  2,
                ),
                "ne",
              )}
              % जनसंख्या साक्षर रहेका छन्, जसमध्ये{" "}
              {localizeNumber(bothReadingWritingPercentage.toFixed(2), "ne")}%
              ले पढ्न र लेख्न जान्दछन्। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestLiteracyWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो साक्षरता दर{" "}
              {localizeNumber(
                bestLiteracyWard.literacyPercent.toFixed(2),
                "ne",
              )}
              % रहेको छ।
            </p>

            <WardWiseLiteracyStatusAnalysisSection
              totalPopulation={totalPopulation}
              bothReadingWritingTotal={bothReadingWritingTotal}
              readingOnlyTotal={readingOnlyTotal}
              illiterateTotal={illiterateTotal}
              bothReadingWritingPercentage={bothReadingWritingPercentage}
              readingOnlyPercentage={readingOnlyPercentage}
              illiteratePercentage={illiteratePercentage}
              wardWiseAnalysis={wardWiseAnalysis}
              bestLiteracyWard={bestLiteracyWard}
              worstLiteracyWard={worstLiteracyWard}
              LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
            />

            <h2
              id="literacy-promotion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              साक्षरता प्रवर्द्धन रणनीति
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्थाको तथ्याङ्क विश्लेषणबाट
              निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>साक्षरता अभियान सञ्चालन:</strong>{" "}
                  {localizeNumber(illiteratePercentage.toFixed(2), "ne")}%
                  जनसंख्या अझै पनि निरक्षर रहेकाले त्यस्ता क्षेत्रमा वृहत
                  साक्षरता अभियान सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्रौढ शिक्षा कार्यक्रम:</strong> विशेषगरी वडा{" "}
                  {localizeNumber(
                    worstLiteracyWard.wardNumber.toString(),
                    "ne",
                  )}{" "}
                  जस्ता निरक्षरता दर बढी भएका क्षेत्रमा प्रौढ शिक्षा
                  केन्द्रहरूको स्थापना र सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>विद्यालय भर्ना अभियान:</strong> बालबालिकाहरूलाई
                  विद्यालय भर्ना गर्न प्रोत्साहन गर्ने र विद्यालय छाड्ने दरलाई
                  न्यूनीकरण गर्ने रणनीतिहरू अवलम्बन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>गुणस्तरीय शिक्षा:</strong> विद्यालयहरूमा पठनपाठनको
                  गुणस्तर सुधार गरी विद्यार्थीहरूमा पढ्ने र लेख्ने क्षमताको
                  प्रभावकारी विकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक शिक्षा:</strong> साक्षरता सँगै प्राविधिक सीप
                  विकासका कार्यक्रमहरू सञ्चालन गर्ने, जसले आर्थिक आत्मनिर्भरतामा
                  सहयोग पुर्‍याउँछ।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा साक्षरताको अवस्थाको विश्लेषणले
              पालिकामा शैक्षिक विकासको अवस्था र भविष्यको शैक्षिक नीति निर्माणमा
              महत्वपूर्ण भूमिका खेल्दछ। यसका लागि वडागत विशेषताहरूलाई ध्यानमा
              राखी शिक्षा क्षेत्रको विस्तारका कार्यक्रमहरू तर्जुमा गर्नु आवश्यक
              देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
