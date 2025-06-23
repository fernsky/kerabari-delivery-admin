"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface RemittanceExpensesPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  remittanceExpenseLabels: Record<string, string>;
  EXPENSE_COLORS: Record<string, string>;
}

export default function RemittanceExpensesPieChart({
  pieChartData,
  remittanceExpenseLabels,
  EXPENSE_COLORS,
}: RemittanceExpensesPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original expense key for color mapping
            const expenseKey =
              Object.keys(remittanceExpenseLabels).find(
                (key) => remittanceExpenseLabels[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  EXPENSE_COLORS[expenseKey as keyof typeof EXPENSE_COLORS] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
