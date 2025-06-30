import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import AgricultureHouseholdsCharts from "./_components/agriculture-households-charts";
import AgricultureHouseholdsAnalysisSection from "./_components/agriculture-households-analysis-section";
import AgricultureHouseholdsSEO from "./_components/agriculture-households-seo";

const AGRICULTURE_STATUS = {
  INVOLVED: {
    name: "कृषि वा पशुपालनमा आबद्ध",
    nameEn: "Involved in Agriculture",
    color: "#27AE60", // Green
  },
  NOT_INVOLVED: {
    name: "कृषि वा पशुपालनमा आबद्ध नभएको",
    nameEn: "Not Involved in Agriculture",
    color: "#E74C3C", // Red
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
    const agricultureHouseholdsData =
      await api.profile.economics.wardWiseHouseholdsInAgriculture.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Calculate summary statistics
    let totalHouseholds = 0;
    let totalInvolved = 0;
    let totalNonInvolved = 0;

    agricultureHouseholdsData.forEach((ward) => {
      totalInvolved += ward.involvedInAgriculture;
      totalNonInvolved += ward.nonInvolvedInAgriculture;
    });

    totalHouseholds = totalInvolved + totalNonInvolved;
    const involvedPercentage =
      totalHouseholds > 0
        ? ((totalInvolved / totalHouseholds) * 100).toFixed(2)
        : "0";
    const nonInvolvedPercentage =
      totalHouseholds > 0
        ? ((totalNonInvolved / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Find ward with highest agriculture involvement
    const wardsWithPercentage = agricultureHouseholdsData.map((ward) => {
      const total = ward.involvedInAgriculture + ward.nonInvolvedInAgriculture;
      const percentage =
        total > 0
          ? ((ward.involvedInAgriculture / total) * 100).toFixed(2)
          : "0";
      return { ...ward, percentage: parseFloat(percentage) };
    });

    const highestInvolvementWard = [...wardsWithPercentage].sort(
      (a, b) => b.percentage - a.percentage,
    )[0];

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका कृषि परिवार",
      "केराबारी कृषि पशुपालन घरधुरी",
      "वडा अनुसार कृषि परिवार",
      "कृषि पशुपालनमा संलग्न परिवार",
      "कृषि जनसंख्या वितरण",
      `केराबारी कृषि परिवार संख्या ${localizeNumber(totalInvolved.toString(), "ne")}`,
      "केराबारी गैरकृषि परिवार संख्या",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality agriculture households",
      "Khajura farming animal husbandry families",
      "Ward-wise agriculture households",
      "Households involved in farming",
      "Agricultural population distribution",
      `Khajura agriculture households ${totalInvolved}`,
      "Khajura non-agricultural families",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(involvedPercentage, "ne")}% (${localizeNumber(totalInvolved.toString(), "ne")}) परिवार कृषि वा पशुपालनमा आबद्ध रहेका छन्। सबैभन्दा बढी वडा ${localizeNumber(highestInvolvementWard?.wardNumber.toString() || "", "ne")} मा ${localizeNumber(highestInvolvementWard?.percentage.toFixed(2) || "", "ne")}% कृषि परिवार रहेका छन्।`;

    const descriptionEN = `Ward-wise distribution and analysis of households involved in agriculture or animal husbandry in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${involvedPercentage}% (${totalInvolved}) families are involved in agriculture or animal husbandry. Ward ${highestInvolvementWard?.wardNumber || ""} has the highest percentage of agricultural households at ${highestInvolvementWard?.percentage.toFixed(2) || ""}%.`;

    return {
      title: `कृषि वा पशुपालनमा आबद्ध घरपरिवार | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-households-in-agriculture",
        languages: {
          en: "/en/profile/economics/ward-wise-households-in-agriculture",
          ne: "/ne/profile/economics/ward-wise-households-in-agriculture",
        },
      },
      openGraph: {
        title: `कृषि वा पशुपालनमा आबद्ध घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `कृषि वा पशुपालनमा आबद्ध घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "कृषि वा पशुपालनमा आबद्ध घरपरिवार | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण",
    slug: "distribution-of-agricultural-households",
  },
  {
    level: 2,
    text: "वडा अनुसार कृषि आबद्धता",
    slug: "ward-wise-agriculture-involvement",
  },
  {
    level: 2,
    text: "कृषि आबद्धता विश्लेषण",
    slug: "agriculture-involvement-analysis",
  },
  {
    level: 2,
    text: "कृषि विकासका सम्भावनाहरू",
    slug: "agriculture-development-opportunities",
  },
];

export default async function WardWiseHouseholdsInAgriculturePage() {
  // Fetch all agriculture households data using tRPC
  const agricultureHouseholdsData =
    await api.profile.economics.wardWiseHouseholdsInAgriculture.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdsInAgriculture.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total households and percentages
  let totalHouseholds = 0;
  let totalInvolved = 0;
  let totalNonInvolved = 0;

  agricultureHouseholdsData.forEach((ward) => {
    totalInvolved += ward.involvedInAgriculture;
    totalNonInvolved += ward.nonInvolvedInAgriculture;
  });

  totalHouseholds = totalInvolved + totalNonInvolved;
  const involvedPercentage =
    totalHouseholds > 0
      ? ((totalInvolved / totalHouseholds) * 100).toFixed(2)
      : "0";
  const nonInvolvedPercentage =
    totalHouseholds > 0
      ? ((totalNonInvolved / totalHouseholds) * 100).toFixed(2)
      : "0";

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(agricultureHouseholdsData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for pie chart
  const pieChartData = [
    {
      name: AGRICULTURE_STATUS.INVOLVED.name,
      value: totalInvolved,
      percentage: involvedPercentage,
      color: AGRICULTURE_STATUS.INVOLVED.color,
    },
    {
      name: AGRICULTURE_STATUS.NOT_INVOLVED.name,
      value: totalNonInvolved,
      percentage: nonInvolvedPercentage,
      color: AGRICULTURE_STATUS.NOT_INVOLVED.color,
    },
  ];

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = agricultureHouseholdsData.find(
        (item) => item.wardNumber === wardNumber,
      );

      if (!wardData) return null;

      const total =
        wardData.involvedInAgriculture + wardData.nonInvolvedInAgriculture;
      const involvedPercent =
        total > 0
          ? ((wardData.involvedInAgriculture / total) * 100).toFixed(2)
          : "0";
      const nonInvolvedPercent =
        total > 0
          ? ((wardData.nonInvolvedInAgriculture / total) * 100).toFixed(2)
          : "0";

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        [AGRICULTURE_STATUS.INVOLVED.name]: wardData.involvedInAgriculture,
        [AGRICULTURE_STATUS.NOT_INVOLVED.name]:
          wardData.nonInvolvedInAgriculture,
        total,
        involvedPercent: parseFloat(involvedPercent),
        nonInvolvedPercent: parseFloat(nonInvolvedPercent),
      };
    })
    .filter(Boolean);

  // Calculate ward-wise agriculture involvement rates
  const wardWiseAnalysis = wardWiseData
    .map((ward) => {
      return {
        wardNumber: ward?.wardNumber || 0,
        totalHouseholds: ward?.total || 0,
        involvedHouseholds: ward?.[AGRICULTURE_STATUS.INVOLVED.name] || 0,
        nonInvolvedHouseholds:
          ward?.[AGRICULTURE_STATUS.NOT_INVOLVED.name] || 0,
        involvedPercentage: ward?.involvedPercent || 0,
        nonInvolvedPercentage: ward?.nonInvolvedPercent || 0,
      };
    })
    .sort((a, b) => b.involvedPercentage - a.involvedPercentage);

  // Find wards with highest and lowest agriculture involvement
  const highestInvolvementWard = wardWiseAnalysis[0];
  const lowestInvolvementWard = [...wardWiseAnalysis].sort(
    (a, b) => a.involvedPercentage - b.involvedPercentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <AgricultureHouseholdsSEO
        agricultureHouseholdsData={agricultureHouseholdsData}
        totalHouseholds={totalHouseholds}
        totalInvolved={totalInvolved}
        totalNonInvolved={totalNonInvolved}
        involvedPercentage={parseFloat(involvedPercentage)}
        nonInvolvedPercentage={parseFloat(nonInvolvedPercentage)}
        highestInvolvementWard={highestInvolvementWard}
        lowestInvolvementWard={lowestInvolvementWard}
        AGRICULTURE_STATUS={AGRICULTURE_STATUS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/agriculture-households.svg"
              width={1200}
              height={400}
              alt="कृषि वा पशुपालनमा आबद्ध घरपरिवार - केराबारी गाउँपालिका (Households Involved in Agriculture - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              कृषि नेपालको अर्थतन्त्रको मेरुदण्ड हो र केराबारी गाउँपालिकामा
              पनि यसको महत्वपूर्ण भूमिका रहेको छ। यस खण्डमा गाउँपालिकाको वडा
              अनुसार कृषि वा पशुपालनमा आबद्ध घरपरिवारको विश्लेषण प्रस्तुत गरिएको
              छ, जसले यस क्षेत्रमा कृषि तथा पशुपालनको वर्तमान अवस्था र भविष्यको
              विकासको लागि योजना तर्जुमा गर्न मद्दत पुर्याउँछ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}{" "}
              घरपरिवारमध्ये
              {localizeNumber(involvedPercentage, "ne")}% अर्थात{" "}
              {localizeNumber(totalInvolved.toLocaleString(), "ne")}
              घरपरिवार कृषि वा पशुपालनमा आबद्ध रहेका छन् भने{" "}
              {localizeNumber(nonInvolvedPercentage, "ne")}% अर्थात
              {localizeNumber(totalNonInvolved.toLocaleString(), "ne")} घरपरिवार
              कृषि वा पशुपालनमा आबद्ध छैनन्। यसबाट पालिकाको आर्थिक अवस्था र
              भविष्यको विकासका लागि कृषि क्षेत्रको महत्व र सम्भावनाको अनुमान
              गर्न सकिन्छ।
            </p>

            <h2
              id="distribution-of-agricultural-households"
              className="scroll-m-20 border-b pb-2"
            >
              कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा कृषि वा पशुपालनमा आबद्ध र आबद्ध नभएका
              घरपरिवारको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <AgricultureHouseholdsCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            totalInvolved={totalInvolved}
            totalNonInvolved={totalNonInvolved}
            involvedPercentage={parseFloat(involvedPercentage)}
            nonInvolvedPercentage={parseFloat(nonInvolvedPercentage)}
            wardWiseAnalysis={wardWiseAnalysis}
            highestInvolvementWard={highestInvolvementWard}
            lowestInvolvementWard={lowestInvolvementWard}
            AGRICULTURE_STATUS={AGRICULTURE_STATUS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="agriculture-involvement-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              कृषि आबद्धता विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा कृषि वा पशुपालनमा आबद्ध घरपरिवारको
              विश्लेषण गर्दा, समग्रमा
              {localizeNumber(involvedPercentage, "ne")}% घरपरिवारहरू कृषि वा
              पशुपालनमा आबद्ध रहेको पाइन्छ। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(
                highestInvolvementWard.wardNumber.toString(),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                highestInvolvementWard.involvedPercentage.toFixed(2),
                "ne",
              )}
              % घरपरिवारहरू कृषि वा पशुपालनमा आबद्ध रहेका छन्।
            </p>

            <AgricultureHouseholdsAnalysisSection
              totalHouseholds={totalHouseholds}
              totalInvolved={totalInvolved}
              totalNonInvolved={totalNonInvolved}
              involvedPercentage={parseFloat(involvedPercentage)}
              nonInvolvedPercentage={parseFloat(nonInvolvedPercentage)}
              wardWiseAnalysis={wardWiseAnalysis}
              highestInvolvementWard={highestInvolvementWard}
              lowestInvolvementWard={lowestInvolvementWard}
              AGRICULTURE_STATUS={AGRICULTURE_STATUS}
            />

            <h2
              id="agriculture-development-opportunities"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              कृषि विकासका सम्भावनाहरू
            </h2>

            <p>
              केराबारी गाउँपालिकामा कृषि वा पशुपालनमा आबद्ध घरपरिवारको
              तथ्याङ्क विश्लेषणबाट निम्न सम्भावनाहरू देखिन्छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>कृषि व्यवसायीकरण:</strong>{" "}
                  {localizeNumber(involvedPercentage, "ne")}% परिवार कृषिमा
                  आबद्ध रहेकोले कृषिलाई थप व्यवसायिक र आधुनिकीकरण गर्न सकिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>पशुपालन प्रवर्द्धन:</strong> पशुपालनको क्षेत्रमा थप
                  लगानी र प्राविधिक सहयोग बढाई यस क्षेत्रलाई रोजगारी र आय
                  आर्जनको प्रमुख माध्यम बनाउन सकिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>वडागत विशिष्टिकरण:</strong> उच्च कृषि आबद्धता भएका
                  वडाहरूमा विशेष कृषि पकेट क्षेत्रहरू स्थापना गरी उत्पादन बढाउन
                  सकिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>गैरकृषि रोजगारी:</strong> कृषि वा पशुपालनमा नआबद्ध
                  घरपरिवारलाई लक्षित गरी गैरकृषि रोजगारीका अवसरहरू वृद्धि गर्न
                  सकिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>कृषि सहकारी प्रवर्द्धन:</strong> कृषि वा पशुपालनमा
                  आबद्ध घरपरिवारहरूलाई सहकारी माध्यमबाट संगठित गरी उत्पादन,
                  बजारीकरण र मूल्य श्रृंखला विकास गर्न सकिने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकामा कृषि वा पशुपालनमा आबद्ध घरपरिवारको
              वितरणको विश्लेषणले पालिकाको दिगो आर्थिक विकासका लागि कृषि
              क्षेत्रको महत्व र सम्भावनालाई उजागर गरेको छ। यसका लागि वडागत
              विशेषताहरूलाई ध्यानमा राखी कृषि विकासका रणनीतिहरू तर्जुमा गर्नु
              आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
