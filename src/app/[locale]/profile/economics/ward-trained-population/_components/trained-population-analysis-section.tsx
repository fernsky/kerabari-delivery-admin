"use client";

import Link from "next/link";
import { useEffect } from "react";

interface TrainedPopulationAnalysisSectionProps {
  trainedPopulationData: Array<{
    id?: string;
    wardNumber: number;
    trainedPopulation: number;
  }>;
  totalTrainedPopulation: number;
  wardNumbers: number[];
}

export default function TrainedPopulationAnalysisSection({
  trainedPopulationData,
  totalTrainedPopulation,
  wardNumbers,
}: TrainedPopulationAnalysisSectionProps) {
  // Sort data by trained population (descending)
  const sortedByTrainedPopulation = [...trainedPopulationData].sort(
    (a, b) => b.trainedPopulation - a.trainedPopulation,
  );

  // Calculate top ward and bottom ward
  const topWard = sortedByTrainedPopulation[0];
  const bottomWard =
    sortedByTrainedPopulation[sortedByTrainedPopulation.length - 1];

  // Calculate ratio between top and bottom ward
  const topBottomRatio =
    topWard && bottomWard && bottomWard.trainedPopulation > 0
      ? (topWard.trainedPopulation / bottomWard.trainedPopulation).toFixed(2)
      : "N/A";

  // Calculate average trained population per ward
  const averageTrainedPopulation = Math.round(
    totalTrainedPopulation / wardNumbers.length,
  );

  // Calculate wards above and below average
  const wardsAboveAverage = trainedPopulationData.filter(
    (item) => item.trainedPopulation > averageTrainedPopulation,
  ).length;

  const wardsBelowAverage = trainedPopulationData.filter(
    (item) => item.trainedPopulation < averageTrainedPopulation,
  ).length;

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-trained-population",
        totalTrainedPopulation.toString(),
      );
      document.body.setAttribute(
        "data-average-trained-population-per-ward",
        averageTrainedPopulation.toString(),
      );

      // Add top and bottom ward data
      if (topWard) {
        document.body.setAttribute(
          "data-highest-trained-population-ward",
          topWard.wardNumber.toString(),
        );
        document.body.setAttribute(
          "data-highest-trained-population-count",
          topWard.trainedPopulation.toString(),
        );
      }

      if (bottomWard) {
        document.body.setAttribute(
          "data-lowest-trained-population-ward",
          bottomWard.wardNumber.toString(),
        );
        document.body.setAttribute(
          "data-lowest-trained-population-count",
          bottomWard.trainedPopulation.toString(),
        );
      }
    }
  }, [
    trainedPopulationData,
    totalTrainedPopulation,
    topWard,
    bottomWard,
    averageTrainedPopulation,
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Total Trained Population Card */}
        <div
          className="bg-muted/50 rounded-lg p-6 relative overflow-hidden"
          data-metric="total-trained-population"
          data-value={totalTrainedPopulation}
        >
          <h3 className="text-lg font-medium mb-1">
            कुल तालिम प्राप्त जनसंख्या
            <span className="sr-only">Total Trained Population</span>
          </h3>
          <p className="text-3xl font-bold">
            {totalTrainedPopulation.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            सबै वडाहरूको समग्र तालिम प्राप्त व्यक्तिहरू
          </p>
        </div>

        {/* Average Trained Population Card */}
        <div
          className="bg-muted/50 rounded-lg p-6 relative overflow-hidden"
          data-metric="average-trained-population"
          data-value={averageTrainedPopulation}
        >
          <h3 className="text-lg font-medium mb-1">
            औसत तालिम प्राप्त जनसंख्या
            <span className="sr-only">Average Trained Population per Ward</span>
          </h3>
          <p className="text-3xl font-bold">
            {averageTrainedPopulation.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            प्रति वडा औसत तालिम प्राप्त व्यक्तिहरू
          </p>
        </div>

        {/* Ward with Highest Trained Population */}
        <div
          className="bg-muted/50 rounded-lg p-6 relative overflow-hidden"
          data-metric="highest-trained-population-ward"
          data-ward={topWard?.wardNumber}
          data-value={topWard?.trainedPopulation}
        >
          <h3 className="text-lg font-medium mb-1">
            सर्वाधिक तालिम प्राप्त वडा
            <span className="sr-only">
              Ward with Highest Trained Population
            </span>
          </h3>
          <p className="text-3xl font-bold">
            {topWard ? `वडा ${topWard.wardNumber}` : "N/A"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {topWard
              ? `${topWard.trainedPopulation.toLocaleString()} तालिम प्राप्त व्यक्तिहरू`
              : ""}
          </p>
        </div>

        {/* Ward with Lowest Trained Population */}
        <div
          className="bg-muted/50 rounded-lg p-6 relative overflow-hidden"
          data-metric="lowest-trained-population-ward"
          data-ward={bottomWard?.wardNumber}
          data-value={bottomWard?.trainedPopulation}
        >
          <h3 className="text-lg font-medium mb-1">
            न्यूनतम तालिम प्राप्त वडा
            <span className="sr-only">Ward with Lowest Trained Population</span>
          </h3>
          <p className="text-3xl font-bold">
            {bottomWard ? `वडा ${bottomWard.wardNumber}` : "N/A"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {bottomWard
              ? `${bottomWard.trainedPopulation.toLocaleString()} तालिम प्राप्त व्यक्तिहरू`
              : ""}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          वडागत प्रवृत्ति विश्लेषण
          <span className="sr-only">
            Ward-wise Trend Analysis of Trained Population
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="wards-distribution"
            data-above-average={wardsAboveAverage}
            data-below-average={wardsBelowAverage}
          >
            <h4 className="font-medium mb-2">
              वडागत वितरण
              <span className="sr-only">
                Ward-wise Distribution in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-sm mb-2">
              औसत भन्दा माथि:{" "}
              <span className="font-semibold">{wardsAboveAverage} वडाहरू</span>
            </p>
            <p className="text-sm">
              औसत भन्दा कम:{" "}
              <span className="font-semibold">{wardsBelowAverage} वडाहरू</span>
            </p>
            <div className="w-full bg-muted h-4 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(wardsAboveAverage / wardNumbers.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span>
                {Math.round((wardsAboveAverage / wardNumbers.length) * 100)}%
              </span>
              <span>
                {Math.round((wardsBelowAverage / wardNumbers.length) * 100)}%
              </span>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="top-bottom-ratio"
            data-ratio={topBottomRatio}
            data-top-ward={topWard?.wardNumber}
            data-bottom-ward={bottomWard?.wardNumber}
          >
            <h4 className="font-medium mb-2">
              उच्च-न्यून वडा अनुपात
              <span className="sr-only">
                Highest to Lowest Ward Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">{topBottomRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topWard && bottomWard
                ? `वडा ${topWard.wardNumber} मा वडा ${bottomWard.wardNumber} को तुलनामा ${topBottomRatio} गुणा बढी तालिम प्राप्त व्यक्तिहरू छन्`
                : ""}
              <span className="sr-only">
                {topWard && bottomWard
                  ? `Ward ${topWard.wardNumber} has ${topBottomRatio} times more trained people than Ward ${bottomWard.wardNumber} in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Trained Population in Khajura
          </span>
        </h3>
        <p>
          गढवा गाउँपालिकाको तालिम प्राप्त जनसंख्या सम्बन्धी थप जानकारी वा
          विस्तृत तथ्याङ्कको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक तथ्याङ्क
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
