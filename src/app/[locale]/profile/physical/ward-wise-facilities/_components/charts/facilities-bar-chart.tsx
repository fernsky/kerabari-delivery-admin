"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FacilitiesBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  facilityCategoriesGrouped: Record<string, {
    name: string;
    nameEn: string;
    types: string[];
    percentage: number;
    total: number;
    color: string;
  }>;
}

export default function FacilitiesBarChart({
  wardWiseData,
  FACILITY_CATEGORIES,
  facilityCategoriesGrouped,
}: FacilitiesBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
            {payload.length >= 2 && (
              <div className="flex items-center gap-2 pt-1 mt-1 border-t">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span>जम्मा: </span>
                <span className="font-medium">
                  {localizeNumber(
                    payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0).toLocaleString(),
                    "ne"
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // For grouped bar chart showing categories per ward, transform data
  const groupedCategoryData = wardWiseData.map(ward => {
    const baseData: {
      ward: any;
      wardNumber: any;
      total: any;
      [key: string]: any;  // Allow dynamic string keys
    } = {
      ward: ward.ward,
      wardNumber: ward.wardNumber,
      total: ward.total,
    };
    
    // Add grouped category totals
    Object.entries(facilityCategoriesGrouped).forEach(([key, category]) => {
      const categoryTotal = category.types.reduce((sum, facilityType) => {
        const facilityName = FACILITY_CATEGORIES[facilityType as keyof typeof FACILITY_CATEGORIES]?.name;
        return sum + (ward[facilityName] || 0);
      }, 0);
      
      baseData[category.name] = categoryTotal;
    });
    
    return baseData;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={groupedCategoryData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value, "ne")}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {Object.values(facilityCategoriesGrouped).map((category, index) => (
          <Bar
            key={category.name}
            dataKey={category.name}
            name={category.name}
            stackId="a"
            fill={category.color}
            radius={index === Object.values(facilityCategoriesGrouped).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
