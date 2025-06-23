//@ts-nocheck
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  User,
  Briefcase,
  FileText,
  Building,
  DollarSign,
  Users,
  Map,
} from "lucide-react";
import dynamic from "next/dynamic";

// Import the BusinessLocationMap component with dynamic loading to avoid SSR issues
const BusinessLocationMap = dynamic(
  () => import("@/components/businesses/BusinessLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    ),
  },
);

const formatStatusLabel = (status: string) => {
  switch (status) {
    case "approved":
      return "स्वीकृत";
    case "rejected":
      return "अस्वीकृत";
    case "requested_for_edit":
      return "संशोधन आवश्यक";
    case "pending":
    default:
      return "प्रक्रियामा";
  }
};

const formatStatusClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "requested_for_edit":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

// Function to format UUID for API calls
function formatUuid(uuid: string): string {
  // Remove any existing "uuid:" prefix
  return uuid.replace(/^uuid:/, "").trim();
}

export default function BusinessView() {
  const params = useParams();
  const router = useRouter();

  // Clean and format the business ID from URL params
  const rawId = params?.id as string;
  const decodedId = decodeURIComponent(rawId);
  const businessId = formatUuid(decodedId);

  // Query business data with correctly formatted ID
  const {
    data: business,
    isLoading: isLoadingBusiness,
    error: businessError,
  } = api.business.getById.useQuery(
    { id: businessId },
    {
      retry: 1,
      onError: (err) => {
        toast.error(`Error loading business: ${err.message}`);
      },
    },
  );

  // Extract location data from the business object instead of making a separate API call
  const formatBusinessLocation = (business: any) => {
    if (!business) return null;

    // Parse the location data
    const parseLocationArray = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (
        typeof field === "string" &&
        field.startsWith("{") &&
        field.endsWith("}")
      ) {
        return field
          .substring(1, field.length - 1)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    };

    const location = parseLocationArray(business.businessLocation);

    // Extract latitude and longitude if available
    let latitude: number | null = null;
    let longitude: number | null = null;

    // Try to extract from business_location array
    if (location.length >= 2) {
      const possibleLat = parseFloat(location[0]);
      const possibleLng = parseFloat(location[1]);

      if (!isNaN(possibleLat) && !isNaN(possibleLng)) {
        latitude = possibleLat;
        longitude = possibleLng;
      }
    }

    return {
      raw: location,
      latitude,
      longitude,
    };
  };

  // Prepare location data from business object
  const locationData = business ? formatBusinessLocation(business) : null;
  const isLoadingLocation = isLoadingBusiness;

  // Loading state
  if (isLoadingBusiness) {
    return (
      <ContentLayout title="Business Details">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
            <p className="text-muted-foreground">
              Loading business information...
            </p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  // Error state
  if (businessError) {
    return (
      <ContentLayout title="Error">
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{businessError.message}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/businesses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Ensure data exists
  if (!business) {
    return (
      <ContentLayout title="Business Not Found">
        <Alert className="m-4">
          <AlertDescription>
            The requested business was not found.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/businesses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Safe access to properties with fallbacks
  const businessName = business.businessName ?? "";
  const operatorName = business.operatorName ?? "";
  const wardNo = business.wardNo ?? "N/A";
  const businessNature = business.businessNature ?? "N/A";
  const businessType = business.businessType ?? "N/A";
  const operatorPhone = business.operatorPhone ?? "N/A";
  const registrationStatus = business.isBusinessRegistered ?? "N/A";
  const businessInvestment = business.businessInvestment ?? 0;
  const status = business.status ?? "pending";

  // Calculate total employees
  const totalPermanentEmployees = business.totalPermanentEmployees ?? 0;
  const totalTemporaryEmployees = business.totalTemporaryEmployees ?? 0;
  const totalPartners = business.totalPartners ?? 0;
  const totalInvolvedFamily = business.totalInvolvedFamily ?? 0;

  const totalEmployees =
    totalPermanentEmployees +
    totalTemporaryEmployees +
    totalInvolvedFamily +
    totalPartners;

  return (
    <ContentLayout
      title="Business Details"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/businesses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          <Link
            href={`/dashboard/businesses/edit/${encodeURIComponent(rawId)}`}
            passHref
          >
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Business
            </Button>
          </Link>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        {/* Business Header */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Store className="h-6 w-6" />
                  {businessName}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {business.businessProvince && business.businessDistrict
                    ? `${business.businessProvince}, ${business.businessDistrict}`
                    : ""}
                  {business.wardNo ? `, Ward ${business.wardNo}` : ""}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Badge variant="outline" className="px-3 py-1">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  {operatorName}
                </Badge>
                <Badge className={`px-3 py-1 ${formatStatusClass(status)}`}>
                  {formatStatusLabel(status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Phone:</span>
                {operatorPhone}
              </div>
              <div className="flex gap-2 items-center">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Nature:</span>
                {businessNature}
              </div>
              <div className="flex gap-2 items-center">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Type:</span>
                {businessType}
              </div>
              <div className="flex gap-2 items-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">
                  Registration:
                </span>
                {registrationStatus}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-muted-foreground">
            <span>ID: {business.id}</span>
          </CardFooter>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>
                  General details about the business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Business Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Business Name
                        </span>
                        <span className="font-medium">
                          {businessName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Business Nature
                        </span>
                        <span className="font-medium">{businessNature}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Business Type
                        </span>
                        <span className="font-medium">{businessType}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Ward Number
                        </span>
                        <span className="font-medium">{wardNo}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Operator Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Operator Name
                        </span>
                        <span className="font-medium">{operatorName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Operator Phone
                        </span>
                        <span className="font-medium">{operatorPhone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Operator Age
                        </span>
                        <span className="font-medium">
                          {business.operatorAge || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Operator Gender
                        </span>
                        <span className="font-medium">
                          {business.operatorGender || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Operator Education
                        </span>
                        <span className="font-medium">
                          {business.operatorEducationalLevel || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Registration Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Registration Status
                        </span>
                        <span className="font-medium">
                          {registrationStatus}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Statutory Status
                        </span>
                        <span className="font-medium">
                          {business.statutoryStatus || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has PAN Number
                        </span>
                        <span className="font-medium">
                          {business.hasPanNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          PAN Number
                        </span>
                        <span className="font-medium">
                          {business.panNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {business.registeredBodies &&
                    business.registeredBodies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Registered With
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {business.registeredBodies.map((body, index) => (
                            <Badge key={index} variant="secondary">
                              {body}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Information</CardTitle>
                <CardDescription>
                  Financial details of the business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Investment & Revenue
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Investment Amount
                        </span>
                        <span className="font-medium">
                          Rs. {businessInvestment.toLocaleString()}
                        </span>
                      </div>
                      {business.businessPastYearInvestment !== null && (
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Past Year Investment
                          </span>
                          <span className="font-medium">
                            Rs.{" "}
                            {business.businessPastYearInvestment.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {business.businessProfit !== null && (
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">
                            Business Profit
                          </span>
                          <span className="font-medium">
                            Rs. {business.businessProfit.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hotel specific info if applicable */}
                  {business.hotelAccomodationType && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Hotel Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Accommodation Type
                          </span>
                          <span className="font-medium">
                            {business.hotelAccomodationType}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Room Count
                          </span>
                          <span className="font-medium">
                            {business.hotelRoomNumbers || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Bed Count
                          </span>
                          <span className="font-medium">
                            {business.hotelBedNumbers || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agricultural activities if applicable */}
                  {business.agriculturalBusinesses &&
                    business.agriculturalBusinesses.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium mb-2">
                          Agricultural Activities
                        </h4>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {business.agriculturalBusinesses.map(
                              (activity, index) => (
                                <Badge key={index} variant="secondary">
                                  {activity}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Show crops if available */}
                  {(business.businessFoodCrops?.length ||
                    business.businessPulses?.length ||
                    business.businessOilSeeds?.length ||
                    business.businessVegetables?.length ||
                    business.businessFruits?.length ||
                    business.businessSpices?.length ||
                    business.businessCashCrops?.length) && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium mb-2">
                        Agricultural Products
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {business.businessFoodCrops?.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Food Crops</p>
                            <div className="flex flex-wrap gap-1">
                              {business.businessFoodCrops.map((crop, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {business.businessVegetables?.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Vegetables</p>
                            <div className="flex flex-wrap gap-1">
                              {business.businessVegetables.map((veg, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {veg}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {business.businessFruits?.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Fruits</p>
                            <div className="flex flex-wrap gap-1">
                              {business.businessFruits.map((fruit, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {fruit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Animal products if available */}
                  {(business.businessAnimals?.length ||
                    business.businessAnimalProducts?.length) && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium mb-2">
                        Animal Products
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {business.businessAnimals?.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Animals</p>
                            <div className="flex flex-wrap gap-1">
                              {business.businessAnimals.map((animal, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {animal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {business.businessAnimalProducts?.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Animal Products</p>
                            <div className="flex flex-wrap gap-1">
                              {business.businessAnimalProducts.map(
                                (product, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {product}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Human Resources
                </CardTitle>
                <CardDescription>
                  Staff and employment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Total Personnel
                        </span>
                        <span className="font-medium">{totalEmployees}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Business Partners
                        </span>
                        <span className="font-medium">
                          {business.hasBusinessPartners || "No"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Involved Family
                        </span>
                        <span className="font-medium">
                          {business.hasInvolvedFamily || "No"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Permanent Employees
                        </span>
                        <span className="font-medium">
                          {business.hasPermanentEmployees || "No"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Has Temporary Employees
                        </span>
                        <span className="font-medium">
                          {business.hasTemporaryEmployees || "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Partners Information */}
                  {business.hasBusinessPartners === "Yes" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Partners</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Total Partners
                          </span>
                          <span className="font-medium">
                            {business.totalPartners || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Male Partners
                          </span>
                          <span className="font-medium">
                            {business.nepaliMalePartners || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Female Partners
                          </span>
                          <span className="font-medium">
                            {business.nepaliFemalePartners || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">
                            Has Foreign Partners
                          </span>
                          <span className="font-medium">
                            {business.hasForeignPartners || "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Family Involvement */}
                  {business.hasInvolvedFamily === "Yes" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Family Involvement
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Total Involved Family
                          </span>
                          <span className="font-medium">
                            {business.totalInvolvedFamily || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Male Family Members
                          </span>
                          <span className="font-medium">
                            {business.maleInvolvedFamily || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">
                            Female Family Members
                          </span>
                          <span className="font-medium">
                            {business.femaleInvolvedFamily || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Permanent Employees */}
                  {business.hasPermanentEmployees === "Yes" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Permanent Employees
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Total Permanent Employees
                          </span>
                          <span className="font-medium">
                            {business.totalPermanentEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Male Employees
                          </span>
                          <span className="font-medium">
                            {business.nepaliMalePermanentEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Female Employees
                          </span>
                          <span className="font-medium">
                            {business.nepaliFemalePermanentEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">
                            Has Foreign Permanent Employees
                          </span>
                          <span className="font-medium">
                            {business.hasForeignPermanentEmployees || "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Temporary Employees */}
                  {business.hasTemporaryEmployees === "Yes" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Temporary Employees
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Total Temporary Employees
                          </span>
                          <span className="font-medium">
                            {business.totalTemporaryEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Male Temp. Employees
                          </span>
                          <span className="font-medium">
                            {business.nepaliMaleTemporaryEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">
                            Nepali Female Temp. Employees
                          </span>
                          <span className="font-medium">
                            {business.nepaliTemporaryFemaleEmployees || 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">
                            Has Foreign Temporary Employees
                          </span>
                          <span className="font-medium">
                            {business.hasForeignTemporaryEmployees || "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Map className="h-5 w-5" /> Business Location
                </CardTitle>
                <CardDescription>
                  Geographic location and map view of the business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessLocationMap
                  id={businessId}
                  businessName={businessName}
                  location={locationData}
                  isLoading={isLoadingLocation}
                  error={
                    !locationData?.latitude && !locationData?.longitude
                      ? "No location data available"
                      : undefined
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
