import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { isValidElement } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadcnDialog,
} from "../shadcn/components/ui/dialog";
import { Button } from "./button";

export type DialogProps = DialogPrimitive.Root.Props & {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  cancelText?: string;
  confirm?: React.ReactNode;
};

export function Dialog({
  title,
  description,
  children,
  trigger,
  cancelText = "Cancel",
  confirm,
  ...props
}: DialogProps) {
  return (
    <ShadcnDialog {...props}>
      {trigger && <DialogTrigger render={isValidElement(trigger) ? trigger : undefined} />}
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">{children}</div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">{cancelText}</Button>} />
          {confirm}
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  );
}
