import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FarmersGroupAnalysisSectionProps {
  groupSummary: Array<{
    type: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalGroups: number;
  farmsByWard: Array<{
    wardNumber: number;
    farmCount: number;
    farms: Array<{
      id: string;
      name: string;
      type: string;
      icon: string;
    }>;
  }>;
  WARD_COLORS: Record<number, string>;
  WARD_NAMES_EN: Record<number, string>;
  statistics: {
    totalGroups: number;
    totalWards: number;
    avgGroupsPerWard: number;
    mostPopularGroupType: string;
    mostPopularGroupTypePercentage: number;
    wardWithMostGroups: number;
    maximumGroupsInAWard: number;
  };
  popularGroupByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    count: number;
    icon: string;
  }>;
}

export default function FarmersGroupAnalysisSection({
  groupSummary,
  totalGroups,
  farmsByWard,
  WARD_COLORS,
  WARD_NAMES_EN,
  statistics,
  popularGroupByWard,
}: FarmersGroupAnalysisSectionProps) {
  // Find primary and secondary group types
  const primaryGroup = groupSummary.length > 0 ? groupSummary[0] : null;
  const secondaryGroup = groupSummary.length > 1 ? groupSummary[1] : null;

  // Find most concentrated ward (most groups per total municipality groups)
  const mostConcentratedWard = farmsByWard.find(
    (ward) => ward.wardNumber === statistics.wardWithMostGroups,
  );

  // Find wards with no groups
  const wardsWithNoGroups = farmsByWard.filter((ward) => ward.farmCount === 0);

  // Calculate ward distribution inequality (Gini coefficient-like measure)
  const totalFarmsDistributed = farmsByWard.reduce(
    (sum, ward) => sum + ward.farmCount,
    0,
  );
  const perfectDistribution = totalFarmsDistributed / farmsByWard.length;
  const wardDeviation = farmsByWard
    .map((ward) => Math.abs(ward.farmCount - perfectDistribution))
    .reduce((sum, deviation) => sum + deviation, 0);
  const maxPossibleDeviation =
    perfectDistribution * farmsByWard.length * (1 - 1 / farmsByWard.length);
  const inequalityIndex =
    maxPossibleDeviation > 0 ? wardDeviation / maxPossibleDeviation : 0;

  // Calculate group type diversity index (Shannon diversity index-like)
  const groupTypesCount = groupSummary.length;
  const groupEvenness =
    groupSummary.reduce((entropy, group) => {
      const proportion = group.count / totalGroups;
      return entropy - proportion * Math.log(proportion);
    }, 0) / Math.log(groupTypesCount);

  // SEO attributes to include in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-groups": totalGroups.toString(),
    "data-most-common-group": primaryGroup?.type || "",
    "data-ward-distribution": farmsByWard
      .map((w) => `${w.wardNumber}:${w.farmCount}`)
      .join(";"),
  };

  return (
    <>
      <h2 id="group-profile" className="scroll-m-20 border-b pb-2 mt-12">
        समूह प्रोफाइल
      </h2>

      <p className="mt-4">
        केराबारी गाउँपालिकाका कृषि सम्बन्धित समूहहरूले कृषि उत्पादन, बजारीकरण
        र सामूहिक विकासका क्षेत्रमा महत्त्वपूर्ण कार्य गरिरहेका छन्। विभिन्न
        प्रकारका कृषक समूह, महिला कृषक समूह, दलित कृषक समूह, बचत समूह जस्ता
        संगठित समूहहरूले स्थानीय अर्थतन्त्रमा योगदान पुर्‍याइरहेका छन्।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">{groupSummary[0]?.icon || "🌱"}</div>
          <h3 className="text-xl font-semibold mb-2">
            {groupSummary[0]?.type || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            केराबारीमा सबैभन्दा लोकप्रिय कृषि समूह प्रकार, जुन कुल समूहको
            {localizeNumber(
              groupSummary[0]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(groupSummary[0]?.count.toString() || "0", "ne")}{" "}
              समूह
            </span>
            <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
              प्रमुख प्रकार
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-4xl mb-3">{groupSummary[1]?.icon || "🌱"}</div>
          <h3 className="text-xl font-semibold mb-2">
            {groupSummary[1]?.type || ""}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            दोस्रो सबैभन्दा लोकप्रिय कृषि समूह प्रकार, जुन कुल समूहको
            {localizeNumber(
              groupSummary[1]?.percentage.toFixed(1) || "0",
              "ne",
            )}
            % हिस्सा ओगट्छ।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              {localizeNumber(groupSummary[1]?.count.toString() || "0", "ne")}{" "}
              समूह
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
            {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")} मा
            सबैभन्दा बढी
            {localizeNumber(
              statistics.maximumGroupsInAWard.toString(),
              "ne",
            )}{" "}
            समूह सक्रिय छन्।
          </p>
          <div className="flex justify-between items-center mt-2">
            <span>
              मुख्य समूह:{" "}
              {popularGroupByWard.find(
                (w) => w.wardNumber === statistics.wardWithMostGroups,
              )?.mostCommonType || ""}
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
          <h4 className="text-lg font-medium mb-2">कुल समूह</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalGroups.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            कृषि सम्बन्धित समूह
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सक्रिय वडा</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(statistics.totalWards.toString(), "ne")}/९
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            कृषि समूह भएका वडा
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">समूह प्रकार</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(groupTypesCount.toString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            विभिन्न समूह प्रकार
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          कृषि सम्बन्धित समूहहरूको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Agriculture Related Groups Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              प्रमुख समूह प्रकार
              <span className="sr-only">
                Main Group Types in Khajura Rural Municipality
              </span>
            </h4>
            {primaryGroup && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{ backgroundColor: "#3498db" }}
                ></div>
                <div>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {primaryGroup.icon} {primaryGroup.type}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(primaryGroup.count.toString(), "ne")} समूह (
                    {localizeNumber(primaryGroup.percentage.toFixed(1), "ne")}%)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top 3 group types visualization */}
              {groupSummary.slice(0, 3).map((group, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{group.icon}</span>
                      <span>{group.type}</span>
                    </span>
                    <span className="font-medium">
                      {localizeNumber(group.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(group.percentage, 100)}%`,
                        backgroundColor:
                          ["#3498db", "#2ecc71", "#9b59b6"][index] || "#95a5a6",
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
                  <span>सबैभन्दा बढी समूह</span>
                  <span className="font-medium">
                    वडा नं.{" "}
                    {localizeNumber(
                      statistics.wardWithMostGroups.toString(),
                      "ne",
                    )}
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(statistics.maximumGroupsInAWard / totalGroups) * 100}%`,
                      backgroundColor:
                        WARD_COLORS[statistics.wardWithMostGroups] || "#3498db",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {localizeNumber(
                      statistics.maximumGroupsInAWard.toString(),
                      "ne",
                    )}{" "}
                    समूह
                  </span>
                  <span>
                    कुल को{" "}
                    {localizeNumber(
                      (
                        (statistics.maximumGroupsInAWard / totalGroups) *
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
                    {localizeNumber(wardsWithNoGroups.length.toString(), "ne")}{" "}
                    वडा
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${(wardsWithNoGroups.length / farmsByWard.length) * 100}%`,
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
                    {localizeNumber((groupEvenness * 100).toFixed(1), "ne")}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    समूह विविधता सूचक
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  वितरण असमानता सूचक {(inequalityIndex * 100).toFixed(1)}%
                  भएकोले वडागत रूपमा समूहहरू
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
                  <strong>समूह वितरण:</strong> पालिकामा सबैभन्दा बढी
                  {primaryGroup?.type ? ` ${primaryGroup.type} ` : " "}
                  समूहहरू (
                  {localizeNumber(
                    primaryGroup?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) र त्यसपछि
                  {secondaryGroup?.type ? ` ${secondaryGroup.type} ` : " "}(
                  {localizeNumber(
                    secondaryGroup?.percentage.toFixed(1) || "0",
                    "ne",
                  )}
                  %) समूहहरू रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>वडागत वितरण:</strong> वडा नं.{" "}
                  {localizeNumber(
                    statistics.wardWithMostGroups.toString(),
                    "ne",
                  )}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    statistics.maximumGroupsInAWard.toString(),
                    "ne",
                  )}{" "}
                  समूहहरू रहेका छन्, जुन कुल समूहहरूको{" "}
                  {localizeNumber(
                    (
                      (statistics.maximumGroupsInAWard / totalGroups) *
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
                  कृषि सम्बन्धित समूहहरू सक्रिय रहेका छन्। औसतमा प्रति वडा{" "}
                  {localizeNumber(statistics.avgGroupsPerWard.toFixed(1), "ne")}
                  समूह रहेका छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>समूह विविधता:</strong> पालिकामा{" "}
                  {localizeNumber(groupTypesCount.toString(), "ne")}
                  प्रकारका कृषि सम्बन्धित समूहहरू रहेका छन्। समग्रमा विविधता
                  सूचक {localizeNumber((groupEvenness * 100).toFixed(1), "ne")}%
                  रहेको छ, जसले{" "}
                  {groupEvenness > 0.6
                    ? "उच्च"
                    : groupEvenness > 0.4
                      ? "मध्यम"
                      : "न्युन"}{" "}
                  विविधता देखाउँछ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">आर्थिक प्रभाव विश्लेषण</h4>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-1">सामूहिक विकास</h5>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(totalGroups.toString(), "ne")} कृषि सम्बन्धित
                  समूहहरूले अनुमानित
                  {localizeNumber(
                    (totalGroups * 20).toString(),
                    "ne",
                  )} देखि {localizeNumber((totalGroups * 30).toString(), "ne")}
                  घरपरिवारलाई प्रत्यक्ष लाभ दिएका छन्।
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  सामूहिक बचत र लगानी
                </h5>
                <p className="text-sm text-muted-foreground">
                  प्रति समूह औसत मासिक बचत रु. ५०० देखि २,००० सम्म हुने अनुमान
                  गरिँदा, वार्षिक सामूहिक बचत रु.{" "}
                  {localizeNumber(
                    ((totalGroups * 500 * 12) / 100000).toFixed(2),
                    "ne",
                  )}
                  लाखदेखि रु.{" "}
                  {localizeNumber(
                    ((totalGroups * 2000 * 12) / 100000).toFixed(2),
                    "ne",
                  )}{" "}
                  लाखसम्म हुनसक्छ।
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित तथ्याङ्क</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/economics/municipality-wide-commercial-agricultural-animal-husbandry-farmers-group"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  व्यावसायिक कृषि तथा पशुपालन
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
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
          <h4 className="font-medium mb-4">समूह प्रोफाइल विश्लेषण</h4>
          <p className="text-sm">
            केराबारी गाउँपालिकामा सञ्चालित कृषि सम्बन्धित समूहहरूले स्थानीय
            अर्थतन्त्रमा उल्लेखनीय योगदान पुर्‍याइरहेका छन्।{" "}
            {primaryGroup?.type} समूहहरूले प्रमुख हिस्सा ओगटेका छन्। वडा नं.{" "}
            {localizeNumber(statistics.wardWithMostGroups.toString(), "ne")}
            मा सबैभन्दा बढी समूह रहनुले यस क्षेत्रमा कृषि विकासका लागि थप अवसर
            रहेको देखाउँछ। आगामी दिनमा निष्क्रिय वडाहरूमा लक्षित कार्यक्रम र
            क्षमता विकासमा जोड दिनुपर्ने देखिन्छ।
          </p>
        </div>
      </div>
    </>
  );
}
