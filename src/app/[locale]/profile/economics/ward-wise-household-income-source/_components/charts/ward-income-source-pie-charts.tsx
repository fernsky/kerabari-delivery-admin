"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";
import { IncomeSourceEnum } from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";

interface WardIncomeSourcePieChartsProps {
  wardNumbers: number[];
  incomeSourceData: Array<{
    id?: string;
    wardNumber: number;
    incomeSource: string;
    households: number;
  }>;
  incomeSourceLabels: Record<string, string>;
  INCOME_SOURCE_COLORS: Record<string, string>;
}

export default function WardIncomeSourcePieCharts({
  wardNumbers,
  incomeSourceData,
  incomeSourceLabels,
  INCOME_SOURCE_COLORS,
}: WardIncomeSourcePieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalHouseholds }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalHouseholds) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>घरपरिवार:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} ({localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = incomeSourceData.filter(
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
          incomeSourceType: item.incomeSource,
          name:
            incomeSourceLabels[
              item.incomeSource as keyof typeof IncomeSourceEnum
            ] || item.incomeSource,
          value: item.households || 0,
        }));

        if (otherTotal > 0) {
          wardData.push({
            incomeSourceType: "OTHER",
            name: "अन्य",
            value: otherTotal,
          });
        }

        // Calculate total households for this ward
        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.value,
          0
        );

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरपरिवार: {localizeNumber(totalWardHouseholds.toLocaleString(), "ne")}
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wardData.map((entry, index) => {
                      const incomeSourceKey = entry.incomeSourceType === "OTHER" 
                        ? "OTHER" 
                        : entry.incomeSourceType;

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
                  <Tooltip
                    content={<CustomTooltip totalHouseholds={totalWardHouseholds} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  const incomeSourceKey = item.incomeSourceType === "OTHER" 
                    ? "OTHER" 
                    : item.incomeSourceType;
                  const percentage = (item.value / totalWardHouseholds) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            INCOME_SOURCE_COLORS[
                              incomeSourceKey as keyof typeof INCOME_SOURCE_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                INCOME_SOURCE_COLORS[
                                  incomeSourceKey as keyof typeof INCOME_SOURCE_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
