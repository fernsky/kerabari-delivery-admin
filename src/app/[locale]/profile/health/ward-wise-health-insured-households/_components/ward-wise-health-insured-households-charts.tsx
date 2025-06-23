
import { localizeNumber } from "@/lib/utils/localize-number";
import HealthInsuredHouseholdsPieChart from "./charts/health-insured-households-pie-chart";
import HealthInsuredHouseholdsBarChart from "./charts/health-insured-households-bar-chart";
import HealthInsuredHouseholdsComparisonChart from "./charts/health-insured-households-comparison-chart";
import WardHealthInsuredHouseholdsPieCharts from "./charts/ward-health-insured-households-pie-charts";

interface WardWiseHealthInsuredHouseholdsChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  totalInsuredHouseholds: number;
  totalNonInsuredHouseholds: number;
  insuredPercentage: number;
  nonInsuredPercentage: number;
  wardInsuredPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  worstInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  insuranceCoverageIndex: number;
}

export default function WardWiseHealthInsuredHouseholdsCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  totalInsuredHouseholds,
  totalNonInsuredHouseholds,
  insuredPercentage,
  nonInsuredPercentage,
  wardInsuredPercentages,
  bestInsuranceWard,
  worstInsuranceWard,
  insuranceCoverageIndex,
}: WardWiseHealthInsuredHouseholdsChartsProps) {
  return (
    <>
      {/* Overall health insurance distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Health Insurance Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of health insured households with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            स्वास्थ्य बीमा गरेका घरधुरीको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <HealthInsuredHouseholdsPieChart
                pieChartData={pieChartData}
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
                    <th className="border p-2 text-left">स्वास्थ्य बीमा स्थिति</th>
                    <th className="border p-2 text-right">घरधुरी</th>
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
            स्वास्थ्य बीमा विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        id="ward-wise-health-insurance-status"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Health Insurance Status in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of health insured households across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार स्वास्थ्य बीमाको अवस्था
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार स्वास्थ्य बीमा गरेका घरधुरीको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <HealthInsuredHouseholdsBarChart
              wardWiseData={wardWiseData}
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
          content="Health Insurance Coverage Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of health insurance coverage across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत स्वास्थ्य बीमा दर तुलना
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा स्वास्थ्य बीमा गरेका घरधुरीहरूको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <HealthInsuredHouseholdsComparisonChart
              wardInsuredPercentages={wardInsuredPercentages}
              bestInsuranceWard={bestInsuranceWard}
              worstInsuranceWard={worstInsuranceWard}
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
          content="Ward-wise Health Insurance Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of health insurance coverage by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत स्वास्थ्य बीमाको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार स्वास्थ्य बीमा गरेका घरधुरीको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2 text-right">बीमा गरेका घरधुरी</th>
                  <th className="border p-2 text-right">बीमा नगरेका घरधुरी</th>
                  <th className="border p-2 text-right">बीमा दर (%)</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  const insured = item["बीमा गरेका"];
                  const nonInsured = item["बीमा नगरेका"];
                  const insuredRate = total > 0 ? ((insured / total) * 100).toFixed(2) : "0.00";
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(insured.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(nonInsured.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(insuredRate, "ne")}%
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
                    {localizeNumber(totalInsuredHouseholds.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalNonInsuredHouseholds.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(insuredPercentage.toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत स्वास्थ्य बीमा स्थितिको वितरण</h4>
          <WardHealthInsuredHouseholdsPieCharts
            wardWiseData={wardWiseData}
          />
        </div>
      </div>
    </>
  );
}
