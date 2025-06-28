import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseCookingFuelAnalysisSectionProps {
  totalHouseholds: number;
  fuelTypeTotals: Record<string, number>;
  fuelTypePercentages: Record<string, number>;
  wardCleanFuelPercentages: Array<{
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
  COOKING_FUEL_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  cleanFuelIndex: number;
  cleanFuels: string[];
  traditionalFuels: string[];
  cleanFuelPercentage: number;
}

export default function WardWiseCookingFuelAnalysisSection({
  totalHouseholds,
  fuelTypeTotals,
  fuelTypePercentages,
  wardCleanFuelPercentages,
  bestWard,
  worstWard,
  COOKING_FUEL_CATEGORIES,
  cleanFuelIndex,
  cleanFuels,
  traditionalFuels,
  cleanFuelPercentage,
}: WardWiseCookingFuelAnalysisSectionProps) {
  // Determine clean fuel adoption level based on index score
  const cleanFuelLevel =
    cleanFuelIndex >= 75
      ? "उच्च"
      : cleanFuelIndex >= 50
        ? "राम्रो"
        : cleanFuelIndex >= 30
          ? "मध्यम"
          : "न्यून";

  // Calculate clean and traditional fuel households
  const cleanFuelTotal = cleanFuels.reduce(
    (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
    0,
  );
  const traditionalFuelTotal = traditionalFuels.reduce(
    (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
    0,
  );

  // Calculate percentages
  const traditionalFuelPercentage = (
    (traditionalFuelTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-clean-fuel-rate": cleanFuelPercentage.toFixed(2),
    "data-traditional-fuel-rate": traditionalFuelPercentage,
    "data-best-ward": bestWard?.wardNumber.toString() || "",
    "data-worst-ward": worstWard?.wardNumber.toString() || "",
    "data-clean-fuel-index": cleanFuelIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {/* Card for each fuel category */}
        {Object.entries(COOKING_FUEL_CATEGORIES).map(
          ([categoryKey, category]) => {
            const percentage = fuelTypePercentages[categoryKey] || 0;
            const total = fuelTypeTotals[categoryKey] || 0;

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
          खाना पकाउने इन्धन प्रयोगको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Cooking Fuel Usage Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-clean-fuel"
            data-ward-number={bestWard?.wardNumber}
            data-percentage={bestWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              स्वच्छ इन्धन प्रयोगमा अग्रणी वडा
              <span className="sr-only">
                Ward with Best Clean Fuel Usage in Khajura Rural Municipality
              </span>
            </h4>
            {bestWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: COOKING_FUEL_CATEGORIES.LP_GAS.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(bestWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    स्वच्छ इन्धन प्रयोग:{" "}
                    {localizeNumber(bestWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {bestWard.percentage.toFixed(2)}% clean fuel usage
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा स्वच्छ इन्धन (एल.पी. ग्याँस, विद्युत, गोबर ग्याँस) को
                  प्रयोग उच्च छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (bestWard.percentage - cleanFuelPercentage).toFixed(2),
                    "ne",
                  )}
                  % ले बढी छ।
                </p>
                <p className="text-sm">
                  यसले यस वडाको आर्थिक अवस्था राम्रो भएको र आधुनिक इन्धनमा पहुँच
                  बढी भएको संकेत गर्दछ, जसले यहाँको जनताको वातावरणीय स्वास्थ्य र
                  जीवनस्तरमा सकारात्मक प्रभाव पारेको छ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-clean-fuel"
            data-ward-number={worstWard?.wardNumber}
            data-percentage={worstWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              स्वच्छ इन्धन प्रयोगमा पछाडि परेको वडा
              <span className="sr-only">
                Ward with Lowest Clean Fuel Usage in Khajura
              </span>
            </h4>
            {worstWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: COOKING_FUEL_CATEGORIES.WOOD.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(worstWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    स्वच्छ इन्धन प्रयोग:{" "}
                    {localizeNumber(worstWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {worstWard.percentage.toFixed(2)}% clean fuel usage
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा स्वच्छ इन्धनको प्रयोग न्यून छ। अधिकांश घरधुरीहरूले
                  दाउरा/काठ/कोइला जस्ता परम्परागत इन्धन प्रयोग गर्ने गर्दछन्,
                  जसले स्वास्थ्यमा नकारात्मक असर पार्नुका साथै वातावरणीय विनाशमा
                  योगदान पुर्‍याउँछ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">स्वच्छ इन्धन सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-green-200">
                <span className="text-2xl font-bold text-green-600">
                  {localizeNumber(cleanFuelIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{cleanFuelLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> स्वच्छ इन्धन सूचकाङ्क विभिन्न
                  इन्धन प्रकारहरूको प्रयोग र तिनीहरूको वातावरणीय प्रभावको भारित
                  औसतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(cleanFuelIndex.toFixed(1), "ne")} अंकले{" "}
                  {cleanFuelLevel} स्वच्छ इन्धन प्रयोग दर्शाउँछ। यसमा सुधारका
                  लागि एल.पी. ग्याँस र विद्युतको पहुँच र प्रयोग बढाउनुपर्ने
                  देखिन्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">इन्धन प्रयोग विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">स्वच्छ इन्धन प्रयोग</h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: COOKING_FUEL_CATEGORIES.LP_GAS.color,
                        }}
                      ></span>
                      {COOKING_FUEL_CATEGORIES.LP_GAS.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        fuelTypePercentages.LP_GAS?.toFixed(2) || "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${fuelTypePercentages.LP_GAS || 0}%`,
                        backgroundColor: COOKING_FUEL_CATEGORIES.LP_GAS.color,
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
                            COOKING_FUEL_CATEGORIES.ELECTRICITY.color,
                        }}
                      ></span>
                      {COOKING_FUEL_CATEGORIES.ELECTRICITY.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        fuelTypePercentages.ELECTRICITY?.toFixed(2) || "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${fuelTypePercentages.ELECTRICITY || 0}%`,
                        backgroundColor:
                          COOKING_FUEL_CATEGORIES.ELECTRICITY.color,
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
                      स्वच्छ इन्धनको जम्मा
                    </span>
                    <span>
                      {localizeNumber(cleanFuelPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    कुल {localizeNumber(cleanFuelTotal.toLocaleString(), "ne")}{" "}
                    घरधुरीले स्वच्छ इन्धन प्रयोग गर्दछन्
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
