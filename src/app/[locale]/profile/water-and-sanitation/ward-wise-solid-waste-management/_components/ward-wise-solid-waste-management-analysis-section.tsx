import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSolidWasteManagementAnalysisSectionProps {
  totalHouseholds: number;
  wasteManagementTotals: Record<string, number>;
  wasteManagementPercentages: Record<string, number>;
  sourceMap: Record<string, string>;
  wardWiseHomeCollectionPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_COLORS: Record<string, string>;
}

export default function WardWiseSolidWasteManagementAnalysisSection({
  totalHouseholds,
  wasteManagementTotals,
  wasteManagementPercentages,
  sourceMap,
  wardWiseHomeCollectionPercentage,
  highestHomeCollectionWard,
  lowestHomeCollectionWard,
  WASTE_MANAGEMENT_COLORS,
}: WardWiseSolidWasteManagementAnalysisSectionProps) {
  // Group waste management methods into categories for environmental impact calculation
  const environmentallyFriendlyMethods = [
    "HOME_COLLECTION",
    "WASTE_COLLECTING_PLACE",
    "COMPOST_MANURE",
  ];
  const moderateImpactMethods = ["DIGGING"];
  const highImpactMethods = ["BURNING", "RIVER", "ROAD_OR_PUBLIC_PLACE"];

  // Calculate environmental impact score based on waste management types
  // Different waste management methods have different weights for environmental impact calculation
  let environmentalImpactScore = 0;
  let totalWeightedScore = 0;

  // Calculate weighted environmental score
  Object.entries(wasteManagementTotals).forEach(([method, count]) => {
    const percentage = wasteManagementPercentages[method] || 0;

    if (environmentallyFriendlyMethods.includes(method)) {
      environmentalImpactScore += percentage * 1.0;
    } else if (moderateImpactMethods.includes(method)) {
      environmentalImpactScore += percentage * 0.7;
    } else if (highImpactMethods.includes(method)) {
      environmentalImpactScore += percentage * 0.1;
    } else {
      environmentalImpactScore += percentage * 0.5; // OTHER methods
    }

    totalWeightedScore += percentage;
  });

  // Normalize to 0-100 scale
  environmentalImpactScore =
    totalWeightedScore > 0
      ? (environmentalImpactScore / totalWeightedScore) * 100
      : 0;

  // Determine environmental impact level based on score
  const environmentalImpactLevel =
    environmentalImpactScore >= 85
      ? "उत्तम (Excellent)"
      : environmentalImpactScore >= 70
        ? "राम्रो (Good)"
        : environmentalImpactScore >= 50
          ? "मध्यम (Average)"
          : "निम्न (Poor)";

  // Find most common waste management method
  let mainWasteManagementMethod = "";
  let mainWasteManagementCount = 0;

  Object.keys(wasteManagementTotals).forEach((method) => {
    if (wasteManagementTotals[method] > mainWasteManagementCount) {
      mainWasteManagementCount = wasteManagementTotals[method];
      mainWasteManagementMethod = method;
    }
  });

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-home-collection-rate": (
      wasteManagementPercentages["HOME_COLLECTION"] || 0
    ).toFixed(2),
    "data-highest-home-collection-ward":
      highestHomeCollectionWard?.wardNumber.toString() || "",
    "data-lowest-home-collection-ward":
      lowestHomeCollectionWard?.wardNumber.toString() || "",
    "data-environmental-impact-score": environmentalImpactScore.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.entries(wasteManagementTotals)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4) // Show top 4 methods
          .map(([method, total]) => {
            const percentage = wasteManagementPercentages[method] || 0;
            const name = sourceMap[method] || method;
            const color = WASTE_MANAGEMENT_COLORS[method] || "#6B7280";

            return (
              <div
                key={method}
                className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: color,
                    opacity: 0.2,
                    zIndex: 0,
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-2">
                    {name}
                    <span className="sr-only">{method}</span>
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
          फोहोरमैला व्यवस्थापनको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Solid Waste Management Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-home-collection"
            data-ward-number={highestHomeCollectionWard?.wardNumber}
            data-percentage={highestHomeCollectionWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              घरमै फोहोर संकलन बढी भएको वडा
              <span className="sr-only">
                Ward with Highest Home Waste Collection in Khajura Rural
                Municipality
              </span>
            </h4>
            {highestHomeCollectionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"],
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestHomeCollectionWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    घरमै संकलन दर:{" "}
                    {localizeNumber(
                      highestHomeCollectionWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {highestHomeCollectionWard.percentage.toFixed(2)}% home
                      collection rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा घरमै फोहोर संकलन प्रणालीको पहुँच सबैभन्दा बढी रहेको
                  छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      highestHomeCollectionWard.percentage -
                      (wasteManagementPercentages["HOME_COLLECTION"] || 0)
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा फोहोरमैला व्यवस्थापनको राम्रो संरचना र
                  प्रभावकारी नीति रहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-home-collection"
            data-ward-number={lowestHomeCollectionWard?.wardNumber}
            data-percentage={lowestHomeCollectionWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              घरमै फोहोर संकलन कम भएको वडा
              <span className="sr-only">
                Ward with Low Home Waste Collection in Khajura
              </span>
            </h4>
            {lowestHomeCollectionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WASTE_MANAGEMENT_COLORS["RIVER"],
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      lowestHomeCollectionWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    घरमै संकलन दर:{" "}
                    {localizeNumber(
                      lowestHomeCollectionWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {lowestHomeCollectionWard.percentage.toFixed(2)}% home
                      collection rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक क्षेत्र</h5>
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm">
                  यस वडामा घरमै फोहोर संकलन सेवा अत्यन्त कम रहेकाले फोहोर
                  व्यवस्थापन सेवा विस्तार गर्नुपर्ने आवश्यकता देखिन्छ। यहाँ नदी
                  वा सडकमा फोहोर फाल्ने प्रवृत्ति बढी हुन सक्ने जोखिम रहेको छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वातावरणीय प्रभाव सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(environmentalImpactScore.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {environmentalImpactLevel}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> वातावरणीय प्रभाव सूचकाङ्क
                  विभिन्न फोहोर व्यवस्थापन विधिहरूको भारित औसतमा आधारित छ, जसमा
                  घरमै संकलन र कम्पोस्ट मल विधिलाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(environmentalImpactScore.toFixed(1), "ne")}{" "}
                  अंकले {environmentalImpactLevel} वातावरणीय प्रभाव दर्शाउँछ।
                  सुधारका लागि अनुचित निष्कासन विधिहरू न्यूनीकरण गर्दै घरमै
                  संकलन र वैज्ञानिक फोहोर व्यवस्थापन विधिहरू प्रवर्द्धन
                  गर्नुपर्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">
              फोहोर व्यवस्थापन विधिहरूको विश्लेषण
            </h4>

            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा बढी प्रयोग हुने विधिहरू
              </h5>
              <div className="mt-2 space-y-3">
                {Object.entries(wasteManagementTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([method, count], index) => {
                    const percentage = (
                      (count / totalHouseholds) *
                      100
                    ).toFixed(2);
                    const color = WASTE_MANAGEMENT_COLORS[method] || "#6B7280";

                    return (
                      <div key={method}>
                        <div className="flex justify-between text-sm">
                          <span>{sourceMap[method] || method}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage, "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${parseFloat(percentage)}%`,
                              backgroundColor: color,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-3 border-t">
                <h5 className="font-medium mb-2">घरमै फोहोर संकलनको अवस्था</h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"],
                      }}
                    ></span>
                    घरमै संकलन
                  </span>
                  <span className="font-medium">
                    {localizeNumber(
                      (
                        wasteManagementPercentages["HOME_COLLECTION"] || 0
                      ).toFixed(2),
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${wasteManagementPercentages["HOME_COLLECTION"] || 0}%`,
                      backgroundColor:
                        WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"],
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
