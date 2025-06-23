import { localizeNumber } from "@/lib/utils/localize-number";
import ElectricitySourcePieChart from "./charts/electricity-source-pie-chart";
import ElectricitySourceBarChart from "./charts/electricity-source-bar-chart";
import ElectricitySourceComparisonChart from "./charts/electricity-source-comparison-chart";
import WardElectricitySourcePieCharts from "./charts/ward-electricity-source-pie-charts";

interface WardWiseElectricitySourceChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  sourceTypeTotals: Record<string, number>;
  sourceMap: Record<string, string>;
  sourceTypePercentages: Record<string, number>;
  wardModernSourcePercentages: Array<{
    wardNumber: number;
    percentage: number;
    households: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  ELECTRICITY_SOURCE_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  electricityAccessIndex: number;
  modernSources: string[];
  traditionalSources: string[];
  modernSourcePercentage: number;
}

export default function WardWiseElectricitySourceCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  sourceTypeTotals,
  sourceMap,
  sourceTypePercentages,
  wardModernSourcePercentages,
  bestWard,
  worstWard,
  ELECTRICITY_SOURCE_CATEGORIES,
  electricityAccessIndex,
  modernSources,
  traditionalSources,
  modernSourcePercentage,
}: WardWiseElectricitySourceChartsProps) {
  // Calculate source categories by type for grouping in visualizations
  const categorizedSources = {
    modern: {
      name: "आधुनिक स्रोत",
      nameEn: "Modern Sources",
      types: modernSources,
      percentage: modernSourcePercentage,
      total: modernSources.reduce((sum, source) => sum + (sourceTypeTotals[source] || 0), 0),
      color: "#1E88E5", // Blue
    },
    traditional: {
      name: "परम्परागत स्रोत",
      nameEn: "Traditional Sources",
      types: traditionalSources,
      percentage: traditionalSources.reduce((sum, source) => sum + (sourceTypePercentages[source] || 0), 0),
      total: traditionalSources.reduce((sum, source) => sum + (sourceTypeTotals[source] || 0), 0),
      color: "#F44336", // Red
    },
    other: {
      name: "अन्य स्रोत",
      nameEn: "Other Sources",
      types: ["BIOGAS"],
      percentage: (sourceTypePercentages.BIOGAS || 0),
      total: (sourceTypeTotals.BIOGAS || 0),
      color: "#43A047", // Green
    },
  };

  return (
    <>
      {/* Overall electricity source distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Electricity Source Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of electricity source types with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            विद्युतको स्रोत अनुसार वितरण
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
              <ElectricitySourcePieChart
                pieChartData={pieChartData}
                ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
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
                    <th className="border p-2 text-left">विद्युतको स्रोत</th>
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
            विद्युतको स्रोतको वितरण
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
        id="ward-wise-electricity-source-usage"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Electricity Source Usage in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of electricity source types across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विद्युतको स्रोतको प्रयोग
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न प्रकारको विद्युतको स्रोतको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ElectricitySourceBarChart
              wardWiseData={wardWiseData}
              ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
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
          content="Modern Electricity Source Usage Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of modern electricity source usage across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत आधुनिक विद्युत स्रोत प्रयोग
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा आधुनिक विद्युत स्रोत (केन्द्रीय विद्युत प्रणाली, सौर्य ऊर्जा) प्रयोग गर्ने घरधुरीको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <ElectricitySourceComparisonChart
              wardModernSourcePercentages={wardModernSourcePercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
              modernSourcePercentage={modernSourcePercentage}
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
          content="Ward-wise Electricity Source Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of electricity source usage by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत विद्युतको स्रोतको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विद्युतको स्रोतको प्रयोगको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  {Object.keys(ELECTRICITY_SOURCE_CATEGORIES).map(key => (
                    <th key={key} className="border p-2 text-right">
                      {ELECTRICITY_SOURCE_CATEGORIES[key as keyof typeof ELECTRICITY_SOURCE_CATEGORIES].name}
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
                      {Object.keys(ELECTRICITY_SOURCE_CATEGORIES).map(key => {
                        const sourceName = ELECTRICITY_SOURCE_CATEGORIES[key as keyof typeof ELECTRICITY_SOURCE_CATEGORIES].name;
                        const value = item[sourceName] || 0;
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
                  {Object.keys(ELECTRICITY_SOURCE_CATEGORIES).map(key => {
                    const value = sourceTypeTotals[key] || 0;
                    const percentage = sourceTypePercentages[key]?.toFixed(2) || "0.00";
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
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत विद्युतको स्रोतको वितरण</h4>
          <WardElectricitySourcePieCharts
            wardWiseData={wardWiseData}
            ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
          />
        </div>
      </div>
    </>
  );
}
