import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { FiguresPage } from "../figures.index";

export const Route = createFileRoute("/en/figures/")({
  head: () => {
    const arUrl = canonicalUrl("/figures/");
    const enUrl = canonicalUrl("/en/figures/");
    return {
      meta: [
        { title: "Figures & Icons — Know Palestine" },
        { name: "description", content: "Palestinian figures who left their mark in politics, literature, arts, sciences, and resistance." },
        { property: "og:title", content: "Figures & Icons — Know Palestine" },
        { property: "og:description", content: "Palestinian figures who left their mark across history." },
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
  component: FiguresPage,
});
