"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface EconomicallyActivePopulationAnalysisSectionProps {
  overallSummary: Array<{
    ageGroup: string;
    ageGroupName: string;
    population: number;
  }>;
  totalPopulation: number;
  dependencyRatios: Array<{
    wardNumber: number;
    dependentPopulation: number;
    workingAgePopulation: number;
    ratio: number;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_GROUP_NAMES_EN: Record<string, string>;
}

export default function EconomicallyActivePopulationAnalysisSection({
  overallSummary,
  totalPopulation,
  dependencyRatios,
  AGE_GROUP_NAMES,
  AGE_GROUP_NAMES_EN,
}: EconomicallyActivePopulationAnalysisSectionProps) {
  // Updated modern aesthetic color palette for age groups
  const AGE_GROUP_COLORS = {
    AGE_0_TO_14: "#3B82F6", // Blue for children
    AGE_15_TO_59: "#10B981", // Green for working age
    AGE_60_PLUS: "#F43F5E", // Rose for elderly
  };

  // Calculate working age population and dependent population
  const workingAgePopulation =
    overallSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
      ?.population || 0;

  const dependentPopulation = totalPopulation - workingAgePopulation;

  const dependencyRatio =
    workingAgePopulation > 0
      ? ((dependentPopulation / workingAgePopulation) * 100).toFixed(2)
      : "0";

  // Calculate child and elderly dependency ratios
  const childPopulation =
    overallSummary.find((item) => item.ageGroup === "AGE_0_TO_14")
      ?.population || 0;

  const elderlyPopulation =
    overallSummary.find((item) => item.ageGroup === "AGE_60_PLUS")
      ?.population || 0;

  const childDependencyRatio =
    workingAgePopulation > 0
      ? ((childPopulation / workingAgePopulation) * 100).toFixed(2)
      : "0";

  const elderlyDependencyRatio =
    workingAgePopulation > 0
      ? ((elderlyPopulation / workingAgePopulation) * 100).toFixed(2)
      : "0";

  // Find ward with highest and lowest dependency ratios
  const highestDependencyWard = [...dependencyRatios].sort(
    (a, b) => b.ratio - a.ratio,
  )[0];
  const lowestDependencyWard = [...dependencyRatios].sort(
    (a, b) => a.ratio - b.ratio,
  )[0];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        totalPopulation.toString(),
      );

      // Add working age population data
      document.body.setAttribute(
        "data-working-age-population",
        workingAgePopulation.toString(),
      );
      document.body.setAttribute(
        "data-working-age-percentage",
        ((workingAgePopulation / totalPopulation) * 100).toFixed(2),
      );

      // Add dependency data
      document.body.setAttribute("data-dependency-ratio", dependencyRatio);
      document.body.setAttribute(
        "data-dependent-population",
        dependentPopulation.toString(),
      );

      // Add child and elderly data
      document.body.setAttribute(
        "data-child-population",
        childPopulation.toString(),
      );
      document.body.setAttribute(
        "data-elderly-population",
        elderlyPopulation.toString(),
      );
    }
  }, [
    overallSummary,
    totalPopulation,
    workingAgePopulation,
    dependentPopulation,
    dependencyRatio,
    childPopulation,
    elderlyPopulation,
    childDependencyRatio,
    elderlyDependencyRatio,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => {
          // Calculate percentage
          const percentage = (
            (item.population / totalPopulation) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-age-group={`${AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup} / ${item.ageGroupName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population /
                      Math.max(...overallSummary.map((i) => i.population))) *
                      100,
                    100,
                  )}%`,
                  backgroundColor:
                    AGE_GROUP_COLORS[
                      item.ageGroup as keyof typeof AGE_GROUP_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.ageGroupName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")}{" "}
                  व्यक्ति
                  <span className="sr-only">
                    ({item.population.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          आर्थिक सक्रिय जनसंख्या विश्लेषण
          <span className="sr-only">
            Economically Active Population Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="working-age-population"
            data-percentage={(
              (workingAgePopulation / totalPopulation) *
              100
            ).toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              कार्य उमेर जनसंख्या (१५-५९ वर्ष)
              <span className="sr-only">
                Working Age Population in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                ((workingAgePopulation / totalPopulation) * 100).toFixed(2),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(workingAgePopulation.toLocaleString(), "ne")}{" "}
              व्यक्ति आर्थिक रूपमा सक्रिय उमेरका
              <span className="sr-only">
                {workingAgePopulation.toLocaleString()} people are of working
                age
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="dependency-ratio"
            data-ratio={dependencyRatio}
          >
            <h4 className="font-medium mb-2">
              कुल निर्भरता अनुपात
              <span className="sr-only">Dependency Ratio in Khajura</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(dependencyRatio, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              हरेक १०० कार्य उमेरका व्यक्तिहरूमा{" "}
              {localizeNumber(dependencyRatio, "ne")} आश्रित व्यक्तिहरू
              <span className="sr-only">
                {dependencyRatio} dependent persons for every 100 working-age
                persons
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            निर्भरता अनुपात विश्लेषण
            <span className="sr-only">Dependency Ratio Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                बाल निर्भरता अनुपात (०-१४ वर्ष)
              </h5>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(childDependencyRatio, "ne")}% (
                {localizeNumber(childPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति)
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(parseFloat(childDependencyRatio), 100)}%`,
                    backgroundColor: AGE_GROUP_COLORS.AGE_0_TO_14,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium">
                वृद्ध निर्भरता अनुपात (६०+ वर्ष)
              </h5>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(elderlyDependencyRatio, "ne")}% (
                {localizeNumber(elderlyPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति)
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(parseFloat(elderlyDependencyRatio), 100)}%`,
                    backgroundColor: AGE_GROUP_COLORS.AGE_60_PLUS,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा बढी निर्भरता अनुपात
              </h5>
              <p className="text-sm">
                <strong>
                  वडा{" "}
                  {localizeNumber(
                    highestDependencyWard?.wardNumber.toString() || "",
                    "ne",
                  )}
                  :
                </strong>{" "}
                {localizeNumber(
                  highestDependencyWard?.ratio.toFixed(2) || "",
                  "ne",
                )}
                %
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा कम निर्भरता अनुपात
              </h5>
              <p className="text-sm">
                <strong>
                  वडा{" "}
                  {localizeNumber(
                    lowestDependencyWard?.wardNumber.toString() || "",
                    "ne",
                  )}
                  :
                </strong>{" "}
                {localizeNumber(
                  lowestDependencyWard?.ratio.toFixed(2) || "",
                  "ne",
                )}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
