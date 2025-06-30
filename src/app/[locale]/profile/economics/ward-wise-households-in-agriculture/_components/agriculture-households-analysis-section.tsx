import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgricultureHouseholdsAnalysisSectionProps {
  totalHouseholds: number;
  totalInvolved: number;
  totalNonInvolved: number;
  involvedPercentage: number;
  nonInvolvedPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    involvedHouseholds: number;
    nonInvolvedHouseholds: number;
    involvedPercentage: number;
    nonInvolvedPercentage: number;
  }>;
  highestInvolvementWard: any;
  lowestInvolvementWard: any;
  AGRICULTURE_STATUS: {
    INVOLVED: { name: string; nameEn: string; color: string };
    NOT_INVOLVED: { name: string; nameEn: string; color: string };
  };
}

export default function AgricultureHouseholdsAnalysisSection({
  totalHouseholds,
  totalInvolved,
  totalNonInvolved,
  involvedPercentage,
  nonInvolvedPercentage,
  wardWiseAnalysis,
  highestInvolvementWard,
  lowestInvolvementWard,
  AGRICULTURE_STATUS,
}: AgricultureHouseholdsAnalysisSectionProps) {
  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-involved-households": totalInvolved.toString(),
    "data-involvement-rate": involvedPercentage.toFixed(2),
    "data-highest-ward": highestInvolvementWard?.wardNumber.toString() || "",
    "data-lowest-ward": lowestInvolvementWard?.wardNumber.toString() || "",
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${involvedPercentage}%`,
              backgroundColor: AGRICULTURE_STATUS.INVOLVED.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {AGRICULTURE_STATUS.INVOLVED.name}
              <span className="sr-only">
                {AGRICULTURE_STATUS.INVOLVED.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(involvedPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(totalInvolved.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({totalInvolved.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${nonInvolvedPercentage}%`,
              backgroundColor: AGRICULTURE_STATUS.NOT_INVOLVED.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {AGRICULTURE_STATUS.NOT_INVOLVED.name}
              <span className="sr-only">
                {AGRICULTURE_STATUS.NOT_INVOLVED.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(nonInvolvedPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(totalNonInvolved.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({totalNonInvolved.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          कृषि आबद्धता विश्लेषण
          <span className="sr-only">
            Agricultural Involvement Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-involvement"
            data-ward-number={highestInvolvementWard?.wardNumber}
            data-percentage={highestInvolvementWard?.involvedPercentage.toFixed(
              2,
            )}
          >
            <h4 className="font-medium mb-2">
              उच्च कृषि आबद्धता भएको वडा
              <span className="sr-only">
                Ward with Highest Agricultural Involvement in Khajura Rural
                Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(
                highestInvolvementWard?.wardNumber.toString() || "",
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कृषि आबद्धता:{" "}
              {localizeNumber(
                highestInvolvementWard?.involvedPercentage.toFixed(2) || "0",
                "ne",
              )}
              % (
              {localizeNumber(
                highestInvolvementWard?.involvedHouseholds.toLocaleString() ||
                  "0",
                "ne",
              )}{" "}
              घरधुरी)
              <span className="sr-only">
                {highestInvolvementWard?.involvedPercentage.toFixed(2) || 0}%
                agricultural involvement (
                {highestInvolvementWard?.involvedHouseholds.toLocaleString() ||
                  0}{" "}
                households)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-involvement"
            data-ward-number={lowestInvolvementWard?.wardNumber}
            data-percentage={lowestInvolvementWard?.involvedPercentage.toFixed(
              2,
            )}
          >
            <h4 className="font-medium mb-2">
              न्यून कृषि आबद्धता भएको वडा
              <span className="sr-only">
                Ward with Lowest Agricultural Involvement in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(
                lowestInvolvementWard?.wardNumber.toString() || "",
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कृषि आबद्धता:{" "}
              {localizeNumber(
                lowestInvolvementWard?.involvedPercentage.toFixed(2) || "0",
                "ne",
              )}
              % (
              {localizeNumber(
                lowestInvolvementWard?.involvedHouseholds.toLocaleString() ||
                  "0",
                "ne",
              )}{" "}
              घरधुरी)
              <span className="sr-only">
                {lowestInvolvementWard?.involvedPercentage.toFixed(2) || 0}%
                agricultural involvement (
                {lowestInvolvementWard?.involvedHouseholds.toLocaleString() ||
                  0}{" "}
                households)
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            वडागत कृषि आबद्धता विश्लेषण
            <span className="sr-only">
              Ward-wise Agricultural Involvement Analysis
            </span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display top wards by agricultural involvement */}
            <div>
              <h5 className="text-sm font-medium">कृषि आबद्धता दर</h5>
              <div className="mt-2 space-y-3">
                {wardWiseAnalysis.slice(0, 3).map((ward, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm">
                      <span>
                        वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(
                          ward.involvedPercentage.toFixed(2),
                          "ne",
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${ward.involvedPercentage}%`,
                          backgroundColor: AGRICULTURE_STATUS.INVOLVED.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium">कृषि आबद्धता सुझाव</h5>
              <div className="mt-2 text-sm text-muted-foreground">
                {involvedPercentage < 40 ? (
                  <p>
                    कृषि आबद्धता दर{" "}
                    {localizeNumber(involvedPercentage.toFixed(2), "ne")}% मात्र
                    रहेकोले कृषि क्षेत्रमा थप प्रोत्साहन र सहयोग आवश्यक देखिन्छ।
                  </p>
                ) : involvedPercentage < 60 ? (
                  <p>
                    मध्यम स्तरको कृषि आबद्धता (
                    {localizeNumber(involvedPercentage.toFixed(2), "ne")}%)
                    रहेकाले कृषि क्षेत्रको व्यावसायिकरण र आधुनिकीकरणमा जोड
                    दिनुपर्ने देखिन्छ।
                  </p>
                ) : (
                  <p>
                    उच्च कृषि आबद्धता (
                    {localizeNumber(involvedPercentage.toFixed(2), "ne")}%)
                    रहेकाले मूल्य श्रृंखला विकास र बजारीकरणमा ध्यान दिनुपर्ने
                    देखिन्छ।
                  </p>
                )}
                <div className="mt-2">
                  <p>
                    वडा{" "}
                    {localizeNumber(
                      highestInvolvementWard?.wardNumber.toString() || "",
                      "ne",
                    )}{" "}
                    र वडा{" "}
                    {localizeNumber(
                      wardWiseAnalysis[1]?.wardNumber.toString() || "",
                      "ne",
                    )}{" "}
                    मा विशेष कृषि पकेट क्षेत्र विकास गर्न सकिने सम्भावना रहेको
                    छ।
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <h5 className="font-medium mb-2">सम्बन्धित डेटा</h5>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/profile/economics/ward-wise-house-ownership"
                className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
              >
                घर स्वामित्व
              </Link>
              <Link
                href="/profile/economics/agriculture-production"
                className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
              >
                कृषि उत्पादन
              </Link>
              <Link
                href="/profile/economics/municipality-wide-vegetables-and-fruits-diseases"
                className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
              >
                तरकारी र फलफूल रोग कीटपतंग
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
