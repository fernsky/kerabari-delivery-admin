"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DeathCauseAnalysisSectionProps {
  overallSummary: Array<{
    deathCause: string;
    deathCauseName: string;
    population: number;
  }>;
  totalDeaths: number;
  deathCauseLabels: Record<string, string>;
  DEATH_CAUSE_NAMES_EN: Record<string, string>;
}

export default function DeathCauseAnalysisSection({
  overallSummary,
  totalDeaths,
  deathCauseLabels,
  DEATH_CAUSE_NAMES_EN,
}: DeathCauseAnalysisSectionProps) {
  // Updated modern aesthetic color palette for death causes
  const DEATH_CAUSE_COLORS = {
    HEART_RELATED_DISEASES: "#6366F1", // Indigo
    RESPIRATORY_DISEASES: "#8B5CF6", // Purple
    CANCER: "#EC4899", // Pink
    DEATH_BY_OLD_AGE: "#F43F5E", // Rose
    COVID19_CORONAVIRUS: "#10B981", // Emerald
    OTHER: "#14B8A6", // Teal
    BRAIN_RELATED: "#06B6D4", // Cyan
    DIABETES: "#3B82F6", // Blue
    KIDNEY_RELATED_DISEASES: "#F59E0B", // Amber
    TRAFFIC_ACCIDENT: "#84CC16", // Lime
    SUICIDE: "#9333EA", // Fuchsia
    BLOOD_PRESSURE: "#EF4444", // Red
  };

  // Calculate disease categories
  const diseaseCategories = [
    "HEART_RELATED_DISEASES",
    "RESPIRATORY_DISEASES",
    "BRAIN_RELATED",
    "CANCER",
    "DIABETES",
    "KIDNEY_RELATED_DISEASES",
    "LIVER_RELATED_DISEASES",
    "BLOOD_PRESSURE",
    "GASTRIC_ULCER_INTESTINAL_DISEASE",
  ];

  const infectiousCategories = [
    "HAIJA",
    "PNEUMONIA",
    "FLU",
    "TUBERCULOSIS",
    "LEPROSY",
    "JAUNDICE_HEPATITIS",
    "TYPHOID",
    "VIRAL_INFLUENZA",
    "ENCEPHALITIS",
    "MENINGITIS",
    "HEPATITIS",
    "MALARIA",
    "KALA_AZAR",
    "HIV_AIDS",
    "OTHER_SEXUALLY_TRANSMITTED_DISEASES",
    "MEASLES",
    "SCABIES",
    "RABIES",
    "COVID19_CORONAVIRUS",
    "OTHER_INFECTIOUS_DISEASES",
  ];

  const accidentCategories = [
    "TRAFFIC_ACCIDENT",
    "OTHER_ACCIDENTS",
    "SUICIDE",
    "NATURAL_DISASTER",
  ];

  const diseaseDeaths = overallSummary
    .filter((item) => diseaseCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const infectiousDeaths = overallSummary
    .filter((item) => infectiousCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const accidentDeaths = overallSummary
    .filter((item) => accidentCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const diseaseRate = ((diseaseDeaths / totalDeaths) * 100).toFixed(2);
  const infectiousRate = ((infectiousDeaths / totalDeaths) * 100).toFixed(2);
  const accidentRate = ((accidentDeaths / totalDeaths) * 100).toFixed(2);

  // Calculate top two death causes ratio if both exist
  const topDeathCause = overallSummary[0];
  const secondDeathCause = overallSummary[1];

  const topTwoDeathCauseRatio =
    topDeathCause && secondDeathCause && secondDeathCause.population > 0
      ? (topDeathCause.population / secondDeathCause.population).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute("data-total-deaths", totalDeaths.toString());

      // Add main death cause data
      if (topDeathCause) {
        const deathCauseNameEN =
          DEATH_CAUSE_NAMES_EN[topDeathCause.deathCause] ||
          topDeathCause.deathCause;
        document.body.setAttribute(
          "data-main-death-cause",
          `${deathCauseNameEN} / ${topDeathCause.deathCauseName}`,
        );
        document.body.setAttribute(
          "data-main-death-cause-count",
          topDeathCause.population.toString(),
        );
        document.body.setAttribute(
          "data-main-death-cause-percentage",
          ((topDeathCause.population / totalDeaths) * 100).toFixed(2),
        );
      }

      // Add category data
      document.body.setAttribute("data-disease-rate", diseaseRate);
      document.body.setAttribute("data-infectious-rate", infectiousRate);
      document.body.setAttribute("data-accident-rate", accidentRate);
      document.body.setAttribute(
        "data-disease-deaths",
        diseaseDeaths.toString(),
      );
      document.body.setAttribute(
        "data-infectious-deaths",
        infectiousDeaths.toString(),
      );
      document.body.setAttribute(
        "data-accident-deaths",
        accidentDeaths.toString(),
      );
    }
  }, [
    overallSummary,
    totalDeaths,
    topDeathCause,
    diseaseRate,
    infectiousRate,
    accidentRate,
    diseaseDeaths,
    infectiousDeaths,
    accidentDeaths,
    DEATH_CAUSE_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Calculate percentage
          const percentage = ((item.population / totalDeaths) * 100).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-death-cause={`${DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause} / ${item.deathCauseName}`}
              data-count={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / overallSummary[0].population) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    DEATH_CAUSE_COLORS[
                      item.deathCause as keyof typeof DEATH_CAUSE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.deathCauseName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {DEATH_CAUSE_NAMES_EN[item.deathCause] || item.deathCause}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")}{" "}
                  मृत्यु
                  <span className="sr-only">
                    ({item.population.toLocaleString()} deaths)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          मृत्युका कारणहरूको विश्लेषण
          <span className="sr-only">Death Cause Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="chronic-disease-rate"
            data-percentage={diseaseRate}
          >
            <h4 className="font-medium mb-2">
              दीर्घ रोगहरू
              <span className="sr-only">
                Chronic Diseases in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(diseaseRate, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(diseaseDeaths.toLocaleString(), "ne")} मृत्यु
              दीर्घ रोगहरूबाट
              <span className="sr-only">
                {diseaseDeaths.toLocaleString()} deaths from chronic diseases
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="infectious-disease-rate"
            data-percentage={infectiousRate}
          >
            <h4 className="font-medium mb-2">
              संक्रामक रोगहरू
              <span className="sr-only">
                Infectious Diseases in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(infectiousRate, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(infectiousDeaths.toLocaleString(), "ne")} मृत्यु
              संक्रामक रोगहरूबाट
              <span className="sr-only">
                {infectiousDeaths.toLocaleString()} deaths from infectious
                diseases
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="accident-rate"
            data-percentage={accidentRate}
          >
            <h4 className="font-medium mb-2">
              दुर्घटना/आत्महत्या
              <span className="sr-only">
                Accidents/Suicide in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(accidentRate, "ne")}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(accidentDeaths.toLocaleString(), "ne")} मृत्यु
              दुर्घटना वा आत्महत्याबाट
              <span className="sr-only">
                {accidentDeaths.toLocaleString()} deaths from accidents or
                suicide
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            मृत्युका कारण वर्गीकरण
            <span className="sr-only">Death Cause Classification</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="text-sm font-medium">मुटु र रक्तनलीका रोगहरू</h5>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(
                  (
                    (overallSummary.find(
                      (item) => item.deathCause === "HEART_RELATED_DISEASES",
                    )?.population || 0) +
                    (overallSummary.find(
                      (item) => item.deathCause === "BLOOD_PRESSURE",
                    )?.population || 0)
                  ).toLocaleString(),
                  "ne",
                )}{" "}
                (
                {localizeNumber(
                  (
                    (((overallSummary.find(
                      (item) => item.deathCause === "HEART_RELATED_DISEASES",
                    )?.population || 0) +
                      (overallSummary.find(
                        (item) => item.deathCause === "BLOOD_PRESSURE",
                      )?.population || 0)) /
                      totalDeaths) *
                    100
                  ).toFixed(1),
                  "ne",
                )}
                %)
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium">
                श्वासप्रश्वास सम्बन्धी रोगहरू
              </h5>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(
                  (
                    (overallSummary.find(
                      (item) => item.deathCause === "RESPIRATORY_DISEASES",
                    )?.population || 0) +
                    (overallSummary.find((item) => item.deathCause === "ASTHMA")
                      ?.population || 0) +
                    (overallSummary.find(
                      (item) => item.deathCause === "PNEUMONIA",
                    )?.population || 0)
                  ).toLocaleString(),
                  "ne",
                )}{" "}
                (
                {localizeNumber(
                  (
                    (((overallSummary.find(
                      (item) => item.deathCause === "RESPIRATORY_DISEASES",
                    )?.population || 0) +
                      (overallSummary.find(
                        (item) => item.deathCause === "ASTHMA",
                      )?.population || 0) +
                      (overallSummary.find(
                        (item) => item.deathCause === "PNEUMONIA",
                      )?.population || 0)) /
                      totalDeaths) *
                    100
                  ).toFixed(1),
                  "ne",
                )}
                %)
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium">क्यान्सर</h5>
              <p className="text-sm text-muted-foreground">
                {localizeNumber(
                  (
                    overallSummary.find((item) => item.deathCause === "CANCER")
                      ?.population || 0
                  ).toLocaleString(),
                  "ne",
                )}{" "}
                (
                {localizeNumber(
                  (
                    ((overallSummary.find(
                      (item) => item.deathCause === "CANCER",
                    )?.population || 0) /
                      totalDeaths) *
                    100
                  ).toFixed(1),
                  "ne",
                )}
                %)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            उमेर अनुसार मृत्युको प्रवृत्ति
            <span className="sr-only">Age-based Death Trends</span>
          </h4>
          <p className="text-sm">
            वृद्धावस्थामा मृत्यु (कालगतिले मर्नु):
            <span className="font-medium ml-1">
              {localizeNumber(
                (
                  ((overallSummary.find(
                    (item) => item.deathCause === "DEATH_BY_OLD_AGE",
                  )?.population || 0) /
                    totalDeaths) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %
            </span>
            <span className="sr-only">
              Death by old age:
              {(
                ((overallSummary.find(
                  (item) => item.deathCause === "DEATH_BY_OLD_AGE",
                )?.population || 0) /
                  totalDeaths) *
                100
              ).toFixed(1)}
              %
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          यो तथ्याङ्क गाउँपालिकाको स्वास्थ्य योजना, रोग नियन्त्रण र स्वास्थ्य
          सेवाको विस्तारका लागि महत्त्वपूर्ण आधार हो। स्वास्थ्य सम्बन्धी थप
          जानकारीका लागि स्थानीय स्वास्थ्य केन्द्रमा सम्पर्क गर्नुहोस्।
        </p>
      </div>
    </>
  );
}
