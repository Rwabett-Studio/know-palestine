import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import { type Figure, FIELD_LABEL, FIELD_LABEL_EN } from "@/data/content";
import { useLanguage } from "@/lib/i18n";
import { ListPage } from "@/components/admin/ListPage";

export const Route = createFileRoute("/admin/figures/")({
  component: FiguresAdmin,
});

function FiguresAdmin() {
  const { lang, pick } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [items, setItems] = useState<Figure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    repo.figures
      .listAll()
      .then(setItems)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ListPage
      title={tt("الشخصيات", "Figures")}
      dir={dir}
      tt={tt}
      loading={loading}
      error={error}
      newHref={
        <Link
          to="/admin/figures/$id"
          params={{ id: "new" }}
          className="h-10 px-4 leading-10 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90"
        >
          {tt("+ شخصية جديدة", "+ New figure")}
        </Link>
      }
      rows={items.map((f) => ({
        id: f.id,
        title: pick(f, "name"),
        subtitle: `[${f.publishStatus ?? "published"}] ${lang === "ar" ? FIELD_LABEL[f.field] : FIELD_LABEL_EN[f.field]}`,
        image: f.portrait,
      }))}
      editHref={(id) => (
        <Link
          to="/admin/figures/$id"
          params={{ id }}
          className="h-9 px-3 leading-9 rounded-[8px] text-sm bg-surface hover:bg-accent-warm"
        >
          {tt("تعديل", "Edit")}
        </Link>
      )}
    />
  );
}
