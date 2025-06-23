import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PulseAnalysisSectionProps {
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
  PULSE_TYPES: Record<string, string>;
  PULSE_TYPES_EN: Record<string, string>;
  PULSE_COLORS: Record<string, string>;
  commercializationScore: number;
  pulseAnalysis: {
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

export default function PulseAnalysisSection({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  PULSE_TYPES,
  PULSE_TYPES_EN,
  PULSE_COLORS,
  commercializationScore,
  pulseAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
}: PulseAnalysisSectionProps) {
  // Find most significant pulses
  const primaryPulse = overallSummary.length > 0 ? overallSummary[0] : null;
  const secondaryPulse = overallSummary.length > 1 ? overallSummary[1] : null;

  // Find most commercialized pulse (highest sales to production ratio)
  const mostCommercializedPulse = overallSummary
    .filter((pulse) => pulse.production > 0) // Avoid division by zero
    .sort((a, b) => b.sales / b.production - a.sales / a.production)[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-production": totalProduction.toString(),
    "data-most-common-pulse":
      overallSummary.length > 0
        ? `${overallSummary[0].typeName} / ${PULSE_TYPES_EN[overallSummary[0].type] || overallSummary[0].type}`
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
            रु. {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">मिलियन रुपैयाँमा</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          दालबालीको विस्तृत विश्लेषण
          <span className="sr-only">Detailed Pulse Analysis of Khajura</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="pulse-type-analysis"
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
              प्रमुख दालबाली
              <span className="sr-only">
                Main Pulse in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor: primaryPulse
                    ? PULSE_COLORS[
                        primaryPulse.type as keyof typeof PULSE_COLORS
                      ] || "#e74c3c"
                    : "#e74c3c",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {primaryPulse?.typeName || ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(
                    primaryPulse
                      ? (
                          (primaryPulse.production / totalProduction) *
                          100
                        ).toFixed(2)
                      : "0",
                    "ne",
                  )}
                  % (
                  {localizeNumber(
                    primaryPulse?.production.toFixed(2) || "0",
                    "ne",
                  )}{" "}
                  मेट्रिक टन)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 pulse types visualization */}
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
                          PULSE_COLORS[
                            item.type as keyof typeof PULSE_COLORS
                          ] || "#e74c3c",
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
                  <h5 className="font-medium">सबैभन्दा बढी बजारीकृत दालबाली</h5>
                  <p className="text-sm text-muted-foreground">
                    उत्पादन र बिक्री अनुपातको आधारमा
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {mostCommercializedPulse?.typeName || ""}
                  </p>
                  <p className="text-sm text-blue-500 font-medium">
                    {localizeNumber(
                      mostCommercializedPulse
                        ? (
                            (mostCommercializedPulse.sales /
                              mostCommercializedPulse.production) *
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
                  <strong>उत्पादन वितरण:</strong> पालिकामा सबैभन्दा बढी दालबाली{" "}
                  {localizeNumber(
                    primaryPulse
                      ? (
                          (primaryPulse.production / totalProduction) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({primaryPulse?.typeName || ""}) र त्यसपछि{" "}
                  {localizeNumber(
                    secondaryPulse
                      ? (
                          (secondaryPulse.production / totalProduction) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({secondaryPulse?.typeName || ""}) उत्पादन हुने गर्दछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>बजारीकरण दर:</strong> कुल उत्पादनको{" "}
                  {localizeNumber(soldPercentage, "ne")}% बजारमा बिक्री हुन्छ
                  जबकि {localizeNumber(selfConsumptionPercentage, "ne")}%
                  आन्तरिक उपभोगमा प्रयोग हुन्छ। यसले पालिकाको दालबाली
                  व्यावसायीकरणको अवस्था देखाउँछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>पोषण मूल्य:</strong> दालहरू प्रोटिनको महत्वपूर्ण स्रोत
                  हुन् र{" "}
                  {localizeNumber(
                    (totalProduction - totalSales).toFixed(2),
                    "ne",
                  )}{" "}
                  मेट्रिक टन दालबाली स्थानीय उपभोगमा प्रयोग हुँदा पालिकाको पोषण
                  सुरक्षामा सकारात्मक योगदान पुर्‍याउँछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>उत्पादन र आम्दानी सम्बन्ध:</strong> वार्षिक रु.{" "}
                  {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}{" "}
                  मिलियन आम्दानी हुने अनुमान गरिएको छ, जुन कुल{" "}
                  {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन
                  दालबाली बिक्रीबाट प्राप्त हुन्छ।
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
                          pulseAnalysis.averagePricePerKg) /
                        1000000
                      ).toFixed(2),
                      "ne",
                    )}{" "}
                    मि.
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
                        width: `${(totalRevenue / (totalProduction * 1000 * pulseAnalysis.averagePricePerKg)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    रु.{" "}
                    {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}{" "}
                    मि.
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
                    pulseAnalysis.averagePricePerKg.toFixed(2),
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
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
                <Link
                  href="/profile/demographics/occupation-distribution"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  पेशागत वितरण
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
