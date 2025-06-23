"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreatePetrolPumpForm } from "./_components/create-form";

export default function CreatePetrolPumpPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ पेट्रोल पम्प थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/transportation/petrol-pumps"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreatePetrolPumpForm />
      </div>
    </ContentLayout>
  );
}
