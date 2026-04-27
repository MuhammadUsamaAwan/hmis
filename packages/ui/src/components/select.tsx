import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "../shadcn/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "../shadcn/components/ui/field";

interface SelectBaseProps {
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  name?: string;
  errors?: { message?: string }[];
  showClear?: boolean;
  disabled?: boolean;
}

export interface SelectItem {
  label: string;
  value: string;
}

interface SelectGroup {
  label?: string;
  items: SelectItem[];
}

export type SingleSelectProps = SelectBaseProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: SelectGroup[];
};

export type MultiSelectProps = SelectBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  items?: SelectGroup[];
};

export type SelectProps = SingleSelectProps | MultiSelectProps;

const isItemEqualToValue = (a: SelectItem, b: SelectItem) => a.value === b.value;

type VirtualRow = { type: "label"; text: string } | { type: "item"; item: SelectItem };

const ITEM_HEIGHT = 32;
const LABEL_HEIGHT = 28;
const MAX_VISIBLE_ITEMS = 8;

function filterGroups(groups: SelectGroup[], query: string): SelectGroup[] {
  if (!query) {
    return groups;
  }
  const lower = query.toLowerCase();
  return groups
    .map(group => ({ ...group, items: group.items.filter(item => item.label.toLowerCase().includes(lower)) }))
    .filter(group => group.items.length > 0);
}

function ComboboxVirtualList({
  groups,
  highlightedValue,
}: {
  groups: SelectGroup[];
  highlightedValue: SelectItem | undefined;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<VirtualRow[]>(() => {
    const result: VirtualRow[] = [];
    for (const group of groups) {
      if (group.label) {
        result.push({ type: "label", text: group.label });
      }
      for (const item of group.items) {
        result.push({ type: "item", item });
      }
    }
    return result;
  }, [groups]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: i => (rows[i]?.type === "label" ? LABEL_HEIGHT : ITEM_HEIGHT),
    overscan: 5,
  });

  // Scroll to keep keyboard-highlighted item in view
  useLayoutEffect(() => {
    if (!highlightedValue) {
      return;
    }
    const rowIndex = rows.findIndex(r => r.type === "item" && r.item.value === highlightedValue.value);
    if (rowIndex !== -1) {
      virtualizer.scrollToIndex(rowIndex, { behavior: "auto" });
    }
  }, [highlightedValue, rows, virtualizer]);

  const totalItems = groups.reduce((n, g) => n + g.items.length, 0);
  const listHeight = Math.min(totalItems, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT + 8;

  return (
    <ComboboxList
      ref={parentRef}
      className="no-scrollbar scroll-py-1 overflow-y-auto overscroll-contain p-1"
      style={{ height: listHeight || ITEM_HEIGHT }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map(vItem => {
          const row = rows[vItem.index];
          if (!row) {
            return null;
          }

          if (row.type === "label") {
            return (
              <div
                key={vItem.index}
                style={{ position: "absolute", top: vItem.start, height: vItem.size, left: 0, right: 0 }}
                className="flex items-center px-2 py-1.5 text-muted-foreground text-xs"
              >
                {row.text}
              </div>
            );
          }

          return (
            <ComboboxItem
              key={row.item.value}
              value={row.item}
              style={{ position: "absolute", top: vItem.start, height: vItem.size, left: 0, right: 0 }}
            >
              {row.item.label}
            </ComboboxItem>
          );
        })}
      </div>
    </ComboboxList>
  );
}

export function Select(props: SelectProps) {
  const {
    placeholder,
    label,
    isRequired,
    description,
    isInvalid = false,
    name,
    errors,
    items,
    multiple,
    showClear = true,
    disabled = false,
  } = props;

  const groups = items ?? [];
  const flatItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const [filterText, setFilterText] = useState("");
  const handleInputValueChange = useCallback((val: string) => setFilterText(val), []);

  const [highlightedValue, setHighlightedValue] = useState<SelectItem | undefined>(undefined);
  const handleItemHighlighted = useCallback((val: SelectItem | undefined) => setHighlightedValue(val), []);

  // Filtering owned here so both root (filteredItems) and list get the same data
  const filteredGroups = useMemo(() => filterGroups(groups, filterText), [groups, filterText]);
  const filteredFlatItems = useMemo(() => filteredGroups.flatMap(g => g.items), [filteredGroups]);

  const [internalMultiValue, setInternalMultiValue] = useState<string[]>(multiple ? (props.defaultValue ?? []) : []);

  const multiItemValues = useMemo(() => {
    const strings = multiple ? (props.value ?? internalMultiValue) : [];
    return strings.map(v => flatItems.find(i => i.value === v)).filter((i): i is SelectItem => i !== undefined);
  }, [multiple, props.value, internalMultiValue, flatItems]);

  const singleItemValue = useMemo(() => {
    if (multiple || props.value === undefined) {
      return;
    }
    return flatItems.find(i => i.value === props.value) ?? null;
  }, [multiple, props.value, flatItems]);

  const singleDefaultValue = useMemo(() => {
    if (multiple || !props.defaultValue) {
      return;
    }
    return flatItems.find(i => i.value === props.defaultValue);
  }, [multiple, props.defaultValue, flatItems]);

  const anchorRef = useComboboxAnchor();

  const handleChange = useCallback(
    (val: unknown) => {
      if (multiple) {
        const selected = (Array.isArray(val) ? val : [val]) as SelectItem[];
        const strings = selected.map(i => i.value);
        if (props.value === undefined) {
          setInternalMultiValue(strings);
        }
        props.onValueChange?.(strings);
      } else {
        const item = val as SelectItem | null;
        props.onValueChange?.(item?.value ?? "");
      }
    },
    [multiple, props.value, props.onValueChange]
  );

  const list = <ComboboxVirtualList groups={filteredGroups} highlightedValue={highlightedValue} />;

  const sharedComboboxProps = {
    virtualized: true,
    items: flatItems,
    filteredItems: filteredFlatItems,
    onInputValueChange: handleInputValueChange,
    onItemHighlighted: handleItemHighlighted,
    isItemEqualToValue,
    disabled,
  } as const;

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={name} className="gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}

      {multiple ? (
        <Combobox<SelectItem, true>
          id={name}
          multiple={true}
          value={multiItemValues}
          onValueChange={handleChange}
          {...sharedComboboxProps}
        >
          <ComboboxChips ref={anchorRef}>
            {multiItemValues.map(item => (
              <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
            ))}
            <ComboboxChipsInput placeholder={multiItemValues.length === 0 ? placeholder : undefined} />
          </ComboboxChips>
          <ComboboxContent anchor={anchorRef}>{list}</ComboboxContent>
        </Combobox>
      ) : (
        <Combobox<SelectItem>
          id={name}
          value={singleItemValue}
          defaultValue={singleDefaultValue}
          onValueChange={handleChange}
          {...sharedComboboxProps}
        >
          <ComboboxInput placeholder={placeholder} showClear={showClear} />
          <ComboboxContent>{list}</ComboboxContent>
        </Combobox>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
