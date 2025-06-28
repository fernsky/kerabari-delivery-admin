import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseDrinkingWaterSourceAnalysisSectionProps {
  totalHouseholds: number;
  waterSourceGroupTotals: Record<string, number>;
  waterSourceGroupPercentages: Record<string, number>;
  waterSourceTotals: Record<string, number>;
  sourceMap: Record<string, string>;
  wardWisePipedWaterPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  WATER_SOURCE_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
      sources: string[];
    }
  >;
}

export default function WardWiseDrinkingWaterSourceAnalysisSection({
  totalHouseholds,
  waterSourceGroupTotals,
  waterSourceGroupPercentages,
  waterSourceTotals,
  sourceMap,
  wardWisePipedWaterPercentage,
  highestPipedWaterWard,
  lowestPipedWaterWard,
  WATER_SOURCE_GROUPS,
}: WardWiseDrinkingWaterSourceAnalysisSectionProps) {
  // Calculate water quality index based on water source types
  // Different water sources have different weights for quality calculation
  const waterQualityIndex =
    waterSourceGroupPercentages.PIPED_WATER * 1.0 +
    waterSourceGroupPercentages.WELL_WATER * 0.7 +
    waterSourceGroupPercentages.NATURAL_SOURCE * 0.4 +
    waterSourceGroupPercentages.OTHER_SOURCE * 0.5;

  // Determine water quality level based on index score
  const waterQualityLevel =
    waterQualityIndex >= 85
      ? "उत्तम (Excellent)"
      : waterQualityIndex >= 70
        ? "राम्रो (Good)"
        : waterQualityIndex >= 50
          ? "मध्यम (Average)"
          : "निम्न (Poor)";

  // Find most common water source
  let mainWaterSource = "";
  let mainWaterSourceCount = 0;

  Object.keys(waterSourceTotals).forEach((source) => {
    if (waterSourceTotals[source] > mainWaterSourceCount) {
      mainWaterSourceCount = waterSourceTotals[source];
      mainWaterSource = source;
    }
  });

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-piped-water-rate": waterSourceGroupPercentages.PIPED_WATER.toFixed(2),
    "data-highest-piped-water-ward":
      highestPipedWaterWard?.wardNumber.toString() || "",
    "data-lowest-piped-water-ward":
      lowestPipedWaterWard?.wardNumber.toString() || "",
    "data-water-quality-index": waterQualityIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(WATER_SOURCE_GROUPS).map((groupKey) => {
          const group =
            WATER_SOURCE_GROUPS[groupKey as keyof typeof WATER_SOURCE_GROUPS];
          const percentage = waterSourceGroupPercentages[groupKey];
          const total = waterSourceGroupTotals[groupKey];

          return (
            <div
              key={groupKey}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: group.color,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {group.name}
                  <span className="sr-only">{group.nameEn}</span>
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
          खानेपानीका स्रोतहरूको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Drinking Water Sources Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-piped-water"
            data-ward-number={highestPipedWaterWard?.wardNumber}
            data-percentage={highestPipedWaterWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              पाइपको पानी बढी प्रयोग गर्ने वडा
              <span className="sr-only">
                Ward with Highest Piped Water Use in Khajura Rural Municipality
              </span>
            </h4>
            {highestPipedWaterWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WATER_SOURCE_GROUPS.PIPED_WATER.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestPipedWaterWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    पाइपको पानी प्रयोग गर्ने दर:{" "}
                    {localizeNumber(
                      highestPipedWaterWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {highestPipedWaterWard.percentage.toFixed(2)}% piped water
                      usage rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा पाइपको पानी प्रयोग गर्ने घरधुरीहरूको प्रतिशत सबैभन्दा
                  बढी रहेको छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      highestPipedWaterWard.percentage -
                      waterSourceGroupPercentages.PIPED_WATER
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा खानेपानी आपूर्ति प्रणालीको विकास तथा पूर्वाधारमा
                  गरिएको लगानी प्रभावकारी रहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-piped-water"
            data-ward-number={lowestPipedWaterWard?.wardNumber}
            data-percentage={lowestPipedWaterWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              पाइपको पानी कम प्रयोग गर्ने वडा
              <span className="sr-only">
                Ward with Low Piped Water Use in Khajura
              </span>
            </h4>
            {lowestPipedWaterWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WATER_SOURCE_GROUPS.NATURAL_SOURCE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      lowestPipedWaterWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    पाइपको पानी प्रयोग गर्ने दर:{" "}
                    {localizeNumber(
                      lowestPipedWaterWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {lowestPipedWaterWard.percentage.toFixed(2)}% piped water
                      usage rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक क्षेत्र</h5>
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm">
                  यस वडामा पाइपको पानी प्रयोग गर्ने घरधुरीहरूको दर न्यून रहेकाले
                  यस वडामा खानेपानी पूर्वाधारमा प्राथमिकताका साथ लगानी गरी पाइप
                  प्रणाली विस्तार गर्नुपर्ने आवश्यकता देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">खानेपानी गुणस्तर सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(waterQualityIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{waterQualityLevel}</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> खानेपानी गुणस्तर सूचकाङ्क
                  विभिन्न स्रोतहरूको भारित औसतमा आधारित छ, जसमा पाइपको पानी र
                  ट्युबवेलको पानीलाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(waterQualityIndex.toFixed(1), "ne")} अंकले{" "}
                  {waterQualityLevel} खानेपानी गुणस्तर दर्शाउँछ। यसमा सुधारका
                  लागि खानेपानी शोधन र सुरक्षित पानी आपूर्ति व्यवस्था सुदृढ
                  गर्नुपर्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">खानेपानी स्रोतहरूको विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा बढी प्रयोग हुने स्रोतहरू
              </h5>
              <div className="mt-2 space-y-3">
                {Object.entries(waterSourceTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([source, count], index) => {
                    const percentage = (
                      (count / totalHouseholds) *
                      100
                    ).toFixed(2);
                    let color = "#6B7280"; // Default gray

                    // Find which group this source belongs to
                    for (const [key, group] of Object.entries(
                      WATER_SOURCE_GROUPS,
                    )) {
                      if (group.sources.includes(source)) {
                        color = group.color;
                        break;
                      }
                    }

                    return (
                      <div key={source}>
                        <div className="flex justify-between text-sm">
                          <span>{sourceMap[source] || source}</span>
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
                <h5 className="font-medium mb-2">पाइप खानेपानीको अवस्था</h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: WATER_SOURCE_GROUPS.PIPED_WATER.color,
                      }}
                    ></span>
                    पाइपको पानी
                  </span>
                  <span className="font-medium">
                    {localizeNumber(
                      waterSourceGroupPercentages.PIPED_WATER.toFixed(2),
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${waterSourceGroupPercentages.PIPED_WATER}%`,
                      backgroundColor: WATER_SOURCE_GROUPS.PIPED_WATER.color,
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
