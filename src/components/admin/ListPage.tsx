import type { ReactNode } from "react";

export interface ListRow {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export function ListPage({
  title,
  newHref,
  rows,
  loading,
  error,
  editHref,
  tt,
  dir,
}: {
  title: string;
  newHref: ReactNode;
  rows: ListRow[];
  loading: boolean;
  error: string | null;
  editHref: (id: string) => ReactNode;
  tt: (ar: string, en: string) => string;
  dir: "rtl" | "ltr";
}) {
  return (
    <div dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {newHref}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3 mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>
      ) : rows.length === 0 ? (
        <p className="text-text-secondary text-sm">{tt("لا توجد عناصر بعد.", "No items yet.")}</p>
      ) : (
        <ul className="divide-y divide-border rounded-[16px] border border-border overflow-hidden">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-3 hover:bg-surface/50">
              {r.image ? (
                <img
                  src={r.image}
                  alt=""
                  className="w-14 h-14 rounded-[10px] object-cover bg-placeholder shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-[10px] bg-placeholder shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{r.title}</p>
                {r.subtitle && (
                  <p className="text-xs text-text-secondary truncate">{r.subtitle}</p>
                )}
              </div>
              {editHref(r.id)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
