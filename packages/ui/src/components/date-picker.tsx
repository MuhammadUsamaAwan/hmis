import { format, isValid, parse, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "@/ui/shadcn/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/shadcn/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/shadcn/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/components/ui/popover";

const DISPLAY_FORMAT = "dd/MM/yyyy";

function isoToDisplay(iso: string): string {
  const date = parseISO(iso);
  return isValid(date) ? format(date, DISPLAY_FORMAT) : "";
}

function displayToIso(display: string): string | undefined {
  const parsed = parse(display, DISPLAY_FORMAT, new Date());
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : undefined;
}

function isoToDate(iso: string): Date | undefined {
  const date = parseISO(iso);
  return isValid(date) ? date : undefined;
}

export interface DatePickerProps {
  label?: string;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  name?: string;
  errors?: { message?: string }[];
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  label,
  isRequired,
  description,
  isInvalid = false,
  name,
  errors,
  value,
  onValueChange,
  placeholder = DISPLAY_FORMAT.toLowerCase(),
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? isoToDisplay(value) : "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value ? isoToDate(value) : undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value ? isoToDisplay(value) : "");
    setSelectedDate(value ? isoToDate(value) : undefined);
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);

      if (raw === "") {
        onValueChange?.(undefined);
        return;
      }

      const iso = displayToIso(raw);
      if (iso) {
        const date = isoToDate(iso);
        setSelectedDate(date);
        onValueChange?.(iso);
      } else {
        setSelectedDate(undefined);
      }
    },
    [onValueChange]
  );

  const handleInputBlur = useCallback(() => {
    if (!inputValue) {
      return;
    }
    const iso = displayToIso(inputValue);
    if (!iso) {
      setInputValue(value ? isoToDisplay(value) : "");
    }
  }, [inputValue, value]);

  const handleDaySelect = useCallback(
    (day: Date | undefined) => {
      setSelectedDate(day);
      if (day) {
        onValueChange?.(format(day, "yyyy-MM-dd"));
        setInputValue(format(day, DISPLAY_FORMAT));
        setOpen(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      } else {
        onValueChange?.(undefined);
        setInputValue("");
      }
    },
    [onValueChange]
  );

  const preventBlur = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const disabledMatchers: import("react-day-picker").Matcher[] = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  const calendarProps = {
    ...(selectedDate && { defaultMonth: selectedDate, selected: selectedDate }),
    ...(minDate && { startMonth: minDate }),
    ...(maxDate && { endMonth: maxDate }),
    ...(disabledMatchers.length > 0 && { disabled: disabledMatchers }),
  };

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={name} className="gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            id={name}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isInvalid}
            aria-label={label}
            maxLength={10}
          />
          <InputGroupAddon align="inline-end">
            <PopoverTrigger
              render={<InputGroupButton aria-label="Open calendar" onMouseDown={preventBlur} disabled={disabled} />}
            >
              <CalendarIcon />
            </PopoverTrigger>
          </InputGroupAddon>
        </InputGroup>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="single" onSelect={handleDaySelect} captionLayout="label" autoFocus {...calendarProps} />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
