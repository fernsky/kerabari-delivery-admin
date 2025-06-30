import { DemographicSummaryReport } from "./demographics/demographic-summary-report";
import { AgeGenderReport } from "./demographics/age-gender-report";
import { LanguageReport } from "./demographics/language-report";
import { CasteReport } from "./demographics/caste-report";
import { ReligionReport } from "./demographics/religion-report";
import { HouseheadGenderReport } from "./demographics/househead-gender-report";
// import { OccupationReport } from "./demographics/occupation-report";
import { EconomicallyActiveReport } from "./demographics/economically-active-report";
import { DisabilityCauseReport } from "./demographics/disability-cause-report";
import { DeathCauseReport } from "./demographics/death-cause-report";
import { DeathRegistrationReport } from "./demographics/death-registration-report";
import { WardWiseMigratedHouseholdsReport } from "./demographics/ward-wise-migrated-households-report";
import { WardWiseBirthplaceHouseholdsReport } from "./demographics/ward-wise-birthplace-households-report";
import { WardWiseBirthCertificatePopulationReport } from "./demographics/ward-wise-birth-certificate-population-report";
import { WardWiseAbsenteeEducationalLevelReport } from "./demographics/ward-wise-absentee-educational-level-report";
import { WardAgeWiseMaritalStatusReport } from "./demographics/ward-age-wise-marital-status-report";
import { WardAgeGenderWiseMarriedAgeReport } from "./demographics/ward-age-gender-wise-married-age-report";
// import { FemalePropertyOwnershipReport } from "./demographics/female-property-ownership-report";

export function ReportDemographicsSection() {
    return (
      <div className="category-break">
        <h1 className="category-title">३. जनसांख्यिकीय विवरण</h1>
        
        <div className="section-content">
          <p>
            यस खण्डमा केराबारी गाउँपालिकाको जनसांख्यिकीय विशेषताहरूको विस्तृत विवरण प्रस्तुत गरिएको छ। 
            यसमा जनसंख्याको संरचना, वितरण, र विभिन्न सामाजिक तथा आर्थिक सूचकहरूको विश्लेषण समावेश छ।
          </p>
        </div>
  
        {/* Demographic Summary Section */}
        <div className="section-within-category">
          <DemographicSummaryReport />
        </div>

        {/* Age Gender Section */}
        <div className="section-within-category">
          <AgeGenderReport />
        </div>

        {/* Caste Section */}
        <div className="section-within-category">
          <CasteReport />
        </div>

        {/* Language Section */}
        <div className="section-within-category">
          <LanguageReport />
        </div>

        {/* Religion Section */}
        <div className="section-within-category">
          <ReligionReport />
        </div>



      {/* Househead Section */}
      <div className="section-within-category">
        <HouseheadGenderReport />
      </div>

    

      {/* Economically Active Section */}
      <div className="section-within-category">
        <EconomicallyActiveReport />
      </div>

      {/* Disability Cause Section */}
      <div className="section-within-category">
        <DisabilityCauseReport />
      </div>

      {/* Death Cause Section */}
      <div className="section-within-category">
        <DeathCauseReport />
      </div>

      {/* Death Registration Section */}
      <div className="section-within-category">
        <DeathRegistrationReport />
      </div>

      {/* Ward Wise Migrated Households Section */}
      <div className="section-within-category">
        <WardWiseMigratedHouseholdsReport />
      </div>

      {/* Ward Wise Birthplace Households Section */}
      <div className="section-within-category">
        <WardWiseBirthplaceHouseholdsReport />
      </div>

      {/* Ward Wise Birth Certificate Population Section */}
      <div className="section-within-category">
        <WardWiseBirthCertificatePopulationReport />
      </div>

      {/* Ward Wise Absentee Educational Level Section */}
      <div className="section-within-category">
        <WardWiseAbsenteeEducationalLevelReport />
      </div>

      {/* Ward Age Wise Marital Status Section */}
      <div className="section-within-category">
        <WardAgeWiseMaritalStatusReport />
      </div>

      {/* Ward Age Gender Wise Married Age Section */}
      <div className="section-within-category">
        <WardAgeGenderWiseMarriedAgeReport />
      </div>
      </div>
    );
  } 


// export function ReportDemographicsSection() {
//   return (
//     <div className="category-break">
//       <h1 className="category-title">३. जनसांख्यिकीय विवरण</h1>
      
//       <div className="section-content">
//         <p>
//           यस खण्डमा केराबारी गाउँपालिकाको जनसांख्यिकीय विशेषताहरूको विस्तृत विवरण प्रस्तुत गरिएको छ। 
//           यसमा जनसंख्याको संरचना, वितरण, र विभिन्न सामाजिक तथा आर्थिक सूचकहरूको विश्लेषण समावेश छ।
//         </p>
//       </div>

//       {/* Demographic Summary Section */}
//       <div className="section-within-category">
//         <DemographicSummaryReport />
//       </div>

//       {/* Age Gender Section */}
//       <div className="section-within-category">
//         <AgeGenderReport />
//       </div>

//   {/* Occupation Section */}
//   <div className="section-within-category">
//   <OccupationReport />
// </div>

//       {/* Female Property Ownership Section */}
//       <div className="section-within-category">
//         <FemalePropertyOwnershipReport />
//       </div>
//     </div>
//   );
// } 