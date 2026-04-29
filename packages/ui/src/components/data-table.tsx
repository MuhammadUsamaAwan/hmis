import type { Column, Row, Table as TanstackTable } from "@tanstack/react-table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/ui/shadcn/components/ui/button";
import { Checkbox } from "@/ui/shadcn/components/ui/checkbox";
import { Input } from "@/ui/shadcn/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/components/ui/table";
import { useDebounce } from "../hooks/use-debounce";
import { cn } from "../lib/cn";
import { Pagination } from "./pagination";
import { Select, type SelectOption } from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";

// ---- Types ----

export interface SelectFilterField {
  id: string;
  label: string;
  type: "select";
  options: { label: string; value: string }[];
}

export interface BooleanFilterField {
  id: string;
  label: string;
  type: "boolean";
}

export type FilterField = SelectFilterField | BooleanFilterField;

export interface DataTableLabels {
  search?: string;
  clearFilter?: string;
  clearAll?: string;
  view?: string;
  columns?: string;
  rowsSelected?: string;
  noResults?: string;
  selectAll?: string;
  selectRow?: string;
  clear?: string;
}

const DEFAULT_LABELS: Required<DataTableLabels> = {
  search: "Search...",
  clearFilter: "Clear filter",
  clearAll: "Clear all",
  view: "View",
  columns: "Columns",
  rowsSelected: "row(s) selected",
  noResults: "No results.",
  selectAll: "Select all",
  selectRow: "Select row",
  clear: "Clear",
};

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Total number of pages (from server). */
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  /** Omit to disable sortable column headers. */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** Omit to hide the search input. */
  search?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  /** Omit to hide filter buttons. Also requires filterFields. */
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  filterFields?: FilterField[];
  /** Omit to disable row selection. */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Stable row identity across pages (e.g. row => row.id). */
  getRowId?: (row: TData) => string;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  /** Render actions for selected rows. Shown in a floating bar at the bottom. */
  selectionActions?: (selectedCount: number) => React.ReactNode;
  /** Override default labels for i18n. */
  labels?: DataTableLabels;
}

// ---- Utilities ----

/** Convert camelCase / snake_case id into a readable label. e.g. "admittedAt" → "Admitted At" */
function humanizeColumnId(id: string): string {
  return id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/** Resolve a display label for a column: meta.label > string header > humanized id */
function getColumnLabel(col: { id: string; columnDef: { header?: unknown; meta?: { label?: string } } }): string {
  if (col.columnDef.meta?.label) {
    return col.columnDef.meta.label;
  }
  if (typeof col.columnDef.header === "string") {
    return col.columnDef.header;
  }
  return humanizeColumnId(col.id);
}

type Updater<T> = T | ((old: T) => T);

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater;
}

function getSelectFilterValues(columnFilters: ColumnFiltersState, id: string): string[] {
  return (columnFilters.find(f => f.id === id)?.value as string[] | undefined) ?? [];
}

function setSelectFilterValues(columnFilters: ColumnFiltersState, id: string, value: string[]): ColumnFiltersState {
  if (value.length === 0) {
    return columnFilters.filter(f => f.id !== id);
  }
  if (columnFilters.some(f => f.id === id)) {
    return columnFilters.map(f => (f.id === id ? { ...f, value } : f));
  }
  return [...columnFilters, { id, value }];
}

const PAGE_SIZE_OPTIONS: SelectOption[] = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];
const SKELETON_ROWS = 5;

// ---- Selection sub-components (module-level to avoid noNestedComponentDefinitions) ----

function SelectAllHeader<TData>({ table, label }: { table: TanstackTable<TData>; label: string }) {
  const handleChange = useCallback(
    (checked: boolean) => {
      table.toggleAllPageRowsSelected(Boolean(checked));
    },
    [table]
  );

  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
      onCheckedChange={handleChange}
      aria-label={label}
    />
  );
}

function SelectRowCell<TData>({ row, label }: { row: Row<TData>; label: string }) {
  const handleChange = useCallback(
    (checked: boolean) => {
      row.toggleSelected(Boolean(checked));
    },
    [row]
  );

  return (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={handleChange}
      aria-label={label}
    />
  );
}

// ---- DataTableColumnHeader ----

function getSortIcon(sorted: false | "asc" | "desc") {
  if (sorted === "asc") {
    return <ArrowUp className="size-3.5" />;
  }
  if (sorted === "desc") {
    return <ArrowDown className="size-3.5" />;
  }
  return <ArrowUpDown className="size-3.5 text-muted-foreground" />;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  const sorted = column.getIsSorted();

  const handleToggle = useCallback(() => {
    if (sorted === false) {
      column.toggleSorting(false); // → asc
    } else if (sorted === "asc") {
      column.toggleSorting(true); // → desc
    } else {
      column.clearSorting(); // → clear
    }
  }, [column, sorted]);

  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  return (
    <button
      type="button"
      className={cn("flex cursor-pointer select-none items-center gap-1.5 hover:text-foreground", className)}
      onClick={handleToggle}
    >
      {title}
      {getSortIcon(sorted)}
    </button>
  );
}

// ---- Filter sub-components ----

interface FilterOptionProps {
  label: string;
  optionValue: string;
  checked: boolean;
  selected: string[];
  fieldId: string;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
}

function DataTableFilterOption({
  label,
  optionValue,
  checked,
  selected,
  fieldId,
  columnFilters,
  onColumnFiltersChange,
}: FilterOptionProps) {
  const handleClick = useCallback(() => {
    const next = checked ? selected.filter(v => v !== optionValue) : [...selected, optionValue];
    onColumnFiltersChange(setSelectFilterValues(columnFilters, fieldId, next));
  }, [checked, columnFilters, fieldId, onColumnFiltersChange, optionValue, selected]);

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
      onClick={handleClick}
    >
      <Checkbox checked={checked} className="pointer-events-none" />
      {label}
    </button>
  );
}

interface ColumnVisibilityItemProps {
  colId: string;
  label: string;
  visible: boolean;
  onToggle: (id: string) => void;
}

function ColumnVisibilityItem({ colId, label, visible, onToggle }: ColumnVisibilityItemProps) {
  const handleClick = useCallback(() => {
    onToggle(colId);
  }, [colId, onToggle]);

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
      onClick={handleClick}
    >
      <Checkbox checked={visible} className="pointer-events-none" />
      {label}
    </button>
  );
}

// ---- Filter buttons (split to avoid conditional hooks) ----

interface FilterButtonProps {
  field: FilterField;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  clearFilterLabel: string;
}

function DataTableBooleanFilter({ field, columnFilters, onColumnFiltersChange }: FilterButtonProps) {
  const active = (columnFilters.find(f => f.id === field.id)?.value as boolean | undefined) === true;

  const handleToggle = useCallback(() => {
    if (active) {
      onColumnFiltersChange(columnFilters.filter(f => f.id !== field.id));
    } else if (columnFilters.some(f => f.id === field.id)) {
      onColumnFiltersChange(columnFilters.map(f => (f.id === field.id ? { ...f, value: true } : f)));
    } else {
      onColumnFiltersChange([...columnFilters, { id: field.id, value: true }]);
    }
  }, [active, columnFilters, field.id, onColumnFiltersChange]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        buttonVariants({ variant: active ? "default" : "outline", size: "sm" }),
        "h-8 cursor-pointer gap-1.5 text-xs"
      )}
    >
      {field.label}
      {active && <X className="size-3" />}
    </button>
  );
}

function DataTableSelectFilter({ field, columnFilters, onColumnFiltersChange, clearFilterLabel }: FilterButtonProps) {
  const selected = getSelectFilterValues(columnFilters, field.id);
  const hasActive = selected.length > 0;

  const handleClear = useCallback(() => {
    onColumnFiltersChange(setSelectFilterValues(columnFilters, field.id, []));
  }, [columnFilters, field.id, onColumnFiltersChange]);

  if (field.type !== "select") {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: hasActive ? "default" : "outline", size: "sm" }),
          "h-8 cursor-pointer gap-1.5 text-xs"
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        {field.label}
        {hasActive && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary-foreground font-semibold text-[10px] text-primary">
            {selected.length}
          </span>
        )}
        <ChevronDown className="size-3" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1.5">
        <div className="flex flex-col gap-0.5">
          {field.options.map(option => (
            <DataTableFilterOption
              key={option.value}
              label={option.label}
              optionValue={option.value}
              checked={selected.includes(option.value)}
              selected={selected}
              fieldId={field.id}
              columnFilters={columnFilters}
              onColumnFiltersChange={onColumnFiltersChange}
            />
          ))}
        </div>
        {hasActive && (
          <>
            <Separator />
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-muted-foreground text-xs hover:bg-muted"
              onClick={handleClear}
            >
              <X className="size-3" />
              {clearFilterLabel}
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function DataTableFilterButton({ field, columnFilters, onColumnFiltersChange, clearFilterLabel }: FilterButtonProps) {
  if (field.type === "boolean") {
    return (
      <DataTableBooleanFilter
        field={field}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
        clearFilterLabel={clearFilterLabel}
      />
    );
  }
  return (
    <DataTableSelectFilter
      field={field}
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      clearFilterLabel={clearFilterLabel}
    />
  );
}

// ---- DataTableToolbar ----

interface DataTableToolbarProps<TData> {
  search: string | undefined;
  onSearchChange: ((value: string) => void) | undefined;
  searchPlaceholder: string | undefined;
  columnFilters: ColumnFiltersState | undefined;
  onColumnFiltersChange: ((filters: ColumnFiltersState) => void) | undefined;
  filterFields: FilterField[] | undefined;
  table: TanstackTable<TData>;
  labels: Required<DataTableLabels>;
}

function DataTableToolbar<TData>({
  search,
  onSearchChange,
  searchPlaceholder,
  columnFilters,
  onColumnFiltersChange,
  filterFields,
  table,
  labels,
}: DataTableToolbarProps<TData>) {
  const [localSearch, setLocalSearch] = useState(search ?? "");

  useEffect(() => {
    setLocalSearch(search ?? "");
  }, [search]);

  const debouncedSearchChange = useDebounce((value: string) => {
    onSearchChange?.(value);
  }, 300);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearch(value);
      debouncedSearchChange(value);
    },
    [debouncedSearchChange]
  );

  const handleClearAll = useCallback(() => {
    onColumnFiltersChange?.([]);
  }, [onColumnFiltersChange]);

  const handleToggleVisibility = useCallback(
    (id: string) => {
      table.getColumn(id)?.toggleVisibility();
    },
    [table]
  );

  const visibilityColumns = table.getAllLeafColumns().filter(col => col.id !== "select" && col.getCanHide());
  const hasFilters = filterFields && filterFields.length > 0 && onColumnFiltersChange;
  const activeFilterCount = columnFilters?.length ?? 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onSearchChange && (
        <div className="relative">
          <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder ?? labels.search}
            value={localSearch}
            onChange={handleSearch}
            className="h-8 w-52 ps-8 text-xs"
          />
        </div>
      )}

      {hasFilters &&
        filterFields.map(field => (
          <DataTableFilterButton
            key={field.id}
            field={field}
            columnFilters={columnFilters ?? []}
            onColumnFiltersChange={onColumnFiltersChange}
            clearFilterLabel={labels.clearFilter}
          />
        ))}

      {activeFilterCount > 0 && onColumnFiltersChange && (
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 cursor-pointer gap-1 text-muted-foreground text-xs"
          )}
          onClick={handleClearAll}
        >
          {labels.clearAll}
          <X className="size-3" />
        </button>
      )}

      <div className="ms-auto">
        <Popover>
          <PopoverTrigger
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 cursor-pointer gap-1.5 text-xs")}
          >
            <SlidersHorizontal className="size-3.5" />
            {labels.view}
            <ChevronDown className="size-3" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 gap-0 p-1.5">
            <p className="px-2 py-1 font-medium text-muted-foreground text-xs">{labels.columns}</p>
            {visibilityColumns.map(col => (
              <ColumnVisibilityItem
                key={col.id}
                colId={col.id}
                label={getColumnLabel(col)}
                visible={col.getIsVisible()}
                onToggle={handleToggleVisibility}
              />
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ---- DataTablePagination ----

interface DataTablePaginationProps {
  pagination: PaginationState;
  pageCount: number;
  selectedCount: number | undefined;
  onPaginationChange: (p: PaginationState) => void;
  labels: Required<DataTableLabels>;
}

function DataTablePagination({
  pagination,
  pageCount,
  selectedCount,
  onPaginationChange,
  labels,
}: DataTablePaginationProps) {
  const handlePageSizeChange = useCallback(
    (value: string) => {
      onPaginationChange({ pageIndex: 0, pageSize: Number(value) });
    },
    [onPaginationChange]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      onPaginationChange({ ...pagination, pageIndex: p - 1 });
    },
    [onPaginationChange, pagination]
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-muted-foreground text-sm">
        {selectedCount !== undefined && (
          <span>
            {selectedCount} {labels.rowsSelected}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex w-28 shrink-0 items-center gap-1.5 text-sm">
          <Select
            placeholder="Rows"
            size="sm"
            value={String(pagination.pageSize)}
            onValueChange={handlePageSizeChange}
            items={[{ items: PAGE_SIZE_OPTIONS }]}
          />
        </div>

        <Pagination
          page={pagination.pageIndex + 1}
          totalPages={Math.max(1, pageCount)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

// ---- Table body renderer (avoids nested ternary) ----

interface RenderTableBodyArgs<TData> {
  isLoading: boolean;
  colCount: number;
  rows: Row<TData>[];
  emptyState: React.ReactNode;
  noResultsLabel: string;
}

function renderTableBody<TData>({ isLoading, colCount, rows, emptyState, noResultsLabel }: RenderTableBodyArgs<TData>) {
  if (isLoading) {
    return Array.from({ length: SKELETON_ROWS }).map((_row, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no identity
      <TableRow key={i}>
        {Array.from({ length: colCount }).map((_cell, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no identity
          <TableCell key={j}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={colCount} className="h-40 text-center">
          {emptyState ?? <span className="text-muted-foreground text-sm">{noResultsLabel}</span>}
        </TableCell>
      </TableRow>
    );
  }

  return rows.map(row => (
    <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
}

// ---- Floating selection bar ----

interface DataTableFloatingBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: React.ReactNode;
  labels: Required<DataTableLabels>;
}

function DataTableFloatingBar({ selectedCount, onClearSelection, children, labels }: DataTableFloatingBarProps) {
  return (
    <div className="fade-in slide-in-from-bottom-4 fixed inset-x-0 bottom-4 z-50 mx-auto w-fit animate-in">
      <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-2.5 shadow-lg">
        <span className="text-sm">
          <span className="font-medium tabular-nums">{selectedCount}</span>
          <span className="text-muted-foreground"> {labels.rowsSelected}</span>
        </span>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">{children}</div>
        <Separator orientation="vertical" className="h-5" />
        <button
          type="button"
          onClick={onClearSelection}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 cursor-pointer gap-1 text-xs")}
        >
          <X className="size-3" />
          {labels.clear}
        </button>
      </div>
    </div>
  );
}

// ---- DataTable ----

export function DataTable<TData>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting = [],
  onSortingChange,
  search,
  onSearchChange,
  searchPlaceholder,
  columnFilters = [],
  onColumnFiltersChange,
  filterFields,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
  isLoading = false,
  emptyState,
  selectionActions,
  labels: labelsProp,
}: DataTableProps<TData>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const withSelection = Boolean(onRowSelectionChange);

  const selectionColumn: ColumnDef<TData, unknown> = useMemo(
    () => ({
      id: "select",
      enableSorting: false,
      enableHiding: false,
      size: 40,
      header: ({ table: t }) => <SelectAllHeader table={t} label={labels.selectAll} />,
      cell: ({ row: r }) => <SelectRowCell row={r} label={labels.selectRow} />,
    }),
    [labels.selectAll, labels.selectRow]
  );

  const resolvedColumns = useMemo(
    () => (withSelection ? [selectionColumn, ...columns] : columns),
    [withSelection, selectionColumn, columns]
  );

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    pageCount,
    state: { pagination, sorting, columnFilters, rowSelection, columnVisibility },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: withSelection,
    ...(getRowId && { getRowId }),
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: updater => onPaginationChange(resolveUpdater(updater as Updater<PaginationState>, pagination)),
    ...(onSortingChange && {
      onSortingChange: (updater: Updater<SortingState>) => onSortingChange(resolveUpdater(updater, sorting)),
    }),
    ...(onColumnFiltersChange && {
      onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) =>
        onColumnFiltersChange(resolveUpdater(updater, columnFilters)),
    }),
    ...(onRowSelectionChange && {
      onRowSelectionChange: (updater: Updater<RowSelectionState>) =>
        onRowSelectionChange(resolveUpdater(updater, rowSelection)),
    }),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const rows = table.getRowModel().rows;
  const colCount = table.getVisibleLeafColumns().length;
  const selectedCount = Object.keys(rowSelection).length;
  const hasToolbar = onSearchChange !== undefined || (filterFields && filterFields.length > 0);

  const handleClearSelection = useCallback(() => {
    onRowSelectionChange?.({});
  }, [onRowSelectionChange]);

  return (
    <div className="flex flex-col gap-4">
      {hasToolbar && (
        <DataTableToolbar
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          columnFilters={columnFilters}
          onColumnFiltersChange={onColumnFiltersChange}
          filterFields={filterFields}
          table={table}
          labels={labels}
        />
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    style={
                      (header.column.columnDef.size ?? 0) > 0 ? { width: header.column.columnDef.size } : undefined
                    }
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {renderTableBody({
              isLoading,
              colCount,
              rows,
              emptyState,
              noResultsLabel: labels.noResults,
            })}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        pagination={pagination}
        pageCount={pageCount}
        selectedCount={withSelection ? selectedCount : undefined}
        onPaginationChange={onPaginationChange}
        labels={labels}
      />

      {selectionActions && selectedCount > 0 && (
        <DataTableFloatingBar selectedCount={selectedCount} onClearSelection={handleClearSelection} labels={labels}>
          {selectionActions(selectedCount)}
        </DataTableFloatingBar>
      )}
    </div>
  );
}
