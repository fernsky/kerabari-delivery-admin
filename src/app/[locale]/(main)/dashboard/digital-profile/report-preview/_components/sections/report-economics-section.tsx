import { MajorSkillsReport } from "./economics/major-skills-report";
import { ForeignEmploymentCountriesReport } from "./economics/foreign-employment-countries-report";
import { RemittanceAmountGroupReport } from "./economics/remittance-amount-group-report";
import { WardWiseHouseOwnershipReport } from "./economics/ward-wise-house-ownership-report";
import { WardWiseHouseOuterWallReport } from "./economics/ward-wise-house-outer-wall-report";
import { WardWiseHouseBaseReport } from "./economics/ward-wise-house-base-report";
import { RemittanceExpensesReport } from "./economics/remittance-expenses-report";

export function ReportEconomicsSection() {
  return (
    <div className="category-break">
      <h1 className="category-title">४. आर्थिक अवस्था</h1>
      
      <div className="section-content">
        <p>
          यस खण्डमा बुद्धशान्ति गाउँपालिकाको आर्थिक अवस्थाको विस्तृत विवरण प्रस्तुत गरिएको छ। 
          यसमा मानव संसाधनको सीप, वैदेशिक रोजगारी, रेमिटेन्स प्रवाह, आर्थिक गतिविधिहरू, 
          घर स्वामित्व, घरको बाहिरी भित्ता, घरको आधार, र रेमिटेन्स खर्चको विश्लेषण समावेश छ।
        </p>
      </div>

      {/* Major Skills Section */}
      <div className="section-within-category">
        <MajorSkillsReport />
      </div>

      {/* Foreign Employment Countries Section */}
      <div className="section-within-category">
        <ForeignEmploymentCountriesReport />
      </div>

      {/* Remittance Amount Group Section */}
      <div className="section-within-category">
        <RemittanceAmountGroupReport />
      </div>

      {/* Ward-wise House Ownership Section */}
      <div className="section-within-category">
        <WardWiseHouseOwnershipReport />
      </div>

      {/* Ward-wise House Outer Wall Section */}
      <div className="section-within-category">
        <WardWiseHouseOuterWallReport />
      </div>

      {/* Ward-wise House Base Section */}
      <div className="section-within-category">
        <WardWiseHouseBaseReport />
      </div>

      {/* Remittance Expenses Section */}
      <div className="section-within-category">
        <RemittanceExpensesReport />
      </div>
    </div>
  );
} 