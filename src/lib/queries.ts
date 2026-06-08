import { useQuery, useQueryClient } from "@tanstack/react-query";
import { repo } from "./repo";
import type { SiteSettingsMap } from "@/data/content";

const STALE = 5 * 60 * 1000; // 5 min

// ── Public queries (published content only) ──────────────────────────────────

export const useCities = () =>
  useQuery({ queryKey: ["cities"], queryFn: () => repo.cities.list(), staleTime: STALE });
export const useCity = (id: string) =>
  useQuery({ queryKey: ["city", id], queryFn: () => repo.cities.get(id), staleTime: STALE });

export const useArticles = () =>
  useQuery({ queryKey: ["articles"], queryFn: () => repo.articles.list(), staleTime: STALE });
export const useArticle = (id: string) =>
  useQuery({ queryKey: ["article", id], queryFn: () => repo.articles.get(id), staleTime: STALE });

export const useFigures = () =>
  useQuery({ queryKey: ["figures"], queryFn: () => repo.figures.list(), staleTime: STALE });
export const useFigure = (id: string) =>
  useQuery({ queryKey: ["figure", id], queryFn: () => repo.figures.get(id), staleTime: STALE });

export const useHistory = () =>
  useQuery({ queryKey: ["history"], queryFn: () => repo.history.list(), staleTime: STALE });
export const useHistoryEvent = (id: string) =>
  useQuery({ queryKey: ["history", id], queryFn: () => repo.history.get(id), staleTime: STALE });

// ── Admin queries (all content including draft/archived) ─────────────────────

export const useAllCities = () =>
  useQuery({ queryKey: ["admin", "cities"], queryFn: () => repo.cities.listAll(), staleTime: STALE });

export const useAllArticles = () =>
  useQuery({ queryKey: ["admin", "articles"], queryFn: () => repo.articles.listAll(), staleTime: STALE });

export const useAllFigures = () =>
  useQuery({ queryKey: ["admin", "figures"], queryFn: () => repo.figures.listAll(), staleTime: STALE });

export const useAllHistory = () =>
  useQuery({ queryKey: ["admin", "history"], queryFn: () => repo.history.listAll(), staleTime: STALE });

// ── Site settings ─────────────────────────────────────────────────────────────

const SETTINGS_STALE = 10 * 60 * 1000; // 10 min

/**
 * Returns all site settings as a key → { ar, en } map.
 * Gracefully returns {} if the table doesn't exist yet (pre-migration).
 */
export const useSettings = () =>
  useQuery<SiteSettingsMap>({
    queryKey: ["settings"],
    queryFn: () => repo.settings.getAll(),
    staleTime: SETTINGS_STALE,
    retry: false,
  });

/** Convenience: pick the correct language value from the settings map. */
export function settingValue(
  map: SiteSettingsMap | undefined,
  key: string,
  lang: "ar" | "en",
  fallback = "",
): string {
  if (!map) return fallback;
  const entry = map[key];
  if (!entry) return fallback;
  const v = lang === "en" ? entry.en : entry.ar;
  return v || fallback;
}
