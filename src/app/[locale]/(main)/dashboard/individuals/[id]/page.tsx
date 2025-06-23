"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  ArrowLeft,
  Home,
  User,
  Users,
  Briefcase,
  Book,
  HeartPulse,
  Baby,
  Plane,
  Globe,
  UserCircle2,
} from "lucide-react";

// Function to format UUID for API calls
function formatUuid(uuid: string): string {
  return uuid.replace(/^uuid:/, "").trim();
}

export default function IndividualDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Clean and format the individual ID from URL params
  const rawId = params?.id as string;
  const decodedId = decodeURIComponent(rawId);
  const individualId = formatUuid(decodedId);

  // Query individual data
  const {
    data: individual,
    isLoading,
    error,
  } = api.individuals.getIndividualById.useQuery(
    { id: individualId },
    {
      retry: 1,
      onError: (err) => {
        toast.error(`Error loading individual: ${err.message}`);
      },
    },
  );

  // Loading state
  if (isLoading) {
    return (
      <ContentLayout title="Individual Details">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
            <p className="text-muted-foreground">
              Loading individual information...
            </p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ContentLayout title="Error">
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error.message}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Ensure data exists
  if (!individual) {
    return (
      <ContentLayout title="Individual Not Found">
        <Alert className="m-4">
          <AlertDescription>
            The requested individual was not found.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/individuals")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Individuals
          </Button>
        </Alert>
      </ContentLayout>
    );
  }

  // Format the parent ID (household ID) for linking back
  let parentIdForLink = "";
  if (individual?.parentId) {
    parentIdForLink = formatUuid(individual.parentId);
  }

  // Derived data
  const isHead = individual?.familyRole?.toLowerCase() === "head";
  const isAbsent = individual?.isPresent?.toLowerCase() === "no";
  const isDisabled = individual?.isDisabled?.toLowerCase() === "yes";

  // Generate status badges
  const generateStatusBadges = () => {
    const badges = [];

    if (isHead) {
      badges.push(
        <Badge key="head" className="bg-primary">
          Family Head
        </Badge>,
      );
    }

    if (isAbsent) {
      badges.push(
        <Badge key="absent" variant="destructive">
          Not Present
        </Badge>,
      );
    }

    if (isDisabled) {
      badges.push(
        <Badge key="disabled" variant="secondary">
          Disabled
        </Badge>,
      );
    }

    if (individual.gender) {
      badges.push(
        <Badge key="gender" variant="outline">
          {individual.gender === "Male"
            ? "♂ Male"
            : individual.gender === "Female"
              ? "♀ Female"
              : individual.gender}
        </Badge>,
      );
    }

    return badges;
  };

  return (
    <ContentLayout
      title="Individual Profile"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {individual?.parentId && (
            <Link
              href={`/dashboard/households/view/${encodeURIComponent(parentIdForLink)}`}
              passHref
            >
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> View Household
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        {/* Profile Header */}
        <Card className="border-b-4 border-b-primary">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-muted rounded-full p-4">
                  <UserCircle2 className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{individual.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {individual.age !== null
                      ? `${individual.age} years old`
                      : "Age not specified"}{" "}
                    • Ward {individual.wardNo || "N/A"}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generateStatusBadges()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-right space-y-1">
                <div>
                  <span className="text-muted-foreground">Role:</span>{" "}
                  {individual.familyRole || "Not specified"}
                </div>
                <div>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  {individual.id.substring(0, 12)}...
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="occupation">Occupation</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Name
                      </div>
                      <div className="font-medium">{individual.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Age
                      </div>
                      <div className="font-medium">
                        {individual.age !== null
                          ? individual.age
                          : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Gender
                      </div>
                      <div className="font-medium">
                        {individual.gender || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Family Role
                      </div>
                      <div className="font-medium">
                        {individual.familyRole || "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Marital Status
                      </div>
                      <div className="font-medium">
                        {individual.maritalStatus || "Not specified"}
                      </div>
                    </div>
                    {individual.marriedAge !== null && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Age at Marriage
                        </div>
                        <div className="font-medium">
                          {individual.marriedAge}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Present in Household
                      </div>
                      <div className="font-medium">
                        {individual.isPresent || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Citizen Of
                      </div>
                      <div className="font-medium">
                        {individual.citizenOf || "Not specified"}
                        {individual.citizenOfOther &&
                          ` (${individual.citizenOfOther})`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Birth Certificate */}
                <Separator className="my-4" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Has Birth Certificate
                  </div>
                  <div className="font-medium">
                    {individual.hasBirthCertificate || "Not specified"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Tab */}
          <TabsContent value="cultural">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" /> Cultural Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Caste
                    </div>
                    <div className="font-medium">
                      {individual.caste || "Not specified"}
                      {individual.casteOther && ` (${individual.casteOther})`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Religion
                    </div>
                    <div className="font-medium">
                      {individual.religion || "Not specified"}
                      {individual.religionOther &&
                        ` (${individual.religionOther})`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Ancestor Language
                    </div>
                    <div className="font-medium">
                      {individual.ancestorLanguage || "Not specified"}
                      {individual.ancestorLanguageOther &&
                        ` (${individual.ancestorLanguageOther})`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Primary Mother Tongue
                    </div>
                    <div className="font-medium">
                      {individual.primaryMotherTongue || "Not specified"}
                      {individual.primaryMotherTongueOther &&
                        ` (${individual.primaryMotherTongueOther})`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5" /> Health Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Has Chronic Disease
                    </div>
                    <div className="font-medium">
                      {individual.hasChronicDisease || "Not specified"}
                    </div>
                  </div>
                  {individual.hasChronicDisease?.toLowerCase() === "yes" && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Primary Chronic Disease
                      </div>
                      <div className="font-medium">
                        {individual.primaryChronicDisease || "Not specified"}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Is Disabled
                    </div>
                    <div className="font-medium">
                      {individual.isDisabled || "Not specified"}
                    </div>
                  </div>
                  {individual.isDisabled?.toLowerCase() === "yes" && (
                    <>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Disability Type
                        </div>
                        <div className="font-medium">
                          {individual.disabilityType || "Not specified"}
                          {individual.disabilityTypeOther &&
                            ` (${individual.disabilityTypeOther})`}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Disability Cause
                        </div>
                        <div className="font-medium">
                          {individual.disabilityCause || "Not specified"}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Is Sanitized
                    </div>
                    <div className="font-medium">
                      {individual.isSanitized || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Fertility information (If applicable) */}
                {individual.gender?.toLowerCase() === "female" &&
                  individual.age &&
                  individual.age > 15 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="text-base font-medium mb-3">
                          Fertility Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                              Gave Live Birth
                            </div>
                            <div className="font-medium">
                              {individual.gaveLiveBirth || "Not specified"}
                            </div>
                          </div>
                          {individual.gaveLiveBirth?.toLowerCase() ===
                            "yes" && (
                            <>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  First Delivery Age
                                </div>
                                <div className="font-medium">
                                  {individual.firstDeliveryAge !== null
                                    ? individual.firstDeliveryAge
                                    : "Not specified"}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  Alive Children
                                </div>
                                <div className="font-medium">
                                  {individual.aliveSons !== null ||
                                  individual.aliveDaughters !== null ? (
                                    <span>
                                      {individual.aliveSons !== null
                                        ? `${individual.aliveSons} sons`
                                        : "0 sons"}
                                      {" and "}
                                      {individual.aliveDaughters !== null
                                        ? `${individual.aliveDaughters} daughters`
                                        : "0 daughters"}
                                    </span>
                                  ) : (
                                    "Not specified"
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  Total Born Children
                                </div>
                                <div className="font-medium">
                                  {individual.totalBornChildren !== null
                                    ? individual.totalBornChildren
                                    : "Not specified"}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Literacy Status
                    </div>
                    <div className="font-medium">
                      {individual.literacyStatus || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Educational Level
                    </div>
                    <div className="font-medium">
                      {individual.educationalLevel || "Not specified"}
                    </div>
                  </div>
                  {individual.educationalLevel &&
                    individual.educationalLevel.toLowerCase() !== "none" && (
                      <>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Primary Subject
                          </div>
                          <div className="font-medium">
                            {individual.primarySubject || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            School Presence Status
                          </div>
                          <div className="font-medium">
                            {individual.schoolPresenceStatus || "Not specified"}
                          </div>
                        </div>
                      </>
                    )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Goes to School
                    </div>
                    <div className="font-medium">
                      {individual.goesSchool || "Not specified"}
                    </div>
                  </div>
                  {individual.goesSchool?.toLowerCase() === "no" && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        School Barrier
                      </div>
                      <div className="font-medium">
                        {individual.schoolBarrier || "Not specified"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Training/Skills */}
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Has Training
                    </div>
                    <div className="font-medium">
                      {individual.hasTraining || "Not specified"}
                    </div>
                  </div>
                  {individual.hasTraining?.toLowerCase() === "yes" && (
                    <>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Training
                        </div>
                        <div className="font-medium">
                          {individual.training || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Months Trained
                        </div>
                        <div className="font-medium">
                          {individual.monthsTrained !== null
                            ? `${individual.monthsTrained} months`
                            : "Not specified"}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Primary Skill
                    </div>
                    <div className="font-medium">
                      {individual.primarySkill || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Has Internet Access
                    </div>
                    <div className="font-medium">
                      {individual.hasInternetAccess || "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupation Tab */}
          <TabsContent value="occupation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Occupation & Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Primary Occupation
                    </div>
                    <div className="font-medium">
                      {individual.primaryOccupation || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Financial Work Duration
                    </div>
                    <div className="font-medium">
                      {individual.financialWorkDuration || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Work Availability
                    </div>
                    <div className="font-medium">
                      {individual.workAvailability || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Work Barrier
                    </div>
                    <div className="font-medium">
                      {individual.workBarrier || "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Migration Tab */}
          <TabsContent value="migration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" /> Migration Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isAbsent ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Individual is present in the household
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Absence Reason
                      </div>
                      <div className="font-medium">
                        {individual.absenceReason || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Absentee Age
                      </div>
                      <div className="font-medium">
                        {individual.absenteeAge !== null
                          ? `${individual.absenteeAge} years`
                          : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Absentee Educational Level
                      </div>
                      <div className="font-medium">
                        {individual.absenteeEducationalLevel || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Absentee Location
                      </div>
                      <div className="font-medium">
                        {individual.absenteeLocation || "Not specified"}
                      </div>
                    </div>
                    {individual.absenteeLocation && (
                      <>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Absentee Province
                          </div>
                          <div className="font-medium">
                            {individual.absenteeProvince || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Absentee District
                          </div>
                          <div className="font-medium">
                            {individual.absenteeDistrict || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Absentee Country
                          </div>
                          <div className="font-medium">
                            {individual.absenteeCountry || "Not specified"}
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Has Sent Cash
                      </div>
                      <div className="font-medium">
                        {individual.absenteeHasSentCash || "Not specified"}
                      </div>
                    </div>
                    {individual.absenteeHasSentCash?.toLowerCase() ===
                      "yes" && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Cash Amount
                        </div>
                        <div className="font-medium">
                          {individual.absenteeCashAmount !== null
                            ? individual.absenteeCashAmount
                            : "Not specified"}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
