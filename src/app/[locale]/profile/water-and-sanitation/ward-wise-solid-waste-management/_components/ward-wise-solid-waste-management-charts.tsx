import { localizeNumber } from "@/lib/utils/localize-number";
import SolidWasteManagementPieChart from "./charts/solid-waste-management-pie-chart";
import SolidWasteManagementBarChart from "./charts/solid-waste-management-bar-chart";
import SolidWasteManagementComparisonChart from "./charts/solid-waste-management-comparison-chart";
import WardSolidWasteManagementPieCharts from "./charts/ward-solid-waste-management-pie-charts";

interface WardWiseSolidWasteManagementChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  wasteManagementTotals: Record<string, number>;
  sourceMap: Record<string, string>;
  wasteManagementPercentages: Record<string, number>;
  wardWiseHomeCollectionPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_COLORS: Record<string, string>;
}

export default function WardWiseSolidWasteManagementCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  wasteManagementTotals,
  sourceMap,
  wasteManagementPercentages,
  wardWiseHomeCollectionPercentage,
  highestHomeCollectionWard,
  lowestHomeCollectionWard,
  WASTE_MANAGEMENT_COLORS,
}: WardWiseSolidWasteManagementChartsProps) {
  return (
    <>
      {/* Overall solid waste management distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Solid Waste Management Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of solid waste management methods with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            फोहोरमैला व्यवस्थापन विधि अनुसार घरधुरी वितरण
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
              <SolidWasteManagementPieChart
                pieChartData={pieChartData}
                WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
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
                    <th className="border p-2 text-left">फोहोरमैला व्यवस्थापन विधि</th>
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
            फोहोरमैला व्यवस्थापन विधि विवरण
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
        id="ward-wise-solid-waste-management"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Solid Waste Management in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of solid waste management methods across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार फोहोरमैला व्यवस्थापन
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न फोहोरमैला व्यवस्थापन विधिहरू प्रयोग गर्ने घरधुरीहरूको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <SolidWasteManagementBarChart
              wardWiseData={wardWiseData}
              WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
              sourceMap={sourceMap}
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
          content="Home Waste Collection Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of home waste collection rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत घरमै फोहोर संकलन दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा घरमै फोहोर संकलन विधि प्रयोग गर्ने घरधुरीहरूको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <SolidWasteManagementComparisonChart
              wardWiseHomeCollectionPercentage={wardWiseHomeCollectionPercentage}
              highestHomeCollectionWard={highestHomeCollectionWard}
              lowestHomeCollectionWard={lowestHomeCollectionWard}
              WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
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
          content="Ward-wise Solid Waste Management Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of solid waste management by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत फोहोरमैला व्यवस्थापनको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार फोहोरमैला व्यवस्थापन विधिहरूको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  {Object.entries(sourceMap).map(([key, name]) => (
                    <th key={key} className="border p-2 text-right">
                      {name}
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
                      {Object.entries(sourceMap).map(([key, name]) => {
                        const value = item[name] || 0;
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
                  {Object.entries(sourceMap).map(([key, name]) => {
                    const value = wasteManagementTotals[key] || 0;
                    const percentage = ((value / totalHouseholds) * 100).toFixed(2);
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
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत फोहोरमैला व्यवस्थापनको वितरण</h4>
          <WardSolidWasteManagementPieCharts
            wardWiseData={wardWiseData}
            WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
            sourceMap={sourceMap}
          />
        </div>
      </div>
    </>
  );
}
