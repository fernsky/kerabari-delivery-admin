"use client";

import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";
import { IncomeSourceEnum } from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";

interface IncomeAnalysisProps {
  overallSummary: Array<{
    incomeSource: string;
    incomeSourceName: string;
    households: number;
  }>;
  totalHouseholds: number;
  incomeSourceLabels: Record<string, string>;
}

export default function IncomeAnalysisSection({
  overallSummary,
  totalHouseholds,
  incomeSourceLabels,
}: IncomeAnalysisProps) {
  const INCOME_SOURCE_COLORS = {
    AGRICULTURE: "#4CAF50", // Green
    JOB: "#2196F3", // Blue
    BUSINESS: "#FF9800", // Orange
    INDUSTRY: "#F44336", // Red
    FOREIGN_EMPLOYMENT: "#9C27B0", // Purple
    LABOUR: "#795548", // Brown
    OTHER: "#9E9E9E", // Grey
  };

  // Calculate top two income sources ratio if both exist
  const topIncomeSource = overallSummary[0];
  const secondIncomeSource = overallSummary[1];

  const topTwoIncomeSourceRatio =
    topIncomeSource && secondIncomeSource && secondIncomeSource.households > 0
      ? (topIncomeSource.households / secondIncomeSource.households).toFixed(2)
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
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households",
        totalHouseholds.toString(),
      );

      // Add main income source data
      if (topIncomeSource) {
        const incomeSourceNameEN =
          INCOME_SOURCE_NAMES_EN[topIncomeSource.incomeSource] ||
          topIncomeSource.incomeSource;
        document.body.setAttribute(
          "data-main-income-source",
          `${incomeSourceNameEN} / ${topIncomeSource.incomeSourceName}`,
        );
        document.body.setAttribute(
          "data-main-income-source-households",
          topIncomeSource.households.toString(),
        );
        document.body.setAttribute(
          "data-main-income-source-percentage",
          ((topIncomeSource.households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add second income source data
      if (secondIncomeSource) {
        const incomeSourceNameEN =
          INCOME_SOURCE_NAMES_EN[secondIncomeSource.incomeSource] ||
          secondIncomeSource.incomeSource;
        document.body.setAttribute(
          "data-second-income-source",
          `${incomeSourceNameEN} / ${secondIncomeSource.incomeSourceName}`,
        );
        document.body.setAttribute(
          "data-second-income-source-households",
          secondIncomeSource.households.toString(),
        );
        document.body.setAttribute(
          "data-second-income-source-percentage",
          ((secondIncomeSource.households / totalHouseholds) * 100).toFixed(2),
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
                        ? "Daily Labor"
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
              data-income-source={`${incomeSourceEN} / ${item.incomeSourceName}`}
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
                  {item.incomeSourceName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{incomeSourceEN}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  घरपरिवार
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
          गढवा गाउँपालिकाको आय स्रोत विविधता विश्लेषण
          <span className="sr-only">
            Income Source Diversity Analysis of Khajura Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-income-source"
            data-income-source-name={topIncomeSource?.incomeSource}
            data-income-source-percentage={
              topIncomeSource
                ? (
                    (topIncomeSource.households / totalHouseholds) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख आय स्रोत
              <span className="sr-only">
                Main Income Source in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topIncomeSource ? topIncomeSource.incomeSourceName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topIncomeSource
                ? `कुल घरपरिवारको ${localizeNumber(((topIncomeSource.households / totalHouseholds) * 100).toFixed(2), "ne")}%`
                : ""}
              <span className="sr-only">
                {topIncomeSource
                  ? `${((topIncomeSource.households / totalHouseholds) * 100).toFixed(2)}% of total households in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="income-source-ratio"
            data-ratio={topTwoIncomeSourceRatio}
            data-primary-income-source={topIncomeSource?.incomeSource}
            data-secondary-income-source={secondIncomeSource?.incomeSource}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो आय स्रोत अनुपात
              <span className="sr-only">
                Primary to Secondary Income Source Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoIncomeSourceRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topIncomeSource && secondIncomeSource
                ? `हरेक ${localizeNumber(topTwoIncomeSourceRatio, "ne")} ${topIncomeSource.incomeSourceName} आय स्रोत भएका घरपरिवारका लागि १ ${secondIncomeSource.incomeSourceName} आय स्रोत भएका घरपरिवार`
                : ""}
              <span className="sr-only">
                {topIncomeSource && secondIncomeSource
                  ? `For every ${topTwoIncomeSourceRatio} households dependent on ${topIncomeSource.incomeSource.toLowerCase()}, there is 1 household dependent on ${secondIncomeSource.incomeSource.toLowerCase()} in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
