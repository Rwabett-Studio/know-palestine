import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const TABLES = [
  { table: "cities", to: "/admin/cities" as const, ar: "المدن", en: "Cities" },
  { table: "articles", to: "/admin/articles" as const, ar: "المقالات", en: "Articles" },
  { table: "figures", to: "/admin/figures" as const, ar: "الشخصيات", en: "Figures" },
  { table: "history_events", to: "/admin/history" as const, ar: "الأحداث", en: "History" },
];

function Dashboard() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        TABLES.map(async (t) => {
          const { count } = await supabase
            .from(t.table)
            .select("*", { count: "exact", head: true });
          return [t.table, count ?? 0] as const;
        }),
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {tt("لوحة التحكم", "Dashboard")}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {tt("مرحباً", "Welcome")} {user?.email}
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {TABLES.map((t) => (
          <Link
            key={t.table}
            to={t.to}
            className="p-6 rounded-[20px] bg-surface/60 hover:bg-surface transition-colors"
          >
            <div className="text-3xl font-bold text-text-primary">
              {counts[t.table] ?? "—"}
            </div>
            <div className="mt-2 text-sm text-text-secondary">{tt(t.ar, t.en)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
