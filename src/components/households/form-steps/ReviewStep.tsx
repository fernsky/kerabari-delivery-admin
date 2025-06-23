import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface ReviewStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export default function ReviewStep({
  onSubmit,
  isSubmitting,
  isEditing = false,
}: ReviewStepProps) {
  const { watch } = useFormContext<Household>();
  const values = watch();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>आधारभूत जानकारी</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">प्रदेश</dt>
              <dd>{values.province}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">जिल्ला</dt>
              <dd>{values.district}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">स्थानीय तह</dt>
              <dd>{values.local_level}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">वडा नं.</dt>
              <dd>{values.ward_no}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>परिवार विवरण</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">परिवार मूलीको नाम</dt>
              <dd>{values.family_head_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">परिवार मूलीको फोन नम्बर</dt>
              <dd>{values.family_head_phone_no}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">परिवार सदस्य संख्या</dt>
              <dd>{values.total_members}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>घरको विवरण</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">घरको स्वामित्व</dt>
              <dd>{values.house_ownership}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">जग्गाको स्वामित्व</dt>
              <dd>{values.land_ownership}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Add more sections for other steps as needed */}

      <div className="flex justify-center mt-8">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              {isEditing ? "अपडेट गर्दै..." : "सबमिट गर्दै..."}
            </>
          ) : isEditing ? (
            "अपडेट गर्नुहोस्"
          ) : (
            "सबमिट गर्नुहोस्"
          )}
        </Button>
      </div>
    </div>
  );
}
