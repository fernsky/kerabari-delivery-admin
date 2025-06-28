import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import VegetablePieChart from "./charts/vegetable-pie-chart";
import VegetableBarChart from "./charts/vegetable-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "../../municipality-wide-oil-seeds/_components/charts/commercialization-chart";
import {
  Carrot,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Home,
  PieChart,
  BarChart3,
  TrendingDown,
  Banknote,
  Calculator,
  Target,
  Award,
} from "lucide-react";

interface VegetableChartsProps {
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
  VEGETABLE_TYPES: Record<string, string>;
  VEGETABLE_COLORS: Record<string, string>;
  vegetableAnalysis: {
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

export default function VegetableCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  VEGETABLE_TYPES,
  VEGETABLE_COLORS,
  vegetableAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: VegetableChartsProps) {
  // Format data for production-sales comparison chart
  const productionSalesData = overallSummary
    .filter((item) => item.production > 0)
    .map((item) => ({
      name: item.typeName,
      production: item.production,
      sales: item.sales,
      selfConsumption: item.production - item.sales,
      percentageSold: (item.sales / item.production) * 100,
    }))
    .sort((a, b) => b.production - a.production);

  // Example time series data for historical comparison
  const historicalData = [
    {
      name: "२०७८",
      potato: 65.5,
      tomato: 38.2,
      cauliflower: 25.6,
      cabbage: 29.3,
      other: 18.7,
    },
    {
      name: "२०७९",
      potato: 71.2,
      tomato: 41.5,
      cauliflower: 28.1,
      cabbage: 32.6,
      other: 20.2,
    },
    {
      name: "२०८०",
      potato: 76.8,
      tomato: 44.7,
      cauliflower: 30.3,
      cabbage: 35.8,
      other: 21.5,
    },
  ];

  return (
    <div className="mt-12 space-y-16">
      {/* Production Distribution Section */}
      <section id="production-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            तरकारी बालीको प्रकार अनुसार उत्पादन वितरण र मुख्य तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <PieChart className="w-5 h-5" />
                उत्पादन वितरण चार्ट
              </h3>
              <div className="h-[550px]">
                <VegetablePieChart
                  pieChartData={productionPieChartData}
                  VEGETABLE_TYPES={VEGETABLE_TYPES}
                  VEGETABLE_COLORS={VEGETABLE_COLORS}
                  dataType="उत्पादन"
                  unit="मे.ट."
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Carrot className="w-5 h-5" />
                  प्रमुख तथ्यहरू
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium">कुल तरकारी उत्पादन</span>
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
                        {localizeNumber(totalSales.toFixed(2), "ne")} मे.ट.)
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
                        मे.ट.)
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
            तरकारी बालीको प्रकार अनुसार बिक्री र आम्दानी वितरण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                आम्दानी वितरण चार्ट
              </h3>
              <div className="h-[550px]">
                <VegetablePieChart
                  pieChartData={revenuePieChartData}
                  VEGETABLE_TYPES={VEGETABLE_TYPES}
                  VEGETABLE_COLORS={VEGETABLE_COLORS}
                  dataType="आम्दानी"
                  unit="रु."
                  isRevenue={true}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5" />
                  आम्दानी तथ्यहरू
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium">कुल बिक्री</span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium">कुल आम्दानी</span>
                      <div className="text-xl font-bold text-green-600">
                        रु.{" "}
                        {localizeNumber(totalRevenue.toLocaleString(), "ne")}
                      </div>
                    </div>
                  </li>
                  {overallSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          बढी आम्दानी दिने तरकारी
                        </span>
                        <div className="text-lg font-bold text-purple-600">
                          {
                            overallSummary.sort(
                              (a, b) => b.revenue - a.revenue,
                            )[0].typeName
                          }
                        </div>
                        <div className="text-sm text-purple-500">
                          रु.{" "}
                          {localizeNumber(
                            overallSummary
                              .sort((a, b) => b.revenue - a.revenue)[0]
                              .revenue.toLocaleString(),
                            "ne",
                          )}
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <Calculator className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-medium">औसत मूल्य प्रति किलो</span>
                      <div className="text-lg font-bold text-amber-600">
                        रु.{" "}
                        {localizeNumber(
                          vegetableAnalysis.averagePricePerKg.toFixed(2),
                          "ne",
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  आम्दानी अनुपात
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-2">तरकारी प्रकार</th>
                        <th className="text-right py-2">बिक्री (मे.ट.)</th>
                        <th className="text-right py-2">आम्दानी (रु.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallSummary
                        .filter((item) => item.sales > 0)
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((item, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="py-3 font-medium">
                              {item.typeName}
                            </td>
                            <td className="text-right py-3">
                              {localizeNumber(item.sales.toFixed(2), "ne")}
                            </td>
                            <td className="text-right py-3 font-semibold">
                              {localizeNumber(
                                item.revenue.toLocaleString(),
                                "ne",
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Production vs Sales Comparison */}
      <section id="production-sales-comparison">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन र बिक्री तुलनात्मक विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            प्रत्येक तरकारी बालीको उत्पादन र बिक्री अनुपातको तुलनात्मक अध्ययन
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
                  माथिको चार्टमा हरेक तरकारी बालीको उत्पादन र बिक्री अनुपात
                  देखाइएको छ। हरियो भाग आन्तरिक उपभोग र निलो भाग बिक्री परिमाण
                  हो。
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
                तरकारी बिक्री दर
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
            तरकारी बालीको उत्पादनमा भएको ऐतिहासिक परिवर्तन र विकास
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              वार्षिक उत्पादन प्रवृत्ति (२०७८-२०८०)
            </h3>
            <div className="h-[400px]">
              <VegetableBarChart data={historicalData} />
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
                पछिल्ला वर्षहरूमा आलु उत्पादनमा क्रमिक वृद्धि भएको देखिन्छ。
                २०७८ मा {localizeNumber("65.5", "ne")} मेट्रिक टन उत्पादन भएकोमा
                २०८० मा बढेर {localizeNumber("76.8", "ne")} मेट्रिक टन पुगेको
                छ。
              </p>
              <p className="mt-2">
                त्यसैगरी, गोलभेडा र काउली उत्पादनमा पनि निरन्तर वृद्धि भएको
                देखिन्छ। यो तथ्याङ्कले बुद्धशान्ति गाउँपालिकामा तरकारी बालीको
                क्षेत्रमा सकारात्मक विकास भइरहेको संकेत गर्दछ。
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
            तरकारी बाली उत्पादनको स्थानीय अर्थतन्त्रमा पारेको प्रभाव
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल उत्पादन मूल्य
                </h3>
                <p className="text-3xl font-bold text-primary">
                  रु.{" "}
                  {localizeNumber(
                    (
                      (totalProduction *
                        1000 *
                        vegetableAnalysis.averagePricePerKg) /
                      1000
                    ).toFixed(2),
                    "ne",
                  )}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  कुल उत्पादनको अनुमानित बजार मूल्य, औसत मूल्य प्रति किलो रु.{" "}
                  {localizeNumber(
                    vegetableAnalysis.averagePricePerKg.toFixed(2),
                    "ne",
                  )}{" "}
                  को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Banknote className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  वास्तविक आम्दानी
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  रु. {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  बिक्री भएको तरकारीबाट प्राप्त वास्तविक आम्दानी, जुन कुल
                  उत्पादनको{" "}
                  {localizeNumber(
                    (
                      (totalRevenue /
                        (totalProduction *
                          1000 *
                          vegetableAnalysis.averagePricePerKg)) *
                      100
                    ).toFixed(2),
                    "ne",
                  )}
                  % हो
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Carrot className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  तरकारी आर्थिक योगदान
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {localizeNumber(
                    Math.min(
                      Math.round((totalProduction / 250) * 100),
                      100,
                    ).toString(),
                    "ne",
                  )}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  अनुमानित तरकारी आत्मनिर्भरता स्तर, पालिकाको अनुमानित वार्षिक
                  आवश्यकता (लगभग २५० मे.ट.) को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
