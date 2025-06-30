import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VegetableAnalysisSectionProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  VEGETABLE_TYPES: Record<string, string>;
  VEGETABLE_TYPES_EN: Record<string, string>;
  VEGETABLE_COLORS: Record<string, string>;
  commercializationScore: number;
  vegetableAnalysis: {
    totalProduction: number;
    totalSales: number;
    totalRevenue: number;
    productionSalesRatio: number;
    averagePricePerKg: number;
    commercializationScore: number;
  };
  soldPercentage: string;
  selfConsumptionPercentage: string;
}

export default function VegetableAnalysisSection({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  VEGETABLE_TYPES,
  VEGETABLE_TYPES_EN,
  VEGETABLE_COLORS,
  commercializationScore,
  vegetableAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
}: VegetableAnalysisSectionProps) {
  // Find most significant vegetables
  const primaryVegetable = overallSummary.length > 0 ? overallSummary[0] : null;
  const secondaryVegetable =
    overallSummary.length > 1 ? overallSummary[1] : null;

  // Find most commercialized vegetable (highest sales to production ratio)
  const mostCommercializedVegetable = overallSummary
    .filter((vegetable) => vegetable.production > 0) // Avoid division by zero
    .sort((a, b) => b.sales / b.production - a.sales / a.production)[0];

  // Calculate self-consumption
  const selfConsumption = totalProduction - totalSales;

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-production": totalProduction.toString(),
    "data-most-common-vegetable":
      overallSummary.length > 0
        ? `${overallSummary[0].typeName} / ${VEGETABLE_TYPES_EN[overallSummary[0].type] || overallSummary[0].type}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].production / totalProduction) * 100).toFixed(2)
        : "0",
    "data-commercialization-score": commercializationScore.toString(),
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल उत्पादन</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalProduction.toFixed(2), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">मेट्रिक टन</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">बजारीकरण दर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(soldPercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            बिक्री/उत्पादन अनुपात
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल आम्दानी</h4>
          <p className="text-3xl font-bold">
            रु. {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">हजार रुपैयाँमा</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          तरकारी बालीको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Vegetable Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="vegetable-type-analysis"
            data-percentage={
              overallSummary.length > 0
                ? (
                    (overallSummary[0].production / totalProduction) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख तरकारी बाली
              <span className="sr-only">
                Main Vegetable in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor: primaryVegetable
                    ? VEGETABLE_COLORS[
                        primaryVegetable.type as keyof typeof VEGETABLE_COLORS
                      ] || "#F1C40F"
                    : "#F1C40F",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {primaryVegetable?.typeName || ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(
                    primaryVegetable
                      ? (
                          (primaryVegetable.production / totalProduction) *
                          100
                        ).toFixed(2)
                      : "0",
                    "ne",
                  )}
                  % (
                  {localizeNumber(
                    primaryVegetable?.production.toFixed(2) || "0",
                    "ne",
                  )}{" "}
                  मेट्रिक टन)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 vegetable types visualization */}
              {overallSummary.slice(0, 3).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {item.typeName}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.production / totalProduction) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((item.production / totalProduction) * 100, 100)}%`,
                        backgroundColor:
                          VEGETABLE_COLORS[
                            item.type as keyof typeof VEGETABLE_COLORS
                          ] || "#F1C40F",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              उत्पादन-बिक्री विश्लेषण
              <span className="sr-only">Production-Sales Analysis</span>
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>बजार बिक्री</span>
                  <span className="font-medium">
                    {localizeNumber(soldPercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${parseFloat(soldPercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>आन्तरिक उपभोग</span>
                  <span className="font-medium">
                    {localizeNumber(selfConsumptionPercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${parseFloat(selfConsumptionPercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">सबैभन्दा बढी बजारीकृत तरकारी</h5>
                  <p className="text-sm text-muted-foreground">
                    उत्पादन र बिक्री अनुपातको आधारमा
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {mostCommercializedVegetable?.typeName || ""}
                  </p>
                  <p className="text-sm text-blue-500 font-medium">
                    {localizeNumber(
                      mostCommercializedVegetable
                        ? (
                            (mostCommercializedVegetable.sales /
                              mostCommercializedVegetable.production) *
                            100
                          ).toFixed(2)
                        : "0",
                      "ne",
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>उत्पादन वितरण:</strong> पालिकामा सबैभन्दा बढी तरकारी{" "}
                  {localizeNumber(
                    primaryVegetable
                      ? (
                          (primaryVegetable.production / totalProduction) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({primaryVegetable?.typeName || ""}) र त्यसपछि{" "}
                  {localizeNumber(
                    secondaryVegetable
                      ? (
                          (secondaryVegetable.production / totalProduction) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({secondaryVegetable?.typeName || ""}) उत्पादन हुने गर्दछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>बजारीकरण दर:</strong> कुल उत्पादनको{" "}
                  {localizeNumber(soldPercentage, "ne")}% बजारमा बिक्री हुन्छ
                  जबकि {localizeNumber(selfConsumptionPercentage, "ne")}%
                  आन्तरिक उपभोगमा प्रयोग हुन्छ। यसले पालिकाको तरकारी
                  व्यावसायीकरणको अवस्था देखाउँछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>खाद्य मूल्य:</strong> तरकारीहरू पौष्टिक तत्व र
                  भिटामिनहरूको प्रमुख स्रोत हुन्।{" "}
                  {localizeNumber(selfConsumption.toFixed(2), "ne")} मेट्रिक टन
                  तरकारी स्थानीय उपभोगमा प्रयोग हुँदा पालिकाको खाद्य विविधता र
                  पोषण सुरक्षामा योगदान पुर्‍याउँछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>उत्पादन र आम्दानी सम्बन्ध:</strong> वार्षिक रु.{" "}
                  {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")} हजार
                  आम्दानी हुने अनुमान गरिएको छ, जुन कुल{" "}
                  {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन
                  तरकारी बिक्रीबाट प्राप्त हुन्छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">आर्थिक प्रभाव विश्लेषण</h4>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">उत्पादन मूल्य</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    रु.{" "}
                    {localizeNumber(
                      (
                        (totalProduction *
                          1000 *
                          vegetableAnalysis.averagePricePerKg) /
                        1000
                      ).toFixed(2),
                      "ne",
                    )}{" "}
                    हजार
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">वास्तविक आम्दानी</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(totalRevenue / (totalProduction * 1000 * vegetableAnalysis.averagePricePerKg)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    रु. {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")}{" "}
                    हजार
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  औसत मूल्य प्रति किलो
                </h5>
                <p className="text-lg font-semibold mt-1">
                  रु.{" "}
                  {localizeNumber(
                    vegetableAnalysis.averagePricePerKg.toFixed(2),
                    "ne",
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  बिक्री मूल्यको आधारमा
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/profile/economics/municipality-wide-food-crops"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  खाद्यान्न बाली वितरण
                </Link>
                <Link
                  href="/profile/economics/municipality-wide-spices"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  मसलाबाली वितरण
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
