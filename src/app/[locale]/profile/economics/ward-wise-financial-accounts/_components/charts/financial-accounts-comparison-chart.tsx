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

interface FinancialAccountsComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    bankHouseholds: number;
    financeHouseholds: number;
    microfinanceHouseholds: number;
    cooperativeHouseholds: number;
    noAccountHouseholds: number;
    bankPercent: number;
    financePercent: number;
    microfinancePercent: number;
    cooperativePercent: number;
    noAccountPercent: number;
    accountPercent: number;
  }>;
  FINANCIAL_ACCOUNT_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function FinancialAccountsComparisonChart({
  wardWiseAnalysis,
  FINANCIAL_ACCOUNT_TYPES,
}: FinancialAccountsComparisonChartProps) {
  // Format data for the chart - we'll focus on bank accounts vs no accounts
  const chartData = wardWiseAnalysis.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    [FINANCIAL_ACCOUNT_TYPES.BANK.nameEn]: ward.bankPercent,
    [FINANCIAL_ACCOUNT_TYPES.NONE.nameEn]: ward.noAccountPercent,
    "Financial Inclusion": ward.accountPercent,
  })).sort((a, b) => 
    b["Financial Inclusion"] - a["Financial Inclusion"]
  );

  // Calculate average bank account rate
  const avgBankRate =
    wardWiseAnalysis.reduce((sum, ward) => sum + ward.bankPercent, 0) / wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === FINANCIAL_ACCOUNT_TYPES.BANK.nameEn) {
                displayName = FINANCIAL_ACCOUNT_TYPES.BANK.name;
              } else if (entry.name === FINANCIAL_ACCOUNT_TYPES.NONE.nameEn) {
                displayName = FINANCIAL_ACCOUNT_TYPES.NONE.name;
              } else if (entry.name === "Financial Inclusion") {
                displayName = "वित्तीय समावेशीकरण";
              }
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
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
        <Legend 
          formatter={(value) => {
            if (value === FINANCIAL_ACCOUNT_TYPES.BANK.nameEn) {
              return FINANCIAL_ACCOUNT_TYPES.BANK.name;
            } else if (value === FINANCIAL_ACCOUNT_TYPES.NONE.nameEn) {
              return FINANCIAL_ACCOUNT_TYPES.NONE.name;
            } else if (value === "Financial Inclusion") {
              return "वित्तीय समावेशीकरण";
            }
            return value;
          }}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.BANK.nameEn}
          fill={FINANCIAL_ACCOUNT_TYPES.BANK.color}
        />
        <Bar
          dataKey={FINANCIAL_ACCOUNT_TYPES.NONE.nameEn}
          fill={FINANCIAL_ACCOUNT_TYPES.NONE.color}
        />
        <Bar
          dataKey="Financial Inclusion"
          fill="#3498db"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgBankRate}
          stroke="#3498db"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgBankRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#3498db", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
