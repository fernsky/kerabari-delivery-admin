"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardIncomeSourcePieChartsProps {
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
  INCOME_SOURCE_COLORS: Record<string, string>;
}

export default function WardIncomeSourcePieCharts({
  wardNumbers,
  incomeSourcesData,
  INCOME_SOURCE_NAMES,
  INCOME_SOURCE_COLORS,
}: WardIncomeSourcePieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = incomeSourcesData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by households and take top 5 income sources, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.households || 0) - (a.households || 0),
        );
        const topIncomeSources = sortedItems.slice(0, 5);
        const otherIncomeSources = sortedItems.slice(5);
        const otherTotal = otherIncomeSources.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        let wardData = topIncomeSources.map((item) => ({
          name: INCOME_SOURCE_NAMES[item.incomeSource] || item.incomeSource,
          value: item.households || 0,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
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
                  {wardData.map((entry, index) => {
                    const incomeSourceKey =
                      Object.keys(INCOME_SOURCE_NAMES).find(
                        (key) => INCOME_SOURCE_NAMES[key] === entry.name,
                      ) || "OTHER";

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          INCOME_SOURCE_COLORS[
                            incomeSourceKey as keyof typeof INCOME_SOURCE_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(
                            16,
                          )}`
                        }
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
