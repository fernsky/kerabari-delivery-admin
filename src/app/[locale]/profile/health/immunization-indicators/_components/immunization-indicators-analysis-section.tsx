import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";
import { ImmunizationFiscalYear } from "@/server/api/routers/profile/health/immunization-indicators.schema";

interface ImmunizationIndicatorsAnalysisSectionProps {
  latestFiscalYear: ImmunizationFiscalYear;
  fiscalYearLabel: string;
  coverageData: any[];
  dropoutData: any[];
  wastageData: any[];
  indicatorLabels: Record<string, string>;
  fullyImmunizedValue: number;
  fullyImmunizedChange: number;
  dpt3Value: number;
  dptDropoutRate: number;
  immunizationQualityIndex: number;
}

export default function ImmunizationIndicatorsAnalysisSection({
  latestFiscalYear,
  fiscalYearLabel,
  coverageData,
  dropoutData,
  wastageData,
  indicatorLabels,
  fullyImmunizedValue,
  fullyImmunizedChange,
  dpt3Value,
  dptDropoutRate,
  immunizationQualityIndex,
}: ImmunizationIndicatorsAnalysisSectionProps) {
  // Analyze dropout rate severity
  const dropoutSeverity =
    dptDropoutRate <= 5
      ? "उत्कृष्ट (Excellent)"
      : dptDropoutRate <= 10
        ? "सन्तोषजनक (Acceptable)"
        : "उच्च (High)";

  // Find indicators needing improvement
  const lowCoverageIndicators = coverageData
    .filter((item) => item.value < 85)
    .map((item) => ({
      indicator: item.indicator,
      value: item.value,
      label: indicatorLabels[item.indicator],
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  // Find high wastage vaccines
  const highWastageVaccines = wastageData
    .filter((item) => item.value > 15)
    .map((item) => ({
      indicator: item.indicator,
      value: item.value,
      label: indicatorLabels[item.indicator],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <>
      <div className="pl-6 space-y-4">
        <div className="flex">
          <span className="font-bold mr-2">१.</span>
          <div>
            <strong>लक्षित समूहको पहिचान र फलोअप:</strong>
            {lowCoverageIndicators.length > 0 ? (
              <span>
                {" "}
                विशेषगरी{" "}
                {lowCoverageIndicators
                  .map((indicator) => indicator.label?.split(" (")[0])
                  .join(", ")}{" "}
                जस्ता कम कभरेज भएका खोपहरूको लक्षित वर्गको पहिचान गरी खोप फलोअप
                रणनीति तयार गर्ने।
              </span>
            ) : (
              <span>
                {" "}
                कम कभरेज भएका खोपहरू पहिचान गरी त्यसको बारेमा विशेष जोड दिने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">२.</span>
          <div>
            <strong>ड्रपआउट दर घटाउने:</strong>{" "}
            {localizeNumber(dptDropoutRate.toFixed(1), "ne")}% को DPT ड्रपआउट दर
            ({dropoutSeverity}) लाई कम गर्न अभिभावक शिक्षा कार्यक्रम सञ्चालन
            गर्ने र स्वास्थ्यकर्मीहरूलाई बच्चाहरूको फलोअपमा सक्रिय बनाउने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">३.</span>
          <div>
            <strong>खोप खेर जाने दर कम गर्ने:</strong>
            {highWastageVaccines.length > 0 ? (
              <span>
                {" "}
                {highWastageVaccines
                  .map((vaccine) =>
                    vaccine.indicator.replace("VACCINE_WASTAGE_", ""),
                  )
                  .join(", ")}{" "}
                खोपहरूको खेर जाने दर घटाउन स्वास्थ्यकर्मीहरूलाई तालिम प्रदान
                गर्ने र खोप सत्र व्यवस्थापनमा सुधार ल्याउने।
              </span>
            ) : (
              <span>
                {" "}
                उच्च खेर जाने दर भएका खोपहरूको पहिचान गरी सुधारात्मक उपायहरू
                अपनाउने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">४.</span>
          <div>
            <strong>सामुदायिक सहभागिता बढाउने:</strong> खोप सेवाको पहुँच र
            उपयोगिता बढाउन स्थानीय समुदायका अगुवा, महिला स्वास्थ्य स्वयंसेविका र
            आमा समूहहरूलाई परिचालन गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">५.</span>
          <div>
            <strong>खोप अभियान र जागरूकता:</strong> पूर्ण खोप कभरेज{" "}
            {localizeNumber(fullyImmunizedValue.toFixed(1), "ne")}% लाई बढाउन
            नियमित रूपमा खोप जागरूकता र विशेष अभियानहरू सञ्चालन गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">६.</span>
          <div>
            <strong>कोल्ड चेन व्यवस्थापन सुधार:</strong> खोपको प्रभावकारिता
            सुनिश्चित गर्न कोल्ड चेन व्यवस्थापनमा सुधार ल्याउने र नियमित अनुगमन
            गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">७.</span>
          <div>
            <strong>डिजिटल खोप रजिस्ट्री:</strong> खोप सेवाको रेकर्ड व्यवस्थापन
            सुधार गर्न र फलोअप प्रणालीलाई सुदृढ बनाउन डिजिटल प्रणालीमा आधारित
            खोप रजिस्ट्री पद्धतिको विकास गर्ने।
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          खोप सेवाको समष्टिगत विश्लेषण
        </h3>

        <div className="space-y-4 text-sm">
          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>कभरेज स्थिति:</strong> बुद्धशान्ति गाउँपालिकामा आर्थिक
              वर्ष {fiscalYearLabel} मा समग्र खोप कभरेज{" "}
              {localizeNumber(immunizationQualityIndex.toFixed(1), "ne")}% रहेको
              छ, जुन राष्ट्रिय औसतको{" "}
              {immunizationQualityIndex >= 90 ? "नजिक" : "तुलनामा कमजोर"}{" "}
              अवस्थामा छ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>ड्रपआउट अवस्था:</strong> DPT-HepB-Hib ड्रपआउट दर{" "}
              {localizeNumber(dptDropoutRate.toFixed(1), "ne")}% रहेको छ, जुन{" "}
              {dptDropoutRate <= 5
                ? "स्वीकार्य सीमाभित्र छ"
                : "स्वीकार्य सीमाभन्दा माथि छ र यसमा सुधार गर्नु आवश्यक छ"}
              ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>पूर्ण खोप कभरेज:</strong> गाउँपालिकामा पूर्ण खोप कभरेज{" "}
              {localizeNumber(fullyImmunizedValue.toFixed(1), "ne")}% रहेको छ,
              जुन गत वर्षको तुलनामा{" "}
              {fullyImmunizedChange >= 0
                ? localizeNumber(fullyImmunizedChange.toFixed(1), "ne") +
                  "% ले बढेको"
                : localizeNumber(
                    Math.abs(fullyImmunizedChange).toFixed(1),
                    "ne",
                  ) + "% ले घटेको"}{" "}
              छ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>सुधार आवश्यक क्षेत्रहरू:</strong> खोप कभरेज बढाउन, ड्रपआउट
              दर घटाउन, र खोप खेर जाने दरमा सुधार ल्याउन समन्वित प्रयास आवश्यक
              छ।
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
