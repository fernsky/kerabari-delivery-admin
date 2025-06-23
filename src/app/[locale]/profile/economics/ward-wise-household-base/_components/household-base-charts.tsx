import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import HouseholdBasePieChart from "./charts/household-base-pie-chart";
import HouseholdBaseBarChart from "./charts/household-base-bar-chart";
import WardHouseholdBasePieCharts from "./charts/ward-household-base-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdBaseChartsProps {
  overallSummary: Array<{
    baseType: string;
    baseTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  baseData: Array<{
    id?: string;
    wardNumber: number;
    baseType: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    concreteHouseholds: number;
    concretePercentage: string;
  }>;
  BASE_TYPE_NAMES: Record<string, string>;
  BASE_TYPE_COLORS: Record<string, string>;
}

export default function HouseholdBaseCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  baseData,
  wardWiseAnalysis,
  BASE_TYPE_NAMES,
  BASE_TYPE_COLORS,
}: HouseholdBaseChartsProps) {
  return (
    <>
      {/* Overall household base distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="House Foundation Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`House foundation distribution of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            घरको जगको प्रकार अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[480px]">
              <HouseholdBasePieChart
                pieChartData={pieChartData}
                BASE_TYPE_NAMES={BASE_TYPE_NAMES}
                BASE_TYPE_COLORS={BASE_TYPE_COLORS}
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
                    <th className="border p-2 text-left">घरको जगको प्रकार</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.baseTypeName}</td>
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
            घरको जग विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      BASE_TYPE_COLORS[
                        item.baseType as keyof typeof BASE_TYPE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.baseTypeName}</span>
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
                          BASE_TYPE_COLORS[
                            item.baseType as keyof typeof BASE_TYPE_COLORS
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
        id="ward-wise-household-base"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise House Foundation in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="House foundation distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार घरको जगको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र जगको प्रकार अनुसार घरधुरी वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <HouseholdBaseBarChart
              wardWiseData={wardWiseData}
              BASE_TYPE_COLORS={BASE_TYPE_COLORS}
              BASE_TYPE_NAMES={BASE_TYPE_NAMES}
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
          content="Ward-wise House Foundation Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common house foundation types by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत घरको जग विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार घरको जगको प्रमुख प्रकारहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2">प्रमुख जगको प्रकार</th>
                  <th className="border p-2 text-right">प्रमुख प्रकारको घरधुरी</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
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
                        {BASE_TYPE_NAMES[item.mostCommonType as keyof typeof BASE_TYPE_NAMES] || item.mostCommonType}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonTypeHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonTypePercentage, "ne")}%
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
                    {BASE_TYPE_NAMES[overallSummary[0]?.baseType as keyof typeof BASE_TYPE_NAMES] || overallSummary[0]?.baseType}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary[0]?.households || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary[0]?.households || 0) / totalHouseholds * 100).toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत घरको जगको वितरण</h4>
          <WardHouseholdBasePieCharts
            wardNumbers={wardNumbers}
            baseData={baseData}
            BASE_TYPE_NAMES={BASE_TYPE_NAMES}
            BASE_TYPE_COLORS={BASE_TYPE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
