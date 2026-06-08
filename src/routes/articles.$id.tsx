import { createFileRoute, notFound } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/data/content";
import { useArticles } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";
import { articleJsonLd, hreflangLinks, canonicalUrl, truncate } from "@/lib/seo";

export const Route = createFileRoute("/articles/$id")({
  head: ({ params }) => {
    const article = ARTICLES.find((a) => a.id === params.id);
    const title = article ? `${article.title} — إعرف فلسطين` : "تفاصيل المقال";
    const url = canonicalUrl(`/articles/${params.id}`);
    const enUrl = canonicalUrl(`/en/articles/${params.id}`);
    const desc = truncate(article?.excerpt ?? "تفاصيل المقال");
    const jsonLd = article
      ? articleJsonLd({
          title: article.title,
          description: article.excerpt ?? "",
          image: article.image ?? "",
          datePublished: article.date ?? "",
          author: article.author,
          url,
        })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: article?.excerpt ?? "تفاصيل المقال" },
        { property: "og:title", content: title },
        { property: "og:description", content: article?.excerpt ?? "" },
        { property: "og:image", content: article?.image ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: article?.excerpt ?? "" },
        { name: "twitter:image", content: article?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(url, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: ArticleDetail,
  notFoundComponent: () => <ArticleNotFound />,
});

export function ArticleNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("not_found_article")}</h1>
    </div>
  );
}

export function ArticleDetail() {
  const { id } = Route.useParams();
  const { t, pick, lang } = useLanguage();
  const { data: articles = [], isLoading } = useArticles();
  const article = articles.find((a) => a.id === id);
  if (isLoading) {
    return <p className="mx-auto max-w-[1100px] px-6 md:px-12 py-16 text-text-secondary text-sm">{t("loading")}</p>;
  }
  if (!article) throw notFound();

  const related = articles.filter(
    (a) => a.id !== article.id && a.category === article.category,
  ).slice(0, 2);

  const title = pick(article, "title");
  const excerpt = pick(article, "excerpt");
  const date = pick(article, "date");
  const align = lang === "ar" ? "text-right" : "text-left";

  const body =
    lang === "en" && article.bodyEn && article.bodyEn.length > 0
      ? article.bodyEn
      : article.body;

  const CATEGORY_LABEL: Record<string, string> = {
    dreams: t("cat_dreams"),
    alaqsa: t("cat_alaqsa"),
    investigation: t("cat_investigation"),
    report: t("cat_report"),
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 md:px-12 py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className={`mb-6 ${align}`}>
        <p className="mb-3 text-sm text-text-secondary">
          {date} · {article.readingTime ?? 5} {t("section_min_read")}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-text-secondary leading-8">{excerpt}</p>
      </header>

      <article className={align}>
        {body.map((block, i) => (
          <div key={i} className="mb-6">
            {block.heading && (
              <h2 className="text-lg font-bold text-text-primary mb-3">{block.heading}</h2>
            )}
            <p className="text-sm text-text-secondary leading-8">{block.paragraph}</p>
          </div>
        ))}
      </article>

      <hr className="border-border my-16" />

      <section>
        <p className={`text-sm text-text-secondary ${align} mb-3`}>
          {t("section_related_topics")}
        </p>
        <SectionHeader
          title={CATEGORY_LABEL[article.category] ?? t("section_related_articles")}
          seeAllHref="/articles"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[29px]">
          {related.map((a) => (
            <ArticleCard key={a.id} article={a} imageHeight={240} />
          ))}
        </div>
      </section>
    </div>
  );
}
