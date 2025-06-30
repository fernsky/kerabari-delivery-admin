import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseElectricitySourceAnalysisSectionProps {
  totalHouseholds: number;
  sourceTypeTotals: Record<string, number>;
  sourceTypePercentages: Record<string, number>;
  wardModernSourcePercentages: Array<{
    wardNumber: number;
    percentage: number;
    households: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  ELECTRICITY_SOURCE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  electricityAccessIndex: number;
  modernSources: string[];
  traditionalSources: string[];
  modernSourcePercentage: number;
}

export default function WardWiseElectricitySourceAnalysisSection({
  totalHouseholds,
  sourceTypeTotals,
  sourceTypePercentages,
  wardModernSourcePercentages,
  bestWard,
  worstWard,
  ELECTRICITY_SOURCE_CATEGORIES,
  electricityAccessIndex,
  modernSources,
  traditionalSources,
  modernSourcePercentage,
}: WardWiseElectricitySourceAnalysisSectionProps) {
  // Determine electricity access level based on index score
  const electricityAccessLevel =
    electricityAccessIndex >= 75
      ? "उच्च"
      : electricityAccessIndex >= 50
        ? "राम्रो"
        : electricityAccessIndex >= 30
          ? "मध्यम"
          : "न्यून";

  // Calculate modern and traditional source households
  const modernSourceTotal = modernSources.reduce(
    (sum, source) => sum + (sourceTypeTotals[source] || 0),
    0,
  );
  const traditionalSourceTotal = traditionalSources.reduce(
    (sum, source) => sum + (sourceTypeTotals[source] || 0),
    0,
  );

  // Calculate percentages
  const traditionalSourcePercentage = (
    (traditionalSourceTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-modern-source-rate": modernSourcePercentage.toFixed(2),
    "data-traditional-source-rate": traditionalSourcePercentage,
    "data-best-ward": bestWard?.wardNumber.toString() || "",
    "data-worst-ward": worstWard?.wardNumber.toString() || "",
    "data-electricity-access-index": electricityAccessIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {/* Card for each source category */}
        {Object.entries(ELECTRICITY_SOURCE_CATEGORIES).map(
          ([categoryKey, category]) => {
            const percentage = sourceTypePercentages[categoryKey] || 0;
            const total = sourceTypeTotals[categoryKey] || 0;

            if (percentage < 1) return null; // Skip very small categories

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
          },
        )}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          विद्युतको स्रोतको प्रयोगको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Electricity Source Usage Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-modern-source"
            data-ward-number={bestWard?.wardNumber}
            data-percentage={bestWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              आधुनिक विद्युत स्रोत प्रयोगमा अग्रणी वडा
              <span className="sr-only">
                Ward with Best Modern Electricity Source Usage in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      ELECTRICITY_SOURCE_CATEGORIES.ELECTRICITY.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(bestWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    आधुनिक विद्युत स्रोत प्रयोग:{" "}
                    {localizeNumber(bestWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {bestWard.percentage.toFixed(2)}% modern electricity
                      source usage
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा आधुनिक विद्युत स्रोत (केन्द्रीय विद्युत प्रणाली,
                  सौर्य ऊर्जा) को प्रयोग उच्च छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (bestWard.percentage - modernSourcePercentage).toFixed(2),
                    "ne",
                  )}
                  % ले बढी छ।
                </p>
                <p className="text-sm">
                  यसले यस वडाको विद्युत पूर्वाधार राम्रो भएको र वैकल्पिक ऊर्जाको
                  प्रयोग बढी भएको संकेत गर्दछ, जसले यहाँको जनताको जीवनस्तरमा
                  सकारात्मक प्रभाव पारेको छ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-modern-source"
            data-ward-number={worstWard?.wardNumber}
            data-percentage={worstWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              आधुनिक विद्युत स्रोत प्रयोगमा पछाडि परेको वडा
              <span className="sr-only">
                Ward with Lowest Modern Electricity Source Usage in Khajura
              </span>
            </h4>
            {worstWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      ELECTRICITY_SOURCE_CATEGORIES.KEROSENE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(worstWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    आधुनिक विद्युत स्रोत प्रयोग:{" "}
                    {localizeNumber(worstWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {worstWard.percentage.toFixed(2)}% modern electricity
                      source usage
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा आधुनिक विद्युत स्रोतको प्रयोग न्यून छ। अधिकांश
                  घरधुरीहरूले मट्टितेल वा परम्परागत स्रोत प्रयोग गर्ने गर्दछन्,
                  जसले स्वास्थ्यमा नकारात्मक असर पार्नुका साथै आर्थिक र शैक्षिक
                  विकासमा बाधा पुर्याउँछ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विद्युत पहुँच सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(electricityAccessIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {electricityAccessLevel} स्तर
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> विद्युत पहुँच सूचकाङ्क
                  विभिन्न प्रकारका विद्युत स्रोतहरूको प्रयोग र तिनीहरूको
                  गुणस्तरको भारित औसतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(electricityAccessIndex.toFixed(1), "ne")}{" "}
                  अंकले {electricityAccessLevel} विद्युत पहुँच दर्शाउँछ। यसमा
                  सुधारका लागि ग्रिड विद्युत र सौर्य ऊर्जाको पहुँच र प्रयोग
                  बढाउनुपर्ने देखिन्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विद्युत स्रोत विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                आधुनिक विद्युत स्रोत प्रयोग
              </h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            ELECTRICITY_SOURCE_CATEGORIES.ELECTRICITY.color,
                        }}
                      ></span>
                      {ELECTRICITY_SOURCE_CATEGORIES.ELECTRICITY.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        sourceTypePercentages.ELECTRICITY?.toFixed(2) || "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${sourceTypePercentages.ELECTRICITY || 0}%`,
                        backgroundColor:
                          ELECTRICITY_SOURCE_CATEGORIES.ELECTRICITY.color,
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
                          backgroundColor:
                            ELECTRICITY_SOURCE_CATEGORIES.SOLAR.color,
                        }}
                      ></span>
                      {ELECTRICITY_SOURCE_CATEGORIES.SOLAR.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        sourceTypePercentages.SOLAR?.toFixed(2) || "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${sourceTypePercentages.SOLAR || 0}%`,
                        backgroundColor:
                          ELECTRICITY_SOURCE_CATEGORIES.SOLAR.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#1976D2" }}
                      ></span>
                      आधुनिक विद्युत स्रोतको जम्मा
                    </span>
                    <span>
                      {localizeNumber(modernSourcePercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    कुल{" "}
                    {localizeNumber(modernSourceTotal.toLocaleString(), "ne")}{" "}
                    घरधुरीले आधुनिक विद्युत स्रोत प्रयोग गर्दछन्
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
