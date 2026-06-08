import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import type { SearchResult } from "@/data/content";
import { useArticles, useCities, useFigures, useHistory } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "البحث — Search — إعرف فلسطين" },
      { name: "description", content: "ابحث في المدن والمقالات والشخصيات والأحداث." },
    ],
  }),
  component: SearchPage,
});

export function SearchPage() {
  const { q = "" } = Route.useSearch();
  const { t, pick, lang } = useLanguage();
  const { data: cities = [] } = useCities();
  const { data: articles = [] } = useArticles();
  const { data: figures = [] } = useFigures();
  const { data: history = [] } = useHistory();
  const align = lang === "ar" ? "text-right" : "text-left";

  const needle = q.trim().toLowerCase();
  const has = (...vals: (string | undefined)[]) =>
    vals.some((v) => v?.toLowerCase().includes(needle));
  const results: SearchResult[] = !needle
    ? []
    : [
        ...cities
          .filter((c) => has(c.name, c.nameEn, c.shortDesc, c.shortDescEn))
          .map((item) => ({ kind: "city" as const, item })),
        ...articles
          .filter((a) => has(a.title, a.titleEn, a.excerpt, a.excerptEn))
          .map((item) => ({ kind: "article" as const, item })),
        ...figures
          .filter((f) => has(f.name, f.nameEn, f.bio, f.bioEn))
          .map((item) => ({ kind: "figure" as const, item })),
        ...history
          .filter((h) => has(h.title, h.titleEn, h.description, h.descriptionEn))
          .map((item) => ({ kind: "history" as const, item })),
      ];

  const kindLabel = (kind: string) => {
    switch (kind) {
      case "city":
        return t("kind_city");
      case "article":
        return t("kind_article");
      case "figure":
        return t("kind_figure");
      default:
        return t("kind_history");
    }
  };

  const linkFor = (r: SearchResult) => {
    if (r.kind === "city")
      return {
        to: "/cities/$id" as const,
        params: { id: r.item.id },
        title: pick(r.item, "name"),
        desc: pick(r.item, "shortDesc"),
        image: r.item.image,
      };
    if (r.kind === "article")
      return {
        to: "/articles/$id" as const,
        params: { id: r.item.id },
        title: pick(r.item, "title"),
        desc: pick(r.item, "excerpt"),
        image: r.item.image,
      };
    if (r.kind === "figure")
      return {
        to: "/figures/$id" as const,
        params: { id: r.item.id },
        title: pick(r.item, "name"),
        desc: pick(r.item, "bio"),
        image: r.item.portrait,
      };
    return {
      to: "/history/$id" as const,
      params: { id: r.item.id },
      title: pick(r.item, "title"),
      desc: pick(r.item, "description"),
      image: r.item.image,
    };
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12">
      <h1 className={`text-3xl font-bold text-text-primary ${align}`}>{t("search_title")}</h1>
      <p className={`mt-2 text-text-secondary ${align}`}>
        {q ? (
          <>
            {t("search_for")}{" "}
            <span className="font-semibold text-text-primary">"{q}"</span> ·{" "}
            {results.length} {t("search_count")}
          </>
        ) : (
          t("search_empty")
        )}
      </p>

      <div className="mt-10 space-y-6">
        {results.map((r, i) => {
          const l = linkFor(r);
          return (
            <Link
              key={i}
              to={l.to}
              params={l.params}
              className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-5 items-start p-4 rounded-[20px] hover:bg-surface/50 transition-colors"
            >
              <img
                src={l.image}
                alt={l.title}
                className="w-full h-[120px] md:h-[140px] object-cover rounded-[16px] bg-placeholder"
              />
              <div className={align}>
                <span className="inline-flex h-7 items-center px-3 rounded-md bg-surface text-xs text-text-primary">
                  {kindLabel(r.kind)}
                </span>
                <h3 className="mt-2 text-lg font-bold text-text-primary">{l.title}</h3>
                <p className="mt-1 text-sm text-text-secondary line-clamp-2 leading-7">{l.desc}</p>
              </div>
            </Link>
          );
        })}
        {q && results.length === 0 && (
          <p className="text-center text-text-secondary py-12">{t("search_no_results")}</p>
        )}
      </div>
    </div>
  );
}
