import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CooperativesAnalysisSectionProps {
  cooperativeSummary: Array<{
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalCooperatives: number;
  cooperativesByWard: Array<{
    wardNumber: number;
    cooperativeCount: number;
    cooperatives: Array<{
      id: string;
      cooperativeName: string;
      cooperativeType: string;
      typeName: string;
      phoneNumber: string;
      remarks: string;
      icon: string;
    }>;
  }>;
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_TYPES_EN: Record<string, string>;
  COOPERATIVE_COLORS: Record<string, string>;
  statistics: {
    totalCooperatives: number;
    totalWards: number;
    avgCooperativesPerWard: number;
    mostPopularCooperativeType: string;
    mostPopularCooperativeTypeName: string;
    mostPopularCooperativeTypePercentage: number;
    wardWithMostCooperatives: number;
    maximumCooperativesInAWard: number;
    provinceLevelCooperatives: number;
  };
  popularCooperativeByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
}

export default function CooperativesAnalysisSection({
  cooperativeSummary,
  totalCooperatives,
  cooperativesByWard,
  COOPERATIVE_TYPES,
  COOPERATIVE_TYPES_EN,
  COOPERATIVE_COLORS,
  statistics,
  popularCooperativeByWard,
}: CooperativesAnalysisSectionProps) {
  // Find primary and secondary cooperative types
  const primaryCooperative =
    cooperativeSummary.length > 0 ? cooperativeSummary[0] : null;
  const secondaryCooperative =
    cooperativeSummary.length > 1 ? cooperativeSummary[1] : null;

  // Find most concentrated ward (most cooperatives per total municipality cooperatives)
  const mostConcentratedWard = cooperativesByWard.find(
    (ward) => ward.wardNumber === statistics.wardWithMostCooperatives,
  );

  // Find wards with no cooperatives
  const wardsWithNoCooperatives = cooperativesByWard.filter(
    (ward) => ward.cooperativeCount === 0,
  );

  // Calculate ward distribution inequality (Gini coefficient-like measure)
  const totalCooperativesDistributed = cooperativesByWard.reduce(
    (sum, ward) => sum + ward.cooperativeCount,
    0,
  );
  const perfectDistribution =
    totalCooperativesDistributed / cooperativesByWard.length;
  const wardDeviation = cooperativesByWard
    .map((ward) => Math.abs(ward.cooperativeCount - perfectDistribution))
    .reduce((sum, deviation) => sum + deviation, 0);
  const maxPossibleDeviation =
    perfectDistribution *
    cooperativesByWard.length *
    (1 - 1 / cooperativesByWard.length);
  const inequalityIndex =
    maxPossibleDeviation > 0 ? wardDeviation / maxPossibleDeviation : 0;

  // Calculate cooperative type diversity index (Shannon diversity index-like)
  const cooperativeTypesCount = cooperativeSummary.length;
  const cooperativeEvenness =
    cooperativeSummary.reduce((entropy, cooperative) => {
      const proportion = cooperative.count / totalCooperatives;
      return entropy - proportion * Math.log(proportion);
    }, 0) / Math.log(cooperativeTypesCount);

  // SEO attributes to include in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-cooperatives": totalCooperatives.toString(),
    "data-province-level": statistics.provinceLevelCooperatives.toString(),
    "data-most-common-cooperative":
      primaryCooperative &&
      `${primaryCooperative.typeName} / ${COOPERATIVE_TYPES_EN[primaryCooperative.type] || primaryCooperative.type}`,
    "data-ward-distribution": cooperativesByWard
      .map((w) => `${w.wardNumber}:${w.cooperativeCount}`)
      .join(";"),
  };

  return (
    <>
      <h2 id="cooperative-profile" className="scroll-m-20 border-b pb-2 mt-12">
        सहकारी प्रोफाइल
      </h2>
      <p className="mt-4">
        गढवा गाउँपालिकाका सहकारी संस्थाहरूले विभिन्न प्रकारका वित्तीय, कृषि,
        महिला सशक्तिकरण, बहुउद्देश्यीय र सामुदायिक विकास कार्यहरूमा महत्त्वपूर्ण
        भूमिका निर्वाह गरिरहेका छन्। यी संस्थाहरूले बचत संकलन, ऋण प्रवाह,
        सामूहिक व्यवसाय प्रवर्द्धन र आर्थिक सबलीकरणमा योगदान पुर्‍याउँदै आएका
        छन्।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">
            {cooperativeSummary[0]?.icon || "🏢"}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {cooperativeSummary[0]?.typeName || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            गढवामा सबैभन्दा लोकप्रिय सहकारी प्रकार, जुन कुल सहकारीको
            {localizeNumber(
              cooperativeSummary[0]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(
                cooperativeSummary[0]?.count.toString() || "0",
                "ne",
              )}{" "}
              संस्था
            </span>
            <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
              प्रमुख प्रकार
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">
            {cooperativeSummary[1]?.icon || "🏢"}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {cooperativeSummary[1]?.typeName || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            दोस्रो सबैभन्दा लोकप्रिय सहकारी प्रकार, जुन कुल सहकारीको
            {localizeNumber(
              cooperativeSummary[1]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(
                cooperativeSummary[1]?.count.toString() || "0",
                "ne",
              )}{" "}
              संस्था
            </span>
            <span className="text-sm px-2 py-1 rounded bg-secondary/10 text-secondary">
              दोस्रो प्रकार
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-semibold mb-2">सबैभन्दा सक्रिय वडा</h3>
          <p className="text-muted-foreground text-sm mb-4">
            वडा नं.{" "}
            {localizeNumber(
              statistics.wardWithMostCooperatives.toString(),
              "ne",
            )}{" "}
            मा सबैभन्दा बढी
            {localizeNumber(
              statistics.maximumCooperativesInAWard.toString(),
              "ne",
            )}{" "}
            सहकारी संस्था सक्रिय छन्।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              मुख्य प्रकार:{" "}
              {popularCooperativeByWard.find(
                (w) => w.wardNumber === statistics.wardWithMostCooperatives,
              )?.mostCommonTypeName || ""}
            </span>
            <span className="text-sm px-2 py-1 rounded bg-blue-500/10 text-blue-600">
              अग्रणी वडा
            </span>
          </div>
        </div>
      </div>

      <h2 id="economic-impact" className="scroll-m-20 border-b pb-2 mt-12">
        आर्थिक प्रभाव
      </h2>

      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल सहकारी</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalCooperatives.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">सहकारी संस्था</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">प्रदेश स्तरीय</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(
              statistics.provinceLevelCooperatives.toString(),
              "ne",
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            प्रदेश स्तरीय सहकारी
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सहकारी प्रकार</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(cooperativeTypesCount.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">विभिन्न प्रकार</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          सहकारी संस्थाहरूको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Cooperative Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              प्रमुख सहकारी प्रकार
              <span className="sr-only">
                Main Cooperative Types in Khajura Rural Municipality
              </span>
            </h4>
            {primaryCooperative && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      COOPERATIVE_COLORS[primaryCooperative.type] || "#95a5a6",
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {primaryCooperative.icon} {primaryCooperative.typeName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(primaryCooperative.count.toString(), "ne")}{" "}
                    संस्था (
                    {localizeNumber(
                      primaryCooperative.percentage.toFixed(1),
                      "ne",
                    )}
                    %)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top 3 cooperative types visualization */}
              {cooperativeSummary.slice(0, 3).map((cooperative, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{cooperative.icon}</span>
                      <span>{cooperative.typeName}</span>
                    </span>
                    <span className="font-medium">
                      {localizeNumber(cooperative.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(cooperative.percentage, 100)}%`,
                        backgroundColor:
                          COOPERATIVE_COLORS[cooperative.type] || "#95a5a6",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">वडागत वितरण विश्लेषण</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>सबैभन्दा बढी सहकारी</span>
                  <span className="font-medium">
                    वडा नं.{" "}
                    {localizeNumber(
                      statistics.wardWithMostCooperatives.toString(),
                      "ne",
                    )}
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${(statistics.maximumCooperativesInAWard / totalCooperatives) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {localizeNumber(
                      statistics.maximumCooperativesInAWard.toString(),
                      "ne",
                    )}{" "}
                    संस्था
                  </span>
                  <span>
                    कुल को{" "}
                    {localizeNumber(
                      (
                        (statistics.maximumCooperativesInAWard /
                          totalCooperatives) *
                        100
                      ).toFixed(1),
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>निष्क्रिय वडा</span>
                  <span className="font-medium">
                    {localizeNumber(
                      wardsWithNoCooperatives.length.toString(),
                      "ne",
                    )}{" "}
                    वडा
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${(wardsWithNoCooperatives.length / cooperativesByWard.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">वडागत समन्वय सूचक</h5>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold">
                    {localizeNumber((inequalityIndex * 100).toFixed(1), "ne")}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    वितरण असमानता सूचक
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {localizeNumber(
                      (cooperativeEvenness * 100).toFixed(1),
                      "ne",
                    )}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    सहकारी विविधता सूचक
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  वितरण असमानता सूचक {(inequalityIndex * 100).toFixed(1)}%
                  भएकोले वडागत रूपमा सहकारीहरू
                  {inequalityIndex > 0.5 ? " असमान " : " सन्तुलित "}
                  वितरण भएको देखाउँछ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>सहकारी वितरण:</strong> पालिकामा सबैभन्दा बढी
                  {primaryCooperative?.typeName
                    ? ` ${primaryCooperative.typeName} `
                    : " "}
                  संस्थाहरू (
                  {localizeNumber(
                    primaryCooperative?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) र त्यसपछि
                  {secondaryCooperative?.typeName
                    ? ` ${secondaryCooperative.typeName} `
                    : " "}
                  (
                  {localizeNumber(
                    secondaryCooperative?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) संस्थाहरू रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>वडागत वितरण:</strong> वडा नं.{" "}
                  {localizeNumber(
                    statistics.wardWithMostCooperatives.toString(),
                    "ne",
                  )}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    statistics.maximumCooperativesInAWard.toString(),
                    "ne",
                  )}{" "}
                  संस्थाहरू रहेका छन्, जुन कुल संस्थाहरूको{" "}
                  {localizeNumber(
                    (
                      (statistics.maximumCooperativesInAWard /
                        totalCooperatives) *
                      100
                    ).toFixed(1),
                    "ne",
                  )}
                  % हो।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>समग्र अवस्था:</strong> कुल ९ वडा मध्ये{" "}
                  {localizeNumber(statistics.totalWards.toString(), "ne")} वडामा
                  सहकारी संस्थाहरू सक्रिय रहेका छन्। औसतमा प्रति वडा{" "}
                  {localizeNumber(
                    statistics.avgCooperativesPerWard.toFixed(1),
                    "ne",
                  )}
                  संस्था रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सहकारी विविधता:</strong> पालिकामा{" "}
                  {localizeNumber(cooperativeTypesCount.toString(), "ne")}
                  प्रकारका सहकारी संस्था रहेका छन्। समग्रमा विविधता सूचक{" "}
                  {localizeNumber((cooperativeEvenness * 100).toFixed(1), "ne")}
                  % रहेको छ, जसले{" "}
                  {cooperativeEvenness > 0.6
                    ? "उच्च"
                    : cooperativeEvenness > 0.4
                      ? "मध्यम"
                      : "न्यून"}{" "}
                  विविधता देखाउँछ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">आर्थिक प्रभाव विश्लेषण</h4>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-1">वित्तीय योगदान</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(totalCooperatives.toString(), "ne")} सहकारी
                  संस्थाहरूले संकलित कुल पूँजी अनुमानित
                  {localizeNumber(
                    (totalCooperatives * 50).toString(),
                    "ne",
                  )}{" "}
                  देखि{" "}
                  {localizeNumber((totalCooperatives * 100).toString(), "ne")}
                  लाख रुपैयाँ रहेको अनुमान गर्न सकिन्छ।
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">रोजगारी सिर्जना</h5>
                <p className="text-sm text-muted-foreground">
                  सहकारी संस्थाहरूले प्रत्यक्ष रूपमा अनुमानित{" "}
                  {localizeNumber((totalCooperatives * 3).toString(), "ne")}
                  जना र अप्रत्यक्ष रूपमा{" "}
                  {localizeNumber(
                    (totalCooperatives * 10).toString(),
                    "ne",
                  )}{" "}
                  जना व्यक्तिहरूलाई रोजगारी प्रदान गरेका छन्।
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित तथ्याङ्क</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/economics/ward-wise-time-to-financial-organization"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  वित्तीय संस्था पहुँच
                </Link>
                <Link
                  href="/profile/economics/commercial-agricultural-animal-husbandry-farmers-group"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि समूहहरू
                </Link>
                <Link
                  href="/profile/demographics/occupation-distribution"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  पेशागत वितरण
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-4">विस्तृत प्रभाव</h4>
          <p className="text-sm">
            गढवा गाउँपालिकामा सञ्चालित सहकारी संस्थाहरूले स्थानीय
            अर्थतन्त्रमा उल्लेखनीय योगदान पुर्‍याइरहेका छन्।{" "}
            {primaryCooperative?.typeName} संस्थाहरूले बचत तथा ऋण परिचालन मार्फत
            स्थानीय व्यवसाय प्रवर्द्धन र उद्यमशीलता विकासमा सहयोग पुर्‍याएका
            छन्। वडा नं.{" "}
            {localizeNumber(
              statistics.wardWithMostCooperatives.toString(),
              "ne",
            )}
            मा सबैभन्दा बढी सहकारी संस्था रहनुले यस क्षेत्रमा वित्तीय पहुँच र
            सहकारिता विकासमा सकारात्मक योगदान रहेको देखाउँछ। आगामी दिनमा
            सहकारीहरूको डिजिटलीकरण र क्षमता विकासमा थप जोड दिनुपर्ने देखिन्छ।
          </p>
        </div>
      </div>
    </>
  );
}
