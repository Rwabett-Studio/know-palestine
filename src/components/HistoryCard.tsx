import { Link } from "@tanstack/react-router";
import { type HistoryEvent } from "@/data/content";
import { useLanguage } from "@/lib/i18n";

export function HistoryCard({ event }: { event: HistoryEvent }) {
  const { lang, pick } = useLanguage();
  const title = pick(event, "title");
  const description = pick(event, "description");
  const date = pick(event, "eventDate");
  const align = lang === "ar" ? "text-right" : "text-left";

  return (
    <Link
      to="/history/$id"
      params={{ id: event.id }}
      className="flex flex-col group"
    >
      <img
        src={event.image}
        alt={title}
        loading="lazy"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
        className="w-full h-[202px] object-cover rounded-[24px] bg-placeholder group-hover:opacity-90 transition-opacity"
      />
      <div className={`mt-4 ${align}`}>
        <div className="flex items-center text-xs text-text-secondary mb-2">
          <span>{date}</span>
        </div>
        <h3 className="text-base font-bold text-text-primary group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-6">
          {description}
        </p>
      </div>
    </Link>
  );
}
