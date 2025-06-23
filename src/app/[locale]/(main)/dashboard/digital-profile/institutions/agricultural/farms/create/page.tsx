"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CreateForm from "./_components/create-form";

export default function CreateAgricZonePage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ कृषि क्षेत्र थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/agricultural/agric-zones"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/agric-zones",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateForm />
      </div>
    </ContentLayout>
  );
}
