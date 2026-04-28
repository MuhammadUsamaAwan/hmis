import type { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { VariantProps } from "class-variance-authority";
import { isValidElement, useCallback, useEffect, useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/shadcn/components/ui/alert-dialog";
import type { buttonVariants } from "@/ui/shadcn/components/ui/button";
import { Button } from "./button";

export type AlertDialogProps = Omit<AlertDialogPrimitive.Root.Props, "open" | "onOpenChange"> & {
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  cancelText?: string;
  okText?: string;
  okVariant?: VariantProps<typeof buttonVariants>["variant"];
  onConfirm?: () => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AlertDialog({
  title,
  description,
  trigger,
  cancelText = "Cancel",
  okText = "Confirm",
  okVariant = "default",
  onConfirm,
  open: openProp,
  onOpenChange,
  ...props
}: AlertDialogProps) {
  const [open, setOpen] = useState(openProp ?? false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const handleConfirm = useCallback(async () => {
    if (!onConfirm) {
      handleOpenChange(false);
      return;
    }
    const result = onConfirm();
    if (result instanceof Promise) {
      setLoading(true);
      try {
        await result;
        handleOpenChange(false);
      } finally {
        setLoading(false);
      }
      return;
    }
    handleOpenChange(false);
  }, [onConfirm, handleOpenChange]);

  return (
    <AlertDialogRoot open={open} onOpenChange={handleOpenChange} {...props}>
      {trigger && <AlertDialogTrigger render={isValidElement(trigger) ? trigger : undefined} />}
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <Button variant={okVariant} loading={loading} onClick={handleConfirm}>
            {okText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
