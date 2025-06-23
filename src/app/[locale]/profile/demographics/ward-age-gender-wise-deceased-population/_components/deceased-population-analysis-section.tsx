"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DeceasedPopulationAnalysisSectionProps {
  totalDeceasedPopulation: number;
  genderTotals: { male: number; female: number; other: number };
  ageGroupsAnalysis: {
    mostAffected: any;
    leastAffected: any;
    elderlyPercentage: string;
    childrenPercentage: string;
  };
  mostAffectedWard: any;
  ageGroupChartData: Array<{
    ageGroup: string;
    ageGroupEn: string;
    ageGroupKey: string;
    [key: string]: any;
  }>;
  wardChartData: Array<{
    ward: string;
    wardNumber: number;
    [key: string]: any;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_GROUP_NAMES_EN: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  GENDER_NAMES_EN: Record<string, string>;
}

export default function DeceasedPopulationAnalysisSection({
  totalDeceasedPopulation,
  genderTotals,
  ageGroupsAnalysis,
  mostAffectedWard,
  ageGroupChartData,
  wardChartData,
  AGE_GROUP_NAMES,
  AGE_GROUP_NAMES_EN,
  GENDER_NAMES,
  GENDER_NAMES_EN,
}: DeceasedPopulationAnalysisSectionProps) {
  // Updated modern aesthetic color palette for gender
  const GENDER_COLORS = {
    MALE: "#1E40AF", // Blue for male
    FEMALE: "#BE185D", // Pink for female
    OTHER: "#047857", // Green for other
  };

  // Calculate gender percentages
  const malePercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.male / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  const femalePercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.female / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  const otherPercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.other / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-deceased-population",
        totalDeceasedPopulation.toString(),
      );

      // Add most affected age group data
      if (ageGroupsAnalysis.mostAffected) {
        document.body.setAttribute(
          "data-most-affected-age-group",
          `${ageGroupsAnalysis.mostAffected.ageGroup} / ${ageGroupsAnalysis.mostAffected.ageGroupEn}`,
        );
        document.body.setAttribute(
          "data-most-affected-age-group-percentage",
          (
            (ageGroupsAnalysis.mostAffected.total / totalDeceasedPopulation) *
            100
          ).toFixed(2),
        );
      }

      // Add ward data
      document.body.setAttribute(
        "data-most-affected-ward",
        mostAffectedWard?.wardNumber.toString() || "",
      );

      // Add gender data
      document.body.setAttribute(
        "data-male-deceased-percentage",
        malePercentage,
      );
      document.body.setAttribute(
        "data-female-deceased-percentage",
        femalePercentage,
      );
    }
  }, [
    totalDeceasedPopulation,
    ageGroupsAnalysis.mostAffected,
    mostAffectedWard,
    malePercentage,
    femalePercentage,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {/* Gender distribution cards */}
        <div
          className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
          data-gender="male"
          data-percentage={malePercentage}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${Math.min(parseFloat(malePercentage), 100)}%`,
              backgroundColor: GENDER_COLORS.MALE,
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {GENDER_NAMES.MALE}
              <span className="sr-only">{GENDER_NAMES_EN.MALE}</span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(malePercentage, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(genderTotals.male.toLocaleString(), "ne")} व्यक्ति
              <span className="sr-only">
                ({genderTotals.male.toLocaleString()} people)
              </span>
            </p>
          </div>
        </div>

        <div
          className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
          data-gender="female"
          data-percentage={femalePercentage}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${Math.min(parseFloat(femalePercentage), 100)}%`,
              backgroundColor: GENDER_COLORS.FEMALE,
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {GENDER_NAMES.FEMALE}
              <span className="sr-only">{GENDER_NAMES_EN.FEMALE}</span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(femalePercentage, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(genderTotals.female.toLocaleString(), "ne")}{" "}
              व्यक्ति
              <span className="sr-only">
                ({genderTotals.female.toLocaleString()} people)
              </span>
            </p>
          </div>
        </div>

        {genderTotals.other > 0 && (
          <div
            className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            data-gender="other"
            data-percentage={otherPercentage}
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${Math.min(parseFloat(otherPercentage), 100)}%`,
                backgroundColor: GENDER_COLORS.OTHER,
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">
                {GENDER_NAMES.OTHER}
                <span className="sr-only">{GENDER_NAMES_EN.OTHER}</span>
              </h3>
              <p className="text-2xl font-bold">
                {localizeNumber(otherPercentage, "ne")}%
              </p>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(genderTotals.other.toLocaleString(), "ne")}{" "}
                व्यक्ति
                <span className="sr-only">
                  ({genderTotals.other.toLocaleString()} people)
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          मृत्युदर विश्लेषण
          <span className="sr-only">Mortality Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-affected-age-group"
            data-percentage={
              ageGroupsAnalysis.mostAffected
                ? (
                    (ageGroupsAnalysis.mostAffected.total /
                      totalDeceasedPopulation) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी मृत्यु भएको उमेर समूह
              <span className="sr-only">
                Most Affected Age Group in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {ageGroupsAnalysis.mostAffected?.ageGroup || ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                totalDeceasedPopulation > 0 && ageGroupsAnalysis.mostAffected
                  ? (
                      (ageGroupsAnalysis.mostAffected.total /
                        totalDeceasedPopulation) *
                      100
                    ).toFixed(2)
                  : "0",
                "ne",
              )}
              % (
              {localizeNumber(
                ageGroupsAnalysis.mostAffected?.total.toString() || "0",
                "ne",
              )}{" "}
              व्यक्ति)
              <span className="sr-only">
                {totalDeceasedPopulation > 0 && ageGroupsAnalysis.mostAffected
                  ? (
                      (ageGroupsAnalysis.mostAffected.total /
                        totalDeceasedPopulation) *
                      100
                    ).toFixed(2)
                  : "0"}
                % ({ageGroupsAnalysis.mostAffected?.total || 0} people)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="mortality-distribution"
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी मृत्यु भएको वडा
              <span className="sr-only">
                Ward with Highest Mortality in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(mostAffectedWard?.ward || "", "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(mostAffectedWard?.total.toString() || "0", "ne")}{" "}
              व्यक्ति
              <span className="sr-only">
                {mostAffectedWard?.total || 0} deceased people
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            उमेर समूह अनुसार मृत्यु विश्लेषण
            <span className="sr-only">Age Group-wise Mortality Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                जेष्ठ नागरिक (६० वर्ष माथि) मृत्यु दर
              </h5>
              <p className="text-sm text-muted-foreground">
                कुल मृत्युको{" "}
                {localizeNumber(ageGroupsAnalysis.elderlyPercentage, "ne")}%
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-600"
                  style={{
                    width: `${Math.min(parseFloat(ageGroupsAnalysis.elderlyPercentage), 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium">
                बालबालिका (१५ वर्ष मुनि) मृत्यु दर
              </h5>
              <p className="text-sm text-muted-foreground">
                कुल मृत्युको{" "}
                {localizeNumber(ageGroupsAnalysis.childrenPercentage, "ne")}%
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min(parseFloat(ageGroupsAnalysis.childrenPercentage), 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">
                लिङ्ग अनुसार मृत्यु दर तुलना
              </h5>
              <ul className="mt-2 text-sm space-y-1">
                <li className="flex justify-between">
                  <span>
                    {GENDER_NAMES.MALE} बनाम {GENDER_NAMES.FEMALE}:
                  </span>
                  <span className="font-medium">
                    {genderTotals.male > genderTotals.female
                      ? `${GENDER_NAMES.MALE} ${localizeNumber((genderTotals.male / Math.max(genderTotals.female, 1)).toFixed(1), "ne")} गुणा बढी`
                      : genderTotals.female > genderTotals.male
                        ? `${GENDER_NAMES.FEMALE} ${localizeNumber((genderTotals.female / Math.max(genderTotals.male, 1)).toFixed(1), "ne")} गुणा बढी`
                        : "बराबर"}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">
                मृत्युको कारण र रोकथाम सम्बन्धी सुझाव
              </h5>
              <p className="mt-2 text-sm text-muted-foreground">
                {ageGroupsAnalysis.elderlyPercentage &&
                parseFloat(ageGroupsAnalysis.elderlyPercentage) > 50
                  ? "ज्येष्ठ नागरिकहरूको स्वास्थ्य सेवामा पहुँच बढाउन आवश्यक छ।"
                  : ageGroupsAnalysis.childrenPercentage &&
                      parseFloat(ageGroupsAnalysis.childrenPercentage) > 20
                    ? "बालबालिकाको मृत्युदर कम गर्न खोप र पोषण कार्यक्रममा ध्यान दिनु आवश्यक छ।"
                    : "सबै उमेर समूहमा स्वास्थ्य सचेतना र सेवामा पहुँच बढाउन आवश्यक छ।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
