"use client";

import Link from "next/link";
import { useEffect } from "react";

interface RemittanceExpensesAnalysisSectionProps {
  overallSummary: Array<{
    expense: string;
    expenseName: string;
    households: number;
  }>;
  totalHouseholds: number;
  remittanceExpenseLabels: Record<string, string>;
  EXPENSE_NAMES_EN: Record<string, string>;
}

export default function RemittanceExpensesAnalysisSection({
  overallSummary,
  totalHouseholds,
  remittanceExpenseLabels,
  EXPENSE_NAMES_EN,
}: RemittanceExpensesAnalysisSectionProps) {
  const EXPENSE_COLORS = {
    EDUCATION: "#FF5733",
    HEALTH: "#FFC300",
    HOUSEHOLD_USE: "#36A2EB",
    FESTIVALS: "#4BC0C0",
    LOAN_PAYMENT: "#9966FF",
    LOANED_OTHERS: "#3CB371",
    SAVING: "#FF6384",
    HOUSE_CONSTRUCTION: "#FFCE56",
    LAND_OWNERSHIP: "#C9CBCF",
    JEWELRY_PURCHASE: "#FF9F40",
    GOODS_PURCHASE: "#4CAF50",
    BUSINESS_INVESTMENT: "#9C27B0",
    OTHER: "#607D8B",
    UNKNOWN: "#757575",
  };

  // Calculate expense categories
  const consumptionExpenses = [
    "HOUSEHOLD_USE",
    "FESTIVALS",
    "GOODS_PURCHASE",
    "HEALTH",
    "EDUCATION",
  ];
  const investmentExpenses = [
    "BUSINESS_INVESTMENT",
    "HOUSE_CONSTRUCTION",
    "LAND_OWNERSHIP",
    "JEWELRY_PURCHASE", // Could be considered as investment in many contexts
  ];
  const financialExpenses = ["LOAN_PAYMENT", "LOANED_OTHERS", "SAVING"];

  // Calculate households by expense category
  const consumptionHouseholds = overallSummary
    .filter((item) => consumptionExpenses.includes(item.expense))
    .reduce((sum, item) => sum + item.households, 0);

  const investmentHouseholds = overallSummary
    .filter((item) => investmentExpenses.includes(item.expense))
    .reduce((sum, item) => sum + item.households, 0);

  const financialHouseholds = overallSummary
    .filter((item) => financialExpenses.includes(item.expense))
    .reduce((sum, item) => sum + item.households, 0);

  const otherHouseholds =
    totalHouseholds -
    consumptionHouseholds -
    investmentHouseholds -
    financialHouseholds;

  // Calculate top two expense ratio if both exist
  const topExpense = overallSummary[0];
  const secondExpense = overallSummary[1];

  const topTwoExpenseRatio =
    topExpense && secondExpense && secondExpense.households > 0
      ? (topExpense.households / secondExpense.households).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-remittance-households",
        totalHouseholds.toString(),
      );

      // Add main expense data
      if (topExpense) {
        const expenseNameEN =
          EXPENSE_NAMES_EN[topExpense.expense] || topExpense.expense;
        document.body.setAttribute(
          "data-main-expense",
          `${expenseNameEN} / ${topExpense.expenseName}`,
        );
        document.body.setAttribute(
          "data-main-expense-households",
          topExpense.households.toString(),
        );
        document.body.setAttribute(
          "data-main-expense-percentage",
          ((topExpense.households / totalHouseholds) * 100).toFixed(2),
        );
      }

      // Add expense category data
      document.body.setAttribute(
        "data-consumption-expenses-percentage",
        ((consumptionHouseholds / totalHouseholds) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-investment-expenses-percentage",
        ((investmentHouseholds / totalHouseholds) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-financial-expenses-percentage",
        ((financialHouseholds / totalHouseholds) * 100).toFixed(2),
      );
    }
  }, [
    overallSummary,
    totalHouseholds,
    topExpense,
    consumptionHouseholds,
    investmentHouseholds,
    financialHouseholds,
    EXPENSE_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
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
              data-expense={`${EXPENSE_NAMES_EN[item.expense] || item.expense} / ${item.expenseName}`}
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
                    EXPENSE_COLORS[
                      item.expense as keyof typeof EXPENSE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.expenseName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {EXPENSE_NAMES_EN[item.expense] || item.expense}
                  </span>
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
          विप्रेषण खर्च विश्लेषण
          <span className="sr-only">
            Remittance Expense Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="top-expense"
            data-expense-name={topExpense?.expense}
            data-expense-percentage={
              topExpense
                ? ((topExpense.households / totalHouseholds) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख खर्च प्रकार
              <span className="sr-only">
                Main Expense Type in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topExpense ? topExpense.expenseName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topExpense
                ? `विप्रेषण प्राप्त घरपरिवार मध्ये ${((topExpense.households / totalHouseholds) * 100).toFixed(2)}% ले प्रयोग गरेको`
                : ""}
              <span className="sr-only">
                {topExpense
                  ? `${((topExpense.households / totalHouseholds) * 100).toFixed(2)}% of households receiving remittances in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="expense-ratio"
            data-ratio={topTwoExpenseRatio}
            data-primary-expense={topExpense?.expense}
            data-secondary-expense={secondExpense?.expense}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो खर्च अनुपात
              <span className="sr-only">
                Primary to Secondary Expense Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">{topTwoExpenseRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topExpense && secondExpense
                ? `हरेक ${topTwoExpenseRatio} ${topExpense.expenseName} खर्च गर्ने घरपरिवार पिछे 1 ${secondExpense.expenseName} खर्च गर्ने घरपरिवार`
                : ""}
              <span className="sr-only">
                {topExpense && secondExpense
                  ? `For every ${topTwoExpenseRatio} households spending on ${EXPENSE_NAMES_EN[topExpense.expense]}, there is 1 household spending on ${EXPENSE_NAMES_EN[secondExpense.expense]} in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-4">
        <h4 className="font-medium mb-4">
          खर्च प्रकृति अनुसार वितरण
          <span className="sr-only">Distribution by Expense Categories</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">उपभोग खर्चहरू</h5>
            <p className="text-sm flex justify-between">
              <span>{consumptionHouseholds.toLocaleString()} घरपरिवार</span>
              <span className="font-medium">
                {((consumptionHouseholds / totalHouseholds) * 100).toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${(consumptionHouseholds / totalHouseholds) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">लगानी खर्चहरू</h5>
            <p className="text-sm flex justify-between">
              <span>{investmentHouseholds.toLocaleString()} घरपरिवार</span>
              <span className="font-medium">
                {((investmentHouseholds / totalHouseholds) * 100).toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{
                  width: `${(investmentHouseholds / totalHouseholds) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">वित्तीय खर्चहरू</h5>
            <p className="text-sm flex justify-between">
              <span>{financialHouseholds.toLocaleString()} घरपरिवार</span>
              <span className="font-medium">
                {((financialHouseholds / totalHouseholds) * 100).toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${(financialHouseholds / totalHouseholds) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Remittance Expenses in Khajura
          </span>
        </h3>
        <p>
          गढवा गाउँपालिकाको विप्रेषण खर्च सम्बन्धी थप जानकारी वा विस्तृत
          तथ्याङ्कको लागि, कृपया{" "}
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
