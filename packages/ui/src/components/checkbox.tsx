import { useCallback } from "react";
import { Checkbox as CheckboxPrimitive } from "@/ui/shadcn/components/ui/checkbox";
import { FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";

type BaseCheckboxProps = React.ComponentProps<typeof CheckboxPrimitive>;

export type CheckboxFieldProps = Omit<BaseCheckboxProps, "checked" | "defaultChecked"> & {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (checked: boolean) => void;
};

export function Checkbox({
  label,
  isRequired,
  description,
  isInvalid = false,
  name,
  errors,
  value,
  defaultValue,
  onValueChange,
  onCheckedChange,
  ...props
}: CheckboxFieldProps) {
  const handleCheckedChange = useCallback<NonNullable<BaseCheckboxProps["onCheckedChange"]>>(
    (checked, eventDetails) => {
      onCheckedChange?.(checked, eventDetails);
      onValueChange?.(checked);
    },
    [onCheckedChange, onValueChange]
  );

  return (
    <div className="flex flex-col gap-1" data-invalid={isInvalid}>
      <div className="flex flex-row items-center gap-2">
        <CheckboxPrimitive
          id={name}
          aria-invalid={isInvalid}
          aria-required={isRequired}
          name={name}
          checked={value}
          defaultChecked={defaultValue}
          onCheckedChange={handleCheckedChange}
          {...props}
        />
        {label && (
          <FieldLabel htmlFor={name} className="gap-1 font-normal">
            {label}
            {isRequired && <span className="text-destructive">*</span>}
          </FieldLabel>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </div>
  );
}
