import type { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { HoverCardContent, HoverCard as HoverCardRoot, HoverCardTrigger } from "@/ui/shadcn/components/ui/hover-card";

export type HoverCardProps = PreviewCardPrimitive.Root.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    trigger: React.ReactNode;
    children: React.ReactNode;
  };

export function HoverCard({ trigger, children, align, alignOffset, side, sideOffset, ...props }: HoverCardProps) {
  return (
    <HoverCardRoot {...props}>
      <HoverCardTrigger render={<span style={{ display: "inline-flex" }}>{trigger}</span>} />
      <HoverCardContent align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
        {children}
      </HoverCardContent>
    </HoverCardRoot>
  );
}
