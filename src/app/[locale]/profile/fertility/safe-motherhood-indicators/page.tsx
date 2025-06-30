import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import SafeMotherhoodIndicatorsCharts from "./_components/safe-motherhood-indicators-charts";
import SafeMotherhoodIndicatorsAnalysisSection from "./_components/safe-motherhood-indicators-analysis-section";
import SafeMotherhoodIndicatorsSEO from "./_components/safe-motherhood-indicators-seo";
import { indicatorOptions } from "@/server/api/routers/profile/fertility/safe-motherhood-indicators.schema";

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
    // Get the latest year data
    const safeMotherhoodSummary =
      await api.profile.fertility.safeMotherhoodIndicators.summary.query();

    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality
    const latestYear = safeMotherhoodSummary.latestYear;

    // Find key indicators for description
    const institutionalDeliveriesData = safeMotherhoodSummary.delivery.find(
      (item) => item.indicator === "INSTITUTIONAL_DELIVERIES",
    );
    const ancCheckupsData = safeMotherhoodSummary.antenatal.find(
      (item) => item.indicator === "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",
    );
    const pncVisitsData = safeMotherhoodSummary.postnatal.find(
      (item) => item.indicator === "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",
    );

    const institutionalDeliveries = institutionalDeliveriesData?.value || 0;
    const ancCheckups = ancCheckupsData?.value || 0;
    const pncVisits = pncVisitsData?.value || 0;

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका सुरक्षित मातृत्व सेवा",
      "मातृ स्वास्थ्य सेवा",
      "संस्थागत सुत्केरी",
      `संस्थागत प्रसूति दर ${Number(institutionalDeliveries).toFixed(1)}%`,
      `गर्भवती जाँच कभरेज ${Number(ancCheckups).toFixed(1)}%`,
      "केराबारी गाउँपालिकामा सुरक्षित मातृत्व",
      "मातृ स्वास्थ्य विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality safe motherhood services",
      "Maternal health services",
      "Institutional delivery",
      `Institutional delivery rate ${Number(institutionalDeliveries).toFixed(1)}%`,
      `ANC coverage ${Number(ancCheckups).toFixed(1)}%`,
      "Safe motherhood in Khajura",
      "Maternal health analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकामा सुरक्षित मातृत्व सेवाको विश्लेषण। वर्ष ${latestYear} मा संस्थागत प्रसूति दर ${localizeNumber(Number(institutionalDeliveries).toFixed(1), "ne")}%, नियमित गर्भवती जाँच ${localizeNumber(Number(ancCheckups).toFixed(1), "ne")}%, र सुत्केरी पछिको जाँच ${localizeNumber(Number(pncVisits).toFixed(1), "ne")}% रहेको छ।`;

    const descriptionEN = `Analysis of safe motherhood services in Khajura Rural Municipality. In year ${latestYear}, institutional delivery rate was ${Number(institutionalDeliveries).toFixed(1)}%, regular ANC checkups was ${Number(ancCheckups).toFixed(1)}%, and postnatal care was ${Number(pncVisits).toFixed(1)}%.`;

    return {
      title: `सुरक्षित मातृत्व सूचकहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/health/safe-motherhood-indicators",
        languages: {
          en: "/en/profile/health/safe-motherhood-indicators",
          ne: "/ne/profile/health/safe-motherhood-indicators",
        },
      },
      openGraph: {
        title: `सुरक्षित मातृत्व सूचकहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `सुरक्षित मातृत्व सूचकहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "सुरक्षित मातृत्व सूचकहरू | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "केराबारी गाउँपालिकामा मातृ स्वास्थ्य सेवा र सूचकहरूको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख सुरक्षित मातृत्व सूचकहरू",
    slug: "key-safe-motherhood-indicators",
  },
  { level: 2, text: "गर्भवती स्वास्थ्य सेवा", slug: "antenatal-care" },
  { level: 2, text: "संस्थागत प्रसूति", slug: "institutional-delivery" },
  { level: 2, text: "सुत्केरी स्वास्थ्य सेवा", slug: "postnatal-care" },
  { level: 2, text: "नवजात शिशु स्वास्थ्य", slug: "newborn-health" },
  { level: 2, text: "सेवा सुधार रणनीति", slug: "service-improvement-strategy" },
];

export default async function SafeMotherhoodIndicatorsPage() {
  // Get safe motherhood indicators summary data
  const safeMotherhoodSummary =
    await api.profile.fertility.safeMotherhoodIndicators.summary.query();

  // Get year data for analysis
  const latestYear = safeMotherhoodSummary.latestYear;

  // Get data from summaries
  const antenatalData = safeMotherhoodSummary.antenatal;
  const deliveryData = safeMotherhoodSummary.delivery;
  const postnatalData = safeMotherhoodSummary.postnatal;
  const newbornHealthData = safeMotherhoodSummary.newbornHealth;
  const trendData = safeMotherhoodSummary.trends;

  // Create indicator labels mapping
  const indicatorLabels = indicatorOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {},
  );

  // Extract key indicators
  const institutionalDeliveriesData = deliveryData.find(
    (item) => item.indicator === "INSTITUTIONAL_DELIVERIES",
  );
  const ancCheckupsData = antenatalData.find(
    (item) => item.indicator === "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",
  );
  const pncVisitsData = postnatalData.find(
    (item) => item.indicator === "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",
  );
  const newbornCareData = newbornHealthData.find(
    (item) => item.indicator === "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",
  );

  const institutionalDeliveries = institutionalDeliveriesData?.value || 0;
  const ancCheckups = ancCheckupsData?.value || 0;
  const pncVisits = pncVisitsData?.value || 0;
  const newbornCare = newbornCareData?.value || 0;

  // Format trend data for visualization
  const formattedTrendData = Object.values(
    trendData.reduce((acc: Record<string, any>, item: any) => {
      if (!acc[item.indicator]) {
        acc[item.indicator] = {
          indicator: item.indicator,
          indicatorName: indicatorLabels[item.indicator] || item.indicator,
          values: [],
        };
      }

      acc[item.indicator].values.push({
        year: item.year.toString(),
        value: parseFloat(item.value) || 0,
        yearKey: item.year.toString(),
      });

      return acc;
    }, {}),
  );

  // Calculate maternal health quality index
  const keyIndicators = [
    "INSTITUTIONAL_DELIVERIES",
    "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",
    "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",
  ];

  const validKeyIndicatorValues = [
    institutionalDeliveries,
    ancCheckups,
    pncVisits,
  ].filter((val): val is number => typeof val === "number" && val > 0);

  const maternalHealthIndex =
    validKeyIndicatorValues.length > 0
      ? validKeyIndicatorValues.reduce((sum, val) => sum + val, 0) /
        validKeyIndicatorValues.length
      : 0;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <SafeMotherhoodIndicatorsSEO
        latestYear={latestYear as number}
        antenatalData={antenatalData}
        deliveryData={deliveryData}
        postnatalData={postnatalData}
        newbornHealthData={newbornHealthData}
        trendData={trendData}
        maternalHealthIndex={maternalHealthIndex}
        indicatorLabels={indicatorLabels}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/safe-motherhood-services.svg"
              width={1200}
              height={400}
              alt="सुरक्षित मातृत्व सेवा - केराबारी गाउँपालिका (Safe Motherhood Services - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा सुरक्षित मातृत्व सेवाको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सुरक्षित मातृत्व कार्यक्रम नेपालको स्वास्थ्य क्षेत्रको महत्वपूर्ण
              प्राथमिकता हो जसले मातृ तथा नवजात शिशु स्वास्थ्यमा सुधार ल्याउने
              उद्देश्य राख्दछ। नेपाल सरकारले दिगो विकास लक्ष्य अन्तर्गत सन् २०३०
              सम्ममा मातृ मृत्युदर प्रति १ लाख जीवित जन्ममा ७० भन्दा कम
              पुर्‍याउने लक्ष्य लिएको छ। यस कार्यक्रम अन्तर्गत गर्भवती जाँच,
              संस्थागत प्रसूति, सुत्केरी सेवा, र नवजात शिशु स्वास्थ्य सेवाहरू
              प्रदान गरिन्छ।
            </p>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको वर्ष{" "}
              {localizeNumber((latestYear || 2080).toString(), "ne")} को
              सुरक्षित मातृत्व सेवाको अवस्था र विश्लेषण प्रस्तुत गरिएको छ।
              पालिकामा गर्भवती सेवा, संस्थागत सुत्केरी दर, सुत्केरी स्याहार र
              नवजात शिशु स्वास्थ्य सम्बन्धी सूचकहरूको विश्लेषण गरिएको छ।
            </p>

            <h2
              id="key-safe-motherhood-indicators"
              className="scroll-m-20 border-b pb-2"
            >
              प्रमुख सुरक्षित मातृत्व सूचकहरू
            </h2>
            <p>
              केराबारी गाउँपालिकामा वर्ष{" "}
              {localizeNumber((latestYear || 2080)?.toString(), "ne")} मा
              सुरक्षित मातृत्व सम्बन्धी महत्वपूर्ण सूचकहरूको अवस्था निम्नानुसार
              रहेको छ:
            </p>
          </div>

          <SafeMotherhoodIndicatorsCharts
            latestYear={latestYear as number}
            antenatalData={antenatalData}
            deliveryData={deliveryData}
            postnatalData={postnatalData}
            newbornHealthData={newbornHealthData}
            trendData={formattedTrendData}
            indicatorLabels={indicatorLabels}
            //@ts-ignore
            institutionalDeliveries={institutionalDeliveries}
            //@ts-ignore
            ancCheckups={ancCheckups}
            //@ts-ignore
            pncVisits={pncVisits}
            //@ts-ignore
            newbornCare={newbornCare}
            maternalHealthIndex={maternalHealthIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="service-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              सुरक्षित मातृत्व सेवा सुधार रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा सुरक्षित मातृत्व सेवाको अवस्था
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <SafeMotherhoodIndicatorsAnalysisSection
              latestYear={latestYear as number}
              antenatalData={antenatalData}
              deliveryData={deliveryData}
              postnatalData={postnatalData}
              newbornHealthData={newbornHealthData}
              indicatorLabels={indicatorLabels}
              //@ts-ignore
              institutionalDeliveries={institutionalDeliveries}
              //@ts-ignore
              ancCheckups={ancCheckups}
              //@ts-ignore
              pncVisits={pncVisits}
              maternalHealthIndex={maternalHealthIndex}
            />

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकाको सुरक्षित मातृत्व सेवाको अवस्थामा
              सुधार ल्याउन स्पष्ट लक्ष्य, सामुदायिक सहभागिता र समन्वित प्रयास
              आवश्यक छ। सबै गर्भवती र सुत्केरी महिलाहरूले गुणस्तरीय स्वास्थ्य
              सेवा पाउन सक्ने वातावरण सुनिश्चित गर्न पालिकाले आफ्नो स्रोत-साधन र
              जनशक्तिको समुचित परिचालन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
