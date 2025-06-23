"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CastePieChart from "./charts/caste-pie-chart";
import CasteBarChart from "./charts/caste-bar-chart";
import WardCastePieCharts from "./charts/ward-caste-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define caste colors with a more modern and accessible palette
const CASTE_COLORS = {
  BRAHMIN_HILL: "#6366F1", // Indigo
  CHHETRI: "#8B5CF6", // Purple
  THAKURI: "#EC4899", // Pink
  SANYASI_DASNAMI: "#F43F5E", // Rose
  BRAHMIN_TARAI: "#10B981", // Emerald
  RAJPUT: "#06B6D4", // Cyan
  KAYASTHA: "#3B82F6", // Blue
  BANIYA: "#F59E0B", // Amber
  NEWAR: "#84CC16", // Lime
  GURUNG: "#9333EA", // Fuchsia
  KAMI: "#14B8A6", // Teal
  DAMAI: "#EF4444", // Red
  MAGAR: "#14B8A6", // Teal
  TAMANG: "#0EA5E9", // Sky
  RAI: "#EF4444", // Red
  LIMBU: "#22C55E", // Green
  SHERPA: "#64748B", // Slate
  THAKALI: "#EA580C", // Orange
  THARU: "#8B5CF6", // Purple
  MAJHI: "#D946EF", // Fuchsia
  DALIT_HILL: "#0284C7", // Sky
  DALIT_TARAI: "#0891B2", // Cyan
  MUSLIM: "#059669", // Emerald
  MADHESI: "#65A30D", // Lime
  YADAV: "#A16207", // Amber
  TELI: "#C2410C", // Orange
  KOIRI: "#9F1239", // Rose
  KURMI: "#7E22CE", // Purple
  MARWADI: "#0F766E", // Teal
  BANGALI: "#BE185D", // Pink
  OTHER: "#64748B", // Slate
};

interface CasteChartsProps {
  overallSummary: Array<{
    casteType: string;
    casteTypeDisplay: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  casteData: Array<{
    id: string;
    wardNumber: number;
    casteType: string;
    casteTypeDisplay: string;
    population: number;
  }>;
  CASTE_NAMES: Record<string, string>;
}

export default function CasteCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  casteData,
  CASTE_NAMES,
}: CasteChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");
  console.log(casteData);
  return (
    <>
      {/* Overall caste distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Caste Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Caste composition of Khajura with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            जाति अनुसार जनसंख्या वितरण
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
                  <CastePieChart
                    pieChartData={pieChartData}
                    CASTE_NAMES={CASTE_NAMES}
                    CASTE_COLORS={CASTE_COLORS}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    प्रमुख जातिहरू
                  </h4>
                  {overallSummary.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            CASTE_COLORS[
                              item.casteType as keyof typeof CASTE_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span>{item.casteTypeDisplay}</span>
                          <span className="font-medium">
                            {localizeNumber(
                              (
                                (item.population / totalPopulation) *
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
                              width: `${(item.population / totalPopulation) * 100}%`,
                              backgroundColor:
                                CASTE_COLORS[
                                  item.casteType as keyof typeof CASTE_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground pt-4">
                    {overallSummary.length > 5
                      ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य जातिहरू पनि छन्।`
                      : ""}
                  </p>
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
                    <th className="border p-2 text-left">जातजाति</th>
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
                      <td className="border p-2">{item.casteTypeDisplay}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.population / totalPopulation) * 100).toFixed(
                            2,
                          ),
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

      {/* Ward-wise distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Caste Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Caste distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार जाति वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र जातजातिहरू अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <CasteBarChart
              wardWiseData={wardWiseData}
              CASTE_COLORS={CASTE_COLORS}
              CASTE_NAMES={CASTE_NAMES}
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
          content="Detailed Caste Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed caste composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत जातिगत विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत जातिगत संरचना
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
                    <th className="border p-2">प्रमुख जाति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    <th className="border p-2">दोस्रो प्रमुख जाति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = casteData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + (item.population || 0),
                      0,
                    );

                    // Sort by population to find primary and secondary castes
                    const sortedItems = [...wardItems].sort(
                      (a, b) => (b.population || 0) - (a.population || 0),
                    );
                    const primaryCaste = sortedItems[0];
                    const secondaryCaste = sortedItems[1];

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">
                          वडा {localizeNumber(wardNumber, "ne")}
                        </td>
                        <td className="border p-2">
                          {primaryCaste
                            ? CASTE_NAMES[primaryCaste.casteType] ||
                              primaryCaste.casteTypeDisplay
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {primaryCaste?.population
                            ? localizeNumber(
                                primaryCaste.population.toLocaleString(),
                                "ne",
                              )
                            : "०"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && primaryCaste?.population
                            ? localizeNumber(
                                (
                                  (primaryCaste.population / wardTotal) *
                                  100
                                ).toFixed(2),
                                "ne",
                              ) + "%"
                            : "०%"}
                        </td>
                        <td className="border p-2">
                          {secondaryCaste
                            ? CASTE_NAMES[secondaryCaste.casteType] ||
                              secondaryCaste.casteTypeDisplay
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {secondaryCaste?.population
                            ? localizeNumber(
                                secondaryCaste.population.toLocaleString(),
                                "ne",
                              )
                            : "०"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && secondaryCaste?.population
                            ? localizeNumber(
                                (
                                  (secondaryCaste.population / wardTotal) *
                                  100
                                ).toFixed(2),
                                "ne",
                              ) + "%"
                            : "०%"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="p-6">
            <WardCastePieCharts
              wardNumbers={wardNumbers}
              casteData={casteData}
              CASTE_NAMES={CASTE_NAMES}
              CASTE_COLORS={CASTE_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
