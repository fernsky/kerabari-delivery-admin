import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceAnalysisSectionProps {
  overallSummary: Array<{
    amountGroup: string;
    amountGroupLabel: string;
    sendingPopulation: number;
    color: string;
  }>;
  totalSendingPopulation: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalSendingPopulation: number;
    mostCommonAmountGroup: string;
    mostCommonAmountGroupLabel: string;
    mostCommonCount: number;
    mostCommonPercentage: string;
    highRemittanceSendingPopulation: number;
    highRemittancePercentage: string;
    lowRemittanceSendingPopulation: number;
    lowRemittancePercentage: string;
    mediumRemittanceSendingPopulation: number;
    mediumRemittancePercentage: string;
    veryHighRemittanceSendingPopulation: number;
    veryHighRemittancePercentage: string;
    averageRemittance: number;
    estimatedAnnualRemittance: number;
    prosperityIndex: number;
  }>;
  AMOUNT_RANGE_MAP: Record<
    string,
    { min: number; max: number | null; color: string; label: string }
  >;
  remittanceLevelData: Array<{
    level: string;
    levelLabel: string;
    population: number;
    percentage: string;
    color: string;
  }>;
  remittanceAmountGroupOptions: Array<{
    value: string;
    label: string;
  }>;
  totalData: {
    totalSendingPopulation: number;
    highRemittanceSendingPopulation: number;
    highRemittancePercentage: string;
    mediumRemittanceSendingPopulation: number;
    mediumRemittancePercentage: string;
    lowRemittanceSendingPopulation: number;
    lowRemittancePercentage: string;
    veryHighRemittanceSendingPopulation: number;
    veryHighRemittancePercentage: string;
    averageRemittance: number;
    totalEstimatedRemittance: number;
    estimatedAnnualRemittanceCrores: string;
  };
}

export default function RemittanceAnalysisSection({
  overallSummary,
  totalSendingPopulation,
  wardWiseAnalysis,
  AMOUNT_RANGE_MAP,
  remittanceLevelData,
  remittanceAmountGroupOptions,
  totalData,
}: RemittanceAnalysisSectionProps) {
  // Find out which ward has highest sending population
  const highestSendingPopulationWard = [...wardWiseAnalysis].sort(
    (a, b) => b.totalSendingPopulation - a.totalSendingPopulation,
  )[0];

  // Find out which ward has highest high remittance percentage
  const highestHighRemittanceWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.highRemittancePercentage) -
      parseFloat(a.highRemittancePercentage),
  )[0];

  // Find out which ward has highest very high remittance percentage
  const highestVeryHighRemittanceWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.veryHighRemittancePercentage) -
      parseFloat(a.veryHighRemittancePercentage),
  )[0];

  // Find out which ward has highest prosperity index
  const highestProsperityIndexWard = [...wardWiseAnalysis].sort(
    (a, b) => b.prosperityIndex - a.prosperityIndex,
  )[0];

  // Find out which ward has highest average remittance
  const highestAverageRemittanceWard = [...wardWiseAnalysis].sort(
    (a, b) => b.averageRemittance - a.averageRemittance,
  )[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-sending-population": totalSendingPopulation.toString(),
    "data-most-common-amount":
      overallSummary.sort(
        (a, b) => b.sendingPopulation - a.sendingPopulation,
      )[0]?.amountGroupLabel || "",
    "data-high-remittance-percentage": totalData.highRemittancePercentage,
    "data-estimated-annual-remittance":
      totalData.estimatedAnnualRemittanceCrores,
    "data-average-remittance": totalData.averageRemittance.toString(),
  };

  return (
    <>
      <h2 id="ward-wise-remittance" className="scroll-m-20 border-b pb-2 mt-8">
        वडा अनुसार रेमिट्यान्स वितरण विश्लेषण
      </h2>

      <div
        className="mt-4 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">
            सर्वाधिक रेमिट्यान्स पठाउने वडा
          </h4>
          <p className="text-3xl font-bold">
            वडा{" "}
            {localizeNumber(
              highestSendingPopulationWard?.wardNumber.toString() || "",
              "ne",
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {localizeNumber(
              highestSendingPopulationWard?.totalSendingPopulation.toString() ||
                "0",
              "ne",
            )}{" "}
            जना
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सर्वाधिक समृद्धि सूचकांक</h4>
          <p className="text-3xl font-bold">
            वडा{" "}
            {localizeNumber(
              highestProsperityIndexWard?.wardNumber.toString() || "",
              "ne",
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            सूचकांक{" "}
            {localizeNumber(
              highestProsperityIndexWard?.prosperityIndex.toString() || "0",
              "ne",
            )}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">उच्चतम औसत रेमिट्यान्स</h4>
          <p className="text-3xl font-bold">
            वडा{" "}
            {localizeNumber(
              highestAverageRemittanceWard?.wardNumber.toString() || "",
              "ne",
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            रु.{" "}
            {localizeNumber(
              highestAverageRemittanceWard?.averageRemittance.toLocaleString() ||
                "0",
              "ne",
            )}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          विस्तृत वडागत विश्लेषण
          <span className="sr-only">
            Detailed Ward-wise Remittance Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="remittance-category-analysis"
            data-percentage={
              remittanceLevelData.find((d) => d.level === "veryHigh")
                ?.percentage || "0"
            }
          >
            <h4 className="font-medium mb-2">
              उच्च रेमिट्यान्स वितरण
              <span className="sr-only">
                High Remittance Distribution in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-sm mb-3">
              गाउँपालिकामा उच्च रेमिट्यान्स (रु. ३ लाख भन्दा माथि) पठाउने
              व्यक्तिहरू{" "}
              {localizeNumber(totalData.highRemittancePercentage, "ne")}% छन्,
              जसमा{" "}
              {localizeNumber(totalData.veryHighRemittancePercentage, "ne")}% ले
              अत्यधिक रेमिट्यान्स (रु. ५ लाख भन्दा माथि) पठाउँछन्।
            </p>

            <div className="space-y-3 mt-4">
              {wardWiseAnalysis.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(ward.highRemittancePercentage, "ne")}%
                      उच्च रेमिट्यान्स
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${parseFloat(ward.highRemittancePercentage)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium mb-1">प्रमुख रेमिट्यान्स समूह</h5>
                  <p className="text-sm text-muted-foreground">
                    गाउँपालिका भरि
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {overallSummary
                      .sort(
                        (a, b) => b.sendingPopulation - a.sendingPopulation,
                      )[0]
                      ?.amountGroupLabel.substring(0, 20) || ""}
                    ...
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: overallSummary.sort(
                        (a, b) => b.sendingPopulation - a.sendingPopulation,
                      )[0]?.color,
                    }}
                  >
                    {localizeNumber(
                      (
                        ((overallSummary.sort(
                          (a, b) => b.sendingPopulation - a.sendingPopulation,
                        )[0]?.sendingPopulation || 0) /
                          totalSendingPopulation) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">
              वडागत रेमिट्यान्स समृद्धि सूचकांक
            </h4>

            <div className="space-y-5">
              {wardWiseAnalysis.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <h5 className="text-sm font-medium mb-1">
                    वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${ward.prosperityIndex || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {localizeNumber(
                        ward.prosperityIndex.toString() || "0",
                        "ne",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>
                      औसत रु.{" "}
                      {localizeNumber(
                        ward.averageRemittance.toLocaleString(),
                        "ne",
                      )}
                    </span>
                    <span>
                      उच्च रेमिट्यान्स{" "}
                      {localizeNumber(ward.highRemittancePercentage, "ne")}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between">
                <div>
                  <h5 className="font-medium">समृद्धि सूचकांकको मापन</h5>
                  <p className="text-sm text-muted-foreground">
                    रेमिट्यान्स स्तर र औसतको आधारमा
                  </p>
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-end gap-2 justify-end">
                    <div className="text-2xl font-bold text-blue-600">
                      {localizeNumber(
                        highestProsperityIndexWard?.prosperityIndex.toString() ||
                          "",
                        "ne",
                      )}
                    </div>
                    <div className="text-sm mb-1">/१००</div>
                  </div>
                  <p className="text-xs">
                    सर्वोत्कृष्ट समृद्धि सूचकांक (वडा{" "}
                    {localizeNumber(
                      highestProsperityIndexWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    )
                  </p>
                </div>
              </div>
              <Link
                href="/profile/economics/ward-wise-foreign-employment-countries"
                className="mt-2 text-sm text-blue-600 hover:underline flex justify-end items-center gap-1"
              >
                <span>वैदेशिक रोजगारी विवरण हेर्नुहोस्</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत तुलनात्मक विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>उच्च रेमिट्यान्स केन्द्रित वडाहरू:</strong> वडा नं.{" "}
                  {localizeNumber(
                    highestHighRemittanceWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    highestHighRemittanceWard?.highRemittancePercentage || "0",
                    "ne",
                  )}
                  % जनसंख्याले उच्च रेमिट्यान्स पठाउने गरेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>रेमिट्यान्स विविधता:</strong> वडा नं.{" "}
                  {localizeNumber(
                    highestSendingPopulationWard?.wardNumber.toString() || "",
                    "ne",
                  )}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    highestSendingPopulationWard?.totalSendingPopulation.toLocaleString() ||
                      "0",
                    "ne",
                  )}{" "}
                  जनाले रेमिट्यान्स पठाउँछन्, जसमा विभिन्न आय समूहका व्यक्तिहरू
                  रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>अत्यधिक रेमिट्यान्स:</strong> वडा नं.{" "}
                  {localizeNumber(
                    highestVeryHighRemittanceWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    highestVeryHighRemittanceWard?.veryHighRemittancePercentage ||
                      "0",
                    "ne",
                  )}
                  % जनसंख्याले रु. ५ लाखभन्दा बढीको रेमिट्यान्स पठाउने गरेका
                  छन्। यो राष्ट्रिय औसतभन्दा उल्लेखनीय रूपमा बढी हो।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  <strong>औसत रेमिट्यान्स उच्चता:</strong> वडा नं.{" "}
                  {localizeNumber(
                    highestAverageRemittanceWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा सबैभन्दा उच्च औसत रेमिट्यान्स रकम रु.{" "}
                  {localizeNumber(
                    highestAverageRemittanceWard?.averageRemittance.toLocaleString() ||
                      "0",
                    "ne",
                  )}
                  रहेको छ, जुन गाउँपालिकाको औसत रु.{" "}
                  {localizeNumber(
                    totalData.averageRemittance.toLocaleString(),
                    "ne",
                  )}{" "}
                  भन्दा{" "}
                  {(highestAverageRemittanceWard?.averageRemittance || 0) >
                  totalData.averageRemittance
                    ? "बढी"
                    : "कम"}{" "}
                  हो।
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
