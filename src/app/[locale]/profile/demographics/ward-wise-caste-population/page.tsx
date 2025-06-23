import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import CasteCharts from "./_components/caste-charts";
import CasteAnalysisSection from "./_components/caste-analysis-section";
import CasteSEO from "./_components/caste-seo";
import { localizeNumber } from "@/lib/utils/localize-number";

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
    const casteData =
      await api.profile.demographics.wardWiseCastePopulation.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = casteData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by caste type and calculate totals
    const casteCounts: Record<string, number> = {};
    casteData.forEach((item) => {
      if (!casteCounts[item.casteType]) casteCounts[item.casteType] = 0;
      casteCounts[item.casteType] += item.population || 0;
    });

    // Get top 3 castes for keywords
    const topCastes = Object.entries(casteCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Define caste names in both languages
    const CASTE_NAMES_NP: Record<string, string> = {
      BRAHMIN_HILL: "पहाडी ब्राह्मण",
      CHHETRI: "क्षेत्री",
      THAKURI: "ठकुरी",
      SANYASI_DASNAMI: "संन्यासी/दशनामी",
      BRAHMIN_TARAI: "मधेशी ब्राह्मण",
      RAJPUT: "राजपुत",
      KAYASTHA: "कायस्थ",
      BANIYA: "बनिया",
      NEWAR: "नेवार",
      GURUNG: "गुरुङ",
      KAMI: "कामी",
      DAMAI: "दमाई",
      MAGAR: "मगर",
      TAMANG: "तामाङ",
      RAI: "राई",
      LIMBU: "लिम्बु",
      SHERPA: "शेर्पा",
      THAKALI: "थकाली",
      THARU: "थारू",
      MAJHI: "माझी",
      DALIT_HILL: "पहाडी दलित",
      DALIT_TARAI: "मधेशी दलित",
      MUSLIM: "मुस्लिम",
      MADHESI: "मधेशी जाति",
      YADAV: "यादव",
      TELI: "तेली",
      KOIRI: "कोइरी",
      KURMI: "कुर्मी",
      MARWADI: "मारवाडी",
      BANGALI: "बंगाली",
      OTHER: "अन्य",
    };

    const CASTE_NAMES_EN: Record<string, string> = {
      BRAHMIN_HILL: "Hill Brahmin",
      CHHETRI: "Chhetri",
      THAKURI: "Thakuri",
      SANYASI_DASNAMI: "Sanyasi/Dasnami",
      BRAHMIN_TARAI: "Madhesi Brahmin",
      RAJPUT: "Rajput",
      KAYASTHA: "Kayastha",
      BANIYA: "Baniya",
      NEWAR: "Newar",
      GURUNG: "Gurung",
      KAMI: "Kami",
      DAMAI: "Damai",
      MAGAR: "Magar",
      TAMANG: "Tamang",
      RAI: "Rai",
      LIMBU: "Limbu",
      SHERPA: "Sherpa",
      THAKALI: "Thakali",
      THARU: "Tharu",
      MAJHI: "Majhi",
      DALIT_HILL: "Hill Dalit",
      DALIT_TARAI: "Madhesi Dalit",
      MUSLIM: "Muslim",
      MADHESI: "Madhesi",
      YADAV: "Yadav",
      TELI: "Teli",
      KOIRI: "Koiri",
      KURMI: "Kurmi",
      MARWADI: "Marwadi",
      BANGALI: "Bengali",
      OTHER: "Other",
    };

    // Create rich keywords with actual data using localized numbers
    const keywordsNP = [
      "गढवा गाउँपालिका जातिगत जनसंख्या",
      "गढवा जातिगत विविधता",
      `गढवा ${CASTE_NAMES_NP[topCastes[0]]} जनसंख्या`,
      ...topCastes.map((c) => `${CASTE_NAMES_NP[c]} जातिगत विवरण गढवा`),
      "वडा अनुसार जातिगत जनसंख्या",
      "जातिगत विविधता तथ्याङ्क",
      "जातिगत जनगणना गढवा",
      `गढवा कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality caste population",
      "Khajura caste diversity",
      `Khajura ${CASTE_NAMES_EN[topCastes[0]]} population`,
      ...topCastes.map((c) => `${CASTE_NAMES_EN[c]} population in Khajura`),
      "Ward-wise caste demographics",
      "Caste diversity statistics",
      "Caste census Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data using localized numbers
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार जातिगत जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${CASTE_NAMES_NP[topCastes[0]]} (${localizeNumber(casteCounts[topCastes[0]].toString(), "ne")}) सबैभन्दा ठूलो जातिगत समूह हो, त्यसपछि ${CASTE_NAMES_NP[topCastes[1]]} (${localizeNumber(casteCounts[topCastes[1]].toString(), "ne")}) र ${CASTE_NAMES_NP[topCastes[2]]} (${localizeNumber(casteCounts[topCastes[2]].toString(), "ne")})। विभिन्न जातिहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise caste population distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${CASTE_NAMES_EN[topCastes[0]]} (${casteCounts[topCastes[0]]}) is the largest caste group, followed by ${CASTE_NAMES_EN[topCastes[1]]} (${casteCounts[topCastes[1]]}) and ${CASTE_NAMES_EN[topCastes[2]]} (${casteCounts[topCastes[2]]})। Detailed statistics and visualizations of various castes.`;

    return {
      title: "गढवा गाउँपालिका | जाति अनुसार जनसंख्या | डिजिटल प्रोफाइल",
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-caste-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-caste-population",
          ne: "/ne/profile/demographics/ward-wise-caste-population",
        },
      },
      openGraph: {
        title: `गढवा गाउँपालिका | जाति अनुसार जनसंख्या`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `गढवा गाउँपालिका डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `गढवा गाउँपालिका | जाति अनुसार जनसंख्या`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "गढवा गाउँपालिका | जाति अनुसार जनसंख्या | डिजिटल प्रोफाइल",
      description:
        "गढवा गाउँपालिकाको प्रत्येक वडाको जातिगत विवरण, जातिहरूको संख्या र जातिगत विविधताको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "जाति अनुसार जनसंख्या", slug: "caste-distribution" },
  { level: 2, text: "वडा अनुसार जातिगत विविधता", slug: "ward-wise-caste" },
  { level: 2, text: "प्रमुख जातिहरूको विश्लेषण", slug: "major-castes" },
];

// Define Nepali names for castes (getting from procedure's CasteTypes)
const CASTE_NAMES = {
  BRAHMIN_HILL: "पहाडी ब्राह्मण",
  CHHETRI: "क्षेत्री",
  THAKURI: "ठकुरी",
  SANYASI_DASNAMI: "संन्यासी/दशनामी",
  BRAHMIN_TARAI: "मधेशी ब्राह्मण",
  RAJPUT: "राजपुत",
  KAYASTHA: "कायस्थ",
  BANIYA: "बनिया",
  NEWAR: "नेवार",
  GURUNG: "गुरुङ",
  KAMI: "कामी",
  DAMAI: "दमाई",
  MAGAR: "मगर",
  TAMANG: "तामाङ",
  RAI: "राई",
  LIMBU: "लिम्बु",
  SHERPA: "शेर्पा",
  THAKALI: "थकाली",
  THARU: "थारू",
  MAJHI: "माझी",
  DALIT_HILL: "पहाडी दलित",
  DALIT_TARAI: "मधेशी दलित",
  MUSLIM: "मुस्लिम",
  MADHESI: "मधेशी जाति",
  YADAV: "यादव",
  TELI: "तेली",
  KOIRI: "कोइरी",
  KURMI: "कुर्मी",
  MARWADI: "मारवाडी",
  BANGALI: "बंगाली",
  OTHER: "अन्य",
};

export default async function WardWiseCastePopulationPage() {
  // Fetch all caste population data from your tRPC route
  const casteData =
    await api.profile.demographics.wardWiseCastePopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseCastePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    casteData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.casteType]) acc[item.casteType] = 0;
      acc[item.casteType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([casteType, population]) => ({
      casteType,
      casteTypeDisplay:
        CASTE_NAMES[casteType as keyof typeof CASTE_NAMES] || casteType,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 castes for pie chart, group others
  const topCastes = overallSummary.slice(0, 10);
  const otherCastes = overallSummary.slice(10);

  const otherTotalPopulation = otherCastes.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topCastes.map((item) => ({
    name: item.casteTypeDisplay,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 castes
  if (otherCastes.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(casteData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process data for ward-wise visualization (top 5 castes per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = casteData.filter((item) => item.wardNumber === wardNumber);

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 castes for this ward
    const topWardCastes = wardData.slice(0, 5);
    const otherWardCastes = wardData.slice(5);
    const otherWardTotal = otherWardCastes.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = {
      ward: `वडा ${localizeNumber(wardNumber.toString(), "ne")}`,
    };

    // Add top castes
    topWardCastes.forEach((item) => {
      result[item.casteTypeDisplay || item.casteType] = item.population;
    });

    // Add "Other" category if needed
    if (otherWardCastes.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <CasteSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        CASTE_NAMES={CASTE_NAMES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/caste-diversity.svg"
              width={1200}
              height={400}
              alt="जातिगत विविधता - गढवा गाउँपालिका (Caste Diversity - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              <span className="font-bold">गढवा गाउँपालिका</span> | जाति
              अनुसार जनसंख्या विश्लेषण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा <strong>गढवा गाउँपालिका</strong>को विभिन्न वडाहरूमा
              बसोबास गर्ने विभिन्न जातिहरूको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क
              प्रस्तुत गरिएको छ। यो तथ्याङ्कले जातिगत विविधता, सामाजिक संरचना र
              स्थानीय समुदायको जातिगत स्वरूपलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              नेपाल विभिन्न जातजाति र समुदायहरूको सद्भाव र सहिष्णुताको देश हो, र
              <strong>गढवा गाउँपालिका</strong>मा पनि विभिन्न जातजातिहरूको
              बसोबास रहेको छ। कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये{" "}
              {overallSummary[0]?.casteTypeDisplay || ""} जाति{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेको छ। यस तथ्याङ्कले सामाजिक समावेशिता, विविधता व्यवस्थापन र
              विकासका योजनाहरूमा सहयोग पुर्‍याउँछ।
            </p>

            <h2 id="caste-distribution" className="scroll-m-20 border-b pb-2">
              जाति अनुसार जनसंख्या
            </h2>
            <p>
              <strong>गढवा गाउँपालिका</strong>मा विभिन्न जातिहरूको कुल
              जनसंख्या वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <CasteCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            //@ts-ignore
            casteData={casteData}
            CASTE_NAMES={CASTE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-castes" className="scroll-m-20 border-b pb-2">
              प्रमुख जातिहरूको विश्लेषण
            </h2>
            <p>
              <strong>गढवा गाउँपालिका</strong>मा निम्न जातिहरू प्रमुख रूपमा
              बसोबास गर्छन्। यी जातिहरूमध्ये{" "}
              {overallSummary[0]?.casteTypeDisplay || ""}
              सबैभन्दा धेरै व्यक्तिहरू भएको जाति हो, जसमा कुल जनसंख्याको{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % जनसंख्या रहेको छ।
            </p>

            {/* Client component for caste analysis section */}
            <CasteAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              CASTE_NAMES={CASTE_NAMES}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
