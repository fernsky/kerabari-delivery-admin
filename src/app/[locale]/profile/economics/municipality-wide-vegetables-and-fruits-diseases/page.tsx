import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import VegetableFruitDiseaseCharts from "./_components/vegetable-fruit-disease-charts";
import VegetableFruitDiseaseAnalysisSection from "./_components/vegetable-fruit-disease-analysis-section";
import VegetableFruitDiseaseSEO from "./_components/vegetable-fruit-disease-seo";
import { vegetableFruitTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-vegetables-and-fruits-diseases.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Define English names for vegetable/fruit types (for SEO)
const VEGETABLE_FRUIT_TYPES_EN: Record<string, string> = {
  TOMATO: "Tomato",
  CAULIFLOWER: "Cauliflower",
  CABBAGE: "Cabbage",
  POTATO: "Potato",
  MUSTARD: "Mustard",
  OTHER: "Other Vegetables/Fruits",
};

// Define Nepali names for vegetable/fruit types
const VEGETABLE_FRUIT_TYPES: Record<string, string> =
  vegetableFruitTypeOptions.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option.label,
    }),
    {},
  );

// Define colors for vegetable/fruit types
const VEGETABLE_FRUIT_COLORS: Record<string, string> = {
  TOMATO: "#E74C3C", // Red for tomato
  CAULIFLOWER: "#ECF0F1", // White for cauliflower
  CABBAGE: "#27AE60", // Green for cabbage
  POTATO: "#8B4513", // Brown for potato
  MUSTARD: "#F1C40F", // Yellow for mustard
  OTHER: "#95A5A6", // Gray for other
};

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const vegetableFruitDiseaseData =
      await api.profile.economics.municipalityWideVegetablesAndFruitsDiseases.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalVegetableFruits = vegetableFruitDiseaseData.length;
    const vegetableFruitTypes = Array.from(
      new Set(vegetableFruitDiseaseData.map((item) => item.crop)),
    );

    // Find most affected vegetable/fruit (highest number of diseases/pests)
    let mostAffectedVegetableFruit = "";
    let maxIssues = 0;
    vegetableFruitDiseaseData.forEach(
      (item: { crop: string; majorPests: string; majorDiseases: string }) => {
        const pestCount = item.majorPests.split(",").length;
        const diseaseCount = item.majorDiseases.split(",").length;
        const totalIssues = pestCount + diseaseCount;
        if (totalIssues > maxIssues) {
          maxIssues = totalIssues;
          mostAffectedVegetableFruit = item.crop;
        }
      },
    );

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका तरकारी फलफूल रोग कीट",
      "गढवा तरकारी उत्पादन समस्या",
      "पालिका स्तरीय तरकारी संरक्षण",
      "गोलभेडा रोग कीट",
      "काउली रोग कीट",
      "बन्दा रोग कीट",
      "आलु रोग कीट",
      "रायो रोग कीट",
      `गढवा तरकारी संरक्षण ${localizeNumber(totalVegetableFruits.toString(), "ne")} प्रकार`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality vegetables fruits diseases pests",
      "Khajura vegetable production problems",
      "Municipality-wide vegetable protection",
      "Tomato diseases pests",
      "Cauliflower diseases pests",
      "Cabbage diseases pests",
      "Potato diseases pests",
      "Mustard diseases pests",
      `Khajura vegetable protection ${totalVegetableFruits} types`,
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकाको तरकारी र फलफूलमा देखिने रोग र कीटको विश्लेषण। ${localizeNumber(totalVegetableFruits.toString(), "ne")} प्रकारका तरकारी फलफूलमा देखिने प्रमुख रोग र कीटहरूको विस्तृत अध्ययन। सबैभन्दा प्रभावित ${VEGETABLE_FRUIT_TYPES[mostAffectedVegetableFruit] || mostAffectedVegetableFruit} रहेको छ। पालिका स्तरीय तरकारी संरक्षण योजना र रणनीतिको विश्लेषण।`;

    const descriptionEN = `Analysis of diseases and pests affecting vegetables and fruits in Khajura Rural Municipality. Detailed study of major diseases and pests affecting ${totalVegetableFruits} types of vegetables and fruits. Most affected crop is ${VEGETABLE_FRUIT_TYPES_EN[mostAffectedVegetableFruit] || mostAffectedVegetableFruit}. Municipality-wide vegetable and fruit protection planning and strategy analysis.`;

    return {
      title: `तरकारी र फलफूलमा रोग कीटपतंग | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
        languages: {
          en: "/en/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
          ne: "/ne/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
        },
      },
      openGraph: {
        title: `तरकारी र फलफूलमा रोग कीटपतंग | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `तरकारी र फलफूलमा रोग कीटपतंग | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    return {
      title:
        "तरकारी र फलफूलमा रोग कीटपतंग | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "पालिका स्तरीय तरकारी र फलफूलमा रोग कीटपतंगको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख तरकारी रोगहरू", slug: "main-vegetable-diseases" },
  { level: 2, text: "प्रमुख कीटपतंगहरू", slug: "main-pests" },
  { level: 2, text: "रोग र कीट विश्लेषण", slug: "disease-pest-analysis" },
  {
    level: 2,
    text: "तरकारी संरक्षण रणनीति",
    slug: "vegetable-protection-strategy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideVegetablesAndFruitsDiseasesPage() {
  // Fetch all vegetable/fruit disease data using tRPC
  const vegetableFruitDiseaseData =
    await api.profile.economics.municipalityWideVegetablesAndFruitsDiseases.getAll.query();

  // Process data for analysis
  type VegetableFruitDiseaseSummaryType = {
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  };

  const vegetableFruitSummary: VegetableFruitDiseaseSummaryType[] =
    vegetableFruitDiseaseData
      .map(
        (item: { crop: string; majorPests: string; majorDiseases: string }) => {
          const pests = item.majorPests
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
          const diseases = item.majorDiseases
            .split(",")
            .map((d) => d.trim())
            .filter((d) => d.length > 0);

          return {
            crop: item.crop,
            cropName: VEGETABLE_FRUIT_TYPES[item.crop] || item.crop,
            pestsCount: pests.length,
            diseasesCount: diseases.length,
            totalIssues: pests.length + diseases.length,
            majorPests: pests,
            majorDiseases: diseases,
          };
        },
      )
      .sort((a, b) => b.totalIssues - a.totalIssues);

  // Calculate statistics
  const totalVegetableFruits = vegetableFruitSummary.length;
  const totalPests = vegetableFruitSummary.reduce(
    (sum, crop) => sum + crop.pestsCount,
    0,
  );
  const totalDiseases = vegetableFruitSummary.reduce(
    (sum, crop) => sum + crop.diseasesCount,
    0,
  );
  const totalIssues = totalPests + totalDiseases;

  // Find most affected vegetable/fruit
  const mostAffectedVegetableFruit = vegetableFruitSummary[0];
  const avgIssuesPerCrop =
    totalVegetableFruits > 0 ? totalIssues / totalVegetableFruits : 0;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <VegetableFruitDiseaseSEO
        vegetableFruitSummary={vegetableFruitSummary}
        totalVegetableFruits={totalVegetableFruits}
        totalPests={totalPests}
        totalDiseases={totalDiseases}
        VEGETABLE_FRUIT_TYPES={VEGETABLE_FRUIT_TYPES}
        VEGETABLE_FRUIT_TYPES_EN={VEGETABLE_FRUIT_TYPES_EN}
        mostAffectedVegetableFruit={mostAffectedVegetableFruit}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/vegetable-diseases.svg"
              width={1200}
              height={400}
              alt="तरकारी र फलफूलमा रोग कीटपतंग - गढवा गाउँपालिका (Vegetable and Fruit Diseases and Pests - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा तरकारी र फलफूलमा रोग र कीटपतंग
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              तरकारी र फलफूलमा देखिने रोग र कीटपतंग गढवा गाउँपालिकाको कृषि
              उत्पादनमा मुख्य चुनौती हो। यस क्षेत्रमा गोलभेडा, काउली, बन्दा,
              आलु, रायो लगायतका विभिन्न तरकारी र फलफूलहरूमा विभिन्न प्रकारका रोग
              र कीटपतंगहरूको समस्या देखिन्छ। यी समस्याहरूले कृषकहरूको उत्पादन र
              आम्दानीमा प्रत्यक्ष प्रभाव पारिरहेको छ।
            </p>
            <p>
              गढवा गाउँपालिकाको तरकारी र फलफूलमा रोग र कीट सम्बन्धी तथ्याङ्क
              अनुसार, यस क्षेत्रमा कुल{" "}
              {localizeNumber(totalVegetableFruits.toString(), "ne")} प्रकारका
              तरकारी र फलफूलहरूमा
              {localizeNumber(totalIssues.toString(), "ne")} प्रकारका रोग र
              कीटपतंगहरू देखिएका छन्, जसमध्ये{" "}
              {localizeNumber(totalDiseases.toString(), "ne")}
              रोग र {localizeNumber(totalPests.toString(), "ne")} कीटपतंग रहेका
              छन्।
            </p>

            <h2
              id="main-vegetable-diseases"
              className="scroll-m-20 border-b pb-2"
            >
              प्रमुख तरकारी र फलफूल रोगहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा देखिने प्रमुख तरकारी र फलफूल रोगहरू
              निम्नानुसार रहेका छन्:
            </p>

            <ul>
              {vegetableFruitSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.cropName}</strong>:{" "}
                  {item.majorDiseases.join(", ")}(
                  {localizeNumber(item.diseasesCount.toString(), "ne")} प्रकार)
                </li>
              ))}
            </ul>

            <h2 id="main-pests" className="scroll-m-20 border-b pb-2">
              प्रमुख कीटपतंगहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा देखिने प्रमुख कीटपतंगहरू निम्नानुसार रहेका
              छन्:
            </p>

            <ul>
              {vegetableFruitSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.cropName}</strong>: {item.majorPests.join(", ")}
                  ({localizeNumber(item.pestsCount.toString(), "ne")} प्रकार)
                </li>
              ))}
            </ul>

            <p>
              सबैभन्दा प्रभावित तरकारी/फलफूल{" "}
              {mostAffectedVegetableFruit?.cropName || ""} रहेको छ, जसमा कुल{" "}
              {localizeNumber(
                mostAffectedVegetableFruit?.totalIssues.toString() || "0",
                "ne",
              )}
              प्रकारका रोग र कीटपतंगहरू देखिएका छन्। औसतमा प्रत्येक
              तरकारी/फलफूलमा
              {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")} प्रकारका
              समस्याहरू रहेका छन्।
            </p>
          </div>

          {/* Client component for charts */}
          <VegetableFruitDiseaseCharts
            vegetableFruitSummary={vegetableFruitSummary}
            totalVegetableFruits={totalVegetableFruits}
            totalPests={totalPests}
            totalDiseases={totalDiseases}
            totalIssues={totalIssues}
            VEGETABLE_FRUIT_TYPES={VEGETABLE_FRUIT_TYPES}
            VEGETABLE_FRUIT_COLORS={VEGETABLE_FRUIT_COLORS}
            mostAffectedVegetableFruit={mostAffectedVegetableFruit}
            avgIssuesPerCrop={avgIssuesPerCrop}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="vegetable-protection-strategy"
              className="scroll-m-20 border-b pb-2"
            >
              तरकारी र फलफूल संरक्षण रणनीति
            </h2>
            <p>
              गढवा गाउँपालिकामा तरकारी र फलफूलमा रोग र कीटपतंगको प्रभावकारी
              व्यवस्थापनका लागि समेकित कीट व्यवस्थापन (Integrated Pest
              Management) को अवधारणालाई अपनाउनु आवश्यक छ। यसमा जैविक, रासायनिक र
              कृषि पद्धतिगत विधिहरूको संयोजन गरिन्छ।
            </p>

            <VegetableFruitDiseaseAnalysisSection
              vegetableFruitSummary={vegetableFruitSummary}
              totalVegetableFruits={totalVegetableFruits}
              totalPests={totalPests}
              totalDiseases={totalDiseases}
              VEGETABLE_FRUIT_TYPES={VEGETABLE_FRUIT_TYPES}
              VEGETABLE_FRUIT_TYPES_EN={VEGETABLE_FRUIT_TYPES_EN}
              VEGETABLE_FRUIT_COLORS={VEGETABLE_FRUIT_COLORS}
              mostAffectedVegetableFruit={mostAffectedVegetableFruit}
              avgIssuesPerCrop={avgIssuesPerCrop}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकाको तरकारी र फलफूलमा रोग र कीटपतंगको अवस्थाको
              विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>विशेष तरकारी संरक्षण:</strong> गोलभेडा, काउली र बन्दा
                  जस्ता मुख्य तरकारीहरूमा विशेष ध्यान दिई समेकित कीट व्यवस्थापन
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>मौसमी निगरानी:</strong> तरकारी र फलफूलको बिभिन्न
                  मौसममा देखिने रोग र कीटको नियमित निगरानी र प्रारम्भिक पहिचान
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>जैविक नियन्त्रण:</strong> रासायनिक कीटनाशकको सट्टा
                  जैविक विधिहरू प्रयोग गरी वातावरण मैत्री तरकारी उत्पादन
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>बीउ र बिरुवाको गुणस्तर:</strong> रोग र कीट प्रतिरोधी
                  किस्मका बीउ र बिरुवाहरूको प्रयोगलाई प्रोत्साहन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>भण्डारण व्यवस्थापन:</strong> तरकारी र फलफूलको उचित
                  भण्डारण र ढुवानी व्यवस्थाले रोग फैलिनबाट रोक्न सकिन्छ।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा तरकारी र फलफूलमा रोग र कीटपतंगको प्रभावकारी
              व्यवस्थापन मार्फत कृषि उत्पादकत्व वृद्धि र किसानको आम्दानी बढाउन
              सकिन्छ। यसका लागि स्थानीय सरकार, कृषि ज्ञान केन्द्र र किसानहरूको
              सक्रिय सहकार्य आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
