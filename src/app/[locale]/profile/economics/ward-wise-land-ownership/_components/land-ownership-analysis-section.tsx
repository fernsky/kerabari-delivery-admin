import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface LandOwnershipAnalysisSectionProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
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
    publicEilaniHouseholds: number;
    publicEilaniPercentage: string;
    guthiHouseholds: number;
    guthiPercentage: string;
    villageBlockHouseholds: number;
    villageBlockPercentage: string;
    otherHouseholds: number;
    otherPercentage: string;
    securityScore: number;
    secureHouseholds: number;
    insecureHouseholds: number;
  }>;
  LAND_OWNERSHIP_TYPES: Record<string, string>;
  LAND_OWNERSHIP_TYPES_EN: Record<string, string>;
  LAND_OWNERSHIP_COLORS: Record<string, string>;
  securityScore: number;
  highestInsecurityWard: {
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    privateHouseholds: number;
    privatePercentage: string;
    publicEilaniHouseholds: number;
    publicEilaniPercentage: string;
    guthiHouseholds: number;
    guthiPercentage: string;
    villageBlockHouseholds: number;
    villageBlockPercentage: string;
    otherHouseholds: number;
    otherPercentage: string;
    securityScore: number;
    secureHouseholds: number;
    insecureHouseholds: number;
  };
}

export default function LandOwnershipAnalysisSection({
  overallSummary,
  totalHouseholds,
  wardWiseAnalysis,
  LAND_OWNERSHIP_TYPES,
  LAND_OWNERSHIP_TYPES_EN,
  LAND_OWNERSHIP_COLORS,
  securityScore,
  highestInsecurityWard,
}: LandOwnershipAnalysisSectionProps) {
  // Find out which ward has highest private land ownership percentage
  const highestPrivateOwnershipWard = [...wardWiseAnalysis].sort(
    (a, b) => parseFloat(b.privatePercentage) - parseFloat(a.privatePercentage),
  )[0];

  // Find out which ward has highest public land usage
  const highestPublicEilaniWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.publicEilaniPercentage) -
      parseFloat(a.publicEilaniPercentage),
  )[0];

  // Find out which ward has highest security score
  const highestSecurityWard = [...wardWiseAnalysis].sort(
    (a, b) => b.securityScore - a.securityScore,
  )[0];

  // Calculate average security score
  const averageSecurityScore = Math.round(
    wardWiseAnalysis.reduce((sum, ward) => sum + ward.securityScore, 0) /
      wardWiseAnalysis.length,
  );

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-most-common-ownership":
      overallSummary.length > 0
        ? `${overallSummary[0].typeName} / ${LAND_OWNERSHIP_TYPES_EN[overallSummary[0].type] || overallSummary[0].type}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2)
        : "0",
    "data-security-score": securityScore.toString(),
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल घरपरिवार संख्या</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">निजी जग्गामा बसोबास</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(
              (
                ((overallSummary.find((s) => s.type === "PRIVATE")
                  ?.households || 0) /
                  totalHouseholds) *
                100
              ).toFixed(1),
              "ne",
            )}
            %
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (
            {localizeNumber(
              (
                overallSummary.find((s) => s.type === "PRIVATE")?.households ||
                0
              ).toLocaleString(),
              "ne",
            )}{" "}
            घरपरिवार)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">जग्गा सुरक्षा स्कोर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(securityScore.toString(), "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">पालिका औसत</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          जग्गा स्वामित्वको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Land Ownership Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="ownership-type-analysis"
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
              प्रमुख जग्गा स्वामित्व प्रकार
              <span className="sr-only">
                Main Land Ownership Type in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor:
                    overallSummary.length > 0
                      ? LAND_OWNERSHIP_COLORS[
                          overallSummary[0]
                            .type as keyof typeof LAND_OWNERSHIP_COLORS
                        ] || "#3498db"
                      : "#3498db",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {overallSummary.length > 0 ? overallSummary[0].typeName : ""}
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
                  परिवार)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 land ownership types visualization */}
              {overallSummary.slice(0, 3).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {item.typeName}
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
                          LAND_OWNERSHIP_COLORS[
                            item.type as keyof typeof LAND_OWNERSHIP_COLORS
                          ] || "#3498db",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              वडागत जग्गा स्वामित्व विश्लेषण
              <span className="sr-only">Ward-wise Land Ownership Analysis</span>
            </h4>

            <div className="space-y-3">
              {wardWiseAnalysis.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")} -
                      निजी जग्गा
                    </span>
                    <span className="font-medium">
                      {localizeNumber(ward.privatePercentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(ward.privatePercentage)}%`,
                        backgroundColor:
                          LAND_OWNERSHIP_COLORS["PRIVATE"] || "#3498db",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">सर्वाधिक जग्गा सुरक्षा स्कोर</h5>
                  <p className="text-sm text-muted-foreground">
                    उच्च निजी जग्गा स्वामित्व
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestSecurityWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-green-500 font-medium">
                    {localizeNumber(
                      highestSecurityWard?.securityScore.toString() || "0",
                      "ne",
                    )}
                    % स्कोर
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>स्वामित्व वितरण:</strong> पालिकाभरि जग्गा स्वामित्वको
                  वितरण{" "}
                  {localizeNumber(
                    (
                      ((overallSummary.find((s) => s.type === "PRIVATE")
                        ?.households || 0) /
                        totalHouseholds) *
                      100
                    ).toFixed(1),
                    "ne",
                  )}
                  % निजी,{" "}
                  {localizeNumber(
                    (
                      ((overallSummary.find((s) => s.type === "PUBLIC_EILANI")
                        ?.households || 0) /
                        totalHouseholds) *
                      100
                    ).toFixed(1),
                    "ne",
                  )}
                  % सार्वजनिक/ऐलानी, र{" "}
                  {localizeNumber(
                    (
                      ((overallSummary.find((s) => s.type === "GUTHI")
                        ?.households || 0) /
                        totalHouseholds) *
                      100
                    ).toFixed(1),
                    "ne",
                  )}
                  % गुठी जग्गामा रहेको देखिन्छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>वडागत भिन्नता:</strong> वडा{" "}
                  {localizeNumber(
                    highestPublicEilaniWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    highestPublicEilaniWard?.publicEilaniPercentage || "0",
                    "ne",
                  )}
                  % घरपरिवारहरू सार्वजनिक/ऐलानी जग्गामा बसोबास गर्दछन्, जबकि वडा{" "}
                  {localizeNumber(
                    highestPrivateOwnershipWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    highestPrivateOwnershipWard?.privatePercentage || "0",
                    "ne",
                  )}
                  % घरपरिवारहरू निजी जग्गामा बसोबास गर्दछन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>जग्गा सुरक्षा स्कोर:</strong> पालिका भित्रका सबै
                  वडाहरूको औसत जग्गा सुरक्षा स्कोर{" "}
                  {localizeNumber(averageSecurityScore.toString(), "ne")} रहेको
                  छ, जसमा वडा नं.{" "}
                  {localizeNumber(
                    highestSecurityWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सर्वाधिक{" "}
                  {localizeNumber(
                    highestSecurityWard?.securityScore.toString() || "0",
                    "ne",
                  )}
                  % स्कोर रहेको छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सुरक्षा चुनौती:</strong> वडा{" "}
                  {localizeNumber(
                    highestInsecurityWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    (
                      100 - (highestInsecurityWard?.securityScore || 0)
                    ).toString() || "0",
                    "ne",
                  )}
                  % घरपरिवारहरू कम सुरक्षित जग्गा स्वामित्वमा रहेका छन्, जुन
                  महत्त्वपूर्ण समस्याको रूपमा रहेको छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत तुलनात्मक विश्लेषण</h4>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">
                  निजी जग्गा स्वामित्व (सबैभन्दा बढी)
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${parseFloat(highestPrivateOwnershipWard?.privatePercentage || "0")}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      highestPrivateOwnershipWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      highestPrivateOwnershipWard?.privatePercentage || "0",
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  सार्वजनिक/ऐलानी जग्गा (सबैभन्दा बढी)
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${parseFloat(highestPublicEilaniWard?.publicEilaniPercentage || "0")}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      highestPublicEilaniWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      highestPublicEilaniWard?.publicEilaniPercentage || "0",
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  जग्गा सुरक्षा स्कोर (उत्कृष्ट वडा)
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(highestSecurityWard?.securityScore || 0, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      highestSecurityWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      highestSecurityWard?.securityScore.toString() || "0",
                      "ne",
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/profile/population/household-detail"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  घरपरिवार विवरण
                </Link>
                <Link
                  href="/profile/infrastructure/housing"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  आवास विवरण
                </Link>
                <Link
                  href="/profile/economics/income-source"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  आम्दानीको स्रोत
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
