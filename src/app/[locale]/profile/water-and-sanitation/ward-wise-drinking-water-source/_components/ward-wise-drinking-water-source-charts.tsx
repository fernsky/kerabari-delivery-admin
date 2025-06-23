import { localizeNumber } from "@/lib/utils/localize-number";
import DrinkingWaterSourcePieChart from "./charts/drinking-water-source-pie-chart";
import DrinkingWaterSourceBarChart from "./charts/drinking-water-source-bar-chart";
import DrinkingWaterSourceComparisonChart from "./charts/drinking-water-source-comparison-chart";
import WardDrinkingWaterSourcePieCharts from "./charts/ward-drinking-water-source-pie-charts";

interface WardWiseDrinkingWaterSourceChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  waterSourceTotals: Record<string, number>;
  sourceMap: Record<string, string>;
  waterSourceGroupTotals: Record<string, number>;
  waterSourceGroupPercentages: Record<string, number>;
  wardWisePipedWaterPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  WATER_SOURCE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    sources: string[];
  }>;
}

export default function WardWiseDrinkingWaterSourceCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  waterSourceTotals,
  sourceMap,
  waterSourceGroupTotals,
  waterSourceGroupPercentages,
  wardWisePipedWaterPercentage,
  highestPipedWaterWard,
  lowestPipedWaterWard,
  WATER_SOURCE_GROUPS,
}: WardWiseDrinkingWaterSourceChartsProps) {
  return (
    <>
      {/* Overall drinking water source distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Drinking Water Source Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of drinking water sources with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खानेपानीको स्रोत अनुसार घरधुरी वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <DrinkingWaterSourcePieChart
                pieChartData={pieChartData}
                WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
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
                    <th className="border p-2 text-left">खानेपानीको स्रोत</th>
                    <th className="border p-2 text-right">घरधुरी</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber((index + 1).toString(), "ne")}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
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
            खानेपानी स्रोत विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-drinking-water-sources"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Drinking Water Sources in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of drinking water sources across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार खानेपानीका स्रोतहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न खानेपानीका स्रोतहरू प्रयोग गर्ने घरधुरीहरूको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <DrinkingWaterSourceBarChart
              wardWiseData={wardWiseData}
              WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Piped Water Access Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of piped water access rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत पाइप खानेपानी पहुँच दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा पाइपको पानी प्रयोग गर्ने घरधुरीहरूको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <DrinkingWaterSourceComparisonChart
              wardWisePipedWaterPercentage={wardWisePipedWaterPercentage}
              highestPipedWaterWard={highestPipedWaterWard}
              lowestPipedWaterWard={lowestPipedWaterWard}
              WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Drinking Water Source Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of drinking water sources by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत खानेपानीका स्रोतहरूको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार खानेपानीका स्रोतहरूको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  {Object.keys(WATER_SOURCE_GROUPS).map(key => (
                    <th key={key} className="border p-2 text-right">
                      {WATER_SOURCE_GROUPS[key as keyof typeof WATER_SOURCE_GROUPS].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(WATER_SOURCE_GROUPS).map(key => {
                        const groupName = WATER_SOURCE_GROUPS[key as keyof typeof WATER_SOURCE_GROUPS].name;
                        const value = item[groupName] || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
                        return (
                          <td key={key} className="border p-2 text-right">
                            {localizeNumber(value.toLocaleString(), "ne")}
                            <div className="text-xs text-muted-foreground">
                              ({localizeNumber(percentage, "ne")}%)
                            </div>
                          </td>
                        );
                      })}
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
                  {Object.keys(WATER_SOURCE_GROUPS).map(key => {
                    const value = waterSourceGroupTotals[key];
                    const percentage = waterSourceGroupPercentages[key].toFixed(2);
                    return (
                      <td key={key} className="border p-2 text-right">
                        {localizeNumber(value.toLocaleString(), "ne")}
                        <div className="text-xs">
                          ({localizeNumber(percentage, "ne")}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत खानेपानीका स्रोतहरूको वितरण</h4>
          <WardDrinkingWaterSourcePieCharts
            wardWiseData={wardWiseData}
            WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
          />
        </div>
      </div>
    </>
  );
}
