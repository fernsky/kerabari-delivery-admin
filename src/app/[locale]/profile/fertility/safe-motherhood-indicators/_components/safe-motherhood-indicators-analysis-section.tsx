import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SafeMotherhoodIndicatorsAnalysisSectionProps {
  latestYear: number;
  antenatalData: any[];
  deliveryData: any[];
  postnatalData: any[];
  newbornHealthData: any[];
  indicatorLabels: Record<string, string>;
  institutionalDeliveries: number;
  ancCheckups: number;
  pncVisits: number;
  maternalHealthIndex: number;
}

export default function SafeMotherhoodIndicatorsAnalysisSection({
  latestYear,
  antenatalData,
  deliveryData,
  postnatalData,
  newbornHealthData,
  indicatorLabels,
  institutionalDeliveries,
  ancCheckups,
  pncVisits,
  maternalHealthIndex,
}: SafeMotherhoodIndicatorsAnalysisSectionProps) {
  // Find indicators needing improvement
  const findLowCoverageIndicators = (data: any[], threshold = 85) => {
    return data
      .filter((item) => parseFloat(item.value) < threshold)
      .map((item) => ({
        indicator: item.indicator,
        value: parseFloat(item.value),
        label: indicatorLabels[item.indicator],
      }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 3);
  };

  // Find key issues that need attention
  const lowANCIndicators = findLowCoverageIndicators(antenatalData);
  const lowDeliveryIndicators = findLowCoverageIndicators(deliveryData);
  const lowPNCIndicators = findLowCoverageIndicators(postnatalData);

  // Find newborn health challenges
  const newbornHealthChallenges = newbornHealthData
    .filter((item) =>
      [
        "NEWBORNS_LOW_BIRTH_WEIGHT",
        "NEONATES_BIRTH_ASPHYXIA",
        "PRETERM_BIRTH",
      ].includes(item.indicator),
    )
    .map((item) => ({
      indicator: item.indicator,
      value: parseFloat(item.value),
      label: indicatorLabels[item.indicator],
    }));

  return (
    <>
      <div className="pl-6 space-y-4">
        <div className="flex">
          <span className="font-bold mr-2">१.</span>
          <div>
            <strong>संस्थागत प्रसूति बढाउने:</strong>
            {institutionalDeliveries < 85 ? (
              <span>
                {" "}
                वर्तमान{" "}
                {localizeNumber(institutionalDeliveries.toFixed(1), "ne")}%
                संस्थागत प्रसूति दरलाई बढाउनका लागि घरमा हुने सुत्केरीका कारणहरू
                पहिचान गरी समाधान गर्ने र स्वास्थ्य संस्थाहरूमा प्रसूति सेवाको
                गुणस्तर बढाउने।
              </span>
            ) : (
              <span>
                {" "}
                गुणस्तरीय प्रसूति सेवालाई निरन्तरता दिने र थप सुधार गर्न
                सम्बन्धित स्वास्थ्यकर्मीहरूको क्षमता विकास गर्ने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">२.</span>
          <div>
            <strong>गर्भवती जाँचको पहुँच र गुणस्तर सुधार:</strong>
            {ancCheckups < 85 ? (
              <span>
                {" "}
                नियमित गर्भवती जाँचको कभरेज{" "}
                {localizeNumber(ancCheckups.toFixed(1), "ne")}% बाट बढाउन
                प्रोटोकल अनुसारको सम्पूर्ण ४ पटक जाँचको महत्वबारे जनचेतना बढाउने
                र सेवा प्रवाहमा सुधार गर्ने।
              </span>
            ) : (
              <span>
                {" "}
                गर्भवती जाँचको उच्च कभरेजलाई कायम राख्दै वितरण गरिने आइरन, फोलिक
                एसिड र क्याल्सियम जस्ता पोषण सम्बन्धी पूरकहरूको उपभोगमा वृद्धि
                गर्ने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">३.</span>
          <div>
            <strong>सुत्केरी सेवा प्रवर्द्धन:</strong>
            {pncVisits < 85 ? (
              <span>
                {" "}
                सुत्केरी पछिको जाँच र घरभेट कभरेज{" "}
                {localizeNumber(pncVisits.toFixed(1), "ne")}% बाट बढाउन महिला
                स्वास्थ्य स्वयंसेविकाहरूको परिचालन र सुत्केरी महिलाहरूको फलोअप
                प्रणालीलाई सुदृढ बनाउने।
              </span>
            ) : (
              <span>
                {" "}
                सुत्केरी जाँचको उच्च कभरेजलाई कायम राख्दै सेवाको गुणस्तरमा थप
                ध्यान दिने र सुत्केरी जटिलताहरूको समयमै पहिचान तथा व्यवस्थापन
                गर्ने क्षमता विकास गर्ने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">४.</span>
          <div>
            <strong>नवजात शिशु स्वास्थ्य सुधार:</strong> नवजात शिशुको जन्मपछिको
            स्याहार सुधार गर्न क्लोरहेक्जिडिन (CHX) मलम प्रयोग, नियमित जाँच र
            स्तनपानलाई प्रोत्साहन गर्ने। साथै जन्मदा कम तौल, जन्मदा निसास्सिएको
            र समय नपुगी जन्मिने बच्चाहरूको समयमै पहिचान र उपचारको व्यवस्था सुदृढ
            बनाउने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">५.</span>
          <div>
            <strong>किशोरी गर्भधारण न्यूनीकरण:</strong> २० वर्ष मुनिका
            किशोरीहरूको गर्भधारण र सुत्केरी दर घटाउन किशोरी स्वास्थ्य शिक्षा,
            परिवार नियोजन सेवाको पहुँच, र जनचेतनामूलक कार्यक्रमहरू संचालन गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">६.</span>
          <div>
            <strong>जटिलता व्यवस्थापन क्षमता बढाउने:</strong> गर्भावस्था,
            प्रसूति र सुत्केरी अवस्थामा हुने जटिलताहरू जस्तै रक्तश्राव,
            प्रिइक्लाम्प्सिया, इक्लाम्प्सिया, सेप्सिस आदिको प्रभावकारी
            व्यवस्थापनका लागि स्वास्थ्यकर्मीहरूको क्षमता विकास गर्ने र प्रेषण
            प्रणाली सुदृढ बनाउने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">७.</span>
          <div>
            <strong>सामुदायिक सहभागिता बढाउने:</strong> सुरक्षित मातृत्व सेवाको
            पहुँच र उपयोगिता बढाउन स्थानीय नेतृत्व, आमा समूह र महिला स्वास्थ्य
            स्वयंसेविकाहरूको परिचालन गरी सामुदायिक स्वामित्व बढाउने।
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          सुरक्षित मातृत्व सेवाको समष्टिगत विश्लेषण
        </h3>

        <div className="space-y-4 text-sm">
          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>समग्र अवस्था:</strong> बुद्धशान्ति गाउँपालिकामा वर्ष{" "}
              {localizeNumber(latestYear, "ne")} मा सुरक्षित मातृत्व सेवाको
              गुणस्तर सूचकाङ्क{" "}
              {localizeNumber(maternalHealthIndex.toFixed(1), "ne")} रहेको छ,
              जुन {maternalHealthIndex >= 80 ? "सन्तोषजनक" : "सुधार आवश्यक"}{" "}
              अवस्थामा छ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>गर्भवती सेवा:</strong> गर्भवती जाँच सेवा मध्ये कम्तीमा
              एकपटक जाँच गराउने दर उच्च भएपनि प्रोटोकल अनुसारको नियमित जाँच र
              पोषण पूरक वितरण तथा उपभोगमा सुधार गर्नुपर्ने देखिन्छ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>संस्थागत प्रसूति:</strong> संस्थागत प्रसूति दर{" "}
              {localizeNumber(institutionalDeliveries.toFixed(1), "ne")}% रहेको
              छ, जुन अझै बढाउनुपर्ने अवस्थामा छ। यसका लागि प्रसूति सेवाको
              गुणस्तर र पहुँचमा सुधार ल्याउनुपर्छ।
            </span>
          </p>

          <p className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <strong>सुत्केरी र नवजात शिशु स्वास्थ्य:</strong> सुत्केरी जाँच र
              नवजात शिशु स्वास्थ्य सेवालाई थप प्रभावकारी बनाउन सुत्केरी घरभेट,
              नवजात शिशु स्याहार र जटिलता व्यवस्थापनमा ध्यान दिनु आवश्यक छ।
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
