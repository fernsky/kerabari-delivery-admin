"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgeDistributionBarChart from "./charts/age-distribution-bar-chart";
import AgeCategoryPieChart from "./charts/age-category-pie-chart";
import GenderDistributionPieChart from "./charts/gender-distribution-pie-chart";
import PopulationPyramidChart from "./charts/population-pyramid-chart";
import WardAgeBarChart from "./charts/ward-age-bar-chart";
import WardDetailedAgePieCharts from "./charts/ward-detailed-age-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define colors for age groups and gender with improved aesthetics
const GENDER_COLORS = {
  MALE: "#6366F1", // Indigo
  FEMALE: "#EC4899", // Pink
  OTHER: "#F59E0B", // Amber
};

const AGE_CATEGORY_COLORS = {
  "बाल (०-१४)": "#6366F1", // Indigo
  "युवा (१५-२९)": "#10B981", // Emerald
  "वयस्क (३०-५९)": "#8B5CF6", // Purple
  "वृद्ध (६० माथि)": "#F59E0B", // Amber
};

interface AgeWiseChartsProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  overallSummaryByGender: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  pyramidData: Array<{
    ageGroup: string;
    ageGroupName: string;
    male: number;
    female: number;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  ageData: Array<{
    id: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function AgeWiseCharts({
  overallSummaryByAge,
  overallSummaryByGender,
  totalPopulation,
  pyramidData,
  wardWiseData,
  wardNumbers,
  ageData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
}: AgeWiseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("bar");

  // Calculate age distribution percentages
  const calculateAgeDistributionPercentage = (
    ages: string[],
    total: number,
  ) => {
    const ageGroups = overallSummaryByAge.filter((item) =>
      ages.includes(item.ageGroup),
    );

    const ageTotal = ageGroups.reduce((sum, item) => sum + item.total, 0);
    return (ageTotal / total) * 100;
  };

  return (
    <>
      {/* Overall age distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            उमेर समूह अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या:{" "}
            {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  बार चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="pie"
                  className="data-[state=active]:bg-background"
                >
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="bar" className="p-4">
            <div className="h-[500px]">
              <AgeDistributionBarChart
                overallSummaryByAge={overallSummaryByAge}
                GENDER_NAMES={GENDER_NAMES}
                GENDER_COLORS={GENDER_COLORS}
              />
            </div>
          </TabsContent>

          <TabsContent value="pie" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Category Pie Chart */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium mb-2 text-center">
                  उमेरगत वर्गीकरण
                </h3>
                <div className="h-[420px]">
                  <AgeCategoryPieChart
                    totalPopulation={totalPopulation}
                    calculateAgeDistributionPercentage={
                      calculateAgeDistributionPercentage
                    }
                    AGE_CATEGORY_COLORS={AGE_CATEGORY_COLORS}
                  />
                </div>
              </div>

              {/* Gender Distribution Pie Chart */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium mb-2 text-center">
                  लिङ्ग अनुसार वितरण
                </h3>
                <div className="h-[420px]">
                  <GenderDistributionPieChart
                    overallSummaryByGender={overallSummaryByGender}
                    totalPopulation={totalPopulation}
                    GENDER_COLORS={GENDER_COLORS}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">उमेर समूह</th>
                    <th className="border p-2 text-right">पुरुष</th>
                    <th className="border p-2 text-right">महिला</th>
                    <th className="border p-2 text-right">अन्य</th>
                    <th className="border p-2 text-right">कुल</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummaryByAge.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ageGroupName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.male.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.female.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.other.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.total.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.total / totalPopulation) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        overallSummaryByAge
                          .reduce((sum, item) => sum + item.male, 0)
                          .toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        overallSummaryByAge
                          .reduce((sum, item) => sum + item.female, 0)
                          .toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        overallSummaryByAge
                          .reduce((sum, item) => sum + item.other, 0)
                          .toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Population pyramid */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="demographic-pyramid"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">जनसांख्यिकीय पिरामिड</h3>
          <p className="text-sm text-muted-foreground">
            उमेर र लिङ्ग अनुसार जनसंख्या संरचना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[600px]">
            <PopulationPyramidChart
              pyramidData={pyramidData}
              GENDER_COLORS={GENDER_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise age distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-age"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार उमेर समूह वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र उमेर समूह अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardAgeBarChart
              wardWiseData={wardWiseData}
              AGE_CATEGORY_COLORS={AGE_CATEGORY_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत उमेर संरचना विश्लेषण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत उमेरगत संरचना
          </p>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="data-[state=active]:bg-background"
                >
                  वडागत वितरण
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="table" className="p-6">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted">
                    <th className="border p-2">वडा नं.</th>
                    <th className="border p-2">बाल (०-१४)</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">वडाको %</th>
                    <th className="border p-2">युवा (१५-२९)</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">वडाको %</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = ageData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + item.population,
                      0,
                    );

                    // Calculate children population
                    const childPopulation = wardItems
                      .filter((item) =>
                        ["AGE_0_4", "AGE_5_9", "AGE_10_14"].includes(
                          item.ageGroup,
                        ),
                      )
                      .reduce((sum, item) => sum + item.population, 0);

                    // Calculate youth population
                    const youthPopulation = wardItems
                      .filter((item) =>
                        ["AGE_15_19", "AGE_20_24", "AGE_25_29"].includes(
                          item.ageGroup,
                        ),
                      )
                      .reduce((sum, item) => sum + item.population, 0);

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">
                          वडा {localizeNumber(wardNumber.toString(), "ne")}
                        </td>
                        <td className="border p-2">बाल जनसंख्या</td>
                        <td className="border p-2 text-right">
                          {localizeNumber(
                            childPopulation.toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0
                            ? localizeNumber(
                                ((childPopulation / wardTotal) * 100).toFixed(
                                  2,
                                ),
                                "ne",
                              ) + "%"
                            : localizeNumber("0", "ne") + "%"}
                        </td>
                        <td className="border p-2">युवा जनसंख्या</td>
                        <td className="border p-2 text-right">
                          {localizeNumber(
                            youthPopulation.toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0
                            ? localizeNumber(
                                ((youthPopulation / wardTotal) * 100).toFixed(
                                  2,
                                ),
                                "ne",
                              ) + "%"
                            : localizeNumber("0", "ne") + "%"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="p-6">
            <WardDetailedAgePieCharts
              wardNumbers={wardNumbers}
              ageData={ageData}
              AGE_CATEGORY_COLORS={AGE_CATEGORY_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
