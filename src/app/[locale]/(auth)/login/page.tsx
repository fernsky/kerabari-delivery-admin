import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { LoginForm } from "./login-form";
import { useTranslations } from "next-intl";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "auth.login" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: [
        {
          url: "/images/login-og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("meta.title"),
        },
      ],
    },
  };
}

export default async function LoginPage(props: { params: Params }) {
  const { user } = await validateRequest();
  if (user) redirect(Paths.Dashboard);

  const params = await props.params;
  const { locale } = params;

  // Get translations for server-side content
  const t = await getTranslations({ locale, namespace: "auth.login" });

  return (
    <div className="relative min-h-screen w-full grid place-items-center bg-gradient-to-tr from-background via-background to-primary/5 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-full max-w-6xl aspect-[2/1]">
          {/* Gradient circles */}
          <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -right-4 top-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-300" />

          {/* Decorative shapes */}
          <div className="absolute left-1/4 top-1/4 h-16 w-16 rounded-xl border border-primary/10 animate-float" />
          <div className="absolute right-1/4 bottom-1/4 h-20 w-20 rounded-full border border-primary/10 animate-float-slow" />
          <div className="absolute right-1/3 top-1/3 h-12 w-12 rounded-lg border border-primary/10 rotate-45 animate-float-slower" />
        </div>
      </div>

      {/* Content container with backdrop blur */}
      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center p-8">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="relative space-y-4">
            <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <div className="mr-2 h-1 w-1 rounded-full bg-primary" />
              {t("welcome.badge")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
              {t("welcome.headingLine1")}
              <br />
              {t("welcome.headingLine2")}
            </h1>
            <p className="text-muted-foreground max-w-sm">
              {t("welcome.description")}
            </p>
          </div>

          {/* Feature bullets */}
        </div>

        {/* Right side - Login form */}
        <div className="relative w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
