export interface RemittanceExpensesData {
  id: string;
  wardNumber: number;
  remittanceExpense: string;
  households: number;
}

export interface ProcessedRemittanceExpensesData {
  totalHouseholds: number;
  expenseData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    expenses: Record<string, number>;
    primaryExpense: string;
    primaryExpensePercentage: number;
  }>;
  topExpenses: Array<{
    expense: string;
    households: number;
    percentage: number;
    label: string;
  }>;
}

export const REMITTANCE_EXPENSE_LABELS: Record<string, string> = {
  education: "शिक्षा",
  health: "स्वास्थ्य",
  household_use: "घरायसी प्रयोग",
  festivals: "चाडपर्व",
  loan_payment: "ऋण भुक्तानी",
  loaned_others: "अरूलाई ऋण दिएको",
  saving: "बचत",
  house_construction: "घर निर्माण",
  land_ownership: "जग्गा खरिद",
  jewelry_purchase: "गहना खरिद",
  jwellery_purchase: "गहना खरिद",
  goods_purchase: "सामान खरिद",
  business_investment: "व्यवसायमा लगानी",
  other: "अन्य",
  unknown: "थाहा छैन",
};

export function processRemittanceExpensesData(rawData: RemittanceExpensesData[]): ProcessedRemittanceExpensesData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      expenseData: {},
      wardData: {},
      topExpenses: [],
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process expense data
  const expenseData: Record<string, any> = {};
  const allExpenses: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const expenseInfo = {
      households: item.households,
      percentage,
      label: REMITTANCE_EXPENSE_LABELS[item.remittanceExpense] || REMITTANCE_EXPENSE_LABELS[item.remittanceExpense.toLowerCase()] || item.remittanceExpense,
      rank: index + 1,
    };

    if (expenseData[item.remittanceExpense]) {
      expenseData[item.remittanceExpense].households += item.households;
      expenseData[item.remittanceExpense].percentage = totalHouseholds > 0 ? (expenseData[item.remittanceExpense].households / totalHouseholds) * 100 : 0;
    } else {
      expenseData[item.remittanceExpense] = expenseInfo;
      allExpenses.push({
        expense: item.remittanceExpense,
        ...expenseInfo,
      });
    }
  });

  // Sort expenses by households
  allExpenses.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allExpenses.forEach((expense, index) => {
    expenseData[expense.expense].rank = index + 1;
  });

  // Get top 5 expenses
  const topExpenses = allExpenses.slice(0, 5).map(expense => ({
    expense: expense.expense,
    households: expense.households,
    percentage: expense.percentage,
    label: expense.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardExpenses: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardExpenses[item.remittanceExpense]) {
        wardExpenses[item.remittanceExpense] += item.households;
      } else {
        wardExpenses[item.remittanceExpense] = item.households;
      }
    });

    // Find primary expense for this ward
    const sortedWardExpenses = Object.entries(wardExpenses).sort(([, a], [, b]) => b - a);
    const primaryExpense = sortedWardExpenses[0]?.[0] || '';
    const primaryExpensePercentage = wardTotalHouseholds > 0 
      ? (sortedWardExpenses[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      expenses: wardExpenses,
      primaryExpense,
      primaryExpensePercentage,
    };
  });

  return {
    totalHouseholds,
    expenseData,
    wardData,
    topExpenses,
  };
}

export function generateRemittanceExpensesAnalysis(data: ProcessedRemittanceExpensesData): string {
  if (data.totalHouseholds === 0) {
    return "रेमिटेन्स खर्च सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  // Calculate expense categories for detailed analysis - using lowercase enum names
  const consumptionExpenses = ['household_use', 'festivals', 'goods_purchase', 'health', 'education'];
  const investmentExpenses = ['business_investment', 'house_construction', 'land_ownership', 'jewelry_purchase', 'jwellery_purchase'];
  const financialExpenses = ['loan_payment', 'loaned_others', 'saving'];

  const consumptionHouseholds = Object.entries(data.expenseData)
    .filter(([expense]) => consumptionExpenses.includes(expense))
    .reduce((sum, [, data]) => sum + data.households, 0);

  const investmentHouseholds = Object.entries(data.expenseData)
    .filter(([expense]) => investmentExpenses.includes(expense))
    .reduce((sum, [, data]) => sum + data.households, 0);

  const financialHouseholds = Object.entries(data.expenseData)
    .filter(([expense]) => financialExpenses.includes(expense))
    .reduce((sum, [, data]) => sum + data.households, 0);

  const consumptionPercentage = (consumptionHouseholds / data.totalHouseholds) * 100;
  const investmentPercentage = (investmentHouseholds / data.totalHouseholds) * 100;
  const financialPercentage = (financialHouseholds / data.totalHouseholds) * 100;

  // Find ward with highest and lowest households
  const wardEntries = Object.entries(data.wardData);
  const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
    wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, expenses: {}, primaryExpense: '', primaryExpensePercentage: 0 });

  const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
    wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, expenses: {}, primaryExpense: '', primaryExpensePercentage: 0 });

  // Find most diverse ward (ward with most different expense types)
  const mostDiverseWard = wardEntries.reduce((most, [wardNum, wardData]) => 
    Object.keys(wardData.expenses).length > Object.keys(most.expenses).length ? { wardNum, ...wardData } : most
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, expenses: {}, primaryExpense: '', primaryExpensePercentage: 0 });

  // Get proper Nepali label for primary expense
  const getPrimaryExpenseLabel = (expense: string) => {
    return REMITTANCE_EXPENSE_LABELS[expense] || REMITTANCE_EXPENSE_LABELS[expense.toLowerCase()] || expense;
  };

  const analysis = `
    गढवा गाउँपालिकाको रेमिटेन्स खर्च विश्लेषणले स्थानीय अर्थतन्त्रको गहन अध्ययन प्रस्तुत गर्दैछ, जसमा कुल ${convertToNepaliNumber(data.totalHouseholds)} परिवारले विदेशबाट प्राप्त विप्रेषण रकमको विभिन्न प्रकारको उपयोग गर्दै आएका छन्। यो तथ्याङ्कले न केवल स्थानीय आर्थिक प्राथमिकताहरूको प्रतिबिम्ब प्रस्तुत गर्दछ, तर यसले गाउँपालिकाको विकासको दिशा र रणनीतिक योजनाहरूको लागि महत्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।

    सर्वेक्षणको परिणाम अनुसार, गाउँपालिकामा रेमिटेन्सको सबैभन्दा प्रमुख उपयोग ${data.topExpenses[0]?.label || 'घरायसी प्रयोग'} क्षेत्रमा रहेको छ, जसमा ${convertToNepaliNumber(data.topExpenses[0]?.households || 0)} परिवार (${formatNepaliPercentage(data.topExpenses[0]?.percentage || 0)}) ले यस्तो खर्च गर्दै आएका छन्। यो तथ्यले स्थानीय परिवारहरूको आधारभूत आवश्यकताहरूको प्राथमिकतालाई प्रतिबिम्बित गर्दछ र यसले गाउँपालिकाको सामाजिक-आर्थिक विकासको लागि महत्वपूर्ण संकेत प्रदान गर्दछ। दोस्रो स्थानमा ${data.topExpenses[1]?.label || 'शिक्षा'} क्षेत्रमा ${convertToNepaliNumber(data.topExpenses[1]?.households || 0)} परिवार (${formatNepaliPercentage(data.topExpenses[1]?.percentage || 0)}) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय समुदायको शैक्षिक विकासमा रेमिटेन्सको महत्वपूर्ण भूमिकालाई प्रदर्शन गर्दछ।

    वडागत विश्लेषणले गाउँपालिकाको आन्तरिक आर्थिक विविधताको चित्र प्रस्तुत गर्दछ। वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} परिवार रेमिटेन्स प्राप्त गर्दै आएका छन्, जसले यस वडाको विदेशी रोजगारीको उच्च स्तर र आर्थिक गतिविधिको सघनतालाई प्रतिबिम्बित गर्दछ। यस वडामा ${getPrimaryExpenseLabel(highestWard.primaryExpense)} क्षेत्रमा सबैभन्दा बढी खर्च गरिएको छ, जसमा ${formatNepaliPercentage(highestWard.primaryExpensePercentage)} परिवार समावेश छन्। यसको विपरीत, वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} परिवार रेमिटेन्स प्राप्त गर्दै आएका छन्, जसले यस क्षेत्रको विदेशी रोजगारीको न्यूनतम स्तर र स्थानीय आर्थिक गतिविधिको सीमिततालाई प्रतिबिम्बित गर्दछ।

    खर्च प्रकृति अनुसारको विश्लेषणले गाउँपालिकाको आर्थिक विकासको दिशालाई स्पष्ट रूपमा प्रदर्शन गर्दछ। उपभोग खर्चहरूमा ${convertToNepaliNumber(consumptionHouseholds)} परिवार (${formatNepaliPercentage(consumptionPercentage)}) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय बजारको गतिविधि र आर्थिक प्रवाहलाई बढाउन महत्वपूर्ण योगदान पुर्‍याउँछ। यसको साथै, लगानी खर्चहरूमा ${convertToNepaliNumber(investmentHouseholds)} परिवार (${formatNepaliPercentage(investmentPercentage)}) ले रेमिटेन्सको उपयोग गर्दै आएका छन्, जसले दीर्घकालीन आर्थिक विकास र स्थायी समृद्धिको लागि आधार तयार पार्दछ। वित्तीय खर्चहरूमा ${convertToNepaliNumber(financialHouseholds)} परिवार (${formatNepaliPercentage(financialPercentage)}) ले रेमिटेन्स खर्च गर्दै आएका छन्, जसले स्थानीय वित्तीय प्रणालीको सुदृढीकरण र आर्थिक सुरक्षाको लागि महत्वपूर्ण योगदान पुर्‍याउँछ।

    वडा नं. ${convertToNepaliNumber(parseInt(mostDiverseWard.wardNum))} मा सबैभन्दा विविध प्रकारको रेमिटेन्स खर्च पाइएको छ, जसमा ${convertToNepaliNumber(Object.keys(mostDiverseWard.expenses).length)} विभिन्न खर्च प्रकारहरू समावेश छन्। यसले यस वडाको आर्थिक विविधीकरण र विकासको उच्च स्तरलाई प्रतिबिम्बित गर्दछ। यस्तो विविधीकरणले स्थानीय अर्थतन्त्रको लचीलापन र स्थायित्वलाई बढाउन महत्वपूर्ण योगदान पुर्‍याउँछ।

    यस तथ्याङ्कको आधारमा, गाउँपालिकाले रेमिटेन्सको प्रभावकारी उपयोग र स्थानीय आर्थिक विकासको लागि विभिन्न नीतिगत पहलहरू गर्न सक्छन्। सर्वप्रथम, शैक्षिक क्षेत्रमा रेमिटेन्सको उच्च उपयोगले स्थानीय शैक्षिक सुविधाहरूको विस्तार र गुणस्तर सुधारको लागि नीतिगत ध्यान दिन आवश्यक छ। दोस्रोत, लगानी खर्चहरूको सीमित प्रतिशतले उत्पादनशील क्षेत्रहरूमा लगानी प्रवर्द्धन कार्यक्रमहरूको आवश्यकतालाई प्रकट गर्दछ। तेस्रोत, वित्तीय साक्षरता र बचत प्रवर्द्धन कार्यक्रमहरूले रेमिटेन्सको दीर्घकालीन लाभ प्राप्त गर्न सहयोग गर्न सक्छन्।

    राष्ट्रिय र अन्तर्राष्ट्रिय तुलनामा हेर्दा, गढवा गाउँपालिकाको रेमिटेन्स खर्च प्रवृत्ति नेपालको अन्य ग्रामीण क्षेत्रहरूसँग मिल्दोजुल्दो छ, तर यहाँको शैक्षिक खर्चको उच्च प्रतिशतले स्थानीय समुदायको शैक्षिक जागरूकताको उच्च स्तरलाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको मानव पूँजी विकास र भविष्यको आर्थिक समृद्धिको लागि आशावादी संकेत प्रदान गर्दछ।

    भविष्यको नीतिगत दिशानिर्देशको लागि, गाउँपालिकाले रेमिटेन्सको उत्पादनशील उपयोग प्रवर्द्धन, वित्तीय साक्षरता कार्यक्रमहरूको विस्तार, र स्थानीय उद्यम विकासको लागि विशेष पहलहरू गर्न सक्छन्। यसले न केवल रेमिटेन्सको दीर्घकालीन लाभ प्राप्त गर्न सहयोग गर्नेछ, तर यसले गाउँपालिकाको समग्र आर्थिक विकास र सामाजिक प्रगतिको लागि पनि महत्वपूर्ण योगदान पुर्‍याउनेछ।
  `;

  return analysis.trim();
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 