import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceAnalysisSectionProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    coverage: number;
  }>;
  totalCoverage: number;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
  IRRIGATION_SOURCE_TYPES_EN: Record<string, string>;
  IRRIGATION_SOURCE_COLORS: Record<string, string>;
  sustainabilityScore: number;
  irrigationAnalysis: {
    totalIrrigatedArea: number;
    traditionalSourceCoverage: number;
    modernSourceCoverage: number;
    naturalSourceCoverage: number;
    otherSourceCoverage: number;
  };
  traditionalSourcePercentage: string;
  modernSourcePercentage: string;
  naturalSourcePercentage: string;
}

export default function IrrigationSourceAnalysisSection({
  overallSummary,
  totalCoverage,
  IRRIGATION_SOURCE_TYPES,
  IRRIGATION_SOURCE_TYPES_EN,
  IRRIGATION_SOURCE_COLORS,
  sustainabilityScore,
  irrigationAnalysis,
  traditionalSourcePercentage,
  modernSourcePercentage,
  naturalSourcePercentage,
}: IrrigationSourceAnalysisSectionProps) {
  // Find most significant sources
  const primarySource = overallSummary.length > 0 ? overallSummary[0] : null;
  const secondarySource = overallSummary.length > 1 ? overallSummary[1] : null;

  // Find most modern source (electric lift, pumping set, underground)
  const mostModernSource = overallSummary.find((item) =>
    [
      "ELECTRIC_LIFT_IRRIGATION",
      "PUMPING_SET",
      "UNDERGROUND_IRRIGATION",
    ].includes(item.type),
  );

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-coverage": totalCoverage.toString(),
    "data-most-common-source":
      overallSummary.length > 0
        ? `${overallSummary[0].typeName} / ${IRRIGATION_SOURCE_TYPES_EN[overallSummary[0].type] || overallSummary[0].type}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].coverage / totalCoverage) * 100).toFixed(2)
        : "0",
    "data-sustainability-score": sustainabilityScore.toString(),
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल सिंचाई क्षेत्रफल</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalCoverage.toFixed(2), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">हेक्टर</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">आधुनिक सिंचाई प्रविधि</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(modernSourcePercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (
            {localizeNumber(
              irrigationAnalysis.modernSourceCoverage.toFixed(2),
              "ne",
            )}{" "}
            हेक्टर)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">दिगोपना स्कोर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(sustainabilityScore.toString(), "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            आधुनिक + प्राकृतिक स्रोत
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          सिंचाई स्रोतको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Irrigation Source Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="source-type-analysis"
            data-percentage={
              overallSummary.length > 0
                ? ((overallSummary[0].coverage / totalCoverage) * 100).toFixed(
                    2,
                  )
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख सिंचाई स्रोत
              <span className="sr-only">
                Main Irrigation Source in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor: primarySource
                    ? IRRIGATION_SOURCE_COLORS[
                        primarySource.type as keyof typeof IRRIGATION_SOURCE_COLORS
                      ] || "#3498db"
                    : "#3498db",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {primarySource?.typeName || ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(
                    primarySource
                      ? (
                          (primarySource.coverage / totalCoverage) *
                          100
                        ).toFixed(2)
                      : "0",
                    "ne",
                  )}
                  % (
                  {localizeNumber(
                    primarySource?.coverage.toFixed(2) || "0",
                    "ne",
                  )}{" "}
                  हेक्टर)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 irrigation source types visualization */}
              {overallSummary.slice(0, 3).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {item.typeName}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.coverage / totalCoverage) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((item.coverage / totalCoverage) * 100, 100)}%`,
                        backgroundColor:
                          IRRIGATION_SOURCE_COLORS[
                            item.type as keyof typeof IRRIGATION_SOURCE_COLORS
                          ] || "#3498db",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सिंचाई स्रोत विश्लेषण
              <span className="sr-only">
                Irrigation Source Distribution Analysis
              </span>
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>परम्परागत स्रोत</span>
                  <span className="font-medium">
                    {localizeNumber(traditionalSourcePercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${parseFloat(traditionalSourcePercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>आधुनिक स्रोत</span>
                  <span className="font-medium">
                    {localizeNumber(modernSourcePercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${parseFloat(modernSourcePercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>प्राकृतिक स्रोत</span>
                  <span className="font-medium">
                    {localizeNumber(naturalSourcePercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${parseFloat(naturalSourcePercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">दिगो सिंचाई स्रोत</h5>
                  <p className="text-sm text-muted-foreground">
                    विद्युतीय लिफ्ट सिंचाई र प्राकृतिक स्रोत
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {localizeNumber(mostModernSource?.typeName || "", "ne")}
                  </p>
                  <p className="text-sm text-green-500 font-medium">
                    {localizeNumber(
                      mostModernSource
                        ? (
                            (mostModernSource.coverage / totalCoverage) *
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
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सिंचाई वितरण:</strong> पालिकामा सबैभन्दा बढी सिंचाई
                  क्षेत्रफल{" "}
                  {localizeNumber(
                    primarySource
                      ? (
                          (primarySource.coverage / totalCoverage) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({primarySource?.typeName || ""}) र त्यसपछि{" "}
                  {localizeNumber(
                    secondarySource
                      ? (
                          (secondarySource.coverage / totalCoverage) *
                          100
                        ).toFixed(1)
                      : "0",
                    "ne",
                  )}
                  % ({secondarySource?.typeName || ""}) बाट पूर्ति हुने गर्दछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>प्रविधि विविधता:</strong> सिंचाई प्रविधि मध्ये
                  परम्परागत प्रविधिमा{" "}
                  {localizeNumber(traditionalSourcePercentage, "ne")}%, आधुनिक
                  प्रविधिमा {localizeNumber(modernSourcePercentage, "ne")}%, र
                  प्राकृतिक स्रोतमा{" "}
                  {localizeNumber(naturalSourcePercentage, "ne")}% सिंचाई
                  क्षेत्रफल निर्भर रहेको देखिन्छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>दिगो सिंचाई स्थिति:</strong> पालिकामा{" "}
                  {localizeNumber(sustainabilityScore.toString(), "ne")}%
                  दिगोपना स्कोर रहेको छ, जुन आधुनिक र प्राकृतिक स्रोतहरूको
                  प्रयोगलाई संकेत गर्दछ। जसले दीर्घकालीन सिंचाई सुरक्षाको अवस्था
                  देखाउँछ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सिंचाई पूर्वाधार चुनौती:</strong> अझै पनि पालिकाको कुल
                  कृषियोग्य जमिनको ठूलो हिस्सामा सिंचाई सुविधा पुग्न नसकेको
                  अवस्था छ। सिंचाई पूर्वाधार निर्माण र विस्तारमा थप लगानी आवश्यक
                  देखिन्छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">
              सिंचाई स्रोत तुलनात्मक विश्लेषण
            </h4>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">
                  परम्परागत सिंचाई स्रोत
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${parseFloat(traditionalSourcePercentage)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(traditionalSourcePercentage, "ne")}%
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  आधुनिक सिंचाई स्रोत
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${parseFloat(modernSourcePercentage)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(modernSourcePercentage, "ne")}%
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  प्राकृतिक सिंचाई स्रोत
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${parseFloat(naturalSourcePercentage)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(naturalSourcePercentage, "ne")}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/profile/economics/ward-wise-irrigated-area"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  वडा अनुसार सिंचित क्षेत्रफल
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
                <Link
                  href="/profile/infrastructure/water-resources"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  जलस्रोत विवरण
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
