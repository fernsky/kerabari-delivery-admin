"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MigratedHouseholdAnalysisSectionProps {
  overallSummary: Array<{
    migratedFrom: string;
    migratedFromName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonMigratedFrom: string;
    mostCommonMigratedFromHouseholds: number;
    mostCommonMigratedFromPercentage: string;
  }>;
  MIGRATED_FROM_NAMES: Record<string, string>;
  MIGRATED_FROM_NAMES_EN: Record<string, string>;
}

export default function MigratedHouseholdAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  MIGRATED_FROM_NAMES,
  MIGRATED_FROM_NAMES_EN,
}: MigratedHouseholdAnalysisSectionProps) {
  // Consistent color palette for migration categories
  const MIGRATED_FROM_COLORS = {
    SAME_DISTRICT_ANOTHER_MUNICIPALITY: "#34A0A4", // Light blue for same district
    ANOTHER_DISTRICT: "#76C893", // Green for another district
    ABROAD: "#D9ED92", // Yellow for abroad
  };

  // Find wards with highest migration from different districts
  const highestDistrictMigrationWard = [...wardWiseAnalysis].sort((a, b) => {
    const aCount =
      wardWiseAnalysis.find(
        (w) =>
          w.wardNumber === a.wardNumber &&
          w.mostCommonMigratedFrom === "ANOTHER_DISTRICT",
      )?.mostCommonMigratedFromHouseholds || 0;
    const bCount =
      wardWiseAnalysis.find(
        (w) =>
          w.wardNumber === b.wardNumber &&
          w.mostCommonMigratedFrom === "ANOTHER_DISTRICT",
      )?.mostCommonMigratedFromHouseholds || 0;
    return bCount - aCount;
  })[0];

  const highestForeignMigrationWard = [...wardWiseAnalysis].sort((a, b) => {
    const aCount =
      wardWiseAnalysis.find(
        (w) =>
          w.wardNumber === a.wardNumber &&
          w.mostCommonMigratedFrom === "ABROAD",
      )?.mostCommonMigratedFromHouseholds || 0;
    const bCount =
      wardWiseAnalysis.find(
        (w) =>
          w.wardNumber === b.wardNumber &&
          w.mostCommonMigratedFrom === "ABROAD",
      )?.mostCommonMigratedFromHouseholds || 0;
    return bCount - aCount;
  })[0];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-migrated-households",
        totalHouseholds.toString(),
      );

      // Add most common migration origin data
      if (overallSummary.length > 0) {
        document.body.setAttribute(
          "data-most-common-migration-origin",
          `${overallSummary[0].migratedFromName} / ${MIGRATED_FROM_NAMES_EN[overallSummary[0].migratedFrom as keyof typeof MIGRATED_FROM_NAMES_EN] || overallSummary[0].migratedFrom}`,
        );
        document.body.setAttribute(
          "data-most-common-migration-percentage",
          ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add ward data
      document.body.setAttribute(
        "data-highest-district-migration-ward",
        highestDistrictMigrationWard?.wardNumber.toString() || "",
      );
      document.body.setAttribute(
        "data-highest-foreign-migration-ward",
        highestForeignMigrationWard?.wardNumber.toString() || "",
      );
    }
  }, [
    overallSummary,
    totalHouseholds,
    highestDistrictMigrationWard,
    highestForeignMigrationWard,
    MIGRATED_FROM_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => {
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
              data-migration-origin={`${MIGRATED_FROM_NAMES_EN[item.migratedFrom as keyof typeof MIGRATED_FROM_NAMES_EN] || item.migratedFrom} / ${item.migratedFromName}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households /
                      Math.max(...overallSummary.map((i) => i.households))) *
                      100,
                    100,
                  )}%`,
                  backgroundColor:
                    MIGRATED_FROM_COLORS[
                      item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.migratedFromName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {MIGRATED_FROM_NAMES_EN[
                      item.migratedFrom as keyof typeof MIGRATED_FROM_NAMES_EN
                    ] || item.migratedFrom}
                  </span>
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
          आप्रवासित घरपरिवारको विश्लेषण
          <span className="sr-only">
            Migrated Household Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-migration-origin"
            data-percentage={
              overallSummary.length > 0
                ? (
                    (overallSummary[0].households / totalHouseholds) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख आप्रवासन स्थान
              <span className="sr-only">
                Most Common Migration Origin in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {overallSummary.length > 0
                ? overallSummary[0].migratedFromName
                : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                overallSummary.length > 0
                  ? (
                      (overallSummary[0].households / totalHouseholds) *
                      100
                    ).toFixed(2)
                  : "0",
                "ne",
              )}
              % (
              {localizeNumber(
                overallSummary.length > 0
                  ? overallSummary[0].households.toLocaleString()
                  : "0",
                "ne",
              )}{" "}
              घरपरिवार)
              <span className="sr-only">
                {overallSummary.length > 0
                  ? (
                      (overallSummary[0].households / totalHouseholds) *
                      100
                    ).toFixed(2)
                  : "0"}
                % (
                {overallSummary.length > 0 ? overallSummary[0].households : 0}{" "}
                households)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="migration-distribution"
          >
            <h4 className="font-medium mb-2">
              अन्तर-जिल्ला आप्रवासित घरपरिवार
              <span className="sr-only">
                Inter-district Migrated Households in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  overallSummary.find(
                    (item) => item.migratedFrom === "ANOTHER_DISTRICT",
                  )?.households || 0
                ).toString(),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                (
                  ((overallSummary.find(
                    (item) => item.migratedFrom === "ANOTHER_DISTRICT",
                  )?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % घरपरिवार
              <span className="sr-only">
                {(
                  ((overallSummary.find(
                    (item) => item.migratedFrom === "ANOTHER_DISTRICT",
                  )?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(2)}
                % of households are from another district
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            वडागत आप्रवासन विश्लेषण
            <span className="sr-only">Ward-wise Migration Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top two most common migration origins */}
            {overallSummary.slice(0, 2).map((item, index) => (
              <div key={index}>
                <h5 className="text-sm font-medium">{item.migratedFromName}</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(
                    ((item.households / totalHouseholds) * 100).toFixed(2),
                    "ne",
                  )}
                  % ({localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  घरपरिवार)
                </p>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((item.households / totalHouseholds) * 100, 100)}%`,
                      backgroundColor:
                        MIGRATED_FROM_COLORS[
                          item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
                        ] || "#888",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                वडागत प्रमुख आप्रवासन स्थान
              </h5>
              <ul className="mt-2 text-sm space-y-1">
                {wardWiseAnalysis.slice(0, 3).map((ward, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")}:
                    </span>
                    <span className="font-medium">
                      {MIGRATED_FROM_NAMES[
                        ward.mostCommonMigratedFrom as keyof typeof MIGRATED_FROM_NAMES
                      ] || ward.mostCommonMigratedFrom}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">आप्रवासन सम्बन्धी विशेषता</h5>
              <p className="mt-2 text-sm text-muted-foreground">
                {overallSummary.find(
                  (item) => item.migratedFrom === "ANOTHER_DISTRICT",
                )
                  ? `केराबारी गाउँपालिकामा ${localizeNumber((((overallSummary.find((item) => item.migratedFrom === "ANOTHER_DISTRICT")?.households || 0) / totalHouseholds) * 100).toFixed(2), "ne")}% आप्रवासित घरपरिवारहरू अन्य जिल्लाबाट आएका छन्।`
                  : "आप्रवासन सम्बन्धी विवरण उपलब्ध छैन।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
