"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardCastePieChartsProps {
  wardNumbers: number[];
  casteData: Array<{
    id?: string;
    wardNumber: number;
    casteType: string;
    casteTypeDisplay?: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  CASTE_NAMES: Record<string, string>;
  CASTE_COLORS: Record<string, string>;
}

export default function WardCastePieCharts({
  wardNumbers,
  casteData,
  CASTE_NAMES,
  CASTE_COLORS,
}: WardCastePieChartsProps) {
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

  // Helper function to consistently get color for a caste type
  const getCasteColor = (casteType: string): string => {
    return CASTE_COLORS[casteType] || 
           (casteType === "OTHER" ? CASTE_COLORS.OTHER || "#64748B" : 
           `#${Math.floor(Math.random() * 16777215).toString(16)}`);
  };

  // Helper function to get the proper display name for a caste type
  const getCasteDisplayName = (casteType: string, fallbackName?: string): string => {
    if (CASTE_NAMES[casteType]) {
      return CASTE_NAMES[casteType];
    }
    
    if (casteType === "OTHER") {
      return "अन्य";
    }
    
    return fallbackName || casteType;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = casteData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 castes, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topCastes = sortedItems.slice(0, 5);
        const otherCastes = sortedItems.slice(5);
        const otherTotal = otherCastes.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topCastes.map((item) => ({
          casteType: item.casteType,
          name: getCasteDisplayName(item.casteType, item.casteTypeDisplay),
          value: item.population || 0,
          color: getCasteColor(item.casteType), // Pre-determine color to ensure consistency
        }));

        if (otherTotal > 0) {
          wardData.push({
            casteType: "OTHER",
            name: "अन्य",
            value: otherTotal,
            color: getCasteColor("OTHER"),
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
              वडा {localizeNumber(wardNumber.toString(), "ne")}
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
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color} // Use pre-determined color
                      />
                    ))}
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
                  const percentage = (item.value / totalWardPopulation) * 100;
                  
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: item.color // Use the same pre-determined color
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
                              backgroundColor: item.color // Use the same pre-determined color
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
