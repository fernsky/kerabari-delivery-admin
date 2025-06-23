"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

interface LoanHouseholdDistributionChartProps {
  topWardsByLoan: Array<{
    ward: string;
    households: number;
    wardNumber: number;
  }>;
  totalHouseholdsOnLoan: number;
  LOAN_COLORS: Record<string, string>;
}

export default function LoanHouseholdDistributionChart({
  topWardsByLoan,
  totalHouseholdsOnLoan,
  LOAN_COLORS,
}: LoanHouseholdDistributionChartProps) {
  // Calculate percentage for each ward
  const data = topWardsByLoan.map((item) => ({
    ...item,
    percentage: ((item.households / totalHouseholdsOnLoan) * 100).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 50, left: 40, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
        <XAxis type="number" domain={[0, "dataMax + 10"]} />
        <YAxis
          dataKey="ward"
          type="category"
          width={80}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "households") {
              return [`${value.toLocaleString()} घरपरिवार`, "ऋणी घरपरिवार"];
            }
            return [`${value}%`, "प्रतिशत"];
          }}
        />
        <Bar
          dataKey="households"
          name="ऋणी घरपरिवार"
          fill={LOAN_COLORS.primaryColor}
          barSize={30}
        >
          <LabelList dataKey="households" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
