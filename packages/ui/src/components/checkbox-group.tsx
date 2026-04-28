import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { Checkbox as CheckboxPrimitive } from "@/ui/shadcn/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/ui/shadcn/components/ui/field";

export interface CheckboxGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

export interface CheckboxGroupProps {
  legend?: string;
  description?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  options: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  onBlur?: React.FocusEventHandler;
  disabled?: boolean;
}

export function CheckboxGroup({
  legend,
  description,
  isRequired,
  isInvalid = false,
  errors,
  options,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  disabled,
}: CheckboxGroupProps) {
  return (
    <FieldSet aria-invalid={isInvalid} onBlur={onBlur}>
      {legend && (
        <FieldLegend variant="label">
          {legend}
          {isRequired && <span className="ml-1 text-destructive">*</span>}
        </FieldLegend>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <CheckboxGroupPrimitive
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <FieldGroup>
          {options.map(option => (
            <Field key={option.value} orientation="horizontal">
              <CheckboxPrimitive
                id={option.value}
                name={option.value}
                disabled={option.disabled}
                aria-invalid={isInvalid}
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={option.value} className="font-normal">
                  {option.label}
                </FieldLabel>
                {option.description && <FieldDescription>{option.description}</FieldDescription>}
              </div>
            </Field>
          ))}
        </FieldGroup>
      </CheckboxGroupPrimitive>
      {isInvalid && errors && <FieldError errors={errors} />}
    </FieldSet>
  );
}
