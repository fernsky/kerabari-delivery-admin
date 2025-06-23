"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardLoanUsageChartsProps {
  wardNumbers: number[];
  loanUsageData: Array<{
    id?: string;
    wardNumber: number;
    loanUse: string;
    households: number;
  }>;
  loanUseLabels: Record<string, string>;
  LOAN_USE_COLORS: Record<string, string>;
}

export default function WardLoanUsageCharts({
  wardNumbers,
  loanUsageData,
  loanUseLabels,
  LOAN_USE_COLORS,
}: WardLoanUsageChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = loanUsageData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by households and take top 5 loan uses, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.households || 0) - (a.households || 0),
        );
        const topLoanUses = sortedItems.slice(0, 5);
        const otherLoanUses = sortedItems.slice(5);
        const otherTotal = otherLoanUses.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        let wardData = topLoanUses.map((item) => ({
          name: loanUseLabels[item.loanUse] || item.loanUse,
          value: item.households || 0,
          loanUse: item.loanUse,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
            loanUse: "OTHER",
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
                        LOAN_USE_COLORS[
                          entry.loanUse as keyof typeof LOAN_USE_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} (${((Number(value) / wardTotal) * 100).toFixed(1)}%)`,
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
