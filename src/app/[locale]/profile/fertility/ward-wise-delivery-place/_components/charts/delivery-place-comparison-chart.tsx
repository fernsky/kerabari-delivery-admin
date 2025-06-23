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

interface DeliveryPlaceComparisonChartProps {
  wardInstitutionalPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
  };
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function DeliveryPlaceComparisonChart({
  wardInstitutionalPercentages,
  bestWard,
  worstWard,
  DELIVERY_PLACE_CATEGORIES,
}: DeliveryPlaceComparisonChartProps) {
  // Format data for the chart - compare institutional delivery rates
  const chartData = wardInstitutionalPercentages
    .map((ward) => ({
      name: `वडा ${ward.wardNumber}`,
      InstitutionalDelivery: ward.percentage,
    }))
    .sort((a, b) => b["InstitutionalDelivery"] - a["InstitutionalDelivery"]);

  // Calculate average institutional delivery rate
  const avgInstitutionalRate =
    wardInstitutionalPercentages.reduce(
      (sum, ward) => sum + ward.percentage,
      0,
    ) / wardInstitutionalPercentages.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "InstitutionalDelivery") {
                displayName = "संस्थागत प्रसूती दर";
              }

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{displayName}: </span>
                  <span className="text-sm font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
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
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${localizeNumber(value, "ne")}`}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, Math.max(Math.ceil(bestWard?.percentage || 30), 30)]}
          label={{
            value: "संस्थागत प्रसूती दर",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            if (value === "InstitutionalDelivery") {
              return "संस्थागत प्रसूती दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="InstitutionalDelivery"
          fill={DELIVERY_PLACE_CATEGORIES.GOVERNMENTAL_HEALTH_INSTITUTION.color}
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={800}
        />
        <ReferenceLine
          y={avgInstitutionalRate}
          stroke={
            DELIVERY_PLACE_CATEGORIES.GOVERNMENTAL_HEALTH_INSTITUTION.color
          }
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgInstitutionalRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: DELIVERY_PLACE_CATEGORIES.GOVERNMENTAL_HEALTH_INSTITUTION
                .color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
