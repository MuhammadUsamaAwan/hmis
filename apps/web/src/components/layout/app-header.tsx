import { SidebarTrigger } from "@app/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ms-2" />
      <div className="h-4 w-px bg-border" />
      <h1 className="font-medium text-sm">Hospital Management Information System</h1>
    </header>
  );
}
