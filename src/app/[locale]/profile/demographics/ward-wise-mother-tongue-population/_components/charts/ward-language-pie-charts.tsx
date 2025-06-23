"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardLanguagePieChartsProps {
  wardIds: number[];
  languageData: Array<{
    id?: string;
    wardNumber: number;
    languageType: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  LANGUAGE_NAMES: Record<string, string>;
  LANGUAGE_COLORS: Record<string, string>;
}

export default function WardLanguagePieCharts({
  wardIds,
  languageData,
  LANGUAGE_NAMES,
  LANGUAGE_COLORS,
}: WardLanguagePieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalPopulation }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalPopulation) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>जनसंख्या:</span>
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
      {wardIds.map((wardNumber) => {
        const wardItems = languageData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 languages, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topLanguages = sortedItems.slice(0, 5);
        const otherLanguages = sortedItems.slice(5);
        const otherTotal = otherLanguages.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topLanguages.map((item) => ({
          languageType: item.languageType,
          name: LANGUAGE_NAMES[item.languageType] || item.languageType,
          value: item.population || 0,
        }));

        if (otherTotal > 0) {
          wardData.push({
            languageType: "OTHER",
            name: "अन्य",
            value: otherTotal,
          });
        }

        // Calculate total population for this ward
        const totalWardPopulation = wardData.reduce(
          (sum, item) => sum + item.value,
          0,
        );

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber, "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल जनसंख्या: {localizeNumber(totalWardPopulation.toLocaleString(), "ne")}
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
                      const languageKey =
                        entry.languageType === "OTHER" ? "OTHER" : entry.languageType;

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            LANGUAGE_COLORS[
                              languageKey as keyof typeof LANGUAGE_COLORS
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
                    content={<CustomTooltip totalPopulation={totalWardPopulation} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  const languageKey = item.languageType === "OTHER" ? "OTHER" : item.languageType;
                  const percentage = (item.value / totalWardPopulation) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            LANGUAGE_COLORS[
                              languageKey as keyof typeof LANGUAGE_COLORS
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
                                LANGUAGE_COLORS[
                                  languageKey as keyof typeof LANGUAGE_COLORS
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
