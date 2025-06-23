import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import TimeToFinancialOrganizationPieChart from "./charts/time-to-financial-organization-pie-chart";
import TimeToFinancialOrganizationBarChart from "./charts/time-to-financial-organization-bar-chart";
import TimeToFinancialOrganizationComparisonChart from "./charts/time-to-financial-organization-comparison-chart";
import WardTimeToFinancialOrganizationPieCharts from "./charts/ward-time-to-financial-organization-pie-charts";

interface TimeToFinancialOrganizationChartsProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  under15MinTotal: number;
  under30MinTotal: number;
  under1HourTotal: number;
  over1HourTotal: number;
  under15MinPercentage: number;
  under30MinPercentage: number;
  under1HourPercentage: number;
  over1HourPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    under15MinHouseholds: number;
    under30MinHouseholds: number;
    under1HourHouseholds: number;
    over1HourHouseholds: number;
    under15MinPercent: number;
    under30MinPercent: number;
    under1HourPercent: number;
    over1HourPercent: number;
    quickAccessPercent: number;
  }>;
  bestAccessWard: any;
  worstAccessWard: any;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string; };
    UNDER_30_MIN: { name: string; nameEn: string; color: string; };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string; };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string; };
  };
}

export default function TimeToFinancialOrganizationCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  under15MinTotal,
  under30MinTotal,
  under1HourTotal,
  over1HourTotal,
  under15MinPercentage,
  under30MinPercentage,
  under1HourPercentage,
  over1HourPercentage,
  wardWiseAnalysis,
  bestAccessWard,
  worstAccessWard,
  TIME_TO_FINANCIAL_ORG_STATUS,
}: TimeToFinancialOrganizationChartsProps) {
  return (
    <>
      {/* Overall time to financial organization distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Time to Financial Organizations Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of time taken to reach financial organizations with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वित्तीय संस्थामा पुग्न लाग्ने समयको आधारमा घरपरिवार वितरण
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
              <TimeToFinancialOrganizationPieChart
                pieChartData={pieChartData}
                TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
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
                    <th className="border p-2 text-left">वित्तीय संस्थामा पुग्न लाग्ने समय</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("1", "ne")}</td>
                    <td className="border p-2">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under15MinTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under15MinPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("2", "ne")}</td>
                    <td className="border p-2">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under30MinTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under30MinPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("3", "ne")}</td>
                    <td className="border p-2">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under1HourTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(under1HourPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("4", "ne")}</td>
                    <td className="border p-2">{TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(over1HourTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(over1HourPercentage.toFixed(2), "ne")}%
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
            वित्तीय पहुँच विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}</span>
                  <span className="font-medium">
                    {localizeNumber(under15MinPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${under15MinPercentage}%`,
                      backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}</span>
                  <span className="font-medium">
                    {localizeNumber(under30MinPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${under30MinPercentage}%`,
                      backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}</span>
                  <span className="font-medium">
                    {localizeNumber(under1HourPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${under1HourPercentage}%`,
                      backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(over1HourPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${over1HourPercentage}%`,
                      backgroundColor: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color,
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
        id="ward-wise-financial-access"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Time to Financial Organizations in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Time to reach financial organizations across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार वित्तीय पहुँचको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार वित्तीय संस्थामा पुग्न लाग्ने समयको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <TimeToFinancialOrganizationBarChart
              wardWiseData={wardWiseData}
              TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
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
          content="Financial Access Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of financial access rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत वित्तीय पहुँच दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा वित्तीय संस्थामा पुग्ने समयको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <TimeToFinancialOrganizationComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
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
          content="Ward-wise Financial Access Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of time to reach financial organizations by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत वित्तीय पहुँच विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार वित्तीय संस्थामा पुग्ने समयको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2 text-right">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name}</th>
                  <th className="border p-2 text-right">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name}</th>
                  <th className="border p-2 text-right">{TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name}</th>
                  <th className="border p-2 text-right">{TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name}</th>
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
                        {localizeNumber(item.under15MinHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.under15MinPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.under30MinHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.under30MinPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.under1HourHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.under1HourPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.over1HourHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.over1HourPercent.toFixed(2), "ne")}%)
                        </div>
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
                    {localizeNumber(under15MinTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(under15MinPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(under30MinTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(under30MinPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(under1HourTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(under1HourPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(over1HourTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(over1HourPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत वित्तीय पहुँच वितरण</h4>
          <WardTimeToFinancialOrganizationPieCharts
            wardWiseData={wardWiseData}
            TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
          />
        </div>
      </div>
    </>
  );
}
