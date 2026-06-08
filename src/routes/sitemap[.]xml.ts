import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://knowpalestine.com").replace(/\/$/, "");

/** Minimum rows we need for the sitemap */
interface Row { id: string }

function urlEntry(
  arLoc: string,
  enLoc: string,
  changefreq: string,
  priority: string,
) {
  return `
  <url>
    <loc>${arLoc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar-PS" href="${arLoc}"/>
    <xhtml:link rel="alternate" hreflang="en"    href="${enLoc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arLoc}"/>
  </url>`;
}

async function buildSitemap(): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

  // Static pages
  const staticPages: Array<[string, string, string, string]> = [
    ["/",        "/en",        "daily",   "1.0"],
    ["/articles","/en/articles","daily",  "0.9"],
    ["/cities",  "/en/cities", "weekly",  "0.8"],
    ["/figures", "/en/figures","weekly",  "0.8"],
    ["/history", "/en/history","weekly",  "0.8"],
    ["/about",   "/en/about",  "monthly", "0.5"],
  ];

  let dynamicEntries = "";

  if (supabaseUrl && supabaseKey) {
    try {
      const sb = createClient(supabaseUrl, supabaseKey);
      const [articles, cities, figures, history] = await Promise.all([
        sb.from("articles").select("id").order("id"),
        sb.from("cities").select("id").order("id"),
        sb.from("figures").select("id").order("id"),
        sb.from("history_events").select("id").order("id"),
      ]);

      for (const row of (articles.data ?? []) as Row[]) {
        dynamicEntries += urlEntry(
          `${SITE_URL}/articles/${row.id}`,
          `${SITE_URL}/en/articles/${row.id}`,
          "weekly", "0.7",
        );
      }
      for (const row of (cities.data ?? []) as Row[]) {
        dynamicEntries += urlEntry(
          `${SITE_URL}/cities/${row.id}`,
          `${SITE_URL}/en/cities/${row.id}`,
          "monthly", "0.7",
        );
      }
      for (const row of (figures.data ?? []) as Row[]) {
        dynamicEntries += urlEntry(
          `${SITE_URL}/figures/${row.id}`,
          `${SITE_URL}/en/figures/${row.id}`,
          "monthly", "0.6",
        );
      }
      for (const row of (history.data ?? []) as Row[]) {
        dynamicEntries += urlEntry(
          `${SITE_URL}/history/${row.id}`,
          `${SITE_URL}/en/history/${row.id}`,
          "monthly", "0.6",
        );
      }
    } catch {
      // Fall through — return sitemap with static pages only
    }
  }

  const staticEntries = staticPages
    .map(([ar, en, freq, pri]) =>
      urlEntry(`${SITE_URL}${ar}`, `${SITE_URL}${en}`, freq, pri),
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${staticEntries}${dynamicEntries}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = await buildSitemap();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
