import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { FIGURES, FIELD_LABEL, FIELD_LABEL_EN } from "@/data/content";
import { FigureCard } from "@/components/FigureCard";
import { useArticles, useCities, useFigures } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";
import { personJsonLd, hreflangLinks, canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/figures/$id")({
  head: ({ params }) => {
    const f = FIGURES.find((x) => x.id === params.id);
    const title = f ? `${f.name} — إعرف فلسطين` : "شخصية";
    const url = canonicalUrl(`/figures/${params.id}`);
    const enUrl = canonicalUrl(`/en/figures/${params.id}`);
    const bioShort = f?.bio ? f.bio.slice(0, 160) : "";
    const jsonLd = f
      ? personJsonLd({
          name: f.name,
          description: bioShort,
          image: f.portrait ?? "",
          birthYear: f.birthYear,
          deathYear: f.deathYear,
          url,
        })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: bioShort },
        { property: "og:title", content: title },
        { property: "og:description", content: bioShort },
        { property: "og:image", content: f?.portrait ?? "" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: bioShort },
        { name: "twitter:image", content: f?.portrait ?? "" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(url, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: FigureDetail,
  notFoundComponent: () => <FigureNotFound />,
});

export function FigureNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("not_found_figure")}</h1>
    </div>
  );
}

export function FigureDetail() {
  const { id } = Route.useParams();
  const { t, pick, lang } = useLanguage();
  const { data: figures = [], isLoading } = useFigures();
  const { data: cities = [] } = useCities();
  const { data: articles = [] } = useArticles();
  const figure = figures.find((f) => f.id === id);
  if (isLoading) {
    return <p className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-text-secondary text-sm">{t("loading")}</p>;
  }
  if (!figure) throw notFound();
  const city = figure.birthCity ? cities.find((c) => c.id === figure.birthCity) : null;
  const related = figures.filter((f) => f.id !== figure.id && f.field === figure.field).slice(0, 4);
  const relatedArticles = articles.slice(0, 3);
  const align = lang === "ar" ? "text-right" : "text-left";
  const fieldLabel = lang === "en" ? FIELD_LABEL_EN[figure.field] : FIELD_LABEL[figure.field];
  const name = pick(figure, "name");
  const bio = pick(figure, "bio");
  const cityName = city ? pick(city, "name") : "";

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <article className="grid md:grid-cols-[280px_1fr] gap-10 items-start mb-16">
        <img
          src={figure.portrait}
          alt={name}
          className="w-full max-w-[280px] aspect-square rounded-[24px] object-cover bg-placeholder mx-auto"
        />
        <div className={align}>
          <span className="inline-flex h-8 items-center px-3 rounded-lg bg-surface text-xs">
            {fieldLabel}
          </span>
          <h1 className="mt-3 text-4xl font-bold text-text-primary">{name}</h1>
          {lang === "ar" && figure.nameEn && (
            <p className="text-sm text-text-secondary mt-1">{figure.nameEn}</p>
          )}
          {lang === "en" && (
            <p className="text-sm text-text-secondary mt-1">{figure.name}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-secondary">
            <span>{t("figure_birth")}: {figure.birthYear ?? "—"}</span>
            {figure.deathYear && <span>· {t("figure_death")}: {figure.deathYear}</span>}
            {city && (
              <span>
                · {t("figure_city")}:{" "}
                <Link to="/cities/$id" params={{ id: city.id }} className="underline">
                  {cityName}
                </Link>
              </span>
            )}
          </div>
          <p className="mt-6 text-base text-text-primary leading-9">{bio}</p>
        </div>
      </article>

      <hr className="border-border my-12" />

      <section className="mb-16">
        <h2 className={`text-2xl font-bold text-text-primary ${align} mb-6`}>
          {t("section_related_figures")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[29px] gap-y-10">
          {related.map((f) => <FigureCard key={f.id} figure={f} />)}
        </div>
      </section>

      <section>
        <h2 className={`text-2xl font-bold text-text-primary ${align} mb-6`}>
          {t("section_related_articles")}
        </h2>
        <div className="grid md:grid-cols-3 gap-[29px]">
          {relatedArticles.map((a) => (
            <Link key={a.id} to="/articles/$id" params={{ id: a.id }} className="block group">
              <img
                src={a.image}
                alt={pick(a, "title")}
                className="w-full h-[200px] object-cover rounded-[24px] bg-placeholder"
              />
              <h3 className={`mt-3 text-base font-bold text-text-primary group-hover:underline ${align}`}>
                {pick(a, "title")}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
