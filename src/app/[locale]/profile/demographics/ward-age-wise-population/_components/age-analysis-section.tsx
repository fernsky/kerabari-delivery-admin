"use client";

import { useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeAnalysisProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  totalPopulation: number;
  wardWiseData: Array<Record<string, any>>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_CATEGORIES: Record<string, string[]>;
}

// Helper function to estimate median age from age group
const getMedianAgeEstimate = (ageGroup: string): number => {
  switch (ageGroup) {
    case "AGE_0_4":
      return 2.5;
    case "AGE_5_9":
      return 7.5;
    case "AGE_10_14":
      return 12.5;
    case "AGE_15_19":
      return 17.5;
    case "AGE_20_24":
      return 22.5;
    case "AGE_25_29":
      return 27.5;
    case "AGE_30_34":
      return 32.5;
    case "AGE_35_39":
      return 37.5;
    case "AGE_40_44":
      return 42.5;
    case "AGE_45_49":
      return 47.5;
    case "AGE_50_54":
      return 52.5;
    case "AGE_55_59":
      return 57.5;
    case "AGE_60_64":
      return 62.5;
    case "AGE_65_69":
      return 67.5;
    case "AGE_70_74":
      return 72.5;
    case "AGE_75_AND_ABOVE":
      return 80;
    default:
      return 30;
  }
};

export default function AgeAnalysisSection({
  overallSummaryByAge,
  totalPopulation,
  wardWiseData,
  AGE_GROUP_NAMES,
  AGE_CATEGORIES,
}: AgeAnalysisProps) {
  // Calculate demographic indicators
  const demographicIndicators = useMemo(() => {
    const childrenPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.CHILDREN.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const youthPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.YOUTH.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const adultPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.ADULT.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const elderlyPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.ELDERLY.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const workingAgePopulation = youthPopulation + adultPopulation;
    const dependentPopulation = childrenPopulation + elderlyPopulation;

    // Calculate dependency ratio
    let dependencyRatio = 0;
    if (workingAgePopulation > 0) {
      dependencyRatio = (dependentPopulation / workingAgePopulation) * 100;
    }

    // Calculate child dependency ratio
    let childDependencyRatio = 0;
    if (workingAgePopulation > 0) {
      childDependencyRatio = (childrenPopulation / workingAgePopulation) * 100;
    }

    // Calculate old-age dependency ratio
    let oldAgeDependencyRatio = 0;
    if (workingAgePopulation > 0) {
      oldAgeDependencyRatio = (elderlyPopulation / workingAgePopulation) * 100;
    }

    // Calculate median age (rough approximation)
    let cumulativePopulation = 0;
    let medianAgeGroup = "";
    const halfPopulation = totalPopulation / 2;

    for (const ageData of overallSummaryByAge) {
      cumulativePopulation += ageData.total;
      if (cumulativePopulation >= halfPopulation && !medianAgeGroup) {
        medianAgeGroup = ageData.ageGroup;
        break;
      }
    }

    // Estimate median age from age group (rough approximation)
    const medianAgeEstimate = getMedianAgeEstimate(medianAgeGroup);

    return {
      childrenPercentage: (childrenPopulation / totalPopulation) * 100,
      youthPercentage: (youthPopulation / totalPopulation) * 100,
      adultPercentage: (adultPopulation / totalPopulation) * 100,
      elderlyPercentage: (elderlyPopulation / totalPopulation) * 100,
      dependencyRatio,
      childDependencyRatio,
      oldAgeDependencyRatio,
      medianAge: medianAgeEstimate,
      childrenPopulation,
      youthPopulation,
      adultPopulation,
      elderlyPopulation,
      workingAgePopulation,
      dependentPopulation,
    };
  }, [overallSummaryByAge, totalPopulation, AGE_CATEGORIES]);

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const AGE_CATEGORIES_EN = {
      CHILDREN: "Children (0-14 years)",
      YOUTH: "Youth (15-29 years)",
      ADULT: "Adults (30-59 years)",
      ELDERLY: "Elderly (60+ years)",
    };

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

      // Add main demographic indicators
      document.body.setAttribute(
        "data-median-age",
        Math.round(demographicIndicators.medianAge).toString(),
      );
      document.body.setAttribute(
        "data-dependency-ratio",
        demographicIndicators.dependencyRatio.toFixed(1),
      );
      document.body.setAttribute(
        "data-children-percentage",
        demographicIndicators.childrenPercentage.toFixed(1),
      );
      document.body.setAttribute(
        "data-youth-percentage",
        demographicIndicators.youthPercentage.toFixed(1),
      );
      document.body.setAttribute(
        "data-elderly-percentage",
        demographicIndicators.elderlyPercentage.toFixed(1),
      );
    }
  }, [demographicIndicators, totalPopulation]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              बाल जनसंख्या (०-१४)
              <span className="sr-only">Children population (0-14 years)</span>
            </div>
            <div className="text-2xl font-bold text-indigo-500">
              {localizeNumber(
                demographicIndicators.childrenPercentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{
                  width: `${demographicIndicators.childrenPercentage}%`,
                }}
              ></div>
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              {localizeNumber(
                demographicIndicators.childrenPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              युवा जनसंख्या (१५-२९)
              <span className="sr-only">Youth population (15-29 years)</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">
              {localizeNumber(
                demographicIndicators.youthPercentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${demographicIndicators.youthPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              {localizeNumber(
                demographicIndicators.youthPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वयस्क जनसंख्या (३०-५९)
              <span className="sr-only">Adult population (30-59 years)</span>
            </div>
            <div className="text-2xl font-bold text-violet-500">
              {localizeNumber(
                demographicIndicators.adultPercentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${demographicIndicators.adultPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              {localizeNumber(
                demographicIndicators.adultPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वृद्ध जनसंख्या (६० माथि)
              <span className="sr-only">Elderly population (60+ years)</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              {localizeNumber(
                demographicIndicators.elderlyPercentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${demographicIndicators.elderlyPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              {localizeNumber(
                demographicIndicators.elderlyPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className="bg-muted/50 p-4 rounded-lg mt-8"
        data-analysis-type="demographic-indicators"
        data-dependency-ratio={demographicIndicators.dependencyRatio.toFixed(1)}
        data-median-age={Math.round(demographicIndicators.medianAge)}
      >
        <h3 className="text-xl font-medium mb-4">
          जनसांख्यिकीय सूचकहरू
          <span className="sr-only">Demographic Indicators of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="dependency-ratio"
          >
            <h4 className="font-medium mb-2">
              जनसांख्यिक निर्भरता अनुपात
              <span className="sr-only">Demographic Dependency Ratio</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                demographicIndicators.dependencyRatio.toFixed(1),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति {localizeNumber("१००", "ne")} कार्यशील उमेरका व्यक्तिमा{" "}
              {localizeNumber(
                demographicIndicators.dependencyRatio.toFixed(1),
                "ne",
              )}{" "}
              जना आश्रित व्यक्ति
              <span className="sr-only">
                {demographicIndicators.dependencyRatio.toFixed(1)} dependent
                persons per 100 working-age persons
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="child-dependency-ratio"
          >
            <h4 className="font-medium mb-2">
              बाल निर्भरता अनुपात
              <span className="sr-only">Child Dependency Ratio</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                demographicIndicators.childDependencyRatio.toFixed(1),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति {localizeNumber("१००", "ne")} कार्यशील उमेरका व्यक्तिमा{" "}
              {localizeNumber(
                demographicIndicators.childDependencyRatio.toFixed(1),
                "ne",
              )}{" "}
              जना बालबालिका
              <span className="sr-only">
                {demographicIndicators.childDependencyRatio.toFixed(1)} children
                per 100 working-age persons
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="old-age-dependency-ratio"
          >
            <h4 className="font-medium mb-2">
              वृद्ध निर्भरता अनुपात
              <span className="sr-only">Old-Age Dependency Ratio</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                demographicIndicators.oldAgeDependencyRatio.toFixed(1),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति {localizeNumber("१००", "ne")} कार्यशील उमेरका व्यक्तिमा{" "}
              {localizeNumber(
                demographicIndicators.oldAgeDependencyRatio.toFixed(1),
                "ne",
              )}{" "}
              जना वृद्ध
              <span className="sr-only">
                {demographicIndicators.oldAgeDependencyRatio.toFixed(1)} elderly
                persons per 100 working-age persons
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="median-age"
          >
            <h4 className="font-medium mb-2">
              अनुमानित मध्यम उमेर
              <span className="sr-only">Estimated Median Age</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                Math.round(demographicIndicators.medianAge).toString(),
                "ne",
              )}{" "}
              वर्ष
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              जनसंख्याको मध्यम उमेर
              <span className="sr-only">
                Median age of the population is{" "}
                {Math.round(demographicIndicators.medianAge)} years
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="youth-ratio"
          >
            <h4 className="font-medium mb-2">
              युवा जनसंख्या अनुपात
              <span className="sr-only">Youth Population Ratio</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                demographicIndicators.youthPercentage.toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              जनसांख्यिकीय लाभांशको संकेत
              <span className="sr-only">
                Indicator of demographic dividend, youth make up{" "}
                {demographicIndicators.youthPercentage.toFixed(1)}% of the
                population
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-indicator-type="working-age-population"
          >
            <h4 className="font-medium mb-2">
              कार्यशील उमेर जनसंख्या
              <span className="sr-only">Working Age Population</span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  demographicIndicators.youthPercentage +
                  demographicIndicators.adultPercentage
                ).toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल जनसंख्याको प्रतिशत (१५-५९ वर्ष)
              <span className="sr-only">
                Percentage of total population aged 15-59 years
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          जनसांख्यिकीय प्रवृत्ति र सुझाव
          <span className="sr-only">
            Demographic Trends and Recommendations
          </span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            बुद्धशान्ति गाउँपालिकाको जनसंख्या संरचनाले निम्न नीतिगत निर्देशन
            गर्दछ:
          </p>

          <ul>
            <li>
              <strong>
                बाल जनसंख्या (
                {localizeNumber(
                  demographicIndicators.childrenPercentage.toFixed(1),
                  "ne",
                )}
                %):
              </strong>{" "}
              शिक्षा, पोषण र बाल स्वास्थ्य सेवामा लगानी बढाउने
              <span className="sr-only">
                Children population (
                {demographicIndicators.childrenPercentage.toFixed(1)}%):
                Increase investment in education, nutrition and child health
                services
              </span>
            </li>
            <li>
              <strong>
                युवा जनसंख्या (
                {localizeNumber(
                  demographicIndicators.youthPercentage.toFixed(1),
                  "ne",
                )}
                %):
              </strong>{" "}
              रोजगारी सिर्जना, सीप विकास र उद्यमशीलता प्रवर्द्धन
              <span className="sr-only">
                Youth population (
                {demographicIndicators.youthPercentage.toFixed(1)}%): Job
                creation, skills development and promotion of entrepreneurship
              </span>
            </li>
            <li>
              <strong>
                वृद्ध जनसंख्या (
                {localizeNumber(
                  demographicIndicators.elderlyPercentage.toFixed(1),
                  "ne",
                )}
                %):
              </strong>{" "}
              सामाजिक सुरक्षा, स्वास्थ्य सेवा र जेष्ठ नागरिक हेरचाह कार्यक्रम
              <span className="sr-only">
                Elderly population (
                {demographicIndicators.elderlyPercentage.toFixed(1)}%): Social
                security, healthcare services and elderly care programs
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
