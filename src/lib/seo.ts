/**
 * SEO helpers for structured data (JSON-LD) and canonical URLs.
 *
 * Set VITE_SITE_URL=https://knowpalestine.com in .env (no trailing slash)
 * to enable absolute canonical/OG URLs.
 */

export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// ── JSON-LD builders ────────────────────────────────────────────────

/** Article (news or editorial) structured data */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  author?: string;
  url: string;
  lang?: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [opts.image] : undefined,
    datePublished: opts.datePublished,
    author: {
      "@type": "Organization",
      name: opts.author ?? "إعرف فلسطين — Know Palestine",
    },
    publisher: {
      "@type": "Organization",
      name: "إعرف فلسطين — Know Palestine",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    url: opts.url,
    inLanguage: opts.lang ?? "ar",
    isAccessibleForFree: true,
  });
}

/** Person structured data */
export function personJsonLd(opts: {
  name: string;
  description: string;
  image: string;
  birthYear?: number;
  deathYear?: number;
  birthCity?: string;
  url: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    description: opts.description,
    image: opts.image || undefined,
    birthDate: opts.birthYear ? String(opts.birthYear) : undefined,
    deathDate: opts.deathYear ? String(opts.deathYear) : undefined,
    birthPlace: opts.birthCity
      ? { "@type": "Place", name: opts.birthCity }
      : undefined,
    url: opts.url,
    nationality: {
      "@type": "Country",
      name: "Palestine",
    },
  });
}

/** City / Place structured data */
export function placeJsonLd(opts: {
  name: string;
  description: string;
  image: string;
  url: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "City",
    name: opts.name,
    description: opts.description,
    image: opts.image || undefined,
    url: opts.url,
    containedInPlace: {
      "@type": "Country",
      name: "Palestine",
      sameAs: "https://www.wikidata.org/wiki/Q23792",
    },
  });
}

/** Historical Event structured data */
export function historicalEventJsonLd(opts: {
  name: string;
  description: string;
  image: string;
  startDate: string;
  url: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    description: opts.description,
    image: opts.image || undefined,
    startDate: opts.startDate || undefined,
    url: opts.url,
    location: {
      "@type": "Place",
      name: "Palestine",
    },
    organizer: {
      "@type": "Organization",
      name: "إعرف فلسطين — Know Palestine",
    },
  });
}

// ---------------------------------------------------------------------------
// hreflang link tags
// Generates the three alternate links required for proper multilingual SEO.
// Arabic is the canonical default (x-default).
// ---------------------------------------------------------------------------
export function hreflangLinks(
  arUrl: string,
  enUrl: string,
): { rel: string; hreflang: string; href: string }[] {
  return [
    { rel: "alternate", hreflang: "ar", href: arUrl },
    { rel: "alternate", hreflang: "en", href: enUrl },
    { rel: "alternate", hreflang: "x-default", href: arUrl },
  ];
}

// ---------------------------------------------------------------------------
// Truncate helper
// ---------------------------------------------------------------------------
export function truncate(text: string, max = 155): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).replace(/\s\S*$/, "") + "…";
}

/** Organization / website structured data (for root) */
export function websiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "إعرف فلسطين — Know Palestine",
    alternateName: "Know Palestine",
    url: SITE_URL || "https://knowpalestine.com",
    description:
      "منصة رقمية متخصصة في توثيق فلسطين — مدنها، تاريخها، شخصياتها، وأحداثها.",
    inLanguage: ["ar", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}
