import { localizeNumber } from "@/lib/utils/localize-number";
import { ImmunizationFiscalYear } from "@/server/api/routers/profile/health/immunization-indicators.schema";
import ImmunizationCoverageChart from "./charts/immunization-coverage-chart";
import ImmunizationTrendChart from "./charts/immunization-trend-chart";
import VaccineDropoutChart from "./charts/vaccine-dropout-chart";
import VaccineWastageChart from "./charts/vaccine-wastage-chart";
import KeyIndicatorsGaugeChart from "./charts/key-indicators-gauge-chart";

interface ImmunizationIndicatorsChartsProps {
  fiscalYearLabels: Record<string, string>;
  currentFiscalYear: ImmunizationFiscalYear;
  coverageData: any[];
  dropoutData: any[];
  wastageData: any[];
  trendData: any[];
  indicatorLabels: Record<string, string>;
  fullyImmunizedValue: number;
  fullyImmunizedChange: number;
  dpt3Value: number;
  dptDropoutRate: number;
  immunizationQualityIndex: number;
  sessionIndicators: string[];
  pregnantWomenIndicators: string[];
  latestImmunizationData: any[];
}

export default function ImmunizationIndicatorsCharts({
  fiscalYearLabels,
  currentFiscalYear,
  coverageData,
  dropoutData,
  wastageData,
  trendData,
  indicatorLabels,
  fullyImmunizedValue,
  fullyImmunizedChange,
  dpt3Value,
  dptDropoutRate,
  immunizationQualityIndex,
  sessionIndicators,
  pregnantWomenIndicators,
  latestImmunizationData,
}: ImmunizationIndicatorsChartsProps) {
  // Filter session indicators and pregnant women indicators data
  const sessionData = latestImmunizationData.filter(
    item => sessionIndicators.includes(item.indicator)
  );

  const pregnantWomenData = latestImmunizationData.filter(
    item => pregnantWomenIndicators.includes(item.indicator)
  );

  // Calculate immunization status based on the quality index
  const immunizationStatus = 
    immunizationQualityIndex >= 90 ? "उत्कृष्ट (Excellent)" :
    immunizationQualityIndex >= 80 ? "राम्रो (Good)" :
    immunizationQualityIndex >= 70 ? "सन्तोषजनक (Satisfactory)" :
    "सुधार आवश्यक (Needs Improvement)";

  return (
    <>
      {/* Key Immunization Statistics Card */}
      <div 
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content={`Key Immunization Indicators for Fiscal Year ${fiscalYearLabels[currentFiscalYear]}`}
        />

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">पूर्ण खोप कभरेज</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(fullyImmunizedValue.toFixed(1), "ne")}%
            </p>
            <div className="flex items-center mt-1">
              <span 
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  fullyImmunizedChange >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {fullyImmunizedChange >= 0 ? "+" : ""}
                {localizeNumber(fullyImmunizedChange.toFixed(1), "ne")}%
              </span>
              <span className="text-xs text-muted-foreground ml-1.5">
                गत वर्षको तुलनामा
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            <span className="english-font">DPT-HepB-Hib3</span> कभरेज
          </h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(dpt3Value.toFixed(1), "ne")}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                एक वर्षमुनिका बालबालिकाहरूमा
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            <span className="english-font">DPT</span> ड्रपआउट दर
          </h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(dptDropoutRate.toFixed(1), "ne")}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                <span className="english-font">DPT-HepB-Hib1</span> देखि <span className="english-font">DPT-HepB-Hib3</span> सम्म
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">खोप गुणस्तर सूचकाङ्क</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(immunizationQualityIndex.toFixed(1), "ne")}
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                अवस्था: {immunizationStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Immunization Coverage Chart */}
      <div 
        className="mt-8 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content={`Immunization Coverage Rates in Khajura for ${fiscalYearLabels[currentFiscalYear]}`}
        />
        <meta
          itemProp="description"
          content="Coverage rates for various vaccines in the National Immunization Program"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खोप कभरेज दर
          </h3>
          <p className="text-sm text-muted-foreground">
            आर्थिक वर्ष {fiscalYearLabels[currentFiscalYear]} मा विभिन्न खोप सेवाको कभरेज
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ImmunizationCoverageChart 
              coverageData={coverageData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-3 text-left">खोप विवरण</th>
                  <th className="border p-3 text-center w-32">कभरेज (%)</th>
                </tr>
              </thead>
              <tbody>
                {coverageData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="border p-3">
                      <div className="flex flex-col">
                       
                        <span className="text-sm">
                          {indicatorLabels[item.indicator] || ""}
                        </span>
                      </div>
                    </td>
                    <td className="border p-3 text-center">
                      <span className={`font-bold text-lg ${
                        item.value >= 90 ? "text-green-600" :
                        item.value >= 80 ? "text-blue-600" :
                        item.value >= 70 ? "text-amber-600" : 
                        "text-red-600"
                      }`}>
                        {localizeNumber(item.value?.toFixed(1) || "0", "ne")}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Coverage Trend Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="immunization-coverage-trends"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Immunization Coverage Trends in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Annual trends of key immunization indicators over multiple fiscal years"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खोप कभरेज प्रवृत्ति
          </h3>
          <p className="text-sm text-muted-foreground">
            वार्षिक प्रमुख खोप सूचकहरूको प्रवृत्ति विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[450px]">
            <ImmunizationTrendChart 
              trendData={trendData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>
      </div>

      {/* Key Indicators Gauge */}
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-card">
          <h3 className="text-xl font-semibold mb-6">प्रमुख खोप सेवा सूचक अवस्था</h3>
          <div className="h-[250px]">
            <KeyIndicatorsGaugeChart
              fullyImmunizedValue={fullyImmunizedValue}
              dpt3Value={dpt3Value}
              dptDropoutRate={dptDropoutRate}
            />
          </div>
        </div>
      </div>

      {/* Session and Coverage Data */}
      <div 
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Session Data */}
        <div
          className="border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Immunization Session Indicators in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              खोप सत्र सञ्चालन
            </h3>
            <p className="text-sm text-muted-foreground">
              नियोजित खोप सत्र सञ्चालन दर
            </p>
          </div>

          <div className="p-4">
            {sessionData.map((item, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">
                    {indicatorLabels[item.indicator]?.split(" (")[0] || item.indicator}
                  </span>
                  <span className="font-medium">
                    {localizeNumber(item.value?.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.value >= 90 ? "bg-green-500" :
                      item.value >= 80 ? "bg-blue-500" :
                      item.value >= 70 ? "bg-amber-500" : 
                      "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, item.value || 0))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pregnant Women's Immunization */}
        <div
          className="border rounded-lg shadow-sm overflow-hidden bg-card"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Immunization Coverage for Pregnant Women in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              गर्भवती महिलाको खोप कभरेज
            </h3>
            <p className="text-sm text-muted-foreground">
              टी.डी. खोप कभरेज दर
            </p>
          </div>

          <div className="p-4">
            {pregnantWomenData.map((item, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">
                    {indicatorLabels[item.indicator]?.split(" (")[0] || item.indicator}
                  </span>
                  <span className="font-medium">
                    {localizeNumber(item.value?.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.value >= 90 ? "bg-green-500" :
                      item.value >= 80 ? "bg-blue-500" :
                      item.value >= 70 ? "bg-amber-500" : 
                      "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, item.value || 0))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccine Dropout Rates */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="vaccine-dropout-rates"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Vaccine Dropout Rates in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Analysis of vaccine dropout rates for different vaccine series"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खोप ड्रपआउट दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न खोप श्रृङ्खलाहरूको ड्रपआउट दर
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <VaccineDropoutChart
              dropoutData={dropoutData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>
      </div>

      {/* Vaccine Wastage Rates */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="vaccine-wastage-rates"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Vaccine Wastage Rates in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Analysis of vaccine wastage rates for different vaccines"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खोप खेर जाने दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न खोपहरूको खेर जाने दर
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <VaccineWastageChart
              wastageData={wastageData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>
      </div>
    </>
  );
}
