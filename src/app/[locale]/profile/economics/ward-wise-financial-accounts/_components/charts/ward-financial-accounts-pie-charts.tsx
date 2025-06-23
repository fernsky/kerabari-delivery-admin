"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardFinancialAccountsPieChartsProps {
  wardWiseData: Array<Record<string, any>>;
  FINANCIAL_ACCOUNT_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function WardFinancialAccountsPieCharts({
  wardWiseData,
  FINANCIAL_ACCOUNT_TYPES,
}: WardFinancialAccountsPieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalHouseholds }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalHouseholds) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>घरधुरी:</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {wardWiseData.map((wardData) => {
        const total = wardData.total || 0;
        const bank = wardData[FINANCIAL_ACCOUNT_TYPES.BANK.name] || 0;
        const finance = wardData[FINANCIAL_ACCOUNT_TYPES.FINANCE.name] || 0;
        const microfinance = wardData[FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name] || 0;
        const cooperative = wardData[FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name] || 0;
        const noAccount = wardData[FINANCIAL_ACCOUNT_TYPES.NONE.name] || 0;

        const data = [
          { name: FINANCIAL_ACCOUNT_TYPES.BANK.name, value: bank, color: FINANCIAL_ACCOUNT_TYPES.BANK.color },
          { name: FINANCIAL_ACCOUNT_TYPES.FINANCE.name, value: finance, color: FINANCIAL_ACCOUNT_TYPES.FINANCE.color },
          { name: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name, value: microfinance, color: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.color },
          { name: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name, value: cooperative, color: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.color },
          { name: FINANCIAL_ACCOUNT_TYPES.NONE.name, value: noAccount, color: FINANCIAL_ACCOUNT_TYPES.NONE.color }
        ];

        return (
          <div key={wardData.wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              {wardData.ward}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरधुरी संख्या: {localizeNumber(total.toLocaleString(), "ne")}
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalHouseholds={total} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {data.map((item, i) => {
                  if (item.value === 0) return null;
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: item.color,
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
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
