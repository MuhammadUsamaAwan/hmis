import type { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useCallback, useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { Slider as SliderPrimitive_ } from "@/ui/shadcn/components/ui/slider";

export interface SliderProps extends SliderPrimitive.Root.Props {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  showValue?: boolean;
  formatValue?: (value: number[]) => string;
  name?: string;
}

function toArray(value: number | readonly number[] | undefined): number[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? [...(value as readonly number[])] : [value as number];
}

function formatDefault(value: number[]): string {
  return value.join(" – ");
}

export function Slider({
  label,
  isRequired,
  description,
  isInvalid = false,
  errors,
  showValue = true,
  formatValue,
  name,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = useState<number[]>(() => toArray(value ?? defaultValue));

  const handleValueChange = useCallback<NonNullable<SliderPrimitive.Root.Props["onValueChange"]>>(
    (next, eventDetails) => {
      setInternalValue(toArray(next));
      onValueChange?.(next, eventDetails);
    },
    [onValueChange]
  );

  const displayValue = toArray(value ?? internalValue);

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={name} className="gap-1">
            {label}
            {isRequired && <span className="text-destructive">*</span>}
          </FieldLabel>
          {showValue && displayValue.length > 0 && (
            <span className="text-muted-foreground text-sm tabular-nums">
              {formatValue ? formatValue(displayValue) : formatDefault(displayValue)}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive_
        value={value}
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        onValueChange={handleValueChange}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
