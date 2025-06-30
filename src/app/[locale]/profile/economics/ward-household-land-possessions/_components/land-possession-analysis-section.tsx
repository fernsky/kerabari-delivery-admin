"use client";

import Link from "next/link";
import { useEffect } from "react";

interface LandPossessionAnalysisSectionProps {
  wardWiseData: Array<{
    ward: string;
    households: number;
    wardNumber: number;
    percentage: string;
  }>;
  totalHouseholdsWithLand: number;
  estimatedTotalHouseholds: number;
}

export default function LandPossessionAnalysisSection({
  wardWiseData,
  totalHouseholdsWithLand,
  estimatedTotalHouseholds,
}: LandPossessionAnalysisSectionProps) {
  // Sort ward data by number of households (descending)
  const sortedWards = [...wardWiseData].sort(
    (a, b) => b.households - a.households,
  );

  // Get ward with highest and lowest land ownership
  const wardWithHighest = sortedWards[0];
  const wardWithLowest = sortedWards[sortedWards.length - 1];

  // Calculate average
  const averageHouseholds = Math.round(
    totalHouseholdsWithLand / wardWiseData.length,
  );

  // Calculate variance
  const variance =
    wardWiseData.reduce(
      (sum, item) => sum + Math.pow(item.households - averageHouseholds, 2),
      0,
    ) / wardWiseData.length;

  // Calculate standard deviation
  const stdDev = Math.sqrt(variance);

  // Calculate land ownership percentage in the municipality
  const landOwnershipPercentage = (
    (totalHouseholdsWithLand / estimatedTotalHouseholds) *
    100
  ).toFixed(1);
  const landlessPercentage = (
    100 - parseFloat(landOwnershipPercentage)
  ).toFixed(1);

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-landowner-households",
        totalHouseholdsWithLand.toString(),
      );
      document.body.setAttribute(
        "data-estimated-total-households",
        Math.round(estimatedTotalHouseholds).toString(),
      );
      document.body.setAttribute(
        "data-land-ownership-percentage",
        landOwnershipPercentage,
      );

      // Add highest ward data
      if (wardWithHighest) {
        document.body.setAttribute(
          "data-highest-land-ownership-ward",
          `Ward ${wardWithHighest.wardNumber} / वडा ${wardWithHighest.wardNumber}`,
        );
        document.body.setAttribute(
          "data-highest-land-ownership-households",
          wardWithHighest.households.toString(),
        );
        document.body.setAttribute(
          "data-highest-land-ownership-percentage",
          wardWithHighest.percentage,
        );
      }

      // Add lowest ward data
      if (wardWithLowest) {
        document.body.setAttribute(
          "data-lowest-land-ownership-ward",
          `Ward ${wardWithLowest.wardNumber} / वडा ${wardWithLowest.wardNumber}`,
        );
        document.body.setAttribute(
          "data-lowest-land-ownership-households",
          wardWithLowest.households.toString(),
        );
        document.body.setAttribute(
          "data-lowest-land-ownership-percentage",
          wardWithLowest.percentage,
        );
      }
    }
  }, [
    wardWiseData,
    totalHouseholdsWithLand,
    estimatedTotalHouseholds,
    landOwnershipPercentage,
    wardWithHighest,
    wardWithLowest,
  ]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            समग्र जग्गा स्वामित्व
            <span className="sr-only">Overall Land Ownership</span>
          </h3>
          <p className="text-2xl font-bold">{landOwnershipPercentage}%</p>
          <p className="text-sm text-muted-foreground">घरपरिवार जग्गाधनी छन्</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            औसत
            <span className="sr-only">
              Average land-owning households per ward
            </span>
          </h3>
          <p className="text-2xl font-bold">
            {averageHouseholds.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            प्रति वडा जग्गाधनी घरपरिवार
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            मानक विचलन
            <span className="sr-only">Standard Deviation</span>
          </h3>
          <p className="text-2xl font-bold">{stdDev.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">वडा बीचको विविधता</p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          वडागत वितरण विश्लेषण
          <span className="sr-only">
            Ward Distribution Analysis of Land Ownership
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">सबैभन्दा धेरै / कम जग्गाधनी</h4>
            <p className="mb-2">
              सबैभन्दा धेरै जग्गाधनी घरपरिवार{" "}
              <span className="font-medium">
                वडा {wardWithHighest?.wardNumber || "N/A"}
              </span>{" "}
              मा {wardWithHighest?.households.toLocaleString() || "0"} (
              {wardWithHighest?.percentage || "0"}%) र सबैभन्दा कम{" "}
              <span className="font-medium">
                वडा {wardWithLowest?.wardNumber || "N/A"}
              </span>{" "}
              मा {wardWithLowest?.households.toLocaleString() || "0"} (
              {wardWithLowest?.percentage || "0"}%)
            </p>
            <p>
              सबैभन्दा बढी र कम बीचको अनुपात:{" "}
              <span className="font-medium">
                {(
                  wardWithHighest?.households /
                  Math.max(wardWithLowest?.households || 1, 1)
                ).toFixed(1)}
                :1
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">जग्गाविहीन अवस्था</h4>
            <p className="mb-2">
              केराबारी गाउँपालिकामा अनुमानित{" "}
              <span className="font-medium">{landlessPercentage}%</span>
              घरपरिवार जग्गाविहीन रहेको अनुमान गरिएको छ। यो अनुमानित
              <span className="font-medium">
                {" "}
                {Math.round(
                  estimatedTotalHouseholds - totalHouseholdsWithLand,
                ).toLocaleString()}
              </span>{" "}
              घरपरिवार हो।
            </p>
            <p>यस अवस्थालाई सम्बोधन गर्न विशेष कार्यक्रम आवश्यक छ।</p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          जग्गा स्वामित्व र आर्थिक विकास
          <span className="sr-only">
            Land Ownership and Economic Development
          </span>
        </h3>
        <p className="mb-4">
          जग्गा स्वामित्व आर्थिक विकासको एक महत्वपूर्ण पक्ष हो। यसले व्यक्ति र
          समुदायलाई आर्थिक सुरक्षा र विकासको अवसर प्रदान गर्दछ। जग्गाधनी
          परिवारहरूसँग कृषि, व्यापार, र बसोबासको लागि पुँजी हुन्छ, जसले आर्थिक
          गतिविधिलाई बढावा दिन्छ।
        </p>
        <p>
          केराबारी गाउँपालिकामा थप जानकारीको लागि{" "}
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
