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
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TimeToFinancialOrganizationBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string; };
    UNDER_30_MIN: { name: string; nameEn: string; color: string; };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string; };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string; };
  };
}

export default function TimeToFinancialOrganizationBarChart({
  wardWiseData,
  TIME_TO_FINANCIAL_ORG_STATUS,
}: TimeToFinancialOrganizationBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}
          name={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}
          stackId="a"
          fill={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}
          name={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}
          stackId="a"
          fill={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}
          name={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}
          stackId="a"
          fill={TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}
          name={TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}
          stackId="a"
          fill={TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
