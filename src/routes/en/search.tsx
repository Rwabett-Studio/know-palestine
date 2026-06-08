import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { SearchPage } from "../search";

export const Route = createFileRoute("/en/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: String(s.q ?? "") }),
  head: () => {
    const arUrl = canonicalUrl("/search");
    const enUrl = canonicalUrl("/en/search");
    return {
      meta: [
        { title: "Search — Know Palestine" },
        { property: "og:locale", content: "en_US" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
    };
  },
  component: SearchPage,
});
