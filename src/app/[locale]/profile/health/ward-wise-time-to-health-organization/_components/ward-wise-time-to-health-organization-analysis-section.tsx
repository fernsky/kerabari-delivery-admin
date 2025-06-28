import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseTimeToHealthOrganizationAnalysisSectionProps {
  totalHouseholds: number;
  timeCategoryTotals: Record<string, number>;
  timeCategoryPercentages: Record<string, number>;
  wardWiseQuickAccess: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  worstAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  TIME_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  accessibilityIndex: number;
}

export default function WardWiseTimeToHealthOrganizationAnalysisSection({
  totalHouseholds,
  timeCategoryTotals,
  timeCategoryPercentages,
  wardWiseQuickAccess,
  bestAccessWard,
  worstAccessWard,
  TIME_CATEGORIES,
  accessibilityIndex,
}: WardWiseTimeToHealthOrganizationAnalysisSectionProps) {
  // Determine accessibility level based on index score
  const accessibilityLevel =
    accessibilityIndex >= 75
      ? "उत्तम"
      : accessibilityIndex >= 60
        ? "राम्रो"
        : accessibilityIndex >= 40
          ? "मध्यम"
          : "निम्न";

  // Calculate how many households have quick access (under 30 min)
  const quickAccessTotal =
    timeCategoryTotals.UNDER_15_MIN + timeCategoryTotals.UNDER_30_MIN;
  const quickAccessPercentage = (
    (quickAccessTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // Calculate how many households have poor access (1 hour or more)
  const poorAccessTotal = timeCategoryTotals["1_HOUR_OR_MORE"];
  const poorAccessPercentage = (
    (poorAccessTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-quick-access-rate": quickAccessPercentage,
    "data-best-access-ward": bestAccessWard?.wardNumber.toString() || "",
    "data-worst-access-ward": worstAccessWard?.wardNumber.toString() || "",
    "data-accessibility-index": accessibilityIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(TIME_CATEGORIES).map((categoryKey) => {
          const category =
            TIME_CATEGORIES[categoryKey as keyof typeof TIME_CATEGORIES];
          const percentage = timeCategoryPercentages[categoryKey];
          const total = timeCategoryTotals[categoryKey];

          return (
            <div
              key={categoryKey}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: category.color,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {category.name}
                  <span className="sr-only">{category.nameEn}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage.toFixed(2), "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(total.toLocaleString(), "ne")} घरधुरी
                  <span className="sr-only">
                    ({total.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          स्वास्थ्य संस्था पहुँचको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Health Organization Access Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-health-access"
            data-ward-number={bestAccessWard?.wardNumber}
            data-percentage={bestAccessWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              उत्तम स्वास्थ्य पहुँच भएको वडा
              <span className="sr-only">
                Ward with Best Health Facility Access in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestAccessWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: TIME_CATEGORIES.UNDER_15_MIN.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    छिटो पहुँच दर:{" "}
                    {localizeNumber(bestAccessWard.percentage.toFixed(2), "ne")}
                    %
                    <span className="sr-only">
                      {bestAccessWard.percentage.toFixed(2)}% quick access rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा अधिकांश घरधुरीले छिटो स्वास्थ्य सेवा पाउने सुविधा
                  रहेको छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      bestAccessWard.percentage -
                      parseFloat(quickAccessPercentage)
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा स्वास्थ्य पूर्वाधार र स्वास्थ्य संस्थाको
                  पर्याप्त वितरण भएको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-health-access"
            data-ward-number={worstAccessWard?.wardNumber}
            data-percentage={worstAccessWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              कमजोर स्वास्थ्य पहुँच भएको वडा
              <span className="sr-only">
                Ward with Poor Health Facility Access in Khajura
              </span>
            </h4>
            {worstAccessWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: TIME_CATEGORIES["1_HOUR_OR_MORE"].color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstAccessWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    छिटो पहुँच दर:{" "}
                    {localizeNumber(
                      worstAccessWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {worstAccessWard.percentage.toFixed(2)}% quick access rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा स्वास्थ्य संस्था पहुँचको स्थिति कमजोर रहेको देखिन्छ।
                  अधिकांश घरधुरीहरूले स्वास्थ्य सेवा लिन धेरै समय लगाउनु पर्ने
                  अवस्था छ। यस वडामा स्वास्थ्य सेवा विस्तार वा घुम्ती स्वास्थ्य
                  सेवा कार्यक्रम लागू गर्न आवश्यक छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">स्वास्थ्य पहुँच सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(accessibilityIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {accessibilityLevel} स्तर
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> स्वास्थ्य पहुँच सूचकाङ्क
                  विभिन्न समय श्रेणीहरूको भारित औसतमा आधारित छ, जसमा छिटो
                  पहुँचलाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(accessibilityIndex.toFixed(1), "ne")} अंकले{" "}
                  {accessibilityLevel} स्वास्थ्य पहुँच दर्शाउँछ। यसमा सुधारका
                  लागि दूरदराजका क्षेत्रहरूमा स्वास्थ्य सेवा विस्तार गर्नुपर्ने
                  देखिन्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">पहुँच विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                छिटो पहुँच (३० मिनेटभित्र)
              </h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: TIME_CATEGORIES.UNDER_15_MIN.color,
                        }}
                      ></span>
                      {TIME_CATEGORIES.UNDER_15_MIN.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        timeCategoryPercentages.UNDER_15_MIN.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${timeCategoryPercentages.UNDER_15_MIN}%`,
                        backgroundColor: TIME_CATEGORIES.UNDER_15_MIN.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: TIME_CATEGORIES.UNDER_30_MIN.color,
                        }}
                      ></span>
                      {TIME_CATEGORIES.UNDER_30_MIN.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        timeCategoryPercentages.UNDER_30_MIN.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${timeCategoryPercentages.UNDER_30_MIN}%`,
                        backgroundColor: TIME_CATEGORIES.UNDER_30_MIN.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#34A853" }}
                      ></span>
                      छिटो पहुँचको जम्मा
                    </span>
                    <span>{localizeNumber(quickAccessPercentage, "ne")}%</span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    कुल{" "}
                    {localizeNumber(quickAccessTotal.toLocaleString(), "ne")}{" "}
                    घरधुरीले ३० मिनेटभित्र स्वास्थ्य संस्था पुग्न सक्छन्
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
