"use client";

import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DisabilityCauseAnalysisProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalDisabilityPopulation: number;
    mostCommonCause: string;
    mostCommonCausePopulation: number;
    mostCommonCausePercentage: string;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_NAMES_EN: Record<string, string>;
}

export default function DisabilityCauseAnalysisSection({
  overallSummary,
  totalPopulationWithDisability,
  wardWiseAnalysis,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_NAMES_EN,
}: DisabilityCauseAnalysisProps) {
  // Define colors for visualization with updated palette
  const DISABILITY_CAUSE_COLORS = {
    CONGENITAL: "#6366F1", // Indigo
    ACCIDENT: "#EF4444", // Red
    MALNUTRITION: "#F59E0B", // Amber
    DISEASE: "#10B981", // Emerald
    CONFLICT: "#8B5CF6", // Purple
    OTHER: "#64748B", // Slate
  };

  // Calculate top two disability causes ratio if both exist
  const topCause = overallSummary[0];
  const secondCause = overallSummary[1];

  const topTwoCausesRatio =
    topCause && secondCause && secondCause.population > 0
      ? (topCause.population / secondCause.population).toFixed(2)
      : "N/A";

  // Group by broader categories
  const groupedCategories = {
    "जन्मजात र वंशाणुगत": ["CONGENITAL"],
    "दुर्घटना र चोटपटक": ["ACCIDENT"],
    "स्वास्थ्य समस्या": ["DISEASE", "MALNUTRITION"],
    "द्वन्द्व र हिंसा": ["CONFLICT"],
    "अन्य कारणहरू": ["OTHER"],
  };

  // Calculate populations by broader category
  const broadCategoryData = Object.entries(groupedCategories)
    .map(([category, causeList]) => {
      const totalInCategory = overallSummary
        .filter((item) => causeList.includes(item.disabilityCause))
        .reduce((sum, item) => sum + item.population, 0);

      const percentage =
        totalPopulationWithDisability > 0
          ? (totalInCategory / totalPopulationWithDisability) * 100
          : 0;

      return {
        category,
        population: totalInCategory,
        percentage: percentage.toFixed(2),
      };
    })
    .sort((a, b) => b.population - a.population);

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-disability-population",
        localizeNumber(totalPopulationWithDisability.toString(), "ne"),
      );

      // Add main disability cause data
      if (topCause) {
        const causeNameEN =
          DISABILITY_CAUSE_NAMES_EN[topCause.disabilityCause] ||
          topCause.disabilityCause;
        document.body.setAttribute(
          "data-main-disability-cause",
          `${causeNameEN} / ${topCause.disabilityCauseName}`,
        );
        document.body.setAttribute(
          "data-main-cause-population",
          localizeNumber(topCause.population.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-main-cause-percentage",
          localizeNumber(
            (
              (topCause.population / totalPopulationWithDisability) *
              100
            ).toFixed(2),
            "ne",
          ),
        );
      }

      // Add second disability cause data
      if (secondCause) {
        const causeNameEN =
          DISABILITY_CAUSE_NAMES_EN[secondCause.disabilityCause] ||
          secondCause.disabilityCause;
        document.body.setAttribute(
          "data-second-disability-cause",
          `${causeNameEN} / ${secondCause.disabilityCauseName}`,
        );
        document.body.setAttribute(
          "data-second-cause-population",
          localizeNumber(secondCause.population.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-second-cause-percentage",
          localizeNumber(
            (
              (secondCause.population / totalPopulationWithDisability) *
              100
            ).toFixed(2),
            "ne",
          ),
        );
      }

      // Add broader category data
      document.body.setAttribute(
        "data-disability-categories",
        Object.keys(groupedCategories).join(", "),
      );
    }
  }, [
    overallSummary,
    totalPopulationWithDisability,
    groupedCategories,
    DISABILITY_CAUSE_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English disability cause name for SEO
          const causeEN =
            DISABILITY_CAUSE_NAMES_EN[item.disabilityCause] ||
            item.disabilityCause;

          // Calculate percentage
          const percentage = (
            (item.population / totalPopulationWithDisability) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-disability-cause={`${causeEN} / ${item.disabilityCauseName}`}
              data-population={item.population}
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
                    DISABILITY_CAUSE_COLORS[
                      item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.disabilityCauseName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{causeEN}</span>
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
          बुद्धशान्ति गाउँपालिकाको अपाङ्गता कारण विश्लेषण
          <span className="sr-only">
            Disability Cause Analysis of Khajura Rural Municipality
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-disability-cause"
            data-cause-name={topCause?.disabilityCause}
            data-cause-percentage={
              topCause
                ? (
                    (topCause.population / totalPopulationWithDisability) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              बुद्धशान्ति गाउँपालिकाको प्रमुख अपाङ्गता कारण
              <span className="sr-only">
                Main Disability Cause in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topCause ? topCause.disabilityCauseName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCause
                ? `कुल अपाङ्गता जनसंख्याको ${localizeNumber(
                    (
                      (topCause.population / totalPopulationWithDisability) *
                      100
                    ).toFixed(2),
                    "ne",
                  )}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topCause
                  ? `${(
                      (topCause.population / totalPopulationWithDisability) *
                      100
                    ).toFixed(
                      2,
                    )}% of total disability population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="disability-cause-ratio"
            data-ratio={topTwoCausesRatio}
            data-primary-cause={topCause?.disabilityCause}
            data-secondary-cause={secondCause?.disabilityCause}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो कारण अनुपात
              <span className="sr-only">
                Primary to Secondary Disability Cause Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoCausesRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCause && secondCause
                ? `हरेक ${localizeNumber(topTwoCausesRatio, "ne")} ${
                    topCause.disabilityCauseName
                  } का लागि १ ${secondCause.disabilityCauseName}`
                : ""}
              <span className="sr-only">
                {topCause && secondCause
                  ? `For every ${topTwoCausesRatio} ${topCause.disabilityCause.toLowerCase()} cases, there is 1 ${secondCause.disabilityCause.toLowerCase()} case in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Broader category analysis */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">
            अपाङ्गताका कारणहरूको व्यापक श्रेणीकरण
            <span className="sr-only">
              Broader Categorization of Disability Causes
            </span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadCategoryData.map((category, index) => (
              <div
                key={index}
                className="bg-card p-3 rounded border text-center"
                data-category={category.category}
                data-category-population={category.population}
                data-category-percentage={category.percentage}
              >
                <h5 className="font-medium text-sm mb-2">
                  {category.category}
                </h5>
                <p className="text-lg font-bold">
                  {localizeNumber(category.percentage, "ne")}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {localizeNumber(category.population.toLocaleString(), "ne")}{" "}
                  व्यक्ति
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ward-wise insights */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">
            वडागत अपाङ्गता कारण अन्तर्दृष्टि
            <span className="sr-only">Ward-wise Disability Cause Insights</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-3 rounded border">
              <h5 className="font-medium text-sm mb-2">
                सबैभन्दा बढी अपाङ्गता भएको वडा
              </h5>
              {wardWiseAnalysis.length > 0 && (
                <>
                  <p className="text-lg font-bold">
                    वडा{" "}
                    {localizeNumber(
                      Math.max(
                        ...wardWiseAnalysis.map(
                          (w) => w.totalDisabilityPopulation,
                        ),
                      ) ===
                        wardWiseAnalysis.find(
                          (w) =>
                            w.totalDisabilityPopulation ===
                            Math.max(
                              ...wardWiseAnalysis.map(
                                (w) => w.totalDisabilityPopulation,
                              ),
                            ),
                        )?.totalDisabilityPopulation
                        ? wardWiseAnalysis.find(
                            (w) =>
                              w.totalDisabilityPopulation ===
                              Math.max(
                                ...wardWiseAnalysis.map(
                                  (w) => w.totalDisabilityPopulation,
                                ),
                              ),
                          )?.wardNumber || 0
                        : 0,
                      "ne",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {localizeNumber(
                      Math.max(
                        ...wardWiseAnalysis.map(
                          (w) => w.totalDisabilityPopulation,
                        ),
                      ).toLocaleString(),
                      "ne",
                    )}{" "}
                    अपाङ्गता भएका व्यक्ति
                  </p>
                </>
              )}
            </div>

            <div className="bg-card p-3 rounded border">
              <h5 className="font-medium text-sm mb-2">
                सबैभन्दा कम अपाङ्गता भएको वडा
              </h5>
              {wardWiseAnalysis.length > 0 && (
                <>
                  <p className="text-lg font-bold">
                    वडा{" "}
                    {localizeNumber(
                      Math.min(
                        ...wardWiseAnalysis.map(
                          (w) => w.totalDisabilityPopulation,
                        ),
                      ) ===
                        wardWiseAnalysis.find(
                          (w) =>
                            w.totalDisabilityPopulation ===
                            Math.min(
                              ...wardWiseAnalysis.map(
                                (w) => w.totalDisabilityPopulation,
                              ),
                            ),
                        )?.totalDisabilityPopulation
                        ? wardWiseAnalysis.find(
                            (w) =>
                              w.totalDisabilityPopulation ===
                              Math.min(
                                ...wardWiseAnalysis.map(
                                  (w) => w.totalDisabilityPopulation,
                                ),
                              ),
                          )?.wardNumber || 0
                        : 0,
                      "ne",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {localizeNumber(
                      Math.min(
                        ...wardWiseAnalysis.map(
                          (w) => w.totalDisabilityPopulation,
                        ),
                      ).toLocaleString(),
                      "ne",
                    )}{" "}
                    अपाङ्गता भएका व्यक्ति
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
