import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import RemittanceExpensesPieChart from "./charts/remittance-expenses-pie-chart";
import RemittanceExpensesBarChart from "./charts/remittance-expenses-bar-chart";
import WardRemittanceExpensesPieCharts from "./charts/ward-remittance-expenses-pie-charts";

// Define expense colors for consistency
const EXPENSE_COLORS = {
  EDUCATION: "#FF5733",
  HEALTH: "#FFC300",
  HOUSEHOLD_USE: "#36A2EB",
  FESTIVALS: "#4BC0C0",
  LOAN_PAYMENT: "#9966FF",
  LOANED_OTHERS: "#3CB371",
  SAVING: "#FF6384",
  HOUSE_CONSTRUCTION: "#FFCE56",
  LAND_OWNERSHIP: "#C9CBCF",
  JEWELRY_PURCHASE: "#FF9F40",
  GOODS_PURCHASE: "#4CAF50",
  BUSINESS_INVESTMENT: "#9C27B0",
  OTHER: "#607D8B",
  UNKNOWN: "#757575",
};

interface RemittanceExpensesChartsProps {
  overallSummary: Array<{
    expense: string;
    expenseName: string;
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
  expensesData: Array<{
    id?: string;
    wardNumber: number;
    remittanceExpense: string;
    households: number;
  }>;
  remittanceExpenseLabels: Record<string, string>;
  EXPENSE_NAMES_EN: Record<string, string>;
}

export default function RemittanceExpensesCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  expensesData,
  remittanceExpenseLabels,
  EXPENSE_NAMES_EN,
}: RemittanceExpensesChartsProps) {
  return (
    <>
      {/* Overall remittance expenses distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">रेमिटेन्स खर्च वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल विप्रेषण प्राप्त घरपरिवार: {totalHouseholds.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <RemittanceExpensesPieChart
                pieChartData={pieChartData}
                remittanceExpenseLabels={remittanceExpenseLabels}
                EXPENSE_COLORS={EXPENSE_COLORS}
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
                    <th className="border p-2 text-left">खर्च प्रकार</th>
                    <th className="border p-2 text-right">घरपरिवार</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.expenseName}</td>
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
            प्रमुख खर्च प्रकारहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      EXPENSE_COLORS[
                        item.expense as keyof typeof EXPENSE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.expenseName}</span>
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
                          EXPENSE_COLORS[
                            item.expense as keyof typeof EXPENSE_COLORS
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
              ? `${overallSummary.length - 5} अन्य खर्च प्रकारहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार रेमिटेन्स खर्च वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र खर्च प्रकार अनुसार घरपरिवार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <RemittanceExpensesBarChart
              wardWiseData={wardWiseData}
              EXPENSE_COLORS={EXPENSE_COLORS}
              remittanceExpenseLabels={remittanceExpenseLabels}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत रेमिटेन्स खर्च विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत विप्रेषण खर्च प्राथमिकता
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत खर्च तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख खर्च प्रकार</th>
                  <th className="border p-2 text-right">घरपरिवार</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख खर्च प्रकार</th>
                  <th className="border p-2 text-right">घरपरिवार</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = expensesData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.households || 0),
                    0,
                  );

                  // Sort by households to find primary and secondary expense types
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.households || 0) - (a.households || 0),
                  );
                  const primaryExpense = sortedItems[0];
                  const secondaryExpense = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {wardNumber}</td>
                      <td className="border p-2">
                        {primaryExpense
                          ? remittanceExpenseLabels[
                              primaryExpense.remittanceExpense
                            ] || primaryExpense.remittanceExpense
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryExpense?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryExpense?.households
                          ? (
                              (primaryExpense.households / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2">
                        {secondaryExpense
                          ? remittanceExpenseLabels[
                              secondaryExpense.remittanceExpense
                            ] || secondaryExpense.remittanceExpense
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryExpense?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryExpense?.households
                          ? (
                              (secondaryExpense.households / wardTotal) *
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
          <WardRemittanceExpensesPieCharts
            wardNumbers={wardNumbers}
            expensesData={expensesData}
            remittanceExpenseLabels={remittanceExpenseLabels}
            EXPENSE_COLORS={EXPENSE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
