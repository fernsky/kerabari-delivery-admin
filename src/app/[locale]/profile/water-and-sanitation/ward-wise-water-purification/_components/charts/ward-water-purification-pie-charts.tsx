"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWaterPurificationPieChartsProps {
  wardNumbers: number[];
  waterPurificationData: Array<{
    id?: string;
    wardNumber: number;
    waterPurification: string;
    households: number;
  }>;
  methodMap: Record<string, string>;
  WATER_PURIFICATION_COLORS: Record<string, string>;
}

export default function WardWaterPurificationPieCharts({
  wardNumbers,
  waterPurificationData,
  methodMap,
  WATER_PURIFICATION_COLORS,
}: WardWaterPurificationPieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalHouseholds }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalHouseholds) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>घरधुरी:</span>
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
        const wardItems = waterPurificationData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Sort items for better visual consistency
        const purificationTypeOrder = {
          "FILTERING": 1,
          "BOILING": 2,
          "CHEMICAL_PIYUSH": 3,
          "OTHER": 4,
          "NO_ANY_FILTERING": 5
        };
        
        const wardData = wardItems
          .map((item) => ({
            name: methodMap[item.waterPurification] || item.waterPurification,
            value: item.households || 0,
            waterPurification: item.waterPurification,
            sortOrder: purificationTypeOrder[item.waterPurification as keyof typeof purificationTypeOrder] || 99
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरधुरी संख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={WATER_PURIFICATION_COLORS[entry.waterPurification as keyof typeof WATER_PURIFICATION_COLORS] || "#888888"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalHouseholds={wardTotal} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  if (item.value === 0) return null;
                  const percentage = wardTotal > 0 ? (item.value / wardTotal) * 100 : 0;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: WATER_PURIFICATION_COLORS[item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS] || "#888888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: WATER_PURIFICATION_COLORS[item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS] || "#888888",
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
