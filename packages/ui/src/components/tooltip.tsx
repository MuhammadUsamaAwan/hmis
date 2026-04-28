import type { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { isValidElement } from "react";
import {
  TooltipContent,
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from "@/ui/shadcn/components/ui/tooltip";

export type TooltipProps = TooltipPrimitive.Root.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    content: React.ReactNode;
    children: React.ReactNode;
  };

export function Tooltip({ content, children, align, alignOffset, side, sideOffset, ...props }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipRoot {...props}>
        <TooltipTrigger render={isValidElement(children) ? children : <span>{children}</span>} />
        <TooltipContent align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
