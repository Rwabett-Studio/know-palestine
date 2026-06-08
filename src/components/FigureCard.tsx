import { Link } from "@tanstack/react-router";
import { FIELD_LABEL, FIELD_LABEL_EN, type Figure } from "@/data/content";
import { useLanguage } from "@/lib/i18n";

export function FigureCard({ figure }: { figure: Figure }) {
  const { lang, pick, t } = useLanguage();
  const name = pick(figure, "name");
  const fieldLabel =
    lang === "en" ? FIELD_LABEL_EN[figure.field] : FIELD_LABEL[figure.field];
  const present = lang === "en" ? "present" : "الآن";
  const years = `${figure.birthYear ?? "—"} – ${figure.deathYear ?? present}`;
  return (
    <Link
      to="/figures/$id"
      params={{ id: figure.id }}
      className="flex flex-col items-center text-center group"
      aria-label={name}
    >
      <div className="w-32 h-32 rounded-full overflow-hidden bg-placeholder">
        <img
          src={figure.portrait}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <h3 className="mt-4 text-base font-bold text-text-primary group-hover:underline">
        {name}
      </h3>
      <p className="mt-1 text-xs text-text-secondary">{fieldLabel}</p>
      <p className="text-xs text-muted">{years}</p>
    </Link>
  );
}
