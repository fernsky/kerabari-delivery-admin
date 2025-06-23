import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import FinancialAccountsPieChart from "./charts/financial-accounts-pie-chart";
import FinancialAccountsBarChart from "./charts/financial-accounts-bar-chart";
import FinancialAccountsComparisonChart from "./charts/financial-accounts-comparison-chart";
import WardFinancialAccountsPieCharts from "./charts/ward-financial-accounts-pie-charts";

interface FinancialAccountsChartsProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  bankTotal: number;
  financeTotal: number;
  microfinanceTotal: number;
  cooperativeTotal: number;
  noAccountTotal: number;
  bankPercentage: number;
  financePercentage: number;
  microfinancePercentage: number;
  cooperativePercentage: number;
  noAccountPercentage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    bankHouseholds: number;
    financeHouseholds: number;
    microfinanceHouseholds: number;
    cooperativeHouseholds: number;
    noAccountHouseholds: number;
    bankPercent: number;
    financePercent: number;
    microfinancePercent: number;
    cooperativePercent: number;
    noAccountPercent: number;
    accountPercent: number;
  }>;
  bestInclusionWard: any;
  worstInclusionWard: any;
  FINANCIAL_ACCOUNT_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function FinancialAccountsCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  bankTotal,
  financeTotal,
  microfinanceTotal,
  cooperativeTotal,
  noAccountTotal,
  bankPercentage,
  financePercentage,
  microfinancePercentage,
  cooperativePercentage,
  noAccountPercentage,
  wardWiseAnalysis,
  bestInclusionWard,
  worstInclusionWard,
  FINANCIAL_ACCOUNT_TYPES,
}: FinancialAccountsChartsProps) {
  return (
    <>
      {/* Overall financial account distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Financial Account Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of financial accounts with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वित्तीय संस्थाको प्रकार अनुसार घरपरिवार वितरण
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
              <FinancialAccountsPieChart
                pieChartData={pieChartData}
                FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
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
                    <th className="border p-2 text-left">वित्तीय खाताको प्रकार</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("1", "ne")}</td>
                    <td className="border p-2">{FINANCIAL_ACCOUNT_TYPES.BANK.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(bankTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(bankPercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("2", "ne")}</td>
                    <td className="border p-2">{FINANCIAL_ACCOUNT_TYPES.FINANCE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(financeTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(financePercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("3", "ne")}</td>
                    <td className="border p-2">{FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(microfinanceTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(microfinancePercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">{localizeNumber("4", "ne")}</td>
                    <td className="border p-2">{FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(cooperativeTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(cooperativePercentage.toFixed(2), "ne")}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2">{localizeNumber("5", "ne")}</td>
                    <td className="border p-2">{FINANCIAL_ACCOUNT_TYPES.NONE.name}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(noAccountTotal.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(noAccountPercentage.toFixed(2), "ne")}%
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
            वित्तीय समावेशीकरण विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{FINANCIAL_ACCOUNT_TYPES.BANK.name}</span>
                  <span className="font-medium">
                    {localizeNumber(bankPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${bankPercentage}%`,
                      backgroundColor: FINANCIAL_ACCOUNT_TYPES.BANK.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: FINANCIAL_ACCOUNT_TYPES.FINANCE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{FINANCIAL_ACCOUNT_TYPES.FINANCE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(financePercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${financePercentage}%`,
                      backgroundColor: FINANCIAL_ACCOUNT_TYPES.FINANCE.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(microfinancePercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${microfinancePercentage}%`,
                      backgroundColor: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(cooperativePercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cooperativePercentage}%`,
                      backgroundColor: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 col-span-1 md:col-span-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>{FINANCIAL_ACCOUNT_TYPES.NONE.name}</span>
                  <span className="font-medium">
                    {localizeNumber(noAccountPercentage.toFixed(1), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${noAccountPercentage}%`,
                      backgroundColor: FINANCIAL_ACCOUNT_TYPES.NONE.color,
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
        id="ward-wise-financial-inclusion"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Financial Accounts in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of financial accounts across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार वित्तीय खाता वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न प्रकारका वित्तीय खाताहरूको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <FinancialAccountsBarChart
              wardWiseData={wardWiseData}
              FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
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
          content="Financial Inclusion Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of financial inclusion rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत वित्तीय समावेशीकरण दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा वित्तीय खाता भएका र नभएका घरपरिवारको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <FinancialAccountsComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
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
          content="Ward-wise Financial Accounts Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of financial accounts by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत वित्तीय समावेशीकरण विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार वित्तीय खाताको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2 text-right">बैङ्क</th>
                  <th className="border p-2 text-right">फाइनान्स</th>
                  <th className="border p-2 text-right">लघुवित्त</th>
                  <th className="border p-2 text-right">सहकारी</th>
                  <th className="border p-2 text-right">खाता नभएको</th>
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
                        {localizeNumber(item.bankHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.bankPercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.financeHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.financePercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.microfinanceHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.microfinancePercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.cooperativeHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.cooperativePercent.toFixed(2), "ne")}%)
                        </div>
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.noAccountHouseholds.toLocaleString(), "ne")}
                        <div className="text-xs text-muted-foreground">
                          ({localizeNumber(item.noAccountPercent.toFixed(2), "ne")}%)
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
                    {localizeNumber(bankTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(bankPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(financeTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(financePercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(microfinanceTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(microfinancePercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(cooperativeTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(cooperativePercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(noAccountTotal.toLocaleString(), "ne")}
                    <div className="text-xs">
                      ({localizeNumber(noAccountPercentage.toFixed(2), "ne")}%)
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत वित्तीय खाता वितरण</h4>
          <WardFinancialAccountsPieCharts
            wardWiseData={wardWiseData}
            FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
          />
        </div>
      </div>
    </>
  );
}
