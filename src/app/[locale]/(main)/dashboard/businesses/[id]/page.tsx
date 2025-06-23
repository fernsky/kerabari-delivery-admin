// @ts-nocheck
"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { BusinessLoadingState } from "@/components/business/business-loading-state";
import { BusinessStatsGrid } from "@/components/business/business-stats-grid";
import { BusinessInfoGrid } from "@/components/business/business-info-grid";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import Image from "next/image";
import { BusinessDetailsSection } from "@/components/business/business-details-section";
import { CustomAudioPlayer } from "@/components/ui/audio-player";
import { BusinessInvalidSection } from "@/components/business/business-invalid-section";

const gpsSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
});

export default function BusinessDetails({
  params,
}: {
  params: { id: string };
}) {
  const decodedId = decodeURIComponent(params.id);

  console.log("Decoded ID:", decodedId);

  const {
    data: business,
    isLoading,
    error,
    refetch: businessRefetch,
  } = api.business.getById.useQuery({ id: decodedId });

  if (error) {
    return (
      <ContentLayout title="Error">
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Business Details"
      actions={
        <div className="flex gap-2">
          <Link href={`/businesses`}>
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
            </Button>
          </Link>
          <Link href={`/businesses/edit/${params.id}`}>
            <Button size="sm" variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <BusinessLoadingState />
      ) : (
        <div className="space-y-6 lg:px-10 px-2">
          {/* Main Grid Layout */}
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            {/* Left Column - Audio and Stats */}
            <div className="space-y-4">
              <BusinessStatsGrid
                totalEmployees={
                  (business?.totalPermanentEmployees ?? 0) +
                  (business?.totalTemporaryEmployees ?? 0)
                }
                totalPartners={business?.totalPartners ?? 0}
                wardNumber={
                  business?.tmpWardNumber ??
                  business?.wardNo ??
                  business?.wardId ??
                  0
                }
              />
            </div>
          </div>

          {/* @ts-ignore */}
          <BusinessInvalidSection business={business} />

          {/* Info Grid with Location */}
          <BusinessInfoGrid
            //@ts-ignore
            business={business}
            locationDetails={
              business?.gps && gpsSchema.safeParse(business.gps).success
                ? {
                    coordinates: [
                      business.gps.coordinates[1],
                      business.gps.coordinates[0],
                    ],
                    gpsAccuracy: business.gpsAccuracy
                      ? Number(business.gpsAccuracy)
                      : undefined,
                    altitude: business.altitude
                      ? Number(business.altitude)
                      : undefined,
                  }
                : undefined
            }
          />

          {/* Animal and Crop Details */}
          <BusinessDetailsSection
            animals={business?.animals}
            animalProducts={business?.animalProducts}
            crops={business?.crops}
          />
        </div>
      )}
    </ContentLayout>
  );
}
