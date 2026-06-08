import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import type { City } from "@/data/content";
import { useLanguage } from "@/lib/i18n";
import { ListPage } from "@/components/admin/ListPage";

export const Route = createFileRoute("/admin/cities/")({
  component: CitiesAdmin,
});

function CitiesAdmin() {
  const { lang, pick } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [items, setItems] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    repo.cities
      .listAll()
      .then(setItems)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ListPage
      title={tt("المدن", "Cities")}
      dir={dir}
      tt={tt}
      loading={loading}
      error={error}
      newHref={
        <Link
          to="/admin/cities/$id"
          params={{ id: "new" }}
          className="h-10 px-4 leading-10 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90"
        >
          {tt("+ مدينة جديدة", "+ New city")}
        </Link>
      }
      rows={items.map((c) => ({
        id: c.id,
        title: pick(c, "name"),
        subtitle: `[${c.publishStatus ?? "published"}] ${pick(c, "shortDesc") ?? ""}`,
        image: c.image,
      }))}
      editHref={(id) => (
        <Link
          to="/admin/cities/$id"
          params={{ id }}
          className="h-9 px-3 leading-9 rounded-[8px] text-sm bg-surface hover:bg-accent-warm"
        >
          {tt("تعديل", "Edit")}
        </Link>
      )}
    />
  );
}
