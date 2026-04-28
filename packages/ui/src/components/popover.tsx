import type { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { isValidElement } from "react";
import {
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  Popover as PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/ui/shadcn/components/ui/popover";

export type PopoverProps = PopoverPrimitive.Root.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    children?: React.ReactNode;
  };

export function Popover({
  trigger,
  title,
  description,
  children,
  align,
  alignOffset,
  side,
  sideOffset,
  ...props
}: PopoverProps) {
  return (
    <PopoverRoot {...props}>
      {trigger && <PopoverTrigger render={isValidElement(trigger) ? trigger : undefined} />}
      <PopoverContent align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
        {(title || description) && (
          <PopoverHeader>
            {title && <PopoverTitle>{title}</PopoverTitle>}
            {description && <PopoverDescription>{description}</PopoverDescription>}
          </PopoverHeader>
        )}
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
}
