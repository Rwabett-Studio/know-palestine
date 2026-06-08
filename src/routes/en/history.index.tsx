import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks, canonicalUrl } from "@/lib/seo";
import { HistoryPage } from "../history.index";

export const Route = createFileRoute("/en/history/")({
  head: () => {
    const arUrl = canonicalUrl("/history/");
    const enUrl = canonicalUrl("/en/history/");
    return {
      meta: [
        { title: "History & Memory — Know Palestine" },
        { name: "description", content: "Defining historical milestones that shaped the Palestinian conscience." },
        { property: "og:title", content: "History & Memory — Know Palestine" },
        { property: "og:description", content: "Major events in Palestinian history." },
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
  component: HistoryPage,
});
