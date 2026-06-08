import { createFileRoute, Link } from "@tanstack/react-router";
import { useHistory } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "تاريخ وذاكرة — إعرف فلسطين" },
      { name: "description", content: "أرشيف الأحداث التاريخية الفلسطينية." },
      { property: "og:title", content: "تاريخ فلسطين — Palestinian History" },
      { property: "og:description", content: "Major events in Palestinian history." },
    ],
  }),
  component: HistoryPage,
});

export function HistoryPage() {
  const { t, pick, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";
  const { data: events = [] } = useHistory();
  const sorted = [...events].sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12">
      <header className={`${align} mb-12`}>
        <h1 className="text-4xl font-bold text-text-primary">{t("page_history")}</h1>
        <p className="mt-3 text-text-secondary max-w-2xl">{t("page_history_sub")}</p>
      </header>

      <ol className={`relative ${lang === "ar" ? "border-s ps-8" : "border-s ps-8"} border-border space-y-12`}>
        {sorted.map((ev) => (
          <li key={ev.id} className="relative">
            <span className="absolute -start-[34px] top-2 w-3 h-3 rounded-full bg-text-primary ring-4 ring-background" />
            <Link
              to="/history/$id"
              params={{ id: ev.id }}
              className="grid md:grid-cols-[320px_1fr] gap-6 items-start group"
            >
              <img
                src={ev.image}
                alt={pick(ev, "title")}
                loading="lazy"
                className="w-full h-[200px] object-cover rounded-[20px] bg-placeholder"
              />
              <div className={align}>
                <div className="flex items-center gap-3 text-xs text-text-secondary mb-2">
                  <time>{pick(ev, "eventDate")}</time>
                </div>
                <h2 className="text-xl font-bold text-text-primary group-hover:underline">
                  {pick(ev, "title")}
                </h2>
                <p className="mt-2 text-sm text-text-secondary leading-7 line-clamp-3">
                  {pick(ev, "description")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
