import { registerPatientMutationOptions, tehsilsQueryOptions } from "@app/client";
import { Button } from "@app/ui/button";
import { Card } from "@app/ui/card";
import { ComboboxField } from "@app/ui/combobox";
import { DatePicker } from "@app/ui/date-picker";
import { Input } from "@app/ui/input";
import {
  bloodGroups,
  GENDERS,
  genders,
  guardianRelations,
  maritalStatuses,
  PATIENT_TYPES,
  type PatientRegistrationSchema,
  patientRegistrationSchema,
  patientTypes,
  VISIT_TYPES,
  visitTypes,
} from "@app/validations";
import { getFieldProps } from "@app/validations/form";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(protected)/patients/register")({
  component: PatientRegistrationPage,
});

function PatientRegistrationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    ...registerPatientMutationOptions(),
    meta: {
      showErrorMessage: true,
      successMessage: t("patients.registeredSuccessfully", "Patient registered successfully"),
    },
    onSuccess: async () => {
      await navigate({ to: "/patients" });
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: GENDERS.MALE,
      dateOfBirth: "",
      guardianRelation: undefined,
      guardianName: "",
      maritalStatus: undefined,
      bloodGroup: undefined,
      occupation: "",
      cnic: "",
      phone: "",
      alternatePhone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      address: {
        line1: "",
        line2: "",
        area: "",
        tehsilId: "",
        postalCode: "",
      },
      patientType: PATIENT_TYPES.NEW,
      visitType: VISIT_TYPES.GENERAL,
    } as PatientRegistrationSchema,
    validators: {
      // @ts-expect-error known issue with standard schema
      onChange: patientRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = { ...value };
      if (!(payload.address?.line1 && payload.address?.tehsilId)) {
        payload.address = undefined;
      }
      await mutateAsync(payload);
    },
  });

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  const handleCancel = useCallback(async () => {
    await navigate({ to: "/patients" });
  }, [navigate]);

  const { data: tehsils = [] } = useQuery(tehsilsQueryOptions());

  const tehsilOptions = useMemo(
    () => [
      { items: (tehsils ?? []).map(tehsil => ({ label: `${tehsil.name} (${tehsil.district})`, value: tehsil.id })) },
    ],
    [tehsils]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight">{t("patients.registerTitle", "Register New Patient")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Demographics */}
        <Card title={t("patients.demographics", "Demographics")} className="lg:col-span-2">
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <form.Field name="firstName">
                {field => (
                  <Input
                    label={t("patients.firstName", "First Name")}
                    placeholder={t("patients.firstNamePlaceholder", "Enter first name")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="middleName">
                {field => (
                  <Input
                    label={t("patients.middleName", "Middle Name")}
                    placeholder={t("patients.middleNamePlaceholder", "Enter middle name")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="lastName">
                {field => (
                  <Input
                    label={t("patients.lastName", "Last Name")}
                    placeholder={t("patients.lastNamePlaceholder", "Enter last name")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <form.Field name="gender">
                {field => (
                  <ComboboxField
                    label={t("patients.gender", "Gender")}
                    placeholder={t("patients.genderPlaceholder", "Select gender")}
                    items={[{ items: genders.map(g => ({ label: g, value: g })) }]}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="dateOfBirth">
                {field => (
                  <DatePicker
                    label={t("patients.dateOfBirth", "Date of Birth")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                    maxDate={new Date()}
                  />
                )}
              </form.Field>
              <form.Field name="occupation">
                {field => (
                  <Input
                    label={t("patients.occupation", "Occupation")}
                    placeholder={t("patients.occupationPlaceholder", "Enter occupation")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="guardianRelation">
                {field => (
                  <ComboboxField
                    label={t("patients.guardianRelation", "Guardian Relation")}
                    placeholder={t("patients.guardianRelationPlaceholder", "Select relation")}
                    items={[{ items: guardianRelations.map(r => ({ label: r, value: r })) }]}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="guardianName">
                {field => (
                  <Input
                    label={t("patients.guardianName", "Guardian Name")}
                    placeholder={t("patients.guardianNamePlaceholder", "Guardian name")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="maritalStatus">
                {field => (
                  <ComboboxField
                    label={t("patients.maritalStatus", "Marital Status")}
                    placeholder={t("patients.maritalStatusPlaceholder", "Select marital status")}
                    items={[
                      {
                        items: maritalStatuses.map(s => ({
                          label: s,
                          value: s,
                        })),
                      },
                    ]}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="bloodGroup">
                {field => (
                  <ComboboxField
                    label={t("patients.bloodGroup", "Blood Group")}
                    placeholder={t("patients.bloodGroupPlaceholder", "Select blood group")}
                    items={[{ items: bloodGroups.map(bg => ({ label: bg, value: bg })) }]}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </Card>

        {/* Identification & Contact */}
        <Card title={t("patients.contact", "Contact Information")}>
          <div className="grid gap-4">
            <form.Field name="cnic">
              {field => (
                <Input
                  label={t("patients.cnic", "CNIC")}
                  placeholder={t("patients.cnicPlaceholder", "Enter CNIC")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <form.Field name="phone">
              {field => (
                <Input
                  label={t("patients.phone", "Phone Number")}
                  placeholder={t("patients.phonePlaceholder", "Enter phone number")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <form.Field name="alternatePhone">
              {field => (
                <Input
                  label={t("patients.alternatePhone", "Alternate Phone")}
                  placeholder={t("patients.alternatePhonePlaceholder", "Enter alternate phone")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <form.Field name="email">
              {field => (
                <Input
                  label={t("patients.email", "Email")}
                  placeholder={t("patients.emailPlaceholder", "Enter email")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card title={t("patients.emergencyContact", "Emergency Contact")}>
          <div className="grid gap-4">
            <form.Field name="emergencyContactName">
              {field => (
                <Input
                  label={t("patients.emergencyName", "Contact Name")}
                  placeholder={t("patients.emergencyNamePlaceholder", "Enter contact name")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="emergencyContactPhone">
                {field => (
                  <Input
                    label={t("patients.emergencyPhone", "Phone")}
                    placeholder={t("patients.emergencyPhonePlaceholder", "Enter phone number")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="emergencyContactRelation">
                {field => (
                  <Input
                    label={t("patients.emergencyRelation", "Relation")}
                    placeholder={t("patients.emergencyRelationPlaceholder", "Enter relation")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card title={t("patients.address", "Address")}>
          <div className="grid gap-4">
            <form.Field name="address.line1">
              {field => (
                <Input
                  label={t("patients.addressLine1", "Address Line 1")}
                  placeholder={t("patients.addressLine1Placeholder", "Street address")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <form.Field name="address.line2">
              {field => (
                <Input
                  label={t("patients.addressLine2", "Address Line 2")}
                  placeholder={t("patients.addressLine2Placeholder", "Apartment, suite, etc.")}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="address.area">
                {field => (
                  <Input
                    label={t("patients.addressArea", "Area")}
                    placeholder={t("patients.addressAreaPlaceholder", "Neighborhood")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
              <form.Field name="address.postalCode">
                {field => (
                  <Input
                    label={t("patients.addressPostalCode", "Postal Code")}
                    placeholder={t("patients.addressPostalCodePlaceholder", "Zip code")}
                    {...getFieldProps(field, patientRegistrationSchema)}
                  />
                )}
              </form.Field>
            </div>
            <form.Field name="address.tehsilId">
              {field => (
                <ComboboxField
                  label={t("patients.addressTehsil", "Tehsil")}
                  placeholder={t("patients.addressTehsilPlaceholder", "Search and select tehsil")}
                  items={tehsilOptions}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
          </div>
        </Card>

        {/* Registration Details */}
        <Card title={t("patients.registrationDetails", "Registration Details")}>
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="patientType">
              {field => (
                <ComboboxField
                  label={t("patients.patientType", "Patient Type")}
                  placeholder={t("patients.patientTypePlaceholder", "Select patient type")}
                  items={[{ items: patientTypes.map(pType => ({ label: pType, value: pType })) }]}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
            <form.Field name="visitType">
              {field => (
                <ComboboxField
                  label={t("patients.visitType", "Visit Type")}
                  placeholder={t("patients.visitTypePlaceholder", "Select visit type")}
                  items={[{ items: visitTypes.map(vType => ({ label: vType, value: vType })) }]}
                  {...getFieldProps(field, patientRegistrationSchema)}
                />
              )}
            </form.Field>
          </div>
        </Card>

        <div className="flex justify-end gap-4 lg:col-span-2">
          <Button variant="outline" type="button" onClick={handleCancel}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button type="submit" loading={isPending}>
            {t("patients.registerSubmit", "Register Patient")}
          </Button>
        </div>
      </form>
    </div>
  );
}
