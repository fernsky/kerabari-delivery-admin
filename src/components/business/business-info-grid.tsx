import type { BusinessSchema, LocationDetails } from "./types";
import { BusinessBasicSection } from "./sections/business-basic-section";
import { LegalInfoSection } from "./sections/legal-info-section";
import { WorkforceSection } from "./sections/workforce-section";
import { HotelSection } from "./sections/hotel-section";
import { LocationSection } from "./sections/location-section";
import { OperatorSection } from "./sections/operator-section";

interface BusinessInfoGridProps {
  business: BusinessSchema;
  locationDetails?: LocationDetails;
}

export function BusinessInfoGrid({
  business,
  locationDetails,
}: BusinessInfoGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left Column */}
      <div className="space-y-6">
        {/* @ts-ignore */}
        <SurveyInfoSection business={business} />
        {/* @ts-ignore */}
        <BusinessBasicSection business={business} />
        {/* @ts-ignore */}
        <LegalInfoSection business={business} />
        {(business?.hotelAccomodationType || business?.hotelRoomNumbers) && (
          <HotelSection business={business} />
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <LocationSection
          business={business}
          locationDetails={locationDetails}
        />
        <OperatorSection business={business} />
        <WorkforceSection business={business} />
      
      </div>
    </div>
  );
}
