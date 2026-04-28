import type { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { isValidElement } from "react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/ui/shadcn/components/ui/dropdown-menu";

export interface DropdownMenuItemDef {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  shortcut?: string;
}

export interface DropdownMenuGroupDef {
  label?: string;
  items: DropdownMenuItemDef[];
}

export type DropdownMenuProps = MenuPrimitive.Root.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    trigger: React.ReactNode;
    groups: DropdownMenuGroupDef[];
    contentClassName?: string;
  };

export function DropdownMenu({
  trigger,
  groups,
  align,
  alignOffset,
  side,
  sideOffset,
  contentClassName = "w-auto",
  ...props
}: DropdownMenuProps) {
  return (
    <DropdownMenuRoot {...props}>
      <DropdownMenuTrigger render={isValidElement(trigger) ? trigger : undefined} />
      <DropdownMenuContent
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {groups.map((group, gi) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable identity
          <div key={gi}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
              {group.items.map(item => (
                <DropdownMenuItem
                  key={item.label}
                  disabled={item.disabled}
                  variant={item.variant ?? "default"}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                  {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
