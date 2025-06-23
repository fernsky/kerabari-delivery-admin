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
import { APP_TITLE } from "@/lib/constants";
import { login } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { User2, KeyRound, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [state, formAction] = useFormState(login, null);
  const t = useTranslations("auth.login");

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
        <form action={formAction} className="space-y-6">
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
                autoComplete="userName"
                name="userName"
                type="text"
                className="pl-9 transition-colors"
              />
            </div>
          </div>

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
                autoComplete="current-password"
                placeholder={t("form.password.placeholder")}
                className="pl-9"
              />
            </div>
          </div>

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
          {t("form.noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline inline-flex items-center"
          >
            {t("form.createAccount")}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
