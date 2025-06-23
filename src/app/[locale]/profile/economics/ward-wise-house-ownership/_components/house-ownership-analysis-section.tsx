import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseOwnershipAnalysisSectionProps {
  overallSummary: Array<{
    ownershipType: string;
    ownershipTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    privateHouseholds: number;
    privatePercentage: string;
  }>;
  OWNERSHIP_TYPE_NAMES: Record<string, string>;
  OWNERSHIP_TYPE_NAMES_EN: Record<string, string>;
}

export default function HouseOwnershipAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  OWNERSHIP_TYPE_NAMES,
  OWNERSHIP_TYPE_NAMES_EN,
}: HouseOwnershipAnalysisSectionProps) {
  // Updated modern aesthetic color palette for ownership types
  const OWNERSHIP_TYPE_COLORS = {
    PRIVATE: "#3498db", // Blue for private
    RENT: "#e74c3c", // Red for rent
    INSTITUTIONAL: "#2ecc71", // Green for institutional
    OTHER: "#95a5a6", // Gray for other
  };

  // Find wards with highest and lowest private ownership
  const highestPrivateWard = [...wardWiseAnalysis].sort(
    (a, b) => parseFloat(b.privatePercentage) - parseFloat(a.privatePercentage),
  )[0];

  const lowestPrivateWard = [...wardWiseAnalysis].sort(
    (a, b) => parseFloat(a.privatePercentage) - parseFloat(b.privatePercentage),
  )[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-most-common-ownership":
      overallSummary.length > 0
        ? `${overallSummary[0].ownershipTypeName} / ${OWNERSHIP_TYPE_NAMES_EN[overallSummary[0].ownershipType as keyof typeof OWNERSHIP_TYPE_NAMES_EN] || overallSummary[0].ownershipType}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2)
        : "0",
    "data-highest-private-ward":
      highestPrivateWard?.wardNumber.toString() || "",
    "data-lowest-private-ward": lowestPrivateWard?.wardNumber.toString() || "",
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

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-ownership-type={`${OWNERSHIP_TYPE_NAMES_EN[item.ownershipType as keyof typeof OWNERSHIP_TYPE_NAMES_EN] || item.ownershipType} / ${item.ownershipTypeName}`}
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
                  backgroundColor:
                    OWNERSHIP_TYPE_COLORS[
                      item.ownershipType as keyof typeof OWNERSHIP_TYPE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.ownershipTypeName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {OWNERSHIP_TYPE_NAMES_EN[
                      item.ownershipType as keyof typeof OWNERSHIP_TYPE_NAMES_EN
                    ] || item.ownershipType}
                  </span>
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

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          घर स्वामित्व विश्लेषण
          <span className="sr-only">House Ownership Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-ownership-type"
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
              प्रमुख घर स्वामित्वको प्रकार
              <span className="sr-only">
                Most Common House Ownership Type in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {overallSummary.length > 0
                ? overallSummary[0].ownershipTypeName
                : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
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
              <span className="sr-only">
                {overallSummary.length > 0
                  ? (
                      (overallSummary[0].households / totalHouseholds) *
                      100
                    ).toFixed(2)
                  : "0"}
                % (
                {overallSummary.length > 0 ? overallSummary[0].households : 0}{" "}
                households)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="private-ownership"
          >
            <h4 className="font-medium mb-2">
              उच्च निजी स्वामित्व भएको वडा
              <span className="sr-only">
                Ward with Highest Private Ownership in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(
                highestPrivateWard?.wardNumber.toString() || "",
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              निजी स्वामित्व:{" "}
              {localizeNumber(
                highestPrivateWard?.privatePercentage || "0",
                "ne",
              )}
              %
              <span className="sr-only">
                {highestPrivateWard?.privatePercentage || 0}% private ownership
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            वडागत घर स्वामित्व विश्लेषण
            <span className="sr-only">Ward-wise House Ownership Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top two most common ownership types */}
            {overallSummary.slice(0, 2).map((item, index) => (
              <div key={index}>
                <h5 className="text-sm font-medium">
                  {item.ownershipTypeName}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(
                    ((item.households / totalHouseholds) * 100).toFixed(2),
                    "ne",
                  )}
                  % ({localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  घरधुरी)
                </p>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((item.households / totalHouseholds) * 100, 100)}%`,
                      backgroundColor:
                        OWNERSHIP_TYPE_COLORS[
                          item.ownershipType as keyof typeof OWNERSHIP_TYPE_COLORS
                        ] || "#888",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">वडागत प्रमुख स्वामित्व</h5>
              <ul className="mt-2 text-sm space-y-1">
                {wardWiseAnalysis.slice(0, 3).map((ward, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")}:
                    </span>
                    <span className="font-medium">
                      {OWNERSHIP_TYPE_NAMES[
                        ward.mostCommonType as keyof typeof OWNERSHIP_TYPE_NAMES
                      ] || ward.mostCommonType}{" "}
                      ({localizeNumber(ward.mostCommonTypePercentage, "ne")}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">घर स्वामित्व आधारित सुझाव</h5>
              <p className="mt-2 text-sm text-muted-foreground">
                {(overallSummary.find((item) => item.ownershipType === "RENT")
                  ?.households ?? 0) > 0
                  ? `भाडामा बस्नेको संख्या ${localizeNumber((overallSummary.find((item) => item.ownershipType === "RENT")?.households ?? 0).toString(), "ne")} (${localizeNumber((((overallSummary.find((item) => item.ownershipType === "RENT")?.households ?? 0) / totalHouseholds) * 100).toFixed(2), "ne")}%) रहेको छ, जसले आवास सुधार कार्यक्रमहरूको आवश्यकता देखाउँछ।`
                  : `निजी स्वामित्वमा रहेका घरधुरीहरुको संख्या बढाउन आवास प्रवर्द्धनका कार्यक्रम सञ्चालन गर्न सकिन्छ।`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
