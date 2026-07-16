import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arena Intelligence — Operations OS" },
      { name: "description", content: "Operating system for stadium and mega-event management." },
    ],
  }),
  component: Index,
});

function Index() {
  // True enterprise applications do not have marketing pages at the root of the app.
  // We immediately drop the user into the authentication gateway.
  return <Navigate to="/login" replace />;
}
