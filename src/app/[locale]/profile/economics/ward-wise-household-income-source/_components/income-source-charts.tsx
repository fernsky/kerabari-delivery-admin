import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import IncomeSourcePieChart from "./charts/income-source-pie-chart";
import IncomeSourceBarChart from "./charts/income-source-bar-chart";
import WardIncomeSourcePieCharts from "./charts/ward-income-source-pie-charts";
import { IncomeSourceEnum } from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define income source colors for consistency
const INCOME_SOURCE_COLORS = {
  AGRICULTURE: "#4CAF50", // Green
  JOB: "#2196F3", // Blue
  BUSINESS: "#FF9800", // Orange
  INDUSTRY: "#F44336", // Red
  FOREIGN_EMPLOYMENT: "#9C27B0", // Purple
  LABOUR: "#795548", // Brown
  OTHER: "#9E9E9E", // Grey
};

interface IncomeSourceChartsProps {
  overallSummary: Array<{
    incomeSource: string;
    incomeSourceName: string;
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
  incomeSourceData: Array<{
    id?: string;
    wardNumber: number;
    incomeSource: string;
    households: number;
  }>;
  incomeSourceLabels: Record<string, string>;
}

export default function IncomeSourceCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  incomeSourceData,
  incomeSourceLabels,
}: IncomeSourceChartsProps) {
  return (
    <>
      {/* Overall income source distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            आय स्रोत अनुसार घरपरिवार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरपरिवार: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <IncomeSourcePieChart
                pieChartData={pieChartData}
                incomeSourceLabels={incomeSourceLabels}
                INCOME_SOURCE_COLORS={INCOME_SOURCE_COLORS}
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
                    <th className="border p-2 text-left">आय स्रोत</th>
                    <th className="border p-2 text-right">घरपरिवार संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.incomeSourceName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.households.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.households / totalHouseholds) * 100).toFixed(2), "ne")}
                        %
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
                    <td className="border p-2 text-right">{localizeNumber("100.00", "ne")}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            प्रमुख आय स्रोतहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      INCOME_SOURCE_COLORS[
                        item.incomeSource as keyof typeof INCOME_SOURCE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.incomeSourceName}</span>
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
                          INCOME_SOURCE_COLORS[
                            item.incomeSource as keyof typeof INCOME_SOURCE_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {overallSummary.length > 5
              ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य आय स्रोतहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार आय स्रोत वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र आय स्रोत अनुसार घरपरिवार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <IncomeSourceBarChart
              wardWiseData={wardWiseData}
              INCOME_SOURCE_COLORS={INCOME_SOURCE_COLORS}
              incomeSourceLabels={incomeSourceLabels}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत आय स्रोत विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत आय स्रोत संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत आय स्रोत तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख आय स्रोत</th>
                  <th className="border p-2 text-right">घरपरिवार संख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख आय स्रोत</th>
                  <th className="border p-2 text-right">घरपरिवार संख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = incomeSourceData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.households || 0),
                    0,
                  );

                  // Sort by households to find primary and secondary income sources
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.households || 0) - (a.households || 0),
                  );
                  const primaryIncomeSource = sortedItems[0];
                  const secondaryIncomeSource = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(wardNumber, "ne")}</td>
                      <td className="border p-2">
                        {primaryIncomeSource
                          ? incomeSourceLabels[
                              primaryIncomeSource.incomeSource as keyof typeof IncomeSourceEnum
                            ] || primaryIncomeSource.incomeSource
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryIncomeSource?.households
                          ? localizeNumber(primaryIncomeSource.households.toLocaleString(), "ne")
                          : localizeNumber("0", "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryIncomeSource?.households
                          ? localizeNumber(((primaryIncomeSource.households / wardTotal) * 100).toFixed(2), "ne") + "%"
                          : localizeNumber("0", "ne") + "%"}
                      </td>
                      <td className="border p-2">
                        {secondaryIncomeSource
                          ? incomeSourceLabels[
                              secondaryIncomeSource.incomeSource as keyof typeof IncomeSourceEnum
                            ] || secondaryIncomeSource.incomeSource
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryIncomeSource?.households
                          ? localizeNumber(secondaryIncomeSource.households.toLocaleString(), "ne")
                          : localizeNumber("0", "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryIncomeSource?.households
                          ? localizeNumber(((secondaryIncomeSource.households / wardTotal) * 100).toFixed(2), "ne") + "%"
                          : localizeNumber("0", "ne") + "%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पाई चार्ट</h4>
          <WardIncomeSourcePieCharts
            wardNumbers={wardNumbers}
            incomeSourceData={incomeSourceData}
            incomeSourceLabels={incomeSourceLabels}
            INCOME_SOURCE_COLORS={INCOME_SOURCE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
