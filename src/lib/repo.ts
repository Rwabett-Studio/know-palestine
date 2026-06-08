import { supabase } from "./supabase";
import type {
  City,
  Article,
  Figure,
  HistoryEvent,
  SiteSetting,
  SiteSettingsMap,
  CityRegion,
  CityStatus,
  PublishStatus,
  FigureField,
  EventType,
} from "@/data/content";

// Maps snake_case Supabase rows <-> camelCase domain objects used by the UI.
// Public pages and the admin panel both go through this layer.

// ── helpers ──────────────────────────────────────────────────────────────────

function fail(msg: string, e: { message: string } | null): void {
  if (e) throw new Error(`${msg}: ${e.message}`);
}

function publishStatus(r: Record<string, unknown>): PublishStatus {
  const v = r.publish_status as string | undefined;
  if (v === "draft" || v === "archived") return v;
  return "published";
}

// ---------- cities ----------
function rowToCity(r: Record<string, unknown>): City {
  return {
    id: r.id as string,
    name: r.name as string,
    nameEn: (r.name_en as string) ?? undefined,
    region: r.region as CityRegion,
    status: r.status as CityStatus,
    publishStatus: publishStatus(r),
    foundedYear: (r.founded_year as string) ?? undefined,
    foundedYearEn: (r.founded_year_en as string) ?? undefined,
    populationBefore1948: (r.population_before_1948 as string) ?? undefined,
    shortDesc: (r.short_desc as string) ?? "",
    shortDescEn: (r.short_desc_en as string) ?? undefined,
    description: (r.description as string) ?? "",
    descriptionEn: (r.description_en as string) ?? undefined,
    geography: (r.geography as string) ?? "",
    geographyEn: (r.geography_en as string) ?? undefined,
    history: (r.history as string) ?? "",
    historyEn: (r.history_en as string) ?? undefined,
    natives: (r.natives as string) ?? "",
    nativesEn: (r.natives_en as string) ?? undefined,
    highlights: (r.highlights as string[]) ?? [],
    highlightsEn: (r.highlights_en as string[]) ?? undefined,
    naming: (r.naming as string) ?? "",
    namingEn: (r.naming_en as string) ?? undefined,
    zionistName: (r.zionist_name as string) ?? "",
    zionistNameEn: (r.zionist_name_en as string) ?? undefined,
    brief: (r.brief as string) ?? "",
    briefEn: (r.brief_en as string) ?? undefined,
    image: (r.image as string) ?? "",
    gallery: (r.gallery as string[]) ?? undefined,
    date: (r.date as string) ?? "",
    dateEn: (r.date_en as string) ?? undefined,
  };
}

function cityToRow(c: City) {
  return {
    id: c.id,
    name: c.name,
    name_en: c.nameEn ?? null,
    region: c.region,
    status: c.status,
    publish_status: c.publishStatus ?? "published",
    founded_year: c.foundedYear ?? null,
    founded_year_en: c.foundedYearEn ?? null,
    population_before_1948: c.populationBefore1948 ?? null,
    short_desc: c.shortDesc ?? "",
    short_desc_en: c.shortDescEn ?? null,
    description: c.description ?? "",
    description_en: c.descriptionEn ?? null,
    geography: c.geography ?? "",
    geography_en: c.geographyEn ?? null,
    history: c.history ?? "",
    history_en: c.historyEn ?? null,
    natives: c.natives ?? "",
    natives_en: c.nativesEn ?? null,
    highlights: c.highlights ?? [],
    highlights_en: c.highlightsEn ?? [],
    naming: c.naming ?? "",
    naming_en: c.namingEn ?? null,
    zionist_name: c.zionistName ?? "",
    zionist_name_en: c.zionistNameEn ?? null,
    brief: c.brief ?? "",
    brief_en: c.briefEn ?? null,
    image: c.image ?? "",
    gallery: c.gallery ?? [],
    date: c.date ?? "",
    date_en: c.dateEn ?? null,
  };
}

// ---------- articles ----------
function rowToArticle(r: Record<string, unknown>): Article {
  return {
    id: r.id as string,
    title: r.title as string,
    titleEn: (r.title_en as string) ?? undefined,
    publishStatus: publishStatus(r),
    excerpt: (r.excerpt as string) ?? "",
    excerptEn: (r.excerpt_en as string) ?? undefined,
    date: (r.date as string) ?? "",
    dateEn: (r.date_en as string) ?? undefined,
    image: (r.image as string) ?? "",
    category: r.category as Article["category"],
    author: (r.author as string) ?? undefined,
    authorEn: (r.author_en as string) ?? undefined,
    readingTime: (r.reading_time as number) ?? undefined,
    body: (r.body as Article["body"]) ?? [],
    bodyEn: (r.body_en as Article["bodyEn"]) ?? undefined,
  };
}

function articleToRow(a: Article) {
  return {
    id: a.id,
    title: a.title,
    title_en: a.titleEn ?? null,
    publish_status: a.publishStatus ?? "published",
    excerpt: a.excerpt ?? "",
    excerpt_en: a.excerptEn ?? null,
    date: a.date ?? "",
    date_en: a.dateEn ?? null,
    image: a.image ?? "",
    category: a.category,
    author: a.author ?? null,
    author_en: a.authorEn ?? null,
    reading_time: a.readingTime ?? null,
    body: a.body ?? [],
    body_en: a.bodyEn ?? [],
  };
}

// ---------- figures ----------
function rowToFigure(r: Record<string, unknown>): Figure {
  return {
    id: r.id as string,
    name: r.name as string,
    nameEn: (r.name_en as string) ?? undefined,
    publishStatus: publishStatus(r),
    birthYear: (r.birth_year as number) ?? undefined,
    deathYear: (r.death_year as number) ?? undefined,
    birthCity: (r.birth_city as string) ?? undefined,
    field: r.field as FigureField,
    bio: (r.bio as string) ?? "",
    bioEn: (r.bio_en as string) ?? undefined,
    portrait: (r.portrait as string) ?? "",
  };
}

function figureToRow(f: Figure) {
  return {
    id: f.id,
    name: f.name,
    name_en: f.nameEn ?? null,
    publish_status: f.publishStatus ?? "published",
    birth_year: f.birthYear ?? null,
    death_year: f.deathYear ?? null,
    birth_city: f.birthCity ?? null,
    field: f.field,
    bio: f.bio ?? "",
    bio_en: f.bioEn ?? null,
    portrait: f.portrait ?? "",
  };
}

// ---------- history ----------
function rowToHistory(r: Record<string, unknown>): HistoryEvent {
  return {
    id: r.id as string,
    title: r.title as string,
    titleEn: (r.title_en as string) ?? undefined,
    publishStatus: publishStatus(r),
    eventDate: (r.event_date as string) ?? "",
    eventDateEn: (r.event_date_en as string) ?? undefined,
    isoDate: (r.iso_date as string) ?? "",
    eventType: r.event_type as EventType,
    description: (r.description as string) ?? "",
    descriptionEn: (r.description_en as string) ?? undefined,
    image: (r.image as string) ?? "",
    relatedCity: (r.related_city as string) ?? undefined,
    sources: (r.sources as string[]) ?? undefined,
    sourcesEn: (r.sources_en as string[]) ?? undefined,
  };
}

function historyToRow(h: HistoryEvent) {
  return {
    id: h.id,
    title: h.title,
    title_en: h.titleEn ?? null,
    publish_status: h.publishStatus ?? "published",
    event_date: h.eventDate ?? "",
    event_date_en: h.eventDateEn ?? null,
    iso_date: h.isoDate || null,
    event_type: h.eventType,
    description: h.description ?? "",
    description_en: h.descriptionEn ?? null,
    image: h.image ?? "",
    related_city: h.relatedCity ?? null,
    sources: h.sources ?? [],
    sources_en: h.sourcesEn ?? [],
  };
}

// ---------- site settings ----------
function rowToSetting(r: Record<string, unknown>): SiteSetting {
  return {
    key: r.key as string,
    valueAr: (r.value_ar as string) ?? "",
    valueEn: (r.value_en as string) ?? "",
  };
}

// ---------- public API ----------
export const repo = {
  // ── Site settings ────────────────────────────────────────────────────────
  settings: {
    /** Load all settings as a key → {ar, en} map (graceful: returns {} if table missing). */
    async getAll(): Promise<SiteSettingsMap> {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) return {};
        return Object.fromEntries(
          (data ?? []).map((r) => {
            const s = rowToSetting(r as Record<string, unknown>);
            return [s.key, { ar: s.valueAr, en: s.valueEn }];
          }),
        );
      } catch {
        return {};
      }
    },

    /** Upsert a single setting. */
    async upsert(key: string, valueAr: string, valueEn: string): Promise<void> {
      const { error } = await supabase.from("site_settings").upsert({
        key,
        value_ar: valueAr,
        value_en: valueEn,
        updated_at: new Date().toISOString(),
      });
      fail("save setting", error);
    },

    /** Upsert many settings at once. */
    async upsertMany(settings: SiteSetting[]): Promise<void> {
      if (settings.length === 0) return;
      const { error } = await supabase.from("site_settings").upsert(
        settings.map((s) => ({
          key: s.key,
          value_ar: s.valueAr,
          value_en: s.valueEn,
          updated_at: new Date().toISOString(),
        })),
      );
      fail("save settings", error);
    },
  },

  // ── Cities ───────────────────────────────────────────────────────────────
  cities: {
    /** Public: only published cities. */
    async list(): Promise<City[]> {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("publish_status", "published")
        .order("sort_order", { ascending: true });
      fail("load cities", error);
      return (data ?? []).map(rowToCity);
    },
    /** Admin: all cities including draft/archived. */
    async listAll(): Promise<City[]> {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("sort_order", { ascending: true });
      fail("load cities", error);
      return (data ?? []).map(rowToCity);
    },
    async get(id: string): Promise<City | null> {
      const { data, error } = await supabase.from("cities").select("*").eq("id", id).maybeSingle();
      fail("load city", error);
      return data ? rowToCity(data) : null;
    },
    async upsert(c: City): Promise<void> {
      const { error } = await supabase.from("cities").upsert(cityToRow(c));
      fail("save city", error);
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      fail("delete city", error);
    },
    async archive(id: string): Promise<void> {
      const { error } = await supabase.from("cities").update({ publish_status: "archived" }).eq("id", id);
      fail("archive city", error);
    },
    async restore(id: string): Promise<void> {
      const { error } = await supabase.from("cities").update({ publish_status: "published" }).eq("id", id);
      fail("restore city", error);
    },
  },

  // ── Articles ─────────────────────────────────────────────────────────────
  articles: {
    /** Public: only published articles. */
    async list(): Promise<Article[]> {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("publish_status", "published")
        .order("sort_order", { ascending: true });
      fail("load articles", error);
      return (data ?? []).map(rowToArticle);
    },
    /** Admin: all articles including draft/archived. */
    async listAll(): Promise<Article[]> {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("sort_order", { ascending: true });
      fail("load articles", error);
      return (data ?? []).map(rowToArticle);
    },
    async get(id: string): Promise<Article | null> {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      fail("load article", error);
      return data ? rowToArticle(data) : null;
    },
    async upsert(a: Article): Promise<void> {
      const { error } = await supabase.from("articles").upsert(articleToRow(a));
      fail("save article", error);
    },
    async upsertMany(items: Article[]): Promise<void> {
      if (items.length === 0) return;
      const { error } = await supabase.from("articles").upsert(items.map(articleToRow));
      fail("import articles", error);
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      fail("delete article", error);
    },
    async archive(id: string): Promise<void> {
      const { error } = await supabase.from("articles").update({ publish_status: "archived" }).eq("id", id);
      fail("archive article", error);
    },
    async restore(id: string): Promise<void> {
      const { error } = await supabase.from("articles").update({ publish_status: "published" }).eq("id", id);
      fail("restore article", error);
    },
  },

  // ── Figures ───────────────────────────────────────────────────────────────
  figures: {
    /** Public: only published figures. */
    async list(): Promise<Figure[]> {
      const { data, error } = await supabase
        .from("figures")
        .select("*")
        .eq("publish_status", "published")
        .order("sort_order", { ascending: true });
      fail("load figures", error);
      return (data ?? []).map(rowToFigure);
    },
    /** Admin: all figures including draft/archived. */
    async listAll(): Promise<Figure[]> {
      const { data, error } = await supabase
        .from("figures")
        .select("*")
        .order("sort_order", { ascending: true });
      fail("load figures", error);
      return (data ?? []).map(rowToFigure);
    },
    async get(id: string): Promise<Figure | null> {
      const { data, error } = await supabase.from("figures").select("*").eq("id", id).maybeSingle();
      fail("load figure", error);
      return data ? rowToFigure(data) : null;
    },
    async upsert(f: Figure): Promise<void> {
      const { error } = await supabase.from("figures").upsert(figureToRow(f));
      fail("save figure", error);
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from("figures").delete().eq("id", id);
      fail("delete figure", error);
    },
    async archive(id: string): Promise<void> {
      const { error } = await supabase.from("figures").update({ publish_status: "archived" }).eq("id", id);
      fail("archive figure", error);
    },
    async restore(id: string): Promise<void> {
      const { error } = await supabase.from("figures").update({ publish_status: "published" }).eq("id", id);
      fail("restore figure", error);
    },
  },

  // ── History events ────────────────────────────────────────────────────────
  history: {
    /** Public: only published events. */
    async list(): Promise<HistoryEvent[]> {
      const { data, error } = await supabase
        .from("history_events")
        .select("*")
        .eq("publish_status", "published")
        .order("iso_date", { ascending: true });
      fail("load history", error);
      return (data ?? []).map(rowToHistory);
    },
    /** Admin: all events including draft/archived. */
    async listAll(): Promise<HistoryEvent[]> {
      const { data, error } = await supabase
        .from("history_events")
        .select("*")
        .order("iso_date", { ascending: true });
      fail("load history", error);
      return (data ?? []).map(rowToHistory);
    },
    async get(id: string): Promise<HistoryEvent | null> {
      const { data, error } = await supabase
        .from("history_events")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      fail("load event", error);
      return data ? rowToHistory(data) : null;
    },
    async upsert(h: HistoryEvent): Promise<void> {
      const { error } = await supabase.from("history_events").upsert(historyToRow(h));
      fail("save event", error);
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from("history_events").delete().eq("id", id);
      fail("delete event", error);
    },
    async archive(id: string): Promise<void> {
      const { error } = await supabase.from("history_events").update({ publish_status: "archived" }).eq("id", id);
      fail("archive event", error);
    },
    async restore(id: string): Promise<void> {
      const { error } = await supabase.from("history_events").update({ publish_status: "published" }).eq("id", id);
      fail("restore event", error);
    },
  },
};
