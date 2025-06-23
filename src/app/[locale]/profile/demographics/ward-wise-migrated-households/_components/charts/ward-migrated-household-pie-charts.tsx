"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardMigratedHouseholdPieChartsProps {
  wardNumbers: number[];
  migratedData: Array<{
    id?: string;
    wardNumber: number;
    migratedFrom: string;
    households: number;
  }>;
  MIGRATED_FROM_NAMES: Record<string, string>;
  MIGRATED_FROM_COLORS: Record<string, string>;
}

export default function WardMigratedHouseholdPieCharts({
  wardNumbers,
  migratedData,
  MIGRATED_FROM_NAMES,
  MIGRATED_FROM_COLORS,
}: WardMigratedHouseholdPieChartsProps) {
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
        const wardItems = migratedData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Sort migration origins for consistent presentation
        const migratedFromOrder = {
          "SAME_DISTRICT_ANOTHER_MUNICIPALITY": 1,
          "ANOTHER_DISTRICT": 2,
          "ABROAD": 3
        };
        
        const wardData = wardItems
          .map((item) => ({
            name: MIGRATED_FROM_NAMES[item.migratedFrom] || item.migratedFrom,
            value: item.households || 0,
            migratedFrom: item.migratedFrom,
            sortOrder: migratedFromOrder[item.migratedFrom as keyof typeof migratedFromOrder] || 99
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल आप्रवासित घरपरिवार संख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
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
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          MIGRATED_FROM_COLORS[
                            entry.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalHouseholds={wardTotal} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  const percentage = (item.value / wardTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            MIGRATED_FROM_COLORS[
                              item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
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
                                MIGRATED_FROM_COLORS[
                                  item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
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
