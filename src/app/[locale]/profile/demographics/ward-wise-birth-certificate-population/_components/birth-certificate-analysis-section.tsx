"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateAnalysisSectionProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    withCertificate: number;
    withoutCertificate: number;
    total: number;
    percentageWithCertificate: string;
    percentageOfTotal: string;
    coverageRate: string;
  }>;
  totalWithCertificate: number;
  totalWithoutCertificate: number;
  totalPopulation: number;
  highestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  lowestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  highestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
  lowestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
}

export default function BirthCertificateAnalysisSection({
  wardWiseAnalysis,
  totalWithCertificate,
  totalWithoutCertificate,
  totalPopulation,
  highestWard,
  lowestWard,
  highestCoverageWard,
  lowestCoverageWard,
}: BirthCertificateAnalysisSectionProps) {
  // Consistent color palette
  const CHART_COLORS = {
    primary: "#0891b2", // Teal color - for with certificate
    secondary: "#f97316", // Orange color - for without certificate
    accent: "#0369a1", // Darker blue
    muted: "#e0f2fe", // Very light blue
  };

  // Calculate overall coverage rate
  const overallCoverageRate =
    totalPopulation > 0
      ? ((totalWithCertificate / totalPopulation) * 100).toFixed(2)
      : "0";

  // Calculate average population and coverage per ward
  const averagePopulationPerWard = totalPopulation / wardWiseAnalysis.length;
  const averageCoverageRate = parseFloat(overallCoverageRate);

  // Calculate wards above and below average coverage
  const wardsAboveAverageCoverage = wardWiseAnalysis.filter(
    (ward) => parseFloat(ward.coverageRate) > averageCoverageRate,
  ).length;

  const wardsBelowAverageCoverage = wardWiseAnalysis.filter(
    (ward) => parseFloat(ward.coverageRate) < averageCoverageRate,
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
        "data-total-population-under-5",
        totalPopulation.toString(),
      );
      document.body.setAttribute(
        "data-with-birth-certificate",
        totalWithCertificate.toString(),
      );
      document.body.setAttribute(
        "data-without-birth-certificate",
        totalWithoutCertificate.toString(),
      );
      document.body.setAttribute(
        "data-overall-coverage-rate",
        overallCoverageRate,
      );

      // Add highest ward data
      document.body.setAttribute(
        "data-highest-certificate-ward",
        highestWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-highest-certificate-count",
        highestWard.withCertificate.toString(),
      );
      document.body.setAttribute(
        "data-highest-coverage-ward",
        highestCoverageWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-highest-coverage-rate",
        highestCoverageWard.coverageRate,
      );

      // Add lowest ward data
      document.body.setAttribute(
        "data-lowest-certificate-ward",
        lowestWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-lowest-coverage-ward",
        lowestCoverageWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-lowest-coverage-rate",
        lowestCoverageWard.coverageRate,
      );
    }
  }, [
    totalPopulation,
    totalWithCertificate,
    totalWithoutCertificate,
    overallCoverageRate,
    highestWard,
    lowestWard,
    highestCoverageWard,
    lowestCoverageWard,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {wardWiseAnalysis.slice(0, 8).map((ward, index) => {
          // Calculate coverage percentage
          const coverageRate = parseFloat(ward.coverageRate);

          // Determine if this ward is above or below average
          const isAboveAverage = coverageRate > averageCoverageRate;

          return (
            <div
              key={index}
              className={`bg-muted/50 rounded-lg p-4 text-center min-w-[150px] relative overflow-hidden ${
                ward.wardNumber === highestCoverageWard.wardNumber
                  ? "border-2 border-blue-300"
                  : ""
              }`}
              // Add data attributes for SEO crawlers
              data-ward={ward.wardNumber}
              data-with-certificate={ward.withCertificate}
              data-without-certificate={ward.withoutCertificate}
              data-total={ward.total}
              data-coverage-rate={ward.coverageRate}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${coverageRate}%`,
                  backgroundColor: isAboveAverage
                    ? CHART_COLORS.primary
                    : CHART_COLORS.secondary,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">Ward {ward.wardNumber}</span>
                </h3>
                <div className="flex justify-between text-sm">
                  <span>जन्मदर्ता भएका:</span>
                  <span className="font-medium">
                    {localizeNumber(
                      ward.withCertificate.toLocaleString(),
                      "ne",
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>जन्मदर्ता नभएका:</span>
                  <span className="font-medium">
                    {localizeNumber(
                      ward.withoutCertificate.toLocaleString(),
                      "ne",
                    )}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  कभरेज: {localizeNumber(ward.coverageRate, "ne")}%
                  <span className="sr-only">
                    (Coverage: {ward.coverageRate}%)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          जन्मदर्ता प्रमाणपत्र विश्लेषण
          <span className="sr-only">Birth Certificate Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-birth-certificate-ward"
            data-percentage={highestWard.percentageWithCertificate}
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी जन्मदर्ता प्रमाणपत्र भएको वडा
              <span className="sr-only">
                Ward with Highest Birth Certificate Registration in Khajura
                Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {localizeNumber(highestWard.wardNumber.toString(), "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(
                highestWard.withCertificate.toLocaleString(),
                "ne",
              )}{" "}
              जना
              <span className="sr-only">
                {highestWard.withCertificate} children
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-coverage-ward"
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा उच्च जन्मदर्ता कभरेज दर भएको वडा
              <span className="sr-only">
                Ward with Highest Birth Certificate Coverage in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(highestCoverageWard.wardNumber.toString(), "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कभरेज दर: {localizeNumber(highestCoverageWard.coverageRate, "ne")}
              %
              <span className="sr-only">
                Coverage rate: {highestCoverageWard.coverageRate}%
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            जन्मदर्ता कभरेज विश्लेषण
            <span className="sr-only">Birth Certificate Coverage Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">औसत कभरेज</h5>
              <p className="text-sm text-muted-foreground">
                समग्र जन्मदर्ता कभरेज दर:{" "}
                {localizeNumber(overallCoverageRate, "ne")}%
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${overallCoverageRate}%`,
                    backgroundColor: CHART_COLORS.primary,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium">औसत कभरेज भन्दा माथि र तल</h5>
              <p className="text-sm text-muted-foreground">
                औसत भन्दा बढी:{" "}
                {localizeNumber(wardsAboveAverageCoverage.toString(), "ne")} वडा
                | औसत भन्दा कम:{" "}
                {localizeNumber(wardsBelowAverageCoverage.toString(), "ne")} वडा
              </p>
              <div className="flex w-full mt-2 gap-1">
                <div
                  className="h-2 rounded-l-full"
                  style={{
                    width: `${(wardsAboveAverageCoverage / wardWiseAnalysis.length) * 100}%`,
                    backgroundColor: CHART_COLORS.primary,
                  }}
                ></div>
                <div
                  className="h-2 rounded-r-full"
                  style={{
                    width: `${(wardsBelowAverageCoverage / wardWiseAnalysis.length) * 100}%`,
                    backgroundColor: CHART_COLORS.secondary,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-medium">
              जन्मदर्ता पहुँच सुधार अवसरहरू
            </h5>
            <p className="mt-2 text-sm text-muted-foreground">
              गढवा गाउँपालिकामा पाँच वर्षमुनिका जम्मा{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}{" "}
              बालबालिकामध्ये
              {localizeNumber(totalWithCertificate.toLocaleString(), "ne")} (
              {localizeNumber(overallCoverageRate, "ne")}%) जनासँग जन्मदर्ता
              प्रमाणपत्र छ र{" "}
              {localizeNumber(totalWithoutCertificate.toLocaleString(), "ne")}(
              {localizeNumber(
                (100 - parseFloat(overallCoverageRate)).toFixed(2),
                "ne",
              )}
              %) जनासँग जन्मदर्ता प्रमाणपत्र छैन।
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              वडा नं{" "}
              {localizeNumber(lowestCoverageWard.wardNumber.toString(), "ne")}{" "}
              मा कभरेज दर सबैभन्दा कम{" "}
              {localizeNumber(lowestCoverageWard.coverageRate, "ne")}% रहेकोले
              त्यहाँ जन्मदर्ता अभियान तथा जनचेतनामूलक कार्यक्रम सञ्चालन गरी
              सुधार गर्न सकिन्छ।
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              वडा नं{" "}
              {localizeNumber(highestCoverageWard.wardNumber.toString(), "ne")}{" "}
              ले {localizeNumber(highestCoverageWard.coverageRate, "ne")}% कभरेज
              हासिल गरेको छ, जसलाई अन्य वडाहरूको लागि अनुकरणीय मोडेलको रूपमा
              प्रयोग गर्न सकिन्छ।
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
