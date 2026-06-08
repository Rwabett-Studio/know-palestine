import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { AboutPage } from "../about";

export const Route = createFileRoute("/en/about")({
  head: () => {
    const arUrl = canonicalUrl("/about");
    const enUrl = canonicalUrl("/en/about");
    return {
      meta: [
        { title: "About us — Know Palestine" },
        { name: "description", content: "An independent digital platform documenting Palestine with rigorous journalistic standards." },
        { property: "og:title", content: "About — Know Palestine" },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
    };
  },
  component: AboutPage,
});
