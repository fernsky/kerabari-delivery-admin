import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import CropDiseaseCharts from "./_components/crop-disease-charts";
import CropDiseaseAnalysisSection from "./_components/crop-disease-analysis-section";
import CropDiseaseSEO from "./_components/crop-disease-seo";
import { cropTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-crop-diseases.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Define English names for crop types (for SEO)
const CROP_TYPES_EN: Record<string, string> = {
  RICE: "Rice",
  WHEAT: "Wheat",
  CORN: "Corn",
  VEGETABLES: "Vegetables",
  FRUITS: "Fruits",
  OTHER: "Other Crops",
};

// Define Nepali names for crop types
const CROP_TYPES: Record<string, string> = cropTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for crop types
const CROP_COLORS: Record<string, string> = {
  RICE: "#2ECC71", // Green for rice
  WHEAT: "#F39C12", // Orange for wheat
  CORN: "#F1C40F", // Yellow for corn
  VEGETABLES: "#27AE60", // Dark green for vegetables
  FRUITS: "#E74C3C", // Red for fruits
  OTHER: "#95A5A6", // Gray for other
};

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const cropDiseaseData =
      await api.profile.economics.municipalityWideCropDiseases.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalCrops = cropDiseaseData.length;
    const cropTypes = Array.from(
      new Set(cropDiseaseData.map((item) => item.crop)),
    );

    // Find most affected crop (highest number of diseases/pests)
    let mostAffectedCrop = "";
    let maxIssues = 0;
    cropDiseaseData.forEach(
      (item: { crop: string; majorPests: string; majorDiseases: string }) => {
        const pestCount = item.majorPests.split(",").length;
        const diseaseCount = item.majorDiseases.split(",").length;
        const totalIssues = pestCount + diseaseCount;
        if (totalIssues > maxIssues) {
          maxIssues = totalIssues;
          mostAffectedCrop = item.crop;
        }
      },
    );

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका बाली रोग कीट",
      "गढवा कृषि समस्या",
      "पालिका स्तरीय बाली संरक्षण",
      "धान रोग कीट",
      "गहुँ रोग कीट",
      "मकै रोग कीट",
      "तरकारी रोग कीट",
      "फलफूल रोग कीट",
      `गढवा बाली संरक्षण ${localizeNumber(totalCrops.toString(), "ne")} प्रकार`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality crop diseases pests",
      "Khajura agriculture problems",
      "Municipality-wide crop protection",
      "Rice diseases pests",
      "Wheat diseases pests",
      "Corn diseases pests",
      "Vegetable diseases pests",
      "Fruit diseases pests",
      `Khajura crop protection ${totalCrops} types`,
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकाको बाली रोग र कीटको विश्लेषण। ${localizeNumber(totalCrops.toString(), "ne")} प्रकारका बालीमा देखिने प्रमुख रोग र कीटहरूको विस्तृत अध्ययन। सबैभन्दा प्रभावित बाली ${CROP_TYPES[mostAffectedCrop] || mostAffectedCrop} रहेको छ। पालिका स्तरीय बाली संरक्षण योजना र रणनीतिको विश्लेषण।`;

    const descriptionEN = `Analysis of crop diseases and pests in Khajura Rural Municipality. Detailed study of major diseases and pests affecting ${totalCrops} types of crops. Most affected crop is ${CROP_TYPES_EN[mostAffectedCrop] || mostAffectedCrop}. Municipality-wide crop protection planning and strategy analysis.`;

    return {
      title: `बाली रोग र कीटपतंग | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-crop-diseases",
        languages: {
          en: "/en/profile/economics/municipality-wide-crop-diseases",
          ne: "/ne/profile/economics/municipality-wide-crop-diseases",
        },
      },
      openGraph: {
        title: `बाली रोग र कीटपतंग | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `बाली रोग र कीटपतंग | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    return {
      title: "बाली रोग र कीटपतंग | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "पालिका स्तरीय बाली रोग र कीटपतंगको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख बाली रोगहरू", slug: "main-crop-diseases" },
  { level: 2, text: "प्रमुख कीटपतंगहरू", slug: "main-pests" },
  { level: 2, text: "रोग र कीट विश्लेषण", slug: "disease-pest-analysis" },
  { level: 2, text: "बाली संरक्षण रणनीति", slug: "crop-protection-strategy" },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideCropDiseasesPage() {
  // Fetch all crop disease data using tRPC
  const cropDiseaseData =
    await api.profile.economics.municipalityWideCropDiseases.getAll.query();

  // Process data for analysis
  type CropDiseaseSummaryType = {
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  };

  const cropSummary: CropDiseaseSummaryType[] = cropDiseaseData
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
          cropName: CROP_TYPES[item.crop] || item.crop,
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
  const totalCrops = cropSummary.length;
  const totalPests = cropSummary.reduce(
    (sum, crop) => sum + crop.pestsCount,
    0,
  );
  const totalDiseases = cropSummary.reduce(
    (sum, crop) => sum + crop.diseasesCount,
    0,
  );
  const totalIssues = totalPests + totalDiseases;

  // Find most affected crop
  const mostAffectedCrop = cropSummary[0];
  const avgIssuesPerCrop = totalCrops > 0 ? totalIssues / totalCrops : 0;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <CropDiseaseSEO
        cropSummary={cropSummary}
        totalCrops={totalCrops}
        totalPests={totalPests}
        totalDiseases={totalDiseases}
        CROP_TYPES={CROP_TYPES}
        CROP_TYPES_EN={CROP_TYPES_EN}
        mostAffectedCrop={mostAffectedCrop}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/crop-diseases.svg"
              width={1200}
              height={400}
              alt="बाली रोग र कीटपतंग - गढवा गाउँपालिका (Crop Diseases and Pests - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा बाली रोग र कीटपतंग
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              बाली रोग र कीटपतंग गढवा गाउँपालिकाको कृषि उत्पादनमा मुख्य
              चुनौती हो। यस क्षेत्रमा धान, गहुँ, मकै, तरकारी र फलफूल लगायतका
              विभिन्न बालीहरूमा विभिन्न प्रकारका रोग र कीटपतंगहरूको समस्या
              देखिन्छ। यी समस्याहरूले कृषकहरूको उत्पादन र आम्दानीमा प्रत्यक्ष
              प्रभाव पारिरहेको छ।
            </p>
            <p>
              गढवा गाउँपालिकाको बाली रोग र कीट सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा कुल {localizeNumber(totalCrops.toString(), "ne")}{" "}
              प्रकारका बालीहरूमा
              {localizeNumber(totalIssues.toString(), "ne")} प्रकारका रोग र
              कीटपतंगहरू देखिएका छन्, जसमध्ये{" "}
              {localizeNumber(totalDiseases.toString(), "ne")}
              रोग र {localizeNumber(totalPests.toString(), "ne")} कीटपतंग रहेका
              छन्।
            </p>

            <h2 id="main-crop-diseases" className="scroll-m-20 border-b pb-2">
              प्रमुख बाली रोगहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा देखिने प्रमुख बाली रोगहरू निम्नानुसार रहेका
              छन्:
            </p>

            <ul>
              {cropSummary.map((item, index) => (
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
              {cropSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.cropName}</strong>: {item.majorPests.join(", ")}
                  ({localizeNumber(item.pestsCount.toString(), "ne")} प्रकार)
                </li>
              ))}
            </ul>

            <p>
              सबैभन्दा प्रभावित बाली {mostAffectedCrop?.cropName || ""} रहेको छ,
              जसमा कुल{" "}
              {localizeNumber(
                mostAffectedCrop?.totalIssues.toString() || "0",
                "ne",
              )}
              प्रकारका रोग र कीटपतंगहरू देखिएका छन्। औसतमा प्रत्येक बालीमा
              {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")} प्रकारका
              समस्याहरू रहेका छन्।
            </p>
          </div>

          {/* Client component for charts */}
          <CropDiseaseCharts
            cropSummary={cropSummary}
            totalCrops={totalCrops}
            totalPests={totalPests}
            totalDiseases={totalDiseases}
            totalIssues={totalIssues}
            CROP_TYPES={CROP_TYPES}
            CROP_COLORS={CROP_COLORS}
            mostAffectedCrop={mostAffectedCrop}
            avgIssuesPerCrop={avgIssuesPerCrop}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="crop-protection-strategy"
              className="scroll-m-20 border-b pb-2"
            >
              बाली संरक्षण रणनीति
            </h2>
            <p>
              गढवा गाउँपालिकामा बाली रोग र कीटपतंगको प्रभावकारी व्यवस्थापनका
              लागि समेकित बाली व्यवस्थापन (Integrated Pest Management) को
              अवधारणालाई अपनाउनु आवश्यक छ। यसमा जैविक, रासायनिक र कृषि पद्धतिगत
              विधिहरूको संयोजन गरिन्छ।
            </p>

            <CropDiseaseAnalysisSection
              cropSummary={cropSummary}
              totalCrops={totalCrops}
              totalPests={totalPests}
              totalDiseases={totalDiseases}
              CROP_TYPES={CROP_TYPES}
              CROP_TYPES_EN={CROP_TYPES_EN}
              CROP_COLORS={CROP_COLORS}
              mostAffectedCrop={mostAffectedCrop}
              avgIssuesPerCrop={avgIssuesPerCrop}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकाको बाली रोग र कीटपतंगको अवस्थाको विश्लेषणबाट
              निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>समेकित कीट व्यवस्थापन:</strong> रासायनिक, जैविक र कृषि
                  पद्धतिगत विधिहरूको संयोजन गरी दिगो बाली संरक्षण गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>किसान शिक्षा कार्यक्रम:</strong> बाली रोग र कीट
                  पहिचान, रोकथाम र उपचार सम्बन्धी नियमित प्रशिक्षण आयोजना
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>प्रारम्भिक चेतावनी प्रणाली:</strong> मौसम र रोग/कीटको
                  पूर्वानुमान गर्ने प्रणाली स्थापना गरी किसानहरूलाई समयमै
                  जानकारी उपलब्ध गराउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>जैविक कीटनाशक प्रवर्द्धन:</strong> स्थानीय स्रोतबाट
                  जैविक कीटनाशक उत्पादन र प्रयोगलाई प्रोत्साहन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्रतिरोधी किस्म विकास:</strong> स्थानीय वातावरणमा
                  अनुकूल र रोग/कीट प्रतिरोधी बालीका किस्महरूको अनुसन्धान र विकास
                  गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा बाली रोग र कीटपतंगको प्रभावकारी व्यवस्थापन
              मार्फत कृषि उत्पादकत्व वृद्धि र किसानको आम्दानी बढाउन सकिन्छ। यसका
              लागि स्थानीय सरकार, कृषि ज्ञान केन्द्र र किसानहरूको सक्रिय सहकार्य
              आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
