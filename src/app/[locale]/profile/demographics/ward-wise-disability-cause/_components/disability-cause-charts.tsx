"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisabilityCausePieChart from "./charts/disability-cause-pie-chart";
import DisabilityCauseBarChart from "./charts/disability-cause-bar-chart";
import WardDisabilityCausePieCharts from "./charts/ward-disability-cause-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define disability cause colors with a modern and accessible palette
const DISABILITY_CAUSE_COLORS = {
  congenital: "#6366F1", // Indigo
  accident: "#EF4444", // Red
  malnutrition: "#F59E0B", // Amber
  disease: "#10B981", // Emerald
  conflict: "#8B5CF6", // Purple
  other: "#64748B", // Slate
};

interface DisabilityCauseChartsProps {
  overallSummary: Array<{
    disabilityCause: string;
    disabilityCauseName: string;
    population: number;
  }>;
  totalPopulationWithDisability: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  disabilityData: Array<{
    id?: string;
    wardNumber: number;
    disabilityCause: string;
    population: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalDisabilityPopulation: number;
    mostCommonCause: string;
    mostCommonCausePopulation: number;
    mostCommonCausePercentage: string;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
}

export default function DisabilityCauseCharts({
  overallSummary,
  totalPopulationWithDisability,
  pieChartData,
  wardWiseData,
  wardNumbers,
  disabilityData,
  wardWiseAnalysis,
  DISABILITY_CAUSE_NAMES,
}: DisabilityCauseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  return (
    <>
      {/* Overall disability cause distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Disability Cause Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Disability cause composition of Khajura with a total population with disabilities of ${totalPopulationWithDisability}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            अपाङ्गताका कारण अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल अपाङ्गता भएका जनसंख्या:{" "}
            {localizeNumber(
              totalPopulationWithDisability.toLocaleString(),
              "ne",
            )}{" "}
            व्यक्ति
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

          <TabsContent value="pie" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-[400px]">
                  <DisabilityCausePieChart
                    pieChartData={pieChartData}
                    DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
                    DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    प्रमुख अपाङ्गताका कारणहरू
                  </h4>
                  {overallSummary.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            DISABILITY_CAUSE_COLORS[
                              item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span>{item.disabilityCauseName}</span>
                          <span className="font-medium">
                            {localizeNumber(
                              (
                                (item.population /
                                  totalPopulationWithDisability) *
                                100
                              ).toFixed(1),
                              "ne",
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.population / totalPopulationWithDisability) * 100}%`,
                              backgroundColor:
                                DISABILITY_CAUSE_COLORS[
                                  item.disabilityCause as keyof typeof DISABILITY_CAUSE_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">अपाङ्गताको कारण</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">{item.disabilityCauseName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          (
                            (item.population / totalPopulationWithDisability) *
                            100
                          ).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        totalPopulationWithDisability.toLocaleString(),
                        "ne",
                      )}
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

      {/* Ward-wise distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Disability Cause Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Disability cause distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार अपाङ्गताका कारण वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र अपाङ्गताका कारणहरू अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <DisabilityCauseBarChart
              wardWiseData={wardWiseData}
              DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
              DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Detailed Disability Cause Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed disability cause composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत अपाङ्गता कारण विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत अपाङ्गताका कारणको संरचना
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
                  वडागत पाई चार्ट
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
                    <th className="border p-2">प्रमुख कारण</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    <th className="border p-2 text-right">कुल जनसंख्या</th>
                  </tr>
                </thead>
                <tbody>
                  {wardWiseAnalysis.map((ward, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {localizeNumber(ward.wardNumber, "ne")}
                      </td>
                      <td className="border p-2">
                        {DISABILITY_CAUSE_NAMES[ward.mostCommonCause] ||
                          ward.mostCommonCause}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ward.mostCommonCausePopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.mostCommonCausePercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ward.totalDisabilityPopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="p-6">
            <WardDisabilityCausePieCharts
              wardNumbers={wardNumbers}
              disabilityData={disabilityData}
              DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
              DISABILITY_CAUSE_COLORS={DISABILITY_CAUSE_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
