import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم — إعرف فلسطين" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        {tt("جارٍ التحميل...", "Loading...")}
      </div>
    );
  }
  if (!session) return null;

  const NAV = [
    { to: "/admin" as const, label: tt("الرئيسية", "Dashboard"), exact: true },
    { to: "/admin/cities" as const, label: tt("المدن", "Cities") },
    { to: "/admin/articles" as const, label: tt("المقالات", "Articles") },
    { to: "/admin/figures" as const, label: tt("الشخصيات", "Figures") },
    { to: "/admin/history" as const, label: tt("الأحداث", "History") },
    { to: "/admin/suggested" as const, label: tt("مواضيع مقترحة", "Suggested") },
    { to: "/admin/settings" as const, label: tt("إعدادات الموقع", "Site Settings") },
  ];

  return (
    <div
      className="min-h-screen flex bg-background"
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ fontFamily: lang === "en" ? "Inter, system-ui, sans-serif" : "'IBM Plex Sans Arabic', system-ui, sans-serif" }}
    >
      <aside className="w-60 shrink-0 border-e border-border bg-surface/40 flex flex-col">
        <div className="h-[72px] flex items-center gap-2 px-5 border-b border-border">
          <div className="w-9 h-9 rounded-full bg-text-primary text-background flex items-center justify-center text-sm font-bold">
            {lang === "ar" ? "ف" : "P"}
          </div>
          <span className="font-bold text-text-primary text-sm">
            {tt("لوحة التحكم", "Admin")}
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={n.exact ? { exact: true } : undefined}
              className="block px-3 h-10 leading-10 rounded-[10px] text-sm text-text-primary hover:bg-surface transition-colors"
              activeProps={{ className: "bg-text-primary text-background font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/"
            className="block px-3 h-10 leading-10 rounded-[10px] text-sm text-text-secondary hover:bg-surface"
          >
            {tt("← العودة للموقع", "← Back to site")}
          </Link>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/admin/login" });
            }}
            className="w-full text-start px-3 h-10 rounded-[10px] text-sm text-red-600 hover:bg-red-50"
          >
            {tt("تسجيل الخروج", "Sign out")}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
