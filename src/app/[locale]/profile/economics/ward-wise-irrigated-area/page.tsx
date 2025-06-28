import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigatedAreaCharts from "./_components/irrigated-area-charts";
import IrrigatedAreaAnalysisSection from "./_components/irrigated-area-analysis-section";
import IrrigatedAreaSEO from "./_components/irrigated-area-seo";

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
    const irrigatedAreaData =
      await api.profile.economics.wardWiseIrrigatedArea.getAll.query();
    const summaryData =
      await api.profile.economics.wardWiseIrrigatedArea.summary.query();

    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Calculate total areas
    const totalIrrigatedArea = summaryData?.total_irrigated_area
      ? parseFloat(summaryData.total_irrigated_area as string)
      : irrigatedAreaData.reduce(
          (sum, item) =>
            sum + (parseFloat(String(item.irrigatedAreaHectares)) || 0),
          0,
        );

    const totalUnirrigatedArea = summaryData?.total_unirrigated_area
      ? parseFloat(summaryData.total_unirrigated_area as string)
      : irrigatedAreaData.reduce(
          (sum, item) =>
            sum + (parseFloat(String(item.unirrigatedAreaHectares)) || 0),
          0,
        );

    const totalArea = totalIrrigatedArea + totalUnirrigatedArea;
    const irrigatedPercentage =
      totalArea > 0 ? ((totalIrrigatedArea / totalArea) * 100).toFixed(2) : "0";

    // Find the ward with highest irrigated area
    const sortedByIrrigated = [...irrigatedAreaData].sort(
      (a, b) => b.irrigatedAreaHectares - a.irrigatedAreaHectares,
    );
    const highestIrrigatedWard = sortedByIrrigated[0];

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका वडा अनुसार सिंचित क्षेत्रफल",
      "वडा अनुसार सिंचित र असिंचित क्षेत्रफल",
      "सिंचाई क्षेत्र विश्लेषण",
      `बुद्धशान्ति सिंचित क्षेत्रफल ${localizeNumber(totalIrrigatedArea.toFixed(2), "ne")} हेक्टर`,
      "वडागत सिंचाई विवरण",
      "कृषि सिंचाई",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality ward-wise irrigated area",
      "Ward-wise irrigated and unirrigated area statistics",
      "Irrigation coverage by ward",
      `Khajura irrigated area ${totalIrrigatedArea.toFixed(2)} hectares`,
      "Agricultural irrigation statistics",
      "Irrigation analysis by ward",
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा वडा अनुसार सिंचित र असिंचित क्षेत्रफलको विवरण र विश्लेषण। कुल ${localizeNumber(totalArea.toFixed(2), "ne")} हेक्टर क्षेत्रफल मध्ये ${localizeNumber(irrigatedPercentage, "ne")}% (${localizeNumber(totalIrrigatedArea.toFixed(2), "ne")}) हेक्टर क्षेत्रफल सिंचित र ${localizeNumber((100 - parseFloat(irrigatedPercentage)).toFixed(2), "ne")}% क्षेत्रफल असिंचित रहेको छ। वडा नं. ${localizeNumber(String(highestIrrigatedWard?.wardNumber || ""), "ne")} मा सबैभन्दा बढी सिंचित क्षेत्र रहेको छ।`;

    const descriptionEN = `Details and analysis of irrigated and unirrigated area by ward in Khajura Rural Municipality. Out of a total of ${totalArea.toFixed(2)} hectares, ${irrigatedPercentage}% (${totalIrrigatedArea.toFixed(2)}) hectares are irrigated and ${(100 - parseFloat(irrigatedPercentage)).toFixed(2)}% area is unirrigated. Ward No. ${highestIrrigatedWard?.wardNumber || ""} has the highest irrigated area.`;

    return {
      title: `वडा अनुसार सिंचित र असिंचित क्षेत्रफल | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-irrigated-area",
        languages: {
          en: "/en/profile/economics/ward-wise-irrigated-area",
          ne: "/ne/profile/economics/ward-wise-irrigated-area",
        },
      },
      openGraph: {
        title: `वडा अनुसार सिंचित र असिंचित क्षेत्रफल | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वडा अनुसार सिंचित र असिंचित क्षेत्रफल | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "वडा अनुसार सिंचित र असिंचित क्षेत्रफल | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "बुद्धशान्ति गाउँपालिकामा वडा अनुसार सिंचित र असिंचित क्षेत्रफलको विवरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडागत सिंचित क्षेत्रफलको अवस्था",
    slug: "ward-wise-irrigated-area-status",
  },
  {
    level: 2,
    text: "सिंचाई क्षेत्रफल विश्लेषण",
    slug: "irrigation-coverage-analysis",
  },
  {
    level: 2,
    text: "सिंचाई अन्तराल र चुनौती",
    slug: "irrigation-gap-and-challenges",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseIrrigatedAreaPage() {
  // Fetch all ward-wise irrigated area data using tRPC
  const irrigatedAreaData =
    await api.profile.economics.wardWiseIrrigatedArea.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseIrrigatedArea.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const wardData = irrigatedAreaData
    .map((item) => ({
      wardNumber: item.wardNumber,
      irrigatedArea: parseFloat(String(item.irrigatedAreaHectares)) || 0,
      unirrigatedArea: parseFloat(String(item.unirrigatedAreaHectares)) || 0,
      totalArea:
        (parseFloat(String(item.irrigatedAreaHectares)) || 0) +
        (parseFloat(String(item.unirrigatedAreaHectares)) || 0),
    }))
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Calculate overall totals
  const totalIrrigatedArea = summaryData?.total_irrigated_area
    ? parseFloat(summaryData.total_irrigated_area as string)
    : wardData.reduce((sum, item) => sum + item.irrigatedArea, 0);

  const totalUnirrigatedArea = summaryData?.total_unirrigated_area
    ? parseFloat(summaryData.total_unirrigated_area as string)
    : wardData.reduce((sum, item) => sum + item.unirrigatedArea, 0);

  const totalArea = totalIrrigatedArea + totalUnirrigatedArea;

  // Calculate percentages
  const irrigatedPercentage =
    totalArea > 0 ? ((totalIrrigatedArea / totalArea) * 100).toFixed(2) : "0";
  const unirrigatedPercentage =
    totalArea > 0 ? ((totalUnirrigatedArea / totalArea) * 100).toFixed(2) : "0";

  // Find ward with highest irrigated area
  const mostIrrigatedWard = [...wardData].sort(
    (a, b) => b.irrigatedArea - a.irrigatedArea,
  )[0];

  // Find ward with highest unirrigated area
  const mostUnirrigatedWard = [...wardData].sort(
    (a, b) => b.unirrigatedArea - a.unirrigatedArea,
  )[0];

  // Calculate irrigation sustainability score (simple ratio of irrigated to total area as percentage)
  const irrigationSustainabilityScore = Math.round(
    parseFloat(irrigatedPercentage),
  );

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IrrigatedAreaSEO
        wardData={wardData}
        totalIrrigatedArea={totalIrrigatedArea}
        totalUnirrigatedArea={totalUnirrigatedArea}
        totalArea={totalArea}
        irrigatedPercentage={irrigatedPercentage}
        mostIrrigatedWard={mostIrrigatedWard}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/irrigation.svg"
              width={1200}
              height={400}
              alt="वडा अनुसार सिंचित र असिंचित क्षेत्रफल - बुद्धशान्ति गाउँपालिका (Ward-wise Irrigated and Unirrigated Area - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा वडा अनुसार सिंचित र असिंचित क्षेत्रफल
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सिंचाई कृषि उत्पादनलाई प्रभावकारी बनाउने महत्त्वपूर्ण पक्ष हो।
              बुद्धशान्ति गाउँपालिकामा वडागत रूपमा सिंचित र असिंचित क्षेत्रफलको
              अवस्था विविध रहेको छ। सम्पूर्ण पालिकामा कुल{" "}
              {localizeNumber(totalArea.toFixed(2), "ne")} हेक्टर क्षेत्रफल
              मध्ये {localizeNumber(irrigatedPercentage, "ne")}% अर्थात्{" "}
              {localizeNumber(totalIrrigatedArea.toFixed(2), "ne")} हेक्टर
              क्षेत्रफलमा सिंचाई सुविधा उपलब्ध छ भने{" "}
              {localizeNumber(unirrigatedPercentage, "ne")}% अर्थात्
              {localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")} हेक्टर
              क्षेत्रफलमा सिंचाई सुविधा उपलब्ध छैन।
            </p>
            <p>
              वडागत विश्लेषण गर्दा वडा नं.{" "}
              {localizeNumber(
                String(mostIrrigatedWard?.wardNumber || ""),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                mostIrrigatedWard?.irrigatedArea.toFixed(2) || "",
                "ne",
              )}{" "}
              हेक्टर क्षेत्रफलमा सिंचाई सुविधा उपलब्ध छ भने वडा नं.{" "}
              {localizeNumber(
                String(mostUnirrigatedWard?.wardNumber || ""),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                mostUnirrigatedWard?.unirrigatedArea.toFixed(2) || "",
                "ne",
              )}{" "}
              हेक्टर क्षेत्रफलमा सिंचाई सुविधा पुग्न सकेको छैन।
            </p>

            <h2
              id="ward-wise-irrigated-area-status"
              className="scroll-m-20 border-b pb-2"
            >
              वडागत सिंचित क्षेत्रफलको अवस्था
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकाका सबै वडाहरूमा सिंचाई सुविधाको वितरण असमान
              रहेको देखिन्छ। यहाँ वडागत रूपमा सिंचित र असिंचित क्षेत्रफलको
              विस्तृत विवरण प्रस्तुत गरिएको छ:
            </p>

            <ul>
              {wardData.map((ward) => {
                const irrigatedPercent =
                  ward.totalArea > 0
                    ? ((ward.irrigatedArea / ward.totalArea) * 100).toFixed(1)
                    : "0";

                return (
                  <li key={ward.wardNumber}>
                    <strong>
                      वडा नं. {localizeNumber(String(ward.wardNumber), "ne")}
                    </strong>
                    : कुल क्षेत्रफल{" "}
                    {localizeNumber(ward.totalArea.toFixed(2), "ne")} हेक्टर
                    मध्ये
                    {localizeNumber(ward.irrigatedArea.toFixed(2), "ne")} हेक्टर
                    ({localizeNumber(irrigatedPercent, "ne")}%) सिंचित र{" "}
                    {localizeNumber(ward.unirrigatedArea.toFixed(2), "ne")}{" "}
                    हेक्टर (
                    {localizeNumber(
                      (100 - parseFloat(irrigatedPercent)).toFixed(1),
                      "ne",
                    )}
                    %) असिंचित
                  </li>
                );
              })}
            </ul>

            <p>
              सिंचित क्षेत्रफलको विश्लेषण गर्दा, सबैभन्दा बढी सिंचित क्षेत्रफल
              वडा नं.
              {localizeNumber(
                String(mostIrrigatedWard?.wardNumber || ""),
                "ne",
              )}{" "}
              मा{" "}
              {localizeNumber(
                mostIrrigatedWard?.irrigatedArea.toFixed(2) || "",
                "ne",
              )}{" "}
              हेक्टर रहेको देखिन्छ, जुन उक्त वडाको कुल क्षेत्रफलको{" "}
              {mostIrrigatedWard?.totalArea
                ? localizeNumber(
                    (
                      (mostIrrigatedWard.irrigatedArea /
                        mostIrrigatedWard.totalArea) *
                      100
                    ).toFixed(1),
                    "ne",
                  )
                : "0"}
              % हिस्सा हो।
            </p>
          </div>

          {/* Client component for charts */}
          <IrrigatedAreaCharts
            wardData={wardData}
            totalIrrigatedArea={totalIrrigatedArea}
            totalUnirrigatedArea={totalUnirrigatedArea}
            totalArea={totalArea}
            irrigatedPercentage={irrigatedPercentage}
            unirrigatedPercentage={unirrigatedPercentage}
            irrigationSustainabilityScore={irrigationSustainabilityScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="irrigation-gap-and-challenges"
              className="scroll-m-20 border-b pb-2"
            >
              सिंचाई अन्तराल र चुनौती
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा सिंचाईको अवस्था विश्लेषण गर्दा कुल
              {localizeNumber(totalArea.toFixed(2), "ne")} हेक्टर क्षेत्रफल
              मध्ये
              {localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")} हेक्टर (
              {localizeNumber(unirrigatedPercentage, "ne")}%) क्षेत्रफलमा अझै
              सिंचाई सुविधा पुग्न नसकेको देखिन्छ, जुन एउटा ठूलो चुनौती हो।
            </p>

            <p>
              वडा नं.{" "}
              {localizeNumber(
                String(mostUnirrigatedWard?.wardNumber || ""),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                mostUnirrigatedWard?.unirrigatedArea.toFixed(2) || "",
                "ne",
              )}{" "}
              हेक्टर क्षेत्रफल असिंचित रहेको छ, जसले उक्त वडामा सिंचाई विस्तार
              गर्नुपर्ने आवश्यकतालाई इङ्गित गर्दछ।
            </p>

            <IrrigatedAreaAnalysisSection
              wardData={wardData}
              totalIrrigatedArea={totalIrrigatedArea}
              totalUnirrigatedArea={totalUnirrigatedArea}
              totalArea={totalArea}
              irrigatedPercentage={irrigatedPercentage}
              unirrigatedPercentage={unirrigatedPercentage}
              irrigationSustainabilityScore={irrigationSustainabilityScore}
              mostIrrigatedWard={mostIrrigatedWard}
              mostUnirrigatedWard={mostUnirrigatedWard}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकाको वडागत सिंचित र असिंचित क्षेत्रफलको
              विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सिंचाई पूर्वाधार विस्तार:</strong> हाल पालिकाको कुल
                  क्षेत्रफलको {localizeNumber(unirrigatedPercentage, "ne")}%
                  असिंचित रहेकोले यी क्षेत्रहरूमा, विशेषगरी वडा नं.{" "}
                  {localizeNumber(
                    String(mostUnirrigatedWard?.wardNumber || ""),
                    "ne",
                  )}{" "}
                  मा, सिंचाई पूर्वाधार विस्तार गर्नुपर्ने आवश्यकता देखिन्छ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वडागत प्राथमिकीकरण:</strong> सिंचाई अन्तराल बढी भएका
                  वडाहरूमा प्राथमिकताका साथ सिंचाई विकास योजना तयार गरी
                  कार्यान्वयन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सामुदायिक सहभागिता:</strong> वडागत स्तरमा सिंचाई
                  उपभोक्ता समिति गठन गरी सिंचाई पूर्वाधारको निर्माण, संचालन र
                  मर्मतमा सामुदायिक सहभागिता बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वैकल्पिक सिंचाई प्रविधि:</strong> भूगोल र भू-बनावट
                  अनुसार ठूला सिंचाई पूर्वाधार निर्माण गर्न कठिन स्थानहरूमा साना
                  सिंचाई, थोपा सिंचाई, स्प्रिङ्कलर सिंचाई जस्ता वैकल्पिक
                  प्रविधिहरूको प्रयोग बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>बजेट प्राथमिकीकरण:</strong> पालिका र वडा स्तरीय बजेट
                  निर्माण गर्दा सिंचाई पूर्वाधार विकासलाई उच्च प्राथमिकतामा राखी
                  बजेट विनियोजन गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा सिंचाईको अवस्थालाई सुधार गर्न सम्पूर्ण
              सरोकारवालाहरूको समन्वयात्मक प्रयास आवश्यक छ। वडागत स्तरमा सिंचाई
              पूर्वाधार विकासका लागि योजनाबद्ध कार्यक्रम संचालन गरी कृषि
              उत्पादकत्व वृद्धि गर्न सके पालिकाको समग्र आर्थिक विकासमा टेवा
              पुग्न जानेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
