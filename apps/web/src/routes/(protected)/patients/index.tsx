import { searchPatientsQueryOptions } from "@app/client";
import { Button } from "@app/ui/button";
import { DataTable } from "@app/ui/data-table";
import { Input } from "@app/ui/input";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(protected)/patients/")({
  component: PatientsPage,
});

function PatientsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const { data: patients, isLoading } = useQuery(searchPatientsQueryOptions(search));

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight">{t("patients.title", "Patients")}</h1>
        <Button render={<Link to="/patients/register" />}>
          <Plus className="me-2 size-4" />
          {t("patients.register", "Register Patient")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={t("patients.searchPlaceholder", "Search by MRN, name, phone or CNIC...")}
            className="pl-9"
            value={search}
            onValueChange={handleSearch}
          />
        </div>
      </div>

      <DataTable
        columns={[
          { header: t("patients.mrn", "MRN"), accessorKey: "mrn" },
          {
            header: t("patients.name", "Name"),
            cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
          },
          { header: t("patients.gender", "Gender"), accessorKey: "gender" },
          { header: t("patients.phone", "Phone"), accessorKey: "phone" },
          { header: t("patients.patientType", "Type"), accessorKey: "patientType" },
        ]}
        data={patients ?? []}
        isLoading={isLoading}
        pageCount={1}
        pagination={pagination}
        onPaginationChange={setPagination}
        emptyState={
          <div className="py-10 text-center text-muted-foreground">
            {search
              ? t("patients.noResults", "No patients found matching your search.")
              : t("patients.startSearch", "Enter a search term to find patients.")}
          </div>
        }
      />
    </div>
  );
}
