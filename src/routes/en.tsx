import { createFileRoute, Outlet } from "@tanstack/react-router";

// English language layout route.
// All routes under /en/* are served here. The LanguageProvider automatically
// detects the /en/ URL prefix on mount and sets lang = "en".
// No additional logic needed — components read lang from context.

export const Route = createFileRoute("/en")({
  component: EnglishLayout,
});

function EnglishLayout() {
  return <Outlet />;
}
