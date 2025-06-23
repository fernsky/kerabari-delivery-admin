"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardHouseholdOuterWallPieChartsProps {
  wardNumbers: number[];
  wallData: Array<{
    id?: string;
    wardNumber: number;
    wallType: string;
    households: number;
  }>;
  WALL_TYPE_NAMES: Record<string, string>;
  WALL_TYPE_COLORS: Record<string, string>;
}

export default function WardHouseholdOuterWallPieCharts({
  wardNumbers,
  wallData,
  WALL_TYPE_NAMES,
  WALL_TYPE_COLORS,
}: WardHouseholdOuterWallPieChartsProps) {
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
        const wardItems = wallData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Sort wall types for consistent presentation
        const wallTypeOrder = {
          "CEMENT_JOINED": 1,
          "UNBAKED_BRICK": 2,
          "MUD_JOINED": 3,
          "TIN": 4,
          "BAMBOO": 5,
          "WOOD": 6,
          "PREFAB": 7,
          "OTHER": 8
        };
        
        const wardData = wardItems
          .map((item) => ({
            name: WALL_TYPE_NAMES[item.wallType] || item.wallType,
            // Extract short name for tooltip display
            shortName: (WALL_TYPE_NAMES[item.wallType] || item.wallType).split('(')[0].trim(),
            value: item.households || 0,
            wallType: item.wallType,
            sortOrder: wallTypeOrder[item.wallType as keyof typeof wallTypeOrder] || 99
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
                          WALL_TYPE_COLORS[
                            entry.wallType as keyof typeof WALL_TYPE_COLORS
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
                {wardData.slice(0, 5).map((item, i) => {
                  const percentage = (item.value / wardTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            WALL_TYPE_COLORS[
                              item.wallType as keyof typeof WALL_TYPE_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.shortName}</span>
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
                                WALL_TYPE_COLORS[
                                  item.wallType as keyof typeof WALL_TYPE_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* If there are more than 5 types, show an "Others" aggregated entry */}
                {wardData.length > 5 && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#95a5a6" }}
                    ></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center text-xs">
                        <span className="truncate">अन्य गारो</span>
                        <span className="font-medium">
                          {localizeNumber(
                            wardData
                              .slice(5)
                              .reduce((sum, item) => sum + (item.value / wardTotal) * 100, 0)
                              .toFixed(1),
                            "ne"
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${wardData
                              .slice(5)
                              .reduce((sum, item) => sum + (item.value / wardTotal) * 100, 0)}%`,
                            backgroundColor: "#95a5a6",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
