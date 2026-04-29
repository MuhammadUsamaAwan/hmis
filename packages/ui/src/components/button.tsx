import { type Button as ButtonPrimitive, Button as ShadcnButton } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/ui/shadcn/components/ui/button";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean };

export function Button({ loading, disabled, children, className, variant, size, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      disabled={loading || disabled}
      className={cn("cursor-pointer", buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && <Spinner data-icon="inline-start" />}
      {children}
    </ShadcnButton>
  );
}
