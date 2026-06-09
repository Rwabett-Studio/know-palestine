import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { CityCard } from "@/components/CityCard";
import { FigureCard } from "@/components/FigureCard";
import { HOME_HERO } from "@/data/content";
import { useArticles, useCities, useFigures, useHistory, useSettings, settingValue } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "إعرف فلسطين — Know Palestine" },
      { name: "description", content: "منصة رقمية لتوثيق فلسطين: مدنها وتاريخها وشخصياتها." },
      { property: "og:title", content: "إعرف فلسطين — Know Palestine" },
      { property: "og:description", content: "Explore Palestinian cities, history, and figures." },
    ],
  }),
  component: Home,
});

export function Home() {
  const { t, pick, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";

  const { data: settings } = useSettings();
  const heroTitle = settingValue(settings, "home_hero_title", lang,
    lang === "ar" ? HOME_HERO.title : HOME_HERO.titleEn);
  const heroDesc = settingValue(settings, "home_hero_description", lang,
    lang === "ar" ? HOME_HERO.description : HOME_HERO.descriptionEn);

  const { data: articles = [] } = useArticles();
  const { data: cities = [] } = useCities();
  const { data: figures = [] } = useFigures();
  const { data: history = [] } = useHistory();

  const latest = articles.slice(0, 6);
  const featuredCities = cities.slice(0, 4);
  const longFeatured = articles[1] ?? articles[0];
  const topFigures = figures.slice(0, 4);
  const recentHistory = [...history]
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-10">
      {/* Hero section */}
      <section className="mb-16">
        <div className="rounded-[44px] bg-surface px-8 md:px-16 py-20 md:py-28 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary leading-snug max-w-4xl">
            {heroTitle}
          </h1>
          <p className="mt-8 text-sm md:text-base text-text-secondary leading-8 max-w-3xl">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* Latest articles */}
      <section className="mb-20">
        <SectionHeader title={t("home_latest")} seeAllHref="/articles" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
          {latest.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>

      <hr className="border-border my-12" />

      {/* Cities */}
      <section className="mb-20">
        <SectionHeader
          title={t("home_cities")}
          subtitle={t("home_cities_sub")}
          seeAllHref="/cities"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-[29px] gap-y-12">
          {featuredCities.map((c) => <CityCard key={c.id} city={c} />)}
        </div>
      </section>

      <hr className="border-border my-12" />

      {/* Full-width featured */}
      {longFeatured && (
      <section className="mb-20">
        <Link
          to="/articles/$id"
          params={{ id: longFeatured.id }}
          className="grid md:grid-cols-2 gap-8 items-stretch group"
        >
          <img
            src={longFeatured.image}
            alt={pick(longFeatured, "title")}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
            className="w-full h-[420px] object-cover rounded-[32px] bg-placeholder"
          />
          <div className={`${align} flex flex-col justify-center`}>
            <span className={`inline-flex w-fit ${lang === "ar" ? "ms-auto" : "me-auto"} h-7 items-center px-3 rounded-md bg-surface text-xs text-text-primary mb-4`}>
              {t("section_investigation")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-snug group-hover:underline">
              {pick(longFeatured, "title")}
            </h2>
            <p className="mt-4 text-text-secondary leading-8">{pick(longFeatured, "excerpt")}</p>
            <div className="mt-6 text-xs text-text-secondary flex items-center gap-3">
              <span>{longFeatured.readingTime} {t("section_min_read")}</span>
              <span>·</span>
              <span>{pick(longFeatured, "date")}</span>
            </div>
          </div>
        </Link>
      </section>
      )}

      <hr className="border-border my-12" />

      {/* Figures */}
      <section className="mb-20">
        <SectionHeader title={t("home_figures")} seeAllHref="/figures" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[29px] gap-y-12">
          {topFigures.map((f) => <FigureCard key={f.id} figure={f} />)}
        </div>
      </section>

      <hr className="border-border my-12" />

      {/* History list */}
      <section className="mb-12">
        <SectionHeader title={t("home_history")} seeAllHref="/history" />
        <ol className="divide-y divide-border">
          {recentHistory.map((ev) => (
            <li key={ev.id}>
              <Link
                to="/history/$id"
                params={{ id: ev.id }}
                className="flex items-center justify-between gap-4 py-5 hover:bg-surface/40 px-4 -mx-4 rounded-[16px] transition-colors"
              >
                <img
                  src={ev.image}
                  alt={pick(ev, "title")}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
                  className="w-16 h-16 object-cover rounded-xl bg-placeholder shrink-0"
                />
                <div className={`flex-1 ${align}`}>
                  <h3 className="text-base font-bold text-text-primary">{pick(ev, "title")}</h3>
                  <time className="text-xs text-text-secondary">{pick(ev, "eventDate")}</time>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
