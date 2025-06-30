"use client";

import Link from "next/link";
import { useEffect } from "react";

interface YearlyIncomeSustenanceAnalysisProps {
  overallSummary: Array<{
    monthsSustained: string;
    monthsSustainedName: string;
    households: number;
  }>;
  totalHouseholds: number;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
  wardNumbers: number[];
  incomeSustenanceData: Array<{
    id?: string;
    wardNumber: number;
    monthsSustained: string;
    households: number;
  }>;
}

export default function YearlyIncomeSustenanceAnalysis({
  overallSummary,
  totalHouseholds,
  MONTHS_SUSTAINED_NAMES,
  wardNumbers,
  incomeSustenanceData,
}: YearlyIncomeSustenanceAnalysisProps) {
  const MONTHS_SUSTAINED_COLORS = {
    UPTO_THREE_MONTHS: "#FF5733", // Red-orange
    THREE_TO_SIX_MONTHS: "#FFC300", // Yellow
    SIX_TO_NINE_MONTHS: "#36A2EB", // Blue
    TWELVE_MONTHS: "#4CAF50", // Green
  };

  // Find percentage of yearly sufficient households
  const yearRoundPercent = overallSummary.find(
    (item) => item.monthsSustained === "TWELVE_MONTHS",
  )?.households
    ? (
        ((overallSummary.find(
          (item) => item.monthsSustained === "TWELVE_MONTHS",
        )?.households || 0) /
          totalHouseholds) *
        100
      ).toFixed(2)
    : "0";

  // Find percentage of households with income for less than 3 months
  const lessThanThreeMonthsPercent = overallSummary.find(
    (item) => item.monthsSustained === "UPTO_THREE_MONTHS",
  )?.households
    ? (
        ((overallSummary.find(
          (item) => item.monthsSustained === "UPTO_THREE_MONTHS",
        )?.households || 0) /
          totalHouseholds) *
        100
      ).toFixed(2)
    : "0";

  // Find ward with highest food security (year-round income)
  const wardYearRoundData = wardNumbers.map((wardNumber) => {
    const yearRoundItem = incomeSustenanceData.find(
      (item) =>
        item.wardNumber === wardNumber &&
        item.monthsSustained === "TWELVE_MONTHS",
    );

    const wardTotal = incomeSustenanceData
      .filter((item) => item.wardNumber === wardNumber)
      .reduce((sum, item) => sum + (item.households || 0), 0);

    return {
      wardNumber,
      yearRoundHouseholds: yearRoundItem?.households || 0,
      percentage:
        wardTotal > 0
          ? ((yearRoundItem?.households || 0) / wardTotal) * 100
          : 0,
    };
  });

  const bestWard = wardYearRoundData.sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstWard = wardYearRoundData.sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const MONTHS_SUSTAINED_NAMES_EN: Record<string, string> = {
      UPTO_THREE_MONTHS: "Up to 3 months",
      THREE_TO_SIX_MONTHS: "3-6 months",
      SIX_TO_NINE_MONTHS: "6-9 months",
      TWELVE_MONTHS: "Year-round",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households",
        totalHouseholds.toString(),
      );
      document.body.setAttribute(
        "data-year-round-sufficiency-percentage",
        yearRoundPercent,
      );
      document.body.setAttribute(
        "data-less-than-three-months-percentage",
        lessThanThreeMonthsPercent,
      );
      document.body.setAttribute(
        "data-best-ward",
        bestWard?.wardNumber.toString() || "N/A",
      );
      document.body.setAttribute(
        "data-worst-ward",
        worstWard?.wardNumber.toString() || "N/A",
      );

      // Add data for each sustenance category
      overallSummary.forEach((item) => {
        const monthsEn =
          MONTHS_SUSTAINED_NAMES_EN[item.monthsSustained] ||
          item.monthsSustained;
        document.body.setAttribute(
          `data-${monthsEn.toLowerCase().replace(/\s+/g, "-")}-households`,
          item.households.toString(),
        );
        document.body.setAttribute(
          `data-${monthsEn.toLowerCase().replace(/\s+/g, "-")}-percentage`,
          ((item.households / totalHouseholds) * 100).toFixed(2),
        );
      });
    }
  }, [
    overallSummary,
    totalHouseholds,
    bestWard?.wardNumber,
    worstWard?.wardNumber,
    yearRoundPercent,
    lessThanThreeMonthsPercent,
  ]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallSummary.map((item, index) => {
          // Define English month category name for SEO
          const monthsEn =
            item.monthsSustained === "UPTO_THREE_MONTHS"
              ? "Up to 3 months"
              : item.monthsSustained === "THREE_TO_SIX_MONTHS"
                ? "3-6 months"
                : item.monthsSustained === "SIX_TO_NINE_MONTHS"
                  ? "6-9 months"
                  : item.monthsSustained === "TWELVE_MONTHS"
                    ? "Year-round"
                    : item.monthsSustained;

          // Calculate percentage
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-months-sustained={`${monthsEn} / ${item.monthsSustainedName}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households / totalHouseholds) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    MONTHS_SUSTAINED_COLORS[
                      item.monthsSustained as keyof typeof MONTHS_SUSTAINED_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.monthsSustainedName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{monthsEn}</span>
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
          आयको पर्याप्तता स्थिति विश्लेषण
          <span className="sr-only">
            Income Sufficiency Status Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">खाद्य सुरक्षा स्थिति</h4>
            <p className="mb-2">
              केराबारी गाउँपालिकामा {yearRoundPercent}% घरपरिवार मात्र
              वर्षभरिका लागि पुग्ने आय उत्पादन गर्न सक्षम छन्। यसले समग्रमा
              खाद्य सुरक्षाको स्थिति चुनौतीपूर्ण रहेको देखाउँछ।
            </p>
            <p>
              <span className="font-medium">सबैभन्दा खाद्य सुरक्षित वडा:</span>{" "}
              वडा {bestWard?.wardNumber || "N/A"}
              (वर्षभरि पुग्ने आय भएका {bestWard?.percentage?.toFixed(1) || 0}%
              घरपरिवार)
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">खाद्य असुरक्षा जोखिम</h4>
            <p className="mb-2">
              पालिकामा {lessThanThreeMonthsPercent}% घरपरिवारको वार्षिक आय ३
              महिना भन्दा कम समयका लागि मात्र पुग्छ। यस्ता परिवारहरू खाद्य
              असुरक्षा र गरिबीको उच्च जोखिममा छन्।
            </p>
            <p>
              <span className="font-medium">सबैभन्दा जोखिममा रहेको वडा:</span>{" "}
              वडा {worstWard?.wardNumber || "N/A"}
              (वर्षभरि पुग्ने आय भएका {worstWard?.percentage?.toFixed(1) || 0}%
              घरपरिवार मात्र)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Income Sufficiency in Khajura
          </span>
        </h3>
        <p>
          केराबारी गाउँपालिकाको वार्षिक आयको पर्याप्तता सम्बन्धी थप जानकारी
          वा विस्तृत तथ्याङ्कको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक तथ्याङ्क
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
