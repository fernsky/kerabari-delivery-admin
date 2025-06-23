import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FinancialAccountsAnalysisSectionProps {
  totalHouseholds: number;
  bankTotal: number;
  financeTotal: number;
  microfinanceTotal: number;
  cooperativeTotal: number;
  noAccountTotal: number;
  bankPercentage: number;
  financePercentage: number;
  microfinancePercentage: number;
  cooperativePercentage: number;
  noAccountPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    bankHouseholds: number;
    financeHouseholds: number;
    microfinanceHouseholds: number;
    cooperativeHouseholds: number;
    noAccountHouseholds: number;
    bankPercent: number;
    financePercent: number;
    microfinancePercent: number;
    cooperativePercent: number;
    noAccountPercent: number;
    accountPercent: number;
  }>;
  bestInclusionWard: any;
  worstInclusionWard: any;
  FINANCIAL_ACCOUNT_TYPES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function FinancialAccountsAnalysisSection({
  totalHouseholds,
  bankTotal,
  financeTotal,
  microfinanceTotal,
  cooperativeTotal,
  noAccountTotal,
  bankPercentage,
  financePercentage,
  microfinancePercentage,
  cooperativePercentage,
  noAccountPercentage,
  wardWiseAnalysis,
  bestInclusionWard,
  worstInclusionWard,
  FINANCIAL_ACCOUNT_TYPES,
}: FinancialAccountsAnalysisSectionProps) {
  // Calculate combined account holders (total households with any type of account)
  const accountTotal = totalHouseholds - noAccountTotal;
  const accountPercentage = 100 - noAccountPercentage;

  // Calculate financial inclusion index (0-100)
  // Higher weight for formal banking system, lower for no accounts
  const financialInclusionIndex =
    (bankPercentage * 1.0 +
      financePercentage * 0.9 +
      cooperativePercentage * 0.8 +
      microfinancePercentage * 0.7 +
      noAccountPercentage * 0.0) /
    100;

  const inclusionLevel =
    financialInclusionIndex >= 0.75
      ? "उच्च"
      : financialInclusionIndex >= 0.5
        ? "मध्यम"
        : "न्यून";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-bank-account-percentage": bankPercentage.toFixed(2),
    "data-no-account-percentage": noAccountPercentage.toFixed(2),
    "data-best-inclusion-ward": bestInclusionWard?.wardNumber.toString() || "",
    "data-worst-inclusion-ward":
      worstInclusionWard?.wardNumber.toString() || "",
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
              height: `${bankPercentage}%`,
              backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              बैङ्क खाता भएका
              <span className="sr-only">
                {FINANCIAL_ACCOUNT_TYPES.BANK.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(bankPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(bankTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({bankTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${financePercentage + microfinancePercentage + cooperativePercentage}%`,
              backgroundColor: FINANCIAL_ACCOUNT_TYPES.FINANCE.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              अन्य वित्तीय खाता
              <span className="sr-only">Other financial accounts</span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(
                (
                  financePercentage +
                  microfinancePercentage +
                  cooperativePercentage
                ).toFixed(2),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(
                (
                  financeTotal +
                  microfinanceTotal +
                  cooperativeTotal
                ).toLocaleString(),
                "ne",
              )}{" "}
              घरधुरी
              <span className="sr-only">
                (
                {(
                  financeTotal +
                  microfinanceTotal +
                  cooperativeTotal
                ).toLocaleString()}{" "}
                households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${noAccountPercentage}%`,
              backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              खाता नभएका
              <span className="sr-only">
                {FINANCIAL_ACCOUNT_TYPES.NONE.nameEn}
              </span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(noAccountPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(noAccountTotal.toLocaleString(), "ne")} घरधुरी
              <span className="sr-only">
                ({noAccountTotal.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          वित्तीय समावेशीकरण विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Financial Inclusion Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-inclusion"
            data-ward-number={bestInclusionWard?.wardNumber}
            data-percentage={bestInclusionWard?.accountPercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              सर्वोत्तम वित्तीय समावेशीकरण भएको वडा
              <span className="sr-only">
                Ward with Best Financial Inclusion in Khajura Rural Municipality
              </span>
            </h4>
            {bestInclusionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestInclusionWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    वित्तीय खाता भएका:{" "}
                    {localizeNumber(
                      bestInclusionWard.accountPercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestInclusionWard.accountPercent.toFixed(2)}% have
                      financial accounts
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">वित्तीय खाता वितरण</h5>
              <div className="mt-2 space-y-2">
                {bestInclusionWard && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>{FINANCIAL_ACCOUNT_TYPES.BANK.name}</span>
                        <span className="font-medium">
                          {localizeNumber(
                            bestInclusionWard.bankPercent.toFixed(2),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bestInclusionWard.bankPercent}%`,
                            backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>अन्य वित्तीय खाता</span>
                        <span className="font-medium">
                          {localizeNumber(
                            (
                              bestInclusionWard.financePercent +
                              bestInclusionWard.microfinancePercent +
                              bestInclusionWard.cooperativePercent
                            ).toFixed(2),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${
                              bestInclusionWard.financePercent +
                              bestInclusionWard.microfinancePercent +
                              bestInclusionWard.cooperativePercent
                            }%`,
                            backgroundColor: "#3498db",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>{FINANCIAL_ACCOUNT_TYPES.NONE.name}</span>
                        <span className="font-medium">
                          {localizeNumber(
                            bestInclusionWard.noAccountPercent.toFixed(2),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bestInclusionWard.noAccountPercent}%`,
                            backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-inclusion"
            data-ward-number={worstInclusionWard?.wardNumber}
            data-percentage={worstInclusionWard?.noAccountPercent.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              न्यून वित्तीय समावेशीकरण भएको वडा
              <span className="sr-only">
                Ward with Poor Financial Inclusion in Khajura
              </span>
            </h4>
            {worstInclusionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstInclusionWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    खाता नभएका:{" "}
                    {localizeNumber(
                      worstInclusionWard.noAccountPercent.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {worstInclusionWard.noAccountPercent.toFixed(2)}% have no
                      financial accounts
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
                    worstInclusionWard?.noAccountHouseholds.toLocaleString() ||
                      "0",
                    "ne",
                  )}{" "}
                  घरधुरी (कुल{" "}
                  {localizeNumber(
                    worstInclusionWard?.totalHouseholds.toLocaleString() || "0",
                    "ne",
                  )}{" "}
                  मध्ये) को कुनै पनि वित्तीय संस्थामा खाता छैन। वित्तीय
                  समावेशीकरणको लागि यस वडामा विशेष कार्यक्रम सञ्चालन गर्नुपर्ने
                  देखिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वित्तीय समावेशीकरण सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(
                    (financialInclusionIndex * 100).toFixed(1),
                    "ne",
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{inclusionLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> वित्तीय समावेशीकरणको यो
                  सूचकाङ्क बैङ्क खाता, फाइनान्स, सहकारी, लघुवित्त र खाता नभएका
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
                  अंकले {inclusionLevel} स्तरको वित्तीय समावेशीकरण दर्शाउँछ।
                  यसमा सुधारका लागि वित्तीय साक्षरता तथा सेवा विस्तारका
                  कार्यक्रमहरू आवश्यक छन्।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">
              वडागत वित्तीय समावेशीकरण विश्लेषण
            </h4>

            <div>
              <h5 className="text-sm font-medium">
                गढवा गाउँपालिका वित्तीय समावेशीकरणको स्थिति
              </h5>
              <div className="mt-2 space-y-3">
                {/* Account presence percentage */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      वित्तीय खाता भएका
                    </span>
                    <span className="font-medium">
                      {localizeNumber(accountPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{
                        width: `${accountPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Bank account percentage */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
                        }}
                      ></span>
                      बैङ्क खाता भएका
                    </span>
                    <span className="font-medium">
                      {localizeNumber(bankPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${bankPercentage}%`,
                        backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* No account percentage */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
                        }}
                      ></span>
                      खाता नभएका
                    </span>
                    <span className="font-medium">
                      {localizeNumber(noAccountPercentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${noAccountPercentage}%`,
                        backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
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
                  href="/profile/economics/ward-wise-time-to-financial-organization"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  वित्तीय संस्थामा पुग्न लाग्ने समय
                </Link>
                <Link
                  href="/profile/economics/ward-wise-income-sources"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  आम्दानीको स्रोत
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
