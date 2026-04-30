import {
  changePasswordMutationOptions,
  meQueryOptions,
  signoutMutationOptions,
  updateProfileMutationOptions,
} from "@app/client";
import { Button } from "@app/ui/button";
import { Card } from "@app/ui/card";
import { Input } from "@app/ui/input";
import { PasswordInput } from "@app/ui/password-input";
import { Tabs } from "@app/ui/tabs";
import { toast } from "@app/ui/toast";
import { changePasswordSchema, queryKeys, updateProfileSchema } from "@app/validations";
import { getFieldProps } from "@app/validations/form";
import { useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { authStore } from "@/web/lib/auth-store";

export const Route = createFileRoute("/(protected)/account")({
  component: AccountPage,
});

function AccountPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-bold text-2xl tracking-tight">{t("account.title", "Account Settings")}</h1>
      <Tabs
        tabs={[
          { value: "profile", label: t("account.profile", "Profile"), content: <ProfileForm /> },
          { value: "security", label: t("account.security", "Security"), content: <SecurityForm /> },
        ]}
      />
    </div>
  );
}

function ProfileForm() {
  const { t } = useTranslation();
  const { data: user } = useSuspenseQuery(meQueryOptions());

  const { mutateAsync, isPending } = useMutation({
    ...updateProfileMutationOptions(),
    meta: { showErrorMessage: true, successMessage: t("account.profileUpdated"), invalidateQueries: [queryKeys.me] },
  });

  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    validators: {
      onChange: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
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
    <Card
      title={t("account.profileTitle", "Profile Information")}
      description={t("account.profileDescription", "Update your name and email address")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <form.Field name="name">
          {field => (
            <Input
              label={t("account.name", "Name")}
              placeholder={t("account.namePlaceholder", "Your name")}
              {...getFieldProps(field, updateProfileSchema)}
              autoComplete="name"
            />
          )}
        </form.Field>
        <form.Field name="email">
          {field => (
            <Input
              label={t("account.email", "Email")}
              placeholder={t("account.emailPlaceholder", "your@email.com")}
              {...getFieldProps(field, updateProfileSchema)}
              type="email"
              autoComplete="email"
            />
          )}
        </form.Field>
        <div className="flex justify-end">
          <Button type="submit" loading={isPending}>
            {t("account.saveProfile", "Save Changes")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SecurityForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: signout } = useMutation(signoutMutationOptions());

  const { mutateAsync, isPending } = useMutation({
    ...changePasswordMutationOptions(),
    onSuccess: async () => {
      toast.success(t("account.passwordChanged", "Password changed. You will be signed out from all devices."));
      authStore.clearAccessToken();
      await signout().catch(() => undefined);
      await navigate({ to: "/signin" });
    },
    meta: { showErrorMessage: true },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
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
    <Card
      title={t("account.securityTitle", "Change Password")}
      description={t("account.securityDescription", "Changing your password will sign you out from all devices")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <form.Field name="currentPassword">
          {field => (
            <PasswordInput
              label={t("account.currentPassword", "Current Password")}
              placeholder={t("account.currentPasswordPlaceholder", "Enter current password")}
              {...getFieldProps(field, changePasswordSchema)}
              autoComplete="current-password"
            />
          )}
        </form.Field>
        <form.Field name="newPassword">
          {field => (
            <PasswordInput
              label={t("account.newPassword", "New Password")}
              placeholder={t("account.newPasswordPlaceholder", "Enter new password")}
              {...getFieldProps(field, changePasswordSchema)}
              autoComplete="new-password"
            />
          )}
        </form.Field>
        <div className="flex justify-end">
          <Button type="submit" loading={isPending} variant="destructive">
            {t("account.changePassword", "Change Password")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
