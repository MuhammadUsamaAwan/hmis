import type { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "../shadcn/components/ui/badge";

export type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export { Badge, badgeVariants };
