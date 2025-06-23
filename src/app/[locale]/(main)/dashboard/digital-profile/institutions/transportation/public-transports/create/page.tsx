"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreatePublicTransportForm } from "./_components/create-form";

export default function CreatePublicTransportPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ सार्वजनिक यातायात थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/transportation/public-transports"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/public-transports",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreatePublicTransportForm />
      </div>
    </ContentLayout>
  );
}
