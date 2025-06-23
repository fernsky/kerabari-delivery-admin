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

interface FinancialAccountsBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  FINANCIAL_ACCOUNT_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function FinancialAccountsBarChart({
  wardWiseData,
  FINANCIAL_ACCOUNT_TYPES,
}: FinancialAccountsBarChartProps) {
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
          dataKey={FINANCIAL_ACCOUNT_TYPES.BANK.name}
          name={FINANCIAL_ACCOUNT_TYPES.BANK.name}
          stackId="a"
          fill={FINANCIAL_ACCOUNT_TYPES.BANK.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.FINANCE.name}
          name={FINANCIAL_ACCOUNT_TYPES.FINANCE.name}
          stackId="a"
          fill={FINANCIAL_ACCOUNT_TYPES.FINANCE.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name}
          name={FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name}
          stackId="a"
          fill={FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name}
          name={FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name}
          stackId="a"
          fill={FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.color}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.NONE.name}
          name={FINANCIAL_ACCOUNT_TYPES.NONE.name}
          stackId="a"
          fill={FINANCIAL_ACCOUNT_TYPES.NONE.color}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
