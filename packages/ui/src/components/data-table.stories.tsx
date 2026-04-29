/** biome-ignore-all lint/nursery/noJsxPropsBind: fine for stories */
import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { Button } from "./button";
import { DataTable, DataTableColumnHeader, type FilterField } from "./data-table";

// DataTable is used in render functions below; imported here to keep it co-located

// ---- Sample data ----

interface Patient {
  id: string;
  name: string;
  age: number;
  status: "active" | "inactive" | "critical";
  department: string;
  admittedAt: string;
  hasInsurance: boolean;
}

const STATUS_LABEL: Record<Patient["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  critical: "Critical",
};

const NAMES = [
  "Aisha Khan",
  "Omar Farooq",
  "Sarah Johnson",
  "James Miller",
  "Fatima Ali",
  "Chen Wei",
  "Maria Garcia",
  "David Okonkwo",
  "Priya Sharma",
  "Ahmed Hassan",
];

const DEPARTMENTS = ["Cardiology", "Neurology", "Pediatrics", "Oncology", "Emergency"];
const STATUSES: Patient["status"][] = ["active", "inactive", "critical"];

const PATIENTS: Patient[] = Array.from({ length: 47 }, (_, i) => {
  const baseName = NAMES[i % 10] ?? "Patient";
  return {
    id: String(i + 1),
    name: baseName.replace(/(\w+)$/, m => `${m} ${i + 1}`),
    age: 20 + ((i * 7) % 60),
    status: STATUSES[i % 3] ?? "active",
    department: DEPARTMENTS[i % 5] ?? "Cardiology",
    admittedAt: new Date(2026, 0, 1 + (i % 28)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    hasInsurance: i % 3 !== 2,
  };
});

// ---- Column definitions ----

const STATUS_STYLE: Record<Patient["status"], string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  critical: "bg-red-100 text-red-800",
};

function StatusCell({ status }: { status: Patient["status"] }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function InsuranceCell({ value }: { value: boolean }) {
  return value ? "Yes" : "No";
}

const columns: ColumnDef<Patient, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    size: 200,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell status={row.original.status} />,
    size: 100,
  },
  {
    accessorKey: "department",
    header: "Department",
    size: 140,
  },
  {
    accessorKey: "admittedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Admitted" />,
    size: 130,
  },
  {
    accessorKey: "hasInsurance",
    header: "Insurance",
    cell: ({ row }) => <InsuranceCell value={row.original.hasInsurance} />,
    size: 90,
  },
];

// ---- Filter fields ----

const FILTER_FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Critical", value: "critical" },
    ],
  },
  {
    id: "department",
    label: "Department",
    type: "select",
    options: DEPARTMENTS.map(d => ({ label: d, value: d })),
  },
  { id: "hasInsurance", label: "Insured only", type: "boolean" },
];

// ---- Client-side simulation helpers ----

function applyFilters(data: Patient[], search: string, columnFilters: ColumnFiltersState): Patient[] {
  let result = data;

  if (search) {
    const lower = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(lower));
  }

  for (const filter of columnFilters) {
    if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
      result = result.filter(p => (filter.value as string[]).includes(p.status));
    }
    if (filter.id === "department" && Array.isArray(filter.value) && filter.value.length > 0) {
      result = result.filter(p => (filter.value as string[]).includes(p.department));
    }
    if (filter.id === "hasInsurance" && filter.value === true) {
      result = result.filter(p => p.hasInsurance);
    }
  }

  return result;
}

function applySort(data: Patient[], sorting: SortingState): Patient[] {
  if (sorting.length === 0) {
    return data;
  }
  const [sort] = sorting;
  if (!sort) {
    return data;
  }
  return [...data].sort((a, b) => {
    const aVal = a[sort.id as keyof Patient];
    const bVal = b[sort.id as keyof Patient];
    if (aVal === bVal) {
      return 0;
    }
    const cmp = aVal < bVal ? -1 : 1;
    return sort.desc ? -cmp : cmp;
  });
}

function getPatientId(row: Patient): string {
  return row.id;
}

function noopPaginationChange(_p: PaginationState): void {
  /* static story */
}

function noopSearchChange(_s: string): void {
  /* static story */
}

// ---- Story wrapper components ----

function BasicTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const pageData = useMemo(
    () => PATIENTS.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [pagination]
  );

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(PATIENTS.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}

function SearchableTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => applyFilters(PATIENTS, search, []), [search]);
  const pageData = useMemo(
    () => filtered.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [filtered, pagination]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, []);

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(filtered.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search patients..."
    />
  );
}

function SortableTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sorted = useMemo(() => applySort(PATIENTS, sorting), [sorting]);
  const pageData = useMemo(
    () => sorted.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [sorted, pagination]
  );

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(PATIENTS.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}

function FilterableTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filtered = useMemo(() => applyFilters(PATIENTS, "", columnFilters), [columnFilters]);
  const pageData = useMemo(
    () => filtered.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [filtered, pagination]
  );

  const handleFiltersChange = useCallback((filters: ColumnFiltersState) => {
    setColumnFilters(filters);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, []);

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(filtered.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
      columnFilters={columnFilters}
      onColumnFiltersChange={handleFiltersChange}
      filterFields={FILTER_FIELDS}
    />
  );
}

function SelectableTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const pageData = useMemo(
    () => PATIENTS.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [pagination]
  );

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(PATIENTS.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={getPatientId}
      selectionActions={count => (
        <>
          <Button variant="destructive" size="sm">
            Delete ({count})
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </>
      )}
    />
  );
}

function FullFeaturedTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(() => applyFilters(PATIENTS, search, columnFilters), [search, columnFilters]);
  const sorted = useMemo(() => applySort(filtered, sorting), [filtered, sorting]);
  const pageData = useMemo(
    () => sorted.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [sorted, pagination]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, []);

  const handleFiltersChange = useCallback((filters: ColumnFiltersState) => {
    setColumnFilters(filters);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, []);

  return (
    <DataTable
      columns={columns}
      data={pageData}
      pageCount={Math.ceil(filtered.length / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search patients..."
      columnFilters={columnFilters}
      onColumnFiltersChange={handleFiltersChange}
      filterFields={FILTER_FIELDS}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={getPatientId}
      selectionActions={count => (
        <>
          <Button variant="destructive" size="sm">
            Delete ({count})
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </>
      )}
    />
  );
}

function LoadingTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      pageCount={1}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      onPaginationChange={noopPaginationChange}
      isLoading
    />
  );
}

function EmptyTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      pageCount={0}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      onPaginationChange={noopPaginationChange}
    />
  );
}

function CustomEmptyTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      pageCount={0}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      onPaginationChange={noopPaginationChange}
      search="xyz123"
      onSearchChange={noopSearchChange}
      searchPlaceholder="Search patients..."
      emptyState={
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="font-medium text-sm">No patients found</p>
          <p className="text-muted-foreground text-xs">Try adjusting your search or filters.</p>
        </div>
      }
    />
  );
}

// ---- Meta ----

// DataTable is generic — all stories use render functions, so no component binding needed
const meta: Meta = {
  title: "Data Table",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// ---- Stories ----

export const Default: Story = {
  render: () => <BasicTable />,
};

export const WithSearch: Story = {
  render: () => <SearchableTable />,
};

export const WithSorting: Story = {
  render: () => <SortableTable />,
};

export const WithFilters: Story = {
  render: () => <FilterableTable />,
};

export const WithSelection: Story = {
  render: () => <SelectableTable />,
};

export const FullFeatured: Story = {
  render: () => <FullFeaturedTable />,
};

export const Loading: Story = {
  render: () => <LoadingTable />,
};

export const Empty: Story = {
  render: () => <EmptyTable />,
};

export const CustomEmptyState: Story = {
  render: () => <CustomEmptyTable />,
};
