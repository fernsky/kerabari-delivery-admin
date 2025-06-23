"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardIncomeSustenanceChartsProps {
  wardNumbers: number[];
  incomeSustenanceData: Array<{
    id?: string;
    wardNumber: number;
    monthsSustained: string;
    households: number;
  }>;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
  MONTHS_SUSTAINED_COLORS: Record<string, string>;
}

export default function WardIncomeSustenanceCharts({
  wardNumbers,
  incomeSustenanceData,
  MONTHS_SUSTAINED_NAMES,
  MONTHS_SUSTAINED_COLORS,
}: WardIncomeSustenanceChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = incomeSustenanceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Sort by importance (year-round first, then less secure)
        const sortOrder = [
          "TWELVE_MONTHS",
          "SIX_TO_NINE_MONTHS",
          "THREE_TO_SIX_MONTHS",
          "UPTO_THREE_MONTHS",
        ];

        const sortedItems = [...wardItems].sort(
          (a, b) =>
            sortOrder.indexOf(a.monthsSustained) -
            sortOrder.indexOf(b.monthsSustained),
        );

        let wardData = sortedItems.map((item) => ({
          name:
            MONTHS_SUSTAINED_NAMES[item.monthsSustained] ||
            item.monthsSustained,
          value: item.households || 0,
          monthsSustained: item.monthsSustained,
        }));

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
                        MONTHS_SUSTAINED_COLORS[
                          entry.monthsSustained as keyof typeof MONTHS_SUSTAINED_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name) => [
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
