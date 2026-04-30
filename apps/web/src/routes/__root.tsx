/// <reference types="vite/client" />

import { getEden } from "@app/client/eden";
import { DirectionProvider } from "@app/ui/direction";
import { ThemeProvider } from "@app/ui/theme-provider";
import { Toaster } from "@app/ui/toast";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { authStore } from "../lib/auth-store";

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async () => {
    try {
      const res = await getEden().refresh.get();
      if (res.data) {
        authStore.setAccessToken(res.data.accessToken);
      }
    } catch {
      // Refresh failed — user is unauthenticated
    }
  },
});

export function RootLayout() {
  return (
    <ThemeProvider>
      <DirectionProvider>
        <Outlet />
        <Toaster />
      </DirectionProvider>
    </ThemeProvider>
  );
}
