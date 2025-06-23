import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import IncomeSourcesPieChart from "./charts/income-sources-pie-chart";
import IncomeSourcesBarChart from "./charts/income-sources-bar-chart";
import WardIncomeSourcePieCharts from "./charts/ward-income-source-pie-charts";

// Define income source colors for consistency
const INCOME_SOURCE_COLORS = {
  JOB: "#FF5733",
  AGRICULTURE: "#FFC300",
  BUSINESS: "#36A2EB",
  INDUSTRY: "#4BC0C0",
  FOREIGN_EMPLOYMENT: "#9966FF",
  LABOUR: "#3CB371",
  OTHER: "#808080",
};

interface IncomeSourcesChartsProps {
  overallSummary: Array<{
    incomeSource: string;
    incomeName: string;
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
  incomeSourcesData: Array<{
    id?: string;
    wardNumber: number;
    incomeSource: string;
    households: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  INCOME_SOURCE_NAMES: Record<string, string>;
}

export default function IncomeSourcesCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  incomeSourcesData,
  INCOME_SOURCE_NAMES,
}: IncomeSourcesChartsProps) {
  return (
    <>
      {/* Overall income sources distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            आयस्रोत अनुसार घरपरिवार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरपरिवार: {totalHouseholds.toLocaleString()} घरधुरी
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <IncomeSourcesPieChart
                pieChartData={pieChartData}
                INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
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
                    <th className="border p-2 text-left">आयस्रोत</th>
                    <th className="border p-2 text-right">घरपरिवार</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.incomeName}</td>
                      <td className="border p-2 text-right">
                        {item.households.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.households / totalHouseholds) * 100).toFixed(2)}
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
                      {totalHouseholds.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
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
            प्रमुख आयस्रोतहरू
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
                    <span>{item.incomeName}</span>
                    <span className="font-medium">
                      {((item.households / totalHouseholds) * 100).toFixed(1)}%
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
              ? `${overallSummary.length - 5} अन्य आयस्रोतहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div
        id="ward-wise-income-sources"
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार आयस्रोत वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र आयस्रोत अनुसार घरपरिवार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <IncomeSourcesBarChart
              wardWiseData={wardWiseData}
              INCOME_SOURCE_COLORS={INCOME_SOURCE_COLORS}
              INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत आयस्रोत विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत आयस्रोत संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत आयस्रोत तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख आयस्रोत</th>
                  <th className="border p-2 text-right">घरपरिवार</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो आयस्रोत</th>
                  <th className="border p-2 text-right">घरपरिवार</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = incomeSourcesData.filter(
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
                  const primarySource = sortedItems[0];
                  const secondarySource = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {wardNumber}</td>
                      <td className="border p-2">
                        {primarySource
                          ? INCOME_SOURCE_NAMES[primarySource.incomeSource] ||
                            primarySource.incomeSource
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primarySource?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primarySource?.households
                          ? (
                              (primarySource.households / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2">
                        {secondarySource
                          ? INCOME_SOURCE_NAMES[secondarySource.incomeSource] ||
                            secondarySource.incomeSource
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondarySource?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondarySource?.households
                          ? (
                              (secondarySource.households / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
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
            incomeSourcesData={incomeSourcesData}
            INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
            INCOME_SOURCE_COLORS={INCOME_SOURCE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
