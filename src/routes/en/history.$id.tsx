import { createFileRoute } from "@tanstack/react-router";
import { HISTORY_EVENTS } from "@/data/content";
import { historicalEventJsonLd, hreflangLinks, canonicalUrl, truncate } from "@/lib/seo";
import { HistoryDetail, HistoryNotFound } from "../history.$id";

export const Route = createFileRoute("/en/history/$id")({
  head: ({ params }) => {
    const e = HISTORY_EVENTS.find((x) => x.id === params.id);
    const enUrl = canonicalUrl(`/en/history/${params.id}`);
    const arUrl = canonicalUrl(`/history/${params.id}`);
    const title = e ? `${e.titleEn ?? e.title} — Know Palestine` : "Event — Know Palestine";
    const desc = truncate(e?.descriptionEn ?? e?.description ?? "");
    const jsonLd = e
      ? historicalEventJsonLd({ name: e.titleEn ?? e.title, description: desc, image: e.image ?? "", startDate: e.isoDate ?? "", url: enUrl })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: e?.image ?? "" },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: e?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: HistoryDetail,
  notFoundComponent: HistoryNotFound,
});
