import { localizeNumber } from "@/lib/utils/localize-number";
import WaterPurificationPieChart from "./charts/water-purification-pie-chart";
import WaterPurificationBarChart from "./charts/water-purification-bar-chart";
import WardWaterPurificationPieCharts from "./charts/ward-water-purification-pie-charts";
import WaterTreatmentComparisonChart from "./charts/water-treatment-comparison-chart";

interface WaterPurificationChartsProps {
  overallSummary: Array<{
    waterPurification: string;
    waterPurificationName: string;
    households: number;
  }>;
  totalHouseholds: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  waterPurificationData: Array<{
    id?: string;
    wardNumber: number;
    waterPurification: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonMethod: string;
    mostCommonMethodName: string;
    mostCommonMethodHouseholds: number;
    mostCommonMethodPercentage: string;
    treatingHouseholds: number;
    treatingPercentage: string;
    methodPercentages: Record<string, string>;
  }>;
  methodMap: Record<string, string>;
  WATER_PURIFICATION_COLORS: Record<string, string>;
  highestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  lowestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  safetyIndex: number;
}

export default function WaterPurificationCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  waterPurificationData,
  wardWiseAnalysis,
  methodMap,
  WATER_PURIFICATION_COLORS,
  highestTreatmentWard,
  lowestTreatmentWard,
  safetyIndex,
}: WaterPurificationChartsProps) {
  return (
    <>
      {/* Overall water purification distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Water Purification Methods in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Water purification method distribution of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            पानी शुद्धिकरण विधि अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <WaterPurificationPieChart
                pieChartData={pieChartData}
                methodMap={methodMap}
                WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">पानी शुद्धिकरण विधि</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.waterPurificationName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.households.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.households / totalHouseholds) * 100).toFixed(2), "ne")}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            पानी शुद्धिकरण विधि विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      WATER_PURIFICATION_COLORS[
                        item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.waterPurificationName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.households / totalHouseholds) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.households / totalHouseholds) * 100}%`,
                        backgroundColor:
                          WATER_PURIFICATION_COLORS[
                            item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-water-purification"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Water Purification in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Water purification methods distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार पानी शुद्धिकरण विधिको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र शुद्धिकरण विधि अनुसार घरधुरी वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WaterPurificationBarChart
              wardWiseData={wardWiseData}
              WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
              methodMap={methodMap}
            />
          </div>
        </div>
      </div>

      {/* Water treatment comparison across wards */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Water Treatment Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of water treatment rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत पानी उपचार दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा पानी शुद्धिकरण गर्ने घरधुरीहरूको प्रतिशत
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <WaterTreatmentComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              highestTreatmentWard={highestTreatmentWard}
              lowestTreatmentWard={lowestTreatmentWard}
              WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Water Purification Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common water purification methods by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत पानी शुद्धिकरण विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार पानी शुद्धिकरणको प्रमुख विधिहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2">प्रमुख शुद्धिकरण विधि</th>
                  <th className="border p-2 text-right">प्रमुख विधिको घरधुरी</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                  <th className="border p-2 text-right">पानी उपचार दर</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2">
                        {item.mostCommonMethodName}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonMethodHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonMethodPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.treatingPercentage, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2">
                    {overallSummary.length > 0 ? overallSummary[0].waterPurificationName : ""}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary[0]?.households || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary[0]?.households || 0) / totalHouseholds * 100).toFixed(2), "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      (
                        (overallSummary
                          .filter(item => item.waterPurification !== 'NO_ANY_FILTERING')
                          .reduce((sum, item) => sum + item.households, 0) / totalHouseholds) * 100
                      ).toFixed(2),
                      "ne"
                    )}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पानी शुद्धिकरण विधिको वितरण</h4>
          <WardWaterPurificationPieCharts
            wardNumbers={wardNumbers}
            waterPurificationData={waterPurificationData}
            methodMap={methodMap}
            WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
          />
        </div>
      </div>
    </>
  );
}
