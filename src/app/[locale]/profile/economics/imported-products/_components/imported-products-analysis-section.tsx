"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ImportedProductsAnalysisProps {
  totalProducts: number;
  categoryDistribution: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function ImportedProductsAnalysisSection({
  totalProducts,
  categoryDistribution,
}: ImportedProductsAnalysisProps) {
  const CATEGORY_COLORS = {
    "खाद्य पदार्थ": "#FF5733",
    "औद्योगिक सामान": "#FFC300",
    "निर्माण सामग्री": "#36A2EB",
    "कपडा तथा पोशाक": "#4BC0C0",
    इलेक्ट्रोनिक्स: "#9966FF",
    अन्य: "#808080",
  };

  // Find the top category if it exists
  const topCategory = categoryDistribution[0];
  const secondCategory = categoryDistribution[1];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const CATEGORY_NAMES_EN: Record<string, string> = {
      "खाद्य पदार्थ": "Food Products",
      "औद्योगिक सामान": "Industrial Goods",
      "निर्माण सामग्री": "Construction Materials",
      "कपडा तथा पोशाक": "Textiles and Clothing",
      इलेक्ट्रोनिक्स: "Electronics",
      अन्य: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-imported-products",
        totalProducts.toString(),
      );

      // Add main category data
      if (topCategory) {
        const categoryNameEN =
          CATEGORY_NAMES_EN[topCategory.name] || topCategory.name;
        document.body.setAttribute(
          "data-main-import-category",
          `${categoryNameEN} / ${topCategory.name}`,
        );
        document.body.setAttribute(
          "data-main-category-count",
          topCategory.value.toString(),
        );
        document.body.setAttribute(
          "data-main-category-percentage",
          topCategory.percentage,
        );
      }

      // Add second category data
      if (secondCategory) {
        const categoryNameEN =
          CATEGORY_NAMES_EN[secondCategory.name] || secondCategory.name;
        document.body.setAttribute(
          "data-second-import-category",
          `${categoryNameEN} / ${secondCategory.name}`,
        );
        document.body.setAttribute(
          "data-second-category-count",
          secondCategory.value.toString(),
        );
        document.body.setAttribute(
          "data-second-category-percentage",
          secondCategory.percentage,
        );
      }
    }
  }, [categoryDistribution, totalProducts]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {categoryDistribution.map((item, index) => {
          // Define English category name for SEO
          const categoryEN =
            item.name === "खाद्य पदार्थ"
              ? "Food Products"
              : item.name === "औद्योगिक सामान"
                ? "Industrial Goods"
                : item.name === "निर्माण सामग्री"
                  ? "Construction Materials"
                  : item.name === "कपडा तथा पोशाक"
                    ? "Textiles and Clothing"
                    : item.name === "इलेक्ट्रोनिक्स"
                      ? "Electronics"
                      : "Other";

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-category={`${categoryEN} / ${item.name}`}
              data-count={item.value}
              data-percentage={item.percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (parseFloat(item.percentage) /
                      parseFloat(categoryDistribution[0].percentage)) *
                      100,
                    100,
                  )}%`,
                  backgroundColor:
                    CATEGORY_COLORS[
                      item.name as keyof typeof CATEGORY_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.name}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{categoryEN}</span>
                </h3>
                <p className="text-2xl font-bold">{item.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {item.value.toLocaleString()} वटा
                  <span className="sr-only">
                    ({item.value.toLocaleString()} items)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          आयात विश्लेषण
          <span className="sr-only">Import Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-category"
            data-category-name={topCategory?.name}
            data-category-percentage={topCategory?.percentage || "0"}
          >
            <h4 className="font-medium mb-2">
              प्रमुख आयात वर्ग
              <span className="sr-only">
                Main Import Category in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topCategory ? topCategory.name : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCategory
                ? `कुल आयातको ${topCategory.percentage}% वस्तुहरू`
                : ""}
              <span className="sr-only">
                {topCategory
                  ? `${topCategory.percentage}% of total imports in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="import-stats"
            data-total-products={totalProducts}
            data-categories-count={categoryDistribution.length}
          >
            <h4 className="font-medium mb-2">
              आयात तथ्याङ्क
              <span className="sr-only">Import Statistics in Khajura</span>
            </h4>
            <p className="text-3xl font-bold">
              {totalProducts.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल आयातित उत्पादन ({categoryDistribution.length} वर्गमा विभाजित)
              <span className="sr-only">
                Total imported products (divided into{" "}
                {categoryDistribution.length} categories) in Khajura Rural
                Municipality
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          आयात रणनीति
          <span className="sr-only">
            Import Strategy for Khajura Rural Municipality
          </span>
        </h3>
        <p>
          गढवा गाउँपालिकाको आयात प्रतिस्थापन तथा स्थानीय उत्पादन प्रवर्द्धन
          रणनीति सम्बन्धी थप जानकारीको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक प्रोफाइल
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
