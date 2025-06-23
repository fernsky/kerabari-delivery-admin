"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardForeignEmploymentPieChartsProps {
  wardNumbers: number[];
  employmentData: Array<{
    id?: string;
    wardNumber: number;
    country: string;
    population: number;
  }>;
  COUNTRY_NAMES: Record<string, string>;
  COUNTRY_COLORS: Record<string, string>;
}

export default function WardForeignEmploymentPieCharts({
  wardNumbers,
  employmentData,
  COUNTRY_NAMES,
  COUNTRY_COLORS,
}: WardForeignEmploymentPieChartsProps) {
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
      {wardNumbers.map((wardNumber) => {
        const wardItems = employmentData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        // Sort countries by population for consistent presentation
        const countryPopulations: Record<string, number> = {};
        wardItems.forEach(item => {
          if (!countryPopulations[item.country]) countryPopulations[item.country] = 0;
          countryPopulations[item.country] += item.population || 0;
        });
        
        const wardData = Object.entries(countryPopulations)
          .map(([country, population]) => ({
            name: COUNTRY_NAMES[country as keyof typeof COUNTRY_NAMES] || country,
            value: population,
            country: country,
          }))
          .sort((a, b) => b.value - a.value);

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल वैदेशिक रोजगारी संख्या: {localizeNumber(wardTotal.toLocaleString(), "ne")}
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
                          COUNTRY_COLORS[
                            entry.country as keyof typeof COUNTRY_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalPopulation={wardTotal} />}
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
                            COUNTRY_COLORS[
                              item.country as keyof typeof COUNTRY_COLORS
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
                                COUNTRY_COLORS[
                                  item.country as keyof typeof COUNTRY_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* If there are more than 5 countries, show an "Others" aggregated entry */}
                {wardData.length > 5 && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#95a5a6" }}
                    ></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center text-xs">
                        <span className="truncate">अन्य देशहरू</span>
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
