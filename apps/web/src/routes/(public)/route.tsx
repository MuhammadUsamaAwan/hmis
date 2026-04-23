import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "@/web/lib/auth-store";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
  beforeLoad: async () => {
    if (authStore.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
