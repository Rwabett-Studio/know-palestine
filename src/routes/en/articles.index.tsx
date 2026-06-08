import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { ArticlesPage } from "../articles.index";

export const Route = createFileRoute("/en/articles/")({
  head: () => {
    const arUrl = canonicalUrl("/articles/");
    const enUrl = canonicalUrl("/en/articles/");
    return {
      meta: [
        { title: "Articles — Know Palestine" },
        { name: "description", content: "Read the latest articles about Palestine and its events." },
        { property: "og:title", content: "Articles — Know Palestine" },
        { property: "og:description", content: "Read the latest articles about Palestine and its events." },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
    };
  },
  component: ArticlesPage,
});
