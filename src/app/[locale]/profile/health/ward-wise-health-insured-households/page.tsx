import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseHealthInsuredHouseholdsCharts from "./_components/ward-wise-health-insured-households-charts";
import WardWiseHealthInsuredHouseholdsAnalysisSection from "./_components/ward-wise-health-insured-households-analysis-section";
import WardWiseHealthInsuredHouseholdsSEO from "./_components/ward-wise-health-insured-households-seo";

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
    const healthInsuredData =
      await api.profile.health.wardWiseHealthInsuredHouseholds.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Calculate total households and insured rates
    let totalInsuredHouseholds = 0;
    let totalNonInsuredHouseholds = 0;
    let totalHouseholds = 0;

    healthInsuredData.forEach((item: any) => {
      totalInsuredHouseholds += item.insuredHouseholds || 0;
      totalNonInsuredHouseholds += item.nonInsuredHouseholds || 0;
    });

    totalHouseholds = totalInsuredHouseholds + totalNonInsuredHouseholds;

    // Calculate insured percentage
    const insuredPercentage =
      totalHouseholds > 0
        ? ((totalInsuredHouseholds / totalHouseholds) * 100).toFixed(2)
        : "0.00";

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका स्वास्थ्य बीमा",
      "स्वास्थ्य बीमा पहुँच",
      "वडागत स्वास्थ्य बीमा दर",
      `स्वास्थ्य बीमा गरेका घरधुरी ${insuredPercentage}%`,
      "स्वास्थ्य बीमा विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality health insurance",
      "Health insurance coverage",
      "Ward-wise health insurance rate",
      `Health insured households ${insuredPercentage}%`,
      "Health insurance analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकामा स्वास्थ्य बीमा सम्बन्धी विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(insuredPercentage, "ne")}% (${localizeNumber(totalInsuredHouseholds.toLocaleString(), "ne")}) घरधुरीले स्वास्थ्य बीमा गरेका छन्।`;

    const descriptionEN = `Analysis of health insurance coverage in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${insuredPercentage}% (${totalInsuredHouseholds.toLocaleString()}) households have health insurance.`;

    return {
      title: `स्वास्थ्य बीमा गरेका घरधुरीको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/health/ward-wise-health-insured-households",
        languages: {
          en: "/en/profile/health/ward-wise-health-insured-households",
          ne: "/ne/profile/health/ward-wise-health-insured-households",
        },
      },
      openGraph: {
        title: `स्वास्थ्य बीमा गरेका घरधुरीको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `स्वास्थ्य बीमा गरेका घरधुरीको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "स्वास्थ्य बीमा गरेका घरधुरीको अवस्था | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार स्वास्थ्य बीमा गरेका घरधुरीको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "स्वास्थ्य बीमा गरेका घरधुरीको वितरण",
    slug: "distribution-of-health-insured-households",
  },
  {
    level: 2,
    text: "वडा अनुसार स्वास्थ्य बीमाको अवस्था",
    slug: "ward-wise-health-insurance-status",
  },
  {
    level: 2,
    text: "स्वास्थ्य बीमाको विश्लेषण",
    slug: "health-insurance-analysis",
  },
  {
    level: 2,
    text: "स्वास्थ्य बीमा सुधार रणनीति",
    slug: "health-insurance-improvement-strategy",
  },
];

export default async function WardWiseHealthInsuredHouseholdsPage() {
  // Fetch all ward-wise health insured households data using tRPC
  const healthInsuredData =
    await api.profile.health.wardWiseHealthInsuredHouseholds.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.health.wardWiseHealthInsuredHouseholds.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total households and insured rates
  let totalInsuredHouseholds = 0;
  let totalNonInsuredHouseholds = 0;
  let totalHouseholds = 0;

  healthInsuredData.forEach((item: any) => {
    totalInsuredHouseholds += item.insuredHouseholds || 0;
    totalNonInsuredHouseholds += item.nonInsuredHouseholds || 0;
  });

  totalHouseholds = totalInsuredHouseholds + totalNonInsuredHouseholds;

  // Calculate insured and non-insured percentages
  const insuredPercentage =
    totalHouseholds > 0
      ? ((totalInsuredHouseholds / totalHouseholds) * 100).toFixed(2)
      : "0.00";

  const nonInsuredPercentage =
    totalHouseholds > 0
      ? ((totalNonInsuredHouseholds / totalHouseholds) * 100).toFixed(2)
      : "0.00";

  // Create pie chart data
  const pieChartData = [
    {
      name: "बीमा गरेका",
      nameEn: "Insured",
      value: totalInsuredHouseholds,
      percentage: insuredPercentage,
      color: "#4285F4", // Blue
    },
    {
      name: "बीमा नगरेका",
      nameEn: "Non-insured",
      value: totalNonInsuredHouseholds,
      percentage: nonInsuredPercentage,
      color: "#EA4335", // Red
    },
  ];

  // Process data for ward-wise visualization
  const wardWiseData = healthInsuredData
    .map((ward: any) => {
      const totalWardHouseholds =
        (ward.insuredHouseholds || 0) + (ward.nonInsuredHouseholds || 0);

      return {
        ward: `वडा ${ward.wardNumber}`,
        wardNumber: ward.wardNumber,
        "बीमा गरेका": ward.insuredHouseholds || 0,
        "बीमा नगरेका": ward.nonInsuredHouseholds || 0,
        total: totalWardHouseholds,
      };
    })
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Calculate ward-wise insured percentages
  const wardInsuredPercentages = wardWiseData.map((ward: any) => {
    const insuredPercent =
      ward.total > 0 ? (ward["बीमा गरेका"] / ward.total) * 100 : 0;

    return {
      wardNumber: ward.wardNumber,
      percentage: insuredPercent,
    };
  });

  // Find wards with highest and lowest insurance rates
  const bestInsuranceWard = [...wardInsuredPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstInsuranceWard = [...wardInsuredPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate insurance coverage index (0-100)
  const insuranceCoverageIndex = parseFloat(insuredPercentage);

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseHealthInsuredHouseholdsSEO
        healthInsuredData={healthInsuredData}
        totalHouseholds={totalHouseholds}
        totalInsuredHouseholds={totalInsuredHouseholds}
        totalNonInsuredHouseholds={totalNonInsuredHouseholds}
        insuredPercentage={parseFloat(insuredPercentage)}
        nonInsuredPercentage={parseFloat(nonInsuredPercentage)}
        bestInsuranceWard={bestInsuranceWard}
        worstInsuranceWard={worstInsuranceWard}
        wardInsuredPercentages={wardInsuredPercentages}
        insuranceCoverageIndex={insuranceCoverageIndex}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/health-insurance.svg"
              width={1200}
              height={400}
              alt="स्वास्थ्य बीमा गरेका घरधुरीको अवस्था - केराबारी गाउँपालिका (Health Insured Households - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा स्वास्थ्य बीमा गरेका घरधुरीको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              स्वास्थ्य बीमा आधुनिक स्वास्थ्य सेवा प्रणालीको एक महत्वपूर्ण अंग
              हो जसले नागरिकलाई उपचार खर्चको आर्थिक भारबाट बचाउन मद्दत गर्दछ।
              स्वास्थ्य बीमाले मानिसहरूलाई गुणस्तरीय स्वास्थ्य सेवामा पहुँच
              बढाउन र आकस्मिक स्वास्थ्य खर्चको जोखिमबाट सुरक्षित गर्न सहयोग
              गर्दछ। यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा
              स्वास्थ्य बीमा गरेका घरधुरीको अवस्था र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {localizeNumber(insuredPercentage, "ne")}% घरधुरीले स्वास्थ्य बीमा
              गरेका छन्, जुन संख्यात्मक रूपमा
              {localizeNumber(
                totalInsuredHouseholds.toLocaleString(),
                "ne",
              )}{" "}
              घरधुरी हो। यसले केराबारी गाउँपालिकामा स्वास्थ्य बीमाको महत्व र
              पहुँचको अवस्थालाई प्रस्तुत गर्दछ।
            </p>

            <h2
              id="distribution-of-health-insured-households"
              className="scroll-m-20 border-b pb-2"
            >
              स्वास्थ्य बीमा गरेका घरधुरीको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य बीमा गरेका र नगरेका घरधुरीको
              वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseHealthInsuredHouseholdsCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            totalInsuredHouseholds={totalInsuredHouseholds}
            totalNonInsuredHouseholds={totalNonInsuredHouseholds}
            insuredPercentage={parseFloat(insuredPercentage)}
            nonInsuredPercentage={parseFloat(nonInsuredPercentage)}
            wardInsuredPercentages={wardInsuredPercentages}
            bestInsuranceWard={bestInsuranceWard}
            worstInsuranceWard={worstInsuranceWard}
            insuranceCoverageIndex={insuranceCoverageIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="health-insurance-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              स्वास्थ्य बीमाको विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य बीमाको अवस्थाको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(insuredPercentage, "ne")}% घरधुरीले स्वास्थ्य बीमा
              गरेको पाइन्छ। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestInsuranceWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा बढी स्वास्थ्य बीमा दर रहेको छ, जहाँ{" "}
              {localizeNumber(bestInsuranceWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले स्वास्थ्य बीमा गरेका छन्।
            </p>

            <WardWiseHealthInsuredHouseholdsAnalysisSection
              totalHouseholds={totalHouseholds}
              totalInsuredHouseholds={totalInsuredHouseholds}
              totalNonInsuredHouseholds={totalNonInsuredHouseholds}
              insuredPercentage={parseFloat(insuredPercentage)}
              nonInsuredPercentage={parseFloat(nonInsuredPercentage)}
              wardInsuredPercentages={wardInsuredPercentages}
              bestInsuranceWard={bestInsuranceWard}
              worstInsuranceWard={worstInsuranceWard}
              insuranceCoverageIndex={insuranceCoverageIndex}
            />

            <h2
              id="health-insurance-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              स्वास्थ्य बीमा सुधार रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य बीमाको अवस्था विश्लेषणबाट निम्न
              रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>स्वास्थ्य बीमा जागरण अभियान:</strong>{" "}
                  {localizeNumber(nonInsuredPercentage, "ne")}% घरधुरीले
                  स्वास्थ्य बीमा नगरेको अवस्थामा स्वास्थ्य बीमाको महत्व र लाभका
                  बारेमा जनचेतना अभियान सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वडागत लक्षित कार्यक्रम:</strong> वडा नं.{" "}
                  {localizeNumber(
                    worstInsuranceWard.wardNumber.toString(),
                    "ne",
                  )}{" "}
                  मा स्वास्थ्य बीमा दर न्यून रहेकोले त्यहाँ विशेष प्रोत्साहनमूलक
                  कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सहुलियतपूर्ण बीमा योजना:</strong> आर्थिक रूपमा कमजोर
                  वर्गका लागि सहुलियतपूर्ण बीमा योजना ल्याउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>मोबाइल बीमा शिविर:</strong> टाढाका क्षेत्रमा रहेका
                  घरधुरीहरूका लागि मोबाइल बीमा शिविर सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>सूचना प्रवाह सुदृढीकरण:</strong> स्वास्थ्य बीमाका लाभ
                  र प्रक्रियाबारे स्पष्ट जानकारी प्रदान गर्ने र आवेदन
                  प्रक्रियालाई सरलीकरण गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकामा स्वास्थ्य बीमाको अवस्थाको विश्लेषणले
              नीति निर्माण र कार्यक्रम तर्जुमा गर्न महत्वपूर्ण आधार प्रदान
              गर्दछ। स्वास्थ्य बीमाको दायरा बढाउँदै गुणस्तरीय स्वास्थ्य सेवामा
              सबै नागरिकको पहुँच सुनिश्चित गर्न आवश्यक कदम चाल्नु पर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
