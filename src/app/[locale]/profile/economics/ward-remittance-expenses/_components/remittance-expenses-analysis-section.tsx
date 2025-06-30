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
    "JEWELRY_PURCHASE",
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

  // Calculate percentages
  const consumptionPercentage = (consumptionHouseholds / totalHouseholds) * 100;
  const investmentPercentage = (investmentHouseholds / totalHouseholds) * 100;
  const financialPercentage = (financialHouseholds / totalHouseholds) * 100;
  const otherPercentage = (otherHouseholds / totalHouseholds) * 100;

  // Find top expenses for detailed analysis
  const topExpense = overallSummary[0];
  const secondExpense = overallSummary[1];
  const thirdExpense = overallSummary[2];

  // Calculate expense ratios for analysis
  const topTwoExpenseRatio =
    topExpense && secondExpense && secondExpense.households > 0
      ? (topExpense.households / secondExpense.households).toFixed(2)
      : "N/A";

  const topThreeExpenseRatio =
    topExpense && thirdExpense && thirdExpense.households > 0
      ? (topExpense.households / thirdExpense.households).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-remittance-households",
        totalHouseholds.toString(),
      );

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

      document.body.setAttribute(
        "data-consumption-expenses-percentage",
        consumptionPercentage.toFixed(2),
      );
      document.body.setAttribute(
        "data-investment-expenses-percentage",
        investmentPercentage.toFixed(2),
      );
      document.body.setAttribute(
        "data-financial-expenses-percentage",
        financialPercentage.toFixed(2),
      );
    }
  }, [
    overallSummary,
    totalHouseholds,
    topExpense,
    consumptionPercentage,
    investmentPercentage,
    financialPercentage,
    EXPENSE_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          const percentage = (
            (item.households / totalHouseholds) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
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

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-6">
          विस्तृत रेमिटेन्स खर्च विश्लेषण
          <span className="sr-only">
            Comprehensive Remittance Expense Analysis of Khajura Rural Municipality
          </span>
        </h3>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-justify leading-relaxed">
            गढवा गाउँपालिकाको रेमिटेन्स खर्च विश्लेषणले स्थानीय अर्थतन्त्रको गहन अध्ययन प्रस्तुत गर्दैछ, जसमा कुल {totalHouseholds.toLocaleString()} परिवारले विदेशबाट प्राप्त विप्रेषण रकमको विभिन्न प्रकारको उपयोग गर्दै आएका छन्। यो तथ्याङ्कले न केवल स्थानीय आर्थिक प्राथमिकताहरूको प्रतिबिम्ब प्रस्तुत गर्दछ, तर यसले गाउँपालिकाको विकासको दिशा र रणनीतिक योजनाहरूको लागि महत्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। सर्वेक्षणको परिणाम अनुसार, गाउँपालिकामा रेमिटेन्सको सबैभन्दा प्रमुख उपयोग {topExpense?.expenseName || 'घरायसी प्रयोग'} क्षेत्रमा रहेको छ, जसमा {topExpense?.households.toLocaleString() || '0'} परिवार ({((topExpense?.households || 0) / totalHouseholds * 100).toFixed(2)}%) ले यस्तो खर्च गर्दै आएका छन्। यो तथ्यले स्थानीय परिवारहरूको आधारभूत आवश्यकताहरूको प्राथमिकतालाई प्रतिबिम्बित गर्दछ र यसले गाउँपालिकाको सामाजिक-आर्थिक विकासको लागि महत्वपूर्ण संकेत प्रदान गर्दछ।
          </p>

          <p className="text-justify leading-relaxed">
            दोस्रो स्थानमा {secondExpense?.expenseName || 'शैक्षा'} क्षेत्रमा {secondExpense?.households.toLocaleString() || '0'} परिवार ({((secondExpense?.households || 0) / totalHouseholds * 100).toFixed(2)}%) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय समुदायको शैक्षिक विकासमा रेमिटेन्सको महत्वपूर्ण भूमिकालाई प्रदर्शन गर्दछ। यसको साथै, तेस्रो स्थानमा {thirdExpense?.expenseName || 'स्वास्थ्य'} क्षेत्रमा {thirdExpense?.households.toLocaleString() || '0'} परिवार ({((thirdExpense?.households || 0) / totalHouseholds * 100).toFixed(2)}%) ले रेमिटेन्स खर्च गर्दै आएका छन्। यी तीनै क्षेत्रहरूले स्थानीय समुदायको मानव पूँजी विकास र सामाजिक सुरक्षाको लागि महत्वपूर्ण योगदान पुर्‍याउँछन्।
          </p>

          <p className="text-justify leading-relaxed">
            खर्च प्रकृति अनुसारको विश्लेषणले गाउँपालिकाको आर्थिक विकासको दिशालाई स्पष्ट रूपमा प्रदर्शन गर्दछ। उपभोग खर्चहरूमा {consumptionHouseholds.toLocaleString()} परिवार ({consumptionPercentage.toFixed(2)}%) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय बजारको गतिविधि र आर्थिक प्रवाहलाई बढाउन महत्वपूर्ण योगदान पुर्‍याउँछ। यसको साथै, लगानी खर्चहरूमा {investmentHouseholds.toLocaleString()} परिवार ({investmentPercentage.toFixed(2)}%) ले रेमिटेन्सको उपयोग गर्दै आएका छन्, जसले दीर्घकालीन आर्थिक विकास र स्थायी समृद्धिको लागि आधार तयार पार्दछ। वित्तीय खर्चहरूमा {financialHouseholds.toLocaleString()} परिवार ({financialPercentage.toFixed(2)}%) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय वित्तीय प्रणालीको सुदृढीकरण र आर्थिक सुरक्षाको लागि महत्वपूर्ण योगदान पुर्‍याउँछ।
          </p>

          <p className="text-justify leading-relaxed">
            यस तथ्याङ्कको आधारमा, गाउँपालिकाले रेमिटेन्सको प्रभावकारी उपयोग र स्थानीय आर्थिक विकासको लागि विभिन्न नीतिगत पहलहरू गर्न सक्छन्। सर्वप्रथम, शैक्षिक क्षेत्रमा रेमिटेन्सको उच्च उपयोगले स्थानीय शैक्षिक सुविधाहरूको विस्तार र गुणस्तर सुधारको लागि नीतिगत ध्यान दिन आवश्यक छ। दोस्रोत, लगानी खर्चहरूको सीमित प्रतिशतले उत्पादनशील क्षेत्रहरूमा लगानी प्रवर्द्धन कार्यक्रमहरूको आवश्यकतालाई प्रकट गर्दछ। तेस्रोत, वित्तीय साक्षरता र बचत प्रवर्द्धन कार्यक्रमहरूले रेमिटेन्सको दीर्घकालीन लाभ प्राप्त गर्न सहयोग गर्न सक्छन्। यसले न केवल रेमिटेन्सको दीर्घकालीन लाभ प्राप्त गर्न सहयोग गर्नेछ, तर यसले गाउँपालिकाको समग्र आर्थिक विकास र सामाजिक प्रगतिको लागि पनि महत्वपूर्ण योगदान पुर्‍याउनेछ।
          </p>

          <p className="text-justify leading-relaxed">
            राष्ट्रिय र अन्तर्राष्ट्रिय तुलनामा हेर्दा, गढवा गाउँपालिकाको रेमिटेन्स खर्च प्रवृत्ति नेपालको अन्य ग्रामीण क्षेत्रहरूसँग मिल्दोजुल्दो छ, तर यहाँको शैक्षिक खर्चको उच्च प्रतिशतले स्थानीय समुदायको शैक्षिक जागरूकताको उच्च स्तरलाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको मानव पूँजी विकास र भविष्यको आर्थिक समृद्धिको लागि आशावादी संकेत प्रदान गर्दछ। भविष्यको नीतिगत दिशानिर्देशको लागि, गाउँपालिकाले रेमिटेन्सको उत्पादनशील उपयोग प्रवर्द्धन, वित्तीय साक्षरता कार्यक्रमहरूको विस्तार, र स्थानीय उद्यम विकासको लागि विशेष पहलहरू गर्न सक्छन्।
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
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
                {consumptionPercentage.toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${consumptionPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">लगानी खर्चहरू</h5>
            <p className="text-sm flex justify-between">
              <span>{investmentHouseholds.toLocaleString()} घरपरिवार</span>
              <span className="font-medium">
                {investmentPercentage.toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{
                  width: `${investmentPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">वित्तीय खर्चहरू</h5>
            <p className="text-sm flex justify-between">
              <span>{financialHouseholds.toLocaleString()} घरपरिवार</span>
              <span className="font-medium">
                {financialPercentage.toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${financialPercentage}%`,
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
          केराबारी गाउँपालिकाको विप्रेषण खर्च सम्बन्धी थप जानकारी वा विस्तृत
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
