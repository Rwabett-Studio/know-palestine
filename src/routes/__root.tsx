import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { websiteJsonLd, canonicalUrl } from "../lib/seo";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { PreFooter } from "../components/PreFooter";
import { FooterBar } from "../components/FooterBar";
import { LanguageProvider, useLanguage } from "../lib/i18n";
import { AuthProvider } from "../lib/auth";

function NotFoundComponent() {
  const { t, lang } = useLanguage();
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("not_found_title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("not_found_body")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("go_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t, lang } = useLanguage();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("error_title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error_body")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("try_again")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("go_home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "إعرف فلسطين — Know Palestine" },
      { name: "description", content: "اكتشف المدن واقرأ آخر المقالات" },
      { property: "og:title", content: "إعرف فلسطين — Know Palestine" },
      { property: "og:description", content: "Discover Palestinian cities and read the latest articles" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "إعرف فلسطين — Know Palestine" },
      { property: "og:locale", content: "ar_PS" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "إعرف فلسطين — Know Palestine" },
      { name: "twitter:description", content: "اكتشف المدن واقرأ آخر المقالات" },
      { name: "theme-color", content: "#1a1a1a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: canonicalUrl("/") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: websiteJsonLd() },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Default to Arabic on SSR; LanguageProvider syncs to user preference on mount.
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { lang } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin routes render their own chrome (see routes/admin.tsx).
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="min-h-screen flex flex-col bg-background"
        data-lang={lang}
        style={{
          fontFamily:
            lang === "en"
              ? "Inter, system-ui, sans-serif"
              : "'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif",
        }}
      >
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <PreFooter />
        <FooterBar />
      </div>
    </QueryClientProvider>
  );
}
