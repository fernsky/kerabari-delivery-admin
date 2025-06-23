"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeCategoryPieChartProps {
  totalPopulation: number;
  calculateAgeDistributionPercentage: (ages: string[], total: number) => number;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function AgeCategoryPieChart({
  totalPopulation,
  calculateAgeDistributionPercentage,
  AGE_CATEGORY_COLORS,
}: AgeCategoryPieChartProps) {
  const pieData = [
    {
      name: "बाल (०-१४)",
      value: calculateAgeDistributionPercentage(
        ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
        totalPopulation,
      ),
    },
    {
      name: "युवा (१५-२९)",
      value: calculateAgeDistributionPercentage(
        ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
        totalPopulation,
      ),
    },
    {
      name: "वयस्क (३०-५९)",
      value: calculateAgeDistributionPercentage(
        [
          "AGE_30_34",
          "AGE_35_39",
          "AGE_40_44",
          "AGE_45_49",
          "AGE_50_54",
          "AGE_55_59",
        ],
        totalPopulation,
      ),
    },
    {
      name: "वृद्ध (६० माथि)",
      value: calculateAgeDistributionPercentage(
        [
          "AGE_60_64",
          "AGE_65_69",
          "AGE_70_74",
          "AGE_75_AND_ABOVE",
        ],
        totalPopulation,
      ),
    },
  ];

  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(value.toFixed(2), "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {Object.entries(AGE_CATEGORY_COLORS).map(
                ([name, color], index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={color} 
                  />
                ),
              )}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend with percentage bars */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-2">
          {pieData.map((item, i) => {
            const percentage = item.value;
            
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: AGE_CATEGORY_COLORS[item.name as keyof typeof AGE_CATEGORY_COLORS] || "#888"
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
                        backgroundColor: AGE_CATEGORY_COLORS[item.name as keyof typeof AGE_CATEGORY_COLORS] || "#888"
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
}
