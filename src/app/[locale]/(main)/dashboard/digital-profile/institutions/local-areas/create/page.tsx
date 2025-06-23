"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateLocalAreaForm } from "./_components/create-form";

export default function CreateLocalAreaPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ स्थान थप्नुहोस्"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push("/dashboard/digital-profile/institutions/local-areas")
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateLocalAreaForm />
      </div>
    </ContentLayout>
  );
}
