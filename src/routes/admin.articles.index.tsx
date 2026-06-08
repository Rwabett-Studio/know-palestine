import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import type { Article } from "@/data/content";
import { useLanguage } from "@/lib/i18n";
import { ListPage } from "@/components/admin/ListPage";

export const Route = createFileRoute("/admin/articles/")({
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const { lang, pick } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    repo.articles
      .listAll()
      .then(setItems)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ListPage
      title={tt("المقالات", "Articles")}
      dir={dir}
      tt={tt}
      loading={loading}
      error={error}
      newHref={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/articles/import"
            className="h-10 px-4 leading-10 rounded-[10px] bg-surface text-text-primary text-sm font-medium hover:bg-accent-warm"
          >
            {tt("استيراد", "Import")}
          </Link>
          <Link
            to="/admin/articles/$id"
            params={{ id: "new" }}
            className="h-10 px-4 leading-10 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90"
          >
            {tt("+ مقال جديد", "+ New article")}
          </Link>
        </div>
      }
      rows={items.map((a) => ({
        id: a.id,
        title: pick(a, "title"),
        subtitle: `[${a.publishStatus ?? "published"}] ${pick(a, "excerpt") ?? ""}`,
        image: a.image,
      }))}
      editHref={(id) => (
        <Link
          to="/admin/articles/$id"
          params={{ id }}
          className="h-9 px-3 leading-9 rounded-[8px] text-sm bg-surface hover:bg-accent-warm"
        >
          {tt("تعديل", "Edit")}
        </Link>
      )}
    />
  );
}
