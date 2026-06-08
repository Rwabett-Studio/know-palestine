import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { CitiesPage } from "../cities.index";

export const Route = createFileRoute("/en/cities/")({
  head: () => {
    const arUrl = canonicalUrl("/cities/");
    const enUrl = canonicalUrl("/en/cities/");
    return {
      meta: [
        { title: "Palestinian Cities — Know Palestine" },
        { name: "description", content: "Discover the most prominent Palestinian cities and their history." },
        { property: "og:title", content: "Palestinian Cities — Know Palestine" },
        { property: "og:description", content: "Discover the most prominent Palestinian cities and their history." },
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
  component: CitiesPage,
});
