"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardDetailedAnalysisProps {
  wardNumbers: number[];
  economicallyActiveData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  AGE_GROUP_COLORS: Record<string, string>;
  GENDER_COLORS: Record<string, string>;
}

export default function WardDetailedAnalysis({
  wardNumbers,
  economicallyActiveData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
  AGE_GROUP_COLORS,
  GENDER_COLORS,
}: WardDetailedAnalysisProps) {
  const [selectedWard, setSelectedWard] = useState(wardNumbers[0] || 1);
  const [view, setView] = useState("table");

  // Get data for the selected ward
  const wardData = economicallyActiveData.filter(
    (item) => item.wardNumber === selectedWard,
  );

  // Process age group data
  const ageGroupSummary = Object.entries(
    wardData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.ageGroup]) acc[item.ageGroup] = 0;
      acc[item.ageGroup] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([ageGroup, population]) => ({
      ageGroup,
      ageGroupName: AGE_GROUP_NAMES[ageGroup] || ageGroup,
      population,
    }))
    .sort((a, b) => {
      // Custom sort to maintain the age group order
      const order = ["AGE_0_TO_14", "AGE_15_TO_59", "AGE_60_PLUS"];
      return order.indexOf(a.ageGroup) - order.indexOf(b.ageGroup);
    });

  // Process gender data
  const genderSummary = Object.entries(
    wardData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.gender]) acc[item.gender] = 0;
      acc[item.gender] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([gender, population]) => ({
      gender,
      genderName: GENDER_NAMES[gender] || gender,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate ward total
  const wardTotal = ageGroupSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare data for charts
  const ageGroupChartData = ageGroupSummary.map((item) => ({
    name: item.ageGroupName,
    value: item.population,
    percentage: ((item.population / wardTotal) * 100).toFixed(2),
  }));

  const genderChartData = genderSummary.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / wardTotal) * 100).toFixed(2),
  }));

  // Calculate working age percentage and dependency ratio
  const workingAgePopulation =
    ageGroupSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
      ?.population || 0;

  const nonWorkingAgePopulation = ageGroupSummary.reduce(
    (sum, item) =>
      item.ageGroup === "AGE_0_TO_14" || item.ageGroup === "AGE_60_PLUS"
        ? sum + item.population
        : sum,
    0,
  );

  const workingAgePercentage =
    wardTotal > 0 ? ((workingAgePopulation / wardTotal) * 100).toFixed(2) : "0";

  const dependencyRatio =
    workingAgePopulation > 0
      ? ((nonWorkingAgePopulation / workingAgePopulation) * 100).toFixed(2)
      : "0";

  return (
    <div>
      {/* Ward selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {wardNumbers.map((wardNumber) => (
          <Button
            key={wardNumber}
            variant={selectedWard === wardNumber ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedWard(wardNumber)}
          >
            वडा {wardNumber}
          </Button>
        ))}
      </div>

      {/* View switcher */}
      <div className="mb-6">
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="table">तालिका</TabsTrigger>
            <TabsTrigger value="charts">चार्ट</TabsTrigger>
            <TabsTrigger value="analysis">विश्लेषण</TabsTrigger>
          </TabsList>

          {/* Table view */}
          <TabsContent value="table" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Group Table */}
              <div>
                <h4 className="text-md font-medium mb-3">
                  उमेर समूह अनुसार वडा {selectedWard} को जनसंख्या
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">उमेर समूह</th>
                        <th className="border p-2 text-right">जनसंख्या</th>
                        <th className="border p-2 text-right">प्रतिशत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ageGroupSummary.map((item, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-muted/40" : ""}
                        >
                          <td className="border p-2">{item.ageGroupName}</td>
                          <td className="border p-2 text-right">
                            {item.population.toLocaleString()}
                          </td>
                          <td className="border p-2 text-right">
                            {((item.population / wardTotal) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold bg-muted/70">
                        <td className="border p-2">जम्मा</td>
                        <td className="border p-2 text-right">
                          {wardTotal.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">100.00%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Gender Table */}
              <div>
                <h4 className="text-md font-medium mb-3">
                  लिङ्ग अनुसार वडा {selectedWard} को जनसंख्या
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">लिङ्ग</th>
                        <th className="border p-2 text-right">जनसंख्या</th>
                        <th className="border p-2 text-right">प्रतिशत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {genderSummary.map((item, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-muted/40" : ""}
                        >
                          <td className="border p-2">{item.genderName}</td>
                          <td className="border p-2 text-right">
                            {item.population.toLocaleString()}
                          </td>
                          <td className="border p-2 text-right">
                            {((item.population / wardTotal) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold bg-muted/70">
                        <td className="border p-2">जम्मा</td>
                        <td className="border p-2 text-right">
                          {wardTotal.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">100.00%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Chart view */}
          <TabsContent value="charts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Group Chart */}
              <div>
                <h4 className="text-md font-medium mb-3 text-center">
                  उमेर समूह अनुसार वितरण (वडा {selectedWard})
                </h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageGroupChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ageGroupChartData.map((entry, index) => {
                          const ageGroupKey =
                            Object.keys(AGE_GROUP_NAMES).find(
                              (key) => AGE_GROUP_NAMES[key] === entry.name,
                            ) || "AGE_0_TO_14";

                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                AGE_GROUP_COLORS[
                                  ageGroupKey as keyof typeof AGE_GROUP_COLORS
                                ] ||
                                `#${Math.floor(Math.random() * 16777215).toString(16)}`
                              }
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gender Chart */}
              <div>
                <h4 className="text-md font-medium mb-3 text-center">
                  लिङ्ग अनुसार वितरण (वडा {selectedWard})
                </h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderChartData.map((entry, index) => {
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
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analysis view */}
          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-3">
                    कार्यसक्षम जनसंख्या (वडा {selectedWard})
                  </h4>
                  <p className="text-3xl font-bold">{workingAgePercentage}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    १५-५९ वर्ष उमेर समूहको जनसंख्या
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${workingAgePercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">
                        {workingAgePercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-3">
                    निर्भरता अनुपात (वडा {selectedWard})
                  </h4>
                  <p className="text-3xl font-bold">{dependencyRatio}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    हरेक १०० कार्यसक्षम उमेरका व्यक्तिमा आश्रित जनसंख्या
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(parseFloat(dependencyRatio), 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">
                        {dependencyRatio}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender ratio */}
              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-3">
                  लिङ्ग अनुपात (वडा {selectedWard})
                </h4>
                {(() => {
                  const males =
                    genderSummary.find((g) => g.gender === "MALE")
                      ?.population || 0;
                  const females =
                    genderSummary.find((g) => g.gender === "FEMALE")
                      ?.population || 0;
                  const genderRatio =
                    females > 0 ? ((males / females) * 100).toFixed(2) : "N/A";

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">प्रति १०० महिला</p>
                        <p className="text-2xl font-bold">
                          {genderRatio} पुरुष
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2 items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: GENDER_COLORS.MALE }}
                        ></div>
                        <span>पुरुष: {males.toLocaleString()}</span>
                        <span className="mx-2">|</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: GENDER_COLORS.FEMALE }}
                        ></div>
                        <span>महिला: {females.toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
