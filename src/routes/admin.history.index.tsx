import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import type { HistoryEvent } from "@/data/content";
import { useLanguage } from "@/lib/i18n";
import { ListPage } from "@/components/admin/ListPage";

export const Route = createFileRoute("/admin/history/")({
  component: HistoryAdmin,
});

function HistoryAdmin() {
  const { lang, pick } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [items, setItems] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    repo.history
      .listAll()
      .then(setItems)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ListPage
      title={tt("الأحداث التاريخية", "History")}
      dir={dir}
      tt={tt}
      loading={loading}
      error={error}
      newHref={
        <Link
          to="/admin/history/$id"
          params={{ id: "new" }}
          className="h-10 px-4 leading-10 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90"
        >
          {tt("+ حدث جديد", "+ New event")}
        </Link>
      }
      rows={items.map((h) => ({
        id: h.id,
        title: pick(h, "title"),
        subtitle: `[${h.publishStatus ?? "published"}] ${pick(h, "eventDate") ?? ""}`,
        image: h.image,
      }))}
      editHref={(id) => (
        <Link
          to="/admin/history/$id"
          params={{ id }}
          className="h-9 px-3 leading-9 rounded-[8px] text-sm bg-surface hover:bg-accent-warm"
        >
          {tt("تعديل", "Edit")}
        </Link>
      )}
    />
  );
}
