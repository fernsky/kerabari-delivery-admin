import { localizeNumber } from "@/lib/utils/localize-number";

interface WaterPurificationAnalysisSectionProps {
  overallSummary: Array<{
    waterPurification: string;
    waterPurificationName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonMethod: string;
    mostCommonMethodName: string;
    mostCommonMethodHouseholds: number;
    mostCommonMethodPercentage: string;
    treatingHouseholds: number;
    treatingPercentage: string;
    methodPercentages: Record<string, string>;
  }>;
  methodMap: Record<string, string>;
  highestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  lowestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  safetyIndex: number;
  waterSafetyRating: string;
  WATER_PURIFICATION_COLORS: Record<string, string>;
}

export default function WaterPurificationAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  methodMap,
  highestTreatmentWard,
  lowestTreatmentWard,
  safetyIndex,
  waterSafetyRating,
  WATER_PURIFICATION_COLORS,
}: WaterPurificationAnalysisSectionProps) {
  // Calculate household percentage using any purification method
  const treatingHouseholds = overallSummary
    .filter((item) => item.waterPurification !== "NO_ANY_FILTERING")
    .reduce((sum, item) => sum + item.households, 0);

  const treatingPercentage = (
    (treatingHouseholds / totalHouseholds) *
    100
  ).toFixed(2);

  // Find percentage not treating water
  const noTreatmentData = overallSummary.find(
    (item) => item.waterPurification === "NO_ANY_FILTERING",
  );
  const noTreatmentPercentage = noTreatmentData
    ? ((noTreatmentData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-treating-percentage": treatingPercentage,
    "data-no-treatment-percentage": noTreatmentPercentage,
    "data-water-safety-index": safetyIndex.toFixed(2),
    "data-water-safety-rating": waterSafetyRating,
    "data-highest-treatment-ward":
      highestTreatmentWard?.wardNumber.toString() || "",
    "data-lowest-treatment-ward":
      lowestTreatmentWard?.wardNumber.toString() || "",
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

          // Determine color for treatment type
          const color =
            WATER_PURIFICATION_COLORS[
              item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS
            ] || "#888";

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              data-purification-type={`${item.waterPurificationName} / ${item.waterPurification}`}
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
                  {item.waterPurificationName}
                  <span className="sr-only">{item.waterPurification}</span>
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
          पानी शुद्धिकरण विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Water Purification Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="water-treatment-rate"
            data-percentage={treatingPercentage}
          >
            <h4 className="font-medium mb-2">
              पानी उपचार दर
              <span className="sr-only">
                Water Treatment Rate in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  background: `linear-gradient(to top, #3498DB, #2ECC71)`,
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {localizeNumber(treatingPercentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(treatingHouseholds.toLocaleString(), "ne")}{" "}
                  घरधुरीले पानी शुद्धिकरण गर्छन्
                  <span className="sr-only">
                    {treatingHouseholds.toLocaleString()} households treat their
                    water
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium">पानी शुद्धिकरणको महत्त्व</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  बुद्धशान्ति गाउँपालिकामा{" "}
                  {localizeNumber(treatingPercentage, "ne")}% घरधुरीले मात्र
                  पानी शुद्धिकरण गर्ने गरेको पाइएको छ, जुन जनस्वास्थ्यका
                  दृष्टिकोणले अपर्याप्त देखिन्छ।
                </p>
                <p className="text-sm">
                  अशुद्ध पानी पिउँदा झाडापखाला, हैजा, टाइफाइड जस्ता जलजन्य
                  रोगहरू लाग्ने जोखिम बढ्छ, जसले विशेष गरी बालबालिकाहरूमा गम्भीर
                  स्वास्थ्य समस्याहरू निम्त्याउन सक्छ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-treatment-ward"
            data-ward-number={highestTreatmentWard?.wardNumber}
            data-percentage={highestTreatmentWard?.treatingPercentage}
          >
            <h4 className="font-medium mb-2">
              उच्च पानी उपचार दर भएको वडा
              <span className="sr-only">
                Ward with Highest Water Treatment Rate in Khajura
              </span>
            </h4>
            {highestTreatmentWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: "#2ECC71",
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestTreatmentWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    पानी उपचार दर:{" "}
                    {localizeNumber(
                      highestTreatmentWard.treatingPercentage,
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {highestTreatmentWard.treatingPercentage}% water treatment
                      rate
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
                  {highestTreatmentWard
                    ? localizeNumber(
                        highestTreatmentWard.wardNumber.toString(),
                        "ne",
                      )
                    : ""}{" "}
                  मा सबैभन्दा बढी परिवारले पानी शुद्धिकरण गर्ने गरेको देखिन्छ।
                  यस वडाका सफल अभ्यासहरूलाई अन्य वडाहरूमा पनि प्रसारित गर्न
                  सकिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">खानेपानी सुरक्षा सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(safetyIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{waterSafetyRating}</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> खानेपानी सुरक्षा सूचकाङ्क
                  विभिन्न शुद्धिकरण विधिहरूको भारित औसतमा आधारित छ, जसमा
                  फिल्टरिङ र उमाल्ने विधिलाई उच्च भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(safetyIndex.toFixed(1), "ne")} अंकले{" "}
                  {waterSafetyRating} खानेपानी सुरक्षा स्तर दर्शाउँछ। सुधारका
                  लागि पानी शुद्धिकरण नगर्ने घरधुरी संख्या घटाई उपयुक्त
                  शुद्धिकरण विधि प्रवर्द्धन गर्नुपर्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शुद्धिकरण विधिहरूको विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा बढी प्रयोग हुने विधिहरू
              </h5>
              <div className="mt-2 space-y-3">
                {overallSummary.slice(0, 3).map((item, index) => {
                  const percentage = (
                    (item.households / totalHouseholds) *
                    100
                  ).toFixed(2);
                  const color =
                    WATER_PURIFICATION_COLORS[
                      item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS
                    ] || "#888";

                  return (
                    <div key={item.waterPurification}>
                      <div className="flex justify-between text-sm">
                        <span>{item.waterPurificationName}</span>
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
                  न्यून पानी शुद्धिकरण भएका क्षेत्रहरू
                </h5>
                {lowestTreatmentWard && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "#E74C3C" }}
                        ></span>
                        वडा{" "}
                        {localizeNumber(
                          lowestTreatmentWard.wardNumber.toString(),
                          "ne",
                        )}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(
                          lowestTreatmentWard.treatingPercentage,
                          "ne",
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${parseFloat(lowestTreatmentWard.treatingPercentage)}%`,
                          backgroundColor: "#E74C3C",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      यस वडामा सबैभन्दा कम पानी शुद्धिकरण दर रहेकोले विशेष ध्यान
                      दिनुपर्ने देखिन्छ।
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
