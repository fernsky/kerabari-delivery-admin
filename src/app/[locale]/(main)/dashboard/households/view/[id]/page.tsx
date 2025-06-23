//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  ArrowLeft,
  Home,
  User,
  MapPin,
  Users,
  Phone,
  Calendar,
  Building,
  ChevronRight,
  ExternalLink,
  Map,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { Household } from "@/server/db/schema/households/households";
import type { Individual } from "@/server/db/schema/individuals/individuals";

// Import the map component with dynamic loading to avoid SSR issues
const HouseholdLocationMap = dynamic(
  () => import("@/components/households/HouseholdLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    ),
  },
);

// Define type for location data that matches the API response
type LocationData = {
  id: unknown;
  familyHeadName: Record<string, unknown>;
  province: Record<string, unknown>;
  district: Record<string, unknown>;
  wardNo: number | null;
  location: {
    raw: string[];
    latitude: number | null;
    longitude: number | null;
  };
};

// Define the shape of the household data returned by the API
// This uses the base types from the schema while accounting for API transformations
type HouseholdResponse = {
  id: string;
  profileId: string;
  province: string | null;
  district: string | null;
  localLevel: string | null;
  wardNo: number | null;
  houseSymbolNo: string | null;
  familySymbolNo: string | null;
  dateOfInterview: Date | null;
  householdLocation: string[] | null;
  locality: string | null;
  developmentOrganization: string | null;
  familyHeadName: string;
  familyHeadPhoneNo: string | null;
  totalMembers: number | null;
  areMembersElsewhere: string | null;
  totalElsewhereMembers: number | null;
  houseOwnership: string | null;
  houseOwnershipOther: string | null;
  landOwnership: string | null;
  landOwnershipOther: string | null;
  houseBase: string | null;
  houseBaseOther: string | null;
  houseOuterWall: string | null;
  houseOuterWallOther: string | null;
  houseRoof: string | null;
  houseRoofOther: string | null;
  houseFloor: string | null;
  houseFloorOther: string | null;
  isHousePassed: string | null;
  isMapArchived: string | null;
  naturalDisasters: string[] | null;
  isSafe: string | null;
  waterSource: string | null;
  waterPurificationMethods: string | null;
  toiletType: string | null;
  solidWasteManagement: string | null;
  primaryCookingFuel: string | null;
  primaryEnergySource: string | null;
  roadStatus: string | null;
  timeToPublicBus: string | null;
  timeToMarket: string | null;
  distanceToActiveRoad: string | null;
  facilities: string[] | null;
  hasPropertiesElsewhere: string | null;
  hasFemaleNamedProperties: string | null;
  organizationsLoanedFrom: string[] | null;
  loanUses: string[] | null;
  timeToBank: string | null;
  financialAccounts: string[] | null;
  incomeSources: string[] | null;
  haveRemittance: string | null;
  remittanceExpenses: string[] | null;
  haveHealthInsurance: string | null;
  consultingHealthOrganization: string | null;
  timeToHealthOrganization: string | null;
  municipalSuggestions: string[] | null;
  haveAgriculturalLand: string | null;
  agriculturalLands: string[] | null;
  areInvolvedInAgriculture: string | null;
  foodCrops: string[] | null;
  pulses: string[] | null;
  oilSeeds: string[] | null;
  vegetables: string[] | null;
  fruits: string[] | null;
  spices: string[] | null;
  cashCrops: string[] | null;
  areInvolvedInHusbandry: string | null;
  animals: string[] | null;
  animalProducts: string[] | null;
  haveAquaculture: string | null;
  pondNumber: number | null;
  pondArea: number | null;
  fishProduction: number | null;
  haveApiary: string | null;
  hiveNumber: number | null;
  honeyProduction: number | null;
  honeySales: number | null;
  honeyRevenue: number | null;
  hasAgriculturalInsurance: string | null;
  monthsInvolvedInAgriculture: string | null;
  agriculturalMachines: string[] | null;
  birthPlace: string | null;
  birthProvince: string | null;
  birthDistrict: string | null;
  birthCountry: string | null;
  priorLocation: string | null;
  priorProvince: string | null;
  priorDistrict: string | null;
  priorCountry: string | null;
  residenceReason: string | null;
  hasBusiness: string | null;
  deviceId: string | null;
};

// Define the shape of the family member data returned by the API
type FamilyMemberResponse = {
  id: string;
  tenantId: string;
  parentId: string;
  wardNo: number | null;
  name: string;
  age: number | null;
  gender: string;
  familyRole: string | null;
  isPresent: string | null;
  educationalLevel: string | null;
};

type FamilyMembersResponse = {
  individuals: FamilyMemberResponse[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pageCount: number;
  };
};

// Function to format UUID for API calls
function formatUuid(uuid: string): string {
  // Remove any existing "uuid:" prefix
  return uuid.replace(/^uuid:/, "").trim();
}

export default function HouseholdView() {
  const params = useParams();
  const router = useRouter();

  // Clean and format the household ID from URL params
  const rawId = params?.id as string;
  const decodedId = decodeURIComponent(rawId);
  const householdId = formatUuid(decodedId);

  // Queries for household and family members
  const {
    data: household,
    isLoading: isLoadingHousehold,
    error: householdError,
  } = api.households.getHouseholdById.useQuery(
    { id: householdId },
    {
      retry: 1,
      onError: (err) => {
        toast.error(`Error loading household: ${err.message}`);
      },
    },
  );

  const {
    data: familyMembers,
    isLoading: isLoadingMembers,
    error: membersError,
  } = api.individuals.getIndividualsByHouseholdId.useQuery<any>(
    { householdId, limit: 50, offset: 0 },
    {
      retry: 1,
      enabled: !!householdId,
      onError: (err) => {
        toast.error(`Error loading family members: ${err.message}`);
      },
    },
  );

  // Fetch location data separately using the location procedure
  const {
    data: locationData,
    isLoading: isLoadingLocation,
    error: locationError,
  } = api.households.getHouseholdLocation.useQuery<LocationData>(
    { id: householdId },
    {
      retry: 1,
      enabled: !!householdId,
      onError: (err) => {
        // Don't show error toast for location, we'll handle it in the component
        console.error(`Error loading location: ${err.message}`);
      },
    },
  );

  // Loading state
  if (isLoadingHousehold || isLoadingMembers || isLoadingLocation) {
    return (
      <ContentLayout title="Household Details">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
            <p className="text-muted-foreground">
              Loading household information...
            </p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  // Error state
  if (householdError || membersError) {
    return (
      <ContentLayout title="Error">
        <Alert variant="destructive" className="m-4">
          <AlertDescription>
            {householdError?.message ||
              membersError?.message ||
              "Error loading data"}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/households")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Households
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Ensure data exists
  if (!household) {
    return (
      <ContentLayout title="Household Not Found">
        <Alert className="m-4">
          <AlertDescription>
            The requested household was not found.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/households")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Households
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Format data for display
  const familyHead = familyMembers?.individuals?.find(
    (member) =>
      typeof member.familyRole === "string" &&
      member.familyRole.toLowerCase() === "head",
  );

  // Safe access to data with null/undefined checks
  const totalMembers =
    household.totalMembers ?? familyMembers?.individuals?.length ?? 0;

  // Safe access to province and district with fallbacks
  const province = household.province ?? "";
  const district = household.district ?? "";
  const familyHeadName = household.familyHeadName ?? "";
  const houseSymbolNo = household.houseSymbolNo ?? "N/A";
  const wardNo = household.wardNo ?? "N/A";
  const locality = household.locality ?? "N/A";
  const familyHeadPhoneNo = household.familyHeadPhoneNo ?? "N/A";
  const dateOfInterview = household.dateOfInterview;

  return (
    <ContentLayout
      title="Household Details"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/households")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          {/* <Link href={`/dashboard/households/edit/${rawId}`} passHref>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Household
            </Button>
          </Link> */}
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        {/* Household Header */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Home className="h-6 w-6" />
                  {familyHeadName}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {province}, {district}, Ward {wardNo}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Badge variant="outline" className="px-3 py-1">
                  House Symbol: {houseSymbolNo}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  {totalMembers} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Phone:</span>
                {familyHeadPhoneNo}
              </div>
              <div className="flex gap-2 items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">
                  Interview Date:
                </span>
                {dateOfInterview
                  ? formatDate(dateOfInterview.toString())
                  : "N/A"}
              </div>
              <div className="flex gap-2 items-center">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Locality:</span>
                {locality}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-muted-foreground">
            <span>ID: {household.id}</span>
          </CardFooter>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="members">Family Members</TabsTrigger>
            <TabsTrigger value="housing">Housing</TabsTrigger>
            <TabsTrigger value="economic">Economic</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Family Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Members</CardTitle>
                <CardDescription>
                  List of all individuals in the household
                </CardDescription>
              </CardHeader>
              <CardContent>
                {familyMembers?.individuals &&
                familyMembers.individuals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Education</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {familyMembers.individuals.map((member) => {
                          // Format the member ID correctly for navigation
                          const memberIdForLink = formatUuid(member.id);
                          const memberName = member.name ?? "";
                          const memberFamilyRole = member.familyRole ?? "N/A";
                          const memberIsPresent = member.isPresent ?? "";
                          const memberEducationLevel =
                            member.educationalLevel ?? "N/A";
                          //@ts-ignore
                          return (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                {memberName}
                              </TableCell>
                              <TableCell>{member.age || "N/A"}</TableCell>
                              <TableCell>{member.gender}</TableCell>
                              <TableCell>
                                {/* //@ts-ignore */}
                                {memberFamilyRole.toLowerCase() === "head" ? (
                                  <Badge variant="default">Head</Badge>
                                ) : (
                                  memberFamilyRole
                                )}
                              </TableCell>
                              <TableCell>
                                {memberIsPresent.toLowerCase() === "no" ? (
                                  <Badge variant="destructive">No</Badge>
                                ) : (
                                  <Badge variant="outline">Yes</Badge>
                                )}
                              </TableCell>
                              <TableCell>{memberEducationLevel}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/individuals/${encodeURIComponent(memberIdForLink)}`,
                                    )
                                  }
                                >
                                  View <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No family members found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Housing Tab */}
          <TabsContent value="housing">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Housing Information</CardTitle>
                <CardDescription>
                  Details about the household's living conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Structure & Ownership
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          House Ownership
                        </span>
                        <span className="font-medium">
                          {household.houseOwnership || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Land Ownership
                        </span>
                        <span className="font-medium">
                          {household.landOwnership || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          House Base
                        </span>
                        <span className="font-medium">
                          {household.houseBase || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Outer Wall
                        </span>
                        <span className="font-medium">
                          {household.houseOuterWall || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Roof</span>
                        <span className="font-medium">
                          {household.houseRoof || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Floor</span>
                        <span className="font-medium">
                          {household.houseFloor || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Safety & Utilities
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          House Inspection Passed
                        </span>
                        <span className="font-medium">
                          {household.isHousePassed || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Safe from Natural Disasters
                        </span>
                        <span className="font-medium">
                          {household.isSafe || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Water Source
                        </span>
                        <span className="font-medium">
                          {household.waterSource || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Toilet Type
                        </span>
                        <span className="font-medium">
                          {household.toiletType || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Primary Cooking Fuel
                        </span>
                        <span className="font-medium">
                          {household.primaryCookingFuel || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {household.naturalDisasters &&
                    household.naturalDisasters.length > 0 && (
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <h4 className="text-sm font-medium mb-2">
                          Natural Disaster Risks
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {household.naturalDisasters.map((disaster, index) => (
                            <Badge key={index} variant="secondary">
                              {disaster}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economic Tab */}
          <TabsContent value="economic">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Economic Information</CardTitle>
                <CardDescription>
                  Financial and economic details of the household
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Finance & Property
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Properties Elsewhere
                        </span>
                        <span className="font-medium">
                          {household.hasPropertiesElsewhere || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Female Named Properties
                        </span>
                        <span className="font-medium">
                          {household.hasFemaleNamedProperties || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Time To Bank
                        </span>
                        <span className="font-medium">
                          {household.timeToBank || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Remittance
                        </span>
                        <span className="font-medium">
                          {household.haveRemittance || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Has Health Insurance
                        </span>
                        <span className="font-medium">
                          {household.haveHealthInsurance || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Agriculture & Livestock
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Agricultural Land
                        </span>
                        <span className="font-medium">
                          {household.haveAgriculturalLand || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Involved in Agriculture
                        </span>
                        <span className="font-medium">
                          {household.areInvolvedInAgriculture || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Involved in Husbandry
                        </span>
                        <span className="font-medium">
                          {household.areInvolvedInHusbandry || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Has Aquaculture
                        </span>
                        <span className="font-medium">
                          {household.haveAquaculture || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Has Business
                        </span>
                        <span className="font-medium">
                          {household.hasBusiness || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {household.incomeSources &&
                    household.incomeSources.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Income Sources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {household.incomeSources.map((source, index) => (
                            <Badge key={index} variant="secondary">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {household.financialAccounts &&
                    household.financialAccounts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Financial Accounts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {household.financialAccounts.map((account, index) => (
                            <Badge key={index} variant="secondary">
                              {account}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Additional Information
                </CardTitle>
                <CardDescription>
                  Other details about the household
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Accessibility</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Road Status
                        </span>
                        <span className="font-medium">
                          {household.roadStatus || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Time to Public Bus
                        </span>
                        <span className="font-medium">
                          {household.timeToPublicBus || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Time to Market
                        </span>
                        <span className="font-medium">
                          {household.timeToMarket || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Distance to Active Road
                        </span>
                        <span className="font-medium">
                          {household.distanceToActiveRoad || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Health & Services
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Consulting Health Organization
                        </span>
                        <span className="font-medium">
                          {household.consultingHealthOrganization || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Time to Health Organization
                        </span>
                        <span className="font-medium">
                          {household.timeToHealthOrganization || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          Development Organization
                        </span>
                        <span className="font-medium">
                          {household.developmentOrganization || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-sm font-medium mb-2">
                      Migration History
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Birth Place
                        </span>
                        <span className="font-medium">
                          {household.birthPlace || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Birth District
                        </span>
                        <span className="font-medium">
                          {household.birthDistrict || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Prior Location
                        </span>
                        <span className="font-medium">
                          {household.priorLocation || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Prior District
                        </span>
                        <span className="font-medium">
                          {household.priorDistrict || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">
                          Residence Reason
                        </span>
                        <span className="font-medium">
                          {household.residenceReason || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Map className="h-5 w-5" /> Household Location
                </CardTitle>
                <CardDescription>
                  Geographic location and map view of the household
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HouseholdLocationMap
                  id={householdId}
                  familyHeadName={familyHeadName}
                  location={locationData?.location}
                  isLoading={isLoadingLocation}
                  error={locationError?.message}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
