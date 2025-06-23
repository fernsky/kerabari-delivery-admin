import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseLiteracyStatusAnalysisSectionProps {
  totalPopulation: number;
  bothReadingWritingTotal: number;
  readingOnlyTotal: number;
  illiterateTotal: number;
  bothReadingWritingPercentage: number;
  readingOnlyPercentage: number;
  illiteratePercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalPopulation: number;
    bothReadingWritingPopulation: number;
    readingOnlyPopulation: number;
    illiteratePopulation: number;
    bothReadingWritingPercent: number;
    readingOnlyPercent: number;
    illiteratePercent: number;
    literacyPercent: number;
  }>;
  bestLiteracyWard: any;
  worstLiteracyWard: any;
  LITERACY_STATUS_TYPES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function WardWiseLiteracyStatusAnalysisSection({
  totalPopulation,
  bothReadingWritingTotal,
  readingOnlyTotal,
  illiterateTotal,
  bothReadingWritingPercentage,
  readingOnlyPercentage,
  illiteratePercentage,
  wardWiseAnalysis,
  bestLiteracyWard,
  worstLiteracyWard,
  LITERACY_STATUS_TYPES,
}: WardWiseLiteracyStatusAnalysisSectionProps) {
  // Calculate literacy rate (people who can read and write + read only)
  const literacyRate = bothReadingWritingPercentage + readingOnlyPercentage;
  const illiteracyRate = illiteratePercentage;

  // Calculate literacy index (0-100)
  // Higher weight for both read and write, lower for illiterate
  const literacyIndex =
    (bothReadingWritingPercentage * 1.0 +
      readingOnlyPercentage * 0.5 +
      illiteratePercentage * 0.0) /
    100;

  const literacyLevel =
    literacyIndex >= 0.75 ? "उच्च" : literacyIndex >= 0.5 ? "मध्यम" : "न्यून";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-population": totalPopulation.toString(),
    "data-literacy-rate": literacyRate.toFixed(2),
    "data-illiteracy-rate": illiteracyRate.toFixed(2),
    "data-best-literacy-ward": bestLiteracyWard?.wardNumber.toString() || "",
    "data-worst-literacy-ward": worstLiteracyWard?.wardNumber.toString() || "",
    "data-literacy-index": literacyIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${bothReadingWritingPercentage}%`,
              backgroundColor:
                LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              पढ्न र लेख्न जान्ने
              <span className="sr-only">
                {LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(bothReadingWritingPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(bothReadingWritingTotal.toLocaleString(), "ne")}{" "}
              जना
              <span className="sr-only">
                ({bothReadingWritingTotal.toLocaleString()} people)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${readingOnlyPercentage}%`,
              backgroundColor: LITERACY_STATUS_TYPES.READING_ONLY.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              पढ्न मात्र जान्ने
              <span className="sr-only">
                {LITERACY_STATUS_TYPES.READING_ONLY.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(readingOnlyPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(readingOnlyTotal.toLocaleString(), "ne")} जना
              <span className="sr-only">
                ({readingOnlyTotal.toLocaleString()} people)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${illiteratePercentage}%`,
              backgroundColor: LITERACY_STATUS_TYPES.ILLITERATE.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              निरक्षर
              <span className="sr-only">
                {LITERACY_STATUS_TYPES.ILLITERATE.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(illiteratePercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(illiterateTotal.toLocaleString(), "ne")} जना
              <span className="sr-only">
                ({illiterateTotal.toLocaleString()} people)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          साक्षरता विस्तृत विश्लेषण
          <span className="sr-only">Detailed Literacy Analysis of Khajura</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-literacy"
            data-ward-number={bestLiteracyWard?.wardNumber}
            data-percentage={bestLiteracyWard?.literacyPercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              सर्वोत्तम साक्षरता दर भएको वडा
              <span className="sr-only">
                Ward with Best Literacy Rate in Khajura Rural Municipality
              </span>
            </h4>
            {bestLiteracyWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestLiteracyWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    साक्षरता दर:{" "}
                    {localizeNumber(
                      bestLiteracyWard.literacyPercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestLiteracyWard.literacyPercent.toFixed(2)}% literacy
                      rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">साक्षरताको अवस्था वितरण</h5>
              <div className="mt-2 space-y-2">
                {bestLiteracyWard && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>
                          {LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name}
                        </span>
                        <span className="font-medium">
                          {localizeNumber(
                            bestLiteracyWard.bothReadingWritingPercent.toFixed(
                              2,
                            ),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bestLiteracyWard.bothReadingWritingPercent}%`,
                            backgroundColor:
                              LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING
                                .color,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>{LITERACY_STATUS_TYPES.READING_ONLY.name}</span>
                        <span className="font-medium">
                          {localizeNumber(
                            bestLiteracyWard.readingOnlyPercent.toFixed(2),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bestLiteracyWard.readingOnlyPercent}%`,
                            backgroundColor:
                              LITERACY_STATUS_TYPES.READING_ONLY.color,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>{LITERACY_STATUS_TYPES.ILLITERATE.name}</span>
                        <span className="font-medium">
                          {localizeNumber(
                            bestLiteracyWard.illiteratePercent.toFixed(2),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bestLiteracyWard.illiteratePercent}%`,
                            backgroundColor:
                              LITERACY_STATUS_TYPES.ILLITERATE.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-literacy"
            data-ward-number={worstLiteracyWard?.wardNumber}
            data-percentage={worstLiteracyWard?.illiteratePercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              न्यून साक्षरता दर भएको वडा
              <span className="sr-only">
                Ward with Low Literacy Rate in Khajura
              </span>
            </h4>
            {worstLiteracyWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: LITERACY_STATUS_TYPES.ILLITERATE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstLiteracyWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    निरक्षर दर:{" "}
                    {localizeNumber(
                      worstLiteracyWard.illiteratePercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {worstLiteracyWard.illiteratePercent.toFixed(2)}%
                      illiteracy rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेष ध्यान दिनुपर्ने</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा{" "}
                  {localizeNumber(
                    worstLiteracyWard?.illiteratePopulation.toLocaleString() ||
                      "0",
                    "ne",
                  )}{" "}
                  जना (कुल{" "}
                  {localizeNumber(
                    worstLiteracyWard?.totalPopulation.toLocaleString() || "0",
                    "ne",
                  )}{" "}
                  मध्ये) निरक्षर छन्। साक्षरता अभियानको लागि यस वडामा विशेष
                  कार्यक्रम सञ्चालन गर्नुपर्ने देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">साक्षरता सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber((literacyIndex * 100).toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{literacyLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> साक्षरताको यो सूचकाङ्क पढ्न
                  लेख्न जान्ने, पढ्न मात्र जान्ने, र निरक्षर जनसंख्याको भारित
                  औसतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber((literacyIndex * 100).toFixed(1), "ne")}
                  अंकले {literacyLevel} स्तरको साक्षरता दर्शाउँछ। यसमा सुधारका
                  लागि साक्षरता अभियान तथा शिक्षा विस्तारका कार्यक्रमहरू आवश्यक
                  छन्।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत साक्षरता विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                गढवा गाउँपालिका साक्षरताको स्थिति
              </h5>
              <div className="mt-2 space-y-3">
                {/* Literacy rate */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      साक्षरता दर (पढ्न जान्ने)
                    </span>
                    <span className="font-medium">
                      {localizeNumber(literacyRate.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{
                        width: `${literacyRate}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Read and write percentage */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING
                              .color,
                        }}
                      ></span>
                      पढ्न र लेख्न जान्ने
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        bothReadingWritingPercentage.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${bothReadingWritingPercentage}%`,
                        backgroundColor:
                          LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Illiteracy rate */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            LITERACY_STATUS_TYPES.ILLITERATE.color,
                        }}
                      ></span>
                      निरक्षर दर
                    </span>
                    <span className="font-medium">
                      {localizeNumber(illiteratePercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${illiteratePercentage}%`,
                        backgroundColor: LITERACY_STATUS_TYPES.ILLITERATE.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
