import { listPatientsQueryOptions } from "@app/client";
import { Button } from "@app/ui/button";
import type { ColumnDef, SortingState } from "@app/ui/data-table";
import { DataTable, DataTableColumnHeader } from "@app/ui/data-table";
import { formatDate, formatDateTime } from "@app/ui/format";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(protected)/patients/")({
  component: PatientsPage,
});

interface PatientRow {
  id: string;
  mrn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  cnic: string | null;
  patientType: string;
  createdAt: string;
}

function PatientsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);

  const sortBy = sorting[0]?.id ?? "createdAt";
  const sortOrder = sorting[0]?.desc === false ? ("asc" as const) : ("desc" as const);

  const { data, isLoading } = useQuery(
    listPatientsQueryOptions({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
      ...(search && { q: search }),
    })
  );

  const columns = useMemo<ColumnDef<PatientRow, unknown>[]>(
    () => [
      {
        accessorKey: "mrn",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.mrn", "MRN")} />,
      },
      {
        id: "name",
        header: t("patients.name", "Name"),
        enableSorting: false,
        cell: ({ row }) => {
          const { firstName, middleName, lastName } = row.original;
          return [firstName, middleName, lastName].filter(Boolean).join(" ");
        },
      },
      {
        accessorKey: "gender",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.gender", "Gender")} />,
      },
      {
        accessorKey: "dateOfBirth",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.dob", "Date of Birth")} />,
        cell: ({ getValue }) => formatDate(getValue() as string),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.phone", "Phone")} />,
      },
      {
        accessorKey: "cnic",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.cnic", "CNIC")} />,
        meta: { label: t("patients.cnic", "CNIC") },
      },
      {
        accessorKey: "patientType",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.patientType", "Type")} />,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("patients.createdAt", "Registered")} />,
        cell: ({ getValue }) => formatDateTime(getValue() as string),
        meta: { label: t("patients.createdAt", "Registered") },
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight">{t("patients.title", "Patients")}</h1>
        <Button render={<Link to="/patients/register" />}>
          <Plus className="me-2 size-4" />
          {t("patients.register", "Register Patient")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={(data?.data as PatientRow[] | undefined) ?? []}
        isLoading={isLoading}
        pageCount={data?.pageCount ?? 1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("common.search", "Search...")}
      />
    </div>
  );
}
