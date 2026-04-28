import { useCallback } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../shadcn/components/ui/input-group";

export type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onValueChange" | "value" | "defaultValue"
> & {
  value?: number;
  defaultValue?: number;
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  onValueChange?: (value: number | undefined) => void;
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
};

export function NumberInput({
  label,
  isRequired,
  description,
  isInvalid = false,
  id,
  name,
  errors,
  onValueChange,
  leadingAddon,
  trailingAddon,
  ...props
}: NumberInputProps) {
  const resolvedId = id ?? name;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e);
      if (onValueChange) {
        const raw = e.target.value;
        onValueChange(raw === "" ? undefined : Number(raw));
      }
    },
    [props.onChange, onValueChange]
  );

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={resolvedId} className="gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <InputGroup>
        {leadingAddon && <InputGroupAddon align="inline-start">{leadingAddon}</InputGroupAddon>}
        {trailingAddon && <InputGroupAddon align="inline-end">{trailingAddon}</InputGroupAddon>}
        <InputGroupInput id={resolvedId} {...props} type="number" aria-invalid={isInvalid} onChange={handleChange} />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
