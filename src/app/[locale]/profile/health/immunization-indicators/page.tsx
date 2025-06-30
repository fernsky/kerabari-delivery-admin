import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import ImmunizationIndicatorsCharts from "./_components/immunization-indicators-charts";
import ImmunizationIndicatorsAnalysisSection from "./_components/immunization-indicators-analysis-section";
import ImmunizationIndicatorsSEO from "./_components/immunization-indicators-seo";
import BCGVaccineInfo from "./_components/vaccine-information/bcg-vaccine-info";
import DPTHepBHibVaccineInfo from "./_components/vaccine-information/dpt-hepb-hib-vaccine-info";
import OPVVaccineInfo from "./_components/vaccine-information/opv-vaccine-info";
import {
  ImmunizationFiscalYear,
  immunizationFiscalYearOptions,
  immunizationIndicatorOptions,
} from "@/server/api/routers/profile/health/immunization-indicators.schema";

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
    // Get the latest fiscal year data
    const latestFiscalYear = immunizationFiscalYearOptions[0]
      .value as ImmunizationFiscalYear;
    const immunizationData =
      await api.profile.health.immunizationIndicators.getAll.query({
        fiscalYear: latestFiscalYear,
      });

    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality
    const fiscalYearLabel =
      immunizationFiscalYearOptions.find(
        (opt) => opt.value === latestFiscalYear,
      )?.label || latestFiscalYear;

    // Find key coverage indicators for description
    const dptHib3Data = immunizationData.find(
      (item) => item.indicator === "DPT_HEPB_HIB3_COVERAGE",
    );
    const measlesRubella1Data = immunizationData.find(
      (item) => item.indicator === "MEASLES_RUBELLA1_COVERAGE",
    );
    const fullyImmunizedData = immunizationData.find(
      (item) => item.indicator === "FULLY_IMMUNIZED_NIP_SCHEDULE",
    );

    const dptHib3Coverage = dptHib3Data?.value || 0;
    const measlesRubella1Coverage = measlesRubella1Data?.value || 0;
    const fullyImmunizedCoverage = fullyImmunizedData?.value || 0;

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका खोप कभरेज",
      "बाल खोप कार्यक्रम",
      "आधारभूत खोप सेवा",
      `पूर्ण खोप कभरेज ${fullyImmunizedCoverage.toFixed(1)}%`,
      `DPT-HepB-Hib3 कभरेज ${dptHib3Coverage.toFixed(1)}%`,
      "केराबारी गाउँपालिकामा खोप सेवा",
      "खोप कभरेज विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality immunization coverage",
      "Child immunization program",
      "Basic vaccination service",
      `Full immunization coverage ${fullyImmunizedCoverage.toFixed(1)}%`,
      `DPT-HepB-Hib3 coverage ${dptHib3Coverage.toFixed(1)}%`,
      "Vaccination services in Khajura",
      "Immunization coverage analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकामा आधारभूत खोप सेवाको विश्लेषण। आर्थिक वर्ष ${fiscalYearLabel} मा पूर्ण खोप कभरेज ${localizeNumber(fullyImmunizedCoverage.toFixed(1), "ne")}%, DPT-HepB-Hib3 कभरेज ${localizeNumber(dptHib3Coverage.toFixed(1), "ne")}%, र दादुरा-रुबेला कभरेज ${localizeNumber(measlesRubella1Coverage.toFixed(1), "ne")}% रहेको छ।`;

    const descriptionEN = `Analysis of basic immunization services in Khajura Rural Municipality. In fiscal year ${fiscalYearLabel}, full immunization coverage was ${fullyImmunizedCoverage.toFixed(1)}%, DPT-HepB-Hib3 coverage was ${dptHib3Coverage.toFixed(1)}%, and measles-rubella coverage was ${measlesRubella1Coverage.toFixed(1)}%.`;

    return {
      title: `खोप सेवा र कभरेज | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/health/immunization-indicators",
        languages: {
          en: "/en/profile/health/immunization-indicators",
          ne: "/ne/profile/health/immunization-indicators",
        },
      },
      openGraph: {
        title: `खोप सेवा र कभरेज | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `खोप सेवा र कभरेज | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "खोप सेवा र कभरेज | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "केराबारी गाउँपालिकामा आधारभूत खोप सेवा र कभरेजको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख खोप कभरेज सूचकहरू",
    slug: "key-immunization-coverage-indicators",
  },
  {
    level: 2,
    text: "खोप कभरेज प्रवृत्ति",
    slug: "immunization-coverage-trends",
  },
  { level: 2, text: "खोप ड्रपआउट दर", slug: "vaccine-dropout-rates" },
  { level: 2, text: "खोप खेर जाने दर", slug: "vaccine-wastage-rates" },
  {
    level: 2,
    text: "खोप सेवा सुधार रणनीति",
    slug: "immunization-service-improvement-strategy",
  },
];

export default async function ImmunizationIndicatorsPage() {
  // Get all fiscal years available from options, sorted newest to oldest
  const availableFiscalYears = [...immunizationFiscalYearOptions].map(
    (o) => o.value as ImmunizationFiscalYear,
  );

  // Get the most recent fiscal year
  const latestFiscalYear = availableFiscalYears[0];

  // Get previous fiscal year for comparison
  const previousFiscalYear = availableFiscalYears[1];

  // Fetch immunization indicators data for the latest fiscal year
  const latestImmunizationData =
    await api.profile.health.immunizationIndicators.getAll.query({
      fiscalYear: latestFiscalYear,
    });

  // Fetch previous year's data for comparison
  const previousImmunizationData =
    await api.profile.health.immunizationIndicators.getAll.query({
      fiscalYear: previousFiscalYear,
    });

  // Multi-year data for trend analysis
  const multiYearData: Record<string, any[]> = {};

  // Fetch data for each year for trend analysis (last 3 years)
  for (let i = 0; i < Math.min(3, availableFiscalYears.length); i++) {
    const yearData =
      await api.profile.health.immunizationIndicators.getAll.query({
        fiscalYear: availableFiscalYears[i],
      });
    multiYearData[availableFiscalYears[i]] = yearData;
  }

  // Format and prepare data for visualization and analysis
  const fiscalYearLabels = immunizationFiscalYearOptions.reduce<
    Record<string, string>
  >((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

  const indicatorLabels = immunizationIndicatorOptions.reduce<
    Record<string, string>
  >((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

  // Group indicators by category
  const coverageIndicators = [
    "BCG_COVERAGE",
    "DPT_HEPB_HIB1_COVERAGE",
    "DPT_HEPB_HIB3_COVERAGE",
    "OPV1_COVERAGE",
    "OPV3_COVERAGE",
    "PCV1_COVERAGE",
    "PCV3_COVERAGE",
    "ROTA1_COVERAGE",
    "ROTA2_COVERAGE",
    "MEASLES_RUBELLA1_COVERAGE",
    "MEASLES_RUBELLA2_COVERAGE",
    "JE_COVERAGE",
    "TCV_COVERAGE",
    "FIPV1_COVERAGE",
    "FIPV2_COVERAGE",
    "HPV1_COVERAGE",
    "HPV2_COVERAGE",
    "FULLY_IMMUNIZED_NIP_SCHEDULE",
  ];

  const dropoutIndicators = [
    "DPT_HEPB_HIB_DROPOUT",
    "MEASLES_RUBELLA_DROPOUT",
    "PCV_DROPOUT",
    "DPT_HEPB_HIB1_VS_MR2_DROPOUT",
    "HPV_DROPOUT",
  ];

  const wastageIndicators = [
    "VACCINE_WASTAGE_BCG",
    "VACCINE_WASTAGE_DPT_HEPB_HIB",
    "VACCINE_WASTAGE_OPV",
    "VACCINE_WASTAGE_PCV",
    "VACCINE_WASTAGE_ROTA",
    "VACCINE_WASTAGE_MR",
    "VACCINE_WASTAGE_JE",
    "VACCINE_WASTAGE_TCV",
    "VACCINE_WASTAGE_FIPV",
    "VACCINE_WASTAGE_TD",
  ];

  const sessionIndicators = [
    "PLANNED_IMMUNIZATION_SESSIONS_CONDUCTED",
    "PLANNED_IMMUNIZATION_CLINICS_CONDUCTED",
    "HYGIENE_PROMOTION_SESSION_AMONG_ROUTINE_IMMUNIZATION",
  ];

  const pregnantWomenIndicators = [
    "TD2_PREGNANT_WOMEN",
    "TD2PLUS_PREGNANT_WOMEN",
    "TD2_TD2PLUS_COMPLETED_PREGNANT_WOMEN",
  ];

  // Filter and organize data
  const coverageData = latestImmunizationData
    .filter((item) => coverageIndicators.includes(item.indicator))
    .sort((a, b) => {
      const indexA = coverageIndicators.indexOf(a.indicator);
      const indexB = coverageIndicators.indexOf(b.indicator);
      return indexA - indexB;
    });

  const dropoutData = latestImmunizationData
    .filter((item) => dropoutIndicators.includes(item.indicator))
    .sort((a, b) => {
      const indexA = dropoutIndicators.indexOf(a.indicator);
      const indexB = dropoutIndicators.indexOf(b.indicator);
      return indexA - indexB;
    });

  const wastageData = latestImmunizationData
    .filter((item) => wastageIndicators.includes(item.indicator))
    .sort((a, b) => {
      const indexA = wastageIndicators.indexOf(a.indicator);
      const indexB = wastageIndicators.indexOf(b.indicator);
      return indexA - indexB;
    });

  // Prepare trend data for selected key indicators
  const keyTrendIndicators = [
    "BCG_COVERAGE",
    "DPT_HEPB_HIB3_COVERAGE",
    "MEASLES_RUBELLA1_COVERAGE",
    "FULLY_IMMUNIZED_NIP_SCHEDULE",
  ];

  const trendData = keyTrendIndicators.map((indicator) => {
    const yearValues = Object.keys(multiYearData).map((year) => {
      const data = multiYearData[year].find(
        (item) => item.indicator === indicator,
      );
      return {
        year: fiscalYearLabels[year],
        value: data?.value || 0,
        yearKey: year,
      };
    });

    return {
      indicator,
      indicatorName: indicatorLabels[indicator] || indicator,
      values: yearValues,
    };
  });

  // Find fully immunized data for latest year
  const fullyImmunizedData = coverageData.find(
    (item) => item.indicator === "FULLY_IMMUNIZED_NIP_SCHEDULE",
  );
  const fullyImmunizedValue = fullyImmunizedData?.value || 0;

  // Find previous year fully immunized data for comparison
  const prevFullyImmunizedData = previousImmunizationData.find(
    (item) => item.indicator === "FULLY_IMMUNIZED_NIP_SCHEDULE",
  );
  const prevFullyImmunizedValue = prevFullyImmunizedData?.value || 0;

  // Calculate year-on-year change
  const fullyImmunizedChange = fullyImmunizedValue - prevFullyImmunizedValue;

  // Get DPT3 coverage which is a key indicator
  const dpt3Data = coverageData.find(
    (item) => item.indicator === "DPT_HEPB_HIB3_COVERAGE",
  );
  const dpt3Value = dpt3Data?.value || 0;

  // Calculate immunization quality index (averaging key indicators)
  const keyIndicators = [
    "DPT_HEPB_HIB3_COVERAGE",
    "MEASLES_RUBELLA1_COVERAGE",
    "FULLY_IMMUNIZED_NIP_SCHEDULE",
  ];

  const validKeyIndicatorValues = keyIndicators
    .map(
      (ind) => coverageData.find((item) => item.indicator === ind)?.value || 0,
    )
    .filter((val) => val > 0);

  const immunizationQualityIndex =
    validKeyIndicatorValues.length > 0
      ? validKeyIndicatorValues.reduce((sum, val) => sum + val, 0) /
        validKeyIndicatorValues.length
      : 0;

  // Find DPT dropout rate
  const dptDropoutData = dropoutData.find(
    (item) => item.indicator === "DPT_HEPB_HIB_DROPOUT",
  );
  const dptDropoutRate = dptDropoutData?.value || 0;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <ImmunizationIndicatorsSEO
        latestFiscalYear={latestFiscalYear}
        fiscalYearLabel={fiscalYearLabels[latestFiscalYear]}
        coverageData={coverageData}
        dropoutData={dropoutData}
        wastageData={wastageData}
        trendData={trendData}
        immunizationQualityIndex={immunizationQualityIndex}
        indicatorLabels={indicatorLabels}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/immunization-services.svg"
              width={1200}
              height={400}
              alt="खोप सेवा र कभरेज - केराबारी गाउँपालिका (Immunization Services and Coverage - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा खोप सेवा र कभरेजको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              खोप कार्यक्रम स्वास्थ्य क्षेत्रको एक अत्यन्त महत्वपूर्ण र
              लागत-प्रभावी हस्तक्षेप हो जसले विभिन्न संक्रामक रोगहरूबाट
              बच्चाहरूलाई सुरक्षित राख्न, रोगजन्य जटिलताहरू कम गर्न र
              मृत्युदरलाई घटाउन महत्वपूर्ण भूमिका निर्वाह गर्दछ। नेपाल सरकारको
              राष्ट्रिय खोप कार्यक्रम अन्तर्गत १२ प्रकारका खोपहरू दिइने गरिएको
              छ, जसमा <span className="english-font">BCG</span>,{" "}
              <span className="english-font">DPT-HepB-Hib</span>,{" "}
              <span className="english-font">OPV</span>,{" "}
              <span className="english-font">PCV</span>, रोटा,{" "}
              <span className="english-font">MR</span>,{" "}
              <span className="english-font">JE</span>,{" "}
              <span className="english-font">TCV</span> र{" "}
              <span className="english-font">TD</span> समावेश छन्।
            </p>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको आर्थिक वर्ष{" "}
              {localizeNumber(fiscalYearLabels[latestFiscalYear], "ne")} को खोप
              सेवाको अवस्था र विश्लेषण प्रस्तुत गरिएको छ। पालिकामा खोप कभरेज,
              ड्रपआउट दर, खोप खेर जाने दर, र अन्य महत्वपूर्ण सूचकहरूको अध्ययनबाट
              समग्र खोप सेवाको गुणस्तर र पहुँचको अवस्था मूल्याङ्कन गरिएको छ।
            </p>

            <h2
              id="key-immunization-coverage-indicators"
              className="scroll-m-20 border-b pb-2"
            >
              प्रमुख खोप कभरेज सूचकहरू
            </h2>
            <p>
              केराबारी गाउँपालिकामा आर्थिक वर्ष{" "}
              {localizeNumber(fiscalYearLabels[latestFiscalYear], "ne")} मा
              महत्वपूर्ण खोप सूचकहरूको अवस्था निम्नानुसार रहेको छ:
            </p>
          </div>

          <ImmunizationIndicatorsCharts
            fiscalYearLabels={fiscalYearLabels}
            currentFiscalYear={latestFiscalYear}
            coverageData={coverageData}
            dropoutData={dropoutData}
            wastageData={wastageData}
            trendData={trendData}
            indicatorLabels={indicatorLabels}
            fullyImmunizedValue={fullyImmunizedValue}
            fullyImmunizedChange={fullyImmunizedChange}
            dpt3Value={dpt3Value}
            dptDropoutRate={dptDropoutRate}
            immunizationQualityIndex={immunizationQualityIndex}
            sessionIndicators={sessionIndicators}
            pregnantWomenIndicators={pregnantWomenIndicators}
            latestImmunizationData={latestImmunizationData}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="immunization-service-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              खोप सेवा सुधार रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा खोप सेवाको अवस्था विश्लेषणबाट निम्न
              रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <ImmunizationIndicatorsAnalysisSection
              latestFiscalYear={latestFiscalYear}
              fiscalYearLabel={fiscalYearLabels[latestFiscalYear]}
              coverageData={coverageData}
              dropoutData={dropoutData}
              wastageData={wastageData}
              indicatorLabels={indicatorLabels}
              fullyImmunizedValue={fullyImmunizedValue}
              fullyImmunizedChange={fullyImmunizedChange}
              dpt3Value={dpt3Value}
              dptDropoutRate={dptDropoutRate}
              immunizationQualityIndex={immunizationQualityIndex}
            />

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकाको खोप सेवाको अवस्थामा सुधार ल्याउन
              स्पष्ट लक्ष्य, वैज्ञानिक दृष्टिकोण र सामुदायिक सहभागिता आवश्यक छ।
              सबै बालबालिकाहरूले गुणस्तरीय खोप सेवा पाउन सक्ने वातावरण सुनिश्चित
              गर्न पालिकाले आफ्नो स्रोत-साधन र जनशक्तिको समुचित परिचालन
              गर्नुपर्ने देखिन्छ।
            </p>

            {/* Detailed Vaccine Information Sections */}
            <h2 className="scroll-m-20 border-b pb-2 mt-16 mb-8">
              खोपहरूको विस्तृत जानकारी
            </h2>
            <p className="mb-6">
              यहाँ मुख्य खोपहरूको बारेमा विस्तृत जानकारी प्रस्तुत गरिएको छ जसले
              अभिभावकहरूलाई खोपको महत्व, प्रभावकारिता र आवश्यकता बुझ्न मद्दत
              गर्नेछ।
            </p>

            <BCGVaccineInfo />
            <DPTHepBHibVaccineInfo />
            <OPVVaccineInfo />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
