"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardData {
  wardNumber: number;
  wardName: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  otherPopulation: number;
  totalHouseholds: number;
  averageHouseholdSize: number;
  sexRatio: number;
}

interface WardWiseDemographicsAnalysisProps {
  wardData: WardData[];
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function WardWiseDemographicsAnalysis({
  wardData,
  municipalityStats,
  municipalityAverages,
}: WardWiseDemographicsAnalysisProps) {
  // Sort ward data for analysis
  const sortedByPopulation = [...wardData].sort(
    (a, b) => b.totalPopulation - a.totalPopulation,
  );

  const sortedBySexRatio = [...wardData].sort(
    (a, b) => b.sexRatio - a.sexRatio,
  );

  const sortedByHouseholdSize = [...wardData].sort(
    (a, b) => b.averageHouseholdSize - a.averageHouseholdSize,
  );

  const sortedByHouseholds = [...wardData].sort(
    (a, b) => b.totalHouseholds - a.totalHouseholds,
  );

  // Find wards with highest and lowest values
  const highestPopulationWard = sortedByPopulation[0];
  const lowestPopulationWard =
    sortedByPopulation[sortedByPopulation.length - 1];

  const highestSexRatioWard = sortedBySexRatio[0];
  const lowestSexRatioWard = sortedBySexRatio[sortedBySexRatio.length - 1];

  const highestHouseholdSizeWard = sortedByHouseholdSize[0];
  const lowestHouseholdSizeWard =
    sortedByHouseholdSize[sortedByHouseholdSize.length - 1];

  const highestHouseholdsWard = sortedByHouseholds[0];
  const lowestHouseholdsWard =
    sortedByHouseholds[sortedByHouseholds.length - 1];

  // Calculate variance in distribution
  const populationVariance = calculateVariance(
    wardData.map((ward) => ward.totalPopulation),
  );
  const populationRange =
    highestPopulationWard.totalPopulation -
    lowestPopulationWard.totalPopulation;
  const populationStandardDeviation = Math.sqrt(populationVariance);
  const populationCoefficientOfVariation =
    (populationStandardDeviation /
      (municipalityStats.totalPopulation / wardData.length)) *
    100;

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        localizeNumber(municipalityStats.totalPopulation.toString(), "ne"),
      );
      document.body.setAttribute(
        "data-total-households",
        localizeNumber(municipalityStats.totalHouseholds.toString(), "ne"),
      );
      document.body.setAttribute(
        "data-ward-count",
        localizeNumber(wardData.length.toString(), "ne"),
      );

      // Add highest population ward data
      if (highestPopulationWard) {
        document.body.setAttribute(
          "data-highest-population-ward",
          localizeNumber(highestPopulationWard.wardNumber.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-highest-population-value",
          localizeNumber(
            highestPopulationWard.totalPopulation.toString(),
            "ne",
          ),
        );
      }

      // Add sex ratio data
      document.body.setAttribute(
        "data-sex-ratio",
        localizeNumber(municipalityAverages.sexRatio.toString(), "ne"),
      );

      // Add household size data
      document.body.setAttribute(
        "data-average-household-size",
        localizeNumber(
          municipalityAverages.averageHouseholdSize.toString(),
          "ne",
        ),
      );
    }
  }, [
    wardData,
    municipalityStats,
    municipalityAverages,
    highestPopulationWard,
  ]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वडा संख्या
              <span className="sr-only">Ward Count of Khajura</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {localizeNumber(wardData.length, "ne")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              गढवा गाउँपालिकामा रहेका वडाहरूको कुल संख्या
              <span className="sr-only">
                Total number of wards in Khajura Rural Municipality
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              औसत जनसंख्या
              <span className="sr-only">Average Population in Khajura</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {localizeNumber(
                Math.round(
                  municipalityStats.totalPopulation / wardData.length,
                ).toLocaleString(),
                "ne",
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              गढवा गाउँपालिकामा प्रति वडाको औसत जनसंख्या
              <span className="sr-only">
                Average population per ward in Khajura
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              औसत घरधुरी
              <span className="sr-only">Average Households in Khajura</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {localizeNumber(
                Math.round(
                  municipalityStats.totalHouseholds / wardData.length,
                ).toLocaleString(),
                "ne",
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              गढवा गाउँपालिकामा प्रति वडामा रहेको औसत घरधुरी संख्या
              <span className="sr-only">
                Average number of households per ward in Khajura
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वितरण विविधता
              <span className="sr-only">Distribution Diversity in Khajura</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {localizeNumber(
                populationCoefficientOfVariation.toFixed(1),
                "ne",
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              गढवा गाउँपालिकाको वडागत जनसंख्या वितरणको विविधता सूचक
              <span className="sr-only">
                Ward population distribution diversity index in Khajura
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          गढवा गाउँपालिकाको वडागत अधिकतम र न्यूनतम सूचकहरू
          <span className="sr-only">
            Ward-wise Maximum and Minimum Indicators in Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="population-distribution"
          >
            <h4 className="font-medium mb-2">जनसंख्या अनुपात</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी जनसंख्या:</span>
                <span className="font-medium">
                  वडा {localizeNumber(highestPopulationWard.wardNumber, "ne")} (
                  {localizeNumber(
                    highestPopulationWard.totalPopulation.toLocaleString(),
                    "ne",
                  )}{" "}
                  जना)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम जनसंख्या:</span>
                <span className="font-medium">
                  वडा {localizeNumber(lowestPopulationWard.wardNumber, "ne")} (
                  {localizeNumber(
                    lowestPopulationWard.totalPopulation.toLocaleString(),
                    "ne",
                  )}{" "}
                  जना)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>जनसंख्याको दायरा:</span>
                <span className="font-medium">
                  {localizeNumber(populationRange.toLocaleString(), "ne")} जना
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="gender-ratio"
          >
            <h4 className="font-medium mb-2">लैङ्गिक अनुपात</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>उच्चतम लैङ्गिक अनुपात:</span>
                <span className="font-medium">
                  वडा {localizeNumber(highestSexRatioWard.wardNumber, "ne")} (
                  {localizeNumber(
                    highestSexRatioWard.sexRatio.toFixed(1),
                    "ne",
                  )}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>न्यूनतम लैङ्गिक अनुपात:</span>
                <span className="font-medium">
                  वडा {localizeNumber(lowestSexRatioWard.wardNumber, "ne")} (
                  {localizeNumber(lowestSexRatioWard.sexRatio.toFixed(1), "ne")}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>पालिकाको औसत:</span>
                <span className="font-medium">
                  {localizeNumber(
                    municipalityAverages.sexRatio.toFixed(1),
                    "ne",
                  )}
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="household-count"
          >
            <h4 className="font-medium mb-2">घरधुरी संख्या</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी घरधुरी:</span>
                <span className="font-medium">
                  वडा {localizeNumber(highestHouseholdsWard.wardNumber, "ne")} (
                  {localizeNumber(
                    highestHouseholdsWard.totalHouseholds.toLocaleString(),
                    "ne",
                  )}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम घरधुरी:</span>
                <span className="font-medium">
                  वडा {localizeNumber(lowestHouseholdsWard.wardNumber, "ne")} (
                  {localizeNumber(
                    lowestHouseholdsWard.totalHouseholds.toLocaleString(),
                    "ne",
                  )}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>औसत घरधुरी प्रति वडा:</span>
                <span className="font-medium">
                  {localizeNumber(
                    Math.round(
                      municipalityStats.totalHouseholds / wardData.length,
                    ).toLocaleString(),
                    "ne",
                  )}
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="family-size"
          >
            <h4 className="font-medium mb-2">परिवार संख्या</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी परिवार संख्या:</span>
                <span className="font-medium">
                  वडा{" "}
                  {localizeNumber(highestHouseholdSizeWard.wardNumber, "ne")} (
                  {localizeNumber(
                    highestHouseholdSizeWard.averageHouseholdSize.toFixed(2),
                    "ne",
                  )}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम परिवार संख्या:</span>
                <span className="font-medium">
                  वडा {localizeNumber(lowestHouseholdSizeWard.wardNumber, "ne")}{" "}
                  (
                  {localizeNumber(
                    lowestHouseholdSizeWard.averageHouseholdSize.toFixed(2),
                    "ne",
                  )}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>पालिकाको औसत:</span>
                <span className="font-medium">
                  {localizeNumber(
                    municipalityAverages.averageHouseholdSize.toFixed(2),
                    "ne",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          गढवा गाउँपालिकाको वडागत विश्लेषण
          <span className="sr-only">Ward-wise Analysis of Khajura</span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            गढवा गाउँपालिकाको वडागत जनसंख्या वितरण विश्लेषणबाट निम्न
            निष्कर्षहरू निकाल्न सकिन्छ:
          </p>

          <ul itemScope itemType="https://schema.org/ItemList">
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="1" />
              <div itemProp="item">
                <strong>जनसंख्या वितरण:</strong> गढवा गाउँपालिकाभित्र वडाहरू
                बीच जनसंख्याको विविधता सूचक{" "}
                {localizeNumber(
                  populationCoefficientOfVariation.toFixed(1),
                  "ne",
                )}
                % रहेको छ, जुन{" "}
                {populationCoefficientOfVariation > 30
                  ? "उच्च"
                  : populationCoefficientOfVariation > 15
                    ? "मध्यम"
                    : "कम"}{" "}
                स्तरको असमानता देखाउँछ।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="2" />
              <div itemProp="item">
                <strong>लैङ्गिक अनुपात:</strong> गढवा गाउँपालिकाका विभिन्न
                वडाहरूमा लैङ्गिक अनुपात{" "}
                {localizeNumber(lowestSexRatioWard.sexRatio.toFixed(1), "ne")}{" "}
                देखि{" "}
                {localizeNumber(highestSexRatioWard.sexRatio.toFixed(1), "ne")}{" "}
                सम्म रहेको छ। वडा{" "}
                {localizeNumber(highestSexRatioWard.wardNumber, "ne")} मा
                सबैभन्दा बढी र वडा{" "}
                {localizeNumber(lowestSexRatioWard.wardNumber, "ne")} मा
                सबैभन्दा कम लैङ्गिक अनुपात रहेको छ।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="3" />
              <div itemProp="item">
                <strong>घरधुरी:</strong> वडा{" "}
                {localizeNumber(highestHouseholdsWard.wardNumber, "ne")} मा
                सबैभन्दा बढी घरधुरी (
                {localizeNumber(
                  highestHouseholdsWard.totalHouseholds.toLocaleString(),
                  "ne",
                )}
                ) छन्, जबकि वडा{" "}
                {localizeNumber(lowestHouseholdsWard.wardNumber, "ne")} मा
                सबैभन्दा कम घरधुरी (
                {localizeNumber(
                  lowestHouseholdsWard.totalHouseholds.toLocaleString(),
                  "ne",
                )}
                ) रहेका छन्।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="4" />
              <div itemProp="item">
                <strong>परिवार संख्या:</strong> गढवा गाउँपालिकामा औसत परिवार
                संख्यामा पनि वडा अनुसार भिन्नता देखिन्छ, जुन वडा{" "}
                {localizeNumber(lowestHouseholdSizeWard.wardNumber, "ne")} को{" "}
                {localizeNumber(
                  lowestHouseholdSizeWard.averageHouseholdSize.toFixed(2),
                  "ne",
                )}{" "}
                देखि वडा{" "}
                {localizeNumber(highestHouseholdSizeWard.wardNumber, "ne")} को{" "}
                {localizeNumber(
                  highestHouseholdSizeWard.averageHouseholdSize.toFixed(2),
                  "ne",
                )}{" "}
                सम्म रहेको छ।
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          गढवा गाउँपालिकाको नीतिगत सुझाव
          <span className="sr-only">Policy Recommendations for Khajura</span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            गढवा गाउँपालिकाको वडागत विश्लेषणका आधारमा निम्न नीतिगत सुझावहरू
            प्रस्तुत गरिएका छन्:
          </p>

          <ul>
            <li>
              <strong>समतामूलक विकास:</strong> वडा{" "}
              {localizeNumber(highestPopulationWard.wardNumber, "ne")} र वडा{" "}
              {localizeNumber(lowestPopulationWard.wardNumber, "ne")} बीचको
              जनसंख्या असमानतालाई सम्बोधन गर्न गढवा गाउँपालिकाको विकास योजना
              र बजेट विनियोजनमा समतामूलक दृष्टिकोण अपनाउने।
            </li>
            <li>
              <strong>लैङ्गिक समानता:</strong> गढवा गाउँपालिकाको न्यून
              लैङ्गिक अनुपात भएका वडाहरूमा (विशेष गरी वडा{" "}
              {localizeNumber(lowestSexRatioWard.wardNumber, "ne")}) लैङ्गिक
              समानता सम्बन्धी विशेष कार्यक्रमहरू सञ्चालन गर्ने।
            </li>
            <li>
              <strong>घरधुरी सर्वेक्षण:</strong> गढवा गाउँपालिकाको उच्च
              परिवार संख्या भएका वडाहरूमा (विशेष गरी वडा{" "}
              {localizeNumber(highestHouseholdSizeWard.wardNumber, "ne")})
              परिवार नियोजन र सचेतना कार्यक्रम सञ्चालन गर्ने।
            </li>
            <li>
              <strong>वडागत योजना:</strong> गढवा गाउँपालिकाको प्रत्येक वडाको
              विशिष्ट जनसांख्यिकी विशेषतालाई ध्यानमा राखेर वडागत विकास योजना
              तर्जुमा गर्ने।
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

// Helper function to calculate variance
function calculateVariance(data: number[]): number {
  const n = data.length;
  if (n === 0) return 0;

  const mean = data.reduce((sum, value) => sum + value, 0) / n;
  const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / n;

  return variance;
}
