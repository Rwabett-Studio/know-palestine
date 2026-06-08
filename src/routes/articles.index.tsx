import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { INTRO_BLOCK } from "@/data/content";
import { useArticles, useSettings, settingValue } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "المقالات — إعرف فلسطين" },
      { name: "description", content: "اقرأ آخر المقالات عن فلسطين وأحداثها." },
      { property: "og:title", content: "مقالات فلسطين — Articles" },
      { property: "og:description", content: "Latest articles about Palestine and its events." },
    ],
  }),
  component: ArticlesPage,
});

export function ArticlesPage() {
  const { t, pick, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";
  const { data: articles = [] } = useArticles();
  const { data: settings } = useSettings();
  const introTitle = settingValue(settings, "intro_block_title", lang,
    lang === "ar" ? INTRO_BLOCK.title : INTRO_BLOCK.titleEn);
  const introPara = settingValue(settings, "intro_block_paragraph", lang,
    lang === "ar" ? INTRO_BLOCK.paragraph : INTRO_BLOCK.paragraphEn);
  const introImage = settingValue(settings, "intro_block_image", lang, INTRO_BLOCK.image);
  const dreams = articles.filter((a) => a.category === "dreams");
  const aqsa = articles.filter((a) => a.category === "alaqsa");
  const investigations = articles.filter((a) => a.category === "investigation");
  const reports = articles.filter((a) => a.category === "report");

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12">
      <h1 className={`text-3xl md:text-4xl font-bold text-text-primary ${align} mb-12`}>
        {t("page_articles")}
      </h1>

      <section className="mb-16 grid md:grid-cols-[1fr_280px] gap-12 items-start">
        <div className={align}>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {introTitle}
          </h2>
          <p className="text-sm text-text-secondary leading-8">
            {introPara}{" "}
            <Link to="/articles" className="text-text-primary underline">
              {t("section_read_more")}
            </Link>
          </p>
        </div>
        <img
          src={introImage}
          alt={introTitle}
          loading="lazy"
          className="w-[280px] h-[280px] object-cover rounded-[24px] bg-placeholder"
        />
      </section>

      <section className="mb-12">
        <SectionHeader title={t("cat_dreams")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
          {dreams.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
        <Pagination total={3} active={0} />
      </section>

      <hr className="border-border my-12" />

      <section className="mb-12">
        <SectionHeader title={t("cat_alaqsa")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
          {aqsa.map((a) => (
            <ArticleCard key={a.id} article={a} imageHeight={240} />
          ))}
        </div>
        <Pagination total={3} active={0} />
      </section>

      {investigations.length > 0 && (
        <>
          <hr className="border-border my-12" />
          <section className="mb-12">
            <SectionHeader title={t("cat_investigation")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
              {investigations.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        </>
      )}

      {reports.length > 0 && (
        <>
          <hr className="border-border my-12" />
          <section className="mb-12">
            <SectionHeader title={t("cat_report")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
              {reports.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
