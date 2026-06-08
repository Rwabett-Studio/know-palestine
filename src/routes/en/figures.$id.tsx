import { createFileRoute } from "@tanstack/react-router";
import { FIGURES } from "@/data/content";
import { personJsonLd, hreflangLinks, canonicalUrl, truncate } from "@/lib/seo";
import { FigureDetail, FigureNotFound } from "../figures.$id";

export const Route = createFileRoute("/en/figures/$id")({
  head: ({ params }) => {
    const f = FIGURES.find((x) => x.id === params.id);
    const enUrl = canonicalUrl(`/en/figures/${params.id}`);
    const arUrl = canonicalUrl(`/figures/${params.id}`);
    const title = f ? `${f.nameEn ?? f.name} — Know Palestine` : "Figure — Know Palestine";
    const desc = truncate(f?.bioEn ?? f?.bio ?? "");
    const jsonLd = f
      ? personJsonLd({ name: f.nameEn ?? f.name, description: desc, image: f.portrait ?? "", birthYear: f.birthYear, deathYear: f.deathYear, url: enUrl })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: f?.portrait ?? "" },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: f?.portrait ?? "" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: FigureDetail,
  notFoundComponent: FigureNotFound,
});
