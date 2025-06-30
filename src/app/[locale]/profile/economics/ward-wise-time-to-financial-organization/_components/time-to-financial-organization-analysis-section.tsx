import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TimeToFinancialOrganizationAnalysisSectionProps {
  totalHouseholds: number;
  under15MinTotal: number;
  under30MinTotal: number;
  under1HourTotal: number;
  over1HourTotal: number;
  under15MinPercentage: number;
  under30MinPercentage: number;
  under1HourPercentage: number;
  over1HourPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    under15MinHouseholds: number;
    under30MinHouseholds: number;
    under1HourHouseholds: number;
    over1HourHouseholds: number;
    under15MinPercent: number;
    under30MinPercent: number;
    under1HourPercent: number;
    over1HourPercent: number;
    quickAccessPercent: number;
  }>;
  bestAccessWard: any;
  worstAccessWard: any;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string };
    UNDER_30_MIN: { name: string; nameEn: string; color: string };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string };
  };
}

export default function TimeToFinancialOrganizationAnalysisSection({
  totalHouseholds,
  under15MinTotal,
  under30MinTotal,
  under1HourTotal,
  over1HourTotal,
  under15MinPercentage,
  under30MinPercentage,
  under1HourPercentage,
  over1HourPercentage,
  wardWiseAnalysis,
  bestAccessWard,
  worstAccessWard,
  TIME_TO_FINANCIAL_ORG_STATUS,
}: TimeToFinancialOrganizationAnalysisSectionProps) {
  // Calculate combined quick access (under 30 min)
  const quickAccessTotal = under15MinTotal + under30MinTotal;
  const quickAccessPercentage = under15MinPercentage + under30MinPercentage;

  // Calculate financial inclusion index (0-100)
  // Higher weight for quicker access, lower weight for longer times
  const financialInclusionIndex =
    (under15MinPercentage * 1.0 +
      under30MinPercentage * 0.75 +
      under1HourPercentage * 0.5 +
      over1HourPercentage * 0.25) /
    100;

  const accessLevel =
    financialInclusionIndex >= 0.75
      ? "उच्च"
      : financialInclusionIndex >= 0.5
        ? "मध्यम"
        : "न्यून";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-quick-access-percentage": quickAccessPercentage.toFixed(2),
    "data-best-access-ward": bestAccessWard?.wardNumber.toString() || "",
    "data-worst-access-ward": worstAccessWard?.wardNumber.toString() || "",
    "data-financial-inclusion-index": financialInclusionIndex.toFixed(2),
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
              height: `${under15MinPercentage}%`,
              backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}
              <span className="sr-only">
                {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(under15MinPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(under15MinTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({under15MinTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${under30MinPercentage}%`,
              backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}
              <span className="sr-only">
                {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(under30MinPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(under30MinTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({under30MinTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${under1HourPercentage}%`,
              backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}
              <span className="sr-only">
                {TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(under1HourPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(under1HourTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({under1HourTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${over1HourPercentage}%`,
              backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              {TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}
              <span className="sr-only">
                {TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(over1HourPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(over1HourTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({over1HourTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          वित्तीय पहुँच विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Financial Access Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-access"
            data-ward-number={bestAccessWard?.wardNumber}
            data-percentage={bestAccessWard?.under15MinPercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              सर्वोत्तम वित्तीय पहुँच भएको वडा
              <span className="sr-only">
                Ward with Best Financial Access in Khajura Rural Municipality
              </span>
            </h4>
            {bestAccessWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    १५ मिनेटभित्र पुग्न सक्ने:{" "}
                    {localizeNumber(
                      bestAccessWard.under15MinPercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestAccessWard.under15MinPercent.toFixed(2)}% can reach
                      within 15 minutes
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">वित्तीय पहुँच वितरण</h5>
              <div className="mt-2 space-y-2">
                {bestAccessWard &&
                  Object.entries(TIME_TO_FINANCIAL_ORG_STATUS).map(
                    ([key, value], index) => {
                      let percent = 0;
                      let households = 0;

                      switch (key) {
                        case "UNDER_15_MIN":
                          percent = bestAccessWard.under15MinPercent;
                          households = bestAccessWard.under15MinHouseholds;
                          break;
                        case "UNDER_30_MIN":
                          percent = bestAccessWard.under30MinPercent;
                          households = bestAccessWard.under30MinHouseholds;
                          break;
                        case "UNDER_1_HOUR":
                          percent = bestAccessWard.under1HourPercent;
                          households = bestAccessWard.under1HourHouseholds;
                          break;
                        case "HOUR_OR_MORE":
                          percent = bestAccessWard.over1HourPercent;
                          households = bestAccessWard.over1HourHouseholds;
                          break;
                      }

                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm">
                            <span>{value.name}</span>
                            <span className="font-medium">
                              {localizeNumber(percent.toFixed(2), "ne")}%
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: value.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-access"
            data-ward-number={worstAccessWard?.wardNumber}
            data-percentage={worstAccessWard?.over1HourPercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              न्यून वित्तीय पहुँच भएको वडा
              <span className="sr-only">
                Ward with Poor Financial Access in Khajura
              </span>
            </h4>
            {worstAccessWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstAccessWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    १ घण्टाभन्दा बढी लाग्ने:{" "}
                    {localizeNumber(
                      worstAccessWard.over1HourPercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {worstAccessWard.over1HourPercent.toFixed(2)}% take more
                      than 1 hour
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेष ध्यान दिनुपर्ने</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा{" "}
                  {localizeNumber(
                    worstAccessWard?.over1HourHouseholds.toLocaleString() ||
                      "0",
                    "ne",
                  )}{" "}
                  घरधुरी (कुल{" "}
                  {localizeNumber(
                    worstAccessWard?.totalHouseholds.toLocaleString() || "0",
                    "ne",
                  )}{" "}
                  मध्ये) लाई वित्तीय संस्था पुग्न १ घण्टा भन्दा बढी समय लाग्छ।
                  यहाँ डिजिटल बैंकिङ्ग र मोबाइल बैंकिङ्ग सेवा विस्तार गर्नुपर्ने
                  देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वित्तीय समावेशिता सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(
                    (financialInclusionIndex * 100).toFixed(1),
                    "ne",
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{accessLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> वित्तीय पहुँचको यो सूचकाङ्क
                  १५ मिनेट, ३० मिनेट, १ घण्टा र १ घण्टाभन्दा बढी समय लाग्ने
                  घरधुरीहरूको भारित औसतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(
                    (financialInclusionIndex * 100).toFixed(1),
                    "ne",
                  )}
                  अंकले {accessLevel} स्तरको वित्तीय पहुँच दर्शाउँछ। यसमा
                  सुधारका लागि वित्तीय सेवा विस्तार र यातायात सुविधा सुधार गर्न
                  सुझाव गरिन्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत वित्तीय पहुँच विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                केराबारी गाउँपालिका वित्तीय पहुँचको स्थिति
              </h5>
              <div className="mt-2 space-y-3">
                {/* Quick access percentage (under 30 min) */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      छिटो पहुँच (३० मिनेटभित्र)
                    </span>
                    <span className="font-medium">
                      {localizeNumber(quickAccessPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{
                        width: `${quickAccessPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Limited access percentage (over 1 hour) */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      सीमित पहुँच (१ घण्टा भन्दा बढी)
                    </span>
                    <span className="font-medium">
                      {localizeNumber(over1HourPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                      style={{
                        width: `${over1HourPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <h5 className="font-medium mb-2">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/economics/ward-wise-households-in-agriculture"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि परिवार
                </Link>
                <Link
                  href="/profile/economics/ward-wise-house-ownership"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  घर स्वामित्व
                </Link>
                <Link
                  href="/profile/infrastructure/municipality-wide-road-network"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  सडक सञ्जाल
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
