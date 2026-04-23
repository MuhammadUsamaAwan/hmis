import { useCallback } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../shadcn/components/ui/input-group";

export type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  onValueChange?: (value: string) => void;
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
};

export function Input({
  label,
  isRequired,
  description,
  isInvalid = false,
  name,
  errors,
  onValueChange,
  leadingAddon,
  trailingAddon,
  ...props
}: InputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e);
      onValueChange?.(e.target.value);
    },
    [props.onChange, onValueChange]
  );

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={name} className="gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <InputGroup>
        {leadingAddon && <InputGroupAddon align="inline-start">{leadingAddon}</InputGroupAddon>}
        {trailingAddon && <InputGroupAddon align="inline-end">{trailingAddon}</InputGroupAddon>}
        <InputGroupInput {...props} aria-invalid={isInvalid} onChange={handleChange} />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
