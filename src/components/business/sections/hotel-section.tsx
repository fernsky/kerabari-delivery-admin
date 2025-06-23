import { Hotel } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

export function HotelSection({ business }: { business: BusinessSchema }) {
  return (
    <Card title="Hotel Details" icon={Hotel}>
      <DetailRow
        icon={Hotel}
        label="Accommodation Type"
        value={business?.hotelAccomodationType}
      />
      <DetailRow
        icon={Hotel}
        label="Room Count"
        value={business?.hotelRoomNumbers?.toString()}
      />
      <DetailRow
        icon={Hotel}
        label="Bed Count"
        value={business?.hotelBedNumbers?.toString()}
      />
      <DetailRow
        icon={Hotel}
        label="Room Type"
        value={business?.hotelRoomTypes?.join(", ") || "N/A"}
      />
     
    </Card>
  );
}
