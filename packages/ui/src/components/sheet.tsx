import type { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { isValidElement } from "react";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  Sheet as SheetRoot,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/components/ui/sheet";
import { Button } from "./button";

export type SheetProps = SheetPrimitive.Root.Props & {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  cancelText?: string;
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
};

export function Sheet({
  trigger,
  title,
  description,
  children,
  footer,
  cancelText = "Close",
  side = "right",
  showCloseButton = true,
  ...props
}: SheetProps) {
  return (
    <SheetRoot {...props}>
      {trigger && <SheetTrigger render={isValidElement(trigger) ? trigger : undefined} />}
      <SheetContent side={side} showCloseButton={showCloseButton}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        <SheetFooter>
          {footer}
          <SheetClose render={<Button variant="outline">{cancelText}</Button>} />
        </SheetFooter>
      </SheetContent>
    </SheetRoot>
  );
}
