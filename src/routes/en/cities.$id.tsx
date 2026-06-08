import { createFileRoute } from "@tanstack/react-router";
import { CITIES } from "@/data/content";
import { placeJsonLd, hreflangLinks, canonicalUrl, truncate } from "@/lib/seo";
import { CityDetail, CityNotFound } from "../cities.$id";

export const Route = createFileRoute("/en/cities/$id")({
  head: ({ params }) => {
    const city = CITIES.find((c) => c.id === params.id);
    const enUrl = canonicalUrl(`/en/cities/${params.id}`);
    const arUrl = canonicalUrl(`/cities/${params.id}`);
    const title = city
      ? `${city.nameEn ?? city.name} — Know Palestine`
      : "City — Know Palestine";
    const desc = truncate(city?.shortDescEn ?? city?.shortDesc ?? "");
    const jsonLd = city
      ? placeJsonLd({ name: city.nameEn ?? city.name, description: desc, image: city.image ?? "", url: enUrl })
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: city?.image ?? "" },
        { property: "og:url", content: enUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: city?.image ?? "" },
      ],
      links: [
        { rel: "canonical", href: enUrl },
        ...hreflangLinks(arUrl, enUrl),
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: jsonLd }] : [],
    };
  },
  component: CityDetail,
  notFoundComponent: CityNotFound,
});
