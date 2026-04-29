import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@app/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@app/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, LogOut } from "lucide-react";
import { hospitalInfo, navGroups } from "./nav-data";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={hospitalInfo.fullName}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <hospitalInfo.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{hospitalInfo.name}</span>
                <span className="truncate text-muted-foreground text-xs">{hospitalInfo.fullName}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(item =>
                item.items ? (
                  <CollapsibleNavItem key={item.title} item={item} pathname={pathname} />
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      render={<Link to={item.url} />}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function CollapsibleNavItem({
  item,
  pathname,
}: {
  item: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    items?: { title: string; url: string }[];
  };
  pathname: string;
}) {
  const isActive = pathname === item.url || item.items?.some(sub => pathname === sub.url);

  return (
    <Collapsible defaultOpen={isActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={item.title} isActive={Boolean(isActive)}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ms-auto transition-transform duration-200 group-data-panel-open/collapsible:rotate-90" />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map(sub => (
              <SidebarMenuSubItem key={sub.title}>
                <SidebarMenuSubButton isActive={pathname === sub.url} render={<Link to={sub.url} />}>
                  <span>{sub.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
