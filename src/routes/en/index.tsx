import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl, websiteJsonLd } from "@/lib/seo";
import { Home } from "../index";

export const Route = createFileRoute("/en/")({
  head: () => {
    const arUrl = canonicalUrl("/");
    const enUrl = canonicalUrl("/en/");
    return {
      meta: [
        { title: "Know Palestine — Documenting Palestinian cities, history & figures" },
        { name: "description", content: "A digital platform dedicated to documenting Palestine — its cities, history, figures, and events." },
        { property: "og:title", content: "Know Palestine" },
        { property: "og:description", content: "Discover Palestinian cities, history, and iconic figures." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Know Palestine" },
        { name: "twitter:description", content: "Discover Palestinian cities, history, and iconic figures." },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
      scripts: [{ type: "application/ld+json", children: websiteJsonLd() }],
    };
  },
  component: Home,
});
