import { Button } from "@/components/ui/button";
import { FileDown, Search } from "lucide-react";
import ImportedProductsPieChart from "./charts/imported-products-pie-chart";
import ImportedProductsAlphabeticalList from "./charts/imported-products-alphabetical-list";
import ImportedProductsSearchBar from "./charts/imported-products-search-bar";

// Define category colors for consistency
const CATEGORY_COLORS = {
  "खाद्य पदार्थ": "#FF5733",
  "औद्योगिक सामान": "#FFC300",
  "निर्माण सामग्री": "#36A2EB",
  "कपडा तथा पोशाक": "#4BC0C0",
  इलेक्ट्रोनिक्स: "#9966FF",
  अन्य: "#808080",
};

interface ImportedProductsChartsProps {
  importedProductsData: Array<{
    id?: string;
    productName: string;
  }>;
  totalProducts: number;
  sortedGroups: Array<[string, Array<{ id?: string; productName: string }>]>;
  categoryDistribution: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function ImportedProductsCharts({
  importedProductsData,
  totalProducts,
  sortedGroups,
  categoryDistribution,
}: ImportedProductsChartsProps) {
  return (
    <>
      {/* Product category distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            आयातित उत्पादनहरूको वर्गीकरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल आयातित उत्पादन: {totalProducts.toLocaleString()} वटा
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <ImportedProductsPieChart
                pieChartData={categoryDistribution}
                CATEGORY_COLORS={CATEGORY_COLORS}
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
                    <th className="border p-2 text-left">वर्गीकरण</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryDistribution.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {item.value.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.percentage}%
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
                      {totalProducts.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            प्रमुख वर्गहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryDistribution.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[
                        item.name as keyof typeof CATEGORY_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor:
                          CATEGORY_COLORS[
                            item.name as keyof typeof CATEGORY_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alphabetical product list with search */}
      <div
        id="imported-products-categories"
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
      >
        <h2 className="scroll-m-20 border-b pb-2">
          आयातित उत्पादनहरूको वर्गीकरण
        </h2>
        <p>
          केराबारी गाउँपालिकामा आयात गरिने उत्पादनहरूलाई विभिन्न वर्गहरूमा
          विभाजन गरिएको छ। यी वर्गहरूले उपभोग्य वस्तु, औद्योगिक सामान, निर्माण
          सामग्री र अन्य महत्वपूर्ण आयातित उत्पादनहरूको प्रकृति र प्रयोग
          दर्शाउँछन्।
        </p>
      </div>

      {/* Products alphabetical listing with search */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">आयातित उत्पादनहरूको सूची</h3>
          <p className="text-sm text-muted-foreground">
            वर्णानुक्रम अनुसार क्रमबद्ध गरिएका आयातित उत्पादनहरू
          </p>
        </div>

        <div className="p-4">
          {/* Search bar */}
          <div className="mb-6">
            <ImportedProductsSearchBar
              importedProductsData={importedProductsData}
            />
          </div>

          {/* Alphabetical listing */}
          <ImportedProductsAlphabeticalList sortedGroups={sortedGroups} />
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            सम्पूर्ण सूची डाउनलोड गर्नुहोस्
          </Button>
        </div>
      </div>
    </>
  );
}
