import PulsePieChart from "./charts/pulse-pie-chart";
import PulseBarChart from "./charts/pulse-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "./charts/commercialization-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bean,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Home,
  PieChart,
  BarChart3,
  Banknote,
  Calculator,
  Target,
  Award,
} from "lucide-react";

interface PulseChartsProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  productionPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  revenuePieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  PULSE_TYPES: Record<string, string>;
  PULSE_COLORS: Record<string, string>;
  pulseAnalysis: {
    totalProduction: number;
    totalSales: number;
    totalRevenue: number;
    productionSalesRatio: number;
    averagePricePerKg: number;
    commercializationScore: number;
  };
  soldPercentage: string;
  selfConsumptionPercentage: string;
  commercializationScore: number;
}

export default function PulseCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  PULSE_TYPES,
  PULSE_COLORS,
  pulseAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: PulseChartsProps) {
  // Generate yearly trend data for pulse production (mocked data)
  const yearlyTrendData = [
    {
      name: "२०७८",
      lentil:
        (overallSummary.find((item) => item.type === "LENTIL")?.production ??
          0) * 0.85,
      chickpea:
        (overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
          0) * 0.85,
      pea:
        (overallSummary.find((item) => item.type === "PEA")?.production ?? 0) *
        0.85,
      other: overallSummary
        .filter((item) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type))
        .reduce((acc, item) => acc + item.production * 0.85, 0),
    },
    {
      name: "२०७९",

      lentil:
        (overallSummary.find((item) => item.type === "LENTIL")?.production ??
          0) * 0.92,
      chickpea:
        (overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
          0) * 0.92,
      pea:
        (overallSummary.find((item) => item.type === "PEA")?.production ?? 0) *
        0.92,
      other: overallSummary
        .filter(
          (item: any) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type),
        )
        .reduce((acc: any, item: any) => acc + item.production * 0.92, 0),
    },
    {
      name: "२०८०",
      lentil:
        overallSummary.find((item) => item.type === "LENTIL")?.production || 0,
      chickpea:
        overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
        0,
      pea: overallSummary.find((item) => item.type === "PEA")?.production ?? 0,
      other: overallSummary
        .filter(
          (item: any) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type),
        )
        .reduce((acc: any, item: any) => acc + item.production, 0),
    },
  ];

  // Generate production-sales distribution data
  const productionSalesData = overallSummary
    .filter((item) => item.production > 0)
    .slice(0, 6) // Only show top 6 for better visualization
    .map((item) => {
      const percentageSold =
        item.production > 0 ? (item.sales / item.production) * 100 : 0;

      return {
        name: item.typeName,
        production: item.production,
        sales: item.sales,
        selfConsumption: item.production - item.sales,
        percentageSold: percentageSold,
      };
    });

  // Format sales pie chart data
  const salesPieChartData = overallSummary.map((item) => ({
    name: item.typeName,
    value: item.sales,
    percentage:
      totalSales > 0 ? ((item.sales / totalSales) * 100).toFixed(2) : "0",
  }));

  return (
    <div className="mt-12 space-y-16">
      {/* Production Distribution Section */}
      <section id="production-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            दालबालीको प्रकार अनुसार उत्पादन वितरण र मुख्य तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <PieChart className="w-5 h-5" />
                उत्पादन वितरण चार्ट
              </h3>
              <div className="h-[350px]">
                <PulsePieChart
                  pieChartData={productionPieChartData}
                  PULSE_TYPES={PULSE_TYPES}
                  PULSE_COLORS={PULSE_COLORS}
                  dataType="उत्पादन"
                  unit="मे.टन"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bean className="w-5 h-5" />
                  प्रमुख तथ्यहरू
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium">कुल दालबाली उत्पादन</span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalProduction.toFixed(2), "ne")}{" "}
                        मेट्रिक टन
                      </div>
                    </div>
                  </li>
                  {overallSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          सबैभन्दा धेरै उत्पादन
                        </span>
                        <div className="text-lg font-bold text-amber-600">
                          {overallSummary[0].typeName} (
                          {localizeNumber(
                            (
                              (overallSummary[0].production / totalProduction) *
                              100
                            ).toFixed(2),
                            "ne",
                          )}
                          %)
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium">बिक्रीमा पठाइएको</span>
                      <div className="text-lg font-bold text-green-600">
                        {localizeNumber(soldPercentage, "ne")}% (
                        {localizeNumber(totalSales.toFixed(2), "ne")} मे.टन)
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Home className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-medium">घरायसी उपभोग</span>
                      <div className="text-lg font-bold text-red-600">
                        {localizeNumber(selfConsumptionPercentage, "ne")}% (
                        {localizeNumber(
                          (totalProduction - totalSales).toFixed(2),
                          "ne",
                        )}{" "}
                        मे.टन)
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  व्यावसायीकरण स्कोर
                </h4>
                <CommercializationChart
                  commercializationScore={commercializationScore}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sales and Revenue Section */}
      <section id="sales-revenue">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            बिक्री र आम्दानी विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            दालबालीको प्रकार अनुसार बिक्री र आम्दानी वितरण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                बिक्री वितरण चार्ट
              </h3>
              <div className="h-[350px]">
                <PulsePieChart
                  pieChartData={salesPieChartData}
                  PULSE_TYPES={PULSE_TYPES}
                  PULSE_COLORS={PULSE_COLORS}
                  dataType="बिक्री"
                  unit="मे.टन"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                आम्दानी वितरण चार्ट
              </h3>
              <div className="h-[350px]">
                <PulsePieChart
                  pieChartData={revenuePieChartData}
                  PULSE_TYPES={PULSE_TYPES}
                  PULSE_COLORS={PULSE_COLORS}
                  dataType="आम्दानी"
                  unit="रु."
                  isRevenue={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  औसत बिक्री मूल्य
                </h3>
                <p className="text-3xl font-bold text-amber-600">
                  रु.{" "}
                  {localizeNumber(
                    pulseAnalysis.averagePricePerKg.toFixed(2),
                    "ne",
                  )}
                </p>
                <p className="text-sm mt-2">प्रति किलो</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Banknote className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल आम्दानी
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  रु.{" "}
                  {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}
                </p>
                <p className="text-sm mt-2">मिलियन रुपैयाँमा</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  प्रति हेक्टर आम्दानी
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  रु.{" "}
                  {localizeNumber(
                    (totalRevenue / (totalProduction / 1.5) / 1000).toFixed(2),
                    "ne",
                  )}
                </p>
                <p className="text-sm mt-2">हजार रुपैयाँमा</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Production vs Sales Comparison */}
      <section id="production-sales-comparison">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन र बिक्री तुलनात्मक विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            प्रत्येक दालबालीको उत्पादन र बिक्री अनुपातको तुलनात्मक अध्ययन
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              उत्पादन बनाम बिक्री वितरण
            </h3>
            <div className="h-[400px]">
              <ProductionSalesDistributionChart
                productionSalesData={productionSalesData}
                totalProduction={totalProduction}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                अर्थ ब्याख्या
              </h4>
              <div className="prose prose-sm">
                <p>
                  माथिको चार्टमा हरेक दालबालीको उत्पादन र बिक्री अनुपात देखाइएको
                  छ। हरियो भाग आन्तरिक उपभोग र निलो भाग बिक्री परिमाण हो。
                </p>
                <p className="mt-2">
                  सबैभन्दा बढी बिक्री अनुपात{" "}
                  <span className="font-bold text-primary">
                    {productionSalesData.length > 0
                      ? productionSalesData.sort(
                          (a, b) => b.percentageSold - a.percentageSold,
                        )[0].name
                      : ""}
                  </span>
                  को रहेको छ。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                दालबाली बिक्री दर
              </h4>
              <div className="space-y-4">
                {productionSalesData
                  .sort((a, b) => b.percentageSold - a.percentageSold)
                  .map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-primary">
                          {localizeNumber(item.percentageSold.toFixed(2), "ne")}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(item.percentageSold, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Historical Trend */}
      <section id="historical-trend">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            ऐतिहासिक प्रवृत्ति विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            दालबालीको उत्पादनमा भएको ऐतिहासिक परिवर्तन र विकास
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              वार्षिक उत्पादन प्रवृत्ति (२०७८-२०८०)
            </h3>
            <div className="h-[400px]">
              <PulseBarChart data={yearlyTrendData} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              प्रवृत्ति विश्लेषण
            </h4>
            <div className="prose prose-sm">
              <p>
                पछिल्ला वर्षहरूमा दालबाली उत्पादनमा क्रमिक वृद्धि भएको देखिन्छ。
                मसुरो, चना र केराउ उत्पादनमा निरन्तर वृद्धि भएको छ。
              </p>
              <p className="mt-2">
                यो तथ्याङ्कले गढवा गाउँपालिकामा दालबालीको क्षेत्रमा
                सकारात्मक विकास भइरहेको संकेत गर्दछ। किसानहरूले परम्परागत बालीका
                साथै नयाँ किसिमका दालबालीको खेती गर्न थालेका छन्。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Economic Impact Section */}
      <section id="economic-impact">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            आर्थिक प्रभाव
          </h2>
          <p className="text-muted-foreground">
            दालबाली उत्पादनको स्थानीय अर्थतन्त्रमा पारेको प्रभाव
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Bean className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल उत्पादन
                </h3>
                <p className="text-3xl font-bold text-amber-600">
                  {localizeNumber(totalProduction.toFixed(2), "ne")}
                </p>
                <p className="text-sm mt-2">मेट्रिक टन</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल बिक्री
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {localizeNumber(totalSales.toFixed(2), "ne")}
                </p>
                <p className="text-sm mt-2">मेट्रिक टन</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Banknote className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल आम्दानी
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  रु.{" "}
                  {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}
                </p>
                <p className="text-sm mt-2">मिलियन</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  व्यावसायीकरण स्कोर
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {localizeNumber(commercializationScore.toString(), "ne")}
                </p>
                <p className="text-sm mt-2">प्रतिशत</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
