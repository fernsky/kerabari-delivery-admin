"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import GenderMortalityPieChart from "./charts/gender-mortality-pie-chart";
import AgeGroupMortalityBarChart from "./charts/age-group-mortality-bar-chart";
import WardMortalityBarChart from "./charts/ward-mortality-bar-chart";
import WardAgeGenderMortalityCharts from "./charts/ward-age-gender-mortality-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define gender colors for consistency
const GENDER_COLORS = {
  MALE: "#1E40AF", // Blue for male
  FEMALE: "#BE185D", // Pink for female
  OTHER: "#047857", // Green for other
};

interface DeceasedPopulationChartsProps {
  totalDeceasedPopulation: number;
  ageGroupChartData: Array<{
    ageGroup: string;
    ageGroupEn: string;
    ageGroupKey: string;
    [key: string]: string | number;
    total: number;
  }>;
  wardChartData: Array<{
    ward: string;
    wardNumber: number;
    [key: string]: string | number;
    total: number;
  }>;
  genderPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardNumbers: number[];
  deceasedData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    deceasedPopulation: number;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function DeceasedPopulationCharts({
  totalDeceasedPopulation,
  ageGroupChartData,
  wardChartData,
  genderPieChartData,
  wardNumbers,
  deceasedData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
}: DeceasedPopulationChartsProps) {
  return (
    <>
      {/* Overall gender distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Gender-wise Deceased Population in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Gender-wise distribution of deceased population in Khajura with a total of ${totalDeceasedPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" id="gender-wise-mortality" itemProp="headline">
            लिङ्ग अनुसार मृत्यु विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल मृत्यु संख्या: {localizeNumber(totalDeceasedPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <GenderMortalityPieChart
                genderPieChartData={genderPieChartData}
                GENDER_NAMES={GENDER_NAMES}
                GENDER_COLORS={GENDER_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">लिङ्ग</th>
                    <th className="border p-2 text-right">मृत्यु संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {genderPieChartData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
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
                      {localizeNumber(totalDeceasedPopulation.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            लिङ्ग अनुसार मृत्यु विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {genderPieChartData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      GENDER_COLORS[
                        Object.keys(GENDER_NAMES).find(
                          key => GENDER_NAMES[key] === item.name
                        ) as keyof typeof GENDER_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor:
                          GENDER_COLORS[
                            Object.keys(GENDER_NAMES).find(
                              key => GENDER_NAMES[key] === item.name
                            ) as keyof typeof GENDER_COLORS
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

      {/* Age Group Mortality Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Age Group-wise Deceased Population in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of deceased population by age groups in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            उमेर समूह अनुसार मृत्यु विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            उमेर समूह र लिङ्ग अनुसार मृत्यु संख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <AgeGroupMortalityBarChart
              ageGroupChartData={ageGroupChartData}
              GENDER_COLORS={GENDER_COLORS}
              GENDER_NAMES={GENDER_NAMES}
            />
          </div>
        </div>
        
        {/* Age Group table */}
        <div className="p-6 border-t">
          <h4 className="text-lg font-medium mb-4">उमेर समूह अनुसार मृत्यु संख्या</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">उमेर समूह</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.MALE}</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.FEMALE}</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.OTHER}</th>
                  <th className="border p-2 text-right">जम्मा</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {ageGroupChartData.map((item, i) => {
                  const percentage = totalDeceasedPopulation > 0 
                    ? ((item.total / totalDeceasedPopulation) * 100).toFixed(2)
                    : "0";
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ageGroup}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.MALE] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.FEMALE] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.OTHER] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {localizeNumber(item.total.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(percentage, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ageGroupChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.MALE] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ageGroupChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.FEMALE] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ageGroupChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.OTHER] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalDeceasedPopulation.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber("100.00", "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Ward Mortality Chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-mortality"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Deceased Population in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of deceased population across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार मृत्यु विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र लिङ्ग अनुसार मृत्यु संख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardMortalityBarChart
              wardChartData={wardChartData}
              GENDER_COLORS={GENDER_COLORS}
              GENDER_NAMES={GENDER_NAMES}
            />
          </div>
        </div>
        
        {/* Ward table */}
        <div className="p-6 border-t">
          <h4 className="text-lg font-medium mb-4">वडा अनुसार मृत्यु संख्या</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">वडा</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.MALE}</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.FEMALE}</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.OTHER}</th>
                  <th className="border p-2 text-right">जम्मा</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardChartData.map((item, i) => {
                  const percentage = totalDeceasedPopulation > 0 
                    ? ((item.total / totalDeceasedPopulation) * 100).toFixed(2)
                    : "0";
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">वडा नं {localizeNumber(item.wardNumber.toString(), "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.MALE] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.FEMALE] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.OTHER] || 0).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {localizeNumber(item.total.toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(percentage, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      wardChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.MALE] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      wardChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.FEMALE] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      wardChartData.reduce((sum, item) => sum + (item[GENDER_NAMES.OTHER] as number || 0), 0).toString(), 
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalDeceasedPopulation.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber("100.00", "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Ward-wise age-gender distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Age-Gender Mortality Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed age and gender mortality distribution by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार उमेर र लिङ्ग वितरण विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा, उमेर समूह र लिङ्ग अनुसार मृत्युको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          {/* Ward age-gender charts (client component) */}
          <h4 className="text-lg font-medium mb-6">वडागत उमेर र लिङ्ग अनुसारको मृत्यु विवरण</h4>
          <WardAgeGenderMortalityCharts
            wardNumbers={wardNumbers}
            deceasedData={deceasedData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
            GENDER_COLORS={GENDER_COLORS}
          />
        </div>
      </div>
    </>
  );
}
