"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ImportedProductData {
  id: string;
  productName: string;
}

interface ImportedProductsChartProps {
  data: ImportedProductData[];
}

export default function ImportedProductsChart({
  data,
}: ImportedProductsChartProps) {
  // Since imported products don't have quantity data by default,
  // we'll create a mock visualization for demonstration
  // In a real implementation, you might want to fetch additional data about import volumes

  const chartData = useMemo(() => {
    return data.map((product, index) => ({
      productName: product.productName,
      imports: Math.floor(Math.random() * 100) + 20, // Random value for demonstration
      color: `hsl(${index * (360 / data.length)}, 70%, 50%)`,
    }));
  }, [data]);

  const pieChartData = useMemo(() => {
    return data.map((product, index) => ({
      id: product.productName,
      label: product.productName,
      value: Math.floor(Math.random() * 100) + 20, // Random value for demonstration
      color: `hsl(${index * (360 / data.length)}, 70%, 50%)`,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै आयातित उत्पादनहरू उपलब्ध छैनन्। पहिले आयातित उत्पादनहरू
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>आयातित उत्पादनहरू विश्लेषण</CardTitle>
        <CardDescription>
          स्थानीय क्षेत्रमा आयातित उत्पादनहरूको समग्र दृश्य
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="px-2 py-1">
            कुल उत्पादनहरू: {data.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bar" className="mt-2">
          <TabsList>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-96 border rounded-lg p-4 bg-white">
              {data.length > 0 ? (
                <ResponsiveBar
                  data={chartData}
                  keys={["imports"]}
                  indexBy="productName"
                  margin={{ top: 50, right: 50, bottom: 120, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "nivo" }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 45,
                    legend: "उत्पादन",
                    legendPosition: "middle",
                    legendOffset: 70,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "आयात मात्रा (उदाहरणको लागि)",
                    legendPosition: "middle",
                    legendOffset: -50,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor="#ffffff"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>आयातित उत्पादनहरूको डाटा उपलब्ध छैन।</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-96 border rounded-lg p-4 bg-white">
              {data.length > 0 ? (
                <ResponsivePie
                  data={pieChartData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#ffffff"
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: "#999",
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>आयातित उत्पादनहरूको डाटा उपलब्ध छैन।</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">महत्वपूर्ण उत्पादनहरू</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data.slice(0, 9).map((product) => (
              <Card key={product.id} className="p-3">
                <div className="font-medium">{product.productName}</div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
