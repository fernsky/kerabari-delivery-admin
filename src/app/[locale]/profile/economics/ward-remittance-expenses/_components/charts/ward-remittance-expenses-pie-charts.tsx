"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardRemittanceExpensesPieChartsProps {
  wardNumbers: number[];
  expensesData: Array<{
    id?: string;
    wardNumber: number;
    remittanceExpense: string;
    households: number;
  }>;
  remittanceExpenseLabels: Record<string, string>;
  EXPENSE_COLORS: Record<string, string>;
}

export default function WardRemittanceExpensesPieCharts({
  wardNumbers,
  expensesData,
  remittanceExpenseLabels,
  EXPENSE_COLORS,
}: WardRemittanceExpensesPieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = expensesData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by households and take top 5 expense types, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.households || 0) - (a.households || 0),
        );
        const topExpenses = sortedItems.slice(0, 5);
        const otherExpenses = sortedItems.slice(5);
        const otherTotal = otherExpenses.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        let wardData = topExpenses.map((item) => ({
          name:
            remittanceExpenseLabels[item.remittanceExpense] ||
            item.remittanceExpense,
          value: item.households || 0,
          expense: item.remittanceExpense,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
            expense: "OTHER",
          });
        }

        return (
          <div key={wardNumber} className="h-[300px]">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {wardNumber}
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={wardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {wardData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        EXPENSE_COLORS[
                          entry.expense as keyof typeof EXPENSE_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name) => [
                    `${value.toLocaleString()} (${((value / wardTotal) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
