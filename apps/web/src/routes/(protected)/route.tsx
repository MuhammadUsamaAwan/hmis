import { userPermissionsQueryOptions } from "@app/client";
import { useInvalidationListener } from "@app/client/ws";
import { SidebarInset, SidebarProvider } from "@app/ui/sidebar";
import { Spinner } from "@app/ui/spinner";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/web/components/layout/app-header";
import { AppSidebar } from "@/web/components/layout/app-sidebar";
import { authStore } from "@/web/lib/auth-store";
import { queryClient } from "@/web/lib/query-client";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
  beforeLoad: async () => {
    if (!authStore.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: () => queryClient.ensureQueryData(userPermissionsQueryOptions()),
  pendingComponent: () => (
    <div className="grid min-h-dvh place-content-center">
      <Spinner />
    </div>
  ),
});

function RouteComponent() {
  useInvalidationListener();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
