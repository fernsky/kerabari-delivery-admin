"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UpdateFieldDialogProps {
  fieldKey: string;
  fieldLabel: string;
  currentValue: number | string | null | undefined;
  isDecimal?: boolean;
  children: React.ReactNode;
}

export function UpdateFieldDialog({
  fieldKey,
  fieldLabel,
  currentValue,
  isDecimal = false,
  children,
}: UpdateFieldDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(currentValue?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  const updateFieldMutation =
    api.profile.demographics.summary.updateField.useMutation({
      onSuccess: () => {
        toast.success(`${fieldLabel} सफलतापूर्वक अपडेट गरियो`);
        utils.profile.demographics.summary.get.invalidate();
        setIsSubmitting(false);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message || "अपडेट गर्न असमर्थ"}`);
        setIsSubmitting(false);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const numValue = isDecimal ? parseFloat(value) : parseInt(value, 10);

    updateFieldMutation.mutate({
      field: fieldKey,
      value: isNaN(numValue) ? null : numValue,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fieldLabel} सम्पादन गर्नुहोस्</DialogTitle>
          <DialogDescription>
            कृपया {fieldLabel} को नयाँ मान प्रविष्ट गर्नुहोस्
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value">{fieldLabel}</Label>
              <Input
                id="value"
                type="number"
                step={isDecimal ? "0.01" : "1"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`${fieldLabel} प्रविष्ट गर्नुहोस्`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              रद्द गर्नुहोस्
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  सबमिट गर्दै...
                </>
              ) : (
                "अपडेट गर्नुहोस्"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
