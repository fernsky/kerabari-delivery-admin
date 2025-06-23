
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import EducationalLevelPieChart from "./charts/educational-level-pie-chart";
import EducationalLevelBarChart from "./charts/educational-level-bar-chart";
import EducationalLevelComparisonChart from "./charts/educational-level-comparison-chart";
import WardEducationalLevelPieCharts from "./charts/ward-educational-level-pie-charts";

interface WardWiseEducationalLevelChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalPopulation: number;
  educationLevelTotals: Record<string, number>;
  educationalLevelMap: Record<string, string>;
  educationGroupTotals: Record<string, number>;
  educationGroupPercentages: Record<string, number>;
  wardWiseHigherEducation: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  leastEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  EDUCATIONAL_LEVEL_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    levels: string[];
  }>;
}

export default function WardWiseEducationalLevelCharts({
  pieChartData,
  wardWiseData,
  totalPopulation,
  educationLevelTotals,
  educationalLevelMap,
  educationGroupTotals,
  educationGroupPercentages,
  wardWiseHigherEducation,
  bestEducatedWard,
  leastEducatedWard,
  EDUCATIONAL_LEVEL_GROUPS,
}: WardWiseEducationalLevelChartsProps) {
  return (
    <>
      {/* Overall educational level distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Educational Level Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of educational levels with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            शैक्षिक स्तर अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {localizeNumber(totalPopulation.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <EducationalLevelPieChart
                pieChartData={pieChartData}
                EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
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
                    <th className="border p-2 text-left">शैक्षिक स्तर</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber((index + 1).toString(), "ne")}</td>
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
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
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
            शैक्षिक स्तर विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
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
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-educational-level"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Educational Level in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of educational levels across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार शैक्षिक स्तर
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न शैक्षिक स्तरको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <EducationalLevelBarChart
              wardWiseData={wardWiseData}
              EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Higher Education Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of higher education rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत उच्च शिक्षा दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा उच्च शिक्षा प्राप्त जनसंख्याको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <EducationalLevelComparisonChart
              wardWiseHigherEducation={wardWiseHigherEducation}
              bestEducatedWard={bestEducatedWard}
              leastEducatedWard={leastEducatedWard}
              EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Educational Level Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of educational levels by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत शैक्षिक स्तर विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार शैक्षिक स्तरको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा जनसंख्या</th>
                  {Object.keys(EDUCATIONAL_LEVEL_GROUPS).map(key => (
                    <th key={key} className="border p-2 text-right">
                      {EDUCATIONAL_LEVEL_GROUPS[key as keyof typeof EDUCATIONAL_LEVEL_GROUPS].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(EDUCATIONAL_LEVEL_GROUPS).map(key => {
                        const groupName = EDUCATIONAL_LEVEL_GROUPS[key as keyof typeof EDUCATIONAL_LEVEL_GROUPS].name;
                        const value = item[groupName] || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
                        return (
                          <td key={key} className="border p-2 text-right">
                            {localizeNumber(value.toLocaleString(), "ne")}
                            <div className="text-xs text-muted-foreground">
                              ({localizeNumber(percentage, "ne")}%)
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                  </td>
                  {Object.keys(EDUCATIONAL_LEVEL_GROUPS).map(key => {
                    const value = educationGroupTotals[key];
                    const percentage = educationGroupPercentages[key].toFixed(2);
                    return (
                      <td key={key} className="border p-2 text-right">
                        {localizeNumber(value.toLocaleString(), "ne")}
                        <div className="text-xs">
                          ({localizeNumber(percentage, "ne")}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत शैक्षिक स्तर वितरण</h4>
          <WardEducationalLevelPieCharts
            wardWiseData={wardWiseData}
            EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
          />
        </div>
      </div>
    </>
  );
}
