import { signinMutationOptions } from "@app/client";
import { Button } from "@app/ui/button";
import { Input } from "@app/ui/input";
import { PasswordInput } from "@app/ui/password-input";
import { signinSchema } from "@app/validations";
import { getFieldProps } from "@app/validations/form";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HospitalIcon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { authStore } from "@/web/lib/auth-store";

export const Route = createFileRoute("/(public)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutateAsync, isPending } = useMutation({
    ...signinMutationOptions(),
    meta: {
      showErrorMessage: true,
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: async ({ value }) => {
      const data = await mutateAsync(value);
      authStore.setAccessToken(data.accessToken);
      await navigate({ to: "/" });
    },
  });

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5">
        <img
          src="/images/signin-hero.jpg"
          alt={t("signin.heroAlt")}
          className="h-full w-full object-cover brightness-[0.65]"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <HospitalIcon aria-hidden="true" className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-lg">HMIS</span>
            </div>
            <h1 className="font-bold text-2xl text-foreground tracking-tight">{t("signin.title")}</h1>
            <p className="mt-1.5 text-muted-foreground text-sm">{t("signin.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <form.Field name="email">
              {field => (
                <Input
                  label={t("signin.email")}
                  placeholder={t("signin.emailPlaceholder")}
                  {...getFieldProps(field, signinSchema)}
                  type="email"
                  autoComplete="email"
                />
              )}
            </form.Field>
            <form.Field name="password">
              {field => (
                <PasswordInput
                  label={t("signin.password")}
                  placeholder={t("signin.passwordPlaceholder")}
                  {...getFieldProps(field, signinSchema)}
                  autoComplete="current-password"
                />
              )}
            </form.Field>
            <Button type="submit" loading={isPending} className="w-full" size="lg">
              {t("signin.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
