import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { HISTORY_EVENTS } from "@/data/content";
import { useCities, useHistory } from "@/lib/queries";
import { historicalEventJsonLd, hreflangLinks, canonicalUrl } from "@/lib/seo";
import { useLanguage, pickArray } from "@/lib/i18n";

export const Route = createFileRoute("/history/$id")({
  head: ({ params }) => {
    const e = HISTORY_EVENTS.find((x) => x.id === params.id);
    const title = e ? `${e.title} — إعرف فلسطين` : "حدث تاريخي";
    const url = canonicalUrl(`/history/${params.id}`);
    const enUrl = canonicalUrl(`/en/history/${params.id}`);
    const descShort = e?.description ? e.description.slice(0, 160) : "";
    const jsonLd = e
      ? historicalEventJsonLd({
          name: e.title,
          description: descShort,
          image: e.image ?? "",
          startDate: e.isoDate ?? "",
          url,
        })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: descShort },
        { property: "og:title", content: title },
        { property: "og:description", content: descShort },
        { property: "og:image", content: e?.image ?? "" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: descShort },
        { name: "twitter:image", content: e?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(url, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: HistoryDetail,
  notFoundComponent: () => <HistoryNotFound />,
});

export function HistoryNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("not_found_history")}</h1>
    </div>
  );
}

export function HistoryDetail() {
  const { id } = Route.useParams();
  const { t, pick, lang } = useLanguage();
  const { data: events = [], isLoading } = useHistory();
  const { data: cities = [] } = useCities();
  const ev = events.find((x) => x.id === id);
  if (isLoading) {
    return <p className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-text-secondary text-sm">{t("loading")}</p>;
  }
  if (!ev) throw notFound();
  const city = ev.relatedCity ? cities.find((c) => c.id === ev.relatedCity) : null;
  const related = events.filter((x) => x.id !== ev.id).slice(0, 3);
  const align = lang === "ar" ? "text-right" : "text-left";
  const sources = pickArray(ev, "sources", lang);

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <article className={`${align} max-w-4xl mb-16`}>
        <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
          <time>{pick(ev, "eventDate")}</time>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-6">{pick(ev, "title")}</h1>
        <img
          src={ev.image}
          alt={pick(ev, "title")}
          className="w-full h-[420px] object-cover rounded-[44px] bg-placeholder mb-8"
        />
        <p className="text-base text-text-primary leading-9">{pick(ev, "description")}</p>

        {city && (
          <p className="mt-6 text-sm text-text-secondary">
            {t("history_related_city")}:{" "}
            <Link to="/cities/$id" params={{ id: city.id }} className="underline">
              {pick(city, "name")}
            </Link>
          </p>
        )}

        {sources.length > 0 && (
          <div className="mt-8 p-6 rounded-[20px] bg-surface/60">
            <h3 className="font-bold mb-2">{t("history_sources")}</h3>
            <ul className="list-disc ps-5 text-sm text-text-secondary space-y-1">
              {sources.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </article>

      <hr className="border-border my-12" />

      <section>
        <h2 className={`text-2xl font-bold text-text-primary ${align} mb-6`}>
          {t("section_related_events")}
        </h2>
        <div className="grid md:grid-cols-3 gap-[29px]">
          {related.map((r) => (
            <Link key={r.id} to="/history/$id" params={{ id: r.id }} className="block group">
              <img
                src={r.image}
                alt={pick(r, "title")}
                className="w-full h-[200px] object-cover rounded-[24px] bg-placeholder"
              />
              <div className={`mt-3 ${align}`}>
                <time className="text-xs text-text-secondary">{pick(r, "eventDate")}</time>
                <h3 className="mt-1 text-base font-bold text-text-primary group-hover:underline">
                  {pick(r, "title")}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
