"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardMaritalStatusChartsProps {
  wardNumbers: number[];
  maritalData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    maritalStatus: string;
    population: number;
    malePopulation?: number;
    femalePopulation?: number;
    otherPopulation?: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  MARITAL_STATUS_NAMES: Record<string, string>;
  MARITAL_STATUS_COLORS: Record<string, string>;
}

export default function WardMaritalStatusCharts({
  wardNumbers,
  maritalData,
  MARITAL_STATUS_NAMES,
  MARITAL_STATUS_COLORS,
}: WardMaritalStatusChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = maritalData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Group by marital status and sum population
        const statusGroups: Record<string, number> = {};
        wardItems.forEach((item) => {
          if (!statusGroups[item.maritalStatus]) {
            statusGroups[item.maritalStatus] = 0;
          }
          statusGroups[item.maritalStatus] += item.population || 0;
        });

        // Convert to array and sort by population
        const statusData = Object.entries(statusGroups)
          .map(([status, population]) => ({
            status,
            name: MARITAL_STATUS_NAMES[status] || status,
            value: population,
          }))
          .sort((a, b) => b.value - a.value);

        // Take top 5 statuses, group others
        const topStatuses = statusData.slice(0, 5);
        const otherStatuses = statusData.slice(5);
        const otherTotal = otherStatuses.reduce(
          (sum, item) => sum + item.value,
          0,
        );

        // Prepare data for pie chart
        let chartData = topStatuses;
        if (otherTotal > 0) {
          chartData = [...topStatuses, { status: "OTHER", name: "अन्य", value: otherTotal }];
        }

        // Calculate total population for this ward
        const totalWardPopulation = chartData.reduce(
          (sum, item) => sum + item.value,
          0,
        );

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल जनसंख्या: {localizeNumber(totalWardPopulation.toLocaleString(), "ne")}
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => {
                      const colorKey = entry.status === "OTHER" ? "OTHER" : entry.status;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            MARITAL_STATUS_COLORS[
                              colorKey as keyof typeof MARITAL_STATUS_COLORS
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
                    formatter={(value: number) => [
                      `${localizeNumber(value.toLocaleString(), "ne")} (${localizeNumber(((value / totalWardPopulation) * 100).toFixed(1), "ne")}%)`,
                      "जनसंख्या"
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend section - similar to प्रमुख वैवाहिक स्थितिहरू */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {chartData.map((item, i) => {
                  const colorKey = item.status === "OTHER" ? "OTHER" : item.status;
                  const percentage = (item.value / totalWardPopulation) * 100;
                  
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            MARITAL_STATUS_COLORS[
                              colorKey as keyof typeof MARITAL_STATUS_COLORS
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
                                MARITAL_STATUS_COLORS[
                                  colorKey as keyof typeof MARITAL_STATUS_COLORS
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
