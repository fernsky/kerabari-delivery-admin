"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardDetailedAgePieChartsProps {
  wardNumbers: number[];
  ageData: Array<{
    id: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
  }>;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function WardDetailedAgePieCharts({
  wardNumbers,
  ageData,
  AGE_CATEGORY_COLORS,
}: WardDetailedAgePieChartsProps) {
  // Custom tooltip with Nepali digits
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
        const wardItems = ageData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Group by broader age categories
        const childrenCount = wardItems
          .filter((item) =>
            ["AGE_0_4", "AGE_5_9", "AGE_10_14"].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const youthCount = wardItems
          .filter((item) =>
            ["AGE_15_19", "AGE_20_24", "AGE_25_29"].includes(
              item.ageGroup,
            ),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const adultCount = wardItems
          .filter((item) =>
            [
              "AGE_30_34",
              "AGE_35_39",
              "AGE_40_44",
              "AGE_45_49",
              "AGE_50_54",
              "AGE_55_59",
            ].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const elderlyCount = wardItems
          .filter((item) =>
            [
              "AGE_60_64",
              "AGE_65_69",
              "AGE_70_74",
              "AGE_75_AND_ABOVE",
            ].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const wardData = [
          { name: "बाल (०-१४)", value: childrenCount },
          { name: "युवा (१५-२९)", value: youthCount },
          { name: "वयस्क (३०-५९)", value: adultCount },
          { name: "वृद्ध (६० माथि)", value: elderlyCount },
        ];
        
        // Calculate total population for this ward
        const totalWardPopulation = wardData.reduce(
          (sum, item) => sum + item.value,
          0
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
                        fill={
                          AGE_CATEGORY_COLORS[
                            entry.name as keyof typeof AGE_CATEGORY_COLORS
                          ] || "#888"
                        }
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
                          backgroundColor:
                            AGE_CATEGORY_COLORS[
                              item.name as keyof typeof AGE_CATEGORY_COLORS
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
                                AGE_CATEGORY_COLORS[
                                  item.name as keyof typeof AGE_CATEGORY_COLORS
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
