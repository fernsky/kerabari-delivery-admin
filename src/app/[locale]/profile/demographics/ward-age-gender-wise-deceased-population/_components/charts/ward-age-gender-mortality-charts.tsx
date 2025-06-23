"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WardAgeGenderMortalityChartsProps {
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
  GENDER_COLORS: Record<string, string>;
}

export default function WardAgeGenderMortalityCharts({
  wardNumbers,
  deceasedData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
  GENDER_COLORS,
}: WardAgeGenderMortalityChartsProps) {
  const [selectedWard, setSelectedWard] = useState<number>(wardNumbers[0] || 1);

  // Filter data for the selected ward
  const wardData = deceasedData.filter((item) => item.wardNumber === selectedWard);

  // Process data by age group and gender for the selected ward
  const processedWardData = Object.keys(AGE_GROUP_NAMES).map((ageGroup) => {
    const maleData = wardData.find(
      (item) => item.ageGroup === ageGroup && item.gender === "MALE"
    );
    
    const femaleData = wardData.find(
      (item) => item.ageGroup === ageGroup && item.gender === "FEMALE"
    );
    
    const otherData = wardData.find(
      (item) => item.ageGroup === ageGroup && item.gender === "OTHER"
    );
    
    return {
      ageGroup: AGE_GROUP_NAMES[ageGroup],
      ageGroupKey: ageGroup,
      [GENDER_NAMES.MALE]: maleData?.deceasedPopulation || 0,
      [GENDER_NAMES.FEMALE]: femaleData?.deceasedPopulation || 0,
      [GENDER_NAMES.OTHER]: otherData?.deceasedPopulation || 0,
      total: (maleData?.deceasedPopulation || 0) + 
             (femaleData?.deceasedPopulation || 0) + 
             (otherData?.deceasedPopulation || 0)
    };
  }).filter(item => item.total > 0);  // Only include age groups with data

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate ward-specific statistics
  const wardTotal = processedWardData.reduce((sum, item) => sum + item.total, 0);
  const mostAffectedAgeGroup = [...processedWardData].sort((a, b) => b.total - a.total)[0];

  // Calculate gender totals for this ward
  const genderTotals = {
    male: processedWardData.reduce((sum, item) => sum + (item[GENDER_NAMES.MALE] as number), 0),
    female: processedWardData.reduce((sum, item) => sum + (item[GENDER_NAMES.FEMALE] as number), 0),
    other: processedWardData.reduce((sum, item) => sum + (item[GENDER_NAMES.OTHER] as number), 0),
  };

  const malePercentage = wardTotal > 0 ? ((genderTotals.male / wardTotal) * 100).toFixed(1) : "0";
  const femalePercentage = wardTotal > 0 ? ((genderTotals.female / wardTotal) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Ward selector */}
      <div className="flex items-center gap-4">
        <div className="w-full max-w-xs">
          <Select
            value={selectedWard.toString()}
            onValueChange={(value) => setSelectedWard(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="वडा छान्नुहोस्" />
            </SelectTrigger>
            <SelectContent>
              {wardNumbers.map((wardNumber) => (
                <SelectItem key={wardNumber} value={wardNumber.toString()}>
                  वडा {localizeNumber(wardNumber.toString(), "ne")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground text-sm">
          वडा {localizeNumber(selectedWard.toString(), "ne")} मा जम्मा मृत्यु संख्या: {localizeNumber(wardTotal.toString(), "ne")}
        </div>
      </div>

      {wardTotal > 0 ? (
        <>
          {/* Ward statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-1">कुल मृत्यु</h4>
              <p className="text-xl font-bold">{localizeNumber(wardTotal.toString(), "ne")} जना</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-1">सबैभन्दा प्रभावित उमेर समूह</h4>
              <p className="text-xl font-bold">
                {mostAffectedAgeGroup?.ageGroup || ""}
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  {mostAffectedAgeGroup && wardTotal > 0 
                    ? `${localizeNumber(((mostAffectedAgeGroup.total / wardTotal) * 100).toFixed(1), "ne")}%`
                    : ""}
                </span>
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-1">लिङ्ग अनुपात</h4>
              <p className="text-sm mt-1">
                {GENDER_NAMES.MALE}: <span className="font-medium">{localizeNumber(malePercentage, "ne")}%</span>,{" "}
                {GENDER_NAMES.FEMALE}: <span className="font-medium">{localizeNumber(femalePercentage, "ne")}%</span>
                {genderTotals.other > 0 && (
                  <>, {GENDER_NAMES.OTHER}: <span className="font-medium">
                    {localizeNumber(((genderTotals.other / wardTotal) * 100).toFixed(1), "ne")}%
                  </span></>
                )}
              </p>
            </div>
          </div>

          {/* Ward chart */}
          <div className="h-[500px] border rounded-md p-4 bg-card">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedWardData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={25}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="ageGroup"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
                <Tooltip content={CustomTooltip} />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
                
                <Bar
                  dataKey={GENDER_NAMES.MALE}
                  name={GENDER_NAMES.MALE}
                  fill={GENDER_COLORS.MALE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={GENDER_NAMES.FEMALE}
                  name={GENDER_NAMES.FEMALE}
                  fill={GENDER_COLORS.FEMALE}
                  radius={[4, 4, 0, 0]}
                />
                {wardData.some((item) => item.gender === "OTHER" && item.deceasedPopulation > 0) && (
                  <Bar
                    dataKey={GENDER_NAMES.OTHER}
                    name={GENDER_NAMES.OTHER}
                    fill={GENDER_COLORS.OTHER}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table for the selected ward */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted sticky top-0">
                  <th className="border p-2 text-left">उमेर समूह</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.MALE}</th>
                  <th className="border p-2 text-right">{GENDER_NAMES.FEMALE}</th>
                  {wardData.some((item) => item.gender === "OTHER" && item.deceasedPopulation > 0) && (
                    <th className="border p-2 text-right">{GENDER_NAMES.OTHER}</th>
                  )}
                  <th className="border p-2 text-right">जम्मा</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {processedWardData.map((item, i) => {
                  const percentage = wardTotal > 0 
                    ? ((item.total / wardTotal) * 100).toFixed(2)
                    : "0";
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ageGroup}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.MALE] as number).toString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber((item[GENDER_NAMES.FEMALE] as number).toString(), "ne")}
                      </td>
                      {wardData.some((item) => item.gender === "OTHER" && item.deceasedPopulation > 0) && (
                        <td className="border p-2 text-right">
                          {localizeNumber((item[GENDER_NAMES.OTHER] as number).toString(), "ne")}
                        </td>
                      )}
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
                    {localizeNumber(genderTotals.male.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(genderTotals.female.toString(), "ne")}
                  </td>
                  {wardData.some((item) => item.gender === "OTHER" && item.deceasedPopulation > 0) && (
                    <td className="border p-2 text-right">
                      {localizeNumber(genderTotals.other.toString(), "ne")}
                    </td>
                  )}
                  <td className="border p-2 text-right">
                    {localizeNumber(wardTotal.toString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber("100.00", "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          यस वडामा कुनै मृत्यु तथ्याङ्क उपलब्ध छैन
        </div>
      )}
    </div>
  );
}
