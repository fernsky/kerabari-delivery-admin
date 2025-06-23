import { localizeNumber } from "@/lib/utils/localize-number";
import AntenatalCareChart from "./charts/antenatal-care-chart";
import DeliveryServicesChart from "./charts/delivery-services-chart";
import PostnatalCareChart from "./charts/postnatal-care-chart";
import NewbornHealthChart from "./charts/newborn-health-chart";
import SafeMotherhoodTrendChart from "./charts/safe-motherhood-trend-chart";
import MaternalHealthGaugeChart from "./charts/maternal-health-gauge-chart";

interface SafeMotherhoodIndicatorsChartsProps {
  latestYear: number;
  antenatalData: any[];
  deliveryData: any[];
  postnatalData: any[];
  newbornHealthData: any[];
  trendData: any[];
  indicatorLabels: Record<string, string>;
  institutionalDeliveries: number;
  ancCheckups: number;
  pncVisits: number;
  newbornCare: number;
  maternalHealthIndex: number;
}

export default function SafeMotherhoodIndicatorsCharts({
  latestYear,
  antenatalData,
  deliveryData,
  postnatalData,
  newbornHealthData,
  trendData,
  indicatorLabels,
  institutionalDeliveries,
  ancCheckups,
  pncVisits,
  newbornCare,
  maternalHealthIndex,
}: SafeMotherhoodIndicatorsChartsProps) {
  // Calculate maternal health status based on the quality index
  const maternalHealthStatus = 
    maternalHealthIndex >= 90 ? "उत्कृष्ट (Excellent)" :
    maternalHealthIndex >= 80 ? "राम्रो (Good)" :
    maternalHealthIndex >= 70 ? "सन्तोषजनक (Satisfactory)" :
    "सुधार आवश्यक (Needs Improvement)";

  return (
    <>
      {/* Key Maternal Health Statistics Card */}
      <div 
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content={`Key Safe Motherhood Indicators for Year ${latestYear}`}
        />

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">संस्थागत प्रसूति दर</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(institutionalDeliveries.toFixed(1), "ne")}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                कुल प्रसूति मध्ये स्वास्थ्य संस्थामा
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">नियमित गर्भवती जाँच</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(ancCheckups.toFixed(1), "ne")}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                प्रोटोकल अनुसार ४ पटक ANC जाँच
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">सुत्केरी जाँच कभरेज</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(pncVisits.toFixed(1), "ne")}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                सुत्केरी पछिको २ पटक घरभेट
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">मातृ स्वास्थ्य सूचकाङ्क</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {localizeNumber(maternalHealthIndex.toFixed(1), "ne")}
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              <span>
                अवस्था: {maternalHealthStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Maternal Health Gauge Chart */}
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-card">
          <h3 className="text-xl font-semibold mb-6">सुरक्षित मातृत्व सेवाको अवस्था</h3>
          <div className="h-[250px]">
            <MaternalHealthGaugeChart
              institutionalDeliveries={institutionalDeliveries}
              ancCheckups={ancCheckups}
              pncVisits={pncVisits}
              newbornCare={newbornCare}
            />
          </div>
        </div>
      </div>

      {/* Safe Motherhood Trend Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="safe-motherhood-trends"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Safe Motherhood Trends in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Annual trends of key safe motherhood indicators over multiple years"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सुरक्षित मातृत्व सूचकहरूको प्रवृत्ति
          </h3>
          <p className="text-sm text-muted-foreground">
            वार्षिक प्रमुख सुरक्षित मातृत्व सूचकहरूको प्रवृत्ति विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[450px]">
            <SafeMotherhoodTrendChart 
              trendData={trendData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>
      </div>

      {/* Antenatal Care Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="antenatal-care"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content={`Antenatal Care Indicators in Khajura for ${latestYear}`}
        />
        <meta
          itemProp="description"
          content="Coverage rates for various antenatal care services"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            गर्भवती स्वास्थ्य सेवा
          </h3>
          <p className="text-sm text-muted-foreground">
            वर्ष {localizeNumber(latestYear, "ne")} मा विभिन्न गर्भवती स्वास्थ्य सेवाको कभरेज
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <AntenatalCareChart 
              antenatalData={antenatalData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2 text-left">विवरण</th>
                  <th className="border p-2 text-right">कभरेज (%)</th>
                </tr>
              </thead>
              <tbody>
                {antenatalData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="border p-2">
                      {indicatorLabels[item.indicator] || item.indicator}
                    </td>
                    <td className="border p-2 text-right">
                      <span className={`font-medium ${
                        item.value >= 90 ? "text-green-600" :
                        item.value >= 80 ? "text-blue-600" :
                        item.value >= 70 ? "text-amber-600" : 
                        "text-red-600"
                      }`}>
                        {localizeNumber(parseFloat(item.value).toFixed(1), "ne")}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delivery Services Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="institutional-delivery"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content={`Delivery Services in Khajura for ${latestYear}`}
        />
        <meta
          itemProp="description"
          content="Institutional delivery and related indicators"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            संस्थागत प्रसूति सेवा
          </h3>
          <p className="text-sm text-muted-foreground">
            वर्ष {localizeNumber(latestYear, "ne")} मा संस्थागत प्रसूति र सम्बन्धित सूचकहरू
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <DeliveryServicesChart 
              deliveryData={deliveryData}
              indicatorLabels={indicatorLabels}
            />
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2 text-left">विवरण</th>
                  <th className="border p-2 text-right">कभरेज (%)</th>
                </tr>
              </thead>
              <tbody>
                {deliveryData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="border p-2">
                      {indicatorLabels[item.indicator] || item.indicator}
                    </td>
                    <td className="border p-2 text-right">
                      <span className={`font-medium ${
                        item.value >= 90 ? "text-green-600" :
                        item.value >= 80 ? "text-blue-600" :
                        item.value >= 70 ? "text-amber-600" : 
                        "text-red-600"
                      }`}>
                        {localizeNumber(parseFloat(item.value).toFixed(1), "ne")}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Postnatal Care and Newborn Health Charts */}
      <div 
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Postnatal Care */}
        <div
          className="border rounded-lg shadow-sm overflow-hidden bg-card"
          id="postnatal-care"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Postnatal Care Indicators in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              सुत्केरी स्वास्थ्य सेवा
            </h3>
            <p className="text-sm text-muted-foreground">
              सुत्केरी अवस्थामा प्रदान गरिने स्वास्थ्य सेवा
            </p>
          </div>

          <div className="p-6">
            <div className="h-[400px]">
              <PostnatalCareChart
                postnatalData={postnatalData}
                indicatorLabels={indicatorLabels}
              />
            </div>
          </div>
        </div>

        {/* Newborn Health */}
        <div
          className="border rounded-lg shadow-sm overflow-hidden bg-card"
          id="newborn-health"
          itemScope
          itemType="https://schema.org/Dataset"
        >
          <meta
            itemProp="name"
            content="Newborn Health Indicators in Khajura"
          />

          <div className="border-b px-4 py-3">
            <h3 className="text-xl font-semibold" itemProp="headline">
              नवजात शिशु स्वास्थ्य
            </h3>
            <p className="text-sm text-muted-foreground">
              नवजात शिशु स्वास्थ्य सम्बन्धी सूचकहरू
            </p>
          </div>

          <div className="p-6">
            <div className="h-[400px]">
              <NewbornHealthChart
                newbornHealthData={newbornHealthData}
                indicatorLabels={indicatorLabels}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
