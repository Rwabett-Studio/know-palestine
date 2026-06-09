import { createFileRoute, notFound } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { CityCard } from "@/components/CityCard";
import {
  CITIES,
  REGION_LABEL,
  REGION_LABEL_EN,
  STATUS_LABEL,
  STATUS_LABEL_EN,
} from "@/data/content";
import { useCities } from "@/lib/queries";
import { useLanguage, pickArray } from "@/lib/i18n";
import { placeJsonLd, hreflangLinks, canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/cities/$id")({
  head: ({ params }) => {
    const city = CITIES.find((c) => c.id === params.id);
    const title = city ? `${city.name} — إعرف فلسطين` : "تفاصيل المدينة";
    const url = canonicalUrl(`/cities/${params.id}`);
    const enUrl = canonicalUrl(`/en/cities/${params.id}`);
    const jsonLd = city
      ? placeJsonLd({
          name: city.name,
          description: city.shortDesc ?? "",
          image: city.image ?? "",
          url,
        })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: city?.shortDesc ?? "تفاصيل المدينة الفلسطينية" },
        { property: "og:title", content: title },
        { property: "og:description", content: city?.shortDesc ?? "" },
        { property: "og:image", content: city?.image ?? "" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: city?.shortDesc ?? "" },
        { name: "twitter:image", content: city?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(url, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: CityDetail,
  notFoundComponent: () => <CityNotFound />,
});

export function CityNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("not_found_city")}</h1>
    </div>
  );
}

function Section({
  heading,
  children,
  align,
}: {
  heading: string;
  children: React.ReactNode;
  align: string;
}) {
  return (
    <section className={`mb-8 ${align}`}>
      <h2 className="text-lg font-bold text-text-primary mb-2">{heading}</h2>
      <div className="text-sm text-text-secondary leading-8">{children}</div>
    </section>
  );
}

export function CityDetail() {
  const { id } = Route.useParams();
  const { t, pick, lang } = useLanguage();
  const { data: cities = [], isLoading } = useCities();
  const city = cities.find((c) => c.id === id);
  if (isLoading) {
    return <p className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-text-secondary text-sm">{t("loading")}</p>;
  }
  if (!city) throw notFound();

  const related = cities.filter((c) => c.id !== city.id).slice(0, 4);
  const name = pick(city, "name");
  const align = lang === "ar" ? "text-right" : "text-left";
  const ps = lang === "ar" ? "ps-6" : "ps-6";
  const region =
    lang === "en" ? REGION_LABEL_EN[city.region] : REGION_LABEL[city.region];
  const status =
    lang === "en" ? STATUS_LABEL_EN[city.status] : STATUS_LABEL[city.status];
  const highlights = pickArray(city, "highlights", lang);

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className={`mb-8 ${align}`}>
        <p className="mb-3 text-sm text-text-secondary">
          {region} · {status}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
          {name}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-text-secondary leading-8">
          {pick(city, "shortDesc")}
        </p>
      </header>

      <img
        src={city.image}
        alt={name}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
        className="w-full h-[360px] object-cover rounded-[24px] bg-placeholder mb-10"
      />

      <Section heading={t("city_description")} align={align}>{pick(city, "description")}</Section>
      <Section heading={t("city_geography")} align={align}>{pick(city, "geography")}</Section>
      <Section heading={t("city_history")} align={align}>{pick(city, "history")}</Section>
      <Section heading={`${t("city_natives_prefix")}${name}`} align={align}>
        {pick(city, "natives")}
      </Section>

      <section className={`mb-8 ${align}`}>
        <h2 className="text-lg font-bold text-text-primary mb-2">
          {t("city_highlights_prefix")}
          {name}
        </h2>
        <ul className={`list-disc ${ps} space-y-1 text-sm text-text-secondary leading-8`}>
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      <Section heading={t("city_naming")} align={align}>{pick(city, "naming")}</Section>
      <Section heading={t("city_zionist")} align={align}>{pick(city, "zionistName")}</Section>

      <section className={`mb-8 ${align} rounded-[16px] bg-surface/60 p-5`}>
        <h2 className="text-base font-bold text-text-primary mb-2">{t("city_brief")}</h2>
        <ul className={`list-disc ${ps} text-sm text-text-secondary leading-8`}>
          <li>{pick(city, "brief")}</li>
        </ul>
      </section>

      <hr className="border-border my-10" />

      <p className={`text-sm text-text-secondary ${align} mb-3`}>
        {t("section_related_topics")}
      </p>
      <SectionHeader
        title={t("cities_section_title")}
        subtitle={t("cities_section_sub")}
        seeAllHref="/cities"
      />
      <div className="grid grid-cols-2 gap-x-[29px] gap-y-10">
        {related.map((c) => (
          <CityCard key={c.id} city={c} />
        ))}
      </div>
    </div>
  );
}
