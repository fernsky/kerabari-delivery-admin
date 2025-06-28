"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ExportedProductsAnalysisProps {
  totalProducts: number;
  categoryDistribution: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function ExportedProductsAnalysisSection({
  totalProducts,
  categoryDistribution,
}: ExportedProductsAnalysisProps) {
  const CATEGORY_COLORS = {
    "कृषि उत्पादन": "#4BC0C0",
    हस्तकला: "#FF9F40",
    "औद्योगिक उत्पादन": "#36A2EB",
    "खनिज पदार्थ": "#FFCD56",
    "प्रशोधित खाद्य": "#FF6384",
    अन्य: "#808080",
  };

  // Find the top category if it exists
  const topCategory = categoryDistribution[0];
  const secondCategory = categoryDistribution[1];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const CATEGORY_NAMES_EN: Record<string, string> = {
      "कृषि उत्पादन": "Agricultural Products",
      हस्तकला: "Handicrafts",
      "औद्योगिक उत्पादन": "Industrial Products",
      "खनिज पदार्थ": "Minerals",
      "प्रशोधित खाद्य": "Processed Food",
      अन्य: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-exported-products",
        totalProducts.toString(),
      );

      // Add main category data
      if (topCategory) {
        const categoryNameEN =
          CATEGORY_NAMES_EN[topCategory.name] || topCategory.name;
        document.body.setAttribute(
          "data-main-export-category",
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
          "data-second-export-category",
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
            item.name === "कृषि उत्पादन"
              ? "Agricultural Products"
              : item.name === "हस्तकला"
                ? "Handicrafts"
                : item.name === "औद्योगिक उत्पादन"
                  ? "Industrial Products"
                  : item.name === "खनिज पदार्थ"
                    ? "Minerals"
                    : item.name === "प्रशोधित खाद्य"
                      ? "Processed Food"
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
          निर्यात विश्लेषण
          <span className="sr-only">Export Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-category"
            data-category-name={topCategory?.name}
            data-category-percentage={topCategory?.percentage || "0"}
          >
            <h4 className="font-medium mb-2">
              प्रमुख निर्यात वर्ग
              <span className="sr-only">
                Main Export Category in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topCategory ? topCategory.name : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCategory
                ? `कुल निर्यातको ${topCategory.percentage}% वस्तुहरू`
                : ""}
              <span className="sr-only">
                {topCategory
                  ? `${topCategory.percentage}% of total exports in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="export-stats"
            data-total-products={totalProducts}
            data-categories-count={categoryDistribution.length}
          >
            <h4 className="font-medium mb-2">
              निर्यात तथ्याङ्क
              <span className="sr-only">Export Statistics in Khajura</span>
            </h4>
            <p className="text-3xl font-bold">
              {totalProducts.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल निर्यातित उत्पादन ({categoryDistribution.length} वर्गमा
              विभाजित)
              <span className="sr-only">
                Total exported products (divided into{" "}
                {categoryDistribution.length} categories) in Khajura Rural
                Municipality
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-4">
          निर्यात सम्भावना विश्लेषण
          <span className="sr-only">
            Export Potential Analysis for Khajura Rural Municipality
          </span>
        </h3>

        <div className="space-y-4 mt-3">
          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1">बजार सम्भावना</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">75%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              अन्तरराष्ट्रिय र राष्ट्रिय बजारमा बुद्धशान्ति निर्यातको सम्भावना
              उच्च छ
            </p>
          </div>

          <div className="bg-card p-3 rounded border">
            <h4 className="font-medium mb-1">प्रतिस्पर्धात्मकता</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "62%" }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">62%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              बुद्धशान्तिका उत्पादनहरू गुणस्तर र मूल्यमा प्रतिस्पर्धी छन्
            </p>
          </div>
        </div>

        <p className="mt-5">
          बुद्धशान्ति गाउँपालिकाको निर्यात प्रवर्द्धन रणनीति सम्बन्धी थप
          जानकारीको लागि, कृपया{" "}
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
