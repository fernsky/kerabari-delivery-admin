import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdBaseAnalysisSectionProps {
  overallSummary: Array<{
    baseType: string;
    baseTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    concreteHouseholds: number;
    concretePercentage: string;
  }>;
  BASE_TYPE_NAMES: Record<string, string>;
  BASE_TYPE_NAMES_EN: Record<string, string>;
  BASE_TYPE_COLORS: Record<string, string>;
}

export default function HouseholdBaseAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  BASE_TYPE_NAMES,
  BASE_TYPE_NAMES_EN,
  BASE_TYPE_COLORS,
}: HouseholdBaseAnalysisSectionProps) {
  // Find wards with highest and lowest concrete foundation
  const highestConcreteWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.concretePercentage) - parseFloat(a.concretePercentage),
  )[0];

  const lowestConcreteWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(a.concretePercentage) - parseFloat(b.concretePercentage),
  )[0];

  // Calculate concrete pillar percentage for the municipality
  const concretePillarData = overallSummary.find(
    (item) => item.baseType === "CONCRETE_PILLAR",
  );
  const concretePillarPercentage = concretePillarData
    ? ((concretePillarData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // Calculate mud joined percentage for the municipality
  const mudJoinedData = overallSummary.find(
    (item) => item.baseType === "MUD_JOINED",
  );
  const mudJoinedPercentage = mudJoinedData
    ? ((mudJoinedData.households / totalHouseholds) * 100).toFixed(2)
    : "0";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-most-common-foundation":
      overallSummary.length > 0
        ? `${overallSummary[0].baseTypeName} / ${BASE_TYPE_NAMES_EN[overallSummary[0].baseType as keyof typeof BASE_TYPE_NAMES_EN] || overallSummary[0].baseType}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2)
        : "0",
    "data-concrete-pillar-percentage": concretePillarPercentage,
    "data-highest-concrete-ward":
      highestConcreteWard?.wardNumber.toString() || "",
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
              data-foundation-type={`${BASE_TYPE_NAMES_EN[item.baseType as keyof typeof BASE_TYPE_NAMES_EN] || item.baseType} / ${item.baseTypeName}`}
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
                    BASE_TYPE_COLORS[
                      item.baseType as keyof typeof BASE_TYPE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.baseTypeName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {BASE_TYPE_NAMES_EN[
                      item.baseType as keyof typeof BASE_TYPE_NAMES_EN
                    ] || item.baseType}
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
          घरको जग विश्लेषण
          <span className="sr-only">House Foundation Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="most-common-foundation-type"
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
              प्रमुख घरको जगको प्रकार
              <span className="sr-only">
                Most Common House Foundation Type in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {overallSummary.length > 0 ? overallSummary[0].baseTypeName : ""}
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
            data-analysis-type="concrete-pillar-foundation"
            data-percentage={concretePillarPercentage}
          >
            <h4 className="font-medium mb-2">
              उच्च ढलान पिल्लर भएको वडा
              <span className="sr-only">
                Ward with Highest Concrete Pillar Foundation in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(
                highestConcreteWard?.wardNumber.toString() || "",
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ढलान पिल्लर:{" "}
              {localizeNumber(
                highestConcreteWard?.concretePercentage || "0",
                "ne",
              )}
              %
              <span className="sr-only">
                {highestConcreteWard?.concretePercentage || 0}% concrete pillar
                foundation
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            वडागत घरको जग विश्लेषण
            <span className="sr-only">Ward-wise House Foundation Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top two most common foundation types */}
            {overallSummary.slice(0, 2).map((item, index) => (
              <div key={index}>
                <h5 className="text-sm font-medium">{item.baseTypeName}</h5>
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
                        BASE_TYPE_COLORS[
                          item.baseType as keyof typeof BASE_TYPE_COLORS
                        ] || "#888",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">वडागत प्रमुख जगको प्रकार</h5>
              <ul className="mt-2 text-sm space-y-1">
                {wardWiseAnalysis.slice(0, 3).map((ward, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")}:
                    </span>
                    <span className="font-medium">
                      {BASE_TYPE_NAMES[
                        ward.mostCommonType as keyof typeof BASE_TYPE_NAMES
                      ] || ward.mostCommonType}{" "}
                      ({localizeNumber(ward.mostCommonTypePercentage, "ne")}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium">घरको जग आधारित सुझाव</h5>
              <p className="mt-2 text-sm text-muted-foreground">
                {parseFloat(mudJoinedPercentage) > 20
                  ? `माटोको जोडाइ भएको घरहरू ${localizeNumber(mudJoinedPercentage, "ne")}% रहेको छ, जसले भूकम्पीय जोखिम बढाउँछ। त्यसैले भवन निर्माण मापदण्डमा सुधार गर्न आवश्यक देखिन्छ।`
                  : `पालिकामा ढलान पिल्लरसहितको घरहरू ${localizeNumber(concretePillarPercentage, "ne")}% रहेको देखिन्छ, जसले भूकम्पीय सुरक्षालाई बलियो बनाउँछ।`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
