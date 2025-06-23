"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

interface TrainedPopulationComparisonProps {
  trainedPopulationData: Array<{
    id?: string;
    wardNumber: number;
    trainedPopulation: number;
  }>;
  totalTrainedPopulation: number;
}

export default function TrainedPopulationComparison({
  trainedPopulationData,
  totalTrainedPopulation,
}: TrainedPopulationComparisonProps) {
  // Get top 3 wards by trained population
  const top3Wards = [...trainedPopulationData]
    .sort((a, b) => b.trainedPopulation - a.trainedPopulation)
    .slice(0, 3)
    .map((item) => ({
      ward: `वडा ${item.wardNumber}`,
      trainedPopulation: item.trainedPopulation,
      percentage: (
        (item.trainedPopulation / totalTrainedPopulation) *
        100
      ).toFixed(1),
    }));

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <h5 className="text-sm font-medium text-muted-foreground">
          तालिम प्राप्त जनसंख्यामा शीर्ष ३ वडाहरू
        </h5>
        <p className="text-sm mt-1">
          कुल तालिम प्राप्त जनसंख्याको{" "}
          {(
            (top3Wards.reduce(
              (sum, item) => sum + Number(item.trainedPopulation),
              0,
            ) /
              totalTrainedPopulation) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top3Wards}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              type="number"
              axisLine={{ strokeWidth: 1 }}
              tickLine={false}
              domain={[0, "dataMax"]}
            />
            <YAxis
              type="category"
              dataKey="ward"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                value.toLocaleString(),
                "तालिम प्राप्त जनसंख्या",
              ]}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar
              dataKey="trainedPopulation"
              fill="#6366F1"
              radius={[0, 4, 4, 0]}
              barSize={40}
            >
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(value: string) => `${value}%`}
                style={{ fontSize: "12px", fontWeight: "bold", fill: "#333" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
