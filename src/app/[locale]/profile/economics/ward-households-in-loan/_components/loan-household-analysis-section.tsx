"use client";

import Link from "next/link";
import { useEffect } from "react";

interface LoanHouseholdAnalysisSectionProps {
  wardWiseData: Array<{
    ward: string;
    households: number;
    wardNumber: number;
  }>;
  totalHouseholdsOnLoan: number;
}

export default function LoanHouseholdAnalysisSection({
  wardWiseData,
  totalHouseholdsOnLoan,
}: LoanHouseholdAnalysisSectionProps) {
  // Sort data by households
  const sortedData = [...wardWiseData].sort(
    (a, b) => b.households - a.households,
  );

  // Get ward with max and min loans
  const maxWard = sortedData[0];
  const minWard = sortedData[sortedData.length - 1];

  // Calculate average
  const averageHouseholds = Math.round(
    totalHouseholdsOnLoan / wardWiseData.length,
  );

  // Calculate variance
  const variance =
    wardWiseData.reduce(
      (sum, item) => sum + Math.pow(item.households - averageHouseholds, 2),
      0,
    ) / wardWiseData.length;

  // Calculate standard deviation
  const stdDev = Math.sqrt(variance);

  // Identify wards above and below average
  const wardsAboveAverage = wardWiseData.filter(
    (item) => item.households > averageHouseholds,
  ).length;

  const wardsBelowAverage = wardWiseData.filter(
    (item) => item.households < averageHouseholds,
  ).length;

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households-with-loans",
        totalHouseholdsOnLoan.toString(),
      );

      // Add max ward data
      if (maxWard) {
        document.body.setAttribute(
          "data-max-loan-ward",
          `Ward ${maxWard.wardNumber} / वडा ${maxWard.wardNumber}`,
        );
        document.body.setAttribute(
          "data-max-loan-households",
          maxWard.households.toString(),
        );
        document.body.setAttribute(
          "data-max-loan-percentage",
          ((maxWard.households / totalHouseholdsOnLoan) * 100).toFixed(2),
        );
      }

      // Add min ward data
      if (minWard) {
        document.body.setAttribute(
          "data-min-loan-ward",
          `Ward ${minWard.wardNumber} / वडा ${minWard.wardNumber}`,
        );
        document.body.setAttribute(
          "data-min-loan-households",
          minWard.households.toString(),
        );
      }
    }
  }, [wardWiseData, totalHouseholdsOnLoan, maxWard, minWard]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            सबैभन्दा बढी
            <span className="sr-only">Ward with most households in debt</span>
          </h3>
          <p className="text-2xl font-bold">{maxWard?.ward || "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {maxWard?.households.toLocaleString() || "0"} घरपरिवार (
            {(
              ((maxWard?.households || 0) / totalHouseholdsOnLoan) *
              100
            ).toFixed(1)}
            %)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            औसत
            <span className="sr-only">
              Average households with loans per ward
            </span>
          </h3>
          <p className="text-2xl font-bold">
            {averageHouseholds.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            प्रति वडा औसत ऋणी घरपरिवार
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            सबैभन्दा कम
            <span className="sr-only">Ward with fewest households in debt</span>
          </h3>
          <p className="text-2xl font-bold">{minWard?.ward || "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {minWard?.households.toLocaleString() || "0"} घरपरिवार (
            {(
              ((minWard?.households || 0) / totalHouseholdsOnLoan) *
              100
            ).toFixed(1)}
            %)
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          वडागत वितरण विश्लेषण
          <span className="sr-only">Ward Distribution Analysis of Loans</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">वितरण स्थिति</h4>
            <p className="mb-2">
              {wardsAboveAverage} वडाहरूमा औसत भन्दा बढी ऋणी घरपरिवारहरू छन्,
              जबकि {wardsBelowAverage} वडाहरूमा औसत भन्दा कम छन्।
            </p>
            <p>
              मानक विचलन:{" "}
              <span className="font-medium">{stdDev.toFixed(2)}</span> घरपरिवार
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">अनुपात विश्लेषण</h4>
            {maxWard && minWard && (
              <p>
                सबैभन्दा उच्च ({maxWard.ward}) र सबैभन्दा कम ({minWard.ward})
                ऋणी घरपरिवार भएको वडाको अनुपात{" "}
                <span className="font-bold">
                  {(maxWard.households / (minWard.households || 1)).toFixed(1)}
                  :1
                </span>{" "}
                रहेको छ।
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Loan Distribution in Khajura
          </span>
        </h3>
        <p>
          केराबारी गाउँपालिकाको ऋण वितरण सम्बन्धी थप जानकारी वा विस्तृत
          तथ्याङ्कको लागि, कृपया{" "}
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
