import { useCallback, useMemo } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectOptionGroup {
  label?: string;
  items: SelectOption[];
}

export interface SelectProps {
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  name?: string;
  errors?: { message?: string }[];
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler;
  items?: SelectOptionGroup[];
  size?: "sm" | "default";
}

export function Select({
  placeholder,
  label,
  isRequired,
  description,
  isInvalid = false,
  name,
  errors,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  items = [],
  size,
}: SelectProps) {
  const valueLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of items) {
      for (const option of group.items) {
        map.set(option.value, option.label);
      }
    }
    return map;
  }, [items]);

  const handleValueChange = useCallback(
    (val: string | null) => {
      if (val !== null) {
        onValueChange?.(val);
      }
    },
    [onValueChange]
  );

  return (
    <Field data-invalid={isInvalid} onBlur={onBlur}>
      {label && (
        <FieldLabel htmlFor={name} className="w-fit! gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <SelectRoot
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger {...(size && { size })} aria-invalid={isInvalid} aria-required={isRequired}>
          <SelectValue placeholder={placeholder}>
            {(val: string | null) => (val !== null ? (valueLabelMap.get(val) ?? val) : placeholder)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {items.map((group, gi) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: groups have no unique id
            <SelectGroup key={gi}>
              {group.label && <SelectLabel>{group.label}</SelectLabel>}
              {group.items.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </SelectRoot>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
