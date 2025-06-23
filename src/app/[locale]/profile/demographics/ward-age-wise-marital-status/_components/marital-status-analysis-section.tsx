"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MaritalStatusAnalysisProps {
  overallByMaritalStatus: Array<{
    status: string;
    statusName: string;
    population: number;
  }>;
  ageWiseMaritalData: Array<Record<string, any>>;
  genderWiseData: Array<{
    status: string;
    statusName: string;
    male: number;
    female: number;
    other: number;
    total: number;
  }>;
  wardWiseData: Array<Record<string, any>>;
  totalPopulation: number;
  MARITAL_STATUS_NAMES: Record<string, string>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_CATEGORIES: Record<string, string[]>;
}

export default function MaritalStatusAnalysisSection({
  overallByMaritalStatus,
  ageWiseMaritalData,
  genderWiseData,
  wardWiseData,
  totalPopulation,
  MARITAL_STATUS_NAMES,
  AGE_GROUP_NAMES,
  AGE_CATEGORIES,
}: MaritalStatusAnalysisProps) {
  // Calculate key indicators and metrics
  const indicators = useMemo(() => {
    // Find married and unmarried populations
    const marriedPopulation =
      overallByMaritalStatus.find((item) => item.status === "MARRIED")
        ?.population || 0;

    const unmarriedPopulation =
      overallByMaritalStatus.find((item) => item.status === "SINGLE")
        ?.population || 0;

    const widowedPopulation =
      overallByMaritalStatus.find((item) => item.status === "WIDOWED")
        ?.population || 0;

    const divorcedSeparatedPopulation = overallByMaritalStatus
      .filter((item) => ["DIVORCED", "SEPARATED"].includes(item.status))
      .reduce((sum, item) => sum + item.population, 0);

    // Calculate gender ratios
    const marriedMales =
      genderWiseData.find((item) => item.status === "MARRIED")?.male || 0;

    const marriedFemales =
      genderWiseData.find((item) => item.status === "MARRIED")?.female || 0;

    // Find early marriage data (15-19 age group with married status)
    const earlyMarriageData = ageWiseMaritalData.find(
      (item) => item.ageGroup === "AGE_15_19",
    );

    const earlyMarriageCount = earlyMarriageData
      ? earlyMarriageData.MARRIED || 0
      : 0;

    // Find child marriage data (below 15 with any marriage)
    const childMarriageData = ageWiseMaritalData.find(
      (item) => item.ageGroup === "AGE_BELOW_15",
    );

    const childMarriageCount = childMarriageData
      ? childMarriageData.MARRIED || 0
      : 0;

    // Calculate widowhood rate - percent of widowed among total married
    const widowhoodRate =
      marriedPopulation > 0
        ? (widowedPopulation / (marriedPopulation + widowedPopulation)) * 100
        : 0;

    // Calculate divorce rate
    const divorceRate =
      marriedPopulation > 0
        ? (divorcedSeparatedPopulation /
            (marriedPopulation + divorcedSeparatedPopulation)) *
          100
        : 0;

    // Calculate marriage rate - percent of adults who are married
    const marriageRate = (marriedPopulation / totalPopulation) * 100;

    // Calculate gender gap in marriage
    const genderGapInMarriage =
      marriedMales > 0 && marriedFemales > 0
        ? ((marriedFemales - marriedMales) /
            ((marriedFemales + marriedMales) / 2)) *
          100
        : 0;

    return {
      marriedPopulation,
      unmarriedPopulation,
      widowedPopulation,
      divorcedSeparatedPopulation,
      widowhoodRate,
      divorceRate,
      marriageRate,
      genderGapInMarriage,
      earlyMarriageCount,
      childMarriageCount,
    };
  }, [
    overallByMaritalStatus,
    genderWiseData,
    ageWiseMaritalData,
    totalPopulation,
  ]);

  // Calculate age-specific marriage rates
  const ageSpecificMarriageRates = useMemo(() => {
    return ageWiseMaritalData.map((ageGroup) => {
      const totalInAgeGroup = ageGroup.total;
      const marriedInAgeGroup = ageGroup.MARRIED || 0;

      const marriageRate =
        totalInAgeGroup > 0 ? (marriedInAgeGroup / totalInAgeGroup) * 100 : 0;

      return {
        ageGroup: ageGroup.ageGroup,
        ageGroupName: ageGroup.ageGroupName,
        marriageRate,
      };
    });
  }, [ageWiseMaritalData]);

  // Find ward with highest and lowest marriage rates
  const wardMarriageRates = useMemo(() => {
    return wardWiseData
      .map((ward) => {
        const totalPopulationInWard = ward.total;
        const marriedPopulationInWard = ward.MARRIED || 0;

        const marriageRate =
          totalPopulationInWard > 0
            ? (marriedPopulationInWard / totalPopulationInWard) * 100
            : 0;

        return {
          wardId: ward.wardId,
          wardNumber: ward.wardNumber,
          marriageRate,
        };
      })
      .sort((a, b) => b.marriageRate - a.marriageRate);
  }, [wardWiseData]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              विवाह दर
            </div>
            <div className="text-2xl font-bold text-primary">
              {localizeNumber(indicators.marriageRate.toFixed(1), "ne")}%
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${indicators.marriageRate}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              सम्बन्ध विच्छेद दर
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {localizeNumber(indicators.divorceRate.toFixed(1), "ne")}%
            </div>
            <div className="text-sm text-muted-foreground">
              विवाहित जनसंख्याको
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${indicators.divorceRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              विधवा/विधुर दर
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {localizeNumber(indicators.widowhoodRate.toFixed(1), "ne")}%
            </div>
            <div className="text-sm text-muted-foreground">
              विवाहित जनसंख्याको
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${indicators.widowhoodRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">सामाजिक सूचकांकहरू</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">अविवाहित जनसंख्या</h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  (indicators.unmarriedPopulation / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल जनसंख्याको{" "}
              {localizeNumber(
                indicators.unmarriedPopulation.toLocaleString(),
                "ne",
              )}{" "}
              व्यक्ति
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">बाल विवाह</h4>
            <p className="text-3xl font-bold text-red-500">
              {localizeNumber(
                indicators.childMarriageCount.toLocaleString(),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              १५ वर्ष भन्दा कम उमेरमा विवाह भएका
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">किशोर विवाह</h4>
            <p className="text-3xl font-bold text-amber-500">
              {localizeNumber(
                indicators.earlyMarriageCount.toLocaleString(),
                "ne",
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              १५-१९ वर्ष उमेर समूहमा विवाहित जनसंख्या
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">लैंगिक अन्तर</h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                Math.abs(indicators.genderGapInMarriage).toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {indicators.genderGapInMarriage > 0
                ? "महिलामा बढी विवाह दर"
                : "पुरुषमा बढी विवाह दर"}
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">एकल महिला/पुरुष</h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  ((indicators.widowedPopulation +
                    indicators.divorcedSeparatedPopulation) /
                    totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              विधवा/विधुर, पारपाचुके र छुट्टिएका जनसंख्या
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">पुनर्विवाह दर</h4>
            <p className="text-3xl font-bold">
              {localizeNumber(
                (
                  ((overallByMaritalStatus.find(
                    (item) => item.status === "REMARRIAGE",
                  )?.population || 0) /
                    indicators.marriedPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              विवाहित जनसंख्याको प्रतिशत जसले पुनर्विवाह गरेका छन्
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-4">उमेर अनुसार विवाह दर</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">उमेर समूह</th>
                <th className="border p-2 text-right">विवाह दर (%)</th>
                <th className="border p-2 text-left">अवस्था</th>
              </tr>
            </thead>
            <tbody>
              {ageSpecificMarriageRates.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                  <td className="border p-2">{item.ageGroupName}</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.marriageRate.toFixed(1), "ne")}%
                  </td>
                  <td className="border p-2">
                    {item.marriageRate > 80
                      ? "अति उच्च विवाह दर"
                      : item.marriageRate > 50
                        ? "उच्च विवाह दर"
                        : item.marriageRate > 20
                          ? "मध्यम विवाह दर"
                          : item.ageGroup === "AGE_BELOW_15" &&
                              item.marriageRate > 0
                            ? "बाल विवाह चिन्ताजनक"
                            : "न्यून विवाह दर"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-4">वडा अनुसार विवाह दर</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">उच्च विवाह दर भएका वडाहरू</h4>
            <ul className="space-y-2 mt-3">
              {wardMarriageRates.slice(0, 3).map((ward, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{localizeNumber(ward.wardNumber, "ne")}</span>
                  <span className="font-medium">
                    {localizeNumber(ward.marriageRate.toFixed(1), "ne")}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">न्यून विवाह दर भएका वडाहरू</h4>
            <ul className="space-y-2 mt-3">
              {wardMarriageRates
                .slice(-3)
                .reverse()
                .map((ward, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{localizeNumber(ward.wardNumber, "ne")}</span>
                    <span className="font-medium">
                      {localizeNumber(ward.marriageRate.toFixed(1), "ne")}%
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          वैवाहिक स्थिति सम्बन्धि प्रवृत्ति र तात्पर्य
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            पालिकाको वैवाहिक स्थितिको तथ्याङ्कले निम्न महत्त्वपूर्ण प्रवृत्तिहरू
            देखाउँछन्:
          </p>

          <ul>
            <li>
              <strong>विवाह उमेर:</strong> पालिकामा औसत विवाह उमेर{" "}
              {indicators.earlyMarriageCount > 50 ? "कम" : "उच्च"} रहेको छ, जसले{" "}
              {indicators.earlyMarriageCount > 50
                ? "बाल विवाह विरुद्धको जनचेतनामूलक कार्यक्रमको आवश्यकता"
                : "शिक्षा र जनचेतना बढेको सङ्केत"}{" "}
              देखाउँछ
            </li>

            <li>
              <strong>एकल महिला/पुरुष संख्या:</strong> पालिकामा एकल महिला तथा
              पुरुषहरूको संख्या{" "}
              {(indicators.widowedPopulation +
                indicators.divorcedSeparatedPopulation) /
                totalPopulation >
              0.05
                ? "उल्लेख्य रहेकोले यिनको लागि विशेष कार्यक्रम आवश्यक"
                : "तुलनात्मक रूपमा कम रहेको"}{" "}
              देखिन्छ
            </li>

            <li>
              <strong>विवाह र सम्बन्ध विच्छेद:</strong> पालिकामा सम्बन्ध विच्छेद
              दर{" "}
              {indicators.divorceRate > 5
                ? "बढ्दो क्रममा रहेको देखिन्छ जसले परिवारिक सम्बन्धमा देखिएका चुनौतिहरूलाई इङ्गित गर्दछ"
                : "निकै न्यून रहेको देखिन्छ जुन परम्परागत पारिवारिक मूल्यमान्यतासँग जोडिएको हुन सक्छ"}
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">नीतिगत सिफारिसहरू</h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ul>
            <li>
              {indicators.childMarriageCount > 0 && (
                <span>
                  <strong>बाल विवाह न्यूनीकरण:</strong>{" "}
                  {localizeNumber(
                    indicators.childMarriageCount.toString(),
                    "ne",
                  )}{" "}
                  जना बाल विवाह भएका व्यक्तिहरूलाई लक्षित गरी विशेष जनचेतनामूलक
                  कार्यक्रम सञ्चालन गर्नुपर्ने देखिन्छ
                </span>
              )}
              {indicators.childMarriageCount === 0 && (
                <span>
                  <strong>बाल विवाह न्यूनीकरण:</strong> बाल विवाह पूर्ण
                  निर्मूलनको लागि निरन्तर जनचेतना कार्यक्रम जारी राख्न आवश्यक छ
                </span>
              )}
            </li>

            <li>
              <strong>एकल महिला/पुरुष सहायता:</strong> विधवा/विधुर तथा पारपाचुके
              भएकाहरू (
              {localizeNumber(
                (
                  indicators.widowedPopulation +
                  indicators.divorcedSeparatedPopulation
                ).toLocaleString(),
                "ne",
              )}{" "}
              जना) को लागि सामाजिक सुरक्षा तथा आर्थिक सशक्तीकरणका कार्यक्रम
            </li>

            <li>
              <strong>लैंगिक समानता प्रवर्द्धन:</strong> विवाह निर्णयमा महिला र
              पुरुषको समान अधिकार सुनिश्चित गर्न जनचेतनामूलक कार्यक्रम
            </li>

            <li>
              <strong>विवाह परामर्श:</strong> बढ्दो सम्बन्ध विच्छेद दरलाई
              सम्बोधन गर्न पारिवारिक परामर्श सेवाको विस्तार
            </li>

            <li>
              <strong>वृद्ध सहायता:</strong> एकल वृद्धहरूको हेरचाह र समर्थनका
              लागि विशेष कार्यक्रमहरूको आवश्यकता
            </li>
          </ul>

          <p className="mt-4">
            उमेर अनुसार वैवाहिक स्थितिको यो विश्लेषणले पालिकालाई समग्र सामाजिक
            विकासको योजना बनाउन र सामाजिक सुरक्षा कार्यक्रमहरू निर्देशित गर्न
            महत्त्वपूर्ण आधार प्रदान गर्दछ।
          </p>
        </div>
      </div>
    </>
  );
}
