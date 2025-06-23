"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LoanHouseholdPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  LOAN_COLORS: Record<string, string>;
}

export default function LoanHouseholdPieChart({
  pieChartData,
  LOAN_COLORS,
}: LoanHouseholdPieChartProps) {
  // Generate a distinct color for each ward
  const getColor = (index: number) => {
    const baseColors = [
      LOAN_COLORS.primaryColor,
      LOAN_COLORS.secondaryColor,
      LOAN_COLORS.accentColor,
      LOAN_COLORS.neutralColor,
      LOAN_COLORS.highlightColor,
    ];

    // If we have more wards than base colors, generate colors algorithmically
    if (index < baseColors.length) {
      return baseColors[index];
    } else {
      // Generate colors based on hue rotation
      return `hsl(${(index * 35) % 360}, 70%, 60%)`;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value.toLocaleString(), name]}
          labelFormatter={(value) => `वडा तथ्याङ्क`}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
}
