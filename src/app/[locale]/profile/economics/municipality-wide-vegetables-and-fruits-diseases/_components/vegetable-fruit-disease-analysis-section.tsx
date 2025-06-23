"use client";

import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VegetableFruitDiseaseAnalysisSectionProps {
  vegetableFruitSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalVegetableFruits: number;
  totalPests: number;
  totalDiseases: number;
  VEGETABLE_FRUIT_TYPES: Record<string, string>;
  VEGETABLE_FRUIT_TYPES_EN: Record<string, string>;
  VEGETABLE_FRUIT_COLORS: Record<string, string>;
  mostAffectedVegetableFruit: any;
  avgIssuesPerCrop: number;
}

export default function VegetableFruitDiseaseAnalysisSection({
  vegetableFruitSummary,
  totalVegetableFruits,
  totalPests,
  totalDiseases,
  VEGETABLE_FRUIT_TYPES,
  VEGETABLE_FRUIT_TYPES_EN,
  VEGETABLE_FRUIT_COLORS,
  mostAffectedVegetableFruit,
  avgIssuesPerCrop,
}: VegetableFruitDiseaseAnalysisSectionProps) {
  // Find least affected vegetable/fruit
  const leastAffectedVegetableFruit =
    vegetableFruitSummary[vegetableFruitSummary.length - 1];

  // Calculate disease vs pest ratio
  const diseaseRatio = totalDiseases / (totalDiseases + totalPests);
  const pestRatio = totalPests / (totalDiseases + totalPests);

  // Find most problematic disease and pest categories
  const diseasesByCategory = vegetableFruitSummary.reduce(
    (acc, crop) => {
      crop.majorDiseases.forEach((disease) => {
        acc[disease] = (acc[disease] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const pestsByCategory = vegetableFruitSummary.reduce(
    (acc, crop) => {
      crop.majorPests.forEach((pest) => {
        acc[pest] = (acc[pest] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const topDiseases = Object.entries(diseasesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topPests = Object.entries(pestsByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // SEO attributes
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-vegetables-fruits": totalVegetableFruits.toString(),
    "data-most-affected-vegetable-fruit":
      mostAffectedVegetableFruit &&
      `${mostAffectedVegetableFruit.cropName} / ${VEGETABLE_FRUIT_TYPES_EN[mostAffectedVegetableFruit.crop] || mostAffectedVegetableFruit.crop}`,
    "data-total-issues": (totalDiseases + totalPests).toString(),
    "data-disease-pest-ratio": `${diseaseRatio.toFixed(2)}:${pestRatio.toFixed(2)}`,
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल तरकारी/फलफूल</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalVegetableFruits.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">प्रकार</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल रोगहरू</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalDiseases.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {localizeNumber((diseaseRatio * 100).toFixed(1), "ne")}% कुल
            समस्याको
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल कीटपतंग</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalPests.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {localizeNumber((pestRatio * 100).toFixed(1), "ne")}% कुल समस्याको
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          तरकारी र फलफूल रोग र कीटको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Vegetable and Fruit Disease and Pest Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सबैभन्दा प्रभावित तरकारी/फलफूल
              <span className="sr-only">
                Most Affected Vegetable/Fruit in Khajura
              </span>
            </h4>
            {mostAffectedVegetableFruit && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      VEGETABLE_FRUIT_COLORS[mostAffectedVegetableFruit.crop] ||
                      "#3498DB",
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    {mostAffectedVegetableFruit.cropName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(
                      mostAffectedVegetableFruit.diseasesCount.toString(),
                      "ne",
                    )}{" "}
                    रोग +{" "}
                    {localizeNumber(
                      mostAffectedVegetableFruit.pestsCount.toString(),
                      "ne",
                    )}{" "}
                    कीट ={" "}
                    {localizeNumber(
                      mostAffectedVegetableFruit.totalIssues.toString(),
                      "ne",
                    )}{" "}
                    कुल समस्या
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top affected vegetables/fruits visualization */}
              {vegetableFruitSummary.slice(0, 3).map((crop, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {crop.cropName}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(crop.totalIssues.toString(), "ne")} समस्या
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((crop.totalIssues / Math.max(...vegetableFruitSummary.map((c) => c.totalIssues))) * 100, 100)}%`,
                        backgroundColor:
                          VEGETABLE_FRUIT_COLORS[crop.crop] || "#3498DB",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">रोग बनाम कीट विश्लेषण</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>रोगहरू</span>
                  <span className="font-medium">
                    {localizeNumber((diseaseRatio * 100).toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${diseaseRatio * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>कीटपतंगहरू</span>
                  <span className="font-medium">
                    {localizeNumber((pestRatio * 100).toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${pestRatio * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">कम प्रभावित तरकारी/फलफूल</h5>
              {leastAffectedVegetableFruit && (
                <div className="text-center">
                  <p className="text-lg font-bold">
                    {leastAffectedVegetableFruit.cropName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {localizeNumber(
                      leastAffectedVegetableFruit.totalIssues.toString(),
                      "ne",
                    )}{" "}
                    कुल समस्या मात्र
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">प्रमुख रोगहरू</h4>
            <div className="space-y-2">
              {topDiseases.map(([disease, count], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{disease}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${(count / topDiseases[0][1]) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs w-8 text-right">
                      {localizeNumber(count.toString(), "ne")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">प्रमुख कीटपतंगहरू</h4>
            <div className="space-y-2">
              {topPests.map(([pest, count], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{pest}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(count / topPests[0][1]) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs w-8 text-right">
                      {localizeNumber(count.toString(), "ne")}
                    </span>
                  </div>
                </div>
              ))}
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
                  <strong>समस्या वितरण:</strong> पालिकामा सबैभन्दा बढी समस्या{" "}
                  {mostAffectedVegetableFruit?.cropName || ""} मा देखिन्छ, जसमा{" "}
                  {localizeNumber(
                    mostAffectedVegetableFruit?.totalIssues.toString() || "0",
                    "ne",
                  )}{" "}
                  प्रकारका रोग र कीटपतंगहरू रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>रोग बनाम कीट अनुपात:</strong> कुल समस्यामध्ये{" "}
                  {localizeNumber((diseaseRatio * 100).toFixed(1), "ne")}% रोग र{" "}
                  {localizeNumber((pestRatio * 100).toFixed(1), "ne")}% कीटपतंग
                  रहेका छन्। यसले पालिकाको तरकारी संरक्षण रणनीति निर्धारणमा
                  सहायता गर्छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>औसत समस्या:</strong> प्रत्येक तरकारी/फलफूलमा औसतमा{" "}
                  {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")} प्रकारका
                  समस्याहरू देखिन्छन्, जुन व्यवस्थापनको दृष्टिकोणले मध्यम
                  चुनौतीपूर्ण अवस्था हो।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>प्राथमिकता क्षेत्र:</strong>{" "}
                  {topDiseases[0]?.[0] || ""} र {topPests[0]?.[0] || ""} जस्ता
                  समस्याहरूलाई प्राथमिकतामा राखेर व्यवस्थापन गर्नुपर्ने देखिन्छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">व्यवस्थापन सुझावहरू</h4>

            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-1">
                  तत्काल आवश्यक कार्यहरू
                </h5>
                <ul className="text-xs space-y-1 ml-4">
                  <li>
                    • {mostAffectedVegetableFruit?.cropName || ""} मा विशेष
                    ध्यान दिनुपर्ने
                  </li>
                  <li>
                    • {topDiseases[0]?.[0] || ""} को रोकथामका लागि उपाय अपनाउने
                  </li>
                  <li>
                    • {topPests[0]?.[0] || ""} को नियन्त्रणका लागि IPM अपनाउने
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">दीर्घकालीन रणनीति</h5>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• प्रतिरोधी किस्महरूको अनुसन्धान र विकास</li>
                  <li>• जैविक नियन्त्रण विधिहरूको प्रवर्द्धन</li>
                  <li>• किसान शिक्षा र क्षमता विकास कार्यक्रम</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/economics/municipality-wide-vegetables"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  तरकारी उत्पादन
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
                <Link
                  href="/profile/economics/municipality-wide-crop-diseases"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  बाली रोग कीट
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
