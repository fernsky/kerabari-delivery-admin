"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import LanguagePieChart from "./charts/language-pie-chart";
import LanguageBarChart from "./charts/language-bar-chart";
import WardLanguagePieCharts from "./charts/ward-language-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define language colors with more modern aesthetic palette
const LANGUAGE_COLORS = {
  NEPALI: "#6366F1", // Indigo
  MAITHILI: "#8B5CF6", // Purple
  BHOJPURI: "#EC4899", // Pink
  THARU: "#F43F5E", // Rose
  TAMANG: "#10B981", // Emerald
  NEWARI: "#06B6D4", // Cyan
  MAGAR: "#3B82F6", // Blue
  BAJJIKA: "#F59E0B", // Amber
  URDU: "#84CC16", // Lime
  HINDI: "#9333EA", // Fuchsia
  LIMBU: "#14B8A6", // Teal
  RAI: "#EF4444", // Red
  GURUNG: "#22D3EE", // Sky
  SHERPA: "#FB923C", // Orange
  DOTELI: "#A3E635", // Lime
  AWADI: "#E879F9", // Fuchsia
  OTHER: "#94A3B8", // Slate
};

interface MotherTongueChartsProps {
  overallSummary: Array<{
    language: string;
    languageName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardIds: number[];
  languageData: Array<{
    id?: string;
    wardNumber: number;
    languageType: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  LANGUAGE_NAMES: Record<string, string>;
}

export default function MotherTongueCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardIds,
  languageData,
  LANGUAGE_NAMES,
}: MotherTongueChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  return (
    <>
      {/* Overall language distribution - with pre-rendered table and client-side chart */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Mother Tongue Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Linguistic composition of Khajura with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            मातृभाषा अनुसार जनसंख्या वितरण
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
                  <LanguagePieChart
                    pieChartData={pieChartData}
                    LANGUAGE_NAMES={LANGUAGE_NAMES}
                    LANGUAGE_COLORS={LANGUAGE_COLORS}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    प्रमुख भाषाहरू
                  </h4>
                  <div className="space-y-3">
                    {overallSummary.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              LANGUAGE_COLORS[
                                item.language as keyof typeof LANGUAGE_COLORS
                              ] || "#888",
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span>{item.languageName}</span>
                            <span className="font-medium">
                              {localizeNumber(
                                ((item.population / totalPopulation) * 100).toFixed(1),
                                "ne"
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
                                  LANGUAGE_COLORS[
                                    item.language as keyof typeof LANGUAGE_COLORS
                                  ] || "#888",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground pt-4">
                    {overallSummary.length > 5
                      ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य भाषाहरू पनि छन्।`
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
                    <th className="border p-2 text-left">भाषा</th>
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
                      <td className="border p-2">{item.languageName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.population / totalPopulation) * 100).toFixed(2),
                          "ne"
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
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
                </tfoot>
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
          content="Ward-wise Mother Tongue Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Mother tongue distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार मातृभाषा वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र मातृभाषा अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <LanguageBarChart
              wardWiseData={wardWiseData}
              LANGUAGE_COLORS={LANGUAGE_COLORS}
              LANGUAGE_NAMES={LANGUAGE_NAMES}
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
          content="Detailed Linguistic Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed linguistic composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत भाषिक विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत भाषिक संरचना
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
                    <th className="border p-2">प्रमुख भाषा</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    <th className="border p-2">दोस्रो प्रमुख भाषा</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardIds.map((wardNumber, i) => {
                    const wardItems = languageData.filter(
                      (item) => item.wardNumber === wardNumber
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + (item.population || 0),
                      0
                    );

                    // Sort by population to find primary and secondary languages
                    const sortedItems = [...wardItems].sort(
                      (a, b) => (b.population || 0) - (a.population || 0)
                    );
                    const primaryLanguage = sortedItems[0];
                    const secondaryLanguage = sortedItems[1];

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">
                          वडा {localizeNumber(wardNumber, "ne")}
                        </td>
                        <td className="border p-2">
                          {primaryLanguage
                            ? LANGUAGE_NAMES[primaryLanguage.languageType] ||
                              primaryLanguage.languageType
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {primaryLanguage?.population
                            ? localizeNumber(
                                primaryLanguage.population.toLocaleString(),
                                "ne"
                              )
                            : "०"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && primaryLanguage?.population
                            ? localizeNumber(
                                (
                                  (primaryLanguage.population / wardTotal) *
                                  100
                                ).toFixed(2),
                                "ne"
                              ) + "%"
                            : "०%"}
                        </td>
                        <td className="border p-2">
                          {secondaryLanguage
                            ? LANGUAGE_NAMES[secondaryLanguage.languageType] ||
                              secondaryLanguage.languageType
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {secondaryLanguage?.population
                            ? localizeNumber(
                                secondaryLanguage.population.toLocaleString(),
                                "ne"
                              )
                            : "०"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && secondaryLanguage?.population
                            ? localizeNumber(
                                (
                                  (secondaryLanguage.population / wardTotal) *
                                  100
                                ).toFixed(2),
                                "ne"
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
            <WardLanguagePieCharts
              wardIds={wardIds}
              languageData={languageData}
              LANGUAGE_NAMES={LANGUAGE_NAMES}
              LANGUAGE_COLORS={LANGUAGE_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
