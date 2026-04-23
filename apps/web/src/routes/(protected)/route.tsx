import { userPermissionsQueryOptions } from "@app/client";
import { useInvalidationListener } from "@app/client/ws";
import { Spinner } from "@app/ui/spinner";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
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

  return <Outlet />;
}
