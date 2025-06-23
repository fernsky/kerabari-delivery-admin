"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardGenderPieChartsProps {
  wardNumbers: number[];
  genderData: Array<{
    id?: string;
    wardNumber: number;
    wardName?: string;
    gender: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  GENDER_NAMES: Record<string, string>;
  GENDER_COLORS: Record<string, string>;
}

export default function WardGenderPieCharts({
  wardNumbers,
  genderData,
  GENDER_NAMES,
  GENDER_COLORS,
}: WardGenderPieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = genderData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Prepare data for pie chart
        const wardData = wardItems.map((item) => ({
          name: GENDER_NAMES[item.gender] || item.gender,
          value: item.population || 0,
        }));

        return (
          <div key={wardNumber} className="h-[300px]">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {wardNumber}
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={wardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                 
                >
                  {wardData.map((entry, index) => {
                    const genderKey =
                      Object.keys(GENDER_NAMES).find(
                        (key) => GENDER_NAMES[key] === entry.name,
                      ) || "OTHER";

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          GENDER_COLORS[
                            genderKey as keyof typeof GENDER_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
