import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import AgricultureHouseholdsPieChart from "./charts/agriculture-households-pie-chart";
import AgricultureHouseholdsBarChart from "./charts/agriculture-households-bar-chart";
import AgricultureHouseholdsComparisonChart from "./charts/agriculture-households-comparison-chart";
import WardAgricultureHouseholdsPieCharts from "./charts/ward-agriculture-households-pie-charts";

interface AgricultureHouseholdsChartsProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  totalInvolved: number;
  totalNonInvolved: number;
  involvedPercentage: number;
  nonInvolvedPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    involvedHouseholds: number;
    nonInvolvedHouseholds: number;
    involvedPercentage: number;
    nonInvolvedPercentage: number;
  }>;
  highestInvolvementWard: any;
  lowestInvolvementWard: any;
  AGRICULTURE_STATUS: {
    INVOLVED: { name: string; nameEn: string; color: string; };
    NOT_INVOLVED: { name: string; nameEn: string; color: string; };
  };
}

export default function AgricultureHouseholdsCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  totalInvolved,
  totalNonInvolved,
  involvedPercentage,
  nonInvolvedPercentage,
  wardWiseAnalysis,
  highestInvolvementWard,
  lowestInvolvementWard,
  AGRICULTURE_STATUS,
}: AgricultureHouseholdsChartsProps) {
  return (
    <>
      {/* Overall agriculture households distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Agriculture Households Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of households involved in agriculture with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            कृषि वा पशुपालनमा आबद्धताको आधारमा घरपरिवार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <AgricultureHouseholdsPieChart
                pieChartData={pieChartData}
                AGRICULTURE_STATUS={AGRICULTURE_STATUS}
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
                    <th className="border p-2 text-left">कृषि आबद्धताको स्थिति</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("1", "ne")}</td>
                    <td className="border p-2">{AGRICULTURE_STATUS.INVOLVED.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalInvolved.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(involvedPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("2", "ne")}</td>
                    <td className="border p-2">{AGRICULTURE_STATUS.NOT_INVOLVED.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalNonInvolved.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(nonInvolvedPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
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
            कृषि आबद्धता विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: AGRICULTURE_STATUS.INVOLVED.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{AGRICULTURE_STATUS.INVOLVED.name}</span>
                  <span className="font-medium">
                    {localizeNumber(involvedPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${involvedPercentage}%`,
                      backgroundColor: AGRICULTURE_STATUS.INVOLVED.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: AGRICULTURE_STATUS.NOT_INVOLVED.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{AGRICULTURE_STATUS.NOT_INVOLVED.name}</span>
                  <span className="font-medium">
                    {localizeNumber(nonInvolvedPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${nonInvolvedPercentage}%`,
                      backgroundColor: AGRICULTURE_STATUS.NOT_INVOLVED.color,
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
        id="ward-wise-agriculture-involvement"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Agriculture Households in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Agricultural household distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार कृषि आबद्धताको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार कृषि वा पशुपालनमा आबद्ध घरपरिवारको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <AgricultureHouseholdsBarChart
              wardWiseData={wardWiseData}
              AGRICULTURE_STATUS={AGRICULTURE_STATUS}
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
          content="Agriculture Involvement Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of agriculture involvement rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत कृषि आबद्धता दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा कृषि वा पशुपालनमा आबद्धता दरको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <AgricultureHouseholdsComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              AGRICULTURE_STATUS={AGRICULTURE_STATUS}
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
          content="Ward-wise Agriculture Involvement Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of agricultural involvement by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत कृषि आबद्धता विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार कृषि वा पशुपालनमा आबद्धताको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2 text-right">कृषिमा आबद्ध घरधुरी</th>
                  <th className="border p-2 text-right">कृषिमा आबद्ध नभएका घरधुरी</th>
                  <th className="border p-2 text-right">कृषि आबद्धता दर</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.involvedHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.nonInvolvedHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.involvedPercentage.toFixed(2), "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalInvolved.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalNonInvolved.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(involvedPercentage.toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत कृषि आबद्धता वितरण</h4>
          <WardAgricultureHouseholdsPieCharts
            wardWiseData={wardWiseData}
            AGRICULTURE_STATUS={AGRICULTURE_STATUS}
          />
        </div>
      </div>
    </>
  );
}
