"use client";

import Link from "next/link";
import { useEffect } from "react";

interface LoanUsageAnalysisSectionProps {
  overallSummary: Array<{
    loanUse: string;
    loanUseName: string;
    households: number;
  }>;
  totalHouseholds: number;
  loanUseLabels: Record<string, string>;
}

export default function LoanUsageAnalysisSection({
  overallSummary,
  totalHouseholds,
  loanUseLabels,
}: LoanUsageAnalysisSectionProps) {
  const LOAN_USE_COLORS = {
    AGRICULTURE: "#4CAF50", // Green
    BUSINESS: "#2196F3", // Blue
    HOUSEHOLD_EXPENSES: "#FF9800", // Orange
    FOREIGN_EMPLOYMENT: "#9C27B0", // Purple
    EDUCATION: "#3F51B5", // Indigo
    HEALTH_TREATMENT: "#F44336", // Red
    HOME_CONSTRUCTION: "#795548", // Brown
    VEHICLE_PURCHASE: "#607D8B", // Blue Grey
    CEREMONY: "#E91E63", // Pink
    OTHER: "#9E9E9E", // Grey
  };

  // Calculate productive vs. consumption loans
  const productiveCategories = [
    "AGRICULTURE",
    "BUSINESS",
    "EDUCATION",
    "FOREIGN_EMPLOYMENT",
  ];
  const consumptionCategories = [
    "HOUSEHOLD_EXPENSES",
    "HEALTH_TREATMENT",
    "HOME_CONSTRUCTION",
    "VEHICLE_PURCHASE",
    "CEREMONY",
    "OTHER",
  ];

  const productiveLoans = overallSummary
    .filter((item) => productiveCategories.includes(item.loanUse))
    .reduce((sum, item) => sum + item.households, 0);

  const consumptionLoans = overallSummary
    .filter((item) => consumptionCategories.includes(item.loanUse))
    .reduce((sum, item) => sum + item.households, 0);

  const productivePercentage = (
    (productiveLoans / totalHouseholds) *
    100
  ).toFixed(2);
  const consumptionPercentage = (
    (consumptionLoans / totalHouseholds) *
    100
  ).toFixed(2);

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Define English names for loan use categories
    const LOAN_USE_NAMES_EN: Record<string, string> = {
      AGRICULTURE: "Agriculture",
      BUSINESS: "Business",
      HOUSEHOLD_EXPENSES: "Household Expenses",
      FOREIGN_EMPLOYMENT: "Foreign Employment",
      EDUCATION: "Education",
      HEALTH_TREATMENT: "Health Treatment",
      HOME_CONSTRUCTION: "Home Construction",
      VEHICLE_PURCHASE: "Vehicle Purchase",
      CEREMONY: "Wedding/Ceremonies",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households-with-loans",
        totalHouseholds.toString(),
      );

      // Add main loan use data
      if (overallSummary[0]) {
        const loanUseNameEN =
          LOAN_USE_NAMES_EN[overallSummary[0].loanUse] ||
          overallSummary[0].loanUse;
        document.body.setAttribute(
          "data-main-loan-purpose",
          `${loanUseNameEN} / ${overallSummary[0].loanUseName}`,
        );
        document.body.setAttribute(
          "data-main-loan-purpose-households",
          overallSummary[0].households.toString(),
        );
        document.body.setAttribute(
          "data-main-loan-purpose-percentage",
          ((overallSummary[0].households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add productive vs consumption data
      document.body.setAttribute(
        "data-productive-loans-percentage",
        productivePercentage,
      );
      document.body.setAttribute(
        "data-consumption-loans-percentage",
        consumptionPercentage,
      );
      document.body.setAttribute(
        "data-productive-loans-households",
        productiveLoans.toString(),
      );
      document.body.setAttribute(
        "data-consumption-loans-households",
        consumptionLoans.toString(),
      );
    }
  }, [
    overallSummary,
    totalHouseholds,
    productivePercentage,
    consumptionPercentage,
    productiveLoans,
    consumptionLoans,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English loan use name for SEO
          const loanUseEN =
            item.loanUse === "AGRICULTURE"
              ? "Agriculture"
              : item.loanUse === "BUSINESS"
                ? "Business"
                : item.loanUse === "HOUSEHOLD_EXPENSES"
                  ? "Household Expenses"
                  : item.loanUse === "FOREIGN_EMPLOYMENT"
                    ? "Foreign Employment"
                    : item.loanUse === "EDUCATION"
                      ? "Education"
                      : item.loanUse === "HEALTH_TREATMENT"
                        ? "Health Treatment"
                        : item.loanUse === "HOME_CONSTRUCTION"
                          ? "Home Construction"
                          : item.loanUse === "VEHICLE_PURCHASE"
                            ? "Vehicle Purchase"
                            : item.loanUse === "CEREMONY"
                              ? "Wedding/Ceremonies"
                              : "Other";

          // Calculate percentage
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-loan-purpose={`${loanUseEN} / ${item.loanUseName}`}
              data-households={item.households}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.households / overallSummary[0].households) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    LOAN_USE_COLORS[
                      item.loanUse as keyof typeof LOAN_USE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.loanUseName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{loanUseEN}</span>
                </h3>
                <p className="text-2xl font-bold">{percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {item.households.toLocaleString()} घरपरिवार
                  <span className="sr-only">
                    ({item.households.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          कर्जा प्रयोजन विश्लेषण
          <span className="sr-only">Loan Purpose Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="productive-loans"
            data-percentage={productivePercentage}
          >
            <h4 className="font-medium mb-2">
              उत्पादनशील प्रयोजनका कर्जा
              <span className="sr-only">Productive Purpose Loans</span>
            </h4>
            <p className="text-3xl font-bold">{productivePercentage}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              कृषि, व्यापार, शिक्षा र वैदेशिक रोजगार:{" "}
              {productiveLoans.toLocaleString()} घरपरिवार
              <span className="sr-only">
                Agriculture, Business, Education and Foreign Employment:{" "}
                {productiveLoans.toLocaleString()} households
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="consumption-loans"
            data-percentage={consumptionPercentage}
          >
            <h4 className="font-medium mb-2">
              उपभोग प्रयोजनका कर्जा
              <span className="sr-only">Consumption Purpose Loans</span>
            </h4>
            <p className="text-3xl font-bold">{consumptionPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              घरायसी खर्च, स्वास्थ्य, घर निर्माण, सवारी साधन आदि:{" "}
              {consumptionLoans.toLocaleString()} घरपरिवार
              <span className="sr-only">
                Household expenses, health, home construction, vehicles etc.:{" "}
                {consumptionLoans.toLocaleString()} households
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          निष्कर्ष र सिफारिस
          <span className="sr-only">Conclusions and Recommendations</span>
        </h3>
        <p>
          कर्जाको प्रयोजन विश्लेषणबाट देखिन्छ कि गढवा गाउँपालिकामा{" "}
          {parseFloat(productivePercentage) > parseFloat(consumptionPercentage)
            ? "उत्पादनशील"
            : "उपभोग"}{" "}
          प्रयोजनका कर्जाहरू बढी छन्। उत्पादनशील क्षेत्रमा लगानी बढाउन र
          दीर्घकालीन आर्थिक विकासका लागि वित्तीय साक्षरता कार्यक्रमहरू संचालन
          गर्न आवश्यक छ।
        </p>
        <p className="mt-2">
          गढवा गाउँपालिकाको कर्जा प्रयोजन सम्बन्धी थप जानकारीको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक तथ्याङ्क
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
