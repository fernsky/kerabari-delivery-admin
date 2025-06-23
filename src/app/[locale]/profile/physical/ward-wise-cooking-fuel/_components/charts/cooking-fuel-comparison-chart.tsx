"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CookingFuelComparisonChartProps {
  wardCleanFuelPercentages: Array<{
    wardNumber: number;
    percentage: number;
    households: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  COOKING_FUEL_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  cleanFuelPercentage: number;
}

export default function CookingFuelComparisonChart({
  wardCleanFuelPercentages,
  bestWard,
  worstWard,
  COOKING_FUEL_CATEGORIES,
  cleanFuelPercentage,
}: CookingFuelComparisonChartProps) {
  // Format data for the chart - compare clean fuel usage rates
  const chartData = wardCleanFuelPercentages.map((ward) => ({
    name: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    "CleanFuel": ward.percentage,
    "households": ward.households
  })).sort((a, b) => 
    b["CleanFuel"] - a["CleanFuel"]
  );

  // Calculate average clean fuel rate
  const avgCleanFuelRate =
    wardCleanFuelPercentages.reduce((sum, ward) => sum + ward.percentage, 0) / wardCleanFuelPercentages.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#1E88E5" }}
              ></div>
              <span>स्वच्छ इन्धन प्रयोग: </span>
              <span className="font-medium">
                {localizeNumber(payload[0].value.toFixed(2), "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#757575" }}
              ></div>
              <span>स्वच्छ इन्धन प्रयोग घरधुरी: </span>
              <span className="font-medium">
                {localizeNumber(payload[1].value.toLocaleString(), "ne")}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, Math.max(Math.ceil(bestWard?.percentage || 30), 30)]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            if (value === "CleanFuel") {
              return "स्वच्छ इन्धन प्रयोग प्रतिशत";
            }
            if (value === "households") {
              return "स्वच्छ इन्धन प्रयोग गर्ने घरधुरी";
            }
            return value;
          }}
        />
        <Bar
          dataKey="CleanFuel"
          fill={COOKING_FUEL_CATEGORIES.LP_GAS.color}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="households"
          fill="#757575"
          radius={[4, 4, 0, 0]}
          hide={true}
        />
        <ReferenceLine
          y={cleanFuelPercentage}
          stroke={COOKING_FUEL_CATEGORIES.LP_GAS.color}
          strokeDasharray="3 3"
          label={{
            value: `पालिका औसत: ${localizeNumber(cleanFuelPercentage.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: COOKING_FUEL_CATEGORIES.LP_GAS.color, fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
