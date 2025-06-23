"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/password-input";
import { signup } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalizedNumber } from "@/components/ui/localized-number";
import { User2, KeyRound, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export function Signup() {
  const [state, formAction] = useFormState(signup, null);
  const t = useTranslations("auth.signup");

  // Create ward options (1-10)
  const wardNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Card className="border-none shadow-lg shadow-primary/5">
      <CardHeader className="space-y-4 text-center pb-8">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {t("form.branding")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("form.title")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("form.name.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User2 className="h-4 w-4" />
              </div>
              <Input
                required
                id="name"
                placeholder={t("form.name.placeholder")}
                name="name"
                className="pl-9"
              />
            </div>
          </div>

          {/* Phone input with icon */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              {t("form.phoneNumber.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                required
                id="phoneNumber"
                placeholder={t("form.phoneNumber.placeholder")}
                name="phoneNumber"
                className="pl-9"
              />
            </div>
          </div>

          {/* Email input with icon */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("form.email.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                required
                type="email"
                id="email"
                placeholder={t("form.email.placeholder")}
                name="email"
                className="pl-9"
              />
            </div>
          </div>

          {/* Username input with icon */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium">
              {t("form.username.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User2 className="h-4 w-4" />
              </div>
              <Input
                required
                id="userName"
                placeholder={t("form.username.placeholder")}
                name="userName"
                className="pl-9"
              />
            </div>
          </div>

          {/* Ward select with icon */}
          <div className="space-y-2">
            <Label htmlFor="wardNumber" className="text-sm font-medium">
              {t("form.wardNumber.label")}
            </Label>
            <div className="relative">
              <Select name="wardNumber" required>
                <SelectTrigger className="pl-9">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <SelectValue placeholder={t("form.wardNumber.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {wardNumbers.map((ward) => (
                      <SelectItem key={ward} value={ward.toString()}>
                        {t("form.wardNumber.optionPrefix")}{" "}
                        <LocalizedNumber value={ward} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Password inputs with icons */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("form.password.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <KeyRound className="h-4 w-4" />
              </div>
              <PasswordInput
                id="password"
                name="password"
                required
                className="pl-9"
                placeholder={t("form.password.placeholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatPassword" className="text-sm font-medium">
              {t("form.confirmPassword.label")}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <KeyRound className="h-4 w-4" />
              </div>
              <PasswordInput
                id="repeatPassword"
                name="repeatPassword"
                required
                className="pl-9"
                placeholder={t("form.confirmPassword.placeholder")}
              />
            </div>
          </div>

          {/* Error states */}
          {state?.fieldError && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-1">
              <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-3 text-[0.8rem] font-medium text-destructive">
                {Object.values(state.fieldError).map((err) => (
                  <li className="ml-4" key={err}>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {state?.formError && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-1">
              <p className="rounded-lg border bg-destructive/10 p-3 text-[0.8rem] font-medium text-destructive">
                {state.formError}
              </p>
            </div>
          )}

          <SubmitButton
            className="w-full bg-primary font-medium hover:bg-primary/90"
            size="lg"
          >
            {t("form.submit")}
          </SubmitButton>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t bg-muted/50 p-6">
        <div className="text-sm text-muted-foreground text-center">
          {t("form.haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            {t("form.backToLogin")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
