import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem as ComboboxPrimitiveItem,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "../shadcn/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "../shadcn/components/ui/field";
import { Button } from "./button";

interface ComboboxFieldBaseProps {
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  name?: string;
  errors?: { message?: string }[];
  disabled?: boolean;
  onBlur?: React.FocusEventHandler;
}

export interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxGroup {
  label?: string;
  items: ComboboxItem[];
}

export type SingleComboboxProps = ComboboxFieldBaseProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: ComboboxGroup[];
};

export type MultiComboboxProps = ComboboxFieldBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  items?: ComboboxGroup[];
};

export type ComboboxFieldProps = SingleComboboxProps | MultiComboboxProps;

const isItemEqualToValue = (a: ComboboxItem, b: ComboboxItem) => a.value === b.value;

type VirtualRow = { type: "label"; text: string } | { type: "item"; item: ComboboxItem };

const ITEM_HEIGHT = 32;
const LABEL_HEIGHT = 28;
const MAX_VISIBLE_ITEMS = 8;

function filterGroups(groups: ComboboxGroup[], query: string): ComboboxGroup[] {
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
  groups: ComboboxGroup[];
  highlightedValue: ComboboxItem | undefined;
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
            <ComboboxPrimitiveItem
              key={row.item.value}
              value={row.item}
              style={{ position: "absolute", top: vItem.start, height: vItem.size, left: 0, right: 0 }}
            >
              {row.item.label}
            </ComboboxPrimitiveItem>
          );
        })}
      </div>
    </ComboboxList>
  );
}

export function ComboboxField(props: ComboboxFieldProps) {
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
    disabled = false,
    onBlur,
  } = props;

  const groups = items ?? [];
  const flatItems = useMemo(() => groups.flatMap((g: ComboboxGroup) => g.items), [groups]);

  const [filterText, setFilterText] = useState("");
  const handleInputValueChange = useCallback((val: string) => setFilterText(val), []);

  const [highlightedValue, setHighlightedValue] = useState<ComboboxItem | undefined>(undefined);
  const handleItemHighlighted = useCallback((val: ComboboxItem | undefined) => setHighlightedValue(val), []);

  // Filtering owned here so both root (filteredItems) and list get the same data
  const filteredGroups = useMemo(() => filterGroups(groups, filterText), [groups, filterText]);
  const filteredFlatItems = useMemo(() => filteredGroups.flatMap((g: ComboboxGroup) => g.items), [filteredGroups]);

  const [internalMultiValue, setInternalMultiValue] = useState<string[]>(multiple ? (props.defaultValue ?? []) : []);

  const multiItemValues = useMemo(() => {
    const strings = multiple ? (props.value ?? internalMultiValue) : [];
    return strings
      .map((v: string) => flatItems.find((i: ComboboxItem) => i.value === v))
      .filter((i): i is ComboboxItem => i !== undefined);
  }, [multiple, props.value, internalMultiValue, flatItems]);

  const singleItemValue = useMemo(() => {
    if (multiple || props.value === undefined) {
      return;
    }
    return flatItems.find((i: ComboboxItem) => i.value === props.value) ?? null;
  }, [multiple, props.value, flatItems]);

  const singleDefaultValue = useMemo(() => {
    if (multiple || !props.defaultValue) {
      return;
    }
    return flatItems.find((i: ComboboxItem) => i.value === props.defaultValue);
  }, [multiple, props.defaultValue, flatItems]);

  const anchorRef = useComboboxAnchor();

  const handleChange = useCallback(
    (val: unknown) => {
      if (multiple) {
        const selected = (Array.isArray(val) ? val : [val]) as ComboboxItem[];
        const strings = selected.map((i: ComboboxItem) => i.value);
        if (props.value === undefined) {
          setInternalMultiValue(strings);
        }
        props.onValueChange?.(strings);
      } else {
        const item = val as ComboboxItem | null;
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
    <Field data-invalid={isInvalid} onBlur={onBlur}>
      {label && (
        <FieldLabel htmlFor={name} className="gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}

      {multiple ? (
        <Combobox<ComboboxItem, true>
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
        <Combobox<ComboboxItem>
          id={name}
          value={singleItemValue}
          defaultValue={singleDefaultValue}
          onValueChange={handleChange}
          {...sharedComboboxProps}
        >
          <ComboboxTrigger
            render={
              <Button variant="outline" className="justify-between font-normal">
                <ComboboxValue placeholder={placeholder} />
              </Button>
            }
          />

          <ComboboxContent>
            <ComboboxInput showTrigger={false} placeholder="Search..." />
            {list}
          </ComboboxContent>
        </Combobox>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
