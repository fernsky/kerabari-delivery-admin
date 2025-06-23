import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseEducationalLevelAnalysisSectionProps {
  totalPopulation: number;
  educationGroupTotals: Record<string, number>;
  educationGroupPercentages: Record<string, number>;
  educationLevelTotals: Record<string, number>;
  educationalLevelMap: Record<string, string>;
  wardWiseHigherEducation: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  leastEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  EDUCATIONAL_LEVEL_GROUPS: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
      levels: string[];
    }
  >;
}

export default function WardWiseEducationalLevelAnalysisSection({
  totalPopulation,
  educationGroupTotals,
  educationGroupPercentages,
  educationLevelTotals,
  educationalLevelMap,
  wardWiseHigherEducation,
  bestEducatedWard,
  leastEducatedWard,
  EDUCATIONAL_LEVEL_GROUPS,
}: WardWiseEducationalLevelAnalysisSectionProps) {
  // Calculate educational index based on education group distribution
  // Higher weight for higher education levels
  const educationIndex =
    (educationGroupPercentages.PRIMARY * 0.1 +
      educationGroupPercentages.LOWER_SECONDARY * 0.2 +
      educationGroupPercentages.SECONDARY * 0.3 +
      educationGroupPercentages.HIGHER_SECONDARY * 0.5 +
      educationGroupPercentages.HIGHER_EDUCATION * 1.0 +
      educationGroupPercentages.OTHER * 0.1) /
    100;

  // Determine education level based on index score
  const educationLevel =
    educationIndex >= 0.5
      ? "उच्च"
      : educationIndex >= 0.3
        ? "मध्यम"
        : "आधारभूत";

  // Find highest education level with significant population
  let highestSignificantLevel = "";
  let highestLevelPopulation = 0;

  Object.keys(educationLevelTotals).forEach((level) => {
    if (educationLevelTotals[level] > highestLevelPopulation) {
      highestLevelPopulation = educationLevelTotals[level];
      highestSignificantLevel = level;
    }
  });

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-population": totalPopulation.toString(),
    "data-higher-education-rate":
      educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
    "data-best-educated-ward": bestEducatedWard?.wardNumber.toString() || "",
    "data-least-educated-ward": leastEducatedWard?.wardNumber.toString() || "",
    "data-education-index": educationIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(EDUCATIONAL_LEVEL_GROUPS).map((groupKey) => {
          const group =
            EDUCATIONAL_LEVEL_GROUPS[
              groupKey as keyof typeof EDUCATIONAL_LEVEL_GROUPS
            ];
          const percentage = educationGroupPercentages[groupKey];
          const total = educationGroupTotals[groupKey];

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
                  {localizeNumber(total.toLocaleString(), "ne")} जना
                  <span className="sr-only">
                    ({total.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          शैक्षिक स्तर विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Educational Level Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-educated"
            data-ward-number={bestEducatedWard?.wardNumber}
            data-percentage={bestEducatedWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              उच्च शिक्षा प्राप्ति उच्च भएको वडा
              <span className="sr-only">
                Ward with Highest Higher Education Rate in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestEducatedWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestEducatedWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    उच्च शिक्षा दर:{" "}
                    {localizeNumber(
                      bestEducatedWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestEducatedWard.percentage.toFixed(2)}% higher education
                      rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा उच्च शिक्षा हासिल गरेको जनसंख्याको प्रतिशत सबैभन्दा
                  बढी रहेको छ, जुन पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      bestEducatedWard.percentage -
                      educationGroupPercentages.HIGHER_EDUCATION
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा शैक्षिक संस्थाहरूको उपलब्धता, परिवारको आर्थिक
                  अवस्था र शिक्षाप्रति सकारात्मक दृष्टिकोण रहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="least-educated"
            data-ward-number={leastEducatedWard?.wardNumber}
            data-percentage={leastEducatedWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              उच्च शिक्षा प्राप्ति न्यून भएको वडा
              <span className="sr-only">
                Ward with Low Higher Education Rate in Khajura
              </span>
            </h4>
            {leastEducatedWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: EDUCATIONAL_LEVEL_GROUPS.PRIMARY.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      leastEducatedWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    उच्च शिक्षा दर:{" "}
                    {localizeNumber(
                      leastEducatedWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {leastEducatedWard.percentage.toFixed(2)}% higher
                      education rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेष ध्यान दिनुपर्ने</h5>
              <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm">
                  यस वडामा उच्च शिक्षाको दर न्यून रहेको छ, जसले यहाँ शैक्षिक
                  संस्थाहरूको पहुँच, आर्थिक अवस्था वा अन्य सामाजिक कारणहरूले
                  उच्च शिक्षामा पहुँच कम भएको संकेत गर्दछ। यस वडामा शिक्षा
                  प्रवर्द्धनका लागि विशेष कार्यक्रम सञ्चालन गर्नुपर्ने देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शैक्षिक स्तर सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber((educationIndex * 100).toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{educationLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> शैक्षिक स्तरको यो सूचकाङ्क
                  विभिन्न शैक्षिक स्तरहरूको भारित औसतमा आधारित छ, जहाँ उच्च
                  शिक्षालाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber((educationIndex * 100).toFixed(1), "ne")}{" "}
                  अंकले {educationLevel} शैक्षिक स्तर दर्शाउँछ। यसमा सुधारका
                  लागि उच्च शिक्षा प्रवर्द्धनका कार्यक्रमहरू आवश्यक छन्।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शैक्षिक विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                सबैभन्दा बढी जनसंख्या भएको शैक्षिक स्तर
              </h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {highestSignificantLevel &&
                      educationalLevelMap[highestSignificantLevel]
                        ? educationalLevelMap[highestSignificantLevel]
                        : "अज्ञात"}
                    </span>
                    <span className="font-medium">
                      {highestLevelPopulation > 0
                        ? localizeNumber(
                            (
                              (highestLevelPopulation / totalPopulation) *
                              100
                            ).toFixed(2),
                            "ne",
                          )
                        : "0.00"}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(highestLevelPopulation / totalPopulation) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <h5 className="font-medium mb-2">उच्च शिक्षाको अवस्था</h5>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                      उच्च शिक्षा (स्नातक र सोभन्दा माथि)
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${educationGroupPercentages.HIGHER_EDUCATION}%`,
                        backgroundColor:
                          EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2 mt-4">माध्यमिक शिक्षा</h5>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            EDUCATIONAL_LEVEL_GROUPS.SECONDARY.color,
                        }}
                      ></span>
                      माध्यमिक तह
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        educationGroupPercentages.SECONDARY.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${educationGroupPercentages.SECONDARY}%`,
                        backgroundColor:
                          EDUCATIONAL_LEVEL_GROUPS.SECONDARY.color,
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
