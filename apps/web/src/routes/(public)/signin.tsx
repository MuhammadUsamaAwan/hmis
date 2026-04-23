import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(public)/signin"!</div>;
}
