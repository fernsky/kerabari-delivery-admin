"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardBirthplaceHouseholdPieChartsProps {
  wardNumbers: number[];
  birthplaceData: Array<{
    id?: string;
    wardNumber: number;
    birthPlace: string;
    households: number;
  }>;
  BIRTH_PLACE_NAMES: Record<string, string>;
  BIRTH_PLACE_COLORS: Record<string, string>;
}

export default function WardBirthplaceHouseholdPieCharts({
  wardNumbers,
  birthplaceData,
  BIRTH_PLACE_NAMES,
  BIRTH_PLACE_COLORS,
}: WardBirthplaceHouseholdPieChartsProps) {
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
        const wardItems = birthplaceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.households || 0),
          0,
        );

        // Sort birthplaces for consistent presentation
        const birthplaceOrder = {
          "SAME_MUNICIPALITY": 1,
          "SAME_DISTRICT_ANOTHER_MUNICIPALITY": 2,
          "ANOTHER_DISTRICT": 3,
          "ABROAD": 4
        };
        
        const wardData = wardItems
          .map((item) => ({
            name: BIRTH_PLACE_NAMES[item.birthPlace] || item.birthPlace,
            value: item.households || 0,
            birthPlace: item.birthPlace,
            sortOrder: birthplaceOrder[item.birthPlace as keyof typeof birthplaceOrder] || 99
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरपरिवार संख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
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
                          BIRTH_PLACE_COLORS[
                            entry.birthPlace as keyof typeof BIRTH_PLACE_COLORS
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
                            BIRTH_PLACE_COLORS[
                              item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
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
                                BIRTH_PLACE_COLORS[
                                  item.birthPlace as keyof typeof BIRTH_PLACE_COLORS
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
