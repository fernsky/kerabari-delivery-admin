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

interface TimeToFinancialOrganizationComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    under15MinHouseholds: number;
    under30MinHouseholds: number;
    under1HourHouseholds: number;
    over1HourHouseholds: number;
    under15MinPercent: number;
    under30MinPercent: number;
    under1HourPercent: number;
    over1HourPercent: number;
    quickAccessPercent: number;
  }>;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string; };
    UNDER_30_MIN: { name: string; nameEn: string; color: string; };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string; };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string; };
  };
}

export default function TimeToFinancialOrganizationComparisonChart({
  wardWiseAnalysis,
  TIME_TO_FINANCIAL_ORG_STATUS,
}: TimeToFinancialOrganizationComparisonChartProps) {
  // Format data for the chart - we'll focus on quick access (under 15 min)
  const chartData = wardWiseAnalysis.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name]: ward.under15MinPercent,
    [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name]: ward.under30MinPercent,
    [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name]: ward.under1HourPercent,
    [TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name]: ward.over1HourPercent,
  })).sort((a, b) => 
    (Number(b[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name]) + Number(b[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name])) - 
    (Number(a[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name]) + Number(a[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name]))
  );

  // Calculate average quick access rate (under 15 min)
  const avgQuickAccess =
    wardWiseAnalysis.reduce((sum, ward) => sum + ward.under15MinPercent, 0) / wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value.toFixed(2), "ne")}%
                </span>
              </div>
            ))}
            
            {/* Display total quick access rate (under 15 min + under 30 min) */}
            {payload.length >= 2 && (
              <div className="flex items-center gap-2 pt-1 mt-1 border-t">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>छिटो पहुँच (३० मिनेटभित्र): </span>
                <span className="font-medium">
                  {localizeNumber(
                    ((payload[0].value || 0) + (payload[1].value || 0)).toFixed(2),
                    "ne"
                  )}%
                </span>
              </div>
            )}
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
          domain={[0, 100]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}
          fill={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color}
        />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}
          fill={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color}
        />
        <ReferenceLine
          y={avgQuickAccess}
          stroke="#3498db"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgQuickAccess.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#3498db", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
