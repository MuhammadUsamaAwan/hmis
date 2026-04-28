import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/ui/shadcn/components/ui/field";
import { RadioGroupItem, RadioGroup as RadioGroupPrimitive } from "@/ui/shadcn/components/ui/radio-group";

export interface RadioGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps {
  legend?: string;
  description?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errors?: { message?: string }[];
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

export function RadioGroup({
  legend,
  description,
  isRequired,
  isInvalid = false,
  errors,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
}: RadioGroupProps) {
  return (
    <FieldSet aria-invalid={isInvalid}>
      {legend && (
        <FieldLegend variant="label">
          {legend}
          {isRequired && <span className="ml-1 text-destructive">*</span>}
        </FieldLegend>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroupPrimitive
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <FieldGroup>
          {options.map(option => (
            <Field key={option.value} orientation="horizontal">
              <RadioGroupItem
                id={option.value}
                value={option.value}
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
      </RadioGroupPrimitive>
      {isInvalid && errors && <FieldError errors={errors} />}
    </FieldSet>
  );
}
