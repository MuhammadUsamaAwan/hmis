import { useCallback } from "react";
import { FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { Switch as SwitchPrimitive } from "@/ui/shadcn/components/ui/switch";

type BaseSwitchProps = React.ComponentProps<typeof SwitchPrimitive>;

export type SwitchFieldProps = Omit<BaseSwitchProps, "checked" | "defaultChecked"> & {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (checked: boolean) => void;
};

export function Switch({
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
}: SwitchFieldProps) {
  const handleCheckedChange = useCallback<NonNullable<BaseSwitchProps["onCheckedChange"]>>(
    (checked, eventDetails) => {
      onCheckedChange?.(checked, eventDetails);
      onValueChange?.(checked);
    },
    [onCheckedChange, onValueChange]
  );

  return (
    <div className="flex flex-col gap-1" data-invalid={isInvalid}>
      <div className="flex flex-row items-center gap-2">
        <SwitchPrimitive
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
