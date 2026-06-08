import { Link } from "@tanstack/react-router";
import type { City } from "@/data/content";
import { useLanguage } from "@/lib/i18n";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const { t, pick, lang } = useLanguage();
  const name = pick(city, "name");
  const shortDesc = pick(city, "shortDesc");
  const date = pick(city, "date");
  const align = lang === "ar" ? "text-right" : "text-left";

  return (
    <article className="flex flex-col">
      <Link
        to="/cities/$id"
        params={{ id: city.id }}
        className={`group block ${align}`}
        aria-label={name}
      >
        <img
          src={city.image}
          alt={name}
          loading="lazy"
          className="w-full h-[196px] object-cover rounded-[24px] bg-placeholder transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <div className="mt-4">
          <h3 className="text-lg font-bold text-text-primary group-hover:underline">{name}</h3>
          <p className="mt-1 text-sm text-text-secondary line-clamp-2 leading-6">
            {shortDesc}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
            <span className="text-text-primary">{t("section_read_more")}</span>
            <div className="flex items-center gap-2">
              <span>{date}</span>
              <span className="inline-flex items-center gap-1 h-7 px-3 rounded-md bg-surface">
                {t("section_share")} <span aria-hidden>↗</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
