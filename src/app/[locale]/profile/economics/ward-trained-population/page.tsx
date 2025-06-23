import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import TrainedPopulationCharts from "./_components/trained-population-charts";
import TrainedPopulationAnalysisSection from "./_components/trained-population-analysis-section";
import TrainedPopulationSEO from "./_components/trained-population-seo";
import { api } from "@/trpc/server";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const trainedPopulationData =
      await api.profile.economics.wardWiseTrainedPopulation.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = trainedPopulationData.reduce(
      (sum, item) => sum + (item.trainedPopulation || 0),
      0,
    );

    // Get ward with highest trained population
    const highestTrainedWard = [...trainedPopulationData]
      .sort((a, b) => (b.trainedPopulation || 0) - (a.trainedPopulation || 0))
      .at(0);

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका तालिम प्राप्त जनसंख्या",
      "गढवा सीप विकास",
      "गढवा तालिम प्राप्त जनशक्ति",
      "वडा अनुसार तालिम प्राप्त जनसंख्या",
      "व्यावसायिक तालिम तथ्याङ्क",
      "सीप विकास सर्वेक्षण गढवा",
      `गढवा तालिम प्राप्त जनसंख्या ${totalPopulation}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality trained population",
      "Khajura skill development",
      "Khajura trained workforce",
      "Ward-wise trained population",
      "Vocational training statistics",
      "Skill development survey Khajura",
      `Khajura total trained population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार तालिम प्राप्त जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल तालिम प्राप्त जनसंख्या ${totalPopulation} रहेको छ, जसमध्ये वडा नं. ${highestTrainedWard?.wardNumber || ""} मा सबैभन्दा धेरै ${highestTrainedWard?.trainedPopulation || 0} जना रहेका छन्। विभिन्न वडाहरूको तालिम प्राप्त जनसंख्याको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise trained population distribution, trends and analysis for Khajura Rural Municipality. Out of a total trained population of ${totalPopulation}, Ward No. ${highestTrainedWard?.wardNumber || ""} has the highest with ${highestTrainedWard?.trainedPopulation || 0} people. Detailed statistics and visualizations of trained population across various wards.`;

    return {
      title: `तालिम प्राप्त जनसंख्या | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-trained-population",
        languages: {
          en: "/en/profile/economics/ward-trained-population",
          ne: "/ne/profile/economics/ward-trained-population",
        },
      },
      openGraph: {
        title: `तालिम प्राप्त जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `तालिम प्राप्त जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "तालिम प्राप्त जनसंख्या | पालिका प्रोफाइल",
      description:
        "वडा अनुसार तालिम प्राप्त जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न वडाहरूको तालिम प्राप्त जनसंख्याको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "तालिम प्राप्त जनसंख्या", slug: "trained-population" },
  {
    level: 2,
    text: "वडा अनुसार तालिम प्राप्त जनसंख्या",
    slug: "ward-wise-trained-population",
  },
  { level: 2, text: "विश्लेषण तथा निष्कर्ष", slug: "analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardTrainedPopulationPage() {
  // Fetch all trained population data using tRPC
  const trainedPopulationData =
    await api.profile.economics.wardWiseTrainedPopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseTrainedPopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Sort data by ward number for consistency
  const sortedData = [...trainedPopulationData].sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Calculate total trained population
  const totalTrainedPopulation = sortedData.reduce(
    (sum, item) => sum + (item.trainedPopulation || 0),
    0,
  );

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(sortedData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Prepare data for charts
  const barChartData = sortedData.map((item) => ({
    ward: `वडा ${item.wardNumber}`,
    trainedPopulation: item.trainedPopulation,
  }));

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <TrainedPopulationSEO
        trainedPopulationData={sortedData}
        totalTrainedPopulation={totalTrainedPopulation}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/trained-population.svg"
              width={1200}
              height={400}
              alt="तालिम प्राप्त जनसंख्या - गढवा गाउँपालिका (Trained Population - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा तालिम प्राप्त जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा रहेका तालिम
              प्राप्त जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले स्थानीय सीप विकास, व्यावसायिक तालिम र रोजगार क्षमताको
              अवस्थालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {totalTrainedPopulation.toLocaleString()} व्यक्तिले विभिन्न
              प्रकारका तालिमहरू प्राप्त गरेका छन्। यी तालिमहरूमा व्यावसायिक सीप,
              प्राविधिक ज्ञान, कृषि, र अन्य क्षेत्रसँग सम्बन्धित विषयहरू समावेश
              छन्। यस तथ्याङ्कले स्थानीय रोजगारी सृजना, आर्थिक विकास र सीप
              विकासका कार्यक्रम तय गर्न महत्वपूर्ण सूचना प्रदान गर्दछ।
            </p>

            <h2 id="trained-population" className="scroll-m-20 border-b pb-2">
              तालिम प्राप्त जनसंख्या
            </h2>
            <p>
              गढवा गाउँपालिकाको वडागत रूपमा तालिम प्राप्त गरेका व्यक्तिहरूको
              विवरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <TrainedPopulationCharts
            trainedPopulationData={sortedData}
            barChartData={barChartData}
            wardNumbers={wardNumbers}
            totalTrainedPopulation={totalTrainedPopulation}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="analysis" className="scroll-m-20 border-b pb-2">
              विश्लेषण तथा निष्कर्ष
            </h2>
            <p>
              गढवा गाउँपालिकाको वडागत रूपमा तालिम प्राप्त जनसंख्याको
              विश्लेषण गर्दा विभिन्न प्रवृत्तिहरू देखिएका छन्। कुल तालिम प्राप्त
              जनसंख्या {totalTrainedPopulation.toLocaleString()} मध्ये विभिन्न
              वडाहरूको वितरणमा केही भिन्नता पाइएको छ।
            </p>

            {/* Client component for trained population analysis section */}
            <TrainedPopulationAnalysisSection
              trainedPopulationData={sortedData}
              totalTrainedPopulation={totalTrainedPopulation}
              wardNumbers={wardNumbers}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              गढवा गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी
              तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>स्थानीय सीप विकास र तालिम कार्यक्रम तयार गर्न</li>
              <li>रोजगारी सृजना र आर्थिक विकासका योजना बनाउन</li>
              <li>तालिमको अवसर न्यायोचित रूपमा वितरण गर्न</li>
              <li>
                सीप र दक्षतामा आधारित स्थानीय उद्यम र उत्पादनलाई प्रोत्साहन गर्न
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
