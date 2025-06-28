import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import HouseheadGenderCharts from "./_components/househead-gender-charts";
import GenderSEO from "./_components/gender-seo";
import GenderAnalysisSection from "./_components/gender-analysis-section";
import { api } from "@/trpc/server";

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
    const genderData =
      await api.profile.demographics.wardWiseHouseHeadGender.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = genderData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by gender and calculate totals
    const genderCounts: Record<string, number> = {};
    genderData.forEach((item) => {
      if (!genderCounts[item.gender]) genderCounts[item.gender] = 0;
      genderCounts[item.gender] += item.population || 0;
    });

    // Create rich keywords with actual data using localized numbers
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका घरमूली लिङ्ग वितरण",
      "बुद्धशान्ति वडागत घरमूली विश्लेषण",
      "घरमूली महिला पुरुष अनुपात बुद्धशान्ति",
      "वडा अनुसार घरमूली संख्या",
      "घरमूली लैङ्गिक विविधता",
      `बुद्धशान्ति कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    // Create detailed description with actual data using localized numbers
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार घरमूली लिङ्ग वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये पुरुष घरमूली ${localizeNumber(genderCounts["MALE"]?.toString() || "0", "ne")} र महिला घरमूली ${localizeNumber(genderCounts["FEMALE"]?.toString() || "0", "ne")} रहेका छन्। विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    return {
      title: `बुद्धशान्ति गाउँपालिका | वडागत घरमूली लिङ्ग वितरण | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: keywordsNP,
      alternates: {
        canonical: "/profile/demographics/ward-wise-househead-gender",
        languages: {
          en: "/en/profile/demographics/ward-wise-househead-gender",
          ne: "/ne/profile/demographics/ward-wise-househead-gender",
        },
      },
      openGraph: {
        title: `बुद्धशान्ति गाउँपालिका | वडागत घरमूली लिङ्ग वितरण`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `बुद्धशान्ति गाउँपालिका | वडागत घरमूली लिङ्ग वितरण`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "बुद्धशान्ति गाउँपालिका | वडागत घरमूली लिङ्ग वितरण | डिजिटल प्रोफाइल",
      description:
        "बुद्धशान्ति गाउँपालिकाको वडागत घरमूली लिङ्ग वितरण, प्रवृत्ति र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "घरमूली लिङ्ग अनुसार जनसंख्या",
    slug: "gender-distribution",
  },
  { level: 2, text: "वडागत विश्लेषण", slug: "ward-analysis" },
];

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardWiseHouseheadGenderPage() {
  // Fetch all househead gender data using tRPC
  const genderData =
    await api.profile.demographics.wardWiseHouseHeadGender.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseHouseHeadGender.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    genderData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.gender]) acc[item.gender] = 0;
      acc[item.gender] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([gender, population]) => ({
      gender,
      genderName: GENDER_NAMES[gender] || gender,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(genderData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = genderData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = {
      ward: `वडा ${localizeNumber(wardNumber.toString(), "ne")}`,
    };

    // Add gender data
    wardData.forEach((item) => {
      result[GENDER_NAMES[item.gender] || item.gender] = item.population;
    });

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <GenderSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        GENDER_NAMES={GENDER_NAMES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/househead-gender.svg"
              width={1200}
              height={400}
              alt="घरमूली लिङ्ग वितरण"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">बुद्धशान्ति गाउँपालिकामा</span> वडागत
              घरमूली लिङ्ग वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा <strong>बुद्धशान्ति गाउँपालिका</strong>को विभिन्न
              वडाहरूमा घरमूलीको लिङ्ग अनुसार जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क
              प्रस्तुत गरिएको छ। घरमूली भनेको घरपरिवारको प्रमुख व्यक्ति हो, जसले
              घरायसी निर्णयहरूमा प्रमुख भूमिका निर्वाह गर्दछ।
            </p>
            <p>
              यो तथ्याङ्कले लैङ्गिक समानता, सामाजिक संरचना र परिवारको नेतृत्वमा
              महिला सहभागिताको अवस्था बुझ्न मद्दत गर्दछ। यसले{" "}
              <strong>बुद्धशान्ति गाउँपालिका</strong>लाई लैङ्गिक समानता सम्बन्धी
              नीति तथा कार्यक्रमहरू तर्जुमा गर्न महत्त्वपूर्ण आधार प्रदान गर्दछ।
            </p>

            <h2 id="gender-distribution" className="scroll-m-20 border-b pb-2">
              घरमूली लिङ्ग अनुसार जनसंख्या
            </h2>
          </div>
          <HouseheadGenderCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            genderData={genderData}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-analysis" className="scroll-m-20 border-b pb-2">
              <strong>बुद्धशान्ति गाउँपालिका</strong>को वडागत विश्लेषण
            </h2>
            <p>
              <strong>बुद्धशान्ति गाउँपालिका</strong>को वडा अनुसार घरमूली लिङ्ग
              वितरणको विश्लेषण निम्नानुसार रहेको छ:
            </p>
          </div>

          <GenderAnalysisSection
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            GENDER_NAMES={GENDER_NAMES}
            wardNumbers={wardNumbers}
            genderData={genderData}
          />
        </section>
      </div>
    </DocsLayout>
  );
}
