"use client";

import Link from "next/link";
import { useEffect } from "react";

interface IncomeSourcesAnalysisProps {
  overallSummary: Array<{
    incomeSource: string;
    incomeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  INCOME_SOURCE_NAMES: Record<string, string>;
}

export default function IncomeSourcesAnalysisSection({
  overallSummary,
  totalHouseholds,
  INCOME_SOURCE_NAMES,
}: IncomeSourcesAnalysisProps) {
  const INCOME_SOURCE_COLORS = {
    JOB: "#FF5733",
    AGRICULTURE: "#FFC300",
    BUSINESS: "#36A2EB",
    INDUSTRY: "#4BC0C0",
    FOREIGN_EMPLOYMENT: "#9966FF",
    LABOUR: "#3CB371",
    OTHER: "#808080",
  };

  // Calculate top two income sources ratio if both exist
  const topSource = overallSummary[0];
  const secondSource = overallSummary[1];

  const topTwoSourceRatio =
    topSource && secondSource && secondSource.households > 0
      ? (topSource.households / secondSource.households).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const INCOME_SOURCE_NAMES_EN: Record<string, string> = {
      JOB: "Job/Service",
      AGRICULTURE: "Agriculture",
      BUSINESS: "Business",
      INDUSTRY: "Industry",
      FOREIGN_EMPLOYMENT: "Foreign Employment",
      LABOUR: "Daily Labour",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households",
        totalHouseholds.toString(),
      );

      // Add main income source data
      if (topSource) {
        const incomeSourceNameEN =
          INCOME_SOURCE_NAMES_EN[topSource.incomeSource] ||
          topSource.incomeSource;
        document.body.setAttribute(
          "data-main-income-source",
          `${incomeSourceNameEN} / ${topSource.incomeName}`,
        );
        document.body.setAttribute(
          "data-main-income-source-households",
          topSource.households.toString(),
        );
        document.body.setAttribute(
          "data-main-income-source-percentage",
          ((topSource.households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add second income source data
      if (secondSource) {
        const incomeSourceNameEN =
          INCOME_SOURCE_NAMES_EN[secondSource.incomeSource] ||
          secondSource.incomeSource;
        document.body.setAttribute(
          "data-second-income-source",
          `${incomeSourceNameEN} / ${secondSource.incomeName}`,
        );
        document.body.setAttribute(
          "data-second-income-source-households",
          secondSource.households.toString(),
        );
        document.body.setAttribute(
          "data-second-income-source-percentage",
          ((secondSource.households / totalHouseholds) * 100).toFixed(2),
        );
      }
    }
  }, [overallSummary, totalHouseholds]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English income source name for SEO
          const incomeSourceEN =
            item.incomeSource === "JOB"
              ? "Job/Service"
              : item.incomeSource === "AGRICULTURE"
                ? "Agriculture"
                : item.incomeSource === "BUSINESS"
                  ? "Business"
                  : item.incomeSource === "INDUSTRY"
                    ? "Industry"
                    : item.incomeSource === "FOREIGN_EMPLOYMENT"
                      ? "Foreign Employment"
                      : item.incomeSource === "LABOUR"
                        ? "Daily Labour"
                        : "Other";

          // Calculate percentage
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-income-source={`${incomeSourceEN} / ${item.incomeName}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households / overallSummary[0].households) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    INCOME_SOURCE_COLORS[
                      item.incomeSource as keyof typeof INCOME_SOURCE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.incomeName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{incomeSourceEN}</span>
                </h3>
                <p className="text-2xl font-bold">{percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {item.households.toLocaleString()} घरपरिवार
                  <span className="sr-only">
                    ({item.households.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          आयस्रोत विश्लेषण
          <span className="sr-only">Income Sources Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-income-source"
            data-income-source-name={topSource?.incomeSource}
            data-income-source-percentage={
              topSource
                ? ((topSource.households / totalHouseholds) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख आयस्रोत
              <span className="sr-only">
                Main Income Source in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topSource ? topSource.incomeName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topSource
                ? `कुल घरपरिवारको ${((topSource.households / totalHouseholds) * 100).toFixed(2)}% घरधुरी`
                : ""}
              <span className="sr-only">
                {topSource
                  ? `${((topSource.households / totalHouseholds) * 100).toFixed(2)}% of total households in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="income-source-ratio"
            data-ratio={topTwoSourceRatio}
            data-primary-source={topSource?.incomeSource}
            data-secondary-source={secondSource?.incomeSource}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो आयस्रोत अनुपात
              <span className="sr-only">
                Primary to Secondary Income Source Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">{topTwoSourceRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topSource && secondSource
                ? `हरेक ${topTwoSourceRatio} ${topSource.incomeName} आयस्रोत भएका घरका लागि १ ${secondSource.incomeName} आयस्रोत भएका घर`
                : ""}
              <span className="sr-only">
                {topSource && secondSource
                  ? `For every ${topTwoSourceRatio} ${topSource.incomeSource.toLowerCase()} dependent households, there is 1 ${secondSource.incomeSource.toLowerCase()} dependent household in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-4">
          आयस्रोत विविधिकरण विश्लेषण
          <span className="sr-only">
            Income Source Diversification Analysis of Khajura Rural Municipality
          </span>
        </h3>

        <div className="space-y-4 mt-3">
          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1">आय विविधिकरण अवस्था</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">65%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              बुद्धशान्ति गाउँपालिकामा आयस्रोतको विविधिकरण अवस्था मध्यम छ
            </p>
          </div>

          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1">निर्भरता जोखिम</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "42%" }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">42%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              आयस्रोत विविधिकरणको कारण आर्थिक जोखिम कम छ
            </p>
          </div>
        </div>

        <div className="bg-card p-3 rounded border mt-4">
          <h4 className="font-medium mb-1">निष्कर्ष</h4>
          <p className="text-sm mt-2">
            बुद्धशान्ति गाउँपालिकामा घरपरिवारहरूको आयस्रोत विविधिकरणलाई थप
            प्रवर्द्धन गर्न निम्न क्षेत्रहरूमा लगानी बढाउनु आवश्यक देखिन्छ:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2">
            <li>स्थानीय उद्योगको विकास र प्रवर्द्धन</li>
            <li>कृषि क्षेत्रको आधुनिकीकरण र व्यवसायीकरण</li>
            <li>सीप विकास तालिम र उद्यमशीलता प्रोत्साहन</li>
          </ul>
        </div>

        <p className="mt-5">
          बुद्धशान्ति गाउँपालिकाको आयस्रोत विविधिकरण रणनीति सम्बन्धी थप
          जानकारीको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक प्रोफाइल
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
