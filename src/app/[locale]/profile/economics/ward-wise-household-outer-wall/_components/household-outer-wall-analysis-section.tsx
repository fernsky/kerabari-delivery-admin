import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdOuterWallAnalysisSectionProps {
  overallSummary: Array<{
    wallType: string;
    wallTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    highQualityWalls: number;
    highQualityPercentage: string;
    mediumQualityWalls: number;
    mediumQualityPercentage: string;
    lowQualityWalls: number;
    lowQualityPercentage: string;
    qualityScore: number;
  }>;
  WALL_TYPE_NAMES: Record<string, string>;
  WALL_TYPE_NAMES_EN: Record<string, string>;
  WALL_TYPE_COLORS: Record<string, string>;
}

export default function HouseholdOuterWallAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  WALL_TYPE_NAMES,
  WALL_TYPE_NAMES_EN,
  WALL_TYPE_COLORS,
}: HouseholdOuterWallAnalysisSectionProps) {
  // Calculate average quality score for the municipality
  const municipalityQualityScore =
    wardWiseAnalysis.reduce((sum, ward) => {
      return sum + ward.qualityScore * ward.totalHouseholds;
    }, 0) / totalHouseholds;

  // Calculate cement-bonded wall percentage for the municipality
  const cementJoinedData = overallSummary.find(
    (item) => item.wallType === "CEMENT_JOINED",
  );
  const cementJoinedPercentage = cementJoinedData
    ? ((cementJoinedData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // Find wards with highest and lowest construction quality
  const highestQualityWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.highQualityPercentage) - parseFloat(a.highQualityPercentage),
  )[0];

  const lowestQualityWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(a.highQualityPercentage) - parseFloat(b.highQualityPercentage),
  )[0];

  // Calculate distribution of high quality walls across wards
  const highQualityDistribution = wardWiseAnalysis
    .sort(
      (a, b) =>
        parseFloat(b.highQualityPercentage) -
        parseFloat(a.highQualityPercentage),
    )
    .map((ward) => ({
      wardNumber: ward.wardNumber,
      percentage: parseFloat(ward.highQualityPercentage),
    }));

  // Calculate mud-joined wall percentage for the municipality
  const mudJoinedData = overallSummary.find(
    (item) => item.wallType === "MUD_JOINED",
  );
  const mudJoinedPercentage = mudJoinedData
    ? ((mudJoinedData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // Calculate bamboo and tin materials percentage (disaster vulnerability)
  const vulnerableMaterialData = overallSummary.filter((item) =>
    ["BAMBOO", "TIN", "OTHER"].includes(item.wallType),
  );
  const vulnerableMaterialPercentage = vulnerableMaterialData.length
    ? (
        (vulnerableMaterialData.reduce(
          (sum, item) => sum + item.households,
          0,
        ) /
          totalHouseholds) *
        100
      ).toFixed(2)
    : "0";

  // Find out which ward needs the most attention (highest percentage of low-quality walls)
  const priorityWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.lowQualityPercentage) - parseFloat(a.lowQualityPercentage),
  )[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-most-common-wall":
      overallSummary.length > 0
        ? `${overallSummary[0].wallTypeName} / ${WALL_TYPE_NAMES_EN[overallSummary[0].wallType as keyof typeof WALL_TYPE_NAMES_EN] || overallSummary[0].wallType}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2)
        : "0",
    "data-cement-bonded-percentage": cementJoinedPercentage,
    "data-high-quality-percentage":
      wardWiseAnalysis.length > 0
        ? (
            (wardWiseAnalysis.reduce(
              (sum, ward) => sum + ward.highQualityWalls,
              0,
            ) /
              totalHouseholds) *
            100
          ).toFixed(2)
        : "0",
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">गुणस्तर स्कोर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(municipalityQualityScore.toFixed(1), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            १०० मा (जति बढी, त्यति राम्रो)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सिमेन्टको गारो भएका घर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(cementJoinedPercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (
            {localizeNumber(
              (cementJoinedData?.households || 0).toLocaleString(),
              "ne",
            )}{" "}
            घरधुरी)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">जोखिमयुक्त गारो भएका घर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(vulnerableMaterialPercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            बाँसजन्य, टिन र अन्य सामग्री भएका
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          घरको बाहिरी गारोको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed House Outer Wall Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-outer-wall-type"
            data-percentage={
              overallSummary.length > 0
                ? (
                    (overallSummary[0].households / totalHouseholds) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख घरको बाहिरी गारोको प्रकार
              <span className="sr-only">
                Most Common House Outer Wall Type in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor:
                    overallSummary.length > 0
                      ? WALL_TYPE_COLORS[
                          overallSummary[0]
                            .wallType as keyof typeof WALL_TYPE_COLORS
                        ] || "#888"
                      : "#888",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {overallSummary.length > 0
                    ? overallSummary[0].wallTypeName.split("(")[0].trim()
                    : ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(
                    overallSummary.length > 0
                      ? (
                          (overallSummary[0].households / totalHouseholds) *
                          100
                        ).toFixed(2)
                      : "0",
                    "ne",
                  )}
                  % (
                  {localizeNumber(
                    overallSummary.length > 0
                      ? overallSummary[0].households.toLocaleString()
                      : "0",
                    "ne",
                  )}{" "}
                  घरधुरी)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 wall types visualization */}
              {overallSummary.slice(0, 3).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {item.wallTypeName.split("(")[0].trim()}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.households / totalHouseholds) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((item.households / totalHouseholds) * 100, 100)}%`,
                        backgroundColor:
                          WALL_TYPE_COLORS[
                            item.wallType as keyof typeof WALL_TYPE_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              वडागत गारोको गुणस्तर वितरण
              <span className="sr-only">Wall Quality Distribution by Ward</span>
            </h4>

            <div className="space-y-3">
              {highQualityDistribution.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")} -
                      उच्च गुणस्तर
                    </span>
                    <span className="font-medium">
                      {localizeNumber(ward.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${ward.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">उत्कृष्ट वडा</h5>
                  <p className="text-sm text-muted-foreground">
                    उच्च गुणस्तरका गारो भएका घरहरू
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestQualityWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-blue-500 font-medium">
                    {localizeNumber(
                      highestQualityWard?.highQualityPercentage || "0",
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
            <h4 className="font-medium mb-4">सुझावहरू</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>प्राथमिकता वडा:</strong> वडा नं.{" "}
                  {localizeNumber(
                    priorityWard?.wardNumber.toString() || "",
                    "ne",
                  )}
                  मा न्यून गुणस्तरका गारो भएका घरहरू{" "}
                  {localizeNumber(
                    priorityWard?.lowQualityPercentage || "0",
                    "ne",
                  )}
                  % रहेकाले त्यहाँको आवासीय सुरक्षा सुधारलाई प्राथमिकता
                  दिनुपर्ने।
                </span>
              </li>
              {parseFloat(vulnerableMaterialPercentage) > 10 && (
                <li className="flex gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>जोखिम न्यूनीकरण:</strong> जस्ता/टिन, बाँसजन्य र अन्य
                    कमजोर सामग्री प्रयोग गरिएका
                    {localizeNumber(vulnerableMaterialPercentage, "ne")}% घरहरू
                    प्राकृतिक विपद्को उच्च जोखिममा रहेकाले त्यस्ता घरहरूको
                    सुधारका लागि विशेष कार्यक्रम ल्याउनुपर्ने।
                  </span>
                </li>
              )}
              {parseFloat(cementJoinedPercentage) < 40 && (
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    <strong>भवन मापदण्ड:</strong> पालिकामा सिमेन्टको जोडाइ भएको
                    गारोका घरहरू जम्मा
                    {localizeNumber(cementJoinedPercentage, "ne")}% मात्र
                    रहेकाले भूकम्प प्रतिरोधी निर्माणका लागि भवन मापदण्ड
                    कार्यान्वयनमा जोड दिनुपर्ने।
                  </span>
                </li>
              )}
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  <strong>प्रविधि हस्तान्तरण:</strong> स्थानीय निर्माण व्यवसायी
                  र कामदारहरूलाई गुणस्तरीय गारो निर्माण तालिमको व्यवस्था गरी
                  प्रविधि हस्तान्तरण गर्नुपर्ने।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सचेतनामूलक कार्यक्रम:</strong> गारोको गुणस्तर र
                  भूकम्पीय सुरक्षासम्बन्धी जनचेतना अभिवृद्धि कार्यक्रमहरू संचालन
                  गर्नुपर्ने।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">गारो गुणस्तर तुलना</h4>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">
                  उच्च गुणस्तरका घरहरू
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          parseFloat(
                            (
                              wardWiseAnalysis.reduce(
                                (sum, ward) =>
                                  sum + parseFloat(ward.highQualityPercentage),
                                0,
                              ) / wardWiseAnalysis.length
                            ).toString(),
                          ),
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      (
                        wardWiseAnalysis.reduce(
                          (sum, ward) =>
                            sum + parseFloat(ward.highQualityPercentage),
                          0,
                        ) / wardWiseAnalysis.length
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा र प्रि फ्याब
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  मध्यम गुणस्तरका घरहरू
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          parseFloat(
                            (
                              wardWiseAnalysis.reduce(
                                (sum, ward) =>
                                  sum +
                                  parseFloat(ward.mediumQualityPercentage),
                                0,
                              ) / wardWiseAnalysis.length
                            ).toString(),
                          ),
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      (
                        wardWiseAnalysis.reduce(
                          (sum, ward) =>
                            sum + parseFloat(ward.mediumQualityPercentage),
                          0,
                        ) / wardWiseAnalysis.length
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  माटोको जोडाइ भएको र काठ/फल्याकको गारो
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  न्यून गुणस्तरका घरहरू
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          parseFloat(
                            (
                              wardWiseAnalysis.reduce(
                                (sum, ward) =>
                                  sum + parseFloat(ward.lowQualityPercentage),
                                0,
                              ) / wardWiseAnalysis.length
                            ).toString(),
                          ),
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      (
                        wardWiseAnalysis.reduce(
                          (sum, ward) =>
                            sum + parseFloat(ward.lowQualityPercentage),
                          0,
                        ) / wardWiseAnalysis.length
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  काँचो इँटा, जस्ता/टिन, बाँसजन्य सामग्री
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
