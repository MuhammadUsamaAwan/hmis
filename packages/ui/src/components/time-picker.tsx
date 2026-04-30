import { useCallback, useEffect, useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { InputGroup, InputGroupInput } from "@/ui/shadcn/components/ui/input-group";

export interface TimePickerProps {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  name?: string;
  errors?: { message?: string }[];
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  step?: number;
}

export function TimePicker({
  label,
  isRequired,
  description,
  isInvalid = false,
  name,
  errors,
  value,
  onValueChange,
  onBlur,
  disabled,
  step,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInternalValue(next);
      onValueChange?.(next || undefined);
    },
    [onValueChange]
  );

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={name} className="w-fit! gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <InputGroup>
        <InputGroupInput
          type="time"
          id={name}
          name={name}
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={isInvalid}
          step={step}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
