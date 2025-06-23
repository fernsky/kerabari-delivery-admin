
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import LiteracyStatusPieChart from "./charts/literacy-status-pie-chart";
import LiteracyStatusBarChart from "./charts/literacy-status-bar-chart";
import LiteracyStatusComparisonChart from "./charts/literacy-status-comparison-chart";
import WardLiteracyStatusPieCharts from "./charts/ward-literacy-status-pie-charts";

interface WardWiseLiteracyStatusChartsProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalPopulation: number;
  bothReadingWritingTotal: number;
  readingOnlyTotal: number;
  illiterateTotal: number;
  bothReadingWritingPercentage: number;
  readingOnlyPercentage: number;
  illiteratePercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalPopulation: number;
    bothReadingWritingPopulation: number;
    readingOnlyPopulation: number;
    illiteratePopulation: number;
    bothReadingWritingPercent: number;
    readingOnlyPercent: number;
    illiteratePercent: number;
    literacyPercent: number;
  }>;
  bestLiteracyWard: any;
  worstLiteracyWard: any;
  LITERACY_STATUS_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function WardWiseLiteracyStatusCharts({
  pieChartData,
  wardWiseData,
  totalPopulation,
  bothReadingWritingTotal,
  readingOnlyTotal,
  illiterateTotal,
  bothReadingWritingPercentage,
  readingOnlyPercentage,
  illiteratePercentage,
  wardWiseAnalysis,
  bestLiteracyWard,
  worstLiteracyWard,
  LITERACY_STATUS_TYPES,
}: WardWiseLiteracyStatusChartsProps) {
  return (
    <>
      {/* Overall literacy status distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Literacy Status Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of literacy status with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            साक्षरताको अवस्था अनुसार जनसंख्या वितरण
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
              <LiteracyStatusPieChart
                pieChartData={pieChartData}
                LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
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
                    <th className="border p-2 text-left">साक्षरताको अवस्था</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("1", "ne")}</td>
                    <td className="border p-2">{LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(bothReadingWritingTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(bothReadingWritingPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("2", "ne")}</td>
                    <td className="border p-2">{LITERACY_STATUS_TYPES.READING_ONLY.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(readingOnlyTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(readingOnlyPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("3", "ne")}</td>
                    <td className="border p-2">{LITERACY_STATUS_TYPES.ILLITERATE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(illiterateTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(illiteratePercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
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
            साक्षरताको अवस्था विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name}</span>
                  <span className="font-medium">
                    {localizeNumber(bothReadingWritingPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${bothReadingWritingPercentage}%`,
                      backgroundColor: LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: LITERACY_STATUS_TYPES.READING_ONLY.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{LITERACY_STATUS_TYPES.READING_ONLY.name}</span>
                  <span className="font-medium">
                    {localizeNumber(readingOnlyPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${readingOnlyPercentage}%`,
                      backgroundColor: LITERACY_STATUS_TYPES.READING_ONLY.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: LITERACY_STATUS_TYPES.ILLITERATE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{LITERACY_STATUS_TYPES.ILLITERATE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(illiteratePercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${illiteratePercentage}%`,
                      backgroundColor: LITERACY_STATUS_TYPES.ILLITERATE.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-literacy-status"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Literacy Status in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of literacy status across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार साक्षरताको अवस्था
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न साक्षरताको अवस्थाको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <LiteracyStatusBarChart
              wardWiseData={wardWiseData}
              LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
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
          content="Literacy Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of literacy rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत साक्षरता दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा साक्षर र निरक्षर जनसंख्याको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <LiteracyStatusComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
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
          content="Ward-wise Literacy Status Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of literacy status by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत साक्षरता विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार साक्षरताको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा जनसंख्या</th>
                  <th className="border p-2 text-right">पढ्न र लेख्न जान्ने</th>
                  <th className="border p-2 text-right">पढ्न मात्र जान्ने</th>
                  <th className="border p-2 text-right">निरक्षर</th>
                  <th className="border p-2 text-right">साक्षरता दर</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.bothReadingWritingPopulation.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.bothReadingWritingPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.readingOnlyPopulation.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.readingOnlyPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.illiteratePopulation.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.illiteratePercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.literacyPercent.toFixed(2), "ne")}%
                      </td>
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
                  <td className="border p-2 text-right">
                    {localizeNumber(bothReadingWritingTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(bothReadingWritingPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(readingOnlyTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(readingOnlyPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(illiterateTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(illiteratePercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((bothReadingWritingPercentage + readingOnlyPercentage).toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत साक्षरता वितरण</h4>
          <WardLiteracyStatusPieCharts
            wardWiseData={wardWiseData}
            LITERACY_STATUS_TYPES={LITERACY_STATUS_TYPES}
          />
        </div>
      </div>
    </>
  );
}
