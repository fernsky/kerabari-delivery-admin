import { localizeNumber } from "@/lib/utils/localize-number";

interface ToiletTypeAnalysisSectionProps {
  overallSummary: Array<{
    toiletType: string;
    toiletTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    sanitationHouseholds: number;
    sanitationPercentage: string;
    modernToiletsPercentage: string;
    noToiletsPercentage: string;
    typePercentages: Record<string, string>;
  }>;
  typeMap: Record<string, string>;
  highestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  lowestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  sanitationIndex: number;
  sanitationRating: string;
  TOILET_TYPE_COLORS: Record<string, string>;
  noToiletPercentage: string;
}

export default function ToiletTypeAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  typeMap,
  highestSanitationWard,
  lowestSanitationWard,
  sanitationIndex,
  sanitationRating,
  TOILET_TYPE_COLORS,
  noToiletPercentage,
}: ToiletTypeAnalysisSectionProps) {
  // Calculate household percentage with proper toilets
  const sanitationHouseholds = overallSummary
    .filter((item) => item.toiletType !== "NO_TOILET")
    .reduce((sum, item) => sum + item.households, 0);

  const sanitationPercentage = (
    (sanitationHouseholds / totalHouseholds) *
    100
  ).toFixed(2);

  // Find percentage of households with modern toilets
  const modernToiletData = overallSummary.find(
    (item) => item.toiletType === "FLUSH_WITH_SEPTIC_TANK",
  );
  const modernToiletPercentage = modernToiletData
    ? ((modernToiletData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-sanitation-percentage": sanitationPercentage,
    "data-no-toilet-percentage": noToiletPercentage,
    "data-modern-toilet-percentage": modernToiletPercentage,
    "data-sanitation-index": sanitationIndex.toFixed(2),
    "data-sanitation-rating": sanitationRating,
    "data-highest-sanitation-ward":
      highestSanitationWard?.wardNumber.toString() || "",
    "data-lowest-sanitation-ward":
      lowestSanitationWard?.wardNumber.toString() || "",
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {overallSummary.map((item, index) => {
          // Calculate percentage
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          // Determine color for toilet type
          const color =
            TOILET_TYPE_COLORS[
              item.toiletType as keyof typeof TOILET_TYPE_COLORS
            ] || "#888";

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              data-toilet-type={`${item.toiletTypeName} / ${item.toiletType}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households /
                      Math.max(...overallSummary.map((i) => i.households))) *
                      100,
                    100,
                  )}%`,
                  backgroundColor: color,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.toiletTypeName}
                  <span className="sr-only">{item.toiletType}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  घरधुरी
                  <span className="sr-only">
                    ({item.households.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          शौचालय प्रकारहरू विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Toilet Types Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="sanitation-rate"
            data-percentage={sanitationPercentage}
          >
            <h4 className="font-medium mb-2">
              शौचालय उपलब्धता दर
              <span className="sr-only">
                Toilet Availability Rate in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  background: `linear-gradient(to top, #27AE60, #2ECC71)`,
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {localizeNumber(sanitationPercentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(sanitationHouseholds.toLocaleString(), "ne")}{" "}
                  घरधुरीमा शौचालय उपलब्ध
                  <span className="sr-only">
                    {sanitationHouseholds.toLocaleString()} households have
                    toilets
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium">शौचालयको महत्त्व</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  केराबारी गाउँपालिकामा{" "}
                  {localizeNumber(sanitationPercentage, "ne")}% घरधुरीमा शौचालय
                  उपलब्ध छ, जुन स्वच्छता र जनस्वास्थ्यका लागि महत्त्वपूर्ण छ।
                </p>
                <p className="text-sm">
                  शौचालय नभएका {localizeNumber(noToiletPercentage, "ne")}%
                  घरधुरीलाई लक्षित गरी शौचालय निर्माण अभियान सञ्चालन गर्नुपर्ने
                  देखिन्छ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-sanitation-ward"
            data-ward-number={highestSanitationWard?.wardNumber}
            data-percentage={highestSanitationWard?.sanitationPercentage}
          >
            <h4 className="font-medium mb-2">
              उच्च शौचालय उपलब्धता भएको वडा
              <span className="sr-only">
                Ward with Highest Sanitation Rate in Khajura
              </span>
            </h4>
            {highestSanitationWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: "#27AE60",
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestSanitationWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    शौचालय उपलब्धता दर:{" "}
                    {localizeNumber(
                      highestSanitationWard.sanitationPercentage,
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {highestSanitationWard.sanitationPercentage}% toilet
                      availability
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सफल अभ्यासहरू</h5>
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm">
                  वडा नं.{" "}
                  {highestSanitationWard
                    ? localizeNumber(
                        highestSanitationWard.wardNumber.toString(),
                        "ne",
                      )
                    : ""}{" "}
                  मा सबैभन्दा बढी परिवारले शौचालयको उपयोग गर्ने गरेको देखिन्छ।
                  यस वडाका सफल अभ्यासहरूलाई अन्य वडाहरूमा पनि प्रसारित गर्न
                  सकिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">सरसफाई सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-blue-50 border-4 border-green-200">
                <span className="text-2xl font-bold text-green-600">
                  {localizeNumber(sanitationIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{sanitationRating}</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> सरसफाई सूचकाङ्क विभिन्न
                  प्रकारका शौचालयहरूको भारित औसतमा आधारित छ, जसमा सेप्टिक ट्यांक
                  सहितको फ्लस शौचालयलाई उच्च भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(sanitationIndex.toFixed(1), "ne")} अंकले{" "}
                  {sanitationRating} सरसफाइ स्तर दर्शाउँछ। सुधारका लागि शौचालय
                  नभएका घरधुरी संख्या घटाई आधुनिक शौचालय प्रवर्द्धन गर्नुपर्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शौचालय प्रकारहरूको विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">प्रमुख शौचालय प्रकारहरू</h5>
              <div className="mt-2 space-y-3">
                {overallSummary.slice(0, 3).map((item, index) => {
                  const percentage = (
                    (item.households / totalHouseholds) *
                    100
                  ).toFixed(2);
                  const color =
                    TOILET_TYPE_COLORS[
                      item.toiletType as keyof typeof TOILET_TYPE_COLORS
                    ] || "#888";

                  return (
                    <div key={item.toiletType}>
                      <div className="flex justify-between text-sm">
                        <span>{item.toiletTypeName}</span>
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
                <h5 className="font-medium mb-2">
                  न्यून सरसफाइ दर भएका क्षेत्रहरू
                </h5>
                {lowestSanitationWard && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "#E74C3C" }}
                        ></span>
                        वडा{" "}
                        {localizeNumber(
                          lowestSanitationWard.wardNumber.toString(),
                          "ne",
                        )}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(
                          lowestSanitationWard.sanitationPercentage,
                          "ne",
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${parseFloat(lowestSanitationWard.sanitationPercentage)}%`,
                          backgroundColor: "#E74C3C",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      यस वडामा सबैभन्दा कम शौचालय उपलब्धता दर रहेकोले विशेष
                      ध्यान दिनुपर्ने देखिन्छ।
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
