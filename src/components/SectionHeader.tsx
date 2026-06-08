import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";

type SeeAllPath = "/" | "/articles" | "/cities" | "/figures" | "/history" | "/about";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  seeAllHref?: SeeAllPath;
  seeAllLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel,
}: SectionHeaderProps) {
  const { t, lang } = useLanguage();
  const label = seeAllLabel ?? t("section_more");
  return (
    <div className="flex items-start justify-between mb-10">
      <div className={lang === "ar" ? "text-right" : "text-left"}>
        <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm text-text-secondary max-w-md">{subtitle}</p>
        )}
      </div>
      {seeAllHref ? (
        <Link
          to={seeAllHref}
          className="inline-flex items-center justify-center h-[40px] px-5 rounded-[10px] bg-surface text-text-primary text-sm hover:bg-accent-warm transition-colors"
        >
          {label}
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
