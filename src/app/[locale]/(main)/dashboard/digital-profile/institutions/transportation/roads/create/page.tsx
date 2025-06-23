"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateRoadForm } from "./_components/create-form";

export default function CreateRoadPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ सडक थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/transportation/roads"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/roads",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateRoadForm />
      </div>
    </ContentLayout>
  );
}
