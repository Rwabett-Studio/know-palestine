import { createFileRoute } from "@tanstack/react-router";
import { ARTICLES } from "@/data/content";
import { articleJsonLd, hreflangLinks, canonicalUrl, truncate } from "@/lib/seo";
import { ArticleDetail, ArticleNotFound } from "../articles.$id";

export const Route = createFileRoute("/en/articles/$id")({
  head: ({ params }) => {
    const article = ARTICLES.find((a) => a.id === params.id);
    const enUrl = canonicalUrl(`/en/articles/${params.id}`);
    const arUrl = canonicalUrl(`/articles/${params.id}`);
    const title = article
      ? `${article.titleEn ?? article.title} — Know Palestine`
      : "Article — Know Palestine";
    const desc = truncate(article?.excerptEn ?? article?.excerpt ?? "");
    const jsonLd = article
      ? articleJsonLd({ title: article.titleEn ?? article.title, description: desc, image: article.image ?? "", datePublished: article.date ?? "", author: article.authorEn ?? article.author, url: enUrl, lang: "en" })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: article?.image ?? "" },
        { property: "og:url", content: enUrl },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: article?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: ArticleDetail,
  notFoundComponent: ArticleNotFound,
});
