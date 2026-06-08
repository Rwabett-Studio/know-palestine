import type { Article, City, Figure, HistoryEvent } from "@/data/content";

// Hands a partially-filled record to a "new" editor without bloating the URL.
// The Suggested Topics page writes a payload to sessionStorage, then navigates
// to /admin/<type>/new; the editor consumes it once on mount and clears it.

type PrefillMap = {
  article: Partial<Article>;
  city: Partial<City>;
  figure: Partial<Figure>;
  history: Partial<HistoryEvent>;
};

const storageKey = (t: keyof PrefillMap) => `kp_prefill_${t}`;

export function setPrefill<T extends keyof PrefillMap>(type: T, data: PrefillMap[T]) {
  try {
    sessionStorage.setItem(storageKey(type), JSON.stringify(data));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Reads and removes the stored payload so it only applies once.
export function consumePrefill<T extends keyof PrefillMap>(type: T): PrefillMap[T] | null {
  try {
    const raw = sessionStorage.getItem(storageKey(type));
    if (!raw) return null;
    sessionStorage.removeItem(storageKey(type));
    return JSON.parse(raw) as PrefillMap[T];
  } catch {
    return null;
  }
}
